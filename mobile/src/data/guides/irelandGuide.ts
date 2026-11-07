export type IrelandSource = { label: string; url: string; verifiedAt: string }
export type IrelandBlock = { title: string; text: string; note?: string; source?: IrelandSource; link?: { label: string; url: string } }
export type IrelandSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly IrelandBlock[] }

const verifiedAt = '2026-10-27'

export const IRELAND_SOURCES = {
  population: { label: 'CSO · Estimativa populacional de abril de 2026', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-pme/populationandmigrationestimatesapril2026/keyfindings/', verifiedAt },
  hdi: { label: 'PNUD · Tabela de IDH do relatório 2025', url: 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_HDI_Table.pdf', verifiedAt },
  irishLanguage: { label: 'CSO · Censo 2022: língua irlandesa', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-cpp8/censusofpopulation2022profile8-theirishlanguageandeducation/irishlanguageandthegaeltacht/', verifiedAt },
  climate: { label: 'Met Éireann · Clima da Irlanda', url: 'https://www.met.ie/climate/climate-of-ireland', verifiedAt },
  housing: { label: 'Education Ireland · Moradia estudantil', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/student-accommodation', verifiedAt },
  scholarship: { label: 'HEA · Government of Ireland International Education Scholarships', url: 'https://hea.ie/policy/internationalisation/goi-ies/', verifiedAt },
  visa: { label: 'Irish Immigration · Estudar na Irlanda', url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/', verifiedAt },
  finances: { label: 'Irish Immigration · Comprovação de recursos', url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-fee-paying-private-primary-or-secondary-school/information-on-student-finances/', verifiedAt },
  work: { label: 'Irish Immigration · Planejar estudos e trabalho', url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/planning-to-study-in-ireland/', verifiedAt },
  stamps: { label: 'Irish Immigration · Condições dos Stamps', url: 'https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-Stamps/', verifiedAt },
  graduate: { label: 'Irish Immigration · Third Level Graduate Programme', url: 'https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/', verifiedAt },
  minimumWage: { label: 'Governo irlandês · Salário mínimo de 2026', url: 'https://www.gov.ie/en/department-of-enterprise-tourism-and-employment/campaigns/low-pay-commission/', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
  education: { label: 'Education Ireland · Portal oficial de estudo', url: 'https://www.educationinireland.com/', verifiedAt },
  cao: { label: 'CAO · Central Applications Office', url: 'https://www.cao.ie/', verifiedAt },
} satisfies Record<string, IrelandSource>

export const IRELAND_SECTIONS: readonly IrelandSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Confirme o inglês exigido pelo curso', intro: 'Inglês e irlandês são idiomas oficiais; o inglês predomina em muitos programas de ensino superior.', blocks: [
    { title: 'Proficiência para a candidatura', text: 'Cada instituição define o exame de inglês aceito, a pontuação mínima e possíveis dispensas. Consulte a página do curso antes de marcar IELTS, TOEFL ou outra prova.' },
    { title: 'Irlandês no país', text: 'No Censo 2022, cerca de 1,87 milhão de pessoas disseram saber falar irlandês; isso inclui quem usa a língua na escola. O número de falantes diários fora do ensino era muito menor. Não confunda conhecimento declarado com uso cotidiano.', source: IRELAND_SOURCES.irishLanguage },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Prepare-se para o clima marítimo', intro: 'A influência do Atlântico ameniza extremos de temperatura e contribui para vento e chuva.', blocks: [
    { title: 'Veja dados locais', text: 'O clima pode variar entre litoral e interior. Consulte as médias da cidade escolhida no Met Éireann e planeje roupas adequadas à estação de chegada.', source: IRELAND_SOURCES.climate, link: { label: 'Consultar o Met Éireann', url: IRELAND_SOURCES.climate.url } },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Calcule o custo da cidade e do curso', intro: 'Mensalidade, moradia e despesas diárias dependem da instituição e do local.', blocks: [
    { title: 'Taxas e manutenção', text: 'Consulte o valor do programa para candidatos de fora da UE/EEE e peça à universidade uma estimativa de moradia, alimentação, transporte, seguro e custos de chegada. Registre o ano e a moeda dos valores.' },
    { title: 'Procure moradia cedo', text: 'Os escritórios de acomodação das instituições ajudam a pesquisar opções. Comece antes da viagem e confirme contrato, localização e condições antes de pagar.', source: IRELAND_SOURCES.housing, link: { label: 'Ver orientações de moradia', url: IRELAND_SOURCES.housing.url } },
    { title: 'Recursos para imigração', text: 'A imigração exige comprovar meios de subsistência sem depender de trabalho eventual. Confira o valor e a documentação atual para a duração do seu curso; o mínimo de imigração não é um orçamento individual.', source: IRELAND_SOURCES.finances },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Confira a próxima chamada antes de se planejar', intro: 'Regras e prazos dependem da edição e do programa.', blocks: [
    { title: 'Government of Ireland International Education Scholarship', text: 'Na chamada de 2026, a GOI-IES ofereceu 60 bolsas para um ano de estudo em tempo integral nos níveis NFQ 9 e 10, incluindo mestrado, diploma de pós-graduação e doutorado. O benefício foi de €10.000 e isenção integral da mensalidade no ano da bolsa.', note: 'A chamada de 2026 encerrou em 12 de março de 2026, às 17h na Irlanda. Candidatos com domicílio de origem fora da UE/EEE, Suíça e Reino Unido devem conferir todos os critérios da próxima edição; nacionalidade brasileira, isoladamente, não garante elegibilidade.', source: IRELAND_SOURCES.scholarship, link: { label: 'Consultar a GOI-IES no HEA', url: IRELAND_SOURCES.scholarship.url } },
    { title: 'Bolsas da universidade', text: 'Trinity College Dublin, University College Dublin e outras instituições podem ter bolsas próprias. Verifique nível, curso, valor, custos cobertos e prazo diretamente na chamada oficial.' },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare programas e apoio ao estudante', intro: 'Rankings mudam de posição conforme a edição e a metodologia.', blocks: [
    { title: 'Instituições para pesquisar', text: 'Trinity College Dublin, University College Cork e University College Dublin são exemplos, sem ordem de qualidade ou posição em ranking.' },
    { title: 'O que observar', text: 'Compare currículo, reconhecimento do curso, requisitos de idioma, custos, cidade, bolsas e serviços para estudantes internacionais. Se consultar rankings, anote o ano e a metodologia.' },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Conheça a vida fora do campus', intro: 'A experiência varia conforme a cidade, a instituição e as pessoas.', blocks: [
    { title: 'Cultura e encontros', text: 'Música, literatura e pubs têm presença na vida social, mas não definem todas as comunidades. O Dia de São Patrício é celebrado em 17 de março e o Bloomsday em 16 de junho.' },
    { title: 'Apoio ao chegar', text: 'Procure a equipe internacional da instituição e confirme no e-Consular a representação brasileira responsável. Não há aqui um número verificado de brasileiros residentes.', source: IRELAND_SOURCES.consular },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Monte um calendário do seu programa', intro: 'Muitos cursos começam em setembro, mas as datas variam.', blocks: [
    { title: 'Candidatura', text: 'Anote prazo de inscrição, documentos, resultado, confirmação da vaga, bolsa, moradia e imigração. Candidatos de fora da UE/EEE podem seguir processos próprios da universidade.' },
    { title: 'CAO ou candidatura direta', text: 'O CAO é um sistema central de inscrição na graduação, mas não é a rota de todos os candidatos e cursos. Confirme com a instituição se seu caso passa pelo CAO ou pelo portal dela.', source: IRELAND_SOURCES.cao, link: { label: 'Consultar o CAO', url: IRELAND_SOURCES.cao.url } },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Prepare a inscrição para o curso escolhido', intro: 'A instituição decide requisitos acadêmicos, idioma e documentos.', blocks: [
    { title: '1. Verifique a formação aceita', text: 'Compare a formação brasileira com as exigências do programa e peça orientação à universidade quando a equivalência não estiver clara.' },
    { title: '2. Separe os documentos', text: 'Histórico, diploma, comprovante de idioma, currículo, carta de motivação e recomendações podem ser solicitados. Confira traduções e formato no edital do curso.' },
    { title: '3. Confirme o envio', text: 'Use o canal de inscrição indicado pela instituição, registre o prazo e guarde os comprovantes. Após a oferta de vaga, confira as exigências de imigração antes da viagem.', source: IRELAND_SOURCES.visa, link: { label: 'Ver orientações oficiais de estudo', url: IRELAND_SOURCES.visa.url } },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada no país', title: 'Confira a permissão para estudar', intro: 'Curso, nacionalidade e duração determinam as formalidades.', blocks: [
    { title: 'Antes de viajar', text: 'Consulte a imigração irlandesa para saber se precisa de visto e quais documentos apresentar. Uma estadia superior a 90 dias exige registro de residência após a chegada.', source: IRELAND_SOURCES.visa },
    { title: 'Depois da graduação', text: 'O Third Level Graduate Programme pode conceder Stamp 1G por até 12 meses a graduados elegíveis no nível NFQ 8. Para nível 9 ou superior, pode chegar a 24 meses, com extensão sujeita a condições. Confira limites de permanência, seguro e prazo do pedido.', source: IRELAND_SOURCES.graduate, link: { label: 'Consultar o programa de graduados', url: IRELAND_SOURCES.graduate.url } },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Entenda as condições do Stamp 2', intro: 'Trabalho eventual é complementar e não substitui a comprovação de recursos.', blocks: [
    { title: 'Horas permitidas', text: 'Com Stamp 2 válido, o limite é de até 20 horas semanais durante o período letivo. São permitidas até 40 horas semanais de junho a setembro e de 15 de dezembro a 15 de janeiro. Stamp 2A não autoriza trabalho.', source: IRELAND_SOURCES.work },
    { title: 'Emprego e autonomia', text: 'Confira seu registro de residência e as condições da permissão antes de começar. Stamp 2 e Stamp 1G não autorizam atividade autônoma; as regras de estágio integrado ao curso são específicas.', source: IRELAND_SOURCES.stamps },
    { title: 'Salário mínimo em 2026', text: 'Desde 1.º de janeiro de 2026, o salário mínimo nacional é de €14,15 por hora para pessoas de 20 anos ou mais. Há valores menores para trabalhadores mais jovens; a renda mensal depende das horas trabalhadas.', source: IRELAND_SOURCES.minimumWage },
  ] },
]
