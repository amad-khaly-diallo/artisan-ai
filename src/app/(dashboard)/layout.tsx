import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'

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
        {children}
      </main>
    </div>
  )
}
