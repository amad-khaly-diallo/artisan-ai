'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const servicesRaw = (formData.get('services') as string) ?? ''
  const services = servicesRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: (formData.get('full_name') as string) || null,
      business_name: (formData.get('business_name') as string) || null,
      phone: (formData.get('phone') as string) || null,
      whatsapp_number: (formData.get('whatsapp_number') as string) || null,
      bio: (formData.get('bio') as string) || null,
      services: services.length > 0 ? services : null,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile')
  return { success: true }
}
