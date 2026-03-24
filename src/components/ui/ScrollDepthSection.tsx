'use client'

/**
 * ScrollDepthSection — mesma arquitetura do SpatialCardRail
 *
 * Dois motion.div aninhados para evitar conflito initial/animate vs style:
 *
 *   EXTERNO — entrada one-shot (inicial → focal):
 *     initial: scale 0.78, rotateX 14°, y 80, opacity 0
 *     animate: scale 1.0,  rotateX 0°,  y 0,  opacity 1
 *     → dispara no mount, não usa scroll
 *
 *   INTERNO — saída scroll-driven (focal → recua):
 *     scrollYProgress 0%→75%: fixo no estado focal (1.0, 0, 0, 1)
 *     scrollYProgress 75%→100%: recua no corredor (0.82, -8°, -60, 0)
 *     → scale e transforms compõem com o externo via CSS
 *
 * Por que aninhado?
 *   style (motion values) override animate no mesmo elemento.
 *   Separando, o externo completa a entrada e fica em scale=1.
 *   O interno recua via scroll sem interferir.
 *
 * Resultado: idêntico ao SpatialCardRail onde relZ=0 → focal imediato.
 *   Sessão 2: card 0 em focal quando scrollYProgress=0 (visível ao entrar)
 *   Aqui: conteúdo em focal quando sticky entra na viewport (visível imediatamente)
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type Props = {
  children: React.ReactNode
  scrollHeight?: number
}

export default function ScrollDepthSection({ children, scrollHeight = 200 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // ── SAÍDA: scroll-driven, 75%→100% ───────────────────────────────────────
  // 0%→75%: fixo no estado focal (sem mudança)
  // 75%→100%: recua no corredor, igual ao card passando pela câmera
  const exitScale = useTransform(
    scrollYProgress,
    [0,   0.75, 1.0 ],
    [1.0, 1.0,  0.82],
  )
  const exitOpacity = useTransform(
    scrollYProgress,
    [0,   0.78, 1.0],
    [1.0, 1.0,  0.0],
  )
  const exitRotateX = useTransform(
    scrollYProgress,
    [0,  0.75, 1.0],
    [0,  0,    -8  ],
  )
  const exitY = useTransform(
    scrollYProgress,
    [0,  0.75, 1.0],
    [0,  0,    -60 ],
  )

  return (
    // Container explícito — cria scroll real estate (idêntico ao N×100vh do SpatialCardRail)
    <div ref={ref} style={{ height: `${scrollHeight}vh` }}>

      {/* Stage fixo — idêntico ao sticky do SpatialCardRail */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          perspective: '600px',
          perspectiveOrigin: '50% 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

        {/* EXTERNO: entrada one-shot — de trás do corredor para focal */}
        <motion.div
          initial={{ scale: 0.78, rotateX: 14, y: 80, opacity: 0 }}
          animate={{ scale: 1, rotateX: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', transformOrigin: 'center 50%' }}
        >

          {/* INTERNO: saída scroll-driven — recua no corredor ao sair */}
          <motion.div
            style={{
              scale: exitScale,
              opacity: exitOpacity,
              rotateX: exitRotateX,
              y: exitY,
              transformOrigin: 'center 50%',
              width: '100%',
            }}
          >
            {children}
          </motion.div>

        </motion.div>
      </div>

    </div>
  )
}
