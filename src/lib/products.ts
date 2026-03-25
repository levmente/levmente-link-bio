import { Product } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// LINKS DOS PRODUTOS — cole as URLs reais abaixo
//
// Produtos sem link ainda usam href: '#'
// Nesse caso o botão exibe feedback "Em breve" ao ser clicado (sem navegar).
//
// Formato WhatsApp: https://wa.me/55SEUNUMERO?text=MENSAGEM_URL_ENCODED
// Exemplo:          https://wa.me/5511999999999?text=Ol%C3%A1%2C%20vi%20o%20portal
// ─────────────────────────────────────────────────────────────────────────────

export const products: Record<string, Product> = {
  ebook: {
    id: 'ebook',
    name: 'E-book: Destravar começa aqui',
    tagline: 'Entenda o que ninguém nunca te explicou sobre o seu cérebro',
    description:
      'Um guia direto sobre como o TDAH adulto funciona na prática — e por que nada que você tentou até hoje foi feito pra você.',
    forWhom: 'Ideal para quem está no começo da jornada e quer entender o que está acontecendo.',
    cta: 'Quero finalmente entender meu cérebro',
    href: 'https://levmente.github.io/teste-mental',
    tier: 1,
    badge: 'Entrada',
    productType: 'entry',
    linkType: 'checkout', // checkout → abre na mesma aba
  },

  desafio: {
    id: 'desafio',
    name: 'Desafio 21 Dias',
    tagline: '21 dias para sair do travamento e criar um ritmo real',
    description:
      'Um processo guiado, dia a dia, que constrói consistência sem depender de força de vontade. Feito para quem começa e não termina.',
    forWhom: 'Para quem já entende o TDAH mas precisa criar movimento e sair do loop de inação.',
    cta: 'Quero sair do travamento na prática',
    href: 'https://levmente.github.io/desafio21/',
    tier: 2,
    badge: 'Prática',
    productType: 'mid',
    linkType: 'sales-page',
  },

  curso: {
    id: 'curso',
    name: 'Destravando TDAH',
    tagline: 'O sistema completo para viver bem com TDAH',
    description:
      'Execução, organização, foco, autoconhecimento — tudo integrado num método que respeita como a sua mente funciona. Não é mais conteúdo. É transformação.',
    forWhom: 'Para quem quer parar de sobreviver e começar a operar no próprio potencial.',
    cta: 'Quero destravar de verdade',
    href: 'https://levmente.github.io/destravando-tdah/',
    tier: 3,
    badge: 'Transformação',
    productType: 'mid',
    linkType: 'sales-page',
  },

  'mentoria-grupo': {
    id: 'mentoria-grupo',
    name: 'Mentoria em Grupo',
    tagline: 'Você não precisa resolver isso sozinho',
    description:
      'Sessões ao vivo comigo, comunidade de pessoas que entendem o que você vive, e acompanhamento real. O TDAH é mais fácil quando você tem as pessoas certas do lado.',
    forWhom: 'Para quem quer suporte contínuo e um lugar onde finalmente se sente entendido.',
    cta: 'Seleção Mentoria em Grupo (Aplicação)',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSf10X0mCoXaoyBVIAe2H5_dEwt0eUTXYK42xnGNfQALGl01Vg/viewform?usp=dialog',
    tier: 4,
    badge: 'Comunidade',
    productType: 'high-ticket',
    linkType: 'application',
  },

  'mentoria-individual': {
    id: 'mentoria-individual',
    name: 'Mentoria Individual',
    tagline: 'Atenção total no seu caso. Sem solução genérica.',
    description:
      'Trabalho direto com você, mergulhando nos seus bloqueios específicos. Para quem já tentou de tudo e sabe que precisa de alguém que olhe de verdade pro seu caso.',
    forWhom: 'Para quem está pronto para o nível mais profundo de transformação.',
    cta: 'Seleção Mentoria Individual (Vagas Limitadas)',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSdcOUUne8NLybPkdnbls7Ql9YjylwPecVsdfJWcIVAUiyb1SA/viewform?usp=publish-editor',
    tier: 5,
    badge: 'Premium',
    productType: 'high-ticket',
    linkType: 'application',
  },
}

export const productsList: Product[] = [
  products.ebook,
  products.desafio,
  products.curso,
  products['mentoria-grupo'],
  products['mentoria-individual'],
]
