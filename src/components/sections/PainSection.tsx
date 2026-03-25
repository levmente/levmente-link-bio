'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import type { RailItem } from '@/components/ui/SpatialCardRail'

// ─── Pain cards data ──────────────────────────────────────────────────────────

const painCards: RailItem[] = [
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

// ─── Factory ──────────────────────────────────────────────────────────────────
// Returns the full pain sequence: 6 cards + conclusion section.
// onNext: called when the user taps the CTA to proceed to the diagnostic.

export function makePainItems(onNext: () => void): RailItem[] {
  return [
    ...painCards,
    {
      type: 'section' as const,
      scrollVh: 50,
      content: (
        <div className="w-full max-w-sm mx-auto px-6 flex flex-col items-center gap-5 text-center">

          <p className="text-[1.4rem] font-extrabold text-white leading-snug tracking-tight">
            Isso não é falta de caráter.{' '}
            <span className="text-violet-300">É falta de um mapa.</span>
          </p>

          <p className="text-sm text-zinc-500 leading-relaxed">
            Eu passei pela mesma coisa. E aprendi a criar um sistema
            que funciona com a minha mente — não contra ela.
          </p>

          <p className="text-sm font-semibold text-violet-400 tracking-wide">
            Agora eu ensino isso.
          </p>

          <button
            onClick={onNext}
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

        </div>
      ),
    },
  ]
}
