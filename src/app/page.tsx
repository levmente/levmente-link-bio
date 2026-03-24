'use client'

import { useState, useRef, useEffect } from 'react'
import { DiagnosticState, DiagnosticResult } from '@/lib/types'
import { getResult } from '@/lib/diagnostic'
import { trackPageEntered } from '@/lib/analytics'

import SpatialCardRail, { RailItem } from '@/components/ui/SpatialCardRail'
import HeroSection from '@/components/sections/HeroSection'
import DiagnosticSection from '@/components/sections/DiagnosticSection'
import ConfessionSection from '@/components/sections/ConfessionSection'
import ResultSection from '@/components/sections/ResultSection'
import ProductsSection from '@/components/sections/ProductsSection'
import WaitlistSection from '@/components/sections/WaitlistSection'
import SocialSection from '@/components/sections/SocialSection'
import { makePainItems } from '@/components/sections/PainSection'

// ─── Flow state ───────────────────────────────────────────────────────────────

type FlowStage = 'idle' | 'diagnostic_done' | 'confession_done'

// ─── Item indices ─────────────────────────────────────────────────────────────
//
//  0    hero
//  1-6  pain cards (O ciclo … isRevelation)
//  7    pain conclusion ("Isso não é falta de caráter")
//  8    diagnostic
//  9    confession   (A1: active when flowStage !== 'idle')
//  10   result       (A1: active when flowStage === 'confession_done')
//  11   products A   — entry (Ebook + Desafio)
//  12   products B   — premium (Curso + Mentorias)
//  13   waitlist
//  14   social

const IDX_FIRST_PAIN = 1   // hero CTA → first pain card
const IDX_DIAGNOSTIC = 8
const IDX_CONFESSION = 9
const IDX_RESULT     = 10
const IDX_PRODUCTS   = 11

export default function Home() {
  const [flowStage, setFlowStage]             = useState<FlowStage>('idle')
  const [diagnosticState, setDiagnosticState] = useState<DiagnosticState | null>(null)
  const [result, setResult]                   = useState<DiagnosticResult | null>(null)

  const scrollToRef = useRef<((index: number) => void) | null>(null)

  useEffect(() => {
    trackPageEntered()
  }, [])

  // ── Flow handlers ─────────────────────────────────────────────────────────

  const handleDiagnosticComplete = (state: DiagnosticState) => {
    const r = getResult(state)
    setDiagnosticState(state)
    setResult(r)
    setFlowStage('diagnostic_done')
    setTimeout(() => scrollToRef.current?.(IDX_CONFESSION), 150)
  }

  const handleConfessionDone = () => {
    setFlowStage('confession_done')
    setTimeout(() => scrollToRef.current?.(IDX_RESULT), 100)
  }

  const handleSeeAll = () => {
    scrollToRef.current?.(IDX_PRODUCTS)
  }

  // ── Rail items ────────────────────────────────────────────────────────────

  const railItems: RailItem[] = [

    // Hero (index 0) — focal at page load, no scroll needed
    {
      type: 'section',
      scrollVh: 80,
      content: <HeroSection onNext={() => scrollToRef.current?.(IDX_FIRST_PAIN)} />,
    },

    // Pain cards + conclusion (indices 1-7)
    ...makePainItems(() => scrollToRef.current?.(IDX_DIAGNOSTIC)),

    // Diagnostic (index 8)
    {
      type: 'section',
      id: 'diagnostic',
      scrollVh: 50,
      content: <DiagnosticSection onComplete={handleDiagnosticComplete} />,
    },

    // Confession (index 9) — A1: invisible until diagnostic done
    {
      type: 'section',
      scrollVh: 22,
      active: flowStage !== 'idle',
      content: diagnosticState ? (
        <ConfessionSection
          diagnosticState={diagnosticState}
          onContinue={handleConfessionDone}
        />
      ) : null,
    },

    // Result (index 10) — A1: invisible until confession done
    {
      type: 'section',
      id: 'result',
      scrollVh: 25,
      active: flowStage === 'confession_done',
      content: result ? (
        <ResultSection result={result} onSeeAll={handleSeeAll} />
      ) : null,
    },

    // Products A (index 11) — entry: Ebook + Desafio
    {
      type: 'section',
      scrollVh: 90,
      content: <ProductsSection slice="entry" />,
    },

    // Products B (index 12) — premium: Curso + Mentorias
    {
      type: 'section',
      scrollVh: 90,
      content: <ProductsSection slice="premium" />,
    },

    // Waitlist (index 13)
    {
      type: 'section',
      scrollVh: 80,
      content: <WaitlistSection />,
    },

    // Social (index 14)
    {
      type: 'section',
      scrollVh: 60,
      content: <SocialSection />,
    },
  ]

  return (
    <main className="relative min-h-screen text-white overflow-x-clip">
      <SpatialCardRail items={railItems} scrollToRef={scrollToRef} />
    </main>
  )
}
