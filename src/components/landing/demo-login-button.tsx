'use client'

import { useTransition } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { loginDemo } from '@/lib/actions/auth'

interface Props {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'sm' | 'lg'
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  withArrow?: boolean
}

export function DemoLoginButton({
  children,
  className,
  size = 'default',
  variant = 'default',
  withArrow = false,
}: Props) {
  const [pending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      // En cas de succès, l'action serveur redirige vers /dashboard
      const result = await loginDemo()
      if (result?.error) toast.error(result.error)
    })
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      disabled={pending}
      onClick={handleClick}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connexion…
        </>
      ) : (
        <>
          {children}
          {withArrow && <ArrowRight className="ml-2 h-4 w-4" />}
        </>
      )}
    </Button>
  )
}
