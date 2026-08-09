'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function register() {
  return { error: 'Les inscriptions sont désactivées - ce site est une démo. Contactez-moi pour un accès.' }
}

// Connexion au compte de démonstration. Les identifiants restent côté serveur
// (variables d'environnement) et ne sont jamais exposés au navigateur.
export async function loginDemo() {
  const email = process.env.DEMO_EMAIL
  const password = process.env.DEMO_PASSWORD

  if (!email || !password) {
    return { error: "Le compte de démonstration n'est pas configuré" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
