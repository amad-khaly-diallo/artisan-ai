'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { markNotificationRead, markAllNotificationsRead } from '@/lib/actions/notifications'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, MessageSquare, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/database'

interface NotificationsDropdownProps {
  notifications: Notification[]
  unreadCount: number
}

export function NotificationsDropdown({ notifications, unreadCount }: NotificationsDropdownProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleMarkOne(id: string) {
    startTransition(async () => {
      await markNotificationRead(id)
      router.refresh()
    })
  }

  function handleMarkAll() {
    startTransition(async () => {
      await markAllNotificationsRead()
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Notifications"
        className="relative flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="right"
        className="w-80 p-0"
        sideOffset={8}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold text-gray-900">Notifications</p>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              disabled={isPending}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Tout marquer lu
            </button>
          )}
        </div>

        {/* Liste */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => !notif.read && handleMarkOne(notif.id)}
                disabled={notif.read || isPending}
                className={cn(
                  'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                  !notif.read
                    ? 'bg-indigo-50 hover:bg-indigo-100 cursor-pointer'
                    : 'hover:bg-gray-50 cursor-default'
                )}
              >
                <div className={cn(
                  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                  !notif.read ? 'bg-indigo-100' : 'bg-gray-100'
                )}>
                  <MessageSquare className={cn(
                    'h-3.5 w-3.5',
                    !notif.read ? 'text-indigo-600' : 'text-gray-400'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm leading-snug truncate',
                    !notif.read ? 'font-medium text-gray-900' : 'text-gray-500'
                  )}>
                    {notif.message}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {new Date(notif.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {!notif.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                )}
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
