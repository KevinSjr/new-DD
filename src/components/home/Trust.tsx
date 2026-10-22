import './Trust.css'

/*
 * Seção de confiança (micro tarefa 1.8).
 * Descreve as REGRAS que o site vai seguir ao publicar informações. O cartão de
 * estrutura não traz dados reais: mostra apenas como cada informação será
 * apresentada. O id "confianca" é o destino dos links "Como tratamos os dados" dos guias e do rodapé.
 */

const RULES = [
  {
    title: 'Fontes oficiais primeiro',
    text: 'Universidades, governos, embaixadas, órgãos de imigração e as organizações responsáveis por cada programa.',
  },
  {
    title: 'Prazos com ano e fuso horário',
    text: 'Nunca reaproveitamos datas de edições antigas como se fossem atuais.',
  },
  {
    title: 'Rankings com fonte e metodologia',
    text: 'Cada ranking indicará quem o publica, a edição ou o ano e como foi calculado.',
  },
  {
    title: 'Quando não der para confirmar, avisamos',
    text: 'Dizemos que a informação não foi confirmada e indicamos como você pode verificá-la.',
  },
] as const

const LABELS = [
  {
    name: 'Confirmado',
    kind: 'confirmed',
    text: 'Está na fonte oficial citada e foi conferido na data indicada.',
  },
  {
    name: 'Estimativa',
    kind: 'estimate',
    text: 'Valor aproximado, sempre com moeda, período de referência e aviso de que pode variar.',
  },
  {
    name: 'Orientação geral',
    kind: 'guide',
    text: 'Explicação para entender um tema, sem depender dos dados de uma instituição específica.',
  },
  {
    name: 'Demonstração',
    kind: 'demo',
    text: 'Exemplo ilustrativo, como a trilha da página inicial. Nunca é uma oportunidade real.',
  },
] as const

const ANATOMY = [
  { term: 'Informação', detail: 'O dado em si, em linguagem simples.' },
  { term: 'Tipo', detail: 'Confirmado, estimativa ou orientação geral.' },
  { term: 'Moeda e período', detail: 'Nos custos: a moeda e o período de referência.' },
  { term: 'Fonte', detail: 'Link direto para a página oficial.' },
  { term: 'Verificado em', detail: 'A data da última conferência.' },
] as const

export function Trust() {
  return (
    <section id="confianca" className="trust" aria-labelledby="confianca-titulo">
      <div className="container">
        <header className="trust__header">
          <p className="trust__eyebrow">Como tratamos os dados</p>
          <h2 id="confianca-titulo" className="trust__title">
            Informação que você pode conferir
          </h2>
          <p className="trust__lead">
            Bolsas, prazos, vistos e custos mudam com frequência, e uma informação errada pode
            custar tempo e dinheiro. Por isso, o Daydreaming vai mostrar de onde cada dado vem e
            quando foi verificado, e vai dizer com franqueza o que ainda não sabe.
          </p>
        </header>

        <div className="trust__layout">
          {/* ---------- Regras ---------- */}
          <div>
            <h3 className="trust__subtitle">Nossas regras</h3>
            <ol className="trust__rules">
              {RULES.map((rule) => (
                <li key={rule.title} className="trust__rule">
                  <strong>{rule.title}</strong>
                  <span>{rule.text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* ---------- Estrutura de cada informação ---------- */}
          <aside className="trust__card" aria-labelledby="anatomia-titulo">
            <p className="trust__card-tag">Exemplo de estrutura, sem dados reais</p>
            <h3 id="anatomia-titulo" className="trust__card-title">
              Como cada informação será apresentada
            </h3>
            <dl className="trust__anatomy">
              {ANATOMY.map((item) => (
                <div key={item.term} className="trust__anatomy-row">
                  <dt>{item.term}</dt>
                  <dd>{item.detail}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* ---------- Etiquetas ---------- */}
        <h3 className="trust__subtitle trust__subtitle--labels">Como reconhecer cada tipo de conteúdo</h3>
        <dl className="trust__labels">
          {LABELS.map((label) => (
            <div key={label.name} className="trust__label">
              <dt>
                <span className={`trust__badge trust__badge--${label.kind}`}>{label.name}</span>
              </dt>
              <dd>{label.text}</dd>
            </div>
          ))}
        </dl>

        {/* ---------- Limite do que prometemos ---------- */}
        <p className="trust__limit">
          <strong>O que não prometemos:</strong> aprovação, bolsa, visto ou elegibilidade. Os
          requisitos finais e as decisões pertencem sempre à instituição ou à entidade responsável,
          e o Daydreaming não substitui a consulta à fonte oficial nem a orientação de
          profissionais quando necessário.
        </p>

        <p className="trust__next">
          Pronto para começar? Explore os <a href="#paises">guias de países</a>.
        </p>
      </div>
    </section>
  )
}
