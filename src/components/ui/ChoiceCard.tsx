'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type ChoiceCardProps = {
  label: string
  icon?: ReactNode
  selected?: boolean
  onClick: () => void
}

export default function ChoiceCard({ label, icon, selected, onClick }: ChoiceCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-4 rounded-xl border transition-all duration-200 cursor-pointer
        ${
          selected
            ? 'border-violet-500 bg-violet-500/15 text-white shadow-[0_0_24px_rgba(124,58,237,0.3),inset_0_1px_0_rgba(167,139,250,0.15),inset_0_0_20px_rgba(124,58,237,0.06)]'
            : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:border-violet-500/50 hover:bg-violet-500/[0.04] hover:text-white hover:shadow-[0_6px_24px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.05)]'
        }
      `}
      whileHover={{ y: -3, rotateY: 1.5, rotateX: -0.8 }}
      whileTap={{ y: 0, scale: 0.98 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ transformPerspective: 900 }}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className={`text-xl flex-shrink-0 ${selected ? 'opacity-100' : 'opacity-60'}`}>
            {icon}
          </span>
        )}
        <span className="text-sm font-medium leading-snug">{label}</span>
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center"
          >
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        )}
      </div>
    </motion.button>
  )
}
