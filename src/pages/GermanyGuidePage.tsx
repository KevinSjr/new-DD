import { useEffect, useState, type KeyboardEvent } from 'react'
import { GERMANY_SECTIONS, type GermanyBlock } from '../data/germanyGuide'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../lib/format'
import './GermanyGuidePage.css'

const sectionIds = GERMANY_SECTIONS.map((section) => section.id)

function initialSection() {
  const hash = window.location.hash.slice(1)
  return sectionIds.includes(hash) ? hash : sectionIds[0]
}

function SourceLine({ block }: { block: GermanyBlock }) {
  return (
    <div className="germany-block__meta">
      {block.source ? (
        <>
          <span className="germany-block__tag">Fonte oficial</span>
          <a href={block.source.url} target="_blank" rel="noopener noreferrer">
            {block.source.label}<span className="sr-only"> (abre em nova aba)</span>
          </a>
          <span>Verificado em {formatDate(block.source.verifiedAt)}</span>
        </>
      ) : (
        <span className="germany-block__tag germany-block__tag--general">Orientação geral</span>
      )}
    </div>
  )
}

function GuideBlock({ block }: { block: GermanyBlock }) {
  return (
    <article className="germany-block">
      <h4>{block.title}</h4>
      <p>{block.text}</p>
      {block.items && (
        <ul>
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
      {block.note && <p className="germany-block__note">{block.note}</p>}
      {block.link && (
        <a className="germany-block__link" href={block.link.url} target="_blank" rel="noopener noreferrer">
          {block.link.label} <span aria-hidden="true">↗</span>
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      )}
      <SourceLine block={block} />
    </article>
  )
}

export function GermanyGuidePage() {
  useDocumentTitle('Estudar na Alemanha | Daydreaming')
  const [activeId, setActiveId] = useState(initialSection)
  const [visited, setVisited] = useState(() => [initialSection()])
  const activeIndex = GERMANY_SECTIONS.findIndex((section) => section.id === activeId)
  const active = GERMANY_SECTIONS[activeIndex] ?? GERMANY_SECTIONS[0]

  useEffect(() => {
    function updateFromHash() {
      const next = window.location.hash.slice(1)
      if (sectionIds.includes(next)) {
        setActiveId(next)
        setVisited((previous) => previous.includes(next) ? previous : [...previous, next])
      }
    }
    window.addEventListener('hashchange', updateFromHash)
    return () => window.removeEventListener('hashchange', updateFromHash)
  }, [])

  function selectSection(id: string) {
    setActiveId(id)
    setVisited((previous) => previous.includes(id) ? previous : [...previous, id])
    window.history.replaceState(null, '', `#${id}`)
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % GERMANY_SECTIONS.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + GERMANY_SECTIONS.length) % GERMANY_SECTIONS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = GERMANY_SECTIONS.length - 1
    else return

    event.preventDefault()
    selectSection(GERMANY_SECTIONS[next].id)
    document.getElementById(`germany-tab-${GERMANY_SECTIONS[next].id}`)?.focus()
  }

  function showScholarships() {
    selectSection('bolsas')
    document.getElementById('guia')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <article className="germany">
      <div className="container germany__breadcrumb">
        <nav aria-label="Você está em">
          <ol>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/#paises">Países</Link></li>
            <li aria-current="page">Alemanha</li>
          </ol>
        </nav>
      </div>

      <header className="germany-hero">
        <div className="container germany-hero__grid">
          <div className="germany-hero__copy">
            <p className="germany__eyebrow">Guia de destino · Europa</p>
            <h1>Seu próximo capítulo pode começar na <span>Alemanha.</span></h1>
            <p className="germany-hero__lead">
              Conheça os caminhos para estudar, compare custos e bolsas e organize sua candidatura
              com informações que indicam suas fontes e limitações.
            </p>
            <div className="germany-hero__actions">
              <a className="germany-button germany-button--primary" href="#guia">Explorar o guia <span aria-hidden="true">↓</span></a>
              <button className="germany-button germany-button--secondary" type="button" onClick={showScholarships}>
                Ver bolsas e oportunidades
              </button>
            </div>
            <p className="germany-hero__tip">Comece pelo idioma e pelos requisitos do curso que interessa a você.</p>
          </div>
          <div className="germany-hero__art" aria-hidden="true">
            <div className="germany-hero__sun" />
            <div className="germany-hero__orbit" />
            <div className="germany-hero__flag"><span /><span /><span /></div>
            <div className="germany-hero__landmark">
              <div className="germany-hero__roof" />
              <div className="germany-hero__columns"><i /><i /><i /><i /><i /></div>
              <div className="germany-hero__base" />
            </div>
            <div className="germany-hero__art-note"><strong>Novos caminhos</strong><small>começam com um plano</small></div>
          </div>
        </div>
      </header>

      <section className="container germany-snapshot" aria-label="Informações rápidas sobre a Alemanha">
        <div><span>Capital</span><strong>Berlim</strong><small>Um ponto de partida para pesquisar</small></div>
        <div><span>Idioma predominante</span><strong>Alemão</strong><small>Também existem cursos em inglês</small></div>
        <div><span>Moeda</span><strong>Euro (€)</strong><small>Considere cidade, curso e moradia</small></div>
      </section>

      <section className="germany-guide" id="guia" aria-labelledby="germany-guide-title">
        <div className="container">
          <div className="germany-guide__heading">
            <p className="germany__eyebrow">Seu guia de destino</p>
            <h2 id="germany-guide-title">Conheça a Alemanha, <span>passo a passo.</span></h2>
            <p>Explore um tema por vez e identifique o próximo passo concreto para o seu plano de estudos.</p>
          </div>

          <div className="germany-progress">
            <div>
              <span className="germany-progress__label">Sua exploração</span>
              <p>Você abriu {visited.length} de {GERMANY_SECTIONS.length} seções.</p>
              <small>Progresso desta visita. Não é salvo ao sair da página.</small>
            </div>
            <strong aria-hidden="true">{visited.length}/{GERMANY_SECTIONS.length}</strong>
            <div className="germany-progress__track" role="progressbar" aria-label="Seções abertas"
              aria-valuemin={0} aria-valuemax={GERMANY_SECTIONS.length} aria-valuenow={visited.length}
              aria-valuetext={`${visited.length} de ${GERMANY_SECTIONS.length} seções abertas`}>
              <span style={{ width: `${visited.length / GERMANY_SECTIONS.length * 100}%` }} />
            </div>
          </div>

          <div className="germany-tabs" role="tablist" aria-label="Seções do guia da Alemanha">
            {GERMANY_SECTIONS.map((section, index) => (
              <button key={section.id} id={`germany-tab-${section.id}`} role="tab" type="button"
                aria-selected={section.id === activeId} aria-controls="germany-panel"
                tabIndex={section.id === activeId ? 0 : -1}
                className={section.id === activeId ? 'germany-tabs__tab is-active' : 'germany-tabs__tab'}
                onClick={() => selectSection(section.id)} onKeyDown={(event) => handleTabKey(event, index)}>
                <span>{String(index + 1).padStart(2, '0')}</span>{section.tab}
                {visited.includes(section.id) && <span className="germany-tabs__visited sr-only"> — já aberta</span>}
              </button>
            ))}
          </div>

          <section id="germany-panel" className="germany-panel" role="tabpanel"
            aria-labelledby={`germany-tab-${active.id}`} tabIndex={0}>
            <div className="germany-panel__heading">
              <span className="germany-panel__number">{String(activeIndex + 1).padStart(2, '0')}</span>
              <div>
                <p className="germany-panel__kicker">{active.kicker}</p>
                <h3>{active.title}</h3>
                <p>{active.intro}</p>
              </div>
            </div>
            <div className="germany-panel__blocks">
              {active.blocks.map((block) => <GuideBlock key={block.title} block={block} />)}
            </div>
            <div className="germany-panel__footer">
              <p>Requisitos finais e decisões cabem à instituição ou ao órgão responsável.</p>
              {activeIndex < GERMANY_SECTIONS.length - 1 && (
                <button type="button" onClick={() => {
                  const next = GERMANY_SECTIONS[activeIndex + 1]
                  selectSection(next.id)
                  document.getElementById(`germany-tab-${next.id}`)?.focus()
                }}>
                  Próximo tema: {GERMANY_SECTIONS[activeIndex + 1].tab} <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </section>
        </div>
      </section>

      <section className="germany-next" aria-labelledby="germany-next-title">
        <div className="container germany-next__inner">
          <div>
            <p className="germany__eyebrow">Seu próximo passo</p>
            <h2 id="germany-next-title">Transforme a pesquisa em um plano.</h2>
            <p>Escolha um curso, confira os requisitos oficiais e compare o orçamento com as formas de financiamento.</p>
          </div>
          <a href="https://www.daad.de/en/studying-in-germany/" target="_blank" rel="noopener noreferrer">
            Pesquisar cursos no DAAD <span aria-hidden="true">↗</span>
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      </section>
    </article>
  )
}
