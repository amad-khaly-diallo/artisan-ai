import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Wrench } from 'lucide-react'
import { ProfileForm } from '@/components/dashboard/profile-form'
import { isDemoUserId } from '@/lib/demo'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-500 mt-1">
          Ces informations sont utilisées par l'IA pour répondre à vos clients
        </p>
      </div>

      {/* Résumé du profil */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
            <User className="h-7 w-7 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {profile.full_name ?? 'Nom non renseigné'}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {profile.business_name ?? 'Entreprise non renseignée'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
          </div>
          {profile.whatsapp_number ? (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shrink-0">
              WhatsApp configuré
            </Badge>
          ) : (
            <Badge variant="secondary" className="shrink-0">
              WhatsApp non configuré
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Services */}
      {profile.services && profile.services.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Wrench className="h-4 w-4" />
              Services actuels
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex flex-wrap gap-2">
            {profile.services.map((service) => (
              <Badge key={service} variant="secondary">
                {service}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Modifier mes informations</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} readOnly={isDemoUserId(user.id)} />
        </CardContent>
      </Card>
    </div>
  )
}
