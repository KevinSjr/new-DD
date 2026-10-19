import { useEffect, useMemo, useState } from 'react'
import { SUBJECT_AREAS, type SubjectAreaKey } from '../data/subjectAreas'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Link } from '../router/Link'
import './RankingPage.css'
import './SubjectAreaRankingPage.css'

type Entry = { index: number; rank: string; university: string; location: string; score: number | null }
type Dataset = {
  edition: number
  area: string
  count: number
  methodology_weights: Record<string, number>
  universities: Entry[]
}
type SortField = 'rank' | 'name' | 'score'

const PAGE_SIZE = 20
const WEIGHT_KEYS = ['academic', 'employer', 'citations_per_paper', 'h_index', 'international_research_network'] as const
const WEIGHT_LABELS = ['reputação acadêmica', 'reputação entre empregadores', 'citações por artigo', 'índice H', 'rede internacional de pesquisa'] as const

function validateDataset(value: unknown, areaKey: SubjectAreaKey): Dataset {
  const area = SUBJECT_AREAS[areaKey]
  if (!value || typeof value !== 'object') throw new Error('Arquivo de dados inválido.')
  const data = value as Partial<Dataset>
  if (data.edition !== 2026 || data.area !== area.sourceName || data.count !== area.count ||
    !Array.isArray(data.universities) || data.universities.length !== area.count) {
    throw new Error('A edição ou a quantidade de instituições não corresponde à planilha esperada.')
  }
  if (!data.universities.every((item, index) =>
    item.index === index + 1 && typeof item.rank === 'string' &&
    typeof item.university === 'string' && typeof item.location === 'string' &&
    (typeof item.score === 'number' || item.score === null)
  )) throw new Error('Há registros incompletos no arquivo de dados.')
  if (!data.methodology_weights || !WEIGHT_KEYS.every((key, index) => data.methodology_weights?.[key] === area.weights[index])) {
    throw new Error('Os pesos metodológicos não correspondem à planilha esperada.')
  }
  return data as Dataset
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim()
}

const scoreFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })
const percentFormatter = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 })

export function SubjectAreaRankingPage({ areaKey }: { areaKey: SubjectAreaKey }) {
  const area = SUBJECT_AREAS[areaKey]
  useDocumentTitle(`Ranking de ${area.title} 2026 | Day Dreaming`)
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [sortField, setSortField] = useState<SortField>('rank')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const controller = new AbortController()
    const url = `${import.meta.env.BASE_URL}data/${area.dataFile}`
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Não foi possível carregar os dados (HTTP ${response.status}).`)
        return response.json() as Promise<unknown>
      })
      .then((value) => setDataset(validateDataset(value, areaKey)))
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return
        setError(cause instanceof TypeError
          ? 'Não foi possível acessar o arquivo de dados. Confira sua conexão com o servidor e tente novamente.'
          : cause instanceof Error ? cause.message : 'Não foi possível carregar o ranking.')
      })
    return () => controller.abort()
  }, [area.dataFile, areaKey, loadAttempt])

  const countries = useMemo(() => [...new Set(dataset?.universities.map((entry) => entry.location) ?? [])].sort((a, b) => a.localeCompare(b, 'pt-BR')), [dataset])
  const filtered = useMemo(() => {
    const term = normalize(search)
    const matches = (dataset?.universities ?? []).filter((entry) =>
      (!country || entry.location === country) && (!term || normalize(entry.university).includes(term)))
    matches.sort((a, b) => {
      if (sortField === 'name') return a.university.localeCompare(b.university, 'pt-BR') || a.index - b.index
      if (sortField === 'score') {
        if (a.score === null) return b.score === null ? a.index - b.index : 1
        if (b.score === null) return -1
        return b.score - a.score || a.index - b.index
      }
      return a.index - b.index
    })
    return matches
  }, [dataset, search, country, sortField])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const start = filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0
  const end = Math.min(page * PAGE_SIZE, filtered.length)
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, offset) =>
    Math.max(1, Math.min(page - 2, totalPages - 4)) + offset)

  function resetFilters() {
    setSearch('')
    setCountry('')
    setSortField('rank')
    setPage(1)
  }

  const methodology = WEIGHT_KEYS.map((key, index) =>
    `${WEIGHT_LABELS[index]} (${percentFormatter.format(dataset?.methodology_weights[key] ?? area.weights[index])})`)

  return (
    <article className="ranking-page subject-ranking">
      <div className="container ranking-page__breadcrumb">
        <nav aria-label="Você está em"><Link to="/">Início</Link><span aria-hidden="true">/</span><Link to="/rankings">Rankings</Link><span aria-hidden="true">/</span><span aria-current="page">{area.title}</span></nav>
      </div>

      <header className="ranking-hero subject-ranking__hero">
        <div className="container ranking-hero__inner">
          <div><p className="ranking-page__eyebrow">QS World University Rankings by Subject · 2026</p><h1>{area.title}</h1><p>Veja a posição das instituições nesta área ampla. Para comparar uma disciplina específica, use os links abaixo.</p></div>
          <div className="ranking-hero__stat" aria-label={`${area.count} instituições na planilha da área`}><span>Ranking da área</span><strong>{area.count}</strong><small>instituições</small></div>
        </div>
      </header>

      <div className="container ranking-page__body">
        <section className="subject-ranking__subjects" aria-labelledby="subjects-title">
          <div><p className="ranking-page__eyebrow">Disciplinas da área</p><h2 id="subjects-title">{area.subjects.length} disciplinas para explorar</h2><p>Os links levam aos rankings de cada disciplina no site da QS. Esta página mostra apenas o ranking da área ampla, não combina as posições dessas listas.</p></div>
          <ul>{area.subjects.map((subject) => <li key={subject.name}><a href={subject.url} target="_blank" rel="noopener noreferrer" aria-label={`${subject.name} (abre no site da QS)`}>{subject.name} <span aria-hidden="true">↗</span></a></li>)}</ul>
        </section>

        <section className="ranking-filters" aria-labelledby="area-filters-title">
          <div className="ranking-filters__heading"><div><p className="ranking-page__eyebrow">Encontre uma instituição</p><h2 id="area-filters-title">Filtrar ranking da área</h2></div><button type="button" onClick={resetFilters} disabled={!search && !country && sortField === 'rank'}>Limpar filtros</button></div>
          <div className="ranking-filters__grid subject-ranking__filters">
            <div className="ranking-filters__field"><label htmlFor="area-search">Buscar universidade</label><input id="area-search" type="search" value={search} placeholder="Ex.: University of Oxford" onChange={(event) => { setSearch(event.target.value); setPage(1) }} /></div>
            <div className="ranking-filters__field"><label htmlFor="area-country">País ou território</label><select id="area-country" value={country} onChange={(event) => { setCountry(event.target.value); setPage(1) }}><option value="">Todos</option>{countries.map((name) => <option key={name} value={name}>{name}</option>)}</select></div>
          </div>
        </section>

        <section className="ranking-results" aria-labelledby="area-results-title">
          <div className="ranking-results__toolbar"><div><p className="ranking-page__eyebrow">Edição 2026</p><h2 id="area-results-title">Resultados</h2>{dataset && <p className="ranking-results__count" role="status">{filtered.length} {filtered.length === 1 ? 'instituição encontrada' : 'instituições encontradas'}</p>}</div><div className="ranking-filters__field"><label htmlFor="area-sort">Ordenar por</label><select id="area-sort" value={sortField} onChange={(event) => { setSortField(event.target.value as SortField); setPage(1) }}><option value="rank">Posição na lista</option><option value="name">Nome</option><option value="score">Pontuação (maior primeiro)</option></select></div></div>
          {!dataset && !error && <div className="ranking-results__message" role="status">Carregando ranking…</div>}
          {error && <div className="ranking-results__message ranking-results__message--error" role="alert"><h3>Não foi possível mostrar o ranking</h3><p>{error}</p><button type="button" onClick={() => { setError(''); setLoadAttempt((attempt) => attempt + 1) }}>Tentar novamente</button></div>}
          {dataset && filtered.length === 0 && <div className="ranking-results__message"><h3>Nenhuma universidade encontrada</h3><p>Tente outro nome ou país.</p><button type="button" onClick={resetFilters}>Ver todas as universidades</button></div>}
          {dataset && filtered.length > 0 && <><div className="ranking-results__scroll" role="region" aria-label={`Tabela de ${area.title}; role para os lados em telas pequenas`} tabIndex={0}><table><thead><tr><th scope="col">Rank QS 2026</th><th scope="col">Universidade</th><th scope="col">País ou território</th><th scope="col">Pontuação</th></tr></thead><tbody>{visible.map((entry) => <tr key={entry.index}><td><span className="ranking-results__rank">{entry.rank}</span></td><th scope="row">{entry.university}</th><td>{entry.location}</td><td>{entry.score === null ? <span className="ranking-results__missing">Não exibida</span> : <strong>{scoreFormatter.format(entry.score)}</strong>}</td></tr>)}</tbody></table></div><div className="ranking-pagination"><p>Mostrando {start}–{end} de {filtered.length}</p><nav aria-label={`Páginas do ranking de ${area.title}`}><button type="button" onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>{pageNumbers.map((number) => <button key={number} type="button" aria-current={number === page ? 'page' : undefined} aria-label={`Página ${number}`} onClick={() => setPage(number)}>{number}</button>)}<button type="button" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Próxima</button></nav></div></>}
        </section>

        <aside className="ranking-source" aria-label="Fonte e metodologia">
          <div><h2>Fonte e metodologia</h2><p>Dados da aba “{area.sourceName}” da planilha QS World University Rankings by Subject 2026, versão 1.4. A pontuação da área combina {methodology.join(', ')}, conforme os pesos informados na planilha.</p><p>Há {area.count} instituições nesta aba; {area.missingScores} não têm pontuação exibida. Empates e faixas de posição, como “501-550”, foram preservados. O ranking da área não indica elegibilidade, qualidade de um curso específico ou chance de admissão. Confira os requisitos diretamente com a instituição e eventuais correções na QS.</p></div>
          <div className="ranking-source__links"><a href={area.sourceUrl} target="_blank" rel="noopener noreferrer">Ver ranking na QS <span aria-hidden="true">↗</span></a><a href="https://www.topuniversities.com/data-copyright" target="_blank" rel="noopener noreferrer">Direitos sobre os dados <span aria-hidden="true">↗</span></a></div>
          <p className="ranking-source__credit">Source: QS Quacquarelli Symonds (www.topuniversities.com). Copyright © 2026 QS Quacquarelli Symonds Ltd.</p>
        </aside>
      </div>
    </article>
  )
}
