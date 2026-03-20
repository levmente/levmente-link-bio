'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { DiagnosticState, DiagnosticResult } from '@/lib/types'
import { getResult } from '@/lib/diagnostic'
import { trackPageEntered } from '@/lib/analytics'

import HeroSection from '@/components/sections/HeroSection'
import PainSection from '@/components/sections/PainSection'
import DiagnosticSection from '@/components/sections/DiagnosticSection'
import ConfessionSection from '@/components/sections/ConfessionSection'
import ResultSection from '@/components/sections/ResultSection'
import ProductsSection from '@/components/sections/ProductsSection'
import WaitlistSection from '@/components/sections/WaitlistSection'
import SocialSection from '@/components/sections/SocialSection'

// ─── Estado do fluxo ─────────────────────────────────────────────────────────
//
//  idle → diagnostic_done → confession_done
//
//  idle:             mostra diagnóstico
//  diagnostic_done:  mostra confissão (opcional), result fica oculto
//  confession_done:  mostra result

type FlowStage = 'idle' | 'diagnostic_done' | 'confession_done'

export default function Home() {
  const [flowStage, setFlowStage] = useState<FlowStage>('idle')
  const [diagnosticState, setDiagnosticState] = useState<DiagnosticState | null>(null)
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    trackPageEntered()
  }, [])

  // Diagnóstico concluído → computa resultado, abre confissão
  const handleDiagnosticComplete = (state: DiagnosticState) => {
    const r = getResult(state)
    setDiagnosticState(state)
    setResult(r)
    setFlowStage('diagnostic_done')
    setTimeout(() => {
      document.getElementById('confession')?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }

  // Confissão concluída (enviada ou pulada) → exibe resultado
  const handleConfessionDone = () => {
    setFlowStage('confession_done')
    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleSeeAll = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
      <HeroSection />
      <PainSection />
      <DiagnosticSection onComplete={handleDiagnosticComplete} />

      {/* Confissão — aparece após diagnóstico, desaparece após continuar */}
      <AnimatePresence>
        {flowStage === 'diagnostic_done' && diagnosticState && (
          <div id="confession">
            <ConfessionSection
              diagnosticState={diagnosticState}
              onContinue={handleConfessionDone}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Resultado — aparece apenas após confissão */}
      <AnimatePresence>
        {flowStage === 'confession_done' && result && (
          <ResultSection result={result} onSeeAll={handleSeeAll} />
        )}
      </AnimatePresence>

      <div ref={productsRef}>
        <ProductsSection />
      </div>

      <WaitlistSection />
      <SocialSection />
    </main>
  )
}
