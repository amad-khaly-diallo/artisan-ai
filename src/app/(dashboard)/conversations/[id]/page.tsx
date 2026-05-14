import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Bot, User, Wrench } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ReplyBox } from '@/components/dashboard/reply-box'

interface Props {
  params: Promise<{ id: string }>
}

const fromConfig = {
  client:  { label: 'Client', icon: User,   bubble: 'bg-white border border-gray-200 text-gray-900', side: 'items-start' },
  ai:      { label: 'IA',     icon: Bot,    bubble: 'bg-indigo-600 text-white',                      side: 'items-end'   },
  artisan: { label: 'Vous',   icon: Wrench, bubble: 'bg-gray-800 text-white',                        side: 'items-end'   },
} as const

export default async function ConversationDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: conversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .eq('artisan_id', user.id)
    .single()

  if (!conversation) notFound()

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 border-b bg-white px-6 py-4 shrink-0">
        <Link href="/conversations" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {conversation.client_name ?? 'Client inconnu'}
          </p>
          <p className="text-sm text-gray-500">{conversation.client_phone}</p>
        </div>
        <Badge
          variant={conversation.status === 'open' ? 'default' : 'secondary'}
          className={conversation.status === 'open' ? 'bg-indigo-600' : ''}
        >
          {conversation.status === 'open' ? 'Ouvert' : 'Fermé'}
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {!messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">Aucun message dans cette conversation</p>
          </div>
        ) : (
          messages.map((msg) => {
            const config = fromConfig[msg.from_type]
            return (
              <div key={msg.id} className={cn('flex flex-col gap-1', config.side)}>
                <span className="text-xs text-gray-400 px-1">{config.label}</span>
                <div className={cn('max-w-sm rounded-2xl px-4 py-2.5 text-sm shadow-sm', config.bubble)}>
                  {msg.content}
                </div>
                <span className="text-xs text-gray-400 px-1">
                  {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )
          })
        )}
      </div>

      {/* Zone de réponse */}
      {conversation.status === 'open' && (
        <ReplyBox conversationId={conversation.id} />
      )}

      {conversation.status === 'closed' && (
        <div className="border-t bg-gray-50 px-6 py-3 text-center text-sm text-gray-400 shrink-0">
          Cette conversation est fermée
        </div>
      )}
    </div>
  )
}
