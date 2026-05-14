'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage } from '@/lib/actions/messages'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'

interface ReplyBoxProps {
  conversationId: string
}

export function ReplyBox({ conversationId }: ReplyBoxProps) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || isPending) return

    startTransition(async () => {
      const result = await sendMessage(conversationId, content)
      if (result?.error) {
        toast.error(result.error)
      } else {
        setContent('')
        router.refresh()
        textareaRef.current?.focus()
      }
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 border-t bg-white px-6 py-4"
    >
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Écrire un message… (Entrée pour envoyer, Shift+Entrée pour sauter une ligne)"
        rows={2}
        className="flex-1 resize-none"
        disabled={isPending}
      />
      <Button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 shrink-0"
        disabled={!content.trim() || isPending}
      >
        {isPending
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <Send className="h-4 w-4" />
        }
      </Button>
    </form>
  )
}
