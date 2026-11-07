export type HongKongSource = { label: string; url: string; verifiedAt: string }
export type HongKongBlock = { title: string; text: string; note?: string; source?: HongKongSource; link?: { label: string; url: string } }
export type HongKongSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly HongKongBlock[] }

const verifiedAt = '2026-10-29'

export const HONG_KONG_SOURCES = {
  population: { label: 'Governo de Hong Kong · População de meados de 2026', url: 'https://www.news.gov.hk/eng/2026/08/20260818/20260818_163304_412.html', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  languages: { label: 'Governo de Hong Kong · Idiomas oficiais', url: 'https://www.hkengage.gov.hk/en/why-hk/work/multilingual-society', verifiedAt },
  climate: { label: 'Hong Kong Observatory · Clima local', url: 'https://www.hko.gov.hk/en/cis/climahk.htm', verifiedAt },
  costs: { label: 'Study in Hong Kong · Mensalidades e despesas', url: 'https://www.studyinhongkong.edu.hk/en/hong-kong-education/tuition-fee-and-living-expenses.php', verifiedAt },
  scholarships: { label: 'Study in Hong Kong · Bolsas', url: 'https://www.studyinhongkong.edu.hk/en/hong-kong-education/scholarships.php', verifiedAt },
  programmes: { label: 'Study in Hong Kong · Lista de programas', url: 'https://www.studyinhongkong.edu.hk/en/hong-kong-education/programme-list.php', verifiedAt },
  calendar: { label: 'Study in Hong Kong · Calendário das instituições', url: 'https://www.studyinhongkong.edu.hk/en/hong-kong-education/calendar-for-hong-kong-institutions.php', verifiedAt },
  studyVisa: { label: 'Immigration Department · Entrada para estudos', url: 'https://www.immd.gov.hk/eng/services/visas/study.html', verifiedAt },
  work: { label: 'Immigration Department · Trabalho de estudantes não locais', url: 'https://www.immd.gov.hk/eng/services/visas/immigration-entry-guideline.html', verifiedAt },
  wage: { label: 'Labour Department · Salário mínimo em 2026', url: 'https://www.labour.gov.hk/eng/news/mwo.htm', verifiedAt },
  iang: { label: 'Immigration Department · Programa IANG', url: 'https://www.immd.gov.hk/eng/services/visas/IANG.html', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, HongKongSource>

export const HONG_KONG_SECTIONS: readonly HongKongSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Confira o idioma de ensino e do cotidiano', intro: 'Chinês e inglês são oficiais; o cantonês é muito usado na vida diária.', blocks: [
    { title: 'Idiomas na cidade', text: 'Chinês e inglês são idiomas oficiais. O cantonês predomina nas conversas cotidianas; o mandarim também é usado. Saber inglês ajuda, mas aprender cantonês pode facilitar a integração.', source: HONG_KONG_SOURCES.languages },
    { title: 'Idioma do programa', text: 'A língua de ensino e as provas aceitas variam por curso. Confirme diretamente na página da universidade antes de escolher um exame de proficiência.', source: HONG_KONG_SOURCES.programmes, link: { label: 'Pesquisar programas', url: HONG_KONG_SOURCES.programmes.url } },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Planeje-se para verão úmido e chuvas fortes', intro: 'O observatório publica previsões e alertas para a cidade.', blocks: [
    { title: 'Estações e tufões', text: 'O clima é subtropical. De maio a agosto, o tempo costuma ser quente e úmido. Ciclones tropicais podem afetar Hong Kong de maio a novembro, com maior frequência entre julho e setembro.', source: HONG_KONG_SOURCES.climate, link: { label: 'Consultar o observatório', url: HONG_KONG_SOURCES.climate.url } },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Compare o custo do curso e da moradia', intro: 'Mensalidades para estudantes não locais variam por programa e instituição.', blocks: [
    { title: 'Mensalidades e despesas', text: 'Consulte o valor publicado pela universidade para seu curso e ano de ingresso. Some acomodação, alimentação, transporte, seguro e materiais; as estimativas gerais do portal não substituem o orçamento da sua instituição.', source: HONG_KONG_SOURCES.costs, link: { label: 'Ver a orientação de custos', url: HONG_KONG_SOURCES.costs.url } },
    { title: 'Financiamento', text: 'Antes de se candidatar, compare o valor total necessário com a cobertura e a duração de cada bolsa. Uma bolsa que cobre mensalidade pode não cobrir moradia.' },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Pesquise bolsas por instituição e programa', intro: 'A nacionalidade brasileira, por si só, não confirma elegibilidade.', blocks: [
    { title: 'Bolsas do governo e das universidades', text: 'O portal Study in Hong Kong reúne bolsas governamentais, institucionais e para doutorado. Confira nível de estudo, cobertura, seleção e prazo diretamente com a instituição responsável.', source: HONG_KONG_SOURCES.scholarships, link: { label: 'Explorar bolsas oficiais', url: HONG_KONG_SOURCES.scholarships.url } },
    { title: 'Belt and Road Scholarship', text: 'A bolsa existe para estudantes de países e regiões contemplados pela iniciativa Belt and Road, em programas financiados publicamente. A lista consultada não confirma a participação do Brasil; verifique a nacionalidade aceita no edital do ciclo e pergunte à universidade antes de contar com esse financiamento.', source: HONG_KONG_SOURCES.scholarships },
    { title: 'Hong Kong PhD Fellowship Scheme', text: 'O portal oficial também apresenta um programa de bolsas para doutorado. Consulte o edital e as universidades participantes para o ano da sua candidatura.', source: HONG_KONG_SOURCES.scholarships },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare cursos nas universidades', intro: 'Estas instituições são pontos de partida, sem ordem de ranking.', blocks: [
    { title: 'HKU e CUHK', text: 'A University of Hong Kong e a Chinese University of Hong Kong constam da lista oficial de instituições. Compare programas, idioma, mensalidade e bolsas nas páginas de admissão.', source: HONG_KONG_SOURCES.programmes },
    { title: 'HKUST, PolyU, CityU e HKBU', text: 'A lista oficial também apresenta a Hong Kong University of Science and Technology, a Hong Kong Polytechnic University, a City University of Hong Kong e a Hong Kong Baptist University. Verifique o campus e o programa desejado.', source: HONG_KONG_SOURCES.programmes, link: { label: 'Ver instituições e cursos', url: HONG_KONG_SOURCES.programmes.url } },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Prepare a rotina na cidade', intro: 'O apoio da instituição ajuda a organizar a chegada.', blocks: [
    { title: 'Moradia e integração', text: 'Pergunte ao escritório internacional sobre residência estudantil, saúde, transporte e acolhimento. Reserve tempo para conhecer idiomas, bairros e costumes locais.' },
    { title: 'Apoio consular brasileiro', text: 'Confirme com o Itamaraty a representação responsável pelo serviço consular de que você precisa.', source: HONG_KONG_SOURCES.consular, link: { label: 'Acessar o e-Consular', url: HONG_KONG_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Anote o prazo do curso e o da bolsa', intro: 'O calendário varia entre instituições e níveis de estudo.', blocks: [
    { title: 'Ano acadêmico', text: 'Consulte as datas de candidatura, matrícula e início das aulas na instituição escolhida. O portal de estudos oferece uma visão geral; use o calendário do programa para planejar documentos e viagem.', source: HONG_KONG_SOURCES.calendar, link: { label: 'Consultar o calendário', url: HONG_KONG_SOURCES.calendar.url } },
    { title: 'Bolsas em separado', text: 'Registre também o prazo da bolsa, que pode ser diferente do prazo de ingresso. Confira se a candidatura exige admissão prévia ao curso.', source: HONG_KONG_SOURCES.scholarships },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Organize a candidatura passo a passo', intro: 'Use as exigências publicadas pelo curso e pela bolsa.', blocks: [
    { title: '1. Escolha o programa', text: 'Compare nível, idioma, conteúdo, taxas, apoio a estudantes internacionais e prazo em mais de uma universidade.', source: HONG_KONG_SOURCES.programmes },
    { title: '2. Prepare documentos e idioma', text: 'Confirme histórico, certificados, traduções, referências e exames solicitados pela instituição. O processo da bolsa pode pedir materiais adicionais.' },
    { title: '3. Planeje o financiamento', text: 'Candidate-se às bolsas aplicáveis e confira quando o resultado será divulgado. Guarde comprovantes de cada etapa.', source: HONG_KONG_SOURCES.scholarships },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada e permanência', title: 'Solicite a autorização de estudo adequada', intro: 'As regras de turismo não substituem a autorização para estudar.', blocks: [
    { title: 'Entrada para estudos', text: 'O Departamento de Imigração informa os critérios e documentos para o visto ou permissão de entrada por estudos. Confirme com a universidade como funciona o patrocínio da solicitação e o prazo do seu processo.', source: HONG_KONG_SOURCES.studyVisa, link: { label: 'Ver exigências de estudo', url: HONG_KONG_SOURCES.studyVisa.url } },
    { title: 'Depois da formatura: IANG', text: 'Graduados não locais de programas elegíveis podem solicitar permanência pelo IANG. Quem pede em até seis meses após a formatura é tratado como recém-formado e pode receber até 24 meses de permanência sem oferta de emprego prévia, sujeito aos requisitos da imigração.', source: HONG_KONG_SOURCES.iang, link: { label: 'Consultar o IANG', url: HONG_KONG_SOURCES.iang.url } },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Leia as condições da sua carta de autorização', intro: 'A permissão depende do tipo e da duração do programa.', blocks: [
    { title: 'Isenção temporária para alguns estudantes', text: 'A orientação atual da imigração prevê isenção temporária das restrições usuais para estudantes não locais, exceto intercambistas, em programas locais credenciados de graduação ou pós-graduação em tempo integral com duração mínima de um ano letivo. A carta “No Objection Letter” informa as condições individuais; confirme sua validade antes de aceitar trabalho.', source: HONG_KONG_SOURCES.work, link: { label: 'Ler as regras de trabalho', url: HONG_KONG_SOURCES.work.url } },
    { title: 'Demais situações', text: 'Para quem não se enquadra na isenção, as regras gerais incluem condições específicas para estágio relacionado ao curso, trabalho no campus e férias de verão. Confira as restrições da sua autorização antes de trabalhar.', source: HONG_KONG_SOURCES.work },
    { title: 'Salário mínimo em 2026', text: 'O salário mínimo legal passou a HK$ 43,10 por hora em 1º de maio de 2026. Isso não garante vaga nem renda suficiente para pagar o curso; algumas modalidades de estágio têm regras próprias.', source: HONG_KONG_SOURCES.wage },
  ] },
]
