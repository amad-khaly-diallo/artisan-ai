import { createClient } from '@/lib/supabase/server'

/**
 * Le compte de démonstration est public : n'importe quel visiteur peut y entrer
 * en un clic depuis la landing. Il est donc en lecture seule.
 *
 * Le garde s'appuie sur l'identité du compte, pas sur un cookie posé au moment
 * du clic : un cookie serait supprimable par le visiteur, qui récupérerait alors
 * les droits d'écriture sur un compte partagé par tout le monde.
 *
 * Un utilisateur qui se connecte à son propre compte n'est jamais concerné.
 */
export const DEMO_USER_ID = process.env.DEMO_USER_ID ?? ''

export const DEMO_BLOCKED_MESSAGE =
  'Mode démonstration : les modifications sont désactivées.'

export function isDemoUserId(id: string | null | undefined): boolean {
  return DEMO_USER_ID.length > 0 && id === DEMO_USER_ID
}

/** Récupère l'utilisateur courant et indique s'il s'agit du compte de démo. */
export async function getSessionContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return { supabase, user, isDemo: isDemoUserId(user?.id) }
}

/** À utiliser en tête des actions serveur qui écrivent. */
export async function isDemoSession(): Promise<boolean> {
  const { isDemo } = await getSessionContext()
  return isDemo
}

/**
 * Masque un numéro de téléphone client en conservant l'indicatif, pour que la
 * liste des conversations reste lisible sans exposer de données personnelles.
 * "+33612345678" devient "+336••••••••".
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return 'Numéro masqué'

  const trimmed = phone.trim()
  const visible = trimmed.slice(0, 4)
  const hidden = Math.max(trimmed.length - visible.length, 4)

  return `${visible}${'•'.repeat(hidden)}`
}
