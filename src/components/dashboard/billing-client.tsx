'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, ExternalLink, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLANS, type PlanKey } from '@/lib/plans'
import type { Subscription } from '@/types/database'

interface BillingClientProps {
  subscription: Subscription | null
  readOnly?: boolean
}

export function BillingClient({ subscription, readOnly = false }: BillingClientProps) {
  const [loading, setLoading] = useState<PlanKey | 'portal' | null>(null)

  async function handleCheckout(plan: PlanKey) {
    setLoading(plan)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error ?? 'Erreur lors du paiement')
        setLoading(null)
      }
    } catch {
      toast.error('Erreur réseau')
      setLoading(null)
    }
  }

  async function handlePortal() {
    setLoading('portal')
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error ?? 'Erreur portail')
        setLoading(null)
      }
    } catch {
      toast.error('Erreur réseau')
      setLoading(null)
    }
  }

  const currentPlan = subscription?.plan
  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'

  return (
    <div className="space-y-8">
      {readOnly && (
        <p className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <Lock className="h-4 w-4 shrink-0" />
          Mode démonstration : l&apos;abonnement ne peut pas être modifié.
        </p>
      )}

      {/* Plan actuel */}
      {subscription && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-indigo-600 font-medium">Plan actuel</p>
            <p className="text-xl font-bold text-indigo-900 mt-0.5">
              {PLANS[subscription.plan].name} - {PLANS[subscription.plan].price}/mois
            </p>
            {subscription.current_period_end && (
              <p className="text-xs text-indigo-500 mt-1">
                {isActive ? 'Renouvellement le' : 'Expire le'}{' '}
                {new Date(subscription.current_period_end).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            )}
            <p className={cn(
              'mt-1 text-xs font-medium',
              isActive ? 'text-green-600' : 'text-red-500'
            )}>
              {subscription.status === 'active' && 'Actif'}
              {subscription.status === 'trialing' && 'Période d\'essai'}
              {subscription.status === 'past_due' && 'Paiement en retard'}
              {subscription.status === 'canceled' && 'Annulé'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handlePortal}
            disabled={readOnly || loading !== null}
            className="shrink-0"
          >
            {loading === 'portal'
              ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
              : <ExternalLink className="h-4 w-4 mr-2" />
            }
            Gérer mon abonnement
          </Button>
        </div>
      )}

      {/* Grille des plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, plan]) => {
          const isCurrent = currentPlan === key && isActive
          const isLoadingThis = loading === key

          return (
            <div
              key={key}
              className={cn(
                'relative rounded-xl border p-6 flex flex-col gap-4',
                isCurrent
                  ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                  : 'border-gray-200 bg-white'
              )}
            >
              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                  Plan actuel
                </span>
              )}
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{plan.description}</p>
                <p className="mt-3 text-3xl font-extrabold text-gray-900">
                  {plan.price}<span className="text-base font-normal text-gray-500">/mois</span>
                </p>
              </div>

              <ul className="space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  'w-full',
                  isCurrent
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : ''
                )}
                variant={isCurrent ? 'default' : 'outline'}
                onClick={() => handleCheckout(key)}
                disabled={readOnly || isCurrent || loading !== null}
              >
                {isLoadingThis
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : isCurrent
                    ? 'Plan actuel'
                    : currentPlan ? 'Changer de plan' : 'Choisir ce plan'
                }
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
