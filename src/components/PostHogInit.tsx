'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'

export default function PostHogInit() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

    if (!key) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[PostHog] ⚠️  NEXT_PUBLIC_POSTHOG_KEY não encontrada. Eventos não serão enviados.')
      }
      return
    }

    posthog.init(key, {
      api_host: host,
      capture_pageview: false,  // controlado manualmente via trackPageEntered()
      capture_pageleave: true,  // abandono de página automático
      persistence: 'localStorage',
      autocapture: false,       // apenas eventos explícitos — sem ruído
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `[PostHog] ✅ Inicializado\n` +
            `  host      : ${host}\n` +
            `  distinct_id: ${ph.get_distinct_id()}`
          )
        }
      },
    })
  }, [])

  return null
}
