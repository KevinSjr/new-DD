import { useEffect, useState, type KeyboardEvent } from 'react'
import { BELGIUM_SECTIONS, BELGIUM_SOURCES, type BelgiumBlock } from '../data/belgiumGuide'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../lib/format'
import './GermanyGuidePage.css'
import './BelgiumGuidePage.css'

const sectionIds = BELGIUM_SECTIONS.map((section) => section.id)

function initialSection() {
  const hash = window.location.hash.slice(1)
  return sectionIds.includes(hash) ? hash : sectionIds[0]
}

function GuideBlock({ block }: { block: BelgiumBlock }) {
  return (
    <article className="germany-block">
      <h4>{block.title}</h4>
      <p>{block.text}</p>
      {block.items && <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>}
      {block.note && <p className="germany-block__note">{block.note}</p>}
      {block.link && <a className="germany-block__link" href={block.link.url} target="_blank" rel="noopener noreferrer">
        {block.link.label} <span aria-hidden="true">↗</span><span className="sr-only"> (abre em nova aba)</span>
      </a>}
      <div className="germany-block__meta">
        {block.source ? <>
          <span className="germany-block__tag">Fonte oficial</span>
          <a href={block.source.url} target="_blank" rel="noopener noreferrer">{block.source.label}<span className="sr-only"> (abre em nova aba)</span></a>
          <span>Verificado em {formatDate(block.source.verifiedAt)}</span>
        </> : <span className="germany-block__tag germany-block__tag--general">Orientação geral</span>}
      </div>
    </article>
  )
}

export function BelgiumGuidePage() {
  useDocumentTitle('Estudar na Bélgica | Daydreaming')
  const [activeId, setActiveId] = useState(initialSection)
  const [visited, setVisited] = useState(() => [initialSection()])
  const activeIndex = BELGIUM_SECTIONS.findIndex((section) => section.id === activeId)
  const active = BELGIUM_SECTIONS[activeIndex] ?? BELGIUM_SECTIONS[0]

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
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % BELGIUM_SECTIONS.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + BELGIUM_SECTIONS.length) % BELGIUM_SECTIONS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = BELGIUM_SECTIONS.length - 1
    else return
    event.preventDefault()
    selectSection(BELGIUM_SECTIONS[next].id)
    document.getElementById(`belgium-tab-${BELGIUM_SECTIONS[next].id}`)?.focus()
  }

  function showScholarships() {
    selectSection('bolsas')
    document.getElementById('guia')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <article className="germany belgium">
      <div className="container germany__breadcrumb">
        <nav aria-label="Você está em"><ol>
          <li><Link to="/">Início</Link></li><li><Link to="/#paises">Países</Link></li><li aria-current="page">Bélgica</li>
        </ol></nav>
      </div>

      <header className="germany-hero">
        <div className="container germany-hero__grid">
          <div className="germany-hero__copy">
            <p className="germany__eyebrow">Guia de destino · Europa</p>
            <h1>Encontre seu caminho para estudar na <span>Bélgica.</span></h1>
            <p className="germany-hero__lead">Explore cursos em diferentes idiomas, compare custos e bolsas e entenda os passos para organizar sua candidatura.</p>
            <div className="germany-hero__actions">
              <a className="germany-button germany-button--primary" href="#guia">Explorar o guia <span aria-hidden="true">↓</span></a>
              <button className="germany-button germany-button--secondary" type="button" onClick={showScholarships}>Ver bolsas e financiamento</button>
            </div>
            <p className="germany-hero__tip">Valores e regras consultados em 24/10/2026. Confirme os requisitos para o seu curso e ano de ingresso.</p>
          </div>
          <div className="belgium-hero__art" aria-hidden="true">
            <div className="belgium-hero__sun" />
            <div className="belgium-hero__building"><i /><i /><i /><i /><i /></div>
            <div className="belgium-hero__street" />
            <div className="belgium-hero__postcard"><strong>BÉLGICA</strong><small>Três idiomas, muitos caminhos</small></div>
          </div>
        </div>
      </header>

      <section className="container germany-snapshot" aria-label="Bélgica em números">
        <div><span>População · janeiro de 2026</span><strong>11,87 milhões</strong><small><a href={BELGIUM_SOURCES.population.url} target="_blank" rel="noopener noreferrer">Statbel<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>IDH · relatório 2025</span><strong>10.º lugar</strong><small><a href={BELGIUM_SOURCES.hdi.url} target="_blank" rel="noopener noreferrer">PNUD · dados de 2023<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>Moeda</span><strong>Euro</strong><small>EUR · planeje custos na moeda local</small></div>
      </section>

      <section className="germany-guide" id="guia" aria-labelledby="belgium-guide-title">
        <div className="container">
          <div className="germany-guide__heading">
            <p className="germany__eyebrow">Seu guia de destino</p>
            <h2 id="belgium-guide-title">Conheça a Bélgica, <span>passo a passo.</span></h2>
            <p>Abra um tema por vez e identifique o que verificar na instituição e nas fontes oficiais.</p>
          </div>
          <div className="germany-progress">
            <div><span className="germany-progress__label">Sua exploração</span><p>Você abriu {visited.length} de {BELGIUM_SECTIONS.length} seções.</p><small>Progresso desta visita. Não é salvo ao sair da página.</small></div>
            <strong aria-hidden="true">{visited.length}/{BELGIUM_SECTIONS.length}</strong>
            <div className="germany-progress__track" role="progressbar" aria-label="Seções abertas" aria-valuemin={0} aria-valuemax={BELGIUM_SECTIONS.length} aria-valuenow={visited.length} aria-valuetext={`${visited.length} de ${BELGIUM_SECTIONS.length} seções abertas`}>
              <span style={{ width: `${visited.length / BELGIUM_SECTIONS.length * 100}%` }} />
            </div>
          </div>
          <div className="germany-tabs" role="tablist" aria-label="Seções do guia da Bélgica">
            {BELGIUM_SECTIONS.map((section, index) => <button key={section.id} id={`belgium-tab-${section.id}`} role="tab" type="button" aria-selected={section.id === activeId} aria-controls="belgium-panel" tabIndex={section.id === activeId ? 0 : -1} className={section.id === activeId ? 'germany-tabs__tab is-active' : 'germany-tabs__tab'} onClick={() => selectSection(section.id)} onKeyDown={(event) => handleTabKey(event, index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>{section.tab}{visited.includes(section.id) && <span className="sr-only"> — já aberta</span>}
            </button>)}
          </div>
          <section id="belgium-panel" className="germany-panel" role="tabpanel" aria-labelledby={`belgium-tab-${active.id}`} tabIndex={0}>
            <div className="germany-panel__heading"><span className="germany-panel__number">{String(activeIndex + 1).padStart(2, '0')}</span><div><p className="germany-panel__kicker">{active.kicker}</p><h3>{active.title}</h3><p>{active.intro}</p></div></div>
            <div className="germany-panel__blocks">{active.blocks.map((block) => <GuideBlock key={block.title} block={block} />)}</div>
            <div className="germany-panel__footer"><p>Requisitos finais e decisões cabem à instituição ou ao órgão responsável.</p>{activeIndex < BELGIUM_SECTIONS.length - 1 && <button type="button" onClick={() => { const next = BELGIUM_SECTIONS[activeIndex + 1]; selectSection(next.id); document.getElementById(`belgium-tab-${next.id}`)?.focus() }}>Próximo tema: {BELGIUM_SECTIONS[activeIndex + 1].tab} <span aria-hidden="true">→</span></button>}</div>
          </section>
        </div>
      </section>

      <section className="germany-next" aria-labelledby="belgium-next-title"><div className="container germany-next__inner"><div><p className="germany__eyebrow">Seu próximo passo</p><h2 id="belgium-next-title">Comece pelo curso e pelo idioma.</h2><p>Depois, confira a taxa da instituição, o orçamento da cidade e as bolsas cujos critérios aceitam seu perfil.</p></div><a href={BELGIUM_SOURCES.flandersProgrammes.url} target="_blank" rel="noopener noreferrer">Pesquisar cursos em Flandres <span aria-hidden="true">↗</span><span className="sr-only"> (abre em nova aba)</span></a></div></section>
    </article>
  )
}
