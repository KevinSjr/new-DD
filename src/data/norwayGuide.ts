export type NorwaySource = { label: string; url: string; verifiedAt: string }
export type NorwayBlock = { title: string; text: string; note?: string; source?: NorwaySource; link?: { label: string; url: string } }
export type NorwaySection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly NorwayBlock[] }

const verifiedAt = '2026-10-28'

export const NORWAY_SOURCES = {
  population: { label: 'Statistics Norway · População', url: 'https://www.ssb.no/en/befolkning/folketall/statistikk/befolkning', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  courses: { label: 'Study in Norway · Busca de cursos', url: 'https://studyinnorway.no/study-opportunities', verifiedAt },
  admission: { label: 'Study in Norway · Requisitos de admissão', url: 'https://studyinnorway.no/entry-requirements-bachelor-and-master-programmes', verifiedAt },
  climate: { label: 'Instituto Meteorológico Norueguês · Clima regional', url: 'https://www.met.no/publikasjoner/met-report/met-report-2007/_/attachment/download/77d60ab8-b4ed-4120-8e9b-2bb808942dc0%3A48a4b0efbabbfa94f9a2a8ec5c3edc71efb0686c/MET-report-06-2007.pdf', verifiedAt },
  tuition: { label: 'Study in Norway · Mensalidades', url: 'https://studyinnorway.no/tuition-fees-students', verifiedAt },
  oslomet: { label: 'OsloMet · Mensalidades 2026/2027', url: 'https://student.oslomet.no/en/tuition-fees-for-international-students-from-outside-eu-eea', verifiedAt },
  scholarships: { label: 'Study in Norway · Bolsas para cursos completos', url: 'https://studyinnorway.no/scholarships-degree-students', verifiedAt },
  studyPermit: { label: 'UDI · Permissão de estudos', url: 'https://www.udi.no/en/want-to-apply/studies/studietillatelse/?c=bra', verifiedAt },
  jobSeeker: { label: 'UDI · Permissão para procurar trabalho', url: 'https://www.udi.no/en/want-to-apply/work-immigration/job-seekers/?c=bra', verifiedAt },
  afterStudy: { label: 'Study in Norway · Trabalho após a graduação', url: 'https://studyinnorway.no/working-norway-after-completing-degree', verifiedAt },
  universityOslo: { label: 'University of Oslo · Site oficial', url: 'https://www.uio.no/english/', verifiedAt },
  universityNtnu: { label: 'NTNU · Site oficial', url: 'https://www.ntnu.edu/', verifiedAt },
  universityBergen: { label: 'University of Bergen · Site oficial', url: 'https://www.uib.no/en/', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, NorwaySource>

export const NORWAY_SECTIONS: readonly NorwaySection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Encontre um curso no idioma adequado', intro: 'A oferta em inglês depende do nível e da instituição.', blocks: [
    { title: 'Cursos em inglês', text: 'O Study in Norway mantém uma busca de programas ministrados em inglês. Há opções especialmente no mestrado; confira o idioma de cada curso e seus requisitos.', source: NORWAY_SOURCES.courses, link: { label: 'Buscar cursos em inglês', url: NORWAY_SOURCES.courses.url } },
    { title: 'Norueguês e proficiência', text: 'A maior parte das graduações é ministrada em norueguês, embora existam exceções. Para cursos em inglês, a universidade define como comprovar proficiência. Não há uma nota única de IELTS ou TOEFL para todos os programas.', source: NORWAY_SOURCES.admission },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Compare o clima da cidade escolhida', intro: 'Costa, interior e norte têm condições bastante diferentes.', blocks: [
    { title: 'Diferenças regionais', text: 'A costa atlântica tem invernos relativamente amenos e mais precipitação; áreas interiores podem ser muito mais frias. Verifique médias mensais e luz do dia para o local do campus.', source: NORWAY_SOURCES.climate },
    { title: 'Luz no norte', text: 'O sol da meia-noite e a noite polar ocorrem em localidades acima do Círculo Polar Ártico. Não descrevem o ano de cidades como Oslo, Bergen ou Trondheim.' },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Planeje gastos e comprovação financeira', intro: 'A permissão de estudos exige recursos para viver e, quando aplicável, pagar o curso.', blocks: [
    { title: 'Recursos para a permissão de estudos', text: 'Na consulta de 28/10/2026, a UDI informava NOK 170.368 para um ano acadêmico completo. A exigência muda; confirme o valor aplicável ao seu período de estudo antes de solicitar a permissão.', source: NORWAY_SOURCES.studyPermit, link: { label: 'Ver os requisitos atuais da UDI', url: NORWAY_SOURCES.studyPermit.url } },
    { title: 'Orçamento real', text: 'Some mensalidade, moradia, alimentação, transporte, seguro e despesas de chegada em coroas norueguesas. Peça estimativas à universidade e não trate o mínimo migratório como previsão do seu custo total.', source: NORWAY_SOURCES.tuition },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Pesquise financiamento sem presumir gratuidade', intro: 'Estudantes de fora da UE/EEE e da Suíça normalmente pagam mensalidade em cursos completos.', blocks: [
    { title: 'Mensalidades', text: 'As instituições norueguesas normalmente cobram de estudantes em cursos completos de fora da UE/EEE e da Suíça. Há exceções, incluindo certos intercâmbios. Confirme sua categoria e o valor diretamente no programa.', source: NORWAY_SOURCES.tuition },
    { title: 'Exemplo de valor, não média nacional', text: 'Na OsloMet, várias mensalidades anunciadas para 2026/2027 ficam entre NOK 67.000 e NOK 95.000 por ano, conforme o curso. O valor não cobre despesas de vida e não representa todas as universidades.', source: NORWAY_SOURCES.oslomet },
    { title: 'Bolsas disponíveis', text: 'O portal Study in Norway informa que o governo não oferece bolsa individual geral para estudantes de cursos completos. Há esquemas específicos, como alguns mestrados conjuntos Erasmus Mundus; requisitos e prazos dependem do programa.', source: NORWAY_SOURCES.scholarships, link: { label: 'Conhecer as opções de bolsas', url: NORWAY_SOURCES.scholarships.url } },
    { title: 'Doutorado', text: 'Vagas de PhD são frequentemente anunciadas como empregos. Pesquise editais nas universidades e confira salário, tema de pesquisa e requisitos antes de se candidatar.', source: NORWAY_SOURCES.afterStudy },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare cursos e requisitos', intro: 'Estas instituições são pontos de partida, sem posição de ranking.', blocks: [
    { title: 'University of Oslo', text: 'Confira os programas, idiomas e requisitos de admissão no site oficial.', source: NORWAY_SOURCES.universityOslo, link: { label: 'Explorar a University of Oslo', url: NORWAY_SOURCES.universityOslo.url } },
    { title: 'Norwegian University of Science and Technology', text: 'A NTNU publica cursos e processos seletivos para estudantes internacionais.', source: NORWAY_SOURCES.universityNtnu, link: { label: 'Explorar a NTNU', url: NORWAY_SOURCES.universityNtnu.url } },
    { title: 'University of Bergen', text: 'Compare currículo, campus, custos e prazos diretamente com a instituição.', source: NORWAY_SOURCES.universityBergen, link: { label: 'Explorar a University of Bergen', url: NORWAY_SOURCES.universityBergen.url } },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Prepare a rotina dentro e fora do campus', intro: 'A experiência muda conforme a cidade e a estação do ano.', blocks: [
    { title: 'Cotidiano', text: 'Atividades ao ar livre fazem parte da vida de muitas comunidades. Ao escolher o destino, considere transporte, moradia e horas de luz no inverno.' },
    { title: 'Apoio brasileiro', text: 'Procure o escritório internacional da universidade e a representação consular brasileira. Este guia não apresenta uma contagem de brasileiros no país sem fonte oficial verificável.', source: NORWAY_SOURCES.consular, link: { label: 'Acessar o e-Consular', url: NORWAY_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Use o calendário do programa escolhido', intro: 'Prazos de candidatura e de bolsas não são iguais em todas as universidades.', blocks: [
    { title: 'Semestres', text: 'Muitos cursos organizam o ano em semestres de outono e primavera. Confirme as datas de início, matrícula e orientação internacional na página oficial do programa.' },
    { title: 'Prazo para estudantes internacionais', text: 'Separe tempo para candidatura, resultado, comprovação financeira e permissão de estudos. Não use um prazo de outra universidade como referência automática.', source: NORWAY_SOURCES.studyPermit },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Organize a candidatura por curso', intro: 'A universidade decide a equivalência dos estudos anteriores e os requisitos finais.', blocks: [
    { title: '1. Selecione o programa', text: 'Confira nível, idioma, formação anterior exigida e documentos. A qualificação geral de acesso ao ensino superior, GSU, pode ser relevante conforme sua formação.', source: NORWAY_SOURCES.admission },
    { title: '2. Planeje o financiamento', text: 'Anote mensalidade, possibilidade real de bolsa, custo de vida e recursos exigidos para a permissão. A aprovação acadêmica não dispensa a comprovação financeira.', source: NORWAY_SOURCES.studyPermit },
    { title: '3. Envie e acompanhe', text: 'Siga o formulário e os prazos da instituição. Guarde recibos e só inicie o procedimento migratório com as instruções atualizadas da UDI e da universidade.', source: NORWAY_SOURCES.studyPermit },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada e permanência', title: 'Confirme a permissão de estudos', intro: 'Brasileiros que vão estudar por mais de três meses devem verificar as regras da UDI.', blocks: [
    { title: 'Antes da viagem', text: 'A UDI exige, entre outros pontos, admissão em curso adequado, recursos para viver e cobertura da mensalidade quando ela se aplica. Confira as condições para sua nacionalidade e nível de estudo.', source: NORWAY_SOURCES.studyPermit, link: { label: 'Consultar a UDI', url: NORWAY_SOURCES.studyPermit.url } },
    { title: 'Após a formatura', text: 'Quem concluiu formação elegível na Noruega pode solicitar permissão para procurar trabalho qualificado por até um ano, sujeita a recursos próprios e a outras condições. Solicite antes de vencer a permissão atual e confira o caso concreto com a UDI.', source: NORWAY_SOURCES.jobSeeker, link: { label: 'Ver a rota para procurar trabalho', url: NORWAY_SOURCES.jobSeeker.url } },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Entenda o limite de trabalho estudantil', intro: 'A renda parcial pode ajudar no orçamento, sem substituir a comprovação exigida.', blocks: [
    { title: 'Horas permitidas', text: 'Uma permissão de estudos concedida pela UDI normalmente autoriza trabalho de até 20 horas semanais durante o período letivo e em tempo integral nas férias. Confira as condições escritas na sua permissão.', source: NORWAY_SOURCES.studyPermit },
    { title: 'Limites da atividade', text: 'A permissão de estudos não autoriza trabalho autônomo nem abertura de empresa. Vagas e exigências de idioma variam; não há salário único para todos os setores.', source: NORWAY_SOURCES.studyPermit },
    { title: 'Mudança de situação', text: 'Ao terminar o curso, a permanência para procurar emprego depende de nova permissão e de requisitos próprios. Ter uma oferta de trabalho pode permitir solicitar outra categoria, sujeita à análise da UDI.', source: NORWAY_SOURCES.jobSeeker },
  ] },
]
