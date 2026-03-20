'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type GlowButtonProps = {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  disabled?: boolean
}

export default function GlowButton({
  children,
  onClick,
  href,
  variant = 'primary',
  className = '',
  disabled = false,
}: GlowButtonProps) {
  const base =
    'relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer select-none'

  const variants = {
    primary:
      'bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] hover:bg-violet-500 active:scale-95',
    secondary:
      'border border-violet-500/40 text-violet-300 hover:border-violet-400 hover:text-violet-200 hover:bg-violet-500/10 active:scale-95',
    ghost:
      'text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95',
  }

  const classes = `${base} ${variants[variant]} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}
