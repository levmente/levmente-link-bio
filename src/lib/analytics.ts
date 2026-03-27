/**
 * Analytics — LevMente / Link na Bio
 *
 * Funil principal:
 *   linknabio_page_viewed
 *     └─ linknabio_hero_cta_clicked
 *          └─ linknabio_step_answered (steps 1–3)
 *               └─ linknabio_diagnostic_completed
 *                    └─ linknabio_result_viewed
 *                         └─ linknabio_product_cta_clicked  ← conversão
 *
 * Auxiliares:
 *   linknabio_scroll_depth       (25 / 50 / 75 / 90 %)
 *   linknabio_section_viewed     (por section_id)
 *   linknabio_trail_link_clicked
 *   linknabio_waitlist_submitted
 *   linknabio_waitlist_submit_failed
 */

import posthog from 'posthog-js'

// ─── Parâmetros de rastreamento ───────────────────────────────────────────────

const PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'lead_id',
] as const

type ParamKey = (typeof PARAM_KEYS)[number]
type TrackingParams = Partial<Record<ParamKey, string>>

/**
 * Lê UTMs, fbclid, gclid e lead_id da URL.
 * Se existirem na URL, salva no localStorage para persistir entre páginas.
 * Se não existirem na URL, tenta recuperar do localStorage.
 */
export function getTrackingParams(): TrackingParams {
  if (typeof window === 'undefined') return {}

  const params: TrackingParams = {}
  const search = new URLSearchParams(window.location.search)

  for (const key of PARAM_KEYS) {
    const fromUrl = search.get(key)
    if (fromUrl) {
      params[key] = fromUrl
      try { localStorage.setItem(`lnb_${key}`, fromUrl) } catch { /* ignore */ }
    } else {
      try {
        const stored = localStorage.getItem(`lnb_${key}`)
        if (stored) params[key] = stored
      } catch { /* ignore */ }
    }
  }

  return params
}

// ─── Origem do tráfego ────────────────────────────────────────────────────────

export function getTrafficOrigin(params: TrackingParams): {
  traffic_origin: string
  origin_detail: string
} {
  const { utm_medium, utm_content, utm_source, fbclid, gclid } = params

  if (utm_medium === 'social' && utm_content === 'link_in_bio') {
    return {
      traffic_origin: 'link_in_bio',
      origin_detail:
        utm_source === 'instagram'
          ? 'instagram_link_in_bio'
          : utm_source ?? 'link_in_bio',
    }
  }

  if (fbclid) return { traffic_origin: 'paid_meta',    origin_detail: 'meta_ads' }
  if (gclid)  return { traffic_origin: 'paid_google',  origin_detail: 'google_ads' }

  if (utm_medium) {
    return {
      traffic_origin: 'paid_or_campaign',
      origin_detail: utm_source ?? utm_medium,
    }
  }

  return { traffic_origin: 'direct_or_unknown', origin_detail: 'unknown' }
}

// ─── Propriedades base ────────────────────────────────────────────────────────

/** Monta o bloco de propriedades fixas que acompanha TODOS os eventos. */
export function getBaseProps(): Record<string, unknown> {
  if (typeof window === 'undefined') return {}

  const params = getTrackingParams()
  const { traffic_origin, origin_detail } = getTrafficOrigin(params)

  return {
    funnel_page:    'linknabio_diagnostico',
    page_type:      'diagnostico',
    page_url:       window.location.href,
    page_path:      window.location.pathname,
    page_title:     document.title,
    traffic_origin,
    origin_detail,
    lead_id:        params.lead_id        ?? null,
    utm_source:     params.utm_source     ?? null,
    utm_medium:     params.utm_medium     ?? null,
    utm_campaign:   params.utm_campaign   ?? null,
    utm_content:    params.utm_content    ?? null,
    utm_term:       params.utm_term       ?? null,
    fbclid:         params.fbclid         ?? null,
    gclid:          params.gclid          ?? null,
  }
}

// ─── Core capture ─────────────────────────────────────────────────────────────

function isReady(): boolean {
  return typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_POSTHOG_KEY
}

/** Dispara um evento PostHog com as propriedades base + extras opcionais. */
export function captureEvent(name: string, extraProps?: Record<string, unknown>) {
  if (!isReady()) return
  const props = { ...getBaseProps(), ...extraProps }
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] 📊 ${name}`, props)
  }
  posthog.capture(name, props)
}

// ─── URL de saída com parâmetros ──────────────────────────────────────────────

/**
 * Recebe um href de destino e adiciona/mescla os parâmetros de rastreamento
 * (UTMs, fbclid, gclid, lead_id) na query string.
 */
export function buildOutboundUrl(href: string): string {
  if (typeof window === 'undefined' || !href || href === '#') return href
  try {
    const url = new URL(href)
    const params = getTrackingParams()
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value)
    }
    return url.toString()
  } catch {
    return href
  }
}

// ─── Normalização de IDs de produto ──────────────────────────────────────────

const PRODUCT_NAMES: Record<string, string> = {
  'ebook':               'ebook',
  'desafio':             'desafio_21_dias',
  'curso':               'destravando_tdah',
  'mentoria-grupo':      'mentoria_grupo',
  'mentoria-individual': 'mentoria_individual',
}

export function normalizeProductId(id: string): string {
  return PRODUCT_NAMES[id] ?? id
}

// ─── Tipos exportados ─────────────────────────────────────────────────────────

export type ProductSource = 'result_primary' | 'result_secondary' | 'trail'
export type { ProductType, LinkType } from './types'

// ─── Eventos do funil ─────────────────────────────────────────────────────────

/** Página carregada. */
export function trackPageViewed() {
  captureEvent('linknabio_page_viewed')
}

/** CTA principal do Hero clicado. */
export function trackHeroCtaClicked() {
  captureEvent('linknabio_hero_cta_clicked')
}

/** Resposta a uma etapa do diagnóstico. */
export function trackDiagnosticStepAnswered(payload: {
  step: 1 | 2 | 3
  question_id: string
  answer_value: string
  answer_label?: string
}) {
  captureEvent('linknabio_step_answered', {
    step_number:  payload.step,
    question_id:  payload.question_id,
    answer_value: payload.answer_value,
    answer_label: payload.answer_label ?? null,
  })
}

/** Diagnóstico finalizado — todas as 3 respostas registradas. */
export function trackDiagnosticCompleted(payload: {
  pain: string
  pain_label: string
  life: string
  life_label: string
  stage: string
  stage_label: string
}) {
  captureEvent('linknabio_diagnostic_completed', payload)
}

/** Resultado exibido ao usuário. */
export function trackResultViewed(payload: {
  result_type: string
  result_title: string
  secondary_product?: string
}) {
  captureEvent('linknabio_result_viewed', payload)
}

/** Clique em CTA de produto. */
export function trackProductCtaClicked(payload: {
  destination_product: string
  destination_url: string
  button_text: string
  result_type?: string
  position_on_page: string
  product_type?: string
  link_type?: string
}) {
  captureEvent('linknabio_product_cta_clicked', payload)
}

/** Profundidade de scroll atingida. */
export function trackScrollDepth(depth_percent: 25 | 50 | 75 | 90) {
  captureEvent('linknabio_scroll_depth', { depth_percent })
}

/** Seção tornada visível. */
export function trackSectionViewed(section_id: string) {
  captureEvent('linknabio_section_viewed', { section_id })
}

// ─── Eventos auxiliares ───────────────────────────────────────────────────────

/** Clique em "Conhecer toda a trilha LevMente". */
export function trackTrailLinkClicked() {
  captureEvent('linknabio_trail_link_clicked')
}

/** Email submetido na lista de espera do app LevMente. */
export function trackWaitlistSubmitted() {
  captureEvent('linknabio_waitlist_submitted')
}

/** Falha ao submeter email na lista de espera. */
export function trackWaitlistSubmitFailed() {
  captureEvent('linknabio_waitlist_submit_failed')
}
