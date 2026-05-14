'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function sendMessage(conversationId: string, content: string) {
  if (!content.trim()) return { error: 'Message vide' }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  // Vérifier que la conversation appartient bien à cet artisan
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('artisan_id', user.id)
    .single()

  if (!conversation) return { error: 'Conversation introuvable' }

  const { error: msgError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      from_type: 'artisan',
      content: content.trim(),
    })

  if (msgError) return { error: msgError.message }

  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId)

  revalidatePath(`/conversations/${conversationId}`)
  return { success: true }
}
