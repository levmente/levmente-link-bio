export type PainArea =
  | 'procrastination'
  | 'disorganization'
  | 'focus'
  | 'relationships'
  | 'guilt'

export type LifeArea = 'work' | 'personal' | 'both'

export type Stage = 'discovering' | 'knowing-not-applying' | 'tried-failed'

export type DiagnosticState = {
  pain: PainArea | null
  life: LifeArea | null
  stage: Stage | null
}

export type ProductId =
  | 'ebook'
  | 'desafio'
  | 'curso'
  | 'mentoria-grupo'
  | 'mentoria-individual'

/** Nível do produto na esteira — usado para estratégia de conversão */
export type ProductType = 'entry' | 'mid' | 'high-ticket' | 'waitlist'

/** Tipo do destino do link — usado para analytics e UX do CTA */
export type LinkType = 'sales-page' | 'checkout' | 'whatsapp' | 'application' | 'waitlist'

export type Product = {
  id: ProductId
  name: string
  tagline: string
  description: string
  forWhom: string
  cta: string
  href: string
  tier: 1 | 2 | 3 | 4 | 5
  badge?: string
  productType: ProductType
  linkType: LinkType
}

export type DiagnosticResult = {
  headline: string
  subtext: string
  primary: Product
  secondary?: Product
}
