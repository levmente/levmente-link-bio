'use client'

import { motion } from 'framer-motion'
import { productsList } from '@/lib/products'
import ProductCTA from '@/components/ui/ProductCTA'

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

export default function ProductsSection() {
  return (
    <section id="products" className="w-full max-w-md mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-500">
          A Trilha
        </span>
        <h2 className="text-2xl font-bold text-white mt-2 leading-snug">
          Cada passo, no seu tempo
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Do primeiro entendimento à transformação completa.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[22px] top-6 bottom-6 w-px bg-gradient-to-b from-violet-500/40 via-violet-500/20 to-transparent" />

        <div className="flex flex-col gap-4">
          {productsList.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-4"
            >
              {/* Step indicator */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div
                  className={`
                    w-11 h-11 rounded-full border-2 flex items-center justify-center text-sm font-bold z-10 bg-[#0A0A0F]
                    ${i === 0 ? 'border-zinc-600 text-zinc-400' : ''}
                    ${i === 1 ? 'border-blue-500/50 text-blue-400' : ''}
                    ${i === 2 ? 'border-violet-500/60 text-violet-400' : ''}
                    ${i === 3 ? 'border-violet-500 text-violet-300' : ''}
                    ${i === 4 ? 'border-amber-500/60 text-amber-400' : ''}
                  `}
                >
                  {i + 1}
                </div>
              </div>

              {/* Card */}
              <div
                className={`flex-1 min-w-0 rounded-xl border p-4 ${tierColors[i]} transition-all duration-200`}
              >
                <div className="mb-3">
                  {product.badge && (
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5 ${tierBadgeColors[i]}`}
                    >
                      {product.badge}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white leading-snug">{product.name}</h3>
                  <p
                    className={`text-xs mt-0.5 leading-snug ${
                      i >= 3 ? 'text-violet-300' : i >= 2 ? 'text-violet-400' : 'text-zinc-500'
                    }`}
                  >
                    {product.tagline}
                  </p>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed mb-3">{product.description}</p>

                <ProductCTA
                  product={product}
                  source="trail"
                  variant={i >= 3 ? 'primary' : 'secondary'}
                  className="w-full py-2"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
