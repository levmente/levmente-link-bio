'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { DiagnosticResult } from '@/lib/types'
import { Sparkles } from 'lucide-react'
import { trackResultViewed, trackTrailLinkClicked, normalizeProductId } from '@/lib/analytics'
import ProductCTA from '@/components/ui/ProductCTA'

type ResultSectionProps = {
  result: DiagnosticResult
  onSeeAll: () => void
}

export default function ResultSection({ result, onSeeAll }: ResultSectionProps) {
  useEffect(() => {
    trackResultViewed({
      result_type:       normalizeProductId(result.primary.id),
      result_title:      result.headline,
      secondary_product: result.secondary ? normalizeProductId(result.secondary.id) : undefined,
    })
  }, [result])
  return (
    <motion.section
      id="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto px-4 py-16"
    >
      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 mb-6"
      >
        <Sparkles size={14} className="text-violet-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
          Seu resultado
        </span>
        <Sparkles size={14} className="text-violet-400" />
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-white leading-snug">{result.headline}</h2>
        <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{result.subtext}</p>
      </motion.div>

      {/* Primary product */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative rounded-2xl border border-violet-500/60 bg-violet-500/[0.08] p-6 shadow-[0_0_50px_rgba(124,58,237,0.18)] mb-4"
      >
        <div className="absolute -top-3 left-4">
          <span className="text-xs font-bold bg-violet-600 text-white px-3 py-1 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            Esse é o próximo passo pra você
          </span>
        </div>

        {result.primary.badge && (
          <span className="inline-block text-xs font-semibold text-violet-300 border border-violet-500/30 rounded-full px-2.5 py-0.5 mb-3">
            {result.primary.badge}
          </span>
        )}

        <h3 className="text-lg font-bold text-white mb-1">{result.primary.name}</h3>
        <p className="text-sm text-violet-300 mb-3">{result.primary.tagline}</p>
        <p className="text-sm text-zinc-400 leading-relaxed mb-5">{result.primary.description}</p>

        <ProductCTA
          product={result.primary}
          source="result_primary"
          variant="primary"
          className="w-full py-3.5 text-sm"
          resultType={normalizeProductId(result.primary.id)}
        />
      </motion.div>

      {/* Secondary product */}
      {result.secondary && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-xl border border-white/8 bg-white/[0.025] p-4 mb-8"
        >
          <p className="text-xs text-zinc-600 mb-2">Outro caminho que pode fazer sentido pra você:</p>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{result.secondary.name}</p>
              <p className="text-xs text-zinc-500 leading-snug mt-0.5">{result.secondary.tagline}</p>
            </div>
            <ProductCTA
              product={result.secondary}
              source="result_secondary"
              variant="secondary"
              className="flex-shrink-0 py-2 px-4"
              resultType={normalizeProductId(result.primary.id)}
            />
          </div>
        </motion.div>
      )}

      {/* See all CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <button
          onClick={() => { trackTrailLinkClicked(); onSeeAll() }}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
        >
          Conhecer toda a trilha LevMente →
        </button>
      </motion.div>
    </motion.section>
  )
}
