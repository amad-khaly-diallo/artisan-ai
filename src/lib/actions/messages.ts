'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function sendMessage(conversationId: string, content: string) {
  if (!content.trim()) return { error: 'Message vide' }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  // Récupérer la conversation + le numéro du client
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id, client_phone')
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

  // Envoyer le message au client via Twilio WhatsApp
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken  = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER

  if (accountSid && authToken && fromNumber) {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    const body = new URLSearchParams({
      From: `whatsapp:${fromNumber}`,
      To:   `whatsapp:${conversation.client_phone}`,
      Body: content.trim(),
    })

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('[twilio] Erreur envoi message:', err)
      return { error: `Twilio: ${err.message ?? err.code ?? 'erreur inconnue'}` }
    }
  }

  revalidatePath(`/conversations/${conversationId}`)
  return { success: true }
}
