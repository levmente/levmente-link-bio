'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type SectionWrapperProps = {
  children: ReactNode
  className?: string
  id?: string
  delay?: number
}

export default function SectionWrapper({
  children,
  className = '',
  id,
  delay = 0,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full max-w-md mx-auto px-4 ${className}`}
    >
      {children}
    </motion.section>
  )
}
