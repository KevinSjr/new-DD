export type SwitzerlandSource = { label: string; url: string; verifiedAt: string }
export type SwitzerlandBlock = { title: string; text: string; note?: string; source?: SwitzerlandSource; link?: { label: string; url: string } }
export type SwitzerlandSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly SwitzerlandBlock[] }

const verifiedAt = '2026-10-28'

export const SWITZERLAND_SOURCES = {
  population: { label: 'Escritório Federal de Estatística · População provisória de 2025', url: 'https://dam-api.bfs.admin.ch/hub/api/dam/assets/36502325/master', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  languages: { label: 'Escritório Federal de Estatística · Idiomas principais, 2024', url: 'https://dam-api.bfs.admin.ch/hub/api/dam/assets/36434426/master', verifiedAt },
  climate: { label: 'MeteoSwiss · Regiões climáticas da Suíça', url: 'https://www.meteoswiss.admin.ch/dam/jcr%3A0a1f0fe1-6ccf-4467-a7c2-7901ca60a192/ProdDoc_CHTM_v1.3_en.pdf', verifiedAt },
  governmentScholarships: { label: 'SERI · Swiss Government Excellence Scholarships 2027/28', url: 'https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships', verifiedAt },
  governmentDetails: { label: 'SERI · Requisitos e modalidades das bolsas 2027/28', url: 'https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships-at-a-glance', verifiedAt },
  governmentFaq: { label: 'SERI · Perguntas frequentes sobre as bolsas', url: 'https://www.sbfi.admin.ch/en/faq-swiss-government-excellence-scholarships', verifiedAt },
  esop: { label: 'ETH Zurich · Excellence Scholarship & Opportunity Programme', url: 'https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html', verifiedAt },
  ethFees: { label: 'ETH Zurich · Taxas de matrícula e do semestre', url: 'https://ethz.ch/content/dam/ethz/main/education/finanzielles/files-en/tuition-fees.pdf', verifiedAt },
  epflFees: { label: 'EPFL · Tuition fee and other fees', url: 'https://www.epfl.ch/education/studies/en/rules-and-procedures/study-taxes/tuition-fee-other-fees/', verifiedAt },
  epflBudget: { label: 'EPFL · Financing your studies', url: 'https://www.epfl.ch/education/studies/en/financing-study/', verifiedAt },
  eth: { label: 'ETH Zurich · Site oficial', url: 'https://ethz.ch/', verifiedAt },
  epfl: { label: 'EPFL · Site oficial', url: 'https://www.epfl.ch/', verifiedAt },
  uzh: { label: 'Universidade de Zurique · Site oficial', url: 'https://www.uzh.ch/', verifiedAt },
  calendar: { label: 'Study in Switzerland+ · Prazos por universidade', url: 'https://www.studyinswitzerland.plus/application-deadlines/', verifiedAt },
  visa: { label: 'Representação suíça no Brasil · Vistos e residência', url: 'https://www.schweiz-brasilien.eda.admin.ch/en/visa-entry-to-and-residence-in-switzerland', verifiedAt },
  nationalVisa: { label: 'Representação suíça no Brasil · Visto nacional', url: 'https://www.schweiz-brasilien.eda.admin.ch/en/national-visa', verifiedAt },
  work: { label: 'Secretaria de Estado de Migração · FAQ sobre trabalho', url: 'https://www.sem.admin.ch/sem/en/home/themen/arbeit/faq.0006.html', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, SwitzerlandSource>

export const SWITZERLAND_SECTIONS: readonly SwitzerlandSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Escolha o curso e a região linguística', intro: 'O idioma de ensino depende da instituição e do programa.', blocks: [
    { title: 'Quatro idiomas nacionais', text: 'Alemão, francês, italiano e romanche compõem o cenário linguístico da Suíça. Em 2024, o órgão estatístico registrou alemão como idioma principal de 61% dos residentes, francês de 23%, italiano de 8% e romanche de 0,4%; 6% indicaram inglês. As respostas podem incluir mais de um idioma.', source: SWITZERLAND_SOURCES.languages },
    { title: 'Idioma do programa', text: 'Confira se o curso é ministrado em alemão, francês, italiano ou inglês e quais comprovantes aceita. Na região germanófona, os dialetos suíço-alemães podem aparecer no cotidiano, enquanto o ensino e a escrita seguem as exigências da instituição.' },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Compare o clima da cidade e a altitude', intro: 'Montanhas, vales e regiões ao sul dos Alpes têm condições diferentes.', blocks: [
    { title: 'Variação regional', text: 'A MeteoSwiss usa regiões climáticas distintas para analisar temperatura e precipitação. Pesquise as médias da cidade do campus e considere altitude, deslocamentos e custos de aquecimento ao planejar a chegada.', source: SWITZERLAND_SOURCES.climate },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Calcule todas as despesas em francos suíços', intro: 'As taxas de estudo são apenas uma parte do orçamento.', blocks: [
    { title: 'Moradia e manutenção', text: 'Pesquise acomodação, alimentação, seguro de saúde, transporte e materiais na cidade da universidade. A EPFL publica uma planilha de referência própria; use o valor da instituição e atualize-o para o seu caso.', source: SWITZERLAND_SOURCES.epflBudget, link: { label: 'Ver custos de referência da EPFL', url: SWITZERLAND_SOURCES.epflBudget.url } },
    { title: 'Exemplo de taxa: ETH Zurich', text: 'A tabela da ETH distingue grupos de estudantes de graduação e mestrado: CHF 730 ou CHF 2.190 por semestre em mensalidade, conforme o enquadramento. Há outras taxas semestrais; confirme o grupo aplicável antes da candidatura.', source: SWITZERLAND_SOURCES.ethFees },
    { title: 'Exemplo de taxa: EPFL', text: 'A EPFL informa CHF 730 por semestre em mensalidade padrão ou CHF 2.190 para determinados estudantes internacionais que se mudaram para estudar, além de taxas complementares. Não estenda esses valores a outras universidades.', source: SWITZERLAND_SOURCES.epflFees },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Diferencie pesquisa e mestrado', intro: 'Cada bolsa tem público, cobertura e calendário próprios.', blocks: [
    { title: 'Bolsas de Excelência do governo suíço', text: 'No ciclo 2027/28, as modalidades de pesquisa e doutorado são voltadas principalmente a pesquisadores em início de carreira com mestrado concluído. A candidatura de pesquisa exige apoio de um orientador na Suíça. Verifique na lista por país quais modalidades e prazos se aplicam ao Brasil.', source: SWITZERLAND_SOURCES.governmentDetails, link: { label: 'Consultar bolsas por país', url: SWITZERLAND_SOURCES.governmentDetails.url } },
    { title: 'Valor e mudança de modalidade', text: 'A SERI informa CHF 2.450 mensais nas bolsas de pesquisa e doutorado de 2027/28. A verba é para despesas básicas de uma pessoa e não equivale a salário. A modalidade de pós-doutorado deixou de ser oferecida a partir de 2027/28; confira as condições da modalidade desejada.', source: SWITZERLAND_SOURCES.governmentFaq },
    { title: 'ESOP da ETH Zurich', text: 'Para mestrados com início no outono de 2027, a ETH anuncia auxílio de CHF 13.500 por semestre e isenção da taxa de matrícula durante a duração regular do curso. A janela de candidatura é de 01/11/2026 a 30/11/2026, às 11h59 no horário informado pela ETH. Desempenho entre os 10% melhores da graduação é um dos critérios; confira os demais.', source: SWITZERLAND_SOURCES.esop, link: { label: 'Ver a ESOP na ETH', url: SWITZERLAND_SOURCES.esop.url } },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare programas e requisitos', intro: 'Estas instituições são pontos de partida, sem ordem de ranking.', blocks: [
    { title: 'ETH Zurich', text: 'Confira programas, idioma, custos e bolsas no portal oficial.', source: SWITZERLAND_SOURCES.eth, link: { label: 'Explorar a ETH', url: SWITZERLAND_SOURCES.eth.url } },
    { title: 'EPFL', text: 'Consulte as condições específicas do curso e a estimativa de despesas.', source: SWITZERLAND_SOURCES.epfl, link: { label: 'Explorar a EPFL', url: SWITZERLAND_SOURCES.epfl.url } },
    { title: 'Universidade de Zurique', text: 'Pesquise idioma, exigências acadêmicas e financiamento por programa.', source: SWITZERLAND_SOURCES.uzh, link: { label: 'Explorar a Universidade de Zurique', url: SWITZERLAND_SOURCES.uzh.url } },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Prepare sua rotina no cantão escolhido', intro: 'As regras e a vida cotidiana variam conforme o lugar.', blocks: [
    { title: 'Adaptação local', text: 'Pergunte à universidade sobre moradia, seguro, transporte e apoio a estudantes internacionais. Considere os idiomas usados no cotidiano da cidade e os custos do cantão.' },
    { title: 'Apoio consular brasileiro', text: 'Procure a representação brasileira responsável pela sua região para serviços consulares e orientações oficiais.', source: SWITZERLAND_SOURCES.consular, link: { label: 'Acessar o e-Consular', url: SWITZERLAND_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Anote prazos por universidade', intro: 'Graduação, mestrado, doutorado e bolsas seguem calendários diferentes.', blocks: [
    { title: 'Semestres e candidatura', text: 'Muitas universidades organizam semestres de outono e primavera, mas o início e as datas de inscrição variam. Consulte diretamente o curso e a página de prazos da instituição.', source: SWITZERLAND_SOURCES.calendar, link: { label: 'Comparar prazos publicados', url: SWITZERLAND_SOURCES.calendar.url } },
    { title: 'Candidatura à bolsa', text: 'Reserve tempo para encontrar orientador, preparar projeto ou enviar candidatura ao mestrado. A bolsa pode ter prazo anterior ao do curso.', source: SWITZERLAND_SOURCES.governmentDetails },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Organize os requisitos do programa', intro: 'A universidade e a bolsa definem as etapas finais.', blocks: [
    { title: '1. Escolha o curso', text: 'Compare conteúdo, idioma de ensino, pré-requisitos, taxas e custo de vida da cidade. Guarde o link oficial e a data em que verificou os dados.' },
    { title: '2. Confirme o financiamento', text: 'Para as bolsas governamentais de pesquisa, procure um possível orientador suíço e leia a modalidade disponível para o Brasil. Para a ESOP, confira primeiro a admissão no mestrado da ETH.', source: SWITZERLAND_SOURCES.governmentDetails },
    { title: '3. Prepare os documentos', text: 'Histórico, diplomas, cartas, proposta de pesquisa e certificados de idioma dependem do edital. Providencie traduções apenas quando exigidas.' },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada e permanência', title: 'Confirme a rota para estudar', intro: 'A isenção de visto turístico não cobre automaticamente estudos longos.', blocks: [
    { title: 'Estadias superiores a 90 dias', text: 'A representação suíça no Brasil informa que estudos de longa duração seguem a rota de visto nacional, sujeita à autorização do cantão de residência. Confira documentos e procedimento antes de viajar.', source: SWITZERLAND_SOURCES.visa, link: { label: 'Ver a orientação oficial', url: SWITZERLAND_SOURCES.nationalVisa.url } },
    { title: 'Permanência após a graduação', text: 'Segundo a Secretaria de Estado de Migração, nacionais de países fora da UE/EFTA formados por instituição suíça reconhecida dispõem de seis meses após o curso para buscar trabalho compatível com a qualificação. Isso não garante emprego nem autorização de trabalho; confirme os requisitos com o cantão.', source: SWITZERLAND_SOURCES.work },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Peça autorização antes de trabalhar', intro: 'O trabalho de estudantes estrangeiros depende de condições federais e cantonais.', blocks: [
    { title: 'Limite durante o semestre', text: 'Para estudantes de países fora da UE/EFTA, a autoridade cantonal pode autorizar trabalho complementar de até 15 horas por semana fora das férias, no mínimo seis meses após o início do curso. A instituição deve confirmar a compatibilidade com os estudos, e o empregador precisa apresentar o pedido.', source: SWITZERLAND_SOURCES.work, link: { label: 'Consultar as regras da SEM', url: SWITZERLAND_SOURCES.work.url } },
    { title: 'Planejamento financeiro', text: 'Não conte com renda de um emprego ainda não obtido para financiar o curso. Confirme condições do seu visto, eventuais exceções e regras do cantão antes de aceitar trabalho.' },
  ] },
]
