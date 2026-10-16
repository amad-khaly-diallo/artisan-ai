import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

// Validation de la signature Twilio
function validateTwilioSignature(request: NextRequest, body: string): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const signature = request.headers.get('x-twilio-signature')

  if (!authToken || !signature) return false

  const url = process.env.TWILIO_WEBHOOK_URL ?? request.url

  // Reconstituer la chaîne signée (URL + params triés par clé)
  const params = new URLSearchParams(body)
  const sortedKeys = [...params.keys()].sort()
  const paramString = sortedKeys.map((k) => `${k}${params.get(k)}`).join('')

  const expected = crypto
    .createHmac('sha1', authToken)
    .update(url + paramString)
    .digest('base64')

  // timingSafeEqual lève une exception si les longueurs diffèrent : on rejette avant
  const received = Buffer.from(signature)
  const computed = Buffer.from(expected)
  if (received.length !== computed.length) return false

  return crypto.timingSafeEqual(received, computed)
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  // En production, rejeter les requêtes non signées par Twilio
  if (process.env.NODE_ENV === 'production') {
    if (!validateTwilioSignature(request, rawBody)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  const params = new URLSearchParams(rawBody)

  const toRaw = params.get('To') ?? ''   // ex: "whatsapp:+33612345678"
  const fromRaw = params.get('From') ?? ''   // ex: "whatsapp:+33611223344"
  const body = params.get('Body') ?? ''
  const profile = params.get('ProfileName') ?? null

  const toNumber = toRaw.replace('whatsapp:', '').trim()
  const fromNumber = fromRaw.replace('whatsapp:', '').trim()

  if (!fromNumber || !body.trim()) {
    return twiml('') // message vide, on ignore
  }

  const supabase = createAdminClient()

  // 1. Trouver l'artisan
  let artisanProfile = null

  if (process.env.NODE_ENV !== 'production') {
    // En dev : toujours utiliser le dernier utilisateur connecté
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const lastConnected = users
      .filter((u) => u.last_sign_in_at)
      .sort((a, b) => new Date(b.last_sign_in_at!).getTime() - new Date(a.last_sign_in_at!).getTime())[0]

    if (lastConnected) {
      const { data: devProfile } = await supabase
        .from('profiles')
        .select('id, full_name, business_name, bio, services, whatsapp_number')
        .eq('id', lastConnected.id)
        .single()
      artisanProfile = devProfile
      console.log(`[webhook][dev] Artisan → dernier connecté : ${artisanProfile?.full_name ?? lastConnected.email}`)
    }
  } else {
    // En prod : trouver l'artisan via son numéro WhatsApp
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, business_name, bio, services, whatsapp_number')
      .eq('whatsapp_number', toNumber)
      .single()
    artisanProfile = data
  }

  if (!artisanProfile) {
    console.error(`[webhook] Aucun artisan trouvé pour le numéro ${toNumber}`)
    return twiml('')
  }

  const artisanId = artisanProfile.id

  // 2. Trouver ou créer la conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('id, status')
    .eq('artisan_id', artisanId)
    .eq('client_phone', fromNumber)
    .single()

  let conversationId: string
  let isNew = false

  if (existing) {
    conversationId = existing.id
    // Réouvrir la conversation si elle était fermée
    if (existing.status === 'closed') {
      await supabase
        .from('conversations')
        .update({ status: 'open', last_message_at: new Date().toISOString() })
        .eq('id', conversationId)
    }
  } else {
    const { data: created, error } = await supabase
      .from('conversations')
      .insert({
        artisan_id: artisanId,
        client_phone: fromNumber,
        client_name: profile,
        status: 'open',
        last_message_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error || !created) {
      console.error('[webhook] Erreur création conversation:', error)
      return twiml('')
    }

    conversationId = created.id
    isNew = true
  }

  // 3. Insérer le message client
  await supabase.from('messages').insert({
    conversation_id: conversationId,
    from_type: 'client',
    content: body.trim(),
  })

  // Mettre à jour last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId)

  // 4. Créer une notification pour l'artisan
  await supabase.from('notifications').insert({
    artisan_id: artisanId,
    type: isNew ? 'new_conversation' : 'new_message',
    message: isNew
      ? `Nouvelle conversation de ${profile ?? fromNumber}`
      : `Nouveau message de ${profile ?? fromNumber} : ${body.trim().slice(0, 80)}`,
  })

  // 5. Générer et envoyer la réponse IA (étape 5)
  const aiReply = await generateAiReply({
    artisanProfile,
    clientMessage: body.trim(),
    conversationId,
  })

  return twiml(aiReply)
}

// ---------------------------------------------------------------------------
// Réponse IA - sera complétée à l'étape 5
// ---------------------------------------------------------------------------

interface AiReplyParams {
  artisanProfile: {
    id: string
    full_name: string | null
    business_name: string | null
    bio: string | null
    services: string[] | null
  }
  clientMessage: string
  conversationId: string
}

async function generateAiReply({
  artisanProfile,
  clientMessage,
  conversationId,
}: AiReplyParams): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return ''

  const supabase = createAdminClient()

  // Récupérer l'historique récent (10 derniers messages)
  const { data: history } = await supabase
    .from('messages')
    .select('from_type, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(10)

  const historyText = (history ?? [])
    .reverse()
    .map((m) => {
      const role = m.from_type === 'client' ? 'Client' : 'Vous (ou IA)'
      return `${role}: ${m.content}`
    })
    .join('\n')

  const systemPrompt = `Tu es l'assistant WhatsApp de ${artisanProfile.business_name ?? artisanProfile.full_name ?? 'un artisan'}.
Tu réponds aux messages des clients de façon professionnelle, chaleureuse et naturelle, comme si c'était l'artisan lui-même qui écrivait.
${artisanProfile.bio ? `À propos : ${artisanProfile.bio}` : ''}
${artisanProfile.services?.length ? `Services proposés : ${artisanProfile.services.join(', ')}` : ''}

Règles absolues pour le format WhatsApp :
- Écris en texte brut, sans aucun markdown (pas de **, __, *, #, tirets, ni backticks)
- Pas de listes à puces, écris en phrases naturelles
- Utilise des sauts de ligne pour aérer si nécessaire
- Tu peux utiliser quelques emojis pour rendre le message chaleureux
- Messages courts et directs, maximum 4-5 phrases
- Réponds uniquement en français
- Ne mentionne jamais que tu es une IA`

  const userPrompt = historyText
    ? `Historique de la conversation :\n${historyText}\n\nDernier message du client : ${clientMessage}`
    : `Message du client : ${clientMessage}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      console.error('[ai] Erreur API Claude:', await response.text())
      return ''
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>
    }
    const aiText = data.content.find((c) => c.type === 'text')?.text ?? ''

    if (aiText) {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        from_type: 'ai',
        content: aiText,
      })
    }

    return aiText
  } catch (err) {
    console.error('[ai] Erreur génération réponse:', err)
    return ''
  }
}

// ---------------------------------------------------------------------------
// Helpers TwiML
// ---------------------------------------------------------------------------

function twiml(message: string): NextResponse {
  const body = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response/>`

  return new NextResponse(body, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
