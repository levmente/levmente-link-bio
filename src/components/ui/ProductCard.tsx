'use client'

import { motion } from 'framer-motion'
import { Product } from '@/lib/types'
import GlowButton from './GlowButton'

type ProductCardProps = {
  product: Product
  highlighted?: boolean
  index?: number
}

export default function ProductCard({ product, highlighted, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`
        relative rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300
        ${
          highlighted
            ? 'border-violet-500/60 bg-violet-500/[0.07] shadow-[0_0_40px_rgba(124,58,237,0.15)]'
            : 'border-white/8 bg-white/[0.025] hover:border-white/15'
        }
      `}
    >
      {product.badge && (
        <span
          className={`
            self-start text-xs font-semibold px-3 py-1 rounded-full
            ${highlighted ? 'bg-violet-600 text-white' : 'bg-white/8 text-zinc-400'}
          `}
        >
          {product.badge}
        </span>
      )}

      <div>
        <h3 className="text-base font-bold text-white leading-snug">{product.name}</h3>
        <p className="text-sm text-violet-300 mt-0.5">{product.tagline}</p>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">{product.description}</p>

      <p className="text-xs text-zinc-500 italic border-t border-white/5 pt-3">{product.forWhom}</p>

      <GlowButton
        href={product.href}
        variant={highlighted ? 'primary' : 'secondary'}
        className="mt-auto w-full justify-center"
      >
        {product.cta}
      </GlowButton>
    </motion.div>
  )
}
