import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BillingClient } from '@/components/dashboard/billing-client'
import { CheckCircle2, XCircle } from 'lucide-react'

interface Props {
  searchParams: Promise<{ success?: string; canceled?: string }>
}

export default async function BillingPage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const params = await searchParams

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Abonnement</h1>
        <p className="text-gray-500 mt-1">Gérez votre plan et vos paiements</p>
      </div>

      {/* Bandeau succès / annulation */}
      {params.success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-700 font-medium">
            Abonnement activé avec succès. Bienvenue sur ArtisanAI !
          </p>
        </div>
      )}
      {params.canceled && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-600">Paiement annulé. Vous pouvez réessayer à tout moment.</p>
        </div>
      )}

      <BillingClient subscription={subscription} />
    </div>
  )
}
