'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

// ─── Estrutura de dados ───────────────────────────────────────────────────────

type Scene = {
  label?: string       // categoria da cena — minúsculo, sumiu, sutil
  context?: string     // frase de preparo — pequena, zinc-400
  impact: string       // frase principal — grande, branca
  accent: string       // palavra(s) específica(s) em violeta
  isRevelation?: true  // cena final — tratamento especial
}

const scenes: Scene[] = [
  {
    label: 'O ciclo',
    context: 'Você começa. Você tenta.',
    impact: 'Mas raramente termina.',
    accent: 'termina',
  },
  {
    label: 'O paradoxo',
    context: 'Você sabe exatamente o que precisa fazer.',
    impact: 'E trava antes mesmo de começar.',
    accent: 'trava',
  },
  {
    label: 'O peso',
    context: 'Não é preguiça. É um peso que não vai embora.',
    impact: 'A culpa já virou rotina.',
    accent: 'rotina',
  },
  {
    label: 'A armadilha',
    context: 'Agenda. App. Método. Curso. Funcionou alguns dias.',
    impact: 'Depois voltou tudo — e pior.',
    accent: 'pior',
  },
  {
    label: 'O rótulo',
    context: 'Em algum momento alguém disse.',
    impact: 'Ou você mesmo se chamou de preguiçoso.',
    accent: 'preguiçoso',
  },
  {
    impact: 'Mas ninguém nunca te explicou como esse cérebro funciona.',
    accent: 'ninguém',
    isRevelation: true,
  },
]

// ─── Helpers de texto ────────────────────────────────────────────────────────

function AccentedImpact({ text, accent }: { text: string; accent: string }) {
  const idx = text.indexOf(accent)
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-violet-300">{accent}</span>
      {text.slice(idx + accent.length)}
    </>
  )
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function PainSection() {
  return (
    <section id="pain" className="w-full max-w-sm mx-auto px-6 py-24 flex flex-col items-center">

      {/* Abertura */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-violet-500/60 mb-20 text-center"
      >
        Você se reconhece?
      </motion.p>

      {/* Cenas */}
      <div className="flex flex-col gap-24 w-full">
        {scenes.map((scene, i) => (
          <SceneBlock key={i} scene={scene} index={i} />
        ))}
      </div>

      {/* Separador */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex items-center gap-4 my-24 w-full"
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/8" />
        <span className="text-white/15 text-xs tracking-widest">• • •</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/8" />
      </motion.div>

      {/* Conclusão */}
      <div className="flex flex-col gap-5 text-center w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-[1.4rem] font-extrabold text-white leading-snug tracking-tight"
        >
          Isso não é falta de caráter.{' '}
          <span className="text-violet-300">É falta de um mapa.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm text-zinc-500 leading-relaxed"
        >
          Eu passei pela mesma coisa. E aprendi a criar um sistema
          que funciona com a minha mente — não contra ela.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm font-semibold text-violet-400 tracking-wide"
        >
          Agora eu ensino isso.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="pt-4"
        >
          <button
            onClick={() => document.getElementById('diagnostic')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-xs text-zinc-500 hover:text-violet-300 transition-colors duration-200 cursor-pointer"
          >
            <span>Fazer meu diagnóstico gratuito</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown size={14} />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Bloco de cena ────────────────────────────────────────────────────────────

function SceneBlock({ scene, index }: { scene: Scene; index: number }) {
  if (scene.isRevelation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center text-center gap-0"
      >
        {/* Glow spot */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-violet-600/8 blur-[50px] rounded-full" />
        </div>
        <p className="text-[1.95rem] font-extrabold text-white leading-tight tracking-tight">
          <AccentedImpact text={scene.impact} accent={scene.accent} />
        </p>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col items-center text-center gap-2.5">
      {/* Label */}
      {scene.label && (
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0, ease: 'easeOut' }}
          className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-violet-500/40"
        >
          {scene.label}
        </motion.span>
      )}

      {/* Context */}
      {scene.context && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm text-zinc-500 leading-relaxed"
        >
          {scene.context}
        </motion.p>
      )}

      {/* Impact */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-[1.85rem] font-extrabold text-white leading-tight tracking-tight"
      >
        <AccentedImpact text={scene.impact} accent={scene.accent} />
      </motion.p>
    </div>
  )
}
