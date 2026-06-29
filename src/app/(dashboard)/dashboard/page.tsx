import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Bell, Users, TrendingUp, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('bio, business_name, services')
    .eq('id', user.id)
    .single()

  const profileIncomplete = !profile?.bio || !profile?.business_name

  const [
    { count: openConversations },
    { count: totalConversations },
    { count: unreadNotifications },
    { data: recentConversations },
  ] = await Promise.all([
    supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('artisan_id', user.id)
      .eq('status', 'open'),
    supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('artisan_id', user.id),
    supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('artisan_id', user.id)
      .eq('read', false),
    supabase
      .from('conversations')
      .select('id, client_name, client_phone, status, last_message_at')
      .eq('artisan_id', user.id)
      .order('last_message_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      label: 'Conversations ouvertes',
      value: openConversations ?? 0,
      icon: MessageSquare,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Total conversations',
      value: totalConversations ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Notifications non lues',
      value: unreadNotifications ?? 0,
      icon: Bell,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Taux de réponse IA',
      value: '100%',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {profileIncomplete && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">Profil incomplet</p>
            <p className="text-sm text-amber-700 mt-0.5">
              L'IA ne peut pas répondre correctement sans votre nom d'entreprise et description.{' '}
              <Link href="/profile" className="font-medium underline">Compléter le profil</Link>
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversations récentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Conversations récentes</CardTitle>
          <Link href="/conversations" className="text-sm text-indigo-600 hover:underline">
            Voir tout
          </Link>
        </CardHeader>
        <CardContent>
          {!recentConversations || recentConversations.length === 0 ? (
            <div className="py-12 text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Aucune conversation pour l'instant</p>
              <p className="text-gray-400 text-xs mt-1">Les messages WhatsApp apparaîtront ici</p>
            </div>
          ) : (
            <div className="divide-y">
              {recentConversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/conversations/${conv.id}`}
                  className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {conv.client_name ?? conv.client_phone}
                    </p>
                    <p className="text-xs text-gray-500">{conv.client_phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {conv.last_message_at && (
                      <span className="text-xs text-gray-400">
                        {new Date(conv.last_message_at).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    <Badge variant={conv.status === 'open' ? 'default' : 'secondary'}>
                      {conv.status === 'open' ? 'Ouvert' : 'Fermé'}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
