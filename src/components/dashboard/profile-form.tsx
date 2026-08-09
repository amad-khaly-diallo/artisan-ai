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

/**
 * Les champs sont contrôlés : après un enregistrement, updateProfile appelle
 * revalidatePath('/profile'), le composant serveur se re-rend et renvoie un
 * nouveau `profile`. Avec des champs non contrôlés, ce changement de
 * defaultValue sur des champs déjà montés déclenche un avertissement Base UI.
 */
export function ProfileForm({ profile, readOnly = false }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState({
    full_name: profile.full_name ?? '',
    business_name: profile.business_name ?? '',
    phone: profile.phone ?? '',
    whatsapp_number: profile.whatsapp_number ?? '',
    bio: profile.bio ?? '',
    services: profile.services?.join(', ') ?? '',
  })

  function handleChange(
    field: keyof typeof values
  ): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> {
    return (e) => setValues((prev) => ({ ...prev, [field]: e.target.value }))
  }

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={readOnly} className="space-y-6 disabled:opacity-60">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nom complet</Label>
            <Input
              id="full_name"
              name="full_name"
              value={values.full_name}
              onChange={handleChange('full_name')}
              placeholder="Jean Dupont"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_name">Nom de l&apos;entreprise</Label>
            <Input
              id="business_name"
              name="business_name"
              value={values.business_name}
              onChange={handleChange('business_name')}
              placeholder="Plomberie Dupont"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={handleChange('phone')}
              placeholder="+33 6 00 00 00 00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">Numéro WhatsApp</Label>
            <Input
              id="whatsapp_number"
              name="whatsapp_number"
              type="tel"
              value={values.whatsapp_number}
              onChange={handleChange('whatsapp_number')}
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
            value={values.bio}
            onChange={handleChange('bio')}
            placeholder="Je suis plombier chauffagiste avec 10 ans d'expérience..."
            rows={4}
          />
          <p className="text-xs text-gray-400">
            L&apos;IA utilisera cette description pour répondre à vos clients
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="services">Services proposés</Label>
          <Input
            id="services"
            name="services"
            value={values.services}
            onChange={handleChange('services')}
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
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
