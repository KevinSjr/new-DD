import { useEffect, useState, type KeyboardEvent } from 'react'
import { CHINA_SECTIONS, CHINA_SOURCES, type ChinaBlock } from '../data/chinaGuide'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../lib/format'
import './GermanyGuidePage.css'
import './ChinaGuidePage.css'

const sectionIds = CHINA_SECTIONS.map((section) => section.id)

function initialSection() {
  const hash = window.location.hash.slice(1)
  return sectionIds.includes(hash) ? hash : sectionIds[0]
}

function GuideBlock({ block }: { block: ChinaBlock }) {
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

export function ChinaGuidePage() {
  useDocumentTitle('Estudar na China | Daydreaming')
  const [activeId, setActiveId] = useState(initialSection)
  const [visited, setVisited] = useState(() => [initialSection()])
  const activeIndex = CHINA_SECTIONS.findIndex((section) => section.id === activeId)
  const active = CHINA_SECTIONS[activeIndex] ?? CHINA_SECTIONS[0]

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
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % CHINA_SECTIONS.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + CHINA_SECTIONS.length) % CHINA_SECTIONS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = CHINA_SECTIONS.length - 1
    else return
    event.preventDefault()
    selectSection(CHINA_SECTIONS[next].id)
    document.getElementById(`china-tab-${CHINA_SECTIONS[next].id}`)?.focus()
  }

  function showScholarships() {
    selectSection('bolsas')
    document.getElementById('guia')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <article className="germany china">
      <div className="container germany__breadcrumb">
        <nav aria-label="Você está em"><ol>
          <li><Link to="/">Início</Link></li><li><Link to="/#paises">Países</Link></li><li aria-current="page">China</li>
        </ol></nav>
      </div>

      <header className="germany-hero">
        <div className="container germany-hero__grid">
          <div className="germany-hero__copy">
            <p className="germany__eyebrow">Guia de destino · Ásia</p>
            <h1>Seu próximo capítulo pode começar na <span>China.</span></h1>
            <p className="germany-hero__lead">Descubra caminhos de estudo, bolsas e vida no país. Compare programas e prepare cada etapa com as fontes oficiais.</p>
            <div className="germany-hero__actions">
              <a className="germany-button germany-button--primary" href="#guia">Explorar o guia <span aria-hidden="true">↓</span></a>
              <button className="germany-button germany-button--secondary" type="button" onClick={showScholarships}>Ver bolsas e financiamento</button>
            </div>
            <p className="germany-hero__tip">Informações consultadas em 26/10/2026. Confira o edital e as regras antes de se candidatar.</p>
          </div>
          <div className="china-hero__art" aria-hidden="true">
            <div className="china-hero__sun" />
            <div className="china-hero__mountain china-hero__mountain--back" />
            <div className="china-hero__mountain china-hero__mountain--front" />
            <div className="china-hero__roof" />
            <div className="china-hero__postcard"><strong>CHINA</strong><small>Um caminho para explorar</small></div>
          </div>
        </div>
      </header>

      <section className="container germany-snapshot" aria-label="China em números">
        <div><span>População · fim de 2025</span><strong>1,405 bilhão</strong><small><a href={CHINA_SOURCES.population.url} target="_blank" rel="noopener noreferrer">Estatística oficial · estimativa<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>IDH · relatório 2025</span><strong>78.º lugar</strong><small><a href={CHINA_SOURCES.hdi.url} target="_blank" rel="noopener noreferrer">PNUD · 0,797, dados de 2023<span className="sr-only"> (abre em nova aba)</span></a></small></div>
        <div><span>Moeda</span><strong>Yuan renminbi</strong><small>CNY · planeje custos na moeda local</small></div>
      </section>

      <section className="germany-guide" id="guia" aria-labelledby="china-guide-title">
        <div className="container">
          <div className="germany-guide__heading">
            <p className="germany__eyebrow">Seu guia de destino</p>
            <h2 id="china-guide-title">Conheça a China, <span>passo a passo.</span></h2>
            <p>Abra um tema por vez e anote o que precisa confirmar para o seu curso e sua cidade.</p>
          </div>
          <div className="germany-progress">
            <div><span className="germany-progress__label">Sua exploração</span><p>Você abriu {visited.length} de {CHINA_SECTIONS.length} seções.</p><small>Progresso desta visita. Não é salvo ao sair da página.</small></div>
            <strong aria-hidden="true">{visited.length}/{CHINA_SECTIONS.length}</strong>
            <div className="germany-progress__track" role="progressbar" aria-label="Seções abertas" aria-valuemin={0} aria-valuemax={CHINA_SECTIONS.length} aria-valuenow={visited.length} aria-valuetext={`${visited.length} de ${CHINA_SECTIONS.length} seções abertas`}>
              <span style={{ width: `${visited.length / CHINA_SECTIONS.length * 100}%` }} />
            </div>
          </div>
          <div className="germany-tabs" role="tablist" aria-label="Seções do guia da China">
            {CHINA_SECTIONS.map((section, index) => <button key={section.id} id={`china-tab-${section.id}`} role="tab" type="button" aria-selected={section.id === activeId} aria-controls="china-panel" tabIndex={section.id === activeId ? 0 : -1} className={section.id === activeId ? 'germany-tabs__tab is-active' : 'germany-tabs__tab'} onClick={() => selectSection(section.id)} onKeyDown={(event) => handleTabKey(event, index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>{section.tab}{visited.includes(section.id) && <span className="sr-only"> — já aberta</span>}
            </button>)}
          </div>
          <section id="china-panel" className="germany-panel" role="tabpanel" aria-labelledby={`china-tab-${active.id}`} tabIndex={0}>
            <div className="germany-panel__heading"><span className="germany-panel__number">{String(activeIndex + 1).padStart(2, '0')}</span><div><p className="germany-panel__kicker">{active.kicker}</p><h3>{active.title}</h3><p>{active.intro}</p></div></div>
            <div className="germany-panel__blocks">{active.blocks.map((block) => <GuideBlock key={block.title} block={block} />)}</div>
            <div className="germany-panel__footer"><p>Requisitos finais e decisões cabem à instituição ou ao órgão responsável.</p>{activeIndex < CHINA_SECTIONS.length - 1 && <button type="button" onClick={() => { const next = CHINA_SECTIONS[activeIndex + 1]; selectSection(next.id); document.getElementById(`china-tab-${next.id}`)?.focus() }}>Próximo tema: {CHINA_SECTIONS[activeIndex + 1].tab} <span aria-hidden="true">→</span></button>}</div>
          </section>
        </div>
      </section>

      <section className="germany-next" aria-labelledby="china-next-title"><div className="container germany-next__inner"><div><p className="germany__eyebrow">Seu próximo passo</p><h2 id="china-next-title">Escolha um programa e confira o próximo edital.</h2><p>Compare idioma, custos e documentos exigidos pela universidade. A bolsa 2026/27 da Embaixada no Brasil já encerrou as inscrições.</p></div><a href={CHINA_SOURCES.scholarshipBrazil.url} target="_blank" rel="noopener noreferrer">Consultar o canal brasileiro <span aria-hidden="true">↗</span><span className="sr-only"> (abre em nova aba)</span></a></div></section>
    </article>
  )
}
