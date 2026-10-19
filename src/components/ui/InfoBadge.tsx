import './InfoBadge.css'

export type InfoKind = 'confirmed' | 'estimate' | 'guide' | 'demo'

const LABELS: Record<InfoKind, string> = {
  confirmed: 'Confirmado',
  estimate: 'Estimativa',
  guide: 'Orientação geral',
  demo: 'Demonstração',
}

/**
 * Selo que diz que tipo de informação é aquela (mesmas etiquetas da seção "Confiança" da home).
 * O texto é o que identifica o tipo; cor e contorno são só reforço.
 */
export function InfoBadge({ kind }: { kind: InfoKind }) {
  return <span className={`info-badge info-badge--${kind}`}>{LABELS[kind]}</span>
}
