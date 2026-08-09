import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Client avec service role key - bypass RLS, à utiliser uniquement côté serveur
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
