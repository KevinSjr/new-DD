import { useEffect, useState, type FormEvent } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './ScholarshipSearchPage.css'

type Country = { slug: string; name: string }
type Verified = { id: number; title: string; organization: string; summary: string; eligibility: string;
  funding_details: string; study_level: string; deadline_type: string; deadline_date: string | null;
  deadline_timezone: string | null; application_url: string; source_label: string; source_url: string;
  source_verified_at: string; countries: string[] }
type Lead = { source_id: string; source_url: string; title: string; field_of_study: string;
  description_excerpt: string; nationality_listing: string; host_countries_listing: string; fetched_at: string }
type Page<T> = { items: T[]; total: number; page: number; pageSize: number }
type Mode = 'verified' | 'review'
const levels = [['', 'Todos os níveis'], ['graduacao', 'Graduação'], ['pos-graduacao', 'Pós-graduação'],
  ['mestrado', 'Mestrado'], ['doutorado', 'Doutorado'], ['intercambio', 'Intercâmbio'],
  ['idiomas', 'Idiomas'], ['curso-curto', 'Curso curto'], ['pesquisa', 'Pesquisa'], ['outro', 'Outro']]
const levelName = Object.fromEntries(levels)
const formatDate = (value: string) => {
  const date = value.slice(0, 10).split('-')
  return date.length === 3 ? `${date[2]}/${date[1]}/${date[0]}` : value
}

export function ScholarshipSearchPage() {
  useDocumentTitle('Buscar bolsas | Day Dreaming')
  const [mode, setMode] = useState<Mode>('review')
  const [draftQuery, setDraftQuery] = useState('')
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('')
  const [level, setLevel] = useState('')
  const [nationality, setNationality] = useState('all')
  const [page, setPage] = useState(1)
  const [countries, setCountries] = useState<Country[]>([])
  const [data, setData] = useState<Page<Verified | Lead> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/countries', { signal: controller.signal }).then(async response => {
      if (response.ok) setCountries(await response.json())
    }).catch(() => {})
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({ page: String(page) })
    if (query) params.set('q', query)
    if (mode === 'verified') {
      if (country) params.set('country', country)
      if (level) params.set('level', level)
    } else if (nationality !== 'all') params.set('nationality', nationality)
    setLoading(true); setError('')
    fetch(`/api/${mode === 'verified' ? 'scholarships' : 'scholarship-leads'}?${params}`, { signal: controller.signal })
      .then(async response => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error || 'Não foi possível consultar as bolsas.')
        setData(body)
      })
      .catch(cause => { if (cause.name !== 'AbortError') { setData(null); setError('A busca não pôde carregar. Confira se a API e o PostgreSQL estão em execução e tente novamente.') } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [mode, query, country, level, nationality, page, retry])

  function submit(event: FormEvent) { event.preventDefault(); setPage(1); setQuery(draftQuery.trim()) }
  function switchMode(next: Mode) { setMode(next); setPage(1); setQuery(''); setDraftQuery('') }
  const countryNames = Object.fromEntries(countries.map(item => [item.slug, item.name]))
  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0

  return <article className="sch-search">
    <div className="container sch-search__breadcrumb"><nav aria-label="Você está em"><Link to="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Buscar bolsas</span></nav></div>
    <header className="sch-search__hero"><div className="container"><p className="sch-search__eyebrow">Explore com cuidado</p><h1>Encontre caminhos para financiar seus estudos</h1>
      <p>Pesquise bolsas publicadas após revisão ou explore registros do IEFA que ainda precisam ser confirmados. Antes de se candidatar, confira sempre o edital da instituição.</p></div></header>
    <div className="container sch-search__body">
      <div className="sch-search__modes" aria-label="Tipo de resultado">
        <button type="button" aria-pressed={mode === 'verified'} onClick={() => switchMode('verified')}>Bolsas verificadas</button>
        <button type="button" aria-pressed={mode === 'review'} onClick={() => switchMode('review')}>Em análise no IEFA</button>
      </div>
      <div className={`sch-search__notice ${mode === 'review' ? 'sch-search__notice--warning' : ''}`}>
        {mode === 'verified' ? <p><strong>Catálogo revisado.</strong> Aqui aparecem apenas registros publicados pela equipe com fonte e data de verificação. Mesmo assim, confirme o prazo e os requisitos no edital antes de agir.</p>
          : <p><strong>Não são editais confirmados como abertos.</strong> Estes registros vieram do filtro Brasil do IEFA em 19/10/2026 e podem estar vencidos ou ter requisitos adicionais. “Sem restrição de nacionalidade” não significa aprovação garantida.</p>}
      </div>
      <form className="sch-search__filters" onSubmit={submit} role="search">
        <label>Buscar por palavra-chave<input type="search" value={draftQuery} onChange={event => setDraftQuery(event.target.value)} placeholder={mode === 'verified' ? 'Título, instituição ou resumo' : 'Título, área ou descrição'} /></label>
        {mode === 'verified' ? <>
          <label>País<select value={country} onChange={event => { setCountry(event.target.value); setPage(1) }}><option value="">Todos os países</option>{countries.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
          <label>Nível<select value={level} onChange={event => { setLevel(event.target.value); setPage(1) }}>{levels.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </> : <label>Nacionalidade na listagem<select value={nationality} onChange={event => { setNationality(event.target.value); setPage(1) }}><option value="all">Todos do filtro Brasil</option><option value="brazil">Brasil explícito</option><option value="unrestricted">Sem restrição indicada</option><option value="other">Outras listagens</option></select></label>}
        <button type="submit">Pesquisar</button>
      </form>

      <section className="sch-search__results" aria-labelledby="sch-search-results-title">
        <div className="sch-search__heading"><div><p className="sch-search__eyebrow">Resultados</p><h2 id="sch-search-results-title">{mode === 'verified' ? 'Bolsas publicadas' : 'Registros para investigar'}</h2></div>
          {!loading && !error && data && <span aria-live="polite">{data.total} {data.total === 1 ? 'resultado' : 'resultados'}</span>}</div>
        {loading ? <p className="sch-search__state" role="status">Carregando resultados…</p> : error ? <div className="sch-search__state" role="alert"><p>{error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>Tentar novamente</button></div>
          : data?.total === 0 ? <div className="sch-search__state"><h3>Nenhum resultado por enquanto</h3><p>{mode === 'verified' && !query && !country && !level ? 'Ainda não há bolsas revisadas e publicadas. Você pode explorar os registros do IEFA enquanto a verificação acontece.' : 'Experimente outra palavra-chave ou amplie os filtros.'}</p>
            {mode === 'verified' && <button type="button" onClick={() => switchMode('review')}>Explorar registros em análise</button>}</div>
          : <><ul className="sch-search__list">{data?.items.map(item => mode === 'verified' ? (() => {
            const scholarship = item as Verified
            return <li className="sch-search__card" key={`verified-${scholarship.id}`}><div className="sch-search__card-head"><div><span className="sch-search__status">Fonte revisada</span><h3>{scholarship.title}</h3><p>{scholarship.organization}</p></div><span className="sch-search__level">{levelName[scholarship.study_level] || scholarship.study_level}</span></div>
              <p>{scholarship.summary}</p><dl><div><dt>Destino</dt><dd>{scholarship.countries.map(slug => countryNames[slug] || slug).join(', ')}</dd></div><div><dt>Prazo</dt><dd>{scholarship.deadline_type === 'fixed' && scholarship.deadline_date ? `${formatDate(scholarship.deadline_date)} · ${scholarship.deadline_timezone || 'fuso não informado'}` : scholarship.deadline_type === 'rolling' ? 'Contínuo — confirme na fonte' : 'Não confirmado'}</dd></div><div><dt>Financiamento</dt><dd>{scholarship.funding_details}</dd></div></dl>
              <p className="sch-search__source">Fonte: <a href={scholarship.source_url} target="_blank" rel="noreferrer">{scholarship.source_label}</a> · verificada em {formatDate(scholarship.source_verified_at)}</p><a className="sch-search__action" href={scholarship.application_url} target="_blank" rel="noreferrer">Consultar inscrição oficial <span aria-hidden="true">↗</span></a></li>
          })() : (() => {
            const lead = item as Lead
            return <li className="sch-search__card sch-search__card--lead" key={`lead-${lead.source_id}`}><div className="sch-search__card-head"><div><span className="sch-search__status">Em análise · IEFA</span><h3>{lead.title}</h3></div></div>
              {lead.description_excerpt && <p>{lead.description_excerpt}</p>}<dl><div><dt>Área listada</dt><dd>{lead.field_of_study || 'Não informada'}</dd></div><div><dt>Nacionalidade na listagem</dt><dd>{lead.nationality_listing}</dd></div><div><dt>Destinos listados</dt><dd>{lead.host_countries_listing}</dd></div></dl>
              <p className="sch-search__source">Coletado em {formatDate(lead.fetched_at)} · prazo e elegibilidade ainda não verificados.</p><a className="sch-search__action" href={lead.source_url} target="_blank" rel="noreferrer">Conferir registro no IEFA <span aria-hidden="true">↗</span></a></li>
          })())}</ul>
            {totalPages > 1 && <nav className="sch-search__pages" aria-label="Páginas de resultados"><button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button><span>Página {page} de {totalPages}</span><button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Próxima</button></nav>}</>}
      </section>
    </div>
  </article>
}
