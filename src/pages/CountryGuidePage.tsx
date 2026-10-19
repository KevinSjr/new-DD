import { COUNTRY_GUIDES } from '../data/countries'
import { COUNTRY_GUIDE_CONTENT } from '../data/guides'
import { GUIDE_TOPICS } from '../data/guideTopics'
import type { Fact } from '../types/countryGuide'
import { InfoBadge } from '../components/ui/InfoBadge'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { daysSince, formatDate, isSafeHttpsUrl, isValidIsoDate } from '../lib/format'
import { NotFoundPage } from './NotFoundPage'
import './CountryGuidePage.css'

/*
 * Template de página de guia de país (micro tarefa 2.1).
 * A página só mostra o que está em data/guides/<slug>.ts, e cada informação
 * "confirmada" ou "estimada" só aparece com fonte https e data de verificação válidas.
 * Sem conteúdo, cada tema mostra um aviso honesto de "sem informações verificadas".
 */

/** Informações verificadas há mais tempo que isso ganham um aviso (prazos e regras mudam). */
const STALE_AFTER_DAYS = 180

/** Uma informação só é exibida se cumprir as regras de confiabilidade do AGENTS.md. */
function isPublishable(fact: Fact): boolean {
  if (fact.kind === 'guide' && !fact.source) return true
  const source = fact.source
  const valid = !!source && isSafeHttpsUrl(source.url) && isValidIsoDate(source.verifiedAt)
  if (!valid && import.meta.env.DEV) {
    console.warn(`[guia] Informação ignorada por falta de fonte https ou data válida: "${fact.label}"`)
  }
  return valid
}

function FactItem({ fact }: { fact: Fact }) {
  const stale = fact.source ? daysSince(fact.source.verifiedAt) > STALE_AFTER_DAYS : false

  return (
    <li className="guide-fact">
      <div className="guide-fact__head">
        <h3 className="guide-fact__label">{fact.label}</h3>
        <InfoBadge kind={fact.kind} />
      </div>
      <p className="guide-fact__value">{fact.value}</p>

      {fact.items && fact.items.length > 0 && (
        fact.ordered ? (
          <ol className="guide-fact__items">
            {fact.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        ) : (
          <ul className="guide-fact__items">
            {fact.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )
      )}

      {fact.kind === 'estimate' && fact.money && (
        <p className="guide-fact__meta">
          Moeda: <strong>{fact.money.currency}</strong> · Período de referência:{' '}
          <strong>{fact.money.period}</strong> · Valor estimado, pode variar.
        </p>
      )}

      {fact.note && <p className="guide-fact__note">{fact.note}</p>}

      {fact.source && (
        <p className="guide-fact__source">
          Fonte:{' '}
          <a href={fact.source.url} target="_blank" rel="noopener noreferrer">
            {fact.source.label}
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          {' · '}Verificado em {formatDate(fact.source.verifiedAt)}.
          {stale && (
            <span className="guide-fact__stale">
              {' '}
              Verificado há mais de {Math.round(STALE_AFTER_DAYS / 30)} meses: confira na fonte.
            </span>
          )}
        </p>
      )}
    </li>
  )
}

export function CountryGuidePage({ slug }: { slug: string }) {
  const guide = COUNTRY_GUIDES.find((item) => item.slug === slug)
  const content = COUNTRY_GUIDE_CONTENT[slug]

  useDocumentTitle(guide ? `${guide.name}: guia de país | Day Dreaming` : null)

  if (!guide) return <NotFoundPage />

  const topics = GUIDE_TOPICS.map((topic) => ({
    ...topic,
    facts: (content?.topics[topic.id] ?? []).filter(isPublishable),
  }))
  const allDates = topics
    .flatMap((topic) => topic.facts)
    .flatMap((fact) => (fact.source ? [fact.source.verifiedAt] : []))
    .sort()
  const lastVerified = allDates.length > 0 ? allDates[allDates.length - 1] : null
  const hasAnyFact = topics.some((topic) => topic.facts.length > 0)
  const officialLinks = (content?.officialLinks ?? []).filter((link) => isSafeHttpsUrl(link.url))

  return (
    <article className="guide" aria-labelledby="guia-titulo">
      <div className="container">
        <nav className="guide__breadcrumb" aria-label="Você está em">
          <ol>
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/#paises">Países</Link>
            </li>
            <li aria-current="page">{guide.name}</li>
          </ol>
        </nav>

        <header className="guide__header">
          <p className="guide__eyebrow">Guia de país</p>
          <h1 id="guia-titulo" className="guide__title">
            {guide.name}
          </h1>
          <div className="guide__status">
            {guide.status === 'in-progress' && <span className="guide__pill">Em preparação</span>}
            <span>
              {lastVerified
                ? `Última verificação: ${formatDate(lastVerified)}`
                : 'Nenhuma informação verificada ainda'}
            </span>
          </div>
          {content?.summary && <p className="guide__summary">{content.summary}</p>}
        </header>

        <p className="guide__notice">
          <strong>Antes de decidir, confira na fonte oficial.</strong> Regras de visto e trabalho,
          custos e prazos mudam. Cada informação indica o tipo e, quando houver, a fonte e a data
          de verificação.{' '}
          <Link to="/#confianca">Como tratamos os dados</Link>.
        </p>

        {!hasAnyFact && (
          <p className="guide__empty-all">
            Este guia ainda não tem informações verificadas. Só publicamos o que conseguimos
            confirmar em fontes oficiais.
          </p>
        )}

        <div className="guide__layout">
          <nav className="guide__toc" aria-label="Neste guia">
            <h2 className="guide__toc-title">Neste guia</h2>
            <ul>
              {topics.map((topic) => (
                <li key={topic.id}>
                  <a href={`#${topic.id}`}>{topic.title}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="guide__topics">
            {topics.map((topic) => (
              <section
                key={topic.id}
                id={topic.id}
                className="guide-topic"
                aria-labelledby={`${topic.id}-titulo`}
              >
                <h2 id={`${topic.id}-titulo`} className="guide-topic__title">
                  {topic.title}
                </h2>
                {topic.facts.length > 0 ? (
                  <ul className="guide-topic__facts">
                    {topic.facts.map((fact) => (
                      <FactItem key={fact.label} fact={fact} />
                    ))}
                  </ul>
                ) : (
                  <div className="guide-topic__empty">
                    <p>
                      <strong>Sem informações verificadas sobre este tema.</strong> Quando houver,
                      elas aparecerão aqui com fonte oficial e data de verificação.
                    </p>
                    <p className="guide-topic__hint">O que este tema vai explicar: {topic.text}</p>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>

        {officialLinks.length > 0 && (
          <section className="guide-links" aria-labelledby="fontes-oficiais-titulo">
            <h2 id="fontes-oficiais-titulo" className="guide-topic__title">
              Fontes oficiais recomendadas
            </h2>
            <ul className="guide-links__list">
              {officialLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="guide-links__note">
              Custos, valores de bolsas, regras de visto, condições de trabalho e prazos podem mudar.
              Confirme na fonte oficial antes de decidir.
            </p>
          </section>
        )}
      </div>
    </article>
  )
}
