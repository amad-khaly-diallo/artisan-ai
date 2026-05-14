import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default async function ConversationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, client_name, client_phone, status, last_message_at, created_at')
    .eq('artisan_id', user.id)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-500 mt-1">Tous vos échanges clients via WhatsApp</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {!conversations || conversations.length === 0 ? (
            <div className="py-20 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Aucune conversation</p>
              <p className="text-gray-400 text-sm mt-1">
                Quand un client vous écrira sur WhatsApp, la conversation apparaîtra ici
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/conversations/${conv.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
                      {(conv.client_name ?? conv.client_phone).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {conv.client_name ?? 'Inconnu'}
                      </p>
                      <p className="text-xs text-gray-500">{conv.client_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">
                      {conv.last_message_at
                        ? new Date(conv.last_message_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : new Date(conv.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <Badge
                      variant={conv.status === 'open' ? 'default' : 'secondary'}
                      className={conv.status === 'open' ? 'bg-indigo-600' : ''}
                    >
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
