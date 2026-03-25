'use client'

import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion'
import GlowButton from '@/components/ui/GlowButton'
import { trackHeroCtaClicked } from '@/lib/analytics'

export default function HeroSection({ onNext }: { onNext?: () => void }) {
  // ── Mouse tracking (desktop) ─────────────────────────────────────────────
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 45, damping: 18 })
  const springY = useSpring(mouseY, { stiffness: 45, damping: 18 })

  // MG: amplitude ±10px lateral + tilt 3D pronunciado (camada do meio)
  const mgMouseX  = useTransform(springX, (v: number) => v * 20)
  const mgMouseY  = useTransform(springY, (v: number) => v * 20)
  const mgRotateY = useTransform(springX, (v: number) => v * 7)
  const mgRotateX = useTransform(springY, (v: number) => v * -4)

  // FG: amplitude ±2px (quase imóvel — colado na câmera)
  const fgMouseX = useTransform(springX, (v: number) => v * 4)
  const fgMouseY = useTransform(springY, (v: number) => v * 4)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const scrollToDiagnostic = () => {
    trackHeroCtaClicked()
    if (onNext) {
      onNext()
    } else {
      document.getElementById('pain')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      className="relative h-full w-full flex flex-col items-center justify-center px-4 pt-12 pb-16"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      {/* ── BG layer: orbs + grid ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.04, 0.07, 0.04] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-600 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-[25%] right-[-8%] w-[280px] h-[280px] rounded-full bg-violet-700 blur-[90px]"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-[15%] left-[-5%] w-[240px] h-[240px] rounded-full bg-violet-900 blur-[80px]"
        />
        <div className="absolute bottom-0 inset-x-0 h-[52%]">
          <div
            style={{
              position: 'absolute',
              inset: '-10% 0 0',
              backgroundImage:
                'linear-gradient(rgba(124,58,237,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.10) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              transform: 'perspective(360px) rotateX(78deg)',
              transformOrigin: '50% 0%',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.18) 75%, transparent 100%)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.18) 75%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* ── Corner HUD brackets ─────────────────────────────────────────────── */}
      <div className="absolute top-5 left-4 w-7 h-7 border-t border-l border-violet-400/30 pointer-events-none" />
      <div className="absolute top-5 right-4 w-7 h-7 border-t border-r border-violet-400/30 pointer-events-none" />
      <div className="absolute bottom-10 left-4 w-7 h-7 border-b border-l border-violet-400/20 pointer-events-none" />
      <div className="absolute bottom-10 right-4 w-7 h-7 border-b border-r border-violet-400/20 pointer-events-none" />

      {/* ── Conteúdo (camadas em profundidade) ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1600, transformOrigin: 'center center' }}
        className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto gap-6 w-full"
      >

        {/* ── MG layer: badge + avatar — mouse ±8px + tilt 3D ── */}
        <div className="flex flex-col items-center gap-6">
          <motion.div
            style={{
              y: mgMouseY,
              x: mgMouseX,
              rotateY: mgRotateY,
              rotateX: mgRotateX,
              transformPerspective: 900,
            }}
            className="flex flex-col items-center gap-6"
          >
            {/* Badge — chip flutuante */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 border border-violet-500/30 bg-violet-500/10 rounded-full px-3 py-1"
                style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Julio Giani apresenta LevMente
              </motion.span>
            </motion.div>

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-full border-2 border-violet-500/40 bg-violet-500/10 flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.35)]">
                <span className="text-3xl">🧠</span>
              </div>

              {/* Marcadores de canto — frame HUD */}
              <div className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-violet-400/60 pointer-events-none" />
              <div className="absolute -top-2 -right-2 w-3 h-3 border-t-2 border-r-2 border-violet-400/60 pointer-events-none" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b-2 border-l-2 border-violet-400/60 pointer-events-none" />
              <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 border-violet-400/60 pointer-events-none" />

              {/* Anel orbital lento — dashed */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 1.2 }}
                className="absolute inset-[-10px] rounded-full border border-dashed border-violet-500/20 pointer-events-none"
              />

              {/* Anel orbital rápido — arco parcial */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 1.4 }}
                className="absolute inset-[-18px] rounded-full pointer-events-none"
                style={{
                  border: '1.5px solid transparent',
                  borderTopColor: 'rgba(167,139,250,0.65)',
                  borderRightColor: 'rgba(167,139,250,0.2)',
                }}
              />

              {/* Status — sys:online */}
              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]"
                />
                <span className="text-[0.52rem] font-mono tracking-[0.2em] text-zinc-600 uppercase">sys:online</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── FG layer: headline + CTA — mouse ±2px ─────────── */}
        <motion.div
          style={{ y: fgMouseY, x: fgMouseX }}
          className="flex flex-col items-center gap-6 w-full"
        >
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97, rotateX: 3 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.3, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 900 }}
            className="space-y-3"
          >
            <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
              O problema nunca foi{' '}
              <span className="text-violet-400 drop-shadow-[0_0_24px_rgba(167,139,250,0.7)]">
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
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3 w-full"
          >
            <GlowButton onClick={scrollToDiagnostic} className="w-full max-w-xs text-base py-3.5">
              Quero entender minha mente
            </GlowButton>
            <p className="text-xs text-zinc-600">Diagnóstico gratuito · 2 minutos</p>
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  )
}
