import { DiagnosticState, DiagnosticResult } from './types'
import { products } from './products'

export function getResult(state: DiagnosticState): DiagnosticResult {
  const { stage } = state

  if (stage === 'discovering') {
    return {
      headline: 'Tudo começa por entender como você funciona.',
      subtext:
        'Antes de qualquer método ou estratégia, você precisa de clareza sobre o que está acontecendo na sua mente. Esse e-book foi feito pra isso.',
      primary: products.ebook,
      secondary: products.desafio,
    }
  }

  if (stage === 'knowing-not-applying') {
    const pain = state.pain

    if (pain === 'procrastination' || pain === 'focus') {
      return {
        headline: 'Você sabe o que fazer. O problema é que seu cérebro não foi projetado pra isso.',
        subtext:
          'Não é fraqueza, não é falta de vontade. É a ausência de um sistema construído pra funcionar com o seu tipo de mente — não contra ele.',
        primary: products.desafio,
        secondary: products.curso,
      }
    }

    return {
      headline: 'Você acumula conhecimento mas continua travado. Isso tem um nome.',
      subtext:
        'O problema não é informação — é execução. O Destravando TDAH transforma o que você já sabe em ação real, do jeito que o seu cérebro consegue sustentar.',
      primary: products.curso,
      secondary: products.desafio,
    }
  }

  // tried-failed
  if (state.pain === 'relationships' || state.pain === 'guilt') {
    return {
      headline: 'Você já foi longe demais sozinho. Chegou a hora de ter alguém do seu lado.',
      subtext:
        'Culpa e relacionamentos desgastados são sintomas — não o problema real. Numa mentoria em grupo, você vai encontrar pessoas que entendem exatamente o que você está vivendo.',
      primary: products['mentoria-grupo'],
      secondary: products['mentoria-individual'],
    }
  }

  return {
    headline: 'Você já tentou tudo. O que falta não é mais tentativa — é precisão.',
    subtext:
      'Chega de metodologias genéricas. Você precisa de alguém que olhe para o seu caso específico e te ajude a destravar o que nenhuma outra coisa conseguiu.',
    primary: products['mentoria-individual'],
    secondary: products['mentoria-grupo'],
  }
}

export const painLabels: Record<string, string> = {
  procrastination: 'Procrastinação crônica',
  disorganization: 'Desorganização e caos',
  focus: 'Foco que não dura',
  relationships: 'Relacionamentos difíceis',
  guilt: 'Culpa e autossabotagem',
}

export const lifeLabels: Record<string, string> = {
  work: 'No trabalho / carreira',
  personal: 'Na vida pessoal / rotina',
  both: 'Nos dois igualmente',
}

export const stageLabels: Record<string, string> = {
  discovering: 'Só comecei a entender que tenho TDAH',
  'knowing-not-applying': 'Já sei, mas não consigo aplicar o que aprendo',
  'tried-failed': 'Já tentei várias coisas e nada funcionou de verdade',
}
