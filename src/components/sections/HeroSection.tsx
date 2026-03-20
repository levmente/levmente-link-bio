'use client'

import { motion } from 'framer-motion'
import GlowButton from '@/components/ui/GlowButton'
import { ArrowDown } from 'lucide-react'
import { trackHeroCtaClicked } from '@/lib/analytics'

export default function HeroSection() {
  const scrollToDiagnostic = () => {
    trackHeroCtaClicked()
    document.getElementById('pain')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-svh flex flex-col items-center justify-center px-4 pt-12 pb-16 overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-violet-800/8 blur-[80px]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto gap-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 border border-violet-500/30 bg-violet-500/10 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Julio Giani apresenta LevMente
          </span>
        </motion.div>

        {/* Avatar placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-20 h-20 rounded-full border-2 border-violet-500/40 bg-violet-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.25)]"
        >
          <span className="text-3xl">🧠</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
            O problema nunca foi{' '}
            <span className="text-violet-400 drop-shadow-[0_0_20px_rgba(167,139,250,0.6)]">
              falta de disciplina.
            </span>
            <br />
            Foi você tentando viver com um cérebro que ninguém te ensinou a usar.
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed">
            Se você tem TDAH — ou suspeita que tem — e já se sentiu burro, preguiçoso ou
            incapaz: isso não é verdade. E eu vou te mostrar por quê.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-3 w-full"
        >
          <GlowButton onClick={scrollToDiagnostic} className="w-full max-w-xs text-base py-3.5">
            Quero entender minha mente
          </GlowButton>
          <p className="text-xs text-zinc-600">Diagnóstico gratuito · 2 minutos</p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-zinc-600"
          >
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
