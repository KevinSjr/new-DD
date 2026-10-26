import { useEffect, useState, type KeyboardEvent } from 'react'
import { CANADA_SECTIONS, CANADA_SOURCES, type CanadaBlock } from '../data/canadaGuide'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../lib/format'
import './GermanyGuidePage.css'
import './CanadaGuidePage.css'

const sectionIds = CANADA_SECTIONS.map((section) => section.id)

function initialSection() {
  const hash = window.location.hash.slice(1)
  return sectionIds.includes(hash) ? hash : sectionIds[0]
}

function GuideBlock({ block }: { block: CanadaBlock }) {
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

export function CanadaGuidePage() {
  useDocumentTitle('Estudar no Canadá | Daydreaming')
  const [activeId, setActiveId] = useState(initialSection)
  const [visited, setVisited] = useState(() => [initialSection()])
  const activeIndex = CANADA_SECTIONS.findIndex((section) => section.id === activeId)
  const active = CANADA_SECTIONS[activeIndex] ?? CANADA_SECTIONS[0]

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
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % CANADA_SECTIONS.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + CANADA_SECTIONS.length) % CANADA_SECTIONS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = CANADA_SECTIONS.length - 1
    else return
    event.preventDefault()
    selectSection(CANADA_SECTIONS[next].id)
    document.getElementById(`canada-tab-${CANADA_SECTIONS[next].id}`)?.focus()
  }

  function showScholarships() {
    selectSection('bolsas')
    document.getElementById('guia')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <article className="germany canada">
      <div className="container germany__breadcrumb">
        <nav aria-label="Você está em"><ol>
          <li><Link to="/">Início</Link></li><li><Link to="/#paises">Países</Link></li><li aria-current="page">Canadá</li>
        </ol></nav>
      </div>

      <header className="germany-hero">
        <div className="container germany-hero__grid">
          <div className="germany-hero__copy">
            <p className="germany__eyebrow">Guia de destino · América do Norte</p>
            <h1>Seu plano de estudos pode começar no <span>Canadá.</span></h1>
            <p className="germany-hero__lead">Compare idiomas, custos, bolsas e regras para estudar e trabalhar. Cada escolha depende da província, do curso e do seu objetivo.</p>
            <div className="germany-hero__actions">
              <a className="germany-button germany-button--primary" href="#guia">Explorar o guia <span aria-hidden="true">↓</span></a>
              <button className="germany-button germany-button--secondary" type="button" onClick={showScholarships}>Ver bolsas e financiamento</button>
            </div>
            <p className="germany-hero__tip">Informações consultadas em 26/10/2026. Confirme regras e valores antes de se candidatar.</p>
          </div>
          <div className="canada-hero__art" aria-hidden="true">
            <div className="canada-hero__sun" />
            <div className="canada-hero__mountain canada-hero__mountain--back" />
            <div className="canada-hero__mountain canada-hero__mountain--front" />
            <div className="canada-hero__forest"><i /><i /><i /><i /><i /></div>
            <div className="canada-hero__postcard"><strong>CANADÁ</strong><small>Um plano para cada caminho</small></div>
          </div>
        </div>
      </header>

      <section className="container germany-snapshot" aria-label="Canadá em números">
        <div><span>População · abril de 2026</span><strong>41,4 milhões</strong><small><a href={CANADA_SOURCES.population.url} target="_blank" rel="noopener noreferrer">Statistics Canada · estimativa provisória<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>IDH · relatório 2025</span><strong>16.º lugar</strong><small><a href={CANADA_SOURCES.hdi.url} target="_blank" rel="noopener noreferrer">PNUD · dados de 2023<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>Moeda</span><strong>Dólar canadense</strong><small>CAD · planeje custos na moeda local</small></div>
      </section>

      <section className="germany-guide" id="guia" aria-labelledby="canada-guide-title">
        <div className="container">
          <div className="germany-guide__heading">
            <p className="germany__eyebrow">Seu guia de destino</p>
            <h2 id="canada-guide-title">Conheça o Canadá, <span>passo a passo.</span></h2>
            <p>Explore um tema por vez e anote o que precisa confirmar para sua instituição e província.</p>
          </div>
          <div className="germany-progress">
            <div><span className="germany-progress__label">Sua exploração</span><p>Você abriu {visited.length} de {CANADA_SECTIONS.length} seções.</p><small>Progresso desta visita. Não é salvo ao sair da página.</small></div>
            <strong aria-hidden="true">{visited.length}/{CANADA_SECTIONS.length}</strong>
            <div className="germany-progress__track" role="progressbar" aria-label="Seções abertas" aria-valuemin={0} aria-valuemax={CANADA_SECTIONS.length} aria-valuenow={visited.length} aria-valuetext={`${visited.length} de ${CANADA_SECTIONS.length} seções abertas`}>
              <span style={{ width: `${visited.length / CANADA_SECTIONS.length * 100}%` }} />
            </div>
          </div>
          <div className="germany-tabs" role="tablist" aria-label="Seções do guia do Canadá">
            {CANADA_SECTIONS.map((section, index) => <button key={section.id} id={`canada-tab-${section.id}`} role="tab" type="button" aria-selected={section.id === activeId} aria-controls="canada-panel" tabIndex={section.id === activeId ? 0 : -1} className={section.id === activeId ? 'germany-tabs__tab is-active' : 'germany-tabs__tab'} onClick={() => selectSection(section.id)} onKeyDown={(event) => handleTabKey(event, index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>{section.tab}{visited.includes(section.id) && <span className="sr-only"> — já aberta</span>}
            </button>)}
          </div>
          <section id="canada-panel" className="germany-panel" role="tabpanel" aria-labelledby={`canada-tab-${active.id}`} tabIndex={0}>
            <div className="germany-panel__heading"><span className="germany-panel__number">{String(activeIndex + 1).padStart(2, '0')}</span><div><p className="germany-panel__kicker">{active.kicker}</p><h3>{active.title}</h3><p>{active.intro}</p></div></div>
            <div className="germany-panel__blocks">{active.blocks.map((block) => <GuideBlock key={block.title} block={block} />)}</div>
            <div className="germany-panel__footer"><p>Requisitos finais e decisões cabem à instituição ou ao órgão responsável.</p>{activeIndex < CANADA_SECTIONS.length - 1 && <button type="button" onClick={() => { const next = CANADA_SECTIONS[activeIndex + 1]; selectSection(next.id); document.getElementById(`canada-tab-${next.id}`)?.focus() }}>Próximo tema: {CANADA_SECTIONS[activeIndex + 1].tab} <span aria-hidden="true">→</span></button>}</div>
          </section>
        </div>
      </section>

      <section className="germany-next" aria-labelledby="canada-next-title"><div className="container germany-next__inner"><div><p className="germany__eyebrow">Seu próximo passo</p><h2 id="canada-next-title">Escolha um curso e compare o orçamento.</h2><p>Confira idioma, taxas, bolsa e condições da permissão de estudo antes de enviar a candidatura.</p></div><a href={CANADA_SOURCES.educanada.url} target="_blank" rel="noopener noreferrer">Pesquisar bolsas no EduCanada <span aria-hidden="true">↗</span><span className="sr-only"> (abre em nova aba)</span></a></div></section>
    </article>
  )
}
