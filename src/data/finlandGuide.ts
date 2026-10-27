export type FinlandSource = { label: string; url: string; verifiedAt: string }
export type FinlandBlock = { title: string; text: string; note?: string; source?: FinlandSource; link?: { label: string; url: string } }
export type FinlandSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly FinlandBlock[] }

const verifiedAt = '2026-10-26'

export const FINLAND_SOURCES = {
  population: { label: 'Statistics Finland · População em agosto de 2026', url: 'https://stat.fi/en/publication/cmf2csr781baq08vutvz6rebx', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/system/files/documents/global-report-document/hdr2025reporten.pdf', verifiedAt },
  climate: { label: 'Instituto Meteorológico Finlandês · Estações', url: 'https://en.ilmatieteenlaitos.fi/seasons-in-finland', verifiedAt },
  costs: { label: 'Study in Finland · Mensalidades e custo de vida', url: 'https://www.studyinfinland.fi/funding-your-studies/fees-and-cost-living', verifiedAt },
  language: { label: 'Study in Finland · Perguntas frequentes', url: 'https://www.studyinfinland.fi/faq', verifiedAt },
  scholarships: { label: 'Study in Finland · Bolsas de graduação e mestrado', url: 'https://www.studyinfinland.fi/funding-your-studies/bachelors-and-masters-scholarships', verifiedAt },
  doctoral: { label: 'Study in Finland · Financiamento do doutorado', url: 'https://www.studyinfinland.fi/funding-your-studies/doctoral-funding', verifiedAt },
  erasmusMundus: { label: 'Erasmus+ · Mestrados conjuntos Erasmus Mundus', url: 'https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters', verifiedAt },
  admissions: { label: 'Study in Finland · Admissões', url: 'https://www.studyinfinland.fi/admissions', verifiedAt },
  studyinfo: { label: 'Studyinfo · Portal oficial de cursos', url: 'https://studyinfo.fi/', verifiedAt },
  studies: { label: 'Migri · Autorização de residência para estudos', url: 'https://migri.fi/en/studying-in-finland', verifiedAt },
  work: { label: 'Migri · Trabalho e estágio durante os estudos', url: 'https://migri.fi/en/studying-in-finland?textoutputmode=1', verifiedAt },
  jobSearch: { label: 'Migri · Permanência para buscar trabalho', url: 'https://migri.fi/en/studies', verifiedAt },
  graduatePermit: { label: 'Migri · Permissão após diploma finlandês', url: 'https://migri.fi/degree-completed-in-finland', verifiedAt },
  graduateIncome: { label: 'Migri · Renda exigida em 2026', url: 'https://migri.fi/working-in-finland/income-requirement', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, FinlandSource>

export const FINLAND_SECTIONS: readonly FinlandSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Confira o idioma do programa', intro: 'Finlandês e sueco são idiomas oficiais; há cursos ministrados em inglês.', blocks: [
    { title: 'Programas em inglês', text: 'A oferta e as exigências variam por instituição. Consulte na página do curso quais certificados de inglês são aceitos, a nota mínima e possíveis dispensas.', source: FINLAND_SOURCES.language },
    { title: 'Finlandês e sueco', text: 'Mesmo em curso ministrado em inglês, aprender o idioma local pode ajudar na vida cotidiana e nas oportunidades de trabalho. Verifique que apoio linguístico a universidade oferece.' },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Prepare-se para as estações e a luz do dia', intro: 'O inverno é frio e a duração dos dias muda bastante ao longo do ano.', blocks: [
    { title: 'Norte e sul', text: 'No extremo norte há noite polar em parte do inverno e sol da meia-noite no verão. As condições em Helsinque não representam toda a Finlândia.', source: FINLAND_SOURCES.climate },
    { title: 'Planejamento por cidade', text: 'Consulte médias mensais de temperatura e duração do dia para o destino e a época de chegada antes de planejar roupas, moradia e deslocamentos.', source: FINLAND_SOURCES.climate, link: { label: 'Ver as estações no instituto meteorológico', url: FINLAND_SOURCES.climate.url } },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Separe mensalidade e despesas de manutenção', intro: 'O custo real depende do curso, da cidade e das condições da sua autorização.', blocks: [
    { title: 'Quem paga mensalidade', text: 'Candidatos de fora da UE/EEE e da Suíça geralmente pagam mensalidade em graduação e mestrado ministrados em inglês. Cursos de graduação ministrados em finlandês ou sueco e doutorados não cobram mensalidade, independentemente da nacionalidade.', note: 'Isenção de mensalidade não cobre automaticamente moradia e demais despesas. Verifique seu programa e sua situação individual.', source: FINLAND_SOURCES.costs },
    { title: 'Seu orçamento', text: 'Consulte na universidade a mensalidade do ano de ingresso e estimativas locais de moradia, alimentação, transporte e seguro. Registre os valores em euros e o período consultado.', source: FINLAND_SOURCES.costs },
    { title: 'Recursos e seguro', text: 'A autorização de residência para estudos exige comprovação de recursos e seguro de saúde adequado. Confira os valores e os documentos atuais diretamente no Migri antes de solicitar.', source: FINLAND_SOURCES.studies },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Procure a bolsa vinculada ao programa', intro: 'A universidade define critérios, cobertura e processo de candidatura.', blocks: [
    { title: 'Bolsas e isenções', text: 'Universidades e universidades de ciências aplicadas podem oferecer bolsas ou redução de mensalidade a estudantes que precisam pagá-la. O portal oficial informa que não há programa governamental de bolsas para esses cursos; o apoio universitário costuma cobrir somente as taxas, parcial ou totalmente.', note: 'Planeje moradia e demais despesas separadamente e confirme a cobertura no edital da universidade.', source: FINLAND_SOURCES.scholarships, link: { label: 'Entender as opções no Study in Finland', url: FINLAND_SOURCES.scholarships.url } },
    { title: 'Doutorado', text: 'A ausência de mensalidade não garante financiamento. Procure posições remuneradas e oportunidades de pesquisa na universidade e em fontes indicadas pelo Study in Finland.', source: FINLAND_SOURCES.doctoral },
    { title: 'Mestrado conjunto Erasmus Mundus', text: 'Bolsas de mestrados conjuntos podem aceitar candidatos de todo o mundo. Para estudar na Finlândia por essa via, confira se uma instituição finlandesa participa do programa escolhido e quais períodos de mobilidade estão previstos.', note: 'A existência do Erasmus Mundus não garante uma vaga, bolsa ou período de estudos na Finlândia.', source: FINLAND_SOURCES.erasmusMundus, link: { label: 'Consultar os mestrados conjuntos', url: FINLAND_SOURCES.erasmusMundus.url } },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare o programa e a cidade', intro: 'Rankings variam por ano e metodologia; currículo e financiamento precisam entrar na decisão.', blocks: [
    { title: 'Instituições para pesquisar', text: 'Aalto University, Hanken School of Economics, Tampere University, University of Eastern Finland, University of Helsinki, University of Oulu, University of the Arts Helsinki e University of Turku são exemplos em ordem alfabética, não um ranking.' },
    { title: 'O que verificar', text: 'Compare conteúdo do curso, idioma, mensalidade, bolsas, serviços de apoio, oportunidades práticas e custo de vida da cidade. Se usar um ranking, consulte edição e metodologia.' },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Conheça costumes e regras locais', intro: 'A experiência cotidiana pode variar entre cidades e pessoas.', blocks: [
    { title: 'Convívio', text: 'Pontualidade, confiança mútua, silêncio e sisu — ideia de perseverança — aparecem nas descrições da vida finlandesa. Use-os como ponto de partida, sem tratar todas as pessoas da mesma forma.' },
    { title: 'Natureza e tradições', text: 'O direito de acesso à natureza permite atividades ao ar livre dentro de regras de respeito e conservação. Sauna, Juhannus, Vappu e o Dia da Independência são tradições conhecidas. Confirme datas e regras locais.' },
    { title: 'Representação brasileira', text: 'Consulte o Itamaraty para identificar a representação responsável e quais serviços consulares estão disponíveis.', source: FINLAND_SOURCES.consular, link: { label: 'Consultar o e-Consular', url: FINLAND_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Acompanhe o calendário do curso', intro: 'O ano acadêmico costuma ter períodos de outono e primavera, mas cada programa publica suas datas.', blocks: [
    { title: 'Entrada e candidatura', text: 'A candidatura conjunta para cursos que começam no outono costuma ocorrer em janeiro; alguns programas usam processos separados. Não use uma data única para todos os cursos.', source: FINLAND_SOURCES.admissions },
    { title: 'Onde conferir', text: 'Verifique no Studyinfo e no site da universidade o prazo, o ano de ingresso, documentos, seleção e data de matrícula.', source: FINLAND_SOURCES.studyinfo, link: { label: 'Pesquisar programas no Studyinfo', url: FINLAND_SOURCES.studyinfo.url } },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Prepare uma inscrição alinhada ao programa', intro: 'Critérios acadêmicos e documentos variam conforme o nível e a instituição.', blocks: [
    { title: '1. Escolha o curso', text: 'Confira nível, idioma, currículo, mensalidade e condições de bolsa no Studyinfo e na universidade.', source: FINLAND_SOURCES.admissions },
    { title: '2. Reúna os documentos', text: 'Histórico, diploma, comprovação de idioma, carta de motivação e recomendações podem ser pedidos. Veja as exigências específicas de tradução e formato.' },
    { title: '3. Envie e acompanhe', text: 'Use o processo indicado no anúncio do curso. Registre o prazo de inscrição e as datas de resultado, aceitação da vaga e pedido de bolsa.', source: FINLAND_SOURCES.admissions },
  ] },
  { id: 'residencia', tab: 'Residência', kicker: '09 · Entrada no país', title: 'Confira a autorização antes de viajar', intro: 'Estudantes brasileiros devem consultar as condições de residência aplicáveis ao curso e à duração.', blocks: [
    { title: 'Durante os estudos', text: 'O Migri exige vaga de estudos, recursos financeiros e seguro para a autorização de residência de estudante. Confirme formulários, taxas, prazos e documentação no serviço oficial.', source: FINLAND_SOURCES.studies, link: { label: 'Consultar a autorização para estudos', url: FINLAND_SOURCES.studies.url } },
    { title: 'Depois de se formar', text: 'Quem concluiu um curso na Finlândia pode avaliar uma autorização ligada a emprego ou negócio. Se ainda procura trabalho, há uma permissão específica que pode ser concedida por até dois anos, sujeita a requisitos próprios.', source: FINLAND_SOURCES.jobSearch },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante e após o curso', title: 'Controle as horas e o tipo de atividade', intro: 'As condições dependem da sua autorização e da relação do trabalho com o curso.', blocks: [
    { title: 'Trabalho durante os estudos', text: 'Com autorização de residência para estudos, é permitido trabalhar em qualquer área por uma média de 30 horas semanais ao longo do ano, equivalente a 1.560 horas anuais. Algumas semanas podem passar desse limite se a média anual for respeitada.', source: FINLAND_SOURCES.work },
    { title: 'Férias e estágios', text: 'Nas férias, pode haver trabalho em tempo integral se a média anual continuar dentro do limite. Treinamento ou trabalho de conclusão integrante do curso não entra no limite quando a obtenção de créditos foi combinada desde o início.', note: 'Estágio registrado como curricular só depois de começar segue o limite comum. Confirme as condições com a instituição e o empregador.', source: FINLAND_SOURCES.work },
    { title: 'Permissão após diploma', text: 'Para certas permissões baseadas em diploma obtido na Finlândia e atividade profissional, o Migri exige renda líquida mensal em 2026 de €1.210, €1.090 ou €1.030, conforme a região. Esses valores pertencem a essa modalidade; confira sua categoria antes de planejar a permanência.', source: FINLAND_SOURCES.graduateIncome, link: { label: 'Ver requisitos após a graduação', url: FINLAND_SOURCES.graduatePermit.url } },
    { title: 'Remuneração', text: 'Não há uma faixa salarial por hora válida para todos os estudantes. Consulte o contrato, o acordo coletivo aplicável e o custo de vida da cidade.' },
  ] },
]
