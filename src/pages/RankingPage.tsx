import { useEffect, useMemo, useState } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Link } from '../router/Link'
import './RankingPage.css'

type RankingEntry = {
  index: number
  rank: string
  university: string
  location: string
  region: string
  overall_score: number | null
}

type RankingDataset = {
  edition: number
  count: number
  source_file: string
  universities: RankingEntry[]
}

type SortField = 'rank' | 'name' | 'score'
type SortOrder = 'asc' | 'desc'

const PAGE_SIZE = 20
const DATA_URL = `${import.meta.env.BASE_URL}data/qs-world-university-rankings-2027-top1000.json`

const REGION_NAMES: Record<string, string> = {
  Africa: 'África',
  Americas: 'Américas',
  Asia: 'Ásia',
  Europe: 'Europa',
  Oceania: 'Oceania',
}

function validateDataset(value: unknown): RankingDataset {
  if (!value || typeof value !== 'object') throw new Error('Arquivo de dados inválido.')
  const dataset = value as Partial<RankingDataset>
  if (dataset.edition !== 2027 || dataset.count !== 1000 || !Array.isArray(dataset.universities) || dataset.universities.length !== 1000) {
    throw new Error('A edição ou a quantidade de universidades não corresponde à fonte esperada.')
  }
  if (!dataset.universities.every((item, index) =>
    item.index === index + 1 && typeof item.rank === 'string' &&
    typeof item.university === 'string' && typeof item.location === 'string' &&
    typeof item.region === 'string' &&
    (typeof item.overall_score === 'number' || item.overall_score === null)
  )) {
    throw new Error('Há registros incompletos no arquivo de dados.')
  }
  return dataset as RankingDataset
}

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim()
}

function formatScore(score: number | null) {
  return score === null ? null : new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(score)
}

export function RankingPage() {
  useDocumentTitle('Ranking de universidades 2027 | Daydreaming')
  const [dataset, setDataset] = useState<RankingDataset | null>(null)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [sortField, setSortField] = useState<SortField>('rank')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const controller = new AbortController()
    fetch(DATA_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Não foi possível carregar os dados (HTTP ${response.status}).`)
        return response.json() as Promise<unknown>
      })
      .then((data) => setDataset(validateDataset(data)))
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return
        setError(cause instanceof TypeError
          ? 'Não foi possível acessar o arquivo de dados. Confira sua conexão com o servidor e tente novamente.'
          : cause instanceof Error ? cause.message : 'Não foi possível carregar o ranking.')
      })
    return () => controller.abort()
  }, [loadAttempt])

  const countries = useMemo(() =>
    [...new Set(dataset?.universities.map((item) => item.location) ?? [])]
      .sort((a, b) => a.localeCompare(b, 'pt-BR')),
  [dataset])
  const regions = useMemo(() =>
    [...new Set(dataset?.universities.map((item) => item.region) ?? [])]
      .sort((a, b) => (REGION_NAMES[a] ?? a).localeCompare(REGION_NAMES[b] ?? b, 'pt-BR')),
  [dataset])

  const filtered = useMemo(() => {
    const term = normalizeSearch(search)
    const entries = (dataset?.universities ?? []).filter((item) =>
      (!country || item.location === country) &&
      (!region || item.region === region) &&
      (!term || normalizeSearch(item.university).includes(term))
    )
    entries.sort((a, b) => {
      if (sortField === 'score') {
        if (a.overall_score === null) return b.overall_score === null ? a.index - b.index : 1
        if (b.overall_score === null) return -1
        const comparison = a.overall_score - b.overall_score
        return (sortOrder === 'asc' ? comparison : -comparison) || a.index - b.index
      }
      if (sortField === 'name') {
        const comparison = a.university.localeCompare(b.university, 'pt-BR')
        return (sortOrder === 'asc' ? comparison : -comparison) || a.index - b.index
      }
      return sortOrder === 'asc' ? a.index - b.index : b.index - a.index
    })
    return entries
  }, [dataset, search, country, region, sortField, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const rangeStart = filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length)
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, offset) => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4))
    return start + offset
  })

  function clearFilters() {
    setSearch('')
    setCountry('')
    setRegion('')
    setSortField('rank')
    setSortOrder('asc')
    setPage(1)
  }

  function retryLoading() {
    setError('')
    setLoadAttempt((attempt) => attempt + 1)
  }

  return (
    <article className="ranking-page">
      <div className="container ranking-page__breadcrumb">
        <nav aria-label="Você está em"><Link to="/">Início</Link><span aria-hidden="true">/</span><Link to="/rankings">Rankings</Link><span aria-hidden="true">/</span><span aria-current="page">Universidades</span></nav>
      </div>

      <header className="ranking-hero">
        <div className="container ranking-hero__inner">
          <div>
            <p className="ranking-page__eyebrow">QS World University Rankings · edição 2027</p>
            <h1>Explore universidades pelo mundo</h1>
            <p>Busque por instituição, compare posições e descubra onde estão as primeiras 1.000 universidades da lista fornecida pela QS.</p>
          </div>
          <div className="ranking-hero__stat" aria-label="1.000 universidades nesta seleção">
            <span>Seleção da lista</span><strong>1.000</strong><small>instituições</small>
          </div>
        </div>
      </header>

      <div className="container ranking-page__body">
        <section className="ranking-filters" aria-labelledby="ranking-filters-title">
          <div className="ranking-filters__heading">
            <div><p className="ranking-page__eyebrow">Encontre sua próxima opção</p><h2 id="ranking-filters-title">Filtrar resultados</h2></div>
            <button type="button" onClick={clearFilters} disabled={!search && !country && !region && sortField === 'rank' && sortOrder === 'asc'}>Limpar filtros</button>
          </div>
          <div className="ranking-filters__grid">
            <div className="ranking-filters__field ranking-filters__field--search">
              <label htmlFor="ranking-search">Buscar universidade</label>
              <input id="ranking-search" type="search" value={search} placeholder="Ex.: University of Cambridge"
                onChange={(event) => { setSearch(event.target.value); setPage(1) }} />
            </div>
            <div className="ranking-filters__field">
              <label htmlFor="ranking-country">País ou território</label>
              <select id="ranking-country" value={country} onChange={(event) => { setCountry(event.target.value); setPage(1) }}>
                <option value="">Todos</option>
                {countries.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div className="ranking-filters__field">
              <label htmlFor="ranking-region">Região</label>
              <select id="ranking-region" value={region} onChange={(event) => { setRegion(event.target.value); setPage(1) }}>
                <option value="">Todas</option>
                {regions.map((name) => <option key={name} value={name}>{REGION_NAMES[name] ?? name}</option>)}
              </select>
            </div>
          </div>
          <p className="ranking-filters__hint">Os resultados mudam à medida que você pesquisa. A planilha não informa áreas de estudo.</p>
        </section>

        <section className="ranking-results" aria-labelledby="ranking-results-title">
          <div className="ranking-results__toolbar">
            <div>
              <p className="ranking-page__eyebrow">Lista de universidades</p>
              <h2 id="ranking-results-title">Resultados</h2>
              {dataset && <p className="ranking-results__count" role="status">{filtered.length} {filtered.length === 1 ? 'instituição encontrada' : 'instituições encontradas'}</p>}
            </div>
            <div className="ranking-results__sort">
              <div className="ranking-filters__field">
                <label htmlFor="ranking-sort">Ordenar por</label>
                <select id="ranking-sort" value={sortField} onChange={(event) => { setSortField(event.target.value as SortField); setPage(1) }}>
                  <option value="rank">Posição na lista</option><option value="name">Nome</option><option value="score">Pontuação</option>
                </select>
              </div>
              <div className="ranking-filters__field">
                <label htmlFor="ranking-order">Ordem</label>
                <select id="ranking-order" value={sortOrder} onChange={(event) => { setSortOrder(event.target.value as SortOrder); setPage(1) }}>
                  <option value="asc">Crescente</option><option value="desc">Decrescente</option>
                </select>
              </div>
            </div>
          </div>

          {!dataset && !error && <div className="ranking-results__message" role="status">Carregando ranking…</div>}
          {error && <div className="ranking-results__message ranking-results__message--error" role="alert"><h3>Não foi possível mostrar o ranking</h3><p>{error}</p><button type="button" onClick={retryLoading}>Tentar novamente</button></div>}
          {dataset && filtered.length === 0 && <div className="ranking-results__message"><h3>Nenhuma universidade encontrada</h3><p>Tente outro nome, país ou região.</p><button type="button" onClick={clearFilters}>Ver todas as universidades</button></div>}

          {dataset && filtered.length > 0 && <>
            <div className="ranking-results__scroll" role="region" aria-label="Tabela do ranking; role para os lados em telas pequenas" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Rank QS</th><th scope="col">Universidade</th><th scope="col">País ou território</th><th scope="col">Overall score</th></tr></thead>
                <tbody>{visible.map((item) => <tr key={item.index}>
                  <td><span className="ranking-results__rank">{item.rank}</span></td>
                  <th scope="row">{item.university}</th>
                  <td>{item.location}</td>
                  <td>{item.overall_score === null ? <span className="ranking-results__missing">Não exibida</span> : <strong>{formatScore(item.overall_score)}</strong>}</td>
                </tr>)}</tbody>
              </table>
            </div>
            <div className="ranking-pagination">
              <p>Mostrando {rangeStart}–{rangeEnd} de {filtered.length}</p>
              <nav aria-label="Páginas do ranking">
                <button type="button" onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
                {pageNumbers.map((number) => <button key={number} type="button" aria-current={number === page ? 'page' : undefined} aria-label={`Página ${number}`} onClick={() => setPage(number)}>{number}</button>)}
                <button type="button" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Próxima</button>
              </nav>
            </div>
          </>}
        </section>

        <aside className="ranking-source" aria-label="Fonte e limitações do ranking">
          <div><h2>Como usar esta lista</h2><p>Este recorte reúne as primeiras 1.000 instituições da planilha QS 2027, versão 1.3. Países e territórios mantêm os nomes da fonte. A planilha não informa cidade; para 300 instituições ela não mostra overall score, por isso aparece “Não exibida”. Empates e faixas de rank foram preservados.</p><p>Um ranking é um ponto de partida, não uma avaliação de adequação, elegibilidade ou aprovação. Confira curso, custos e requisitos diretamente com cada universidade.</p></div>
          <div className="ranking-source__links"><a href="https://www.topuniversities.com/world-university-rankings" target="_blank" rel="noopener noreferrer">Ver ranking na QS <span aria-hidden="true">↗</span></a><a href="https://www.topuniversities.com/data-copyright" target="_blank" rel="noopener noreferrer">Direitos sobre os dados <span aria-hidden="true">↗</span></a></div>
          <p className="ranking-source__credit">Source: QS Quacquarelli Symonds (www.topuniversities.com). Copyright © 2026 QS Quacquarelli Symonds Ltd.</p>
        </aside>
      </div>
    </article>
  )
}
