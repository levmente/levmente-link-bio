'use client'

import { motion } from 'framer-motion'
import { productsList } from '@/lib/products'
import ProductCTA from '@/components/ui/ProductCTA'

// ─── Tier styles (index = global product index 0-4) ───────────────────────────

const tierColors = [
  'border-zinc-700/50 bg-white/[0.02]',
  'border-blue-500/20 bg-blue-500/[0.03]',
  'border-violet-500/30 bg-violet-500/[0.05]',
  'border-violet-500/50 bg-violet-500/[0.07]',
  'border-amber-500/40 bg-amber-500/[0.05]',
]

const tierBadgeColors = [
  'bg-white/8 text-zinc-400',
  'bg-blue-500/15 text-blue-300',
  'bg-violet-500/15 text-violet-300',
  'bg-violet-600/20 text-violet-200',
  'bg-amber-500/15 text-amber-300',
]

const tierHoverShadow = [
  '0 12px 32px rgba(113,113,122,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
  '0 12px 32px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
  '0 12px 32px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
  '0 12px 32px rgba(139,92,246,0.32), inset 0 1px 0 rgba(255,255,255,0.06)',
  '0 12px 32px rgba(245,158,11,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
]

const stepGlow = [
  '0 0 16px rgba(113,113,122,0.35)',
  '0 0 18px rgba(59,130,246,0.4)',
  '0 0 20px rgba(124,58,237,0.5)',
  '0 0 24px rgba(139,92,246,0.6)',
  '0 0 22px rgba(245,158,11,0.45)',
]

// Per-item connector: gradient from this tier color to the next
const connectorFrom = [
  'rgba(113,113,122,0.45)',
  'rgba(59,130,246,0.42)',
  'rgba(124,58,237,0.55)',
  'rgba(139,92,246,0.55)',
]
const connectorTo = [
  'rgba(59,130,246,0.42)',
  'rgba(124,58,237,0.48)',
  'rgba(139,92,246,0.55)',
  'rgba(245,158,11,0.45)',
]

// Terminal cap color on the last item of each slice
const capColor = {
  entry:   'rgba(59,130,246,0.55)',
  premium: 'rgba(245,158,11,0.55)',
}

// ─── Slice config ─────────────────────────────────────────────────────────────

const SLICE_CONFIG = {
  entry: {
    range:    [0, 2] as [number, number],
    label:    'A Trilha',
    headline: 'Entenda e comece a mover',
    sub:      'Os dois primeiros passos. Acessíveis, diretos, sem enrolação.',
  },
  premium: {
    range:    [2, 5] as [number, number],
    label:    'A Trilha',
    headline: 'Da prática à transformação',
    sub:      'Para quem quer ir fundo e ter acompanhamento real.',
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = { slice?: 'entry' | 'premium' }

export default function ProductsSection({ slice = 'entry' }: Props) {
  const cfg      = SLICE_CONFIG[slice]
  const products = productsList.slice(...cfg.range)

  return (
    <section id={`products-${slice}`} className="w-full max-w-[420px] mx-auto px-4 py-3">

      {/* Header */}
      <div className="text-center mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-500">
          {cfg.label}
        </span>
        <h2 className="text-xl font-bold text-white mt-2 leading-snug">
          {cfg.headline}
        </h2>
        <p className="text-sm text-zinc-400 mt-1">{cfg.sub}</p>
      </div>

      {/* Timeline — per-item connectors, no global absolute line */}
      <div className="flex flex-col gap-2">
        {products.map((product, localIdx) => {
          const globalIdx = cfg.range[0] + localIdx
          const isLast    = localIdx === products.length - 1

          return (
            <div key={product.id} className="flex gap-4">

              {/* Step column: dot → connector (or terminal cap on last) */}
              <div className="flex-shrink-0 flex flex-col items-center">

                {/* Step dot */}
                <div
                  className={`
                    w-11 h-11 rounded-full border-2 flex items-center justify-center
                    text-sm font-bold z-10 flex-shrink-0
                    ${globalIdx === 0 ? 'border-zinc-600 text-zinc-400' : ''}
                    ${globalIdx === 1 ? 'border-blue-500/50 text-blue-400' : ''}
                    ${globalIdx === 2 ? 'border-violet-500/60 text-violet-400' : ''}
                    ${globalIdx === 3 ? 'border-violet-500 text-violet-300' : ''}
                    ${globalIdx === 4 ? 'border-amber-500/60 text-amber-400' : ''}
                  `}
                  style={{ boxShadow: stepGlow[globalIdx] }}
                >
                  {globalIdx + 1}
                </div>

                {/* Connector to next item: flex-1 fills card height, pb-2 bridges gap-2 */}
                {!isLast ? (
                  <div
                    className="w-px flex-1 min-h-[12px] pb-2"
                    style={{
                      background: `linear-gradient(to bottom, ${connectorFrom[globalIdx]}, ${connectorTo[globalIdx]})`,
                    }}
                  />
                ) : (
                  /* Terminal cap — closes the trail on the last item */
                  <div
                    className="mt-1.5 w-[5px] h-[5px] rounded-full flex-shrink-0"
                    style={{
                      background: capColor[slice],
                      boxShadow: `0 0 6px ${capColor[slice]}`,
                    }}
                  />
                )}
              </div>

              {/* Product card */}
              <motion.div
                className={`flex-1 min-w-0 rounded-xl border p-3 ${tierColors[globalIdx]} cursor-default`}
                whileHover={{
                  y: -3,
                  scale: 1.015,
                  boxShadow: tierHoverShadow[globalIdx],
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className="mb-1.5">
                  {product.badge && (
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${tierBadgeColors[globalIdx]}`}>
                      {product.badge}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white leading-snug">{product.name}</h3>
                  <p className={`text-xs mt-0.5 leading-snug ${
                    globalIdx >= 3 ? 'text-violet-300' : globalIdx >= 2 ? 'text-violet-400' : 'text-zinc-500'
                  }`}>
                    {product.tagline}
                  </p>
                </div>

                <p className="text-xs text-zinc-500 leading-snug line-clamp-2 mb-2">
                  {product.description}
                </p>

                <ProductCTA
                  product={product}
                  source="trail"
                  variant={globalIdx >= 3 ? 'primary' : 'secondary'}
                  className="w-full py-2"
                />
              </motion.div>

            </div>
          )
        })}
      </div>

      {/* Bridge — only on premium slice, leads into Waitlist */}
      {slice === 'premium' && (
        <p className="mt-3 text-center text-xs text-zinc-600">
          E ainda há mais chegando.
        </p>
      )}

    </section>
  )
}
