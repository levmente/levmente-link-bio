'use client'

import { useState, useRef, useEffect } from 'react'
import { DiagnosticState, DiagnosticResult } from '@/lib/types'
import { getResult } from '@/lib/diagnostic'
import { trackPageViewed, trackScrollDepth, trackSectionViewed } from '@/lib/analytics'

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

  // ── Tracking: page viewed ─────────────────────────────────────────────────
  useEffect(() => {
    trackPageViewed()
  }, [])

  // ── Tracking: scroll depth ────────────────────────────────────────────────
  useEffect(() => {
    const fired = new Set<number>()
    const thresholds = [25, 50, 75, 90] as const

    const handleScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return
      const pct = (scrolled / total) * 100

      for (const t of thresholds) {
        if (!fired.has(t) && pct >= t) {
          fired.add(t)
          trackScrollDepth(t)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Tracking: section viewed ──────────────────────────────────────────────
  useEffect(() => {
    const sectionIds = ['hero', 'diagnostic', 'result', 'products-entry', 'products-premium', 'waitlist']
    const observed = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute('id')
          if (id && entry.isIntersecting && !observed.has(id)) {
            observed.add(id)
            trackSectionViewed(id)
          }
        }
      },
      { threshold: 0.3 }
    )

    const attach = () => {
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      }
    }

    // Pequeno delay para garantir que o DOM já montou as seções dinâmicas
    const timer = setTimeout(attach, 600)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
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

    // Hero (index 0)
    {
      type: 'section',
      scrollVh: 20,
      content: <HeroSection onNext={() => scrollToRef.current?.(IDX_FIRST_PAIN)} />,
    },

    // Pain cards + conclusion (indices 1-7)
    ...makePainItems(() => scrollToRef.current?.(IDX_DIAGNOSTIC)),

    // Diagnostic (index 8)
    {
      type: 'section',
      id: 'diagnostic',
      scrollVh: 40,
      content: <DiagnosticSection onComplete={handleDiagnosticComplete} />,
    },

    // Result (index 9) — A1: invisible until diagnostic done — fast lane
    {
      type: 'section',
      id: 'result',
      scrollVh: 25,
      active: flowStage === 'diagnostic_done',
      content: result ? (
        <ResultSection result={result} onSeeAll={handleSeeAll} />
      ) : null,
    },

    // Products A (index 10) — entry: Ebook + Desafio
    {
      type: 'section',
      scrollVh: 38,
      content: <ProductsSection slice="entry" />,
    },

    // Products B (index 11) — premium: Curso + Mentorias
    {
      type: 'section',
      scrollVh: 38,
      content: <ProductsSection slice="premium" />,
    },

    // Waitlist (index 12)
    {
      type: 'section',
      scrollVh: 32,
      content: <WaitlistSection />,
    },

    // Social (index 13)
    {
      type: 'section',
      scrollVh: 22,
      content: <SocialSection />,
    },
  ]

  return (
    <main className="relative min-h-screen text-white overflow-x-clip">
      <SpatialCardRail items={railItems} scrollToRef={scrollToRef} />
    </main>
  )
}
