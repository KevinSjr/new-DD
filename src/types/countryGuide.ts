import type { GuideTopicId } from '../data/guideTopics'

/** De onde veio a informação e quando foi conferida. */
export type SourceRef = {
  /** Nome legível da fonte, por exemplo o nome do órgão ou da instituição. */
  label: string
  /** Endereço direto da página oficial (somente https). */
  url: string
  /** Data da última conferência, no formato AAAA-MM-DD. */
  verifiedAt: string
}

type FactBase = {
  /** O que a informação descreve, por exemplo "Trabalho durante o curso". */
  label: string
  /** O dado em linguagem simples. */
  value: string
  /** Lista opcional de itens (documentos, etapas, exemplos). Cada item é um texto simples. */
  items?: readonly string[]
  /** Mostra os itens numerados (passos em ordem). */
  ordered?: boolean
  /** Observação opcional (exceções, como verificar). */
  note?: string
}

/** Está na fonte oficial citada. Exige fonte e data. */
export type ConfirmedFact = FactBase & { kind: 'confirmed'; source: SourceRef }

/** Valor aproximado. Exige fonte e data; em custos, informe moeda e período. */
export type EstimateFact = FactBase & {
  kind: 'estimate'
  source: SourceRef
  money?: { currency: string; period: string }
}

/** Explicação geral. A fonte é opcional. */
export type GuideFact = FactBase & { kind: 'guide'; source?: SourceRef }

export type Fact = ConfirmedFact | EstimateFact | GuideFact

/** Link para um site oficial. Somente https. */
export type OfficialLink = { label: string; url: string }

export type CountryGuideContent = {
  /** Deve ser igual ao `slug` em data/countries.ts. */
  slug: string
  /** Texto curto de apresentação (opcional). Sem números nem regras: isso vai em "topics". */
  summary?: string
  topics: Partial<Record<GuideTopicId, readonly Fact[]>>
  /** Sites oficiais recomendados, mostrados no fim da página. Só inclua links que abrem. */
  officialLinks?: readonly OfficialLink[]
}
