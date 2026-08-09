'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isDemoUserId } from '@/lib/demo'

export async function markNotificationRead(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Les notifications sont partagées par tous les visiteurs de la démo
  if (isDemoUserId(user.id)) return

  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .eq('artisan_id', user.id)

  revalidatePath('/', 'layout')
}

export async function markAllNotificationsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (isDemoUserId(user.id)) return

  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('artisan_id', user.id)
    .eq('read', false)

  revalidatePath('/', 'layout')
}
