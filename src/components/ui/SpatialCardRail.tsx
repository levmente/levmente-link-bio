'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, MotionValue, useMotionValueEvent } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

export type RailCard = {
  type?: 'card'
  label?: string
  context?: string
  impact: string
  accent: string
  isRevelation?: true
  scrollVh?: number
}

export type RailSection = {
  type: 'section'
  id?: string
  content: React.ReactNode
  scrollVh?: number
  active?: boolean      // false → opacity 0, pointer-events none (A1 guard)
  scrollable?: boolean  // true → overflowY:auto (Products only); default: overflow:hidden
}

export type RailItem = RailCard | RailSection

type Props = {
  items: RailItem[]
  scrollToRef?: React.MutableRefObject<((index: number) => void) | null>
}

// ─── Camera constants ─────────────────────────────────────────────────────────

const STEP_Z        = 360
const PERSP         = 900   // cards — standard depth
const PERSP_SECTION = 200   // sections — aggressive depth compression (52%→100% growth)
const X_DRIFT       = 40
const DEFAULT_CARD_VH    = 80   // vh per card (dwell window)
const DEFAULT_SECTION_VH = 200  // vh per section — fallback only, normally set per-item
const TRANSITION_VH      = 22   // vh for camera transition between items

// ─── Interactivity thresholds ─────────────────────────────────────────────────

// Sections: opacity fades over 220px ahead (first visible at 39% through transition,
// visible for 61% of the journey). Scale uses PERSP_SECTION=200 — section grows
// from 52.6% to 100% as it approaches, creating a clear tunnel-traversal feeling.
// No focal lock: PERSP formula is continuous at rz=0 (scale=1.0 exact). At rz=5px,
// scale=0.976 — imperceptible wobble. Stability holds naturally.
const SECTION_FADE_AHEAD  = 220  // px — linear fade: relZ 220→0 = opacity 0→1
const SECTION_FADE_BEHIND = 200  // px — exit window: section advances ~14vh before gone
const FOCAL_RADIUS        = 110  // px — |relZ| < this → pointer-events auto

// ─── Dwell map ────────────────────────────────────────────────────────────────
//
// totalVh = Σ scrollVh[i] + (N-1) × TRANSITION_VH
// dwellFrac[i] = scrollVh[i] / totalVh
// transitionFrac = TRANSITION_VH / totalVh

type DwellMap = {
  inputs:      number[]
  outputs:     number[]
  dwellStarts: number[]
  dwellEnds:   number[]
  totalVh:     number
}

function buildDwellMap(items: RailItem[]): DwellMap {
  const N = items.length
  if (N === 0) return { inputs: [0, 1], outputs: [0, 0], dwellStarts: [], dwellEnds: [], totalVh: 100 }

  const scrollVhs = items.map(item =>
    item.scrollVh ?? (item.type === 'section' ? DEFAULT_SECTION_VH : DEFAULT_CARD_VH)
  )

  if (N === 1) {
    return { inputs: [0, 1], outputs: [0, 0], dwellStarts: [0], dwellEnds: [1], totalVh: scrollVhs[0] }
  }

  const totalVh        = scrollVhs.reduce((a, b) => a + b, 0) + (N - 1) * TRANSITION_VH
  const transitionFrac = TRANSITION_VH / totalVh

  const inputs:      number[] = []
  const outputs:     number[] = []
  const dwellStarts: number[] = []
  const dwellEnds:   number[] = []

  let cursor = 0
  for (let i = 0; i < N; i++) {
    const dwellFrac = scrollVhs[i] / totalVh
    const ds = cursor
    const de = cursor + dwellFrac
    inputs.push(ds, de)
    outputs.push(i * STEP_Z, i * STEP_Z)
    dwellStarts.push(ds)
    dwellEnds.push(de)
    cursor = de + (i < N - 1 ? transitionFrac : 0)
  }

  return { inputs, outputs, dwellStarts, dwellEnds, totalVh }
}

// ─── AccentedText ─────────────────────────────────────────────────────────────

function AccentedText({ text, accent }: { text: string; accent: string }) {
  const idx = text.indexOf(accent)
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-violet-300">{accent}</span>
      {text.slice(idx + accent.length)}
    </>
  )
}

// ─── CameraCard ───────────────────────────────────────────────────────────────
//
// Unchanged from original — cards keep their optical curves, x-drift, blur.

function CameraCard({
  card,
  index,
  cameraZ,
}: {
  card: RailCard
  index: number
  cameraZ: MotionValue<number>
}) {
  const isLast     = card.isRevelation === true
  const cardWorldZ = index * STEP_Z
  const xDir       = isLast ? 0 : index % 2 === 0 ? -1 : 1

  const relZ = useTransform(cameraZ, (v: number) => cardWorldZ - v)

  const scale = useTransform(relZ, (rz: number) => {
    const perspScale = PERSP / (PERSP + Math.max(-120, rz))
    const boost      = 1 + 0.08 * Math.max(0, 1 - Math.abs(rz) / STEP_Z)
    return perspScale * boost
  })

  const opacity = useTransform(relZ, (rz: number) => {
    if (rz < -65) return 0
    if (rz < 0)   return Math.max(0, 1 + rz / 65)
    if (rz > STEP_Z * 1.4) return 0
    if (rz > STEP_Z * 0.7) return Math.max(0, 0.10 * (1 - (rz - STEP_Z * 0.7) / (STEP_Z * 0.7)))
    return 1 - (rz / (STEP_Z * 0.7)) * 0.90
  })

  const x = useTransform(relZ, (rz: number) => {
    if (rz <= 0) return 0
    return xDir * X_DRIFT * Math.min(1, rz / STEP_Z)
  })

  const y = useTransform(relZ, (rz: number) => {
    if (rz <= 0) return 0
    return -20 * Math.min(1, rz / STEP_Z)
  })

  const rotateY = useTransform(relZ, (rz: number) => {
    if (rz <= 0) return 0
    return xDir * 3.5 * Math.min(1, rz / STEP_Z)
  })

  const filter = useTransform(relZ, (rz: number) => {
    if (Math.abs(rz) <= 70) return 'none'
    if (rz > 70) {
      const t    = Math.min(1, (rz - 70) / (STEP_Z * 0.7))
      const blur = t * t * 10
      return blur < 0.4 ? 'none' : `blur(${blur.toFixed(1)}px)`
    }
    const t    = Math.min(1, (-rz - 70) / 80)
    const blur = t * 4
    return blur < 0.4 ? 'none' : `blur(${blur.toFixed(1)}px)`
  })

  const cardBg = useTransform(relZ, (rz: number) => {
    const d = Math.abs(rz)
    if (d >= STEP_Z * 0.7) return 'rgba(8,8,14,0.72)'
    const t     = 1 - d / (STEP_Z * 0.7)
    const alpha = (0.72 + t * 0.25).toFixed(2)
    return `rgba(3,3,8,${alpha})`
  })

  const cardShadow = useTransform(relZ, (rz: number) => {
    const d = Math.abs(rz)
    if (d > STEP_Z * 0.7) return 'none'
    const t = 1 - d / (STEP_Z * 0.7)
    if (isLast) {
      const a1 = (t * 0.30).toFixed(2)
      const a2 = (t * 0.12).toFixed(2)
      const r1 = Math.round(t * 48)
      const r2 = Math.round(t * 18)
      return `0 0 ${r1}px rgba(124,58,237,${a1}), 0 0 ${r2}px rgba(167,139,250,${a2}), inset 0 1px 0 rgba(167,139,250,${(t * 0.18).toFixed(2)})`
    }
    const a1 = (t * 0.18).toFixed(2)
    const r1 = Math.round(t * 28)
    return `0 0 ${r1}px rgba(124,58,237,${a1}), inset 0 1px 0 rgba(167,139,250,${(t * 0.10).toFixed(2)})`
  })

  const borderColor = useTransform(relZ, (rz: number) => {
    const d = Math.abs(rz)
    if (d > STEP_Z * 0.7) return isLast ? 'rgba(167,139,250,0.10)' : 'rgba(124,58,237,0.08)'
    const t = 1 - d / (STEP_Z * 0.7)
    if (isLast) return `rgba(167,139,250,${(0.10 + t * 0.38).toFixed(2)})`
    return `rgba(124,58,237,${(0.08 + t * 0.24).toFixed(2)})`
  })

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ scale, opacity, x, y, rotateY, filter, willChange: 'transform, opacity' }}
    >
      <motion.div
        className="relative rounded-2xl p-6"
        style={{
          width: 'calc(100% - 2rem)',
          maxWidth: isLast ? 388 : 358,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: cardBg,
          boxShadow: cardShadow,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor,
          paddingTop: isLast ? '2rem' : '1.5rem',
          paddingBottom: isLast ? '2rem' : '1.5rem',
        }}
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-violet-400/40 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-violet-400/40 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-violet-400/18 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-violet-400/18 rounded-br-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-3 text-center">
          {card.label && (
            <div className="inline-flex items-center justify-center gap-0.5 text-[0.52rem] font-mono tracking-[0.18em] text-violet-500/45 uppercase">
              <span className="text-violet-500/20">[</span>
              {card.label}
              <span className="text-violet-500/20">]</span>
            </div>
          )}
          {card.context && (
            <p className="text-sm text-zinc-400 leading-relaxed">{card.context}</p>
          )}
          <p className={`font-extrabold text-white leading-tight tracking-tight ${isLast ? 'text-[2rem]' : 'text-[1.75rem]'}`}>
            <AccentedText text={card.impact} accent={card.accent} />
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── CameraSection ────────────────────────────────────────────────────────────
//
//   OPACITY — long approach, snappy exit:
//     ahead:  relZ 220→0   → 0→1   (visible for 61% of STEP_Z — tunnel traversal)
//     behind: relZ 0→-65   → 1→0   (camera passes through — quick fade)
//
//   SCALE — continuous perspective, no focal lock:
//     ahead:  relZ > 0     → PERSP_SECTION/(PERSP_SECTION+rz) — 52.6%→100%
//     focal:  relZ = 0     → 1.0 exact (formula is continuous, no snap)
//     behind: relZ 0→-65   → 1.0→1.08 (rushes past camera)
//     Growth during visible approach: 47.4% — strong tunnel-depth feel.
//
//   Y — approaches from below, upward rush on exit:
//     ahead:  relZ > 0     → -30px×(rz/STEP_Z) → 0  (converges from below)
//     behind: relZ 0→-65   → 0 → -14px
//
//   BLUR — none
//
//   POINTER-EVENTS — focal window:
//     |relZ| < FOCAL_RADIUS (110px) AND isActive → 'auto'

function CameraSection({
  item,
  index,
  cameraZ,
}: {
  item: RailSection
  index: number
  cameraZ: MotionValue<number>
}) {
  const sectionWorldZ = index * STEP_Z
  const relZ          = useTransform(cameraZ, (v: number) => sectionWorldZ - v)

  // ── Opacity — linear fade ahead (120px window), grace behind ────────────
  // Section is invisible for most of the camera transition; only appears in
  // the final 33% (120/360px) of approach. Combined with the strong scale
  // compression below, this creates a clear "emerging from depth" feeling
  // without popping (the section grows ~29% during the visible fade).
  const cameraOpacity = useTransform(relZ, (rz: number) => {
    if (rz < -SECTION_FADE_BEHIND) return 0
    if (rz < 0) return Math.max(0, 1 + rz / SECTION_FADE_BEHIND)
    if (rz > SECTION_FADE_AHEAD) return 0
    return 1 - rz / SECTION_FADE_AHEAD
  })

  // A1 guard: multiply by 0 when active=false prevents activation
  const isActive = item.active !== false
  const opacity  = useTransform(cameraOpacity, (v: number) => isActive ? v : 0)

  // ── Scale — continuous perspective approach, rushes past on exit ─────────
  // No focal lock: PERSP_SECTION/rz formula is naturally 1.0 at rz=0 and
  // converges smoothly (rz=5→0.976, rz=1→0.995). Stability is inherent.
  const scale = useTransform(relZ, (rz: number) => {
    if (rz > 0) return Math.max(0.40, PERSP_SECTION / (PERSP_SECTION + rz))
    if (rz === 0) return 1.0
    const t = Math.min(1, -rz / SECTION_FADE_BEHIND)
    return 1.0 + t * 0.15   // exits at 1.15 — passes the camera decisively
  })

  // ── Y — approaches from below, upward rush on exit ────────────────────────
  const y = useTransform(relZ, (rz: number) => {
    if (rz > 0) return -30 * Math.min(1, rz / STEP_Z)
    return -28 * Math.min(1, -rz / SECTION_FADE_BEHIND)
  })

  // ── Pointer-events — focal window via direct DOM mutation ─────────────────
  // Using a ref + direct style update to avoid React re-renders on every frame.
  // isActiveRef always holds the latest value without stale closure issues.
  const contentRef  = useRef<HTMLDivElement>(null)
  const isActiveRef = useRef(isActive)
  isActiveRef.current = isActive

  useMotionValueEvent(relZ, 'change', (rz) => {
    if (!contentRef.current) return
    contentRef.current.style.pointerEvents =
      (isActiveRef.current && Math.abs(rz) < FOCAL_RADIUS) ? 'auto' : 'none'
  })

  // Sync immediately when isActive changes (relZ may not fire at that moment)
  useEffect(() => {
    if (!contentRef.current) return
    contentRef.current.style.pointerEvents =
      (isActive && Math.abs(relZ.get()) < FOCAL_RADIUS) ? 'auto' : 'none'
  }, [isActive, relZ])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ scale, opacity, y, willChange: 'transform, opacity' }}
    >
      {/* Content wrapper fills the full viewport-height stage and centers the
          section within it. overflow:hidden prevents horizontal scroll from
          absolute children (HeroSection orbs) and blocks inner scroll
          containers. Only scrollable:true sections get overflowY:auto. */}
      <div
        ref={contentRef}
        id={item.id}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: item.scrollable ? undefined : 'hidden',
          overflowY: item.scrollable ? 'auto' : undefined,
          overscrollBehavior: item.scrollable ? 'contain' : undefined,
          pointerEvents: 'none',  // initial; overridden by effect
        }}
      >
        {item.content}
      </div>
    </motion.div>
  )
}

// ─── SpatialCardRail ──────────────────────────────────────────────────────────

export default function SpatialCardRail({ items, scrollToRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const N = items.length

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const { inputs, outputs, dwellStarts, dwellEnds, totalVh } = buildDwellMap(items)

  const dwellMapRef = useRef({ dwellStarts, dwellEnds, totalVh })
  dwellMapRef.current = { dwellStarts, dwellEnds, totalVh }

  // cameraZ: frozen at item worldZ during dwell, linearly transitions between items
  const cameraZ = useTransform(scrollYProgress, inputs, outputs)

  // Stage Y: 10px total drift — barely perceptible, confirms continuous motion
  const stageY = useTransform(scrollYProgress, [0, 1], [-5, 5])

  // Floor grid scrolls with the camera on the depth axis only (Y in local pre-rotation
  // space). Factor 0.12: ~43px per STEP_Z (0.54 tile per step) — subtle first pass.
  // No X component → zero lateral noise.
  const floorY = useTransform(cameraZ, (z: number) => `0px ${z * 0.12}px`)

  // Scroll indicator: visible at rest, fades out as soon as the user starts scrolling
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.015], [1, 0])

  // ── ScrollTo imperative handle ──────────────────────────────────────────────
  useEffect(() => {
    if (!scrollToRef) return
    scrollToRef.current = (index: number) => {
      const container = containerRef.current
      if (!container) return
      const { dwellStarts: ds, totalVh: tvh } = dwellMapRef.current
      const progress     = ds[index] ?? 0
      const containerTop = container.getBoundingClientRect().top + window.scrollY
      const containerH   = container.clientHeight
      const windowH      = window.innerHeight
      const scrollY      = containerTop + progress * (containerH - windowH)
      window.scrollTo({ top: Math.max(0, scrollY), behavior: 'smooth' })
    }
  }, [scrollToRef])

  return (
    // Stage is always visible — no fade-in delay (Hero is items[0], must be
    // immediately visible on page load without any scroll)
    <div ref={containerRef} style={{ height: `${totalVh}vh` }} className="relative">
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ y: stageY }}
      >

        {/* ── Corridor atmosphere ──────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute"
            style={{
              top: '38%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '480px', height: '280px',
              background: 'radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, rgba(124,58,237,0.04) 50%, transparent 72%)',
            }}
          />
          <div className="absolute bottom-0 inset-x-0 h-[46%] overflow-hidden">
            <motion.div style={{
              position: 'absolute', inset: '-10% 0 0',
              backgroundImage: 'linear-gradient(rgba(124,58,237,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.09) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              backgroundPosition: floorY,
              transform: 'perspective(360px) rotateX(78deg)',
              transformOrigin: '50% 0%',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.15) 75%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.15) 75%, transparent 100%)',
            }} />
          </div>
        </div>

        {/* ── Stage ────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center">
          {items.map((item, i) =>
            item.type === 'section' ? (
              <CameraSection key={i} item={item} index={i} cameraZ={cameraZ} />
            ) : (
              <CameraCard key={i} card={item as RailCard} index={i} cameraZ={cameraZ} />
            )
          )}
        </div>

        {/* ── Scroll indicator ─────────────────────────────────────────────── */}
        <motion.div
          style={{
            opacity: scrollIndicatorOpacity,
            bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
          }}
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1"
        >
          <span className="text-sm text-white/70 tracking-wide">Role para continuar</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="text-base text-white/80"
          >
            ↓
          </motion.span>
        </motion.div>

      </motion.div>
    </div>
  )
}
