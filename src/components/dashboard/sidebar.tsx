'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { NotificationsDropdown } from '@/components/dashboard/notifications-dropdown'
import {
  LayoutDashboard,
  MessageSquare,
  User,
  CreditCard,
  LogOut,
} from 'lucide-react'
import type { Notification } from '@/types/database'

const navItems = [
  { href: '/dashboard',      label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/conversations',  label: 'Conversations',   icon: MessageSquare   },
  { href: '/profile',        label: 'Mon profil',      icon: User            },
  { href: '/billing',        label: 'Abonnement',      icon: CreditCard      },
]

interface SidebarProps {
  fullName: string | null
  businessName: string | null
  notifications: Notification[]
  unreadCount: number
}

export function Sidebar({ fullName, businessName, notifications, unreadCount }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-white">
      {/* Logo + cloche */}
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="font-semibold text-gray-900">ArtisanAI</span>
        </div>
        <NotificationsDropdown
          notifications={notifications}
          unreadCount={unreadCount}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t px-3 py-4 space-y-2">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-900 truncate">{fullName ?? 'Artisan'}</p>
          {businessName && (
            <p className="text-xs text-gray-500 truncate">{businessName}</p>
          )}
        </div>
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Button>
        </form>
      </div>
    </aside>
  )
}
