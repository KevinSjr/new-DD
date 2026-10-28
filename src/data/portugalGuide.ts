export type PortugalSource = { label: string; url: string; verifiedAt: string }
export type PortugalBlock = { title: string; text: string; note?: string; source?: PortugalSource; link?: { label: string; url: string } }
export type PortugalSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly PortugalBlock[] }

const verifiedAt = '2026-10-28'

export const PORTUGAL_SOURCES = {
  population: { label: 'INE · Estimativas da população residente 2025', url: 'https://www.ine.pt/ine_novidades/semin/INEWS66/9/', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  climate: { label: 'IPMA · Clima de Portugal Continental', url: 'https://www.ipma.pt/pt/educativa/tempo.clima/index.jsp', verifiedAt },
  climateNormals: { label: 'IPMA · Normais climatológicas por local', url: 'https://www.ipma.pt/pt/oclima/normais.clima/', verifiedAt },
  international: { label: 'Diário da República · Estatuto do Estudante Internacional', url: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2014-115919453', verifiedAt },
  tuition: { label: 'Universidade de Lisboa · Propinas 2026/2027', url: 'https://www.ulisboa.pt/info/propinas-e-emolumentos', verifiedAt },
  sciencesFees: { label: 'Faculdade de Ciências da Universidade de Lisboa · Propinas 2026/2027', url: 'https://ciencias.ulisboa.pt/estudante-internacional/perguntas-frequentes', verifiedAt },
  isegFees: { label: 'ISEG/Universidade de Lisboa · Propinas 2026/2027', url: 'https://www.iseg.ulisboa.pt/secretaria/informacoes-academicas/licenciaturas/propinas/propinas-ano-letivo-2026-2027/', verifiedAt },
  enem: { label: 'Inep · Enem Portugal', url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/enem-portugal/', verifiedAt },
  erasmus: { label: 'Erasmus+ · Mestrados Conjuntos Erasmus Mundus', url: 'https://erasmus-plus.ec.europa.eu/pt-pt/opportunities/individuals/students/erasmus-mundus-joint-masters', verifiedAt },
  universityCoimbra: { label: 'Universidade de Coimbra · Site oficial', url: 'https://www.uc.pt/', verifiedAt },
  universityPorto: { label: 'Universidade do Porto · Site oficial', url: 'https://www.up.pt/', verifiedAt },
  universityLisbon: { label: 'Universidade de Lisboa · Site oficial', url: 'https://www.ulisboa.pt/', verifiedAt },
  brazilPopulation: { label: 'AIMA · Relatório de Migrações e Asilo 2024', url: 'https://aima.gov.pt/media/pages/documents/fec4d6a712-1760603125/relatorio-migracoes-e-asilo-2024.pdf', verifiedAt },
  migrationReports: { label: 'AIMA · Relatórios de Migrações e Asilo', url: 'https://aima.gov.pt/pt/a-aima/relatorios-de-migracoes-e-asilo', verifiedAt },
  fado: { label: 'UNESCO · Fado, Patrimônio Cultural Imaterial', url: 'https://ich.unesco.org/en/RL/fado-00563', verifiedAt },
  visa: { label: 'gov.pt · Visto de residência para estudo', url: 'https://www.gov.pt/servicos/pedir-um-visto-de-residencia-para-estudo-intercambio-de-estudantes-estagio-profissional-ou-voluntariado', verifiedAt },
  residence: { label: 'AIMA · Autorização de residência para estudantes do ensino superior', url: 'https://aima.gov.pt/pt/estudar/autorizacao-de-residencia-emitida-a-estudantes-do-ensino-superior-art-o-91', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, PortugalSource>

export const PORTUGAL_SECTIONS: readonly PortugalSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Confira o idioma do curso', intro: 'O português facilita a leitura inicial, mas os requisitos continuam específicos de cada programa.', blocks: [
    { title: 'Português de Portugal', text: 'Português é o idioma do país. Sotaque e vocabulário podem exigir adaptação no cotidiano e na escrita acadêmica; confira as exigências linguísticas do edital.' },
    { title: 'Cursos em inglês', text: 'Quando o curso é ministrado em inglês, a instituição pode pedir prova de proficiência. Consulte a página do programa para saber os certificados e notas aceitos.' },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Compare o clima da região', intro: 'As condições variam entre litoral, interior, norte e sul.', blocks: [
    { title: 'Portugal continental', text: 'O IPMA descreve áreas de clima temperado com verão seco e inverno chuvoso. O norte tende a ser mais fresco e úmido; o sul e algumas áreas interiores têm verões mais quentes. Não use uma média nacional para planejar a rotina da sua cidade.', source: PORTUGAL_SOURCES.climate },
    { title: 'Médias locais', text: 'Consulte as normais climatológicas da cidade ou região do campus antes de estimar vestuário e custos de aquecimento.', source: PORTUGAL_SOURCES.climateNormals, link: { label: 'Consultar as normais do IPMA', url: PORTUGAL_SOURCES.climateNormals.url } },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Planeje os custos em euros', intro: 'Moradia, transporte e propina mudam conforme cidade e curso.', blocks: [
    { title: 'Moradia e rotina', text: 'Peça à instituição informações sobre residências estudantis e pesquise aluguel na cidade do campus. Some alimentação, transporte, seguro, materiais e despesas de chegada; este guia não apresenta um valor mensal único sem base comparável.' },
    { title: 'Propina', text: 'Em Portugal, propina é a taxa de frequência do curso. A classificação como estudante internacional afeta o valor cobrado; verifique seu enquadramento e a tabela do programa antes de fazer o orçamento.', source: PORTUGAL_SOURCES.international },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Diferencie propina, bolsa e desconto', intro: 'Ser brasileiro ou usar a nota do Enem não concede financiamento automaticamente.', blocks: [
    { title: 'Exemplo: Faculdade de Ciências, 2026/2027', text: 'A propina anual informada para estudante internacional de licenciatura é €3.500. Esse valor pertence à faculdade e ao ano indicados; confira o curso antes de montar seu orçamento.', source: PORTUGAL_SOURCES.sciencesFees, link: { label: 'Ver as propinas da Faculdade de Ciências', url: PORTUGAL_SOURCES.sciencesFees.url } },
    { title: 'Exemplo: ISEG, 2026/2027', text: 'A tabela para novos estudantes internacionais de licenciatura informa €7.500 no primeiro ano. A diferença entre os dois exemplos mostra por que é necessário consultar a propina do curso específico.', source: PORTUGAL_SOURCES.isegFees, link: { label: 'Ver as propinas do ISEG', url: PORTUGAL_SOURCES.isegFees.url } },
    { title: 'Bolsas da instituição', text: 'Consulte o setor de apoio ao estudante da universidade para saber se há bolsa, desconto ou parcelamento aplicável ao seu curso e à sua situação. Confira cobertura, requisitos e prazo no edital.' },
    { title: 'Erasmus Mundus', text: 'Alguns mestrados conjuntos oferecem bolsas a candidatos de todo o mundo. Só considere essa rota para Portugal quando a universidade portuguesa fizer parte do consórcio ou do percurso do programa escolhido.', source: PORTUGAL_SOURCES.erasmus, link: { label: 'Pesquisar mestrados conjuntos', url: PORTUGAL_SOURCES.erasmus.url } },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare cursos antes de decidir', intro: 'As instituições abaixo são pontos de partida, sem ordem de ranking.', blocks: [
    { title: 'Universidade de Coimbra', text: 'Consulte idioma, requisitos, candidatura e propinas na página do curso.', source: PORTUGAL_SOURCES.universityCoimbra, link: { label: 'Explorar a Universidade de Coimbra', url: PORTUGAL_SOURCES.universityCoimbra.url } },
    { title: 'Universidade do Porto', text: 'Verifique o calendário e as condições específicas da faculdade desejada.', source: PORTUGAL_SOURCES.universityPorto, link: { label: 'Explorar a Universidade do Porto', url: PORTUGAL_SOURCES.universityPorto.url } },
    { title: 'Universidade de Lisboa', text: 'Compare cursos, propinas e critérios de estudante internacional.', source: PORTUGAL_SOURCES.universityLisbon, link: { label: 'Explorar a Universidade de Lisboa', url: PORTUGAL_SOURCES.universityLisbon.url } },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Conheça a vida local e encontre apoio', intro: 'O idioma em comum não elimina diferenças de rotina e de procedimentos.', blocks: [
    { title: 'Brasileiros em Portugal', text: 'O relatório oficial da AIMA registrou 484.596 residentes de nacionalidade brasileira em 2024. A AIMA já publicou a edição de 2025; consulte-a para dados mais recentes e lembre que esse total não corresponde apenas a estudantes.', source: PORTUGAL_SOURCES.brazilPopulation, link: { label: 'Consultar os relatórios da AIMA', url: PORTUGAL_SOURCES.migrationReports.url } },
    { title: 'Cultura', text: 'O fado foi inscrito pela UNESCO como Patrimônio Cultural Imaterial da Humanidade em 2011. Explore também a vida cultural da cidade onde pretende estudar.', source: PORTUGAL_SOURCES.fado },
    { title: 'Apoio consular', text: 'Procure a equipe internacional da universidade e a representação brasileira responsável por sua região.', source: PORTUGAL_SOURCES.consular, link: { label: 'Acessar o e-Consular', url: PORTUGAL_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Anote as fases de candidatura', intro: 'Não há uma data única para todos os cursos ou universidades.', blocks: [
    { title: 'Ano letivo', text: 'Muitos cursos organizam o ano em dois semestres com início no segundo semestre do ano civil. Confirme matrícula, aulas e avaliações no calendário oficial da instituição.' },
    { title: 'Concurso internacional e Enem', text: 'Cada instituição define fases, vagas e critérios do concurso para estudantes internacionais. O uso da nota do Enem também depende do acordo vigente e das regras locais.', source: PORTUGAL_SOURCES.enem },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Prepare a candidatura ao programa', intro: 'O edital da instituição determina documentos, pesos e prazos.', blocks: [
    { title: '1. Verifique o enquadramento', text: 'Leia o Estatuto do Estudante Internacional e confirme com a universidade qual concurso e qual propina se aplicam à sua situação. Residência e outros vínculos podem alterar o enquadramento.', source: PORTUGAL_SOURCES.international },
    { title: '2. Confira o Enem', text: 'O Inep mantém a lista de instituições portuguesas com acordo para usar resultados do Enem. Cada instituição define notas, pesos e regras; o acordo não prevê financiamento estudantil brasileiro.', source: PORTUGAL_SOURCES.enem, link: { label: 'Ver a lista do Enem Portugal', url: PORTUGAL_SOURCES.enem.url } },
    { title: '3. Organize os documentos', text: 'Separe histórico, comprovante de conclusão, resultados de exame e traduções apenas conforme o edital. Guarde comprovantes do envio e da admissão.' },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada e permanência', title: 'Confirme a rota migratória para estudar', intro: 'A duração do curso e a sua situação determinam o procedimento.', blocks: [
    { title: 'Visto de residência', text: 'Para estudos superiores de longa duração, consulte a representação portuguesa responsável e a orientação oficial sobre visto de residência. O serviço gov.pt alerta que a página pode estar desatualizada; confirme os documentos e prazos no portal consular antes de solicitar.', source: PORTUGAL_SOURCES.visa, link: { label: 'Ver a orientação de visto', url: PORTUGAL_SOURCES.visa.url } },
    { title: 'Autorização de residência', text: 'A AIMA informa os requisitos para estudantes do ensino superior aceitos em instituição portuguesa, incluindo admissão e recursos suficientes. Confirme a etapa aplicável ao seu caso após a entrada.', source: PORTUGAL_SOURCES.residence, link: { label: 'Consultar a AIMA', url: PORTUGAL_SOURCES.residence.url } },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Verifique seus direitos antes de trabalhar', intro: 'A atividade deve ser compatível com a autorização de residência e com os estudos.', blocks: [
    { title: 'Atividade complementar', text: 'Segundo a AIMA, titulares de autorização de residência para estudo no ensino superior podem exercer atividade profissional subordinada ou independente, complementar aos estudos. A página consultada não informa um limite geral de 20 horas semanais; confirme as condições do seu título com a AIMA.', source: PORTUGAL_SOURCES.residence },
    { title: 'Planejamento', text: 'Não trate uma renda de trabalho ainda não obtida como financiamento garantido. Verifique contrato, obrigações fiscais e eventual impacto sobre bolsa ou carga acadêmica antes de aceitar uma vaga.' },
    { title: 'Depois do curso', text: 'A permanência após a conclusão depende da situação migratória e das regras vigentes. Consulte a AIMA antes do vencimento do seu título; este guia não presume um período automático para procurar emprego.', source: PORTUGAL_SOURCES.residence },
  ] },
]
