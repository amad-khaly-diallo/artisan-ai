import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { isDemoUserId } from '@/lib/demo'
import { Eye } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: profile },
    { data: notifications },
    { count: unreadCount },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, business_name')
      .eq('id', user.id)
      .single(),
    supabase
      .from('notifications')
      .select('*')
      .eq('artisan_id', user.id)
      .order('created_at', { ascending: false })
      .limit(15),
    supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('artisan_id', user.id)
      .eq('read', false),
  ])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        fullName={profile?.full_name ?? null}
        businessName={profile?.business_name ?? null}
        notifications={notifications ?? []}
        unreadCount={unreadCount ?? 0}
      />
      <main className="flex-1 overflow-y-auto">
        {isDemoUserId(user.id) && (
          <div className="flex items-center justify-center gap-2 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800 ring-1 ring-inset ring-amber-200">
            <Eye className="h-4 w-4 shrink-0" />
            <span>
              <strong className="font-semibold">Mode démonstration</strong> - lecture
              seule. Les modifications, l&apos;envoi de messages et le détail des
              conversations sont désactivés.
            </span>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
