'use client'

import { useState, useRef, useEffect } from 'react'
import { DiagnosticState, DiagnosticResult } from '@/lib/types'
import { getResult } from '@/lib/diagnostic'
import { trackPageEntered } from '@/lib/analytics'

import dynamic from 'next/dynamic'
import SpatialCardRail, { RailItem } from '@/components/ui/SpatialCardRail'
import HeroSection from '@/components/sections/HeroSection'
import DiagnosticSection from '@/components/sections/DiagnosticSection'
import { makePainItems } from '@/components/sections/PainSection'

const ResultSection   = dynamic(() => import('@/components/sections/ResultSection'))
const ProductsSection = dynamic(() => import('@/components/sections/ProductsSection'))
const WaitlistSection = dynamic(() => import('@/components/sections/WaitlistSection'))
const SocialSection   = dynamic(() => import('@/components/sections/SocialSection'))

// ─── Flow state ───────────────────────────────────────────────────────────────

type FlowStage = 'idle' | 'diagnostic_done'

// ─── Item indices ─────────────────────────────────────────────────────────────
//
//  0    hero
//  1-6  pain cards (O ciclo … isRevelation)
//  7    pain conclusion ("Isso não é falta de caráter")
//  8    diagnostic
//  9    result       (A1: active when flowStage === 'diagnostic_done')
//  10   products A   — entry (Ebook + Desafio)
//  11   products B   — premium (Curso + Mentorias)
//  12   waitlist
//  13   social

const IDX_FIRST_PAIN = 1
const IDX_DIAGNOSTIC = 8
const IDX_RESULT     = 9
const IDX_PRODUCTS   = 10

export default function Home() {
  const [flowStage, setFlowStage]             = useState<FlowStage>('idle')
  const [result, setResult] = useState<DiagnosticResult | null>(null)

  const scrollToRef = useRef<((index: number) => void) | null>(null)

  useEffect(() => {
    trackPageEntered()
  }, [])

  // ── Flow handlers ─────────────────────────────────────────────────────────

  const handleDiagnosticComplete = (state: DiagnosticState) => {
    const r = getResult(state)
    setResult(r)
    setFlowStage('diagnostic_done')
    setTimeout(() => scrollToRef.current?.(IDX_RESULT), 150)
  }

  const handleSeeAll = () => {
    scrollToRef.current?.(IDX_PRODUCTS)
  }

  // ── Rail items ────────────────────────────────────────────────────────────

  const railItems: RailItem[] = [

    // Hero (index 0) — scrollVh: 10 → câmera começa a avançar em ~10vh (sem zona morta)
    {
      type: 'section',
      scrollVh: 10,
      content: <HeroSection onNext={() => scrollToRef.current?.(IDX_FIRST_PAIN)} />,
    },

    // Pain cards + conclusion (indices 1-7)
    ...makePainItems(() => scrollToRef.current?.(IDX_DIAGNOSTIC)),

    // Diagnostic (index 8)
    {
      type: 'section',
      id: 'diagnostic',
      scrollVh: 25,
      content: <DiagnosticSection onComplete={handleDiagnosticComplete} />,
    },

    // Result (index 9) — A1: invisible until diagnostic done — fast lane
    {
      type: 'section',
      id: 'result',
      scrollVh: 12,
      active: flowStage === 'diagnostic_done',
      content: result ? (
        <ResultSection result={result} onSeeAll={handleSeeAll} />
      ) : null,
    },

    // Products A (index 11) — entry: Ebook + Desafio
    {
      type: 'section',
      scrollVh: 25,
      content: <ProductsSection slice="entry" />,
    },

    // Products B (index 12) — premium: Curso + Mentorias
    {
      type: 'section',
      scrollVh: 25,
      content: <ProductsSection slice="premium" />,
    },

    // Waitlist (index 13)
    {
      type: 'section',
      scrollVh: 25,
      content: <WaitlistSection />,
    },

    // Social (index 14)
    {
      type: 'section',
      scrollVh: 18,
      content: <SocialSection />,
    },
  ]

  return (
    <main className="relative min-h-screen text-white overflow-x-clip">
      <SpatialCardRail items={railItems} scrollToRef={scrollToRef} />
    </main>
  )
}
