export type MalaysiaSource = { label: string; url: string; verifiedAt: string }
export type MalaysiaBlock = { title: string; text: string; note?: string; source?: MalaysiaSource; link?: { label: string; url: string } }
export type MalaysiaSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly MalaysiaBlock[] }

const verifiedAt = '2026-10-28'

export const MALAYSIA_SOURCES = {
  population: { label: 'DOSM · Estimativas populacionais 2026', url: 'https://www.dosm.gov.my/portal-main/release-content/current-population-estimates-2026', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_I-HDI_Table.pdf', verifiedAt },
  climate: { label: 'MetMalaysia · Fenômenos climáticos', url: 'https://www.met.gov.my/en/pendidikan/fenomena-cuaca/', verifiedAt },
  costs: { label: 'Education Malaysia · Perguntas frequentes sobre custos', url: 'https://educationmalaysia.gov.my/get-in-touch/faq', verifiedAt },
  mis: { label: 'MOHE · Diretrizes MIS 2026', url: 'https://biasiswa.mohe.gov.my/INTER/doc/MIS/Guidelines%20MIS%202026.pdf', verifiedAt },
  misStatus: { label: 'MOHE · Portal Malaysia International Scholarship', url: 'https://biasiswa.mohe.gov.my/INTER/', verifiedAt },
  educationMalaysia: { label: 'Education Malaysia · Portal oficial', url: 'https://educationmalaysia.gov.my/', verifiedAt },
  studentPass: { label: 'Departamento de Imigração da Malásia · Student Pass', url: 'https://www.imi.gov.my/index.php/en/main-services/pass/student-pass/', verifiedAt },
  work: { label: 'Education Malaysia · Perguntas frequentes sobre trabalho', url: 'https://educationmalaysia.gov.my/get-in-touch/faq', verifiedAt },
  universityMalaya: { label: 'Universiti Malaya · Site oficial', url: 'https://www.um.edu.my/', verifiedAt },
  universityPutra: { label: 'Universiti Putra Malaysia · Site oficial', url: 'https://www.upm.edu.my/', verifiedAt },
  universityKebangsaan: { label: 'Universiti Kebangsaan Malaysia · Site oficial', url: 'https://www.ukm.my/', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, MalaysiaSource>

export const MALAYSIA_SECTIONS: readonly MalaysiaSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Escolha o idioma do curso', intro: 'A língua de ensino e a proficiência exigida dependem do programa.', blocks: [
    { title: 'Malaio e inglês', text: 'O bahasa Malaysia é a língua oficial. O inglês é muito usado no ensino superior, mas confirme o idioma das aulas, da avaliação e do estágio diretamente com a instituição.', source: MALAYSIA_SOURCES.educationMalaysia },
    { title: 'Exigência de proficiência', text: 'Cada curso define os exames aceitos. Na MIS 2026, a referência é IELTS 6.0, TOEFL em papel 550 ou comprovação de que a formação anterior foi ministrada em inglês. Essa regra da bolsa não vale automaticamente para todos os cursos.', source: MALAYSIA_SOURCES.mis },
    { title: 'Outros idiomas no cotidiano', text: 'Chinês e tâmil também são falados por comunidades do país. A experiência linguística varia conforme a cidade e o campus.' },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Planeje a rotina para o clima tropical', intro: 'O regime de chuvas muda entre regiões e épocas do ano.', blocks: [
    { title: 'Monções', text: 'A monção do nordeste ocorre em geral de novembro a março; a do sudoeste, do fim de maio a setembro. A primeira pode trazer chuvas intensas à costa leste da península, ao oeste de Sarawak e ao leste de Sabah.', source: MALAYSIA_SOURCES.climate, link: { label: 'Consultar a meteorologia oficial', url: MALAYSIA_SOURCES.climate.url } },
    { title: 'Escolha da cidade', text: 'Consulte a previsão e as médias da cidade do seu campus. Temperatura e volume de chuva variam por localização e altitude.', source: MALAYSIA_SOURCES.climate },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Monte um orçamento em ringgits', intro: 'Mensalidade e despesas de vida mudam por curso e cidade.', blocks: [
    { title: 'Mensalidade', text: 'Confirme o preço para estudantes internacionais, as taxas obrigatórias e a forma de pagamento na página do programa. A Education Malaysia informa que o valor depende da instituição e do curso.', source: MALAYSIA_SOURCES.costs },
    { title: 'Despesas mensais', text: 'Peça uma estimativa de moradia, alimentação, transporte, seguro e instalação à universidade. Compare valores em MYR e revise o câmbio antes de pagar; este guia não traz uma média nacional sem base comparável.', source: MALAYSIA_SOURCES.costs },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Entenda a bolsa MIS e outras opções', intro: 'Estar na lista de nacionalidades não garante a concessão de uma bolsa.', blocks: [
    { title: 'Malaysia International Scholarship', text: 'A MIS 2026, do Ministério do Ensino Superior, inclui o Brasil entre os países listados e contempla mestrado e doutorado em tempo integral. O guia prevê pagamento da mensalidade à universidade e auxílio de RM 1.500 por mês, liberado a cada quatro meses após relatório de progresso.', source: MALAYSIA_SOURCES.mis, link: { label: 'Ler as diretrizes MIS 2026', url: MALAYSIA_SOURCES.mis.url } },
    { title: 'Critérios da MIS', text: 'O limite de idade indicado é 40 anos para mestrado e 45 para doutorado. Há exigência acadêmica equivalente a CGPA 3,00, com condições específicas para cada nível, além de comprovação de inglês. Leia o edital completo para saber se seu histórico atende aos critérios.', source: MALAYSIA_SOURCES.mis },
    { title: 'Estado da seleção', text: 'A candidatura para 2026/2027 está encerrada no portal do MOHE. Consulte a próxima chamada antes de planejar prazos; o fato de ser brasileiro não confirma elegibilidade individual.', source: MALAYSIA_SOURCES.misStatus, link: { label: 'Ver o portal da MIS', url: MALAYSIA_SOURCES.misStatus.url } },
    { title: 'Bolsas das universidades', text: 'Pesquise auxílios próprios na instituição escolhida. Confirme nível, nacionalidade aceita, cobertura, prazo e condições diretamente no edital.' },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare cursos e requisitos', intro: 'Use as instituições abaixo como ponto de partida, sem inferir uma posição de ranking.', blocks: [
    { title: 'Universiti Malaya', text: 'Consulte cursos, idioma, taxas e processo seletivo no site oficial.', source: MALAYSIA_SOURCES.universityMalaya, link: { label: 'Explorar a Universiti Malaya', url: MALAYSIA_SOURCES.universityMalaya.url } },
    { title: 'Universiti Putra Malaysia', text: 'Confira programas e oportunidades de financiamento diretamente com a instituição.', source: MALAYSIA_SOURCES.universityPutra, link: { label: 'Explorar a Universiti Putra Malaysia', url: MALAYSIA_SOURCES.universityPutra.url } },
    { title: 'Universiti Kebangsaan Malaysia', text: 'Compare currículo, exigências de idioma e prazos do curso desejado.', source: MALAYSIA_SOURCES.universityKebangsaan, link: { label: 'Explorar a Universiti Kebangsaan Malaysia', url: MALAYSIA_SOURCES.universityKebangsaan.url } },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Conheça a comunidade e os costumes', intro: 'A experiência cotidiana varia entre cidades, estados e universidades.', blocks: [
    { title: 'Vida cultural', text: 'A sociedade reúne tradições malaias, chinesas, indianas e de povos indígenas. Datas de festividades como Hari Raya, Ano Novo Chinês e Deepavali variam a cada ano. Conheça as regras locais ao visitar templos e mesquitas.' },
    { title: 'Apoio para brasileiros', text: 'Procure a equipe internacional da universidade e o atendimento consular brasileiro. Este guia não apresenta um número de brasileiros residentes sem fonte verificável.', source: MALAYSIA_SOURCES.consular, link: { label: 'Acessar o e-Consular', url: MALAYSIA_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Anote as datas do seu programa', intro: 'Não há um calendário único de ingresso para todas as universidades.', blocks: [
    { title: 'Início e matrícula', text: 'Verifique os períodos de candidatura, início das aulas, matrícula e orientação internacional na página do curso escolhido.' },
    { title: 'Prazos de bolsa', text: 'A MIS publica chamadas por ano acadêmico. A edição 2026/2027 já encerrou inscrições; acompanhe o portal do MOHE para o próximo ciclo.', source: MALAYSIA_SOURCES.misStatus },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Prepare a candidatura em etapas', intro: 'A instituição e o edital da bolsa definem os documentos finais.', blocks: [
    { title: '1. Escolha o curso', text: 'Confira formação anterior aceita, idioma, currículo, mensalidade, prazo e documentos no site da universidade.' },
    { title: '2. Verifique a bolsa', text: 'Se buscar a MIS, compare seu nível, desempenho acadêmico, idade e comprovação de inglês com as diretrizes vigentes. Prepare histórico, diploma e proposta quando exigidos.', source: MALAYSIA_SOURCES.mis },
    { title: '3. Organize a chegada', text: 'Confirme a carta de admissão e o procedimento do passe de estudante com a universidade antes de comprar passagens.', source: MALAYSIA_SOURCES.studentPass },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada e permanência', title: 'Confirme o passe de estudante', intro: 'A admissão e a bolsa não substituem a autorização migratória.', blocks: [
    { title: 'Antes de viajar', text: 'Peça à instituição as instruções atualizadas para solicitar o Student Pass e verifique as etapas exigidas pelo Departamento de Imigração.', source: MALAYSIA_SOURCES.studentPass, link: { label: 'Consultar o Student Pass', url: MALAYSIA_SOURCES.studentPass.url } },
    { title: 'Depois da formatura', text: 'Não conte com permanência ou trabalho automático após concluir o curso. Verifique diretamente com a imigração qual categoria pode se aplicar ao seu caso.', source: MALAYSIA_SOURCES.studentPass },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Peça autorização antes de trabalhar', intro: 'Trabalho parcial depende do passe, do período letivo e de aprovação prévia.', blocks: [
    { title: 'Quando e quanto', text: 'A orientação da Education Malaysia permite até 20 horas por semana apenas em intervalos de semestre ou feriados de mais de sete dias, com Student Pass válido e aprovação prévia da imigração. Confirme a regra atual com a universidade antes de contar com essa renda.', source: MALAYSIA_SOURCES.work },
    { title: 'Atividades permitidas', text: 'A orientação lista restaurantes, postos de combustível, minimercados, hotéis e, em resposta mais recente, o campus da instituição. Há funções proibidas. Peça à universidade que confira a vaga e encaminhe a autorização necessária.', source: MALAYSIA_SOURCES.work },
    { title: 'Planejamento financeiro', text: 'Não pressuponha que o trabalho parcial cobrirá mensalidade e custo de vida. Monte um orçamento que inclua os períodos sem autorização para trabalhar.', source: MALAYSIA_SOURCES.work },
  ] },
]
