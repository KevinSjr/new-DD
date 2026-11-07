export type TaiwanSource = { label: string; url: string; verifiedAt: string }
export type TaiwanBlock = { title: string; text: string; note?: string; source?: TaiwanSource; link?: { label: string; url: string } }
export type TaiwanSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly TaiwanBlock[] }

const verifiedAt = '2026-10-28'

export const TAIWAN_SOURCES = {
  population: { label: 'Ministério do Interior · População de janeiro de 2026', url: 'https://www.ris.gov.tw/info-liferay/app/channel/newsEnglishDetail/26245251', verifiedAt },
  hdi: { label: 'PNUD · Dados do IDH', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  portal: { label: 'Study in Taiwan · Portal oficial de estudos', url: 'https://www.studyintaiwan.org/', verifiedAt },
  scholarship: { label: 'Taiwan Scholarship · Diretrizes da bolsa MOE', url: 'https://taiwanscholarship.moe.gov.tw/web/pages.aspx?p=31', verifiedAt },
  scholarshipStatus: { label: 'Taiwan Scholarship · Disponibilidade por representação', url: 'https://taiwanscholarship.moe.gov.tw/Apply/Enroll/availabilitystatus', verifiedAt },
  climate: { label: 'Central Weather Administration · Clima e tufões', url: 'https://climate.cwa.gov.tw/SeasonalClimate?subpage=Summer', verifiedAt },
  visa: { label: 'Bureau of Consular Affairs · Visto de estudante', url: 'https://www.boca.gov.tw/cp-181-477-e95f0-2.html', verifiedAt },
  visaTypes: { label: 'Bureau of Consular Affairs · Visto de residência', url: 'https://www.boca.gov.tw/cp-165-1878-1ff5e-2.html', verifiedAt },
  work: { label: 'Ministério do Trabalho · Regulamento de trabalho estudantil', url: 'https://laws.mol.gov.tw/Eng/FLAWDAT0201.aspx?beginpos=5&id=FL028065', verifiedAt },
  wage: { label: 'Ministério do Trabalho · Salário mínimo de 2026', url: 'https://english.mol.gov.tw/21004/21015/21016/21033/21231/', verifiedAt },
  ntu: { label: 'National Taiwan University · Site oficial', url: 'https://www.ntu.edu.tw/english/', verifiedAt },
  nthu: { label: 'National Tsing Hua University · Site oficial', url: 'https://nthu-en.site.nthu.edu.tw/', verifiedAt },
  ncku: { label: 'National Cheng Kung University · Site oficial', url: 'https://www.ncku.edu.tw/', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, TaiwanSource>

export const TAIWAN_SECTIONS: readonly TaiwanSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Confirme o idioma do curso e da rotina', intro: 'O mandarim é amplamente usado; o idioma de ensino depende do programa.', blocks: [
    { title: 'Mandarim e outros idiomas', text: 'O mandarim é uma referência para o cotidiano. Também se ouvem hokkien taiwanês, hakka e línguas indígenas. Aprender o idioma local pode facilitar serviços, moradia e trabalho.' },
    { title: 'Ensino em inglês ou mandarim', text: 'Pesquise cursos no portal Study in Taiwan e confirme na página da instituição o idioma de ensino, a prova de proficiência aceita e a nota mínima. Bolsas e universidades podem ter critérios diferentes.', source: TAIWAN_SOURCES.portal, link: { label: 'Pesquisar programas', url: TAIWAN_SOURCES.portal.url } },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Considere chuva e calor ao escolher a cidade', intro: 'O clima varia entre regiões e estações; acompanhe os alertas locais.', blocks: [
    { title: 'Verão e tufões', text: 'O verão pode trazer calor, chuva intensa e tufões. A Central Weather Administration publica previsões e informações sazonais; acompanhe os avisos da cidade onde pretende morar.', source: TAIWAN_SOURCES.climate, link: { label: 'Acompanhar o clima', url: TAIWAN_SOURCES.climate.url } },
    { title: 'Planejamento por campus', text: 'Compare as condições da região do curso antes de planejar moradia, deslocamento e vestuário. Não use uma média do território como previsão da sua cidade.' },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Monte o orçamento em novos dólares taiwaneses', intro: 'Mensalidade e custo de vida variam por instituição e cidade.', blocks: [
    { title: 'Mensalidade e despesas', text: 'Consulte a tabela do seu programa e some moradia, alimentação, transporte, seguro e materiais. Verifique se a universidade oferece residência e se há taxas não incluídas na mensalidade.', source: TAIWAN_SOURCES.portal },
    { title: 'Não dependa só do trabalho', text: 'Compare o orçamento completo com o financiamento disponível. O trabalho estudantil depende de permissão e tem limite de horas durante as aulas.', source: TAIWAN_SOURCES.work },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Entenda o que a Taiwan Scholarship cobre', intro: 'O edital aplicável ao Brasil e a admissão na universidade precisam ser conferidos separadamente.', blocks: [
    { title: 'Bolsa do Ministério da Educação (MOE)', text: 'As diretrizes da Taiwan Scholarship descrevem auxílio mensal de NT$ 15.000 para graduação e NT$ 20.000 para mestrado ou doutorado, além de até NT$ 40.000 por semestre para mensalidade e taxas acadêmicas. A cobertura pode não pagar todas as despesas.', source: TAIWAN_SOURCES.scholarship, link: { label: 'Ler as diretrizes oficiais', url: TAIWAN_SOURCES.scholarship.url } },
    { title: 'Prazo e candidatura para brasileiros', text: 'Confira a representação responsável pelo Brasil no portal de bolsas antes de se candidatar. Disponibilidade e prazos mudam a cada ciclo; uma bolsa listada aqui não indica edital aberto nem elegibilidade confirmada.', source: TAIWAN_SOURCES.scholarshipStatus, link: { label: 'Ver a disponibilidade atual', url: TAIWAN_SOURCES.scholarshipStatus.url } },
    { title: 'Bolsas da universidade', text: 'Além do programa governamental, procure financiamento na página oficial da instituição escolhida. Compare cobertura, requisitos de idioma, acúmulo de bolsas e prazo.' },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare programas diretamente nas universidades', intro: 'Estes são pontos de partida, sem ordem de ranking.', blocks: [
    { title: 'National Taiwan University', text: 'Confira cursos, requisitos para estudantes internacionais e custos no site da universidade.', source: TAIWAN_SOURCES.ntu, link: { label: 'Explorar a NTU', url: TAIWAN_SOURCES.ntu.url } },
    { title: 'National Tsing Hua University', text: 'Verifique idioma, calendário e oportunidades de financiamento do programa desejado.', source: TAIWAN_SOURCES.nthu, link: { label: 'Explorar a NTHU', url: TAIWAN_SOURCES.nthu.url } },
    { title: 'National Cheng Kung University', text: 'Compare programa, documentação e taxas antes de iniciar a candidatura.', source: TAIWAN_SOURCES.ncku, link: { label: 'Explorar a NCKU', url: TAIWAN_SOURCES.ncku.url } },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Prepare a chegada com apoio local', intro: 'A universidade é o melhor ponto inicial para questões práticas da sua cidade.', blocks: [
    { title: 'Moradia e integração', text: 'Peça ao escritório internacional orientações sobre residência estudantil, transporte, saúde e acolhimento. Considere as diferenças de idioma e de calendário na organização dos primeiros dias.' },
    { title: 'Serviços para brasileiros', text: 'Confirme no Itamaraty qual representação presta o serviço consular necessário para a sua situação.', source: TAIWAN_SOURCES.consular, link: { label: 'Consultar o e-Consular', url: TAIWAN_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Separe os prazos do curso e da bolsa', intro: 'Cada universidade e cada programa podem ter etapas diferentes.', blocks: [
    { title: 'Calendário da instituição', text: 'Anote abertura de inscrições, envio de documentos, resultado, matrícula e início das aulas. Confira as datas diretamente no curso escolhido.', source: TAIWAN_SOURCES.portal },
    { title: 'Ciclo de bolsas', text: 'Verifique a chamada da representação responsável pelo Brasil e o prazo da universidade. Não use o prazo de outro país como referência para sua candidatura.', source: TAIWAN_SOURCES.scholarshipStatus },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Organize curso, documentos e financiamento', intro: 'A seleção final depende das regras da instituição e da bolsa.', blocks: [
    { title: '1. Escolha um programa', text: 'Compare área, idioma, nível de estudo, taxas e calendário em mais de uma universidade.', source: TAIWAN_SOURCES.portal },
    { title: '2. Confirme os requisitos', text: 'Leia a lista de documentos e de comprovação de idioma do curso. A bolsa pode pedir documentos adicionais; confira o edital do ciclo vigente.', source: TAIWAN_SOURCES.scholarship },
    { title: '3. Candidate-se nas duas frentes', text: 'Prepare a candidatura à universidade e, se aplicável, à bolsa. Guarde comprovantes e acompanhe cada processo pelo canal oficial.', source: TAIWAN_SOURCES.scholarshipStatus },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada e permanência', title: 'Verifique o visto adequado ao seu curso', intro: 'Tipo de estudo e duração da permanência mudam o procedimento.', blocks: [
    { title: 'Estudo em universidade', text: 'O BOCA informa os documentos gerais para solicitar visto de residência por estudos universitários. Confirme a categoria, a representação competente, autenticações e prazos antes de comprar a passagem.', source: TAIWAN_SOURCES.visa, link: { label: 'Ver documentos do visto', url: TAIWAN_SOURCES.visa.url } },
    { title: 'Após a chegada', text: 'Para permanências superiores a seis meses, consulte as regras de visto de residência e de registro local. Cursos de idioma podem seguir procedimento diferente de programas universitários.', source: TAIWAN_SOURCES.visaTypes },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Solicite permissão antes de trabalhar', intro: 'As regras de trabalho estudantil dependem do seu vínculo e da autorização.', blocks: [
    { title: 'Limite durante as aulas', text: 'A regulamentação exige permissão de trabalho e limita estudantes estrangeiros autorizados a 20 horas semanais fora das férias de verão e inverno. O prazo máximo da permissão é de um ano, segundo a regra consultada.', source: TAIWAN_SOURCES.work, note: 'A validade concreta da sua permissão pode ser menor; consulte a autoridade antes de iniciar uma atividade.' },
    { title: 'Salário mínimo em 2026', text: 'Desde 1º de janeiro de 2026, o salário mínimo é NT$ 196 por hora ou NT$ 29.500 por mês. Esses valores não garantem vaga ou renda suficiente para cobrir estudos e moradia.', source: TAIWAN_SOURCES.wage },
  ] },
]
