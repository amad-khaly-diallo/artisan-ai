import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe, PRICE_IDS } from '@/lib/stripe'
import { PLANS, type PlanKey } from '@/lib/plans'
import { DEMO_BLOCKED_MESSAGE, isDemoUserId } from '@/lib/demo'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  if (isDemoUserId(user.id)) {
    return NextResponse.json({ error: DEMO_BLOCKED_MESSAGE }, { status: 403 })
  }

  const { plan } = await request.json() as { plan: PlanKey }
  if (!PLANS[plan]) return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })

  const admin = createAdminClient()

  // Récupérer ou créer le customer Stripe
  const { data: subscription } = await admin
    .from('subscriptions')
    .select('stripe_customer_id, stripe_subscription_id, status')
    .eq('user_id', user.id)
    .single()

  let customerId = subscription?.stripe_customer_id

  if (!customerId) {
    const { data: profile } = await admin
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    const customer = await getStripe().customers.create({
      email: user.email,
      name: profile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: `${baseUrl}/billing?success=1`,
    cancel_url: `${baseUrl}/billing?canceled=1`,
    // On passe les métadonnées au niveau session pour les récupérer dans le webhook
    metadata: { supabase_user_id: user.id, plan },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: session.url })
}
