'use client'

import { useState } from 'react'
import { updateProfile } from '@/lib/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'
import type { Profile } from '@/types/database'

interface ProfileFormProps {
  profile: Profile
  readOnly?: boolean
}

export function ProfileForm({ profile, readOnly = false }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const result = await updateProfile(new FormData(e.currentTarget))
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Profil mis à jour')
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-disabled={readOnly || undefined}
    >
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-60">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nom complet</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile.full_name ?? ''}
            placeholder="Jean Dupont"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_name">Nom de l'entreprise</Label>
          <Input
            id="business_name"
            name="business_name"
            defaultValue={profile.business_name ?? ''}
            placeholder="Plomberie Dupont"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={profile.phone ?? ''}
            placeholder="+33 6 00 00 00 00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp_number">Numéro WhatsApp</Label>
          <Input
            id="whatsapp_number"
            name="whatsapp_number"
            type="tel"
            defaultValue={profile.whatsapp_number ?? ''}
            placeholder="+33 6 00 00 00 00"
          />
          <p className="text-xs text-gray-400">
            Ce numéro recevra les messages clients via WhatsApp
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Description de votre activité</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio ?? ''}
          placeholder="Je suis plombier chauffagiste avec 10 ans d'expérience..."
          rows={4}
        />
        <p className="text-xs text-gray-400">
          L'IA utilisera cette description pour répondre à vos clients
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="services">Services proposés</Label>
        <Input
          id="services"
          name="services"
          defaultValue={profile.services?.join(', ') ?? ''}
          placeholder="Plomberie, Chauffage, Dépannage urgent"
        />
        <p className="text-xs text-gray-400">
          Séparez les services par des virgules
        </p>
      </div>

      <Button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Enregistrer les modifications
      </Button>
      </fieldset>

      {readOnly && (
        <p className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <Lock className="h-4 w-4 shrink-0" />
          Le profil du compte de démonstration est en lecture seule.
        </p>
      )}
    </form>
  )
}
