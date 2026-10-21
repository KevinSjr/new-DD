import { useEffect, useState } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './ScholarshipSearchPage.css'

type Country = { slug: string; name: string }
type Scholarship = {
  source: 'verified' | 'iefa' | 'scholarship_america' | 'study_australia' | 'daad' | 'campusbourses' | 'study_japan' | 'scholarship_china' | 'study_korea' | 'spain_administration' | 'universitaly_maeci' | 'swiss_excellence' | 'study_in_sweden' | 'efg_finland'; source_id: string; title: string;
  description: string; source_label: string; source_url: string; application_url: string | null;
  observed_at: string; deadline: string | null; amount: string | null; source_status: string;
  brazil_criteria: string; field_of_study: string | null; nationality: string | null;
  destinations: string | null; study_level: string | null; country_basis: string;
}
type Page = { items: Scholarship[]; total: number; page: number; pageSize: number }
const levelNames: Record<string, string> = {
  graduacao: 'Graduação', 'pos-graduacao': 'Pós-graduação', mestrado: 'Mestrado',
  doutorado: 'Doutorado', intercambio: 'Intercâmbio', idiomas: 'Idiomas',
  'curso-curto': 'Curso curto', pesquisa: 'Pesquisa', outro: 'Outro',
}
const sourceLevelNames: Record<string, string> = {
  CEGEP: 'CEGEP (pré-universitário no Canadá)', 'College Freshman': '1º ano de graduação',
  'College Graduate': 'Graduado(a)', 'College Senior': 'Último ano de graduação',
  'College Sophomore': '2º ano de graduação', 'College Undergraduate': 'Graduação',
  'Community College Student': 'Faculdade comunitária',
  'Final Year Upper or Higher Secondary': 'Último ano do ensino médio',
  'General Equivalency Diploma (GED)': 'Diploma de equivalência do ensino médio (GED)',
  'Graduate Student': 'Pós-graduação', 'High School Graduate': 'Formado(a) no ensino médio',
  'High School Junior': 'Penúltimo ano do ensino médio', 'High School Senior': 'Último ano do ensino médio',
  'Law School Student': 'Estudante de Direito', 'PhD Student': 'Doutorado',
  'Post-graduate': 'Pós-graduação', 'Secondary Students (grades 8 - 11)': 'Ensino médio (séries 8 a 11)',
  'Secondary Students (grades 9 - 11)': 'Ensino médio (séries 9 a 11)',
  'Technical School Graduate': 'Formado(a) em curso técnico',
  'Undergraduate / VET': 'Graduação / formação profissional',
  Postgraduate: 'Pós-graduação',
  'Secondary schooling': 'Ensino médio',
  'Primary schooling': 'Ensino fundamental',
  Undergraduates: 'Estudantes de graduação',
  Graduates: 'Pessoas graduadas',
  'Doctoral candidates/PhD students': 'Doutorandos',
  'Postdoctoral researchers': 'Pesquisadores de pós-doutorado',
  Faculty: 'Docentes',
}
const studyLevel = (value: string | null) => value
  ? levelNames[value] || value.split(', ').map(item => sourceLevelNames[item] || item).join(', ')
  : 'Não informado'
const sourceName: Record<Scholarship['source'], string> = {
  verified: 'Verificada', iefa: 'IEFA · catálogo', scholarship_america: 'Scholarship America · catálogo',
  study_australia: 'Study Australia · catálogo',
  daad: 'Base DAAD · catálogo',
  campusbourses: 'CampusBourses · catálogo',
  study_japan: 'Study in Japan · catálogo',
  scholarship_china: 'ScholarshipChina · catálogo',
  study_korea: 'Study in Korea · universidade',
  spain_administration: 'Portal público da Espanha',
  universitaly_maeci: 'Governo italiano · MAECI',
  swiss_excellence: 'Governo suíço · FCS',
  study_in_sweden: 'Study in Sweden · catálogo',
  efg_finland: 'European Funding Guide · Finlândia',
}
const observedDate = (value: string) => {
  const date = value.slice(0, 10).split('-')
  return date.length === 3 ? `${date[2]}/${date[1]}/${date[0]}` : value
}

function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  const value = scholarship.amount?.trim()
  return <li className={`sch-search__card ${scholarship.source === 'verified' ? '' : 'sch-search__card--lead'}`}>
    <div className="sch-search__card-head"><div><span className="sch-search__status">{sourceName[scholarship.source]}</span><h3>{scholarship.title}</h3></div></div>
    {scholarship.description && <p className="sch-search__description">{scholarship.description}</p>}
    <dl>
      <div><dt>Prazo (deadline)</dt><dd>{scholarship.deadline || 'Não informado'}</dd></div>
      <div><dt>Valor total da bolsa</dt><dd>{scholarship.source === 'universitaly_maeci' ? value : value ? <>Não confirmado como total<small>Valor/benefício divulgado: {value}</small></> : 'Não informado'}</dd></div>
      <div><dt>Status da bolsa</dt><dd>{scholarship.source_status}</dd></div>
      <div><dt>Brasil nos critérios</dt><dd>{scholarship.brazil_criteria}</dd></div>
      <div><dt>Área listada</dt><dd>{scholarship.field_of_study || 'Não informada'}</dd></div>
      <div><dt>Nacionalidade listada</dt><dd>{scholarship.nationality || 'Não informada'}</dd></div>
      <div><dt>Destino listado</dt><dd>{scholarship.destinations || 'Não informado'}</dd></div>
      <div><dt>Nível de estudo</dt><dd>{studyLevel(scholarship.study_level)}</dd></div>
    </dl>
    <p className="sch-search__source">{scholarship.country_basis}. Fonte: {scholarship.source_label} · {scholarship.source === 'verified' ? 'verificada' : 'coletada'} em {observedDate(scholarship.observed_at)}. Confirme prazo e elegibilidade na página original.</p>
    <div className="sch-search__links"><a className="sch-search__action" href={scholarship.source_url} target="_blank" rel="noreferrer">{scholarship.source === 'study_in_sweden' ? 'Ver listagem original' : 'Ver página da bolsa'} <span aria-hidden="true">↗</span></a>
      {scholarship.application_url && <a className="sch-search__action" href={scholarship.application_url} target="_blank" rel="noreferrer">{scholarship.source === 'spain_administration' ? 'Ver publicação oficial' : (scholarship.source === 'study_in_sweden' || scholarship.source === 'efg_finland') ? 'Ver página do provedor' : 'Consultar inscrição'} <span aria-hidden="true">↗</span></a>}</div>
  </li>
}

export function ScholarshipSearchPage() {
  useDocumentTitle('Buscar bolsas | Day Dreaming')
  const [country, setCountry] = useState('')
  const [page, setPage] = useState(1)
  const [countries, setCountries] = useState<Country[]>([])
  const [data, setData] = useState<Page | null>(null)
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
    if (country) params.set('country', country)
    setLoading(true); setError('')
    fetch(`/api/scholarship-catalog?${params}`, { signal: controller.signal })
      .then(async response => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error || 'Não foi possível consultar as bolsas.')
        setData(body)
      })
      .catch(cause => { if (cause.name !== 'AbortError') { setData(null); setError('A busca não pôde carregar. Confira se a API e o PostgreSQL estão em execução e tente novamente.') } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [country, page, retry])

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0
  return <article className="sch-search">
    <div className="container sch-search__breadcrumb"><nav aria-label="Você está em"><Link to="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Buscar bolsas</span></nav></div>
    <header className="sch-search__hero"><div className="container"><p className="sch-search__eyebrow">Explore com cuidado</p><h1>Encontre caminhos para financiar seus estudos</h1>
      <p>Compare registros de bolsas em um único formato e confira os detalhes na fonte antes de planejar uma candidatura.</p></div></header>
    <div className="container sch-search__body">
      <div className="sch-search__notice sch-search__notice--warning"><p><strong>Registros de fontes diferentes são listados automaticamente.</strong> A inclusão no catálogo não confirma que a bolsa esteja aberta nem que você seja elegível. Campos ausentes aparecem como “não informado”; valores divulgados podem não representar o total da bolsa. Confira prazo, valor e critérios na página original.</p></div>
      <div className="sch-search__filters"><label htmlFor="scholarship-country">País<select id="scholarship-country" value={country} onChange={event => { setCountry(event.target.value); setPage(1) }}><option value="">Todos os países</option>{countries.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label></div>
      {country === 'estados-unidos' && <p className="sch-search__country-note">Estados Unidos reúne registros do IEFA que listam esse destino e o catálogo da Scholarship America, sediado nos EUA. Para esta última fonte, a localização do catálogo <strong>não confirma o país onde o estudo ocorrerá</strong>.</p>}
      {country === 'australia' && <p className="sch-search__country-note">Austrália reúne registros do IEFA que listam esse destino e bolsas do Study Australia sem indicação de que possam ser realizadas no exterior. Estar no catálogo ou aceitar estudantes internacionais <strong>não confirma elegibilidade para brasileiros</strong>; confira o edital da instituição.</p>}
      {country === 'alemanha' && <p className="sch-search__country-note">Alemanha reúne registros do IEFA que listam esse destino e programas da base DAAD. Na base DAAD, o filtro “Country” indica <strong>de onde a pessoa se candidata, não onde estudará</strong>. Por isso, o destino e a elegibilidade devem ser confirmados na página de cada programa.</p>}
      {country === 'coreia-do-sul' && <p className="sch-search__country-note">Coreia do Sul inclui bolsas divulgadas por universidades no Study in Korea. Algumas exigem vínculo ou condições locais; <strong>estar na lista não confirma elegibilidade para brasileiros nem inscrições abertas</strong>. Confira a ficha e a universidade antes de se candidatar.</p>}
      {country === 'espanha' && <p className="sch-search__country-note">Espanha reúne registros classificados como “BECAS” no portal da administração pública espanhola. O âmbito geográfico indica a jurisdição da convocatória, <strong>não garante que os estudos ocorram na Espanha nem que brasileiros possam se candidatar</strong>. Confira beneficiários, prazo e edital.</p>}
      {country === 'italia' && <p className="sch-search__country-note">Itália inclui uma chamada MAECI 2026–2027 vinculada pelo Universitaly. <strong>O prazo desta edição já terminou</strong>. O Brasil aparece na lista oficial de países, mas a candidatura depende de todos os requisitos do edital; não há nova edição confirmada aqui.</p>}
      {country === 'suica' && <p className="sch-search__country-note">Suíça inclui as modalidades Pesquisa e Doutorado da bolsa federal 2027–2028, listadas para candidaturas do Brasil. <strong>Prazo divulgado: 27/10/2026, às 23h59 no horário suíço.</strong> A quantia divulgada é mensal, não o valor total; é preciso atender aos requisitos e obter apoio de um orientador na Suíça. A modalidade de Artes não consta da lista para o Brasil.</p>}
      {country === 'suecia' && <p className="sch-search__country-note">Suécia reúne registros da listagem Study in Sweden: bolsas universitárias, do Swedish Institute e de outras organizações. Muitos links levam a páginas gerais, e alguns programas externos <strong>não confirmam a Suécia como destino</strong>. A menção ao Brasil ou à categoria “fora da União Europeia” não confirma elegibilidade individual. Prazo, valor e abertura precisam ser conferidos no provedor.</p>}
      {country === 'finlandia' && <p className="sch-search__country-note">Finlândia inclui cinco fichas públicas da seção de estudos na Finlândia do European Funding Guide. A lista completa anunciada pela fonte exige cadastro e não foi coletada. <strong>Alguns apoios exigem vínculo prévio com instituição finlandesa; um também permite pesquisa fora do país.</strong> A página informa quando a nacionalidade brasileira não basta ou quando um prazo de 2026 já passou.</p>}
      {country === 'china' && <p className="sch-search__country-note">China reúne programas com bolsa listados no ScholarshipChina e registros IEFA que indicam esse destino. O ScholarshipChina é uma plataforma de candidatura, não um edital governamental: <strong>mensalidade reduzida ou zerada não significa bolsa em dinheiro</strong>. A ficha pode cobrar taxas de candidatura e serviço e trazer restrições de nacionalidade. Confira esses custos, as condições, o prazo e a elegibilidade antes de se candidatar.</p>}
      <section className="sch-search__results" aria-labelledby="sch-search-results-title">
        <div className="sch-search__heading"><div><p className="sch-search__eyebrow">Resultados</p><h2 id="sch-search-results-title">Bolsas para explorar</h2></div>
          {!loading && !error && data && <span aria-live="polite">{data.total} {data.total === 1 ? 'resultado' : 'resultados'}</span>}</div>
        {loading ? <p className="sch-search__state" role="status">Carregando resultados…</p> : error ? <div className="sch-search__state" role="alert"><p>{error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>Tentar novamente</button></div>
          : data?.total === 0 ? <div className="sch-search__state"><h3>Nenhum registro para este país</h3><p>Experimente outro país. Bolsas sem destino explícito no IEFA não são atribuídas automaticamente a países específicos.</p></div>
            : <><ul className="sch-search__list">{data?.items.map(item => <ScholarshipCard key={`${item.source}-${item.source_id}`} scholarship={item} />)}</ul>
              {totalPages > 1 && <nav className="sch-search__pages" aria-label="Páginas de resultados"><button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button><span>Página {page} de {totalPages}</span><button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Próxima</button></nav>}</>}
      </section>
    </div>
  </article>
}
