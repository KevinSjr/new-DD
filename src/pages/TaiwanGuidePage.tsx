import { useEffect, useState, type KeyboardEvent } from 'react'
import { TAIWAN_SECTIONS, TAIWAN_SOURCES, type TaiwanBlock } from '../data/taiwanGuide'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../lib/format'
import './GermanyGuidePage.css'
import './TaiwanGuidePage.css'

const sectionIds = TAIWAN_SECTIONS.map((section) => section.id)

function initialSection() {
  const hash = window.location.hash.slice(1)
  return sectionIds.includes(hash) ? hash : sectionIds[0]
}

function GuideBlock({ block }: { block: TaiwanBlock }) {
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

export function TaiwanGuidePage() {
  useDocumentTitle('Estudar em Taiwan | Daydreaming')
  const [activeId, setActiveId] = useState(initialSection)
  const [visited, setVisited] = useState(() => [initialSection()])
  const activeIndex = TAIWAN_SECTIONS.findIndex((section) => section.id === activeId)
  const active = TAIWAN_SECTIONS[activeIndex] ?? TAIWAN_SECTIONS[0]

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
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % TAIWAN_SECTIONS.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + TAIWAN_SECTIONS.length) % TAIWAN_SECTIONS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = TAIWAN_SECTIONS.length - 1
    else return
    event.preventDefault()
    selectSection(TAIWAN_SECTIONS[next].id)
    document.getElementById(`taiwan-tab-${TAIWAN_SECTIONS[next].id}`)?.focus()
  }

  function showScholarships() {
    selectSection('bolsas')
    document.getElementById('guia')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <article className="germany taiwan">
      <div className="container germany__breadcrumb">
        <nav aria-label="Você está em"><ol>
          <li><Link to="/">Início</Link></li><li><Link to="/#paises">Países</Link></li><li aria-current="page">Taiwan</li>
        </ol></nav>
      </div>

      <header className="germany-hero">
        <div className="container germany-hero__grid">
          <div className="germany-hero__copy">
            <p className="germany__eyebrow">Guia de destino · Ásia</p>
            <h1>Descubra seu caminho de estudos em <span>Taiwan.</span></h1>
            <p className="germany-hero__lead">Compare cursos, bolsas e custos. Entenda os passos para estudar e trabalhar no país com informações verificáveis.</p>
            <div className="germany-hero__actions">
              <a className="germany-button germany-button--primary" href="#guia">Explorar o guia <span aria-hidden="true">↓</span></a>
              <button className="germany-button germany-button--secondary" type="button" onClick={showScholarships}>Ver bolsas e financiamento</button>
            </div>
            <p className="germany-hero__tip">Informações consultadas em 28/10/2026. Confira regras e valores antes de se candidatar.</p>
          </div>
          <div className="taiwan-hero__art" aria-hidden="true">
            <div className="taiwan-hero__sun" />
            <div className="taiwan-hero__land" />
            <div className="taiwan-hero__mountain" />
            <div className="taiwan-hero__peak" />
            <div className="taiwan-hero__path" />
            <div className="taiwan-hero__postcard"><strong>TAIWAN</strong><small>Uma nova perspectiva</small></div>
          </div>
        </div>
      </header>

      <section className="container germany-snapshot" aria-label="Taiwan em números">
        <div><span>População · janeiro de 2026</span><strong>23.289.045</strong><small><a href={TAIWAN_SOURCES.population.url} target="_blank" rel="noopener noreferrer">Ministério do Interior · registro populacional<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>IDH · relatório 2025</span><strong>Não listado</strong><small><a href={TAIWAN_SOURCES.hdi.url} target="_blank" rel="noopener noreferrer">PNUD · sem índice para Taiwan<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>Moeda</span><strong>Novo dólar taiwanês</strong><small>TWD (NT$) · planeje custos na moeda local</small></div>
      </section>

      <section className="germany-guide" id="guia" aria-labelledby="taiwan-guide-title">
        <div className="container">
          <div className="germany-guide__heading">
            <p className="germany__eyebrow">Seu guia de destino</p>
            <h2 id="taiwan-guide-title">Conheça Taiwan, <span>passo a passo.</span></h2>
            <p>Abra um tema por vez e anote o que precisa confirmar para o seu curso e sua cidade.</p>
          </div>
          <div className="germany-progress">
            <div><span className="germany-progress__label">Sua exploração</span><p>Você abriu {visited.length} de {TAIWAN_SECTIONS.length} seções.</p><small>Progresso desta visita. Não é salvo ao sair da página.</small></div>
            <strong aria-hidden="true">{visited.length}/{TAIWAN_SECTIONS.length}</strong>
            <div className="germany-progress__track" role="progressbar" aria-label="Seções abertas" aria-valuemin={0} aria-valuemax={TAIWAN_SECTIONS.length} aria-valuenow={visited.length} aria-valuetext={`${visited.length} de ${TAIWAN_SECTIONS.length} seções abertas`}>
              <span style={{ width: `${visited.length / TAIWAN_SECTIONS.length * 100}%` }} />
            </div>
          </div>
          <div className="germany-tabs" role="tablist" aria-label="Seções do guia de Taiwan">
            {TAIWAN_SECTIONS.map((section, index) => <button key={section.id} id={`taiwan-tab-${section.id}`} role="tab" type="button" aria-selected={section.id === activeId} aria-controls="taiwan-panel" tabIndex={section.id === activeId ? 0 : -1} className={section.id === activeId ? 'germany-tabs__tab is-active' : 'germany-tabs__tab'} onClick={() => selectSection(section.id)} onKeyDown={(event) => handleTabKey(event, index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>{section.tab}{visited.includes(section.id) && <span className="sr-only"> — já aberta</span>}
            </button>)}
          </div>
          <section id="taiwan-panel" className="germany-panel" role="tabpanel" aria-labelledby={`taiwan-tab-${active.id}`} tabIndex={0}>
            <div className="germany-panel__heading"><span className="germany-panel__number">{String(activeIndex + 1).padStart(2, '0')}</span><div><p className="germany-panel__kicker">{active.kicker}</p><h3>{active.title}</h3><p>{active.intro}</p></div></div>
            <div className="germany-panel__blocks">{active.blocks.map((block) => <GuideBlock key={block.title} block={block} />)}</div>
            <div className="germany-panel__footer"><p>Requisitos finais e decisões cabem à instituição ou ao órgão responsável.</p>{activeIndex < TAIWAN_SECTIONS.length - 1 && <button type="button" onClick={() => { const next = TAIWAN_SECTIONS[activeIndex + 1]; selectSection(next.id); document.getElementById(`taiwan-tab-${next.id}`)?.focus() }}>Próximo tema: {TAIWAN_SECTIONS[activeIndex + 1].tab} <span aria-hidden="true">→</span></button>}</div>
          </section>
        </div>
      </section>

      <section className="germany-next" aria-labelledby="taiwan-next-title"><div className="container germany-next__inner"><div><p className="germany__eyebrow">Seu próximo passo</p><h2 id="taiwan-next-title">Escolha um curso e compare o financiamento.</h2><p>Confira mensalidade, idioma, bolsa e condições de residência na página da instituição antes de enviar a candidatura.</p></div><Link to="/bolsas">Explorar bolsas no buscador <span aria-hidden="true">→</span></Link></div></section>
    </article>
  )
}















