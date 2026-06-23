import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'
import type { PlanKey } from '@/lib/stripe'

// Extraire le current_period_end depuis le premier item de la subscription (Stripe v22)
function getPeriodEnd(sub: Stripe.Subscription): string | null {
  const item = sub.items.data[0]
  if (!item?.current_period_end) return null
  return new Date(item.current_period_end * 1000).toISOString()
}

// Extraire l'ID de subscription depuis une Invoice v22 (via parent.subscription_details)
function getSubIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription
  if (!sub) return null
  return typeof sub === 'string' ? sub : sub.id
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) return new NextResponse('Missing signature', { status: 400 })

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new NextResponse('Webhook signature invalide', { status: 400 })
  }

  const admin = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const userId = session.metadata?.supabase_user_id
      const plan   = session.metadata?.plan as PlanKey | undefined

      if (!userId || !plan) break

      const subId = typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id

      if (!subId) break

      const stripeSubscription = await getStripe().subscriptions.retrieve(subId, {
        expand: ['items'],
      })

      await admin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: typeof session.customer === 'string'
          ? session.customer
          : session.customer?.id ?? null,
        stripe_subscription_id: stripeSubscription.id,
        plan,
        status: stripeSubscription.status as 'active' | 'trialing',
        current_period_end: getPeriodEnd(stripeSubscription),
      }, { onConflict: 'user_id' })

      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription

      const { data } = await admin
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', sub.id)
        .single()

      if (!data) break

      await admin.from('subscriptions').update({
        status: sub.status as 'active' | 'canceled' | 'past_due' | 'trialing',
        current_period_end: getPeriodEnd(sub),
      }).eq('user_id', data.user_id)

      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription

      await admin.from('subscriptions').update({
        status: 'canceled',
        stripe_subscription_id: null,
      }).eq('stripe_subscription_id', sub.id)

      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subId = getSubIdFromInvoice(invoice)
      if (!subId) break

      await admin.from('subscriptions').update({ status: 'past_due' })
        .eq('stripe_subscription_id', subId)

      break
    }
  }

  return new NextResponse(null, { status: 200 })
}
