'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PainArea, LifeArea, Stage, DiagnosticState } from '@/lib/types'
import { painLabels, lifeLabels, stageLabels } from '@/lib/diagnostic'
import ChoiceCard from '@/components/ui/ChoiceCard'
import GlowButton from '@/components/ui/GlowButton'
import {
  trackDiagnosticStepAnswered,
  trackDiagnosticCompleted,
} from '@/lib/analytics'

const painOptions: { value: PainArea; emoji: string }[] = [
  { value: 'procrastination', emoji: '🔁' },
  { value: 'disorganization', emoji: '🌀' },
  { value: 'focus', emoji: '🎯' },
  { value: 'relationships', emoji: '💬' },
  { value: 'guilt', emoji: '⚡' },
]

const lifeOptions: { value: LifeArea; emoji: string }[] = [
  { value: 'work', emoji: '💼' },
  { value: 'personal', emoji: '🏡' },
  { value: 'both', emoji: '🔀' },
]

const stageOptions: { value: Stage; emoji: string }[] = [
  { value: 'discovering', emoji: '🌱' },
  { value: 'knowing-not-applying', emoji: '📚' },
  { value: 'tried-failed', emoji: '🔥' },
]

type DiagnosticSectionProps = {
  onComplete: (state: DiagnosticState) => void
}

export default function DiagnosticSection({ onComplete }: DiagnosticSectionProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [state, setState] = useState<DiagnosticState>({
    pain: null,
    life: null,
    stage: null,
  })

  const handlePain = (pain: PainArea) => {
    const next = { ...state, pain }
    setState(next)
    trackDiagnosticStepAnswered({
      step: 1,
      question_id: 'pain',
      answer_value: pain,
      answer_label: painLabels[pain],
    })
    setTimeout(() => setStep(1), 300)
  }

  const handleLife = (life: LifeArea) => {
    const next = { ...state, life }
    setState(next)
    trackDiagnosticStepAnswered({
      step: 2,
      question_id: 'life',
      answer_value: life,
      answer_label: lifeLabels[life],
    })
    setTimeout(() => setStep(2), 300)
  }

  const handleStage = (stage: Stage) => {
    const final = { ...state, stage }
    setState(final)
    trackDiagnosticStepAnswered({
      step: 3,
      question_id: 'stage',
      answer_value: stage,
      answer_label: stageLabels[stage],
    })
    trackDiagnosticCompleted({
      pain: final.pain ?? '',
      pain_label: painLabels[final.pain ?? ''] ?? '',
      life: final.life ?? '',
      life_label: lifeLabels[final.life ?? ''] ?? '',
      stage: final.stage ?? '',
      stage_label: stageLabels[final.stage ?? ''] ?? '',
    })
    setTimeout(() => onComplete(final), 300)
  }

  const steps = [
    {
      label: 'Passo 1 de 3',
      question: 'O que mais te trava?',
      subtitle: 'Escolha o que mais ressoa com você agora.',
    },
    {
      label: 'Passo 2 de 3',
      question: 'Onde isso aparece mais na sua vida?',
      subtitle: 'Pode ser nos dois — escolha o que dói mais.',
    },
    {
      label: 'Passo 3 de 3',
      question: 'Onde você está agora?',
      subtitle: 'Seja honesto. Não tem resposta certa.',
    },
  ]

  return (
    <section id="diagnostic" className="w-full max-w-md mx-auto px-4 py-6">
      {/* Painel glassmorphism — container do sistema */}
      <div
        className="relative rounded-2xl border border-white/[0.07] overflow-hidden p-5"
        style={{
          background: 'rgba(8,8,14,0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 0 50px rgba(124,58,237,0.05)',
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-violet-500/30 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-violet-500/30 rounded-tr-2xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-500">
          Diagnóstico
        </span>
        <h2 className="text-2xl font-bold text-white mt-2">
          Vamos descobrir seu próximo passo
        </h2>
        <p className="text-sm text-zinc-400 mt-1">3 perguntas. Sem julgamento.</p>
      </div>

      {/* Progress bar — trilha HUD */}
      <div className="flex gap-1.5 mb-8 items-center">
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative h-0.5 flex-1 rounded-full overflow-visible">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                i <= step
                  ? 'bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.7)]'
                  : 'bg-white/8'
              }`}
            />
            {i === step && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-300 shadow-[0_0_8px_rgba(167,139,250,1)] z-10"
              />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4"
        >
          <div className="mb-2">
            <p className="text-xs text-zinc-600 mb-1">{steps[step].label}</p>
            <h3 className="text-lg font-bold text-white">{steps[step].question}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{steps[step].subtitle}</p>
          </div>

          {/* Step 0: Pain */}
          {step === 0 && (
            <div className="flex flex-col gap-2.5">
              {painOptions.map((opt, i) => (
                <motion.div
                  key={opt.value}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ChoiceCard
                    label={painLabels[opt.value]}
                    icon={opt.emoji}
                    selected={state.pain === opt.value}
                    onClick={() => handlePain(opt.value)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Step 1: Life area */}
          {step === 1 && (
            <div className="flex flex-col gap-2.5">
              {lifeOptions.map((opt, i) => (
                <motion.div
                  key={opt.value}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ChoiceCard
                    label={lifeLabels[opt.value]}
                    icon={opt.emoji}
                    selected={state.life === opt.value}
                    onClick={() => handleLife(opt.value)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Step 2: Stage */}
          {step === 2 && (
            <div className="flex flex-col gap-2.5">
              {stageOptions.map((opt, i) => (
                <motion.div
                  key={opt.value}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ChoiceCard
                    label={stageLabels[opt.value]}
                    icon={opt.emoji}
                    selected={state.stage === opt.value}
                    onClick={() => handleStage(opt.value)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Back button */}
      {step > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <GlowButton
            variant="ghost"
            onClick={() => setStep((prev) => (prev > 0 ? ((prev - 1) as 0 | 1 | 2) : prev))}
            className="text-xs"
          >
            ← Voltar
          </GlowButton>
        </motion.div>
      )}
      </div>{/* fim do painel glassmorphism */}
    </section>
  )
}
