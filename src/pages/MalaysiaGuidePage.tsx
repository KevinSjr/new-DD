import { useEffect, useState, type KeyboardEvent } from 'react'
import { MALAYSIA_SECTIONS, MALAYSIA_SOURCES, type MalaysiaBlock } from '../data/malaysiaGuide'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../lib/format'
import './GermanyGuidePage.css'
import './MalaysiaGuidePage.css'

const sectionIds = MALAYSIA_SECTIONS.map((section) => section.id)

function initialSection() {
  const hash = window.location.hash.slice(1)
  return sectionIds.includes(hash) ? hash : sectionIds[0]
}

function GuideBlock({ block }: { block: MalaysiaBlock }) {
  return (
    <article className="germany-block">
      <h4>{block.title}</h4>
      <p>{block.text}</p>
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

export function MalaysiaGuidePage() {
  useDocumentTitle('Estudar na Malásia | Daydreaming')
  const [activeId, setActiveId] = useState(initialSection)
  const [visited, setVisited] = useState(() => [initialSection()])
  const activeIndex = MALAYSIA_SECTIONS.findIndex((section) => section.id === activeId)
  const active = MALAYSIA_SECTIONS[activeIndex] ?? MALAYSIA_SECTIONS[0]

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
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % MALAYSIA_SECTIONS.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + MALAYSIA_SECTIONS.length) % MALAYSIA_SECTIONS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = MALAYSIA_SECTIONS.length - 1
    else return
    event.preventDefault()
    selectSection(MALAYSIA_SECTIONS[next].id)
    document.getElementById(`malaysia-tab-${MALAYSIA_SECTIONS[next].id}`)?.focus()
  }

  function showScholarships() {
    selectSection('bolsas')
    document.getElementById('guia')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <article className="germany malaysia">
      <div className="container germany__breadcrumb">
        <nav aria-label="Você está em"><ol>
          <li><Link to="/">Início</Link></li><li><Link to="/#paises">Países</Link></li><li aria-current="page">Malásia</li>
        </ol></nav>
      </div>

      <header className="germany-hero">
        <div className="container germany-hero__grid">
          <div className="germany-hero__copy">
            <p className="germany__eyebrow">Guia de destino · Ásia</p>
            <h1>Descubra seu caminho de estudos na <span>Malásia.</span></h1>
            <p className="germany-hero__lead">Compare cursos, bolsas e custos. Entenda os passos para estudar e trabalhar no país com informações verificáveis.</p>
            <div className="germany-hero__actions">
              <a className="germany-button germany-button--primary" href="#guia">Explorar o guia <span aria-hidden="true">↓</span></a>
              <button className="germany-button germany-button--secondary" type="button" onClick={showScholarships}>Ver bolsas e financiamento</button>
            </div>
            <p className="germany-hero__tip">Informações consultadas em 28/10/2026. Confira regras e valores antes de se candidatar.</p>
          </div>
          <div className="malaysia-hero__art" aria-hidden="true">
            <div className="malaysia-hero__sun" />
            <div className="malaysia-hero__land" />
            <div className="malaysia-hero__arch" />
            <div className="malaysia-hero__roof" />
            <div className="malaysia-hero__path" />
            <div className="malaysia-hero__postcard"><strong>MALÁSIA</strong><small>Uma nova perspectiva</small></div>
          </div>
        </div>
      </header>

      <section className="container germany-snapshot" aria-label="Malásia em números">
        <div><span>População · meados de 2026</span><strong>34,4 milhões</strong><small><a href={MALAYSIA_SOURCES.population.url} target="_blank" rel="noopener noreferrer">DOSM · estimativa populacional<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>IDH · relatório 2025</span><strong>67.º lugar</strong><small><a href={MALAYSIA_SOURCES.hdi.url} target="_blank" rel="noopener noreferrer">PNUD · 0,819, dados de 2023<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>Moeda</span><strong>Ringgit malaio</strong><small>MYR · planeje custos na moeda local</small></div>
      </section>

      <section className="germany-guide" id="guia" aria-labelledby="malaysia-guide-title">
        <div className="container">
          <div className="germany-guide__heading">
            <p className="germany__eyebrow">Seu guia de destino</p>
            <h2 id="malaysia-guide-title">Conheça a Malásia, <span>passo a passo.</span></h2>
            <p>Abra um tema por vez e anote o que precisa confirmar para o seu curso e sua cidade.</p>
          </div>
          <div className="germany-progress">
            <div><span className="germany-progress__label">Sua exploração</span><p>Você abriu {visited.length} de {MALAYSIA_SECTIONS.length} seções.</p><small>Progresso desta visita. Não é salvo ao sair da página.</small></div>
            <strong aria-hidden="true">{visited.length}/{MALAYSIA_SECTIONS.length}</strong>
            <div className="germany-progress__track" role="progressbar" aria-label="Seções abertas" aria-valuemin={0} aria-valuemax={MALAYSIA_SECTIONS.length} aria-valuenow={visited.length} aria-valuetext={`${visited.length} de ${MALAYSIA_SECTIONS.length} seções abertas`}>
              <span style={{ width: `${visited.length / MALAYSIA_SECTIONS.length * 100}%` }} />
            </div>
          </div>
          <div className="germany-tabs" role="tablist" aria-label="Seções do guia da Malásia">
            {MALAYSIA_SECTIONS.map((section, index) => <button key={section.id} id={`malaysia-tab-${section.id}`} role="tab" type="button" aria-selected={section.id === activeId} aria-controls="malaysia-panel" tabIndex={section.id === activeId ? 0 : -1} className={section.id === activeId ? 'germany-tabs__tab is-active' : 'germany-tabs__tab'} onClick={() => selectSection(section.id)} onKeyDown={(event) => handleTabKey(event, index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>{section.tab}{visited.includes(section.id) && <span className="sr-only"> — já aberta</span>}
            </button>)}
          </div>
          <section id="malaysia-panel" className="germany-panel" role="tabpanel" aria-labelledby={`malaysia-tab-${active.id}`} tabIndex={0}>
            <div className="germany-panel__heading"><span className="germany-panel__number">{String(activeIndex + 1).padStart(2, '0')}</span><div><p className="germany-panel__kicker">{active.kicker}</p><h3>{active.title}</h3><p>{active.intro}</p></div></div>
            <div className="germany-panel__blocks">{active.blocks.map((block) => <GuideBlock key={block.title} block={block} />)}</div>
            <div className="germany-panel__footer"><p>Requisitos finais e decisões cabem à instituição ou ao órgão responsável.</p>{activeIndex < MALAYSIA_SECTIONS.length - 1 && <button type="button" onClick={() => { const next = MALAYSIA_SECTIONS[activeIndex + 1]; selectSection(next.id); document.getElementById(`malaysia-tab-${next.id}`)?.focus() }}>Próximo tema: {MALAYSIA_SECTIONS[activeIndex + 1].tab} <span aria-hidden="true">→</span></button>}</div>
          </section>
        </div>
      </section>

      <section className="germany-next" aria-labelledby="malaysia-next-title"><div className="container germany-next__inner"><div><p className="germany__eyebrow">Seu próximo passo</p><h2 id="malaysia-next-title">Escolha um curso e compare o financiamento.</h2><p>Confira mensalidade, idioma, bolsa e condições de residência na página da instituição antes de enviar a candidatura.</p></div><Link to="/bolsas">Explorar bolsas no buscador <span aria-hidden="true">→</span></Link></div></section>
    </article>
  )
}








