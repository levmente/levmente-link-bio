/**
 * Analytics — LevMente
 *
 * Funil de conversão mapeado:
 *
 *  page_entered
 *    └─ hero_cta_clicked
 *         └─ diagnostic_step_answered (step 1 — pain)
 *              └─ diagnostic_step_answered (step 2 — life)
 *                   └─ diagnostic_step_answered (step 3 — stage)
 *                        └─ diagnostic_completed
 *                             └─ result_viewed
 *                                  └─ product_cta_clicked  ← conversão
 *
 *  trail_link_clicked  (acesso direto à trilha)
 *  waitlist_submitted  (interesse no app LevMente)
 */

import posthog from 'posthog-js'

function isReady(): boolean {
  return typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_POSTHOG_KEY
}

function capture(event: string, props?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] 📊 ${event}`, props ?? '')
  }
  posthog.capture(event, props)
}

// ─── Tipos dos eventos ────────────────────────────────────────────────────────

export type ProductSource = 'result_primary' | 'result_secondary' | 'trail'

// re-export para uso nos componentes sem precisar importar de types.ts
export type { ProductType, LinkType } from './types'

// ─── Funnel events ────────────────────────────────────────────────────────────

/** Dispara quando a página carrega. Inclui UTM params automaticamente via PostHog. */
export function trackPageEntered() {
  if (!isReady()) return
  capture('page_entered', {
    $referrer: document.referrer || '(direct)',
    $current_url: window.location.href,
  })
}

/** CTA principal do Hero clicado. */
export function trackHeroCtaClicked() {
  if (!isReady()) return
  capture('hero_cta_clicked')
}

/**
 * Cada resposta do diagnóstico.
 * step 1 = travamento | step 2 = área de vida | step 3 = estágio
 */
export function trackDiagnosticStepAnswered(payload: {
  step: 1 | 2 | 3
  question: string
  value: string
  label: string
}) {
  if (!isReady()) return
  capture('diagnostic_step_answered', payload)
}

/** Diagnóstico concluído — todas as 3 respostas registradas. */
export function trackDiagnosticCompleted(payload: {
  pain: string
  pain_label: string
  life: string
  life_label: string
  stage: string
  stage_label: string
}) {
  if (!isReady()) return
  capture('diagnostic_completed', payload)
}

/** Resultado exibido ao usuário. */
export function trackResultViewed(payload: {
  recommended_product_id: string
  recommended_product_name: string
  result_headline: string
}) {
  if (!isReady()) return
  capture('result_viewed', payload)
}

/**
 * Clique em CTA de produto.
 * source   — de onde veio (diagnóstico ou trilha)
 * product_type — entry / mid / high-ticket
 * link_type    — sales-page / checkout / whatsapp / application
 */
export function trackProductCtaClicked(payload: {
  product_id: string
  product_name: string
  product_type: string
  link_type: string
  source: ProductSource
}) {
  if (!isReady()) return
  capture('product_cta_clicked', payload)
}

/** Clique em "Conhecer toda a trilha LevMente". */
export function trackTrailLinkClicked() {
  if (!isReady()) return
  capture('trail_link_clicked')
}

/** Email submetido na lista de espera do app LevMente. */
export function trackWaitlistSubmitted() {
  if (!isReady()) return
  capture('waitlist_submitted')
}
