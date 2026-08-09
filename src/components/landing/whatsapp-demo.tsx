'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCheck, Phone, Video, ArrowLeft } from 'lucide-react'

type Message = { from: 'client' | 'ai'; text: string; time: string }

const script: Message[] = [
  {
    from: 'client',
    text: "Bonjour, j'ai une fuite sous mon évier. Vous pouvez passer aujourd'hui ?",
    time: '14:02',
  },
  {
    from: 'ai',
    text: "Bonjour ! 😊 Oui, je peux passer en fin de journée vers 17h. L'eau coule en continu ou seulement quand vous ouvrez le robinet ? En attendant, pensez à fermer le robinet d'arrêt sous l'évier.",
    time: '14:02',
  },
  {
    from: 'client',
    text: "Seulement quand j'ouvre. 17h c'est parfait 👍",
    time: '14:04',
  },
  {
    from: 'ai',
    text: "Très bien, c'est noté pour 17h. Je vous confirme l'adresse par message avant de partir. À tout à l'heure !",
    time: '14:04',
  },
]

// Délais avant l'apparition du message suivant (ms)
const CLIENT_DELAY = 1100
const AI_TYPING_DELAY = 1700

export function WhatsAppDemo() {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(reduceMotion ? script.length : 0)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    // La conversation se joue une seule fois, puis reste affichée
    if (reduceMotion || visible >= script.length) return

    const next = script[visible]

    if (next.from === 'ai') {
      setTyping(true)
      const reply = setTimeout(() => {
        setTyping(false)
        setVisible((v) => v + 1)
      }, AI_TYPING_DELAY)
      return () => clearTimeout(reply)
    }

    const send = setTimeout(() => setVisible((v) => v + 1), CLIENT_DELAY)
    return () => clearTimeout(send)
  }, [visible, reduceMotion])

  return (
    <div className="relative mx-auto w-full max-w-[330px]">
      {/* Halo coloré derrière le téléphone */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[3rem] bg-gradient-to-tr from-indigo-500/25 via-violet-500/20 to-emerald-400/25 blur-3xl"
      />

      <div className="relative rounded-[2.75rem] border-[9px] border-neutral-900 bg-neutral-900 shadow-2xl shadow-indigo-950/40 ring-1 ring-white/10">
        {/* Encoche */}
        <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-neutral-900" />

        <div className="overflow-hidden rounded-[2.1rem] bg-[#ECE5DD]">
          {/* Barre WhatsApp */}
          <div className="flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-7 text-white">
            <ArrowLeft className="h-4 w-4 shrink-0 opacity-80" />
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#128C7E] text-sm font-semibold">
              AK
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">
                AK Plomberie
              </p>
              <p className="text-[11px] leading-tight text-emerald-100/80">
                {typing ? 'en train d’écrire…' : 'en ligne'}
              </p>
            </div>
            <Video className="h-4 w-4 shrink-0 opacity-80" />
            <Phone className="h-4 w-4 shrink-0 opacity-80" />
          </div>

          {/* Fil de discussion - le haut s'estompe quand l'historique déborde */}
          <div className="flex h-[470px] flex-col justify-end gap-2 px-3 py-4 [mask-image:linear-gradient(to_bottom,transparent_0,#000_56px)] lg:h-[545px]">
            <AnimatePresence initial={false}>
              {script.slice(0, visible).map((msg, i) => (
                <motion.div
                  key={`${msg.time}-${i}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className={
                    msg.from === 'ai' ? 'flex justify-end' : 'flex justify-start'
                  }
                >
                  <div
                    className={`max-w-[82%] rounded-xl px-3 py-2 text-[13px] leading-snug shadow-sm ${msg.from === 'ai'
                        ? 'rounded-br-sm bg-[#DCF8C6] text-neutral-800'
                        : 'rounded-bl-sm bg-white text-neutral-800'
                      }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-neutral-500">
                      {msg.time}
                      {msg.from === 'ai' && (
                        <CheckCheck className="h-3 w-3 text-sky-500" />
                      )}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Indicateur « en train d'écrire » */}
            <AnimatePresence>
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-end"
                  aria-label="L’assistant rédige une réponse"
                >
                  <div className="flex gap-1 rounded-xl rounded-br-sm bg-[#DCF8C6] px-3 py-3 shadow-sm">
                    {[0, 0.15, 0.3].map((delay) => (
                      <motion.span
                        key={delay}
                        className="h-1.5 w-1.5 rounded-full bg-neutral-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Barre de saisie (décorative) */}
          <div className="flex items-center gap-2 bg-[#F0F0F0] px-3 py-2.5">
            <div className="flex-1 rounded-full bg-white px-3 py-2 text-[12px] text-neutral-400">
              Message
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#128C7E]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pastille flottante : réponse automatique */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.85, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 0.45, ease: 'easeOut' }}
        className="absolute -bottom-6 -left-7 hidden items-center gap-2.5 rounded-xl border border-neutral-200/80 bg-white/95 px-3.5 py-2.5 shadow-xl shadow-neutral-900/10 backdrop-blur-sm lg:flex"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span>
          <span className="block text-[11px] font-semibold leading-tight text-neutral-900">
            Répondu en 8 s
          </span>
          <span className="block text-[10px] leading-tight text-neutral-500">
            sans intervention
          </span>
        </span>
      </motion.div>
    </div>
  )
}
