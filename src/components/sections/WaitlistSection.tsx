'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import GlowButton from '@/components/ui/GlowButton'
import { trackWaitlistSubmitted } from '@/lib/analytics'

export default function WaitlistSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Integração futura com Formspree ou similar
    // Por ora simula o submit
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
    trackWaitlistSubmitted()
  }

  return (
    <section className="w-full max-w-md mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden p-6"
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-violet-600/10 blur-[60px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center gap-5">
          {/* Lock icon */}
          <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
            <Lock size={24} className="text-zinc-400" />
          </div>

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold border border-violet-500/30 bg-violet-500/10 text-violet-300 rounded-full px-3 py-1">
            <Sparkles size={10} />
            Em breve
          </span>

          {/* Content */}
          <div>
            <h2 className="text-2xl font-bold text-white">LevMente</h2>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Um app construído de dentro para fora — para pessoas que pensam diferente.
              <br />
              <span className="text-zinc-500">Produtividade que respeita o TDAH.</span>
            </p>
          </div>

          {/* Waitlist form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              <p className="text-xs text-zinc-500">
                Seja um dos primeiros a saber quando abrir.
              </p>
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors"
                />
                <GlowButton
                  variant="secondary"
                  className="w-full justify-center"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Entrar na lista de espera'}
                </GlowButton>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="text-sm font-semibold text-violet-300">✓ Você está na lista!</p>
              <p className="text-xs text-zinc-500 mt-1">
                Você será o primeiro a saber quando o LevMente abrir.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
