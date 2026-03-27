'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, MessageCircle, Clock } from 'lucide-react'
import { Product } from '@/lib/types'
import {
  trackProductCtaClicked,
  buildOutboundUrl,
  normalizeProductId,
  ProductSource,
} from '@/lib/analytics'

type ProductCTAProps = {
  product: Product
  source: ProductSource
  variant?: 'primary' | 'secondary'
  className?: string
  /** ID do produto recomendado pelo diagnóstico (para rastrear result_type em CTAs de resultado). */
  resultType?: string
}

const COMING_SOON = '#'

export default function ProductCTA({
  product,
  source,
  variant = 'secondary',
  className = '',
  resultType,
}: ProductCTAProps) {
  const [feedback, setFeedback] = useState(false)

  const isComingSoon = product.href === COMING_SOON
  const isConsultive = product.linkType === 'whatsapp' || product.linkType === 'application'
  // External links open in new tab, except checkout (ebook stays in same tab)
  const openNewTab = product.href.startsWith('http') && product.linkType !== 'checkout'

  // URL com parâmetros de rastreamento mesclados
  const outboundUrl = isComingSoon ? COMING_SOON : buildOutboundUrl(product.href)

  const base =
    'relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer select-none'

  const variantClass = {
    primary:
      'bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.55)]',
    secondary:
      'border border-violet-500/40 text-violet-300 hover:border-violet-400 hover:text-violet-200 hover:bg-violet-500/10',
  }

  const handleClick = () => {
    if (isComingSoon) {
      setFeedback(true)
      setTimeout(() => setFeedback(false), 2200)
      return
    }
    trackProductCtaClicked({
      destination_product: normalizeProductId(product.id),
      destination_url:     outboundUrl,
      button_text:         product.cta,
      result_type:         resultType,
      position_on_page:    source,
      product_type:        product.productType,
      link_type:           product.linkType,
    })
  }

  // ── Produto com link real ────────────────────────────────────────────────
  if (!isComingSoon) {
    return (
      <motion.a
        href={outboundUrl}
        target={openNewTab ? '_blank' : undefined}
        rel={openNewTab ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        className={`${base} ${variantClass[variant]} ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        {isConsultive
          ? <MessageCircle size={12} className="flex-shrink-0" />
          : <ArrowRight size={12} className="flex-shrink-0" />
        }
        {product.cta}
      </motion.a>
    )
  }

  // ── Produto sem link — "em breve" ────────────────────────────────────────
  return (
    <motion.button
      onClick={handleClick}
      className={`${base} ${variantClass[variant]} ${className} overflow-hidden`}
      whileTap={{ scale: 0.97 }}
    >
      <AnimatePresence mode="wait">
        {feedback ? (
          <motion.span
            key="soon"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <Clock size={11} className="flex-shrink-0" />
            Em breve
          </motion.span>
        ) : (
          <motion.span
            key="cta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <ArrowRight size={12} className="flex-shrink-0" />
            {product.cta}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
