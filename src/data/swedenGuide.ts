export type SwedenSource = { label: string; url: string; verifiedAt: string }
export type SwedenBlock = { title: string; text: string; note?: string; source?: SwedenSource; link?: { label: string; url: string } }
export type SwedenSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly SwedenBlock[] }

const verifiedAt = '2026-10-28'

export const SWEDEN_SOURCES = {
  population: { label: 'Statistics Sweden · População de agosto de 2026', url: 'https://www.scb.se/BE0101-en', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  programmes: { label: 'University Admissions · Busca e candidatura', url: 'https://www.universityadmissions.se/en/support-centre/admissions-application/', verifiedAt },
  english: { label: 'University Admissions · Requisitos de inglês', url: 'https://www.universityadmissions.se/en/entry-requirements/english-language-requirements/', verifiedAt },
  climate: { label: 'SMHI · Neve por região', url: 'https://www.smhi.se/kunskapsbanken/meteorologi/sno/snotackets-utbredning-och-varaktighet', verifiedAt },
  climateTemperature: { label: 'SMHI · Temperatura durante o ano', url: 'https://www.smhi.se/kunskapsbanken/meteorologi/temperatur/temperatur-under-aret-och-dygnet', verifiedAt },
  stockholmFees: { label: 'Universidade de Estocolmo · Custos, taxas e bolsas', url: 'https://www.su.se/english/education/how-to-apply/costs-fees-and-scholarships', verifiedAt },
  applicationFee: { label: 'University Admissions · Taxa de candidatura', url: 'https://www.universityadmissions.se/en/fees-scholarships-residence-permit/pay-your-application-fee/', verifiedAt },
  universityDates: { label: 'University Admissions · Prazos do outono de 2027', url: 'https://universityadmissions.se/en/key-dates-and-deadlines/autumn-semester-dates/', verifiedAt },
  studyPermit: { label: 'Migrationsverket · Autorização para estudos superiores', url: 'https://www.migrationsverket.se/en/you-want-to-apply/study/higher-education', verifiedAt },
  newRules: { label: 'Migrationsverket · Regras vigentes desde 11/06/2026', url: 'https://www.migrationsverket.se/en/newsarchive/newrulesforresidencepermitsforstudiesinhighereducation.5.7e7ff7f619e5ace55a714.html', verifiedAt },
  extension: { label: 'Migrationsverket · Prorrogação da autorização de estudos', url: 'https://www.migrationsverket.se/en/you-want-to-extend/study/higher-education.html', verifiedAt },
  afterStudies: { label: 'Migrationsverket · Busca de trabalho após os estudos', url: 'https://www.migrationsverket.se/en/you-want-to-extend/study/look-for-work-after-completing-your-studies-in-sweden.html', verifiedAt },
  karolinska: { label: 'Karolinska Institutet · Site oficial', url: 'https://ki.se/en', verifiedAt },
  kth: { label: 'KTH Royal Institute of Technology · Site oficial', url: 'https://www.kth.se/en', verifiedAt },
  lund: { label: 'Lund University · Site oficial', url: 'https://www.lunduniversity.lu.se/', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, SwedenSource>

export const SWEDEN_SECTIONS: readonly SwedenSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Confira o idioma de cada programa', intro: 'O sueco é o idioma do país; cursos em inglês têm requisitos próprios.', blocks: [
    { title: 'Sueco no cotidiano', text: 'Aprender sueco pode ajudar na vida diária e na busca de trabalho. O idioma de ensino varia entre cursos e universidades; confira a página do programa antes de se candidatar.' },
    { title: 'Cursos em inglês', text: 'A busca central de cursos indica as opções disponíveis. Para programas ministrados em inglês, a University Admissions publica os meios aceitos para comprovar proficiência; a nota exigida depende do curso.', source: SWEDEN_SOURCES.english, link: { label: 'Ver os requisitos de inglês', url: SWEDEN_SOURCES.english.url } },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Compare norte e sul antes de escolher a cidade', intro: 'Temperatura, luz do dia e duração da neve mudam bastante pelo país.', blocks: [
    { title: 'Neve e inverno', text: 'O SMHI informa que a cobertura de neve pode durar muitos meses nas montanhas do norte, enquanto o extremo sul pode ter poucos dias de neve em alguns invernos. Consulte a cidade do campus em vez de usar uma previsão nacional.', source: SWEDEN_SOURCES.climate },
    { title: 'Temperaturas locais', text: 'As diferenças de temperatura entre norte e sul são maiores no inverno. Use as médias da região para planejar vestuário, deslocamento e custos de aquecimento.', source: SWEDEN_SOURCES.climateTemperature },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Planeje moradia e manutenção em coroas suecas', intro: 'A cidade e o tipo de acomodação fazem diferença no orçamento.', blocks: [
    { title: 'Estimativa da instituição', text: 'Consulte os custos publicados pela universidade e some acomodação, alimentação, transporte, seguro e materiais. A Universidade de Estocolmo oferece uma referência própria; não a trate como preço de todas as cidades.', source: SWEDEN_SOURCES.stockholmFees, link: { label: 'Ver custos em Estocolmo', url: SWEDEN_SOURCES.stockholmFees.url } },
    { title: 'Recursos para a residência, pedidos em 2026', text: 'Para solicitar autorização de residência para estudos superiores em 2026, a Migrationsverket indica manutenção mínima de SEK 10.656 por mês. Bolsa, recursos próprios e outras fontes aceitas podem compor a comprovação; confirme período e regras do seu pedido.', source: SWEDEN_SOURCES.studyPermit },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Compare taxas e bolsas do curso', intro: 'Brasileiros em geral pagam mensalidade, salvo isenção ou financiamento aplicável.', blocks: [
    { title: 'Exemplo de mensalidade', text: 'A Universidade de Estocolmo informa SEK 90.000 por ano acadêmico para Humanas, Ciências Sociais e Direito e SEK 140.000 para Ciências; alguns programas têm valores diferentes. São exemplos dessa universidade, não uma tabela nacional.', source: SWEDEN_SOURCES.stockholmFees },
    { title: 'Taxa de candidatura', text: 'A University Admissions cobra SEK 900 por candidatura no semestre de quem precisa pagar a taxa. Confirme eventual isenção antes do pagamento.', source: SWEDEN_SOURCES.applicationFee },
    { title: 'Swedish Institute e universidades', text: 'O Swedish Institute e universidades oferecem bolsas para determinados mestrados. Confira países, programas elegíveis, cobertura e prazo no ciclo atual; nacionalidade brasileira, por si só, não garante bolsa.', source: SWEDEN_SOURCES.stockholmFees, link: { label: 'Explorar bolsas em Estocolmo', url: SWEDEN_SOURCES.stockholmFees.url } },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Encontre um programa compatível', intro: 'Estas instituições são pontos de partida, sem ordem de ranking.', blocks: [
    { title: 'Karolinska Institutet', text: 'Consulte programas, idioma, requisitos e financiamento na página oficial.', source: SWEDEN_SOURCES.karolinska, link: { label: 'Explorar Karolinska', url: SWEDEN_SOURCES.karolinska.url } },
    { title: 'KTH Royal Institute of Technology', text: 'Compare cursos e calendários de candidatura por nível de estudo.', source: SWEDEN_SOURCES.kth, link: { label: 'Explorar KTH', url: SWEDEN_SOURCES.kth.url } },
    { title: 'Lund University', text: 'Verifique taxas, bolsas e pré-requisitos do programa desejado.', source: SWEDEN_SOURCES.lund, link: { label: 'Explorar Lund', url: SWEDEN_SOURCES.lund.url } },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Prepare sua chegada', intro: 'Universidade, cidade e estação do ano influenciam a rotina.', blocks: [
    { title: 'Apoio local', text: 'Pergunte ao escritório internacional sobre moradia, matrícula, saúde e integração. Conheça também as regras locais de acesso à natureza antes de fazer atividades ao ar livre.' },
    { title: 'Apoio consular brasileiro', text: 'Para serviços consulares, procure a representação brasileira responsável pela sua região na Suécia.', source: SWEDEN_SOURCES.consular, link: { label: 'Acessar o e-Consular', url: SWEDEN_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Anote o calendário do ingresso de 2027', intro: 'A primeira rodada internacional dá tempo para organizar visto e moradia.', blocks: [
    { title: 'Primeira rodada, outono de 2027', text: 'A University Admissions informa abertura em 16/10/2026, prazo de candidatura em 15/01/2027 e prazo para taxa e documentos em 01/02/2027. Confira o programa e a rodada aplicável antes de enviar.', source: SWEDEN_SOURCES.universityDates, link: { label: 'Ver todas as datas oficiais', url: SWEDEN_SOURCES.universityDates.url } },
    { title: 'Prazo da bolsa', text: 'Financiamento pode ter etapas próprias. Anote separadamente candidatura ao curso, entrega de documentos, resultado e solicitação da bolsa.' },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Organize a candidatura pelo portal oficial', intro: 'Os requisitos gerais não substituem o edital do programa.', blocks: [
    { title: '1. Escolha e ordene os cursos', text: 'Pesquise idioma, área, nível, custos e pré-requisitos. Confirme se a opção está na rodada internacional e ordene as preferências conforme as instruções do portal.', source: SWEDEN_SOURCES.programmes },
    { title: '2. Comprove a formação e o idioma', text: 'Leia a lista de documentos para o seu país de estudos, o curso e o nível. Prepare traduções e testes apenas quando exigidos.', source: SWEDEN_SOURCES.english },
    { title: '3. Confirme a taxa e o prazo', text: 'A candidatura só é processada após pagamento da taxa ou comprovação de isenção dentro do prazo aplicável. Guarde o comprovante e acompanhe o status no portal.', source: SWEDEN_SOURCES.applicationFee },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada e permanência', title: 'Solicite a autorização de residência adequada', intro: 'A admissão e o planejamento financeiro são etapas distintas.', blocks: [
    { title: 'Para estudar', text: 'Verifique quando solicitar a autorização de residência para estudos superiores, como comprovar manutenção e quais taxas ou seguros se aplicam. A Migrationsverket publica as exigências vigentes e pode atualizar os valores a cada ano.', source: SWEDEN_SOURCES.studyPermit, link: { label: 'Consultar a Migrationsverket', url: SWEDEN_SOURCES.studyPermit.url } },
    { title: 'Após a conclusão', text: 'Quem concluiu um programa superior de pelo menos dois semestres pode solicitar, antes do vencimento da autorização de estudo, uma autorização para procurar trabalho ou avaliar a abertura de negócio. Para graduação e mestrado, a duração pode chegar a um ano; para doutorado, de um ano a 18 meses. Há requisitos de conclusão, recursos e seguro.', source: SWEDEN_SOURCES.afterStudies, link: { label: 'Ver a rota após os estudos', url: SWEDEN_SOURCES.afterStudies.url } },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Observe o limite vigente para o seu título', intro: 'As regras mudaram em 11/06/2026 para graduação e mestrado.', blocks: [
    { title: 'Durante o semestre', text: 'Para autorizações de estudos de graduação ou mestrado concedidas a partir de 11/06/2026, o limite geral é 15 horas semanais no período letivo. Em junho, julho e agosto, não há esse limite. Trabalho ligado ao curso ou à universidade pode seguir exceções específicas.', source: SWEDEN_SOURCES.newRules },
    { title: 'Autorizações anteriores e progresso', text: 'Quem recebeu a autorização antes de 11/06/2026 mantém as regras anteriores até a prorrogação. Para renovar após a mudança, estudantes em tempo integral precisam demonstrar progresso acadêmico: 37,5 créditos no primeiro ano e 45 por ano a partir do segundo, conforme o caso.', source: SWEDEN_SOURCES.newRules, link: { label: 'Conferir regras de prorrogação', url: SWEDEN_SOURCES.extension.url } },
  ] },
]
