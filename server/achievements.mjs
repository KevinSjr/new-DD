import { database } from './db.mjs'
import { streakFromDays } from './streak.mjs'
import { countryHostName } from './scholarshipCatalog.mjs'

const regionByCountry = Object.fromEntries([
  ['estados-unidos','canada'].map(slug => [slug,'america']),
  ['australia','nova-zelandia'].map(slug => [slug,'oceania']),
  ['japao','china','coreia-do-sul','taiwan','hong-kong','singapura','malasia'].map(slug => [slug,'asia']),
  ['reino-unido','alemanha','franca','espanha','paises-baixos','italia','portugal','irlanda','suica','suecia','finlandia','dinamarca','belgica','noruega'].map(slug => [slug,'europe']),
].flat())
const countries = new Set(Object.keys(regionByCountry))
const areas = new Set(['arts-humanities','engineering-technology','life-sciences-medicine','natural-sciences','social-sciences-management'])
const interestAreas = new Set(['practical','investigative','creative','social','enterprising','organizational'])
const serverOnly = new Set(['profile-save','deadline-save','journey-task','gpa-save','gpa-saved-update','sch-save','document-upload'])
const trackable = new Set(['guide-view','guide-section','guide-bolsas','guide-source','sch-search','sch-source','saved-source','rank-view','rank-page','rank-filter','destination-complete','destination-guide','voc-complete','voc-chart','voc-profile','gpa-calculate','gpa-compare','sat-report','mext-report','journey-view',...serverOnly])
export const isPublicAchievementEvent = kind => trackable.has(kind) && !serverOnly.has(kind)
const detailFields = {
  'sch-search':['country','level','area','deadline','criteria','query'],
  'sch-source':['scholarship','criteria','deadlineFilter','hasDate'],
  'rank-page':['scope'], 'rank-filter':['scope','country','filterCount'],
  'destination-complete':['signature','top'], 'destination-guide':['run','slug','rank'],
  'voc-complete':['leaders'], 'voc-profile':['run','profile'],
  'gpa-calculate':['mode','weighted'], 'sat-report':['reading','math'], 'journey-view':['hasFutureDeadline'],
}
const fail = (status, message) => { throw Object.assign(new Error(message), { status }) }
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone:'America/Sao_Paulo', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date())
const countUnique = values => new Set(values).size
const distinctDays = rows => countUnique(rows.map(row => row.day))
const events = (state, kind) => state.events.filter(row => row.kind === kind)
const count = (state, kind) => events(state, kind).length
const has = (state, kind) => count(state, kind) > 0
const distinctTargets = (state, kind) => countUnique(events(state, kind).map(row => row.target))
const is = (state, kind, target) => events(state, kind).some(row => row.target === target)
const claims = (state, source) => state.claims.filter(row => row.source === source)
const claimDays = (state, source) => countUnique(claims(state, source).map(row => row.day))
const twoKindsSameDay = (left, right) => left.some(item => right.some(other => other.day === item.day))
const achievementDefinitions = []
function add(category, key, title, detail, target, href, progress, xp = 10, available = true) {
  achievementDefinitions.push({ category, key, title, detail, target, href, progress, xp, available })
}

const account = 'Perfil e plano'
add(account,'profile-first-step','Primeiro passo','Salve destino, nível e área de interesse no perfil.',1,'/conta?tab=metas',s => Number(s.profile.goal),20)
add(account,'profile-calendar','Plano no calendário','Cadastre seu primeiro prazo na jornada.',1,'/conta?tab=jornada',s => Number(s.deadlines.length > 0),15)
add(account,'profile-gpa','Notas traduzidas','Salve as três estimativas de GPA no perfil.',1,'/calculadora-gpa',s => Number(s.gpa),15)

const practice = 'Prática geral'
add(practice,'practice-first','Primeiro desafio','Conclua um desafio diário SAT ou MEXT.',1,'/exames',s => Number(s.claims.length > 0),10)
add(practice,'practice-both','Dois caminhos','Conclua desafios SAT e MEXT no mesmo dia.',1,'/exames',s => Number(twoKindsSameDay(claims(s,'sat'),claims(s,'mext'))),15)
add(practice,'practice-three','Prática em três dias','Pratique em três dias diferentes.',3,'/exames',s => distinctDays(s.claims),15)
add(practice,'practice-thirty','Trinta dias de prática','Pratique em 30 dias diferentes.',30,'/exames',s => distinctDays(s.claims),45)
add(practice,'practice-return','De volta à jornada','Retome um desafio após uma pausa de pelo menos um dia.',1,'/exames',s => Number([...new Set(s.claims.map(row => row.day))].sort().some((day,index,days) => index > 0 && (Date.parse(day) - Date.parse(days[index-1])) / 86400000 > 1)),15)

const guides = 'Guias de países'
add(guides,'guide-first','Primeiro passaporte','Explore seu primeiro guia de país.',1,'/#paises',s => distinctTargets(s,'guide-view'))
add(guides,'guide-three','Três horizontes','Explore guias de três países.',3,'/#paises',s => distinctTargets(s,'guide-view'),15)
add(guides,'guide-five','Mapa aberto','Explore cinco países.',5,'/#paises',s => distinctTargets(s,'guide-view'),20)
add(guides,'guide-ten','Coleção de destinos','Explore dez países.',10,'/#paises',s => distinctTargets(s,'guide-view'),30)
add(guides,'guide-all','Volta ao mundo Daydreaming','Explore os 25 guias disponíveis.',25,'/#paises',s => distinctTargets(s,'guide-view'),50)
add(guides,'guide-four-regions','Quatro cantos','Explore um país de cada uma das quatro regiões.',4,'/#paises',s => countUnique(events(s,'guide-view').map(row => regionByCountry[row.target]).filter(Boolean)),25)
add(guides,'guide-europe','Rota europeia','Explore três guias europeus.',3,'/#paises',s => countUnique(events(s,'guide-view').filter(row => regionByCountry[row.target] === 'europe').map(row => row.target)),15)
add(guides,'guide-asia','Rota asiática','Explore três guias asiáticos.',3,'/#paises',s => countUnique(events(s,'guide-view').filter(row => regionByCountry[row.target] === 'asia').map(row => row.target)),15)
add(guides,'guide-oceania','Rota da Oceania','Explore Austrália e Nova Zelândia.',2,'/#paises',s => ['australia','nova-zelandia'].filter(slug => is(s,'guide-view',slug)).length,15)
add(guides,'guide-daily-life','Vida no destino','Abra custos, cultura e vida estudantil de um mesmo guia quando essas seções estiverem disponíveis.',3,'/#paises',() => 0,20,false)
add(guides,'guide-trip-plan','Planejamento de viagem','Abra calendário, visto e trabalho de um mesmo guia.',3,'/#paises',s => Math.max(0,...[...countries].map(slug => ['calendar','visa','work'].filter(part => is(s,'guide-section',`${slug}:${part}`)).length)),20)
add(guides,'guide-to-scholarships','Bolsas no mapa','Vá de um guia ao buscador filtrado para aquele país.',1,'/#paises',s => Number(has(s,'guide-bolsas')))
add(guides,'guide-official-sources','Fonte à vista','Abra fontes oficiais indicadas em três guias.',3,'/#paises',s => distinctTargets(s,'guide-source'),15)
add(guides,'guide-revisit','Destino revisitado','Volte ao mesmo guia em outro dia.',2,'/#paises',s => Math.max(0,...[...countries].map(slug => distinctDays(events(s,'guide-view').filter(row => row.target === slug)))))

const scholarships = 'Buscador de bolsas'
add(scholarships,'sch-first-search','Primeira busca','Faça a primeira pesquisa no catálogo.',1,'/bolsas',s => Number(has(s,'sch-search')))
add(scholarships,'sch-directed','Busca com direção','Use país e nível na mesma pesquisa.',1,'/bolsas',s => Number(events(s,'sch-search').some(row => row.details.country && row.details.level)))
add(scholarships,'sch-detailed','Pesquisa detalhada','Combine país, nível, área e prazo.',1,'/bolsas',s => Number(events(s,'sch-search').some(row => row.details.country && row.details.level && row.details.area && row.details.deadline)),15)
add(scholarships,'sch-criteria','Critérios em foco','Use o filtro de critérios e abra a fonte de uma oportunidade.',1,'/bolsas',s => Number(events(s,'sch-source').some(row => row.details.criteria)))
add(scholarships,'sch-deadline','Data na busca','Filtre por prazo e abra uma oportunidade com data informada.',1,'/bolsas',s => Number(events(s,'sch-source').some(row => row.details.deadlineFilter && row.details.hasDate)))
add(scholarships,'sch-three-countries','Bolsas em três países','Pesquise bolsas em três países.',3,'/bolsas',s => countUnique(events(s,'sch-search').map(row => row.details.country).filter(Boolean)),15)
add(scholarships,'sch-three-areas','Novas áreas','Pesquise três áreas de estudo.',3,'/bolsas',s => countUnique(events(s,'sch-search').map(row => row.details.area).filter(Boolean)),15)
add(scholarships,'sch-first-source','Primeira fonte','Abra a fonte original de uma oportunidade.',1,'/bolsas',s => countUnique(events(s,'sch-source').map(row => row.details.scholarship)))
add(scholarships,'sch-five-sources','Cinco fontes na mão','Abra fontes de cinco oportunidades.',5,'/bolsas',s => countUnique(events(s,'sch-source').map(row => row.details.scholarship)),20)
add(scholarships,'sch-return','Pesquisa retomada','Volte em outro dia e faça nova pesquisa com filtros.',2,'/bolsas',s => distinctDays(events(s,'sch-search').filter(row => Object.values(row.details).some(Boolean))),15)
add(scholarships,'sch-shortlist','Minha lista curta','Salve três oportunidades diferentes.',3,'/bolsas',s => s.saved.length,15)
add(scholarships,'sch-application-plan','Plano de candidatura','Associe uma bolsa salva a um prazo pessoal.',1,'/conta?tab=jornada',s => Number(s.deadlines.some(row => row.saved_source)),20)
add(scholarships,'sch-source-refresh','Informação atualizada','Volte à fonte de uma bolsa salva em outra data.',2,'/conta?tab=bolsas',s => Math.max(0,...s.saved.map(item => distinctDays(events(s,'saved-source').filter(row => row.target === `${item.source}:${item.source_id}`)))) ,15)

const rankings = 'Rankings'
add(rankings,'rank-first','Primeiro olhar','Abra o ranking geral pela primeira vez.',1,'/ranking',s => Number(is(s,'rank-view','general')))
add(rankings,'rank-two-pages','Olhar além do topo','Explore duas páginas do ranking geral.',2,'/ranking',s => countUnique(events(s,'rank-page').filter(row => row.details.scope === 'general').map(row => row.target)))
add(rankings,'rank-three-areas','Explorador de áreas','Abra rankings de três áreas de cursos.',3,'/rankings',s => countUnique(events(s,'rank-view').filter(row => row.target !== 'general').map(row => row.target)),15)
add(rankings,'rank-my-area','Minha área de interesse','Escolha um ranking de área.',1,'/rankings',s => Number(events(s,'rank-view').some(row => row.target !== 'general')))
add(rankings,'rank-three-countries','De olho no mundo','Consulte universidades de três países.',3,'/ranking',s => countUnique(events(s,'rank-filter').map(row => row.details.country).filter(Boolean)),15)
add(rankings,'rank-two-filters','Pesquisa com critério','Use dois filtros na mesma busca.',1,'/ranking',s => Number(events(s,'rank-filter').some(row => row.details.filterCount >= 2)))
add(rankings,'rank-two-ways','Comparador de caminhos','Consulte o ranking geral e um por área.',2,'/rankings',s => Number(is(s,'rank-view','general')) + Number(events(s,'rank-view').some(row => row.target !== 'general')))
add(rankings,'rank-all-areas','Panorama completo','Explore as cinco grandes áreas.',5,'/rankings',s => countUnique(events(s,'rank-view').filter(row => row.target !== 'general').map(row => row.target)),30)
add(rankings,'rank-persistent','Pesquisador persistente','Volte aos rankings em três dias diferentes.',3,'/rankings',s => distinctDays(events(s,'rank-view')),15)

const destinations = 'Descobridor de destinos'
add(destinations,'dest-first','Primeira descoberta','Conclua o questionário pela primeira vez.',1,'/descobridor-de-destinos',s => Number(has(s,'destination-complete')))
add(destinations,'dest-guide','Do resultado ao guia','Abra o guia de um país apresentado no resultado.',1,'/descobridor-de-destinos',s => Number(has(s,'destination-guide')))
add(destinations,'dest-second','Além da primeira opção','Explore outro país do mesmo resultado.',2,'/descobridor-de-destinos',s => Math.max(0,...events(s,'destination-guide').filter(row => row.details.rank <= 5).map(row => countUnique(events(s,'destination-guide').filter(other => other.details.run === row.details.run && other.details.rank <= 5).map(other => other.details.slug)))))
add(destinations,'dest-regions','Horizontes diferentes','Explore resultados de duas regiões.',2,'/descobridor-de-destinos',s => countUnique(events(s,'destination-guide').map(row => regionByCountry[row.details.slug]).filter(Boolean)),15)
add(destinations,'dest-evolving','Escolhas em evolução','Refaça o questionário em outro dia com preferências diferentes.',1,'/descobridor-de-destinos',s => Number(events(s,'destination-complete').some(row => events(s,'destination-complete').some(other => other.day !== row.day && other.details.signature !== row.details.signature))),15)
add(destinations,'dest-perspective','Destino em perspectiva','Abra os três primeiros guias de um resultado.',3,'/descobridor-de-destinos',s => Math.max(0,...events(s,'destination-complete').map(run => countUnique(events(s,'destination-guide').filter(row => row.details.run === run.target && row.details.rank <= 3).map(row => row.details.slug)))),20)
add(destinations,'dest-to-plan','Do sonho ao plano','Salve no perfil um destino apresentado pelo questionário.',1,'/conta?tab=metas',s => Number(s.profile.destinations.some(slug => events(s,'destination-complete').some(row => row.details.top?.includes(slug)))) ,20)

const vocational = 'Teste vocacional'
add(vocational,'voc-first','Primeiro mapa de interesses','Conclua o teste vocacional.',1,'/teste-vocacional',s => Number(has(s,'voc-complete')))
add(vocational,'voc-six','Conhecendo meus interesses','Visualize o gráfico com as seis áreas.',1,'/teste-vocacional',s => Number(has(s,'voc-chart')))
add(vocational,'voc-two','Duas possibilidades','Explore os dois perfis destacados.',2,'/teste-vocacional',s => Math.max(0,...events(s,'voc-complete').map(run => countUnique(events(s,'voc-profile').filter(row => row.details.run === run.target).map(row => row.details.profile)))))
add(vocational,'voc-course','Da ideia ao curso','Abra uma sugestão de curso quando essa navegação estiver disponível.',1,'/teste-vocacional',() => 0,10,false)
add(vocational,'voc-both-paths','Explorador de caminhos','Consulte sugestões dos dois perfis destacados.',2,'/teste-vocacional',s => Math.max(0,...events(s,'voc-complete').map(run => countUnique(events(s,'voc-profile').filter(row => row.details.run === run.target).map(row => row.details.profile)))))
add(vocational,'voc-evolving','Interesses em evolução','Refaça o teste em outro dia.',2,'/teste-vocacional',s => distinctDays(events(s,'voc-complete')),15)

const gpa = 'Calculadora de GPA'
add(gpa,'gpa-first','Primeira conversão','Calcule uma estimativa pela média geral.',1,'/calculadora-gpa',s => Number(events(s,'gpa-calculate').some(row => row.details.mode === 'average')))
add(gpa,'gpa-courses','Nota por nota','Calcule o GPA por disciplinas.',1,'/calculadora-gpa',s => Number(events(s,'gpa-calculate').some(row => row.details.mode === 'courses')))
add(gpa,'gpa-weighted','Peso na média','Calcule com créditos em todas as disciplinas.',1,'/calculadora-gpa',s => Number(events(s,'gpa-calculate').some(row => row.details.mode === 'courses' && row.details.weighted)))
add(gpa,'gpa-three','Três perspectivas','Visualize os três métodos de conversão.',1,'/calculadora-gpa',s => Number(has(s,'gpa-compare')))
add(gpa,'gpa-saved','Resultado guardado','Salve as três estimativas no perfil.',1,'/calculadora-gpa',s => Number(s.gpa),15)
add(gpa,'gpa-updated','Histórico atualizado','Atualize as estimativas em outro dia.',1,'/calculadora-gpa',s => Number(has(s,'gpa-saved-update')),15)

const sat = 'SAT'
add(sat,'sat-first','Primeiro desafio SAT','Conclua um desafio diário SAT.',1,'/exames/sat/desafio-diario',s => Number(claims(s,'sat').length > 0))
add(sat,'sat-reading','Palavras e argumentos','Conclua Reading and Writing.',1,'/exames/sat/desafio-diario',s => Number(claims(s,'sat').some(row => row.variant === 'reading-writing')))
add(sat,'sat-math','Números em ação','Conclua Mathematics.',1,'/exames/sat/desafio-diario',s => Number(claims(s,'sat').some(row => row.variant === 'math')))
add(sat,'sat-both','Rotina completa','Conclua as duas áreas no mesmo dia.',1,'/exames/sat/desafio-diario',s => Number(claims(s,'sat').some(row => row.variant === 'math' && claims(s,'sat').some(other => other.day === row.day && other.variant === 'reading-writing'))),15)
add(sat,'sat-exam','Primeiro simulado SAT','Finalize um exame e veja o relatório.',1,'/exames/sat/simulado',s => Number(has(s,'sat-report')),20)
add(sat,'sat-sections','Conhecendo meus pontos fortes','Consulte as duas áreas no relatório.',1,'/exames/sat/simulado',s => Number(has(s,'sat-report')))
add(sat,'sat-five-days','Prática consistente','Conclua desafios SAT em cinco dias.',5,'/exames/sat/desafio-diario',s => claimDays(s,'sat'),20)
add(sat,'sat-improved','Minha evolução SAT','Melhore a faixa de pontuação de uma área em outro exame.',2,'/exames/sat/simulado',s => {
  const reports = events(s,'sat-report').sort((a,b) => new Date(a.created_at) - new Date(b.created_at))
  return reports.some((later,index) => reports.slice(0,index).some(earlier => earlier.target !== later.target &&
    (later.details.reading.lower > earlier.details.reading.upper || later.details.math.lower > earlier.details.math.upper))) ? 2 : Math.min(1,countUnique(reports.map(row => row.target)))
},20)

const mext = 'MEXT'
add(mext,'mext-first','Primeiro desafio MEXT','Conclua um desafio diário MEXT.',1,'/exames/mext/desafio-diario',s => Number(claims(s,'mext').length > 0))
add(mext,'mext-english','Ponte para o inglês','Conclua inglês no desafio diário.',1,'/exames/mext/desafio-diario',s => Number(claims(s,'mext').some(row => row.variant.endsWith(':english'))))
add(mext,'mext-japanese','Passo no japonês','Conclua japonês no desafio diário.',1,'/exames/mext/desafio-diario',s => Number(claims(s,'mext').some(row => row.variant.endsWith(':japanese'))))
add(mext,'mext-math','Raciocínio em prática','Conclua matemática no desafio diário.',1,'/exames/mext/desafio-diario',s => Number(claims(s,'mext').some(row => row.variant.endsWith(':math'))))
add(mext,'mext-three-subjects','Explorador de matérias','Conclua inglês, japonês e matemática.',3,'/exames/mext/desafio-diario',s => ['english','japanese','math'].filter(subject => claims(s,'mext').some(row => row.variant.endsWith(`:${subject}`))).length,15)
add(mext,'mext-exam','Primeiro exame MEXT','Finalize um exame da modalidade A ou B.',1,'/exames/mext',s => Number(has(s,'mext-report')),20)
add(mext,'mext-two-routes','Duas rotas','Finalize as modalidades A e B.',2,'/exames/mext',s => countUnique(events(s,'mext-report').map(row => row.target)),20)
add(mext,'mext-five-days','Prática consistente MEXT','Conclua desafios MEXT em cinco dias.',5,'/exames/mext/desafio-diario',s => claimDays(s,'mext'),20)

const journey = 'Minha jornada'
add(journey,'journey-start','Plano iniciado','Abra a jornada e conclua uma etapa.',1,'/conta?tab=jornada',s => Number(has(s,'journey-view') && s.tasks.some(row => row.status === 'done')))
add(journey,'journey-first-deadline','Prazo no radar','Cadastre o primeiro prazo.',1,'/conta?tab=jornada',s => Number(s.deadlines.length > 0))
add(journey,'journey-two-deadlines','Agenda organizada','Cadastre prazos para duas oportunidades.',2,'/conta?tab=jornada',s => countUnique(s.deadlines.map(row => row.title.trim().toLocaleLowerCase('pt-BR'))),15)
add(journey,'journey-document','Documentos reunidos','Adicione o primeiro documento.',1,'/conta?tab=documentos',s => Number(s.documents.length > 0))
add(journey,'journey-three-tasks','Preparação em andamento','Conclua três ações da trilha.',3,'/conta?tab=jornada',s => s.tasks.filter(row => row.status === 'done').length,15)
add(journey,'journey-calendar','De olho no calendário','Consulte a jornada em três dias com prazo futuro.',3,'/conta?tab=jornada',s => distinctDays(events(s,'journey-view').filter(row => row.details.hasFutureDeadline)),15)
add(journey,'journey-next-step','Próximo passo definido','Salve uma meta e ao menos um prazo.',2,'/conta?tab=jornada',s => Number(s.profile.goal) + Number(s.deadlines.length > 0),15)
add(journey,'journey-moving','Jornada em movimento','Conclua ações da trilha em três dias.',3,'/conta?tab=jornada',s => countUnique(s.tasks.filter(row => row.status === 'done').map(row => row.day)),20)

const streaks = 'Sequências'
for (const [days,title,xp] of [[2,'Começou a caminhar',10],[3,'Pegando o ritmo',10],[7,'Uma semana de descobertas',20],[14,'Passo firme',25],[30,'Um mês de jornada',35],[60,'Horizonte distante',45],[100,'Sonho em movimento',60]]) {
  add(streaks,`streak-${days}`,title,`${days} dias seguidos com uma atividade na plataforma.`,days,'/conta?tab=progresso',s => s.streak.best,xp)
}

export const ACHIEVEMENT_DEFINITIONS = achievementDefinitions.map(({ progress, ...definition }) => definition)

export function evaluateAchievements(state) {
  return achievementDefinitions.map(definition => {
    const value = definition.available ? Math.min(definition.target,definition.progress(state)) : 0
    return { ...definition, progress:value, completed:value >= definition.target && definition.available }
  })
}

function validateEvent(kind, target, details) {
  if (!trackable.has(kind) || typeof target !== 'string' || target.length < 1 || target.length > 240 || /[\x00-\x1f\x7f]/.test(target)) fail(400,'Evento de conquista inválido.')
  if (!details || typeof details !== 'object' || Array.isArray(details) || JSON.stringify(details).length > 800) fail(400,'Detalhes do evento inválidos.')
  if (kind.startsWith('guide-') && !countries.has(target.split(':')[0])) fail(400,'Guia inválido.')
  if (kind === 'guide-section' && !/^[a-z0-9-]+:(costs|culture|student|calendar|visa|work)$/.test(target)) fail(400,'Tema de guia inválido.')
  if (['guide-view','guide-bolsas','guide-source'].includes(kind) && !countries.has(target)) fail(400,'Guia inválido.')
  if (kind === 'rank-view' && target !== 'general' && !areas.has(target)) fail(400,'Ranking inválido.')
  if (kind === 'rank-page' && (!/^(general|arts-humanities|engineering-technology|life-sciences-medicine|natural-sciences|social-sciences-management):\d{1,3}$/.test(target) || !target.startsWith(`${details.scope}:`))) fail(400,'Página de ranking inválida.')
  if (kind === 'rank-filter' && !['general',...areas].includes(details.scope)) fail(400,'Filtro de ranking inválido.')
  if (kind === 'rank-filter' && (typeof details.country !== 'string' || details.country.length > 100 || !Number.isInteger(details.filterCount) || details.filterCount < 1 || details.filterCount > 3)) fail(400,'Filtro de ranking inválido.')
  if (kind === 'sch-search' && (details.country && !countryHostName(details.country) || !['','undergraduate','postgraduate','doctoral','other','unknown'].includes(details.level) || !['','engineering','arts','health','natural','social','unknown'].includes(details.area) || !['','upcoming','past','undated'].includes(details.deadline) || !['','mentioned','broad','not-listed','unknown'].includes(details.criteria) || typeof details.query !== 'boolean')) fail(400,'Filtros de bolsas inválidos.')
  if (kind === 'sch-source' && (typeof details.scholarship !== 'string' || !target.startsWith(`${details.scholarship}|`) || typeof details.hasDate !== 'boolean')) fail(400,'Fonte de bolsa inválida.')
  if (kind === 'destination-complete' && (!/^[0-9a-f-]{36}$/.test(target) || !/^[0-9a-f]{1,8}$/.test(details.signature) || !Array.isArray(details.top) || details.top.length > 5 || details.top.some(slug => !countries.has(slug)))) fail(400,'Resultado de destino inválido.')
  if (kind === 'destination-guide' && (!countries.has(details.slug) || !Number.isInteger(details.rank) || details.rank < 1 || details.rank > 25)) fail(400,'Resultado de destino inválido.')
  if (kind === 'voc-complete' && (!/^[0-9a-f-]{36}$/.test(target) || !Array.isArray(details.leaders) || details.leaders.length !== 2 || details.leaders.some(area => !interestAreas.has(area)))) fail(400,'Resultado vocacional inválido.')
  if (kind === 'voc-profile' && (!interestAreas.has(details.profile) || target !== `${details.run}:${details.profile}`)) fail(400,'Perfil vocacional inválido.')
  if (kind === 'gpa-calculate' && !['average','courses'].includes(details.mode)) fail(400,'Modo de GPA inválido.')
  if (kind === 'gpa-calculate' && typeof details.weighted !== 'boolean') fail(400,'Cálculo GPA inválido.')
  if (kind === 'journey-view' && (!['opened','future'].includes(target) || typeof details.hasFutureDeadline !== 'boolean' || (target === 'future') !== details.hasFutureDeadline)) fail(400,'Consulta da jornada inválida.')
  if (kind === 'sat-report' && (!/^practice-(?:[4-9]|10|11)-paper$/.test(target) || !['reading','math'].every(area =>
    Number.isInteger(details?.[area]?.lower) && Number.isInteger(details?.[area]?.upper) && details[area].lower >= 200 && details[area].upper <= 800 && details[area].lower <= details[area].upper))) fail(400,'Relatório SAT inválido.')
  if (kind === 'mext-report' && !['A','B'].includes(target)) fail(400,'Exame MEXT inválido.')
}

export async function recordAchievementEvent(userId, input, client = database()) {
  validateEvent(input?.kind,input?.target,input?.details || {})
  if (input.kind === 'destination-guide') {
    if (input.target !== `${input.details.run}:${input.details.slug}`) fail(400,'Resultado de destino inválido.')
    const run = await client.query("SELECT 1 FROM user_achievement_events WHERE user_id=$1 AND kind='destination-complete' AND target=$2",[userId,input.details.run])
    if (!run.rowCount) fail(400,'Conclua o descobridor antes de explorar o resultado.')
  }
  if (input.kind === 'voc-chart' || input.kind === 'voc-profile') {
    const runId = input.kind === 'voc-chart' ? input.target : input.details.run
    const run = await client.query("SELECT details FROM user_achievement_events WHERE user_id=$1 AND kind='voc-complete' AND target=$2",[userId,runId])
    if (!run.rowCount || (input.kind === 'voc-profile' && !run.rows[0].details.leaders.includes(input.details.profile))) fail(400,'Conclua o teste antes de explorar o resultado.')
  }
  const details = Object.fromEntries((detailFields[input.kind] || []).map(key => [key,input.details?.[key]]).filter(([,value]) => value !== undefined))
  await client.query(`INSERT INTO user_achievement_events (user_id,kind,target,details,day)
    VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING`, [userId,input.kind,input.target,details,today()])
}

export async function reconcileAchievements(userId, client = database()) {
  const day = today()
  const eventRows = await client.query("SELECT kind,target,details,created_at,to_char(day,'YYYY-MM-DD') AS day FROM user_achievement_events WHERE user_id=$1",[userId])
  const claimRows = await client.query("SELECT source,variant,to_char(day,'YYYY-MM-DD') AS day FROM user_mission_challenge_claims WHERE user_id=$1",[userId])
  const profileRows = await client.query(`SELECT (p.study_level IS NOT NULL AND p.interest_area IS NOT NULL AND EXISTS
      (SELECT 1 FROM user_profile_destinations d WHERE d.user_id=p.user_id)) AS goal,
      ARRAY(SELECT country_slug FROM user_profile_destinations WHERE user_id=p.user_id) AS destinations
      FROM user_profiles p WHERE p.user_id=$1`,[userId])
  const deadlineRows = await client.query("SELECT title,to_char(due_date,'YYYY-MM-DD') AS due_date,saved_source FROM user_journey_deadlines WHERE user_id=$1",[userId])
  const documentRows = await client.query('SELECT id FROM user_documents WHERE user_id=$1',[userId])
  const savedRows = await client.query('SELECT source,source_id FROM user_saved_scholarships WHERE user_id=$1',[userId])
  const taskRows = await client.query("SELECT status,to_char(updated_at AT TIME ZONE 'America/Sao_Paulo','YYYY-MM-DD') AS day FROM user_journey_tasks WHERE user_id=$1",[userId])
  const gpaRows = await client.query('SELECT 1 FROM user_gpa_estimates WHERE user_id=$1',[userId])
  const activityDays = [...eventRows.rows.map(row => row.day),...claimRows.rows.map(row => row.day)]
  const state = { day, events:eventRows.rows, claims:claimRows.rows, profile:profileRows.rows[0] || { goal:false,destinations:[] },
    deadlines:deadlineRows.rows, documents:documentRows.rows, saved:savedRows.rows, tasks:taskRows.rows,
    gpa:gpaRows.rowCount > 0, streak:streakFromDays(activityDays,day) }
  const progress = evaluateAchievements(state)
  const completed = progress.filter(item => item.completed)
  if (completed.length) await client.query(`INSERT INTO user_mission_awards (user_id,mission_key,period_key,xp)
    SELECT $1,'achievement-' || entry.key,'once',entry.xp
    FROM unnest($2::text[],$3::integer[]) AS entry(key,xp)
    ON CONFLICT DO NOTHING`,[userId,completed.map(item => item.key),completed.map(item => item.xp)])
  return { achievements:progress, streak:state.streak }
}
