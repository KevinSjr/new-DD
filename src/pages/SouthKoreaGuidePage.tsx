import { useEffect, useState, type KeyboardEvent } from 'react'
import { KOREA_SECTIONS, KOREA_SOURCES, type KoreaBlock } from '../data/southKoreaGuide'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../lib/format'
import './GermanyGuidePage.css'
import './SouthKoreaGuidePage.css'

const sectionIds = KOREA_SECTIONS.map((section) => section.id)

function initialSection() {
  const hash = window.location.hash.slice(1)
  return sectionIds.includes(hash) ? hash : sectionIds[0]
}

function GuideBlock({ block }: { block: KoreaBlock }) {
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

export function SouthKoreaGuidePage() {
  useDocumentTitle('Estudar na Coreia do Sul | Daydreaming')
  const [activeId, setActiveId] = useState(initialSection)
  const [visited, setVisited] = useState(() => [initialSection()])
  const activeIndex = KOREA_SECTIONS.findIndex((section) => section.id === activeId)
  const active = KOREA_SECTIONS[activeIndex] ?? KOREA_SECTIONS[0]

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
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % KOREA_SECTIONS.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + KOREA_SECTIONS.length) % KOREA_SECTIONS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = KOREA_SECTIONS.length - 1
    else return
    event.preventDefault()
    selectSection(KOREA_SECTIONS[next].id)
    document.getElementById(`korea-tab-${KOREA_SECTIONS[next].id}`)?.focus()
  }

  function showScholarships() {
    selectSection('bolsas')
    document.getElementById('guia')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <article className="germany south-korea">
      <div className="container germany__breadcrumb">
        <nav aria-label="Você está em"><ol>
          <li><Link to="/">Início</Link></li><li><Link to="/#paises">Países</Link></li><li aria-current="page">Coreia do Sul</li>
        </ol></nav>
      </div>

      <header className="germany-hero">
        <div className="container germany-hero__grid">
          <div className="germany-hero__copy">
            <p className="germany__eyebrow">Guia de destino · Ásia</p>
            <h1>Um novo caminho de estudos na <span>Coreia do Sul.</span></h1>
            <p className="germany-hero__lead">Explore idiomas, bolsas e universidades. Entenda como preparar a candidatura e viver no país com informações verificáveis.</p>
            <div className="germany-hero__actions">
              <a className="germany-button germany-button--primary" href="#guia">Explorar o guia <span aria-hidden="true">↓</span></a>
              <button className="germany-button germany-button--secondary" type="button" onClick={showScholarships}>Ver bolsas e financiamento</button>
            </div>
            <p className="germany-hero__tip">Informações consultadas em 26/10/2026. Confira o edital e as regras antes de se candidatar.</p>
          </div>
          <div className="korea-hero__art" aria-hidden="true">
            <div className="korea-hero__sun" />
            <div className="korea-hero__mountain korea-hero__mountain--back" />
            <div className="korea-hero__mountain korea-hero__mountain--front" />
            <div className="korea-hero__building korea-hero__building--one" />
            <div className="korea-hero__building korea-hero__building--two" />
            <div className="korea-hero__postcard"><strong>COREIA DO SUL</strong><small>Seu plano começa aqui</small></div>
          </div>
        </div>
      </header>

      <section className="container germany-snapshot" aria-label="Coreia do Sul em números">
        <div><span>População · censo 2025</span><strong>51,82 milhões</strong><small><a href={KOREA_SOURCES.population.url} target="_blank" rel="noopener noreferrer">Ministério de Dados e Estatísticas<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>IDH · relatório 2025</span><strong>20.º lugar</strong><small><a href={KOREA_SOURCES.hdi.url} target="_blank" rel="noopener noreferrer">PNUD · 0,937, dados de 2023<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>Moeda</span><strong>Won sul-coreano</strong><small>KRW · planeje custos na moeda local</small></div>
      </section>

      <section className="germany-guide" id="guia" aria-labelledby="korea-guide-title">
        <div className="container">
          <div className="germany-guide__heading">
            <p className="germany__eyebrow">Seu guia de destino</p>
            <h2 id="korea-guide-title">Conheça a Coreia do Sul, <span>passo a passo.</span></h2>
            <p>Abra um tema por vez e anote o que precisa confirmar para o seu curso e sua cidade.</p>
          </div>
          <div className="germany-progress">
            <div><span className="germany-progress__label">Sua exploração</span><p>Você abriu {visited.length} de {KOREA_SECTIONS.length} seções.</p><small>Progresso desta visita. Não é salvo ao sair da página.</small></div>
            <strong aria-hidden="true">{visited.length}/{KOREA_SECTIONS.length}</strong>
            <div className="germany-progress__track" role="progressbar" aria-label="Seções abertas" aria-valuemin={0} aria-valuemax={KOREA_SECTIONS.length} aria-valuenow={visited.length} aria-valuetext={`${visited.length} de ${KOREA_SECTIONS.length} seções abertas`}>
              <span style={{ width: `${visited.length / KOREA_SECTIONS.length * 100}%` }} />
            </div>
          </div>
          <div className="germany-tabs" role="tablist" aria-label="Seções do guia da Coreia do Sul">
            {KOREA_SECTIONS.map((section, index) => <button key={section.id} id={`korea-tab-${section.id}`} role="tab" type="button" aria-selected={section.id === activeId} aria-controls="korea-panel" tabIndex={section.id === activeId ? 0 : -1} className={section.id === activeId ? 'germany-tabs__tab is-active' : 'germany-tabs__tab'} onClick={() => selectSection(section.id)} onKeyDown={(event) => handleTabKey(event, index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>{section.tab}{visited.includes(section.id) && <span className="sr-only"> — já aberta</span>}
            </button>)}
          </div>
          <section id="korea-panel" className="germany-panel" role="tabpanel" aria-labelledby={`korea-tab-${active.id}`} tabIndex={0}>
            <div className="germany-panel__heading"><span className="germany-panel__number">{String(activeIndex + 1).padStart(2, '0')}</span><div><p className="germany-panel__kicker">{active.kicker}</p><h3>{active.title}</h3><p>{active.intro}</p></div></div>
            <div className="germany-panel__blocks">{active.blocks.map((block) => <GuideBlock key={block.title} block={block} />)}</div>
            <div className="germany-panel__footer"><p>Requisitos finais e decisões cabem à instituição ou ao órgão responsável.</p>{activeIndex < KOREA_SECTIONS.length - 1 && <button type="button" onClick={() => { const next = KOREA_SECTIONS[activeIndex + 1]; selectSection(next.id); document.getElementById(`korea-tab-${next.id}`)?.focus() }}>Próximo tema: {KOREA_SECTIONS[activeIndex + 1].tab} <span aria-hidden="true">→</span></button>}</div>
          </section>
        </div>
      </section>

      <section className="germany-next" aria-labelledby="korea-next-title"><div className="container germany-next__inner"><div><p className="germany__eyebrow">Seu próximo passo</p><h2 id="korea-next-title">Escolha um curso e acompanhe o próximo edital.</h2><p>Compare idioma, orçamento e bolsas da universidade. O canal brasileiro da GKS-G 2026 já encerrou as inscrições.</p></div><a href={KOREA_SOURCES.gksBrazil.url} target="_blank" rel="noopener noreferrer">Consultar a Embaixada <span aria-hidden="true">↗</span><span className="sr-only"> (abre em nova aba)</span></a></div></section>
    </article>
  )
}
