'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import GlowButton from '@/components/ui/GlowButton'
import { trackWaitlistSubmitted, trackWaitlistSubmitFailed } from '@/lib/analytics'

// ─── Formspree endpoint ───────────────────────────────────────────────────────
// 1. Acesse https://formspree.io e crie um novo formulário
// 2. Copie o endpoint gerado (formato: https://formspree.io/f/XXXXXXXX)
// 3. Cole abaixo substituindo o placeholder
// ─────────────────────────────────────────────────────────────────────────────
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwvrzavw'

export default function WaitlistSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSubmitted(true)
        trackWaitlistSubmitted()
      } else {
        setError('Algo deu errado. Tente novamente.')
        trackWaitlistSubmitFailed()
      }
    } catch {
      setError('Sem conexão. Verifique sua internet.')
      trackWaitlistSubmitFailed()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="waitlist" className="w-full max-w-md mx-auto px-4 py-6">
      <div className="relative rounded-2xl border border-violet-500/25 overflow-hidden">
        {/* ── Corner brackets ────────────────────────────────────────────── */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-violet-400/50 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-violet-400/50 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-violet-400/25 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-violet-400/25 rounded-br-2xl pointer-events-none" />

        {/* ── Scan line ──────────────────────────────────────────────────── */}
        <motion.div
          animate={{ top: ['-2%', '102%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 8 }}
          className="absolute inset-x-0 h-px pointer-events-none z-20"
          style={{
            background:
              'linear-gradient(to right, transparent 5%, rgba(167,139,250,0.55) 50%, transparent 95%)',
          }}
        />

        {/* ── Header bar — sistema ───────────────────────────────────────── */}
        <div className="relative flex flex-col border-b border-white/[0.05]">
        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-[0.58rem] font-mono tracking-[0.22em] text-violet-500/55 uppercase">
            LevMente · Sistema
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[0.58rem] font-mono tracking-widest text-violet-500/45 uppercase">
              {submitted ? 'acesso liberado' : 'aguardando'}
            </span>
            <motion.div
              animate={
                submitted
                  ? { opacity: 1 }
                  : { opacity: [1, 0.2, 1] }
              }
              transition={
                submitted
                  ? {}
                  : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
              }
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-700 ${
                submitted
                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                  : 'bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.7)]'
              }`}
            />
          </div>
        </div>
        {/* Scan progress — linha que avança ao entrar na viewport */}
        <div className="h-px bg-gradient-to-r from-violet-500/60 via-violet-400/20 to-transparent" />
        </div>

        {/* ── Conteúdo ────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col items-center text-center gap-5 px-6 py-6">

          {/* Lock icon */}
          <motion.div
            animate={submitted ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 0.5 }}
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
              submitted
                ? 'border-emerald-500/35 bg-emerald-500/10 shadow-[0_0_24px_rgba(52,211,153,0.18)]'
                : 'border-violet-500/35 bg-violet-500/10 shadow-[0_0_24px_rgba(124,58,237,0.18)]'
            }`}
          >
            <Lock
              size={22}
              className={`transition-colors duration-500 ${submitted ? 'text-emerald-400' : 'text-violet-400'}`}
            />
          </motion.div>

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold border border-violet-500/30 bg-violet-500/10 text-violet-300 rounded-full px-3 py-1">
            <Sparkles size={10} />
            Em breve
          </span>

          {/* Content */}
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">LevMente</h2>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Um app construído de dentro para fora — para pessoas que pensam diferente.
              <br />
              <span className="text-zinc-500">Produtividade que respeita o TDAH.</span>
            </p>
          </div>

          {/* Waitlist form */}
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-3"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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
                    className="w-full bg-violet-950/30 border border-violet-500/20 rounded-xl px-4 py-3 text-sm text-white font-mono tracking-wide placeholder:text-zinc-600 placeholder:font-sans focus:outline-none focus:border-violet-500/55 focus:bg-violet-950/50 focus:shadow-[0_0_0_1px_rgba(124,58,237,0.3)] transition-all duration-200"
                  />
                  <GlowButton
                    variant="secondary"
                    className="w-full justify-center"
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : 'Entrar na lista de espera'}
                  </GlowButton>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center flex flex-col items-center gap-3"
              >
                <div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 rounded-full px-4 py-1.5">
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                  />
                  <span className="text-xs font-mono text-emerald-300 tracking-wider">ACESSO REGISTRADO</span>
                </div>
                <p className="text-xs text-zinc-500">
                  Você será o primeiro a saber quando o LevMente abrir.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
