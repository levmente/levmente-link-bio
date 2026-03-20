'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DiagnosticState } from '@/lib/types'
import GlowButton from '@/components/ui/GlowButton'

// ─── Resposta empática baseada no perfil ─────────────────────────────────────
// Estrutura pronta para integração futura com IA
// Futuro: POST /api/empathize → { message: string, diagnosticState: DiagnosticState }

function getEmpathyResponse(state: DiagnosticState): string {
  if (state.stage === 'tried-failed') {
    return 'Ter tentado tanto — e ainda sentir que não chegou lá — carrega um peso real. Mas isso não diz nada sobre a sua capacidade. Diz que o problema era o método, não você.'
  }
  if (state.stage === 'knowing-not-applying') {
    return 'Essa frustração de saber o que fazer e não conseguir executar é uma das mais dolorosas. Não é falta de força de vontade — é seu cérebro pedindo um sistema diferente do que te ensinaram.'
  }
  return 'Esse momento de olhar pra dentro e nomear o que está acontecendo já é um passo importante. O que você descreveu faz sentido — e tem saída.'
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Phase = 'waiting' | 'loading' | 'responded'

type ConfessionSectionProps = {
  diagnosticState: DiagnosticState
  onContinue: () => void
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ConfessionSection({
  diagnosticState,
  onContinue,
}: ConfessionSectionProps) {
  const [phase, setPhase] = useState<Phase>('waiting')
  const [text, setText] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setPhase('loading')
    // Simula leitura — no futuro: await fetch('/api/empathize', { body: ... })
    await new Promise((r) => setTimeout(r, 1600))
    setPhase('responded')
  }

  const handleSkip = () => {
    onContinue()
  }

  const response = getEmpathyResponse(diagnosticState)

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-sm mx-auto px-4 py-12"
    >
      <AnimatePresence mode="wait">

        {/* ── Fase: aguardando input ── */}
        {phase === 'waiting' && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="text-center flex flex-col gap-2">
              <p className="text-base font-semibold text-white leading-snug">
                Antes de ver seu resultado,<br />
                quero te dar um espaço.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Se quiser, me conta o que você está vivendo — do jeito que vier.
                Pode ser uma frase, pode ser um desabafo.
              </p>
              <p className="text-xs text-violet-400 font-medium mt-1">
                Eu leio tudo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="O que está pesando agora?"
                rows={4}
                className="
                  w-full resize-none rounded-xl border border-white/10 bg-white/[0.03]
                  px-4 py-3 text-sm text-white placeholder:text-zinc-600
                  focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05]
                  transition-all duration-200 leading-relaxed
                "
              />

              <GlowButton
                variant="secondary"
                className="w-full justify-center"
                disabled={!text.trim()}
              >
                Enviar
              </GlowButton>
            </form>

            <button
              onClick={handleSkip}
              className="text-center text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
            >
              Prefiro pular e ver meu resultado →
            </button>
          </motion.div>
        )}

        {/* ── Fase: carregando ── */}
        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 py-12 text-center"
          >
            <LoadingDots />
            <p className="text-sm text-zinc-500">Lendo o que você escreveu...</p>
          </motion.div>
        )}

        {/* ── Fase: resposta ── */}
        {phase === 'responded' && (
          <motion.div
            key="responded"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-5 flex flex-col gap-3">
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
                Julio Giani
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Obrigado por confiar isso.
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {response}
              </p>
              <p className="text-sm text-white font-medium leading-relaxed">
                Agora deixa eu te mostrar o que faz sentido para onde você está.
              </p>
            </div>

            <GlowButton
              onClick={onContinue}
              className="w-full justify-center"
            >
              Ver meu resultado
            </GlowButton>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.section>
  )
}

// ─── Loading dots ─────────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <div className="flex gap-1.5 items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-violet-500/60"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
