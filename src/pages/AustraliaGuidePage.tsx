import { useEffect, useState, type KeyboardEvent } from 'react'
import { AUSTRALIA_SECTIONS, AUSTRALIA_SOURCES, type AustraliaBlock } from '../data/australiaGuide'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../lib/format'
import './GermanyGuidePage.css'
import './AustraliaGuidePage.css'

const sectionIds = AUSTRALIA_SECTIONS.map((section) => section.id)

function initialSection() {
  const hash = window.location.hash.slice(1)
  return sectionIds.includes(hash) ? hash : sectionIds[0]
}

function GuideBlock({ block }: { block: AustraliaBlock }) {
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

export function AustraliaGuidePage() {
  useDocumentTitle('Estudar na Austrália | Daydreaming')
  const [activeId, setActiveId] = useState(initialSection)
  const [visited, setVisited] = useState(() => [initialSection()])
  const activeIndex = AUSTRALIA_SECTIONS.findIndex((section) => section.id === activeId)
  const active = AUSTRALIA_SECTIONS[activeIndex] ?? AUSTRALIA_SECTIONS[0]

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
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % AUSTRALIA_SECTIONS.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + AUSTRALIA_SECTIONS.length) % AUSTRALIA_SECTIONS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = AUSTRALIA_SECTIONS.length - 1
    else return
    event.preventDefault()
    selectSection(AUSTRALIA_SECTIONS[next].id)
    document.getElementById(`australia-tab-${AUSTRALIA_SECTIONS[next].id}`)?.focus()
  }

  function showScholarships() {
    selectSection('bolsas')
    document.getElementById('guia')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <article className="germany australia">
      <div className="container germany__breadcrumb">
        <nav aria-label="Você está em"><ol>
          <li><Link to="/">Início</Link></li><li><Link to="/#paises">Países</Link></li><li aria-current="page">Austrália</li>
        </ol></nav>
      </div>

      <header className="germany-hero">
        <div className="container germany-hero__grid">
          <div className="germany-hero__copy">
            <p className="germany__eyebrow">Guia de destino · Oceania</p>
            <h1>Seu plano de estudos pode levar à <span>Austrália.</span></h1>
            <p className="germany-hero__lead">Conheça idioma, custos, universidades, bolsas e regras para estudar e trabalhar. Comece pelas escolhas que mais afetam seu orçamento e sua candidatura.</p>
            <div className="germany-hero__actions">
              <a className="germany-button germany-button--primary" href="#guia">Explorar o guia <span aria-hidden="true">↓</span></a>
              <button className="germany-button germany-button--secondary" type="button" onClick={showScholarships}>Ver bolsas e financiamento</button>
            </div>
            <p className="germany-hero__tip">Regras e valores foram consultados em 24/10/2026. Confirme-os antes de tomar decisões.</p>
          </div>
          <div className="australia-hero__art" aria-hidden="true">
            <div className="australia-hero__sun" />
            <div className="australia-hero__land"><span /><span /><span /></div>
            <div className="australia-hero__sea" />
            <div className="australia-hero__postcard"><strong>AUSTRÁLIA</strong><small>Um destino, muitos caminhos</small></div>
          </div>
        </div>
      </header>

      <section className="container germany-snapshot" aria-label="Austrália em números">
        <div><span>População · março de 2026</span><strong>27,9 milhões</strong><small><a href={AUSTRALIA_SOURCES.population.url} target="_blank" rel="noopener noreferrer">Australian Bureau of Statistics<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>IDH · relatório 2025</span><strong>7.º lugar</strong><small><a href={AUSTRALIA_SOURCES.hdi.url} target="_blank" rel="noopener noreferrer">PNUD · dados de 2023<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>Moeda</span><strong>Dólar australiano</strong><small>AUD · planeje custos na moeda local</small></div>
      </section>

      <section className="germany-guide" id="guia" aria-labelledby="australia-guide-title">
        <div className="container">
          <div className="germany-guide__heading">
            <p className="germany__eyebrow">Seu guia de destino</p>
            <h2 id="australia-guide-title">Descubra a Austrália, <span>passo a passo.</span></h2>
            <p>Explore os temas e anote o que precisa confirmar para o curso e a cidade que você escolher.</p>
          </div>
          <div className="germany-progress">
            <div><span className="germany-progress__label">Sua exploração</span><p>Você abriu {visited.length} de {AUSTRALIA_SECTIONS.length} seções.</p><small>Progresso desta visita. Não é salvo ao sair da página.</small></div>
            <strong aria-hidden="true">{visited.length}/{AUSTRALIA_SECTIONS.length}</strong>
            <div className="germany-progress__track" role="progressbar" aria-label="Seções abertas" aria-valuemin={0} aria-valuemax={AUSTRALIA_SECTIONS.length} aria-valuenow={visited.length} aria-valuetext={`${visited.length} de ${AUSTRALIA_SECTIONS.length} seções abertas`}>
              <span style={{ width: `${visited.length / AUSTRALIA_SECTIONS.length * 100}%` }} />
            </div>
          </div>
          <div className="germany-tabs" role="tablist" aria-label="Seções do guia da Austrália">
            {AUSTRALIA_SECTIONS.map((section, index) => <button key={section.id} id={`australia-tab-${section.id}`} role="tab" type="button" aria-selected={section.id === activeId} aria-controls="australia-panel" tabIndex={section.id === activeId ? 0 : -1} className={section.id === activeId ? 'germany-tabs__tab is-active' : 'germany-tabs__tab'} onClick={() => selectSection(section.id)} onKeyDown={(event) => handleTabKey(event, index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>{section.tab}{visited.includes(section.id) && <span className="sr-only"> — já aberta</span>}
            </button>)}
          </div>
          <section id="australia-panel" className="germany-panel" role="tabpanel" aria-labelledby={`australia-tab-${active.id}`} tabIndex={0}>
            <div className="germany-panel__heading"><span className="germany-panel__number">{String(activeIndex + 1).padStart(2, '0')}</span><div><p className="germany-panel__kicker">{active.kicker}</p><h3>{active.title}</h3><p>{active.intro}</p></div></div>
            <div className="germany-panel__blocks">{active.blocks.map((block) => <GuideBlock key={block.title} block={block} />)}</div>
            <div className="germany-panel__footer"><p>Requisitos finais e decisões cabem à instituição ou ao órgão responsável.</p>{activeIndex < AUSTRALIA_SECTIONS.length - 1 && <button type="button" onClick={() => { const next = AUSTRALIA_SECTIONS[activeIndex + 1]; selectSection(next.id); document.getElementById(`australia-tab-${next.id}`)?.focus() }}>Próximo tema: {AUSTRALIA_SECTIONS[activeIndex + 1].tab} <span aria-hidden="true">→</span></button>}</div>
          </section>
        </div>
      </section>

      <section className="germany-next" aria-labelledby="australia-next-title"><div className="container germany-next__inner"><div><p className="germany__eyebrow">Seu próximo passo</p><h2 id="australia-next-title">Escolha um curso e faça um orçamento.</h2><p>Confira idioma, mensalidade e critérios oficiais; depois compare as bolsas disponíveis para seu perfil.</p></div><a href="https://www.studyaustralia.gov.au/en/plan-your-studies/find-a-course" target="_blank" rel="noopener noreferrer">Pesquisar cursos no Study Australia <span aria-hidden="true">↗</span><span className="sr-only"> (abre em nova aba)</span></a></div></section>
    </article>
  )
}
