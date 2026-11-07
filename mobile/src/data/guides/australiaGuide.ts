export type AustraliaSource = { label: string; url: string; verifiedAt: string }
export type AustraliaBlock = {
  title: string
  text: string
  items?: readonly string[]
  note?: string
  source?: AustraliaSource
  link?: { label: string; url: string }
}
export type AustraliaSection = {
  id: string
  tab: string
  kicker: string
  title: string
  intro: string
  blocks: readonly AustraliaBlock[]
}

const verifiedAt = '2026-10-24'

export const AUSTRALIA_SOURCES = {
  population: { label: 'Australian Bureau of Statistics · População', url: 'https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/mar-2026', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  english: { label: 'Study Australia · Testes de inglês', url: 'https://www.studyaustralia.gov.au/en/plan-your-move/language-testing-organisations', verifiedAt },
  costs: { label: 'Study Australia · Custos de vida e educação', url: 'https://www.studyaustralia.gov.au/en/life-in-australia/living-and-education-costs', verifiedAt },
  visa: { label: 'Study Australia · Solicitação do visto', url: 'https://www.studyaustralia.gov.au/en/plan-your-move/visa-application-process', verifiedAt },
  visaRules: { label: 'Department of Home Affairs · Student visa (subclass 500)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500', verifiedAt },
  work: { label: 'Department of Home Affairs · Condição 8105', url: 'https://immi.homeaffairs.gov.au/visas/already-have-a-visa/check-visa-details-and-conditions/see-your-visa-conditions?cno=8105&product=500', verifiedAt },
  wages: { label: 'Fair Work Ombudsman · Salário mínimo', url: 'https://www.fairwork.gov.au/pay-and-wages/minimum-wages', verifiedAt },
  go8: { label: 'Group of Eight · Universidades membros', url: 'https://go8.edu.au/about', verifiedAt },
  awards: { label: 'DFAT · Países participantes do Australia Awards', url: 'https://www.dfat.gov.au/people-to-people/australia-awards/participating-countries', verifiedAt },
  unsw: { label: 'UNSW · Bolsas para estudantes internacionais', url: 'https://www.unsw.edu.au/study/your-future/international-scholarships', verifiedAt },
  brazil: { label: 'Australian Bureau of Statistics · Censo 2021', url: 'https://www.abs.gov.au/census/find-census-data/quickstats/2021/8203_AUS', verifiedAt },
} satisfies Record<string, AustraliaSource>

export const AUSTRALIA_SECTIONS: readonly AustraliaSection[] = [
  {
    id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Estude e viva em inglês',
    intro: 'O inglês é a língua predominante nas aulas e no cotidiano. O sotaque e algumas expressões locais podem exigir adaptação no início.',
    blocks: [
      { title: 'Inglês australiano', text: 'Expressões como “mate” (amigo), “arvo” (tarde) e “brekkie” (café da manhã) aparecem na conversa informal. Treinar a escuta com diferentes sotaques pode ajudar antes da viagem.' },
      { title: 'Certificação de idioma', text: 'IELTS, TOEFL e PTE Academic estão entre os testes possíveis. A aceitação e a nota mínima dependem do curso, da instituição e das regras do visto.', note: 'Confira a página de admissão antes de pagar por um exame; exigências de curso e bolsa podem ser diferentes.', source: AUSTRALIA_SOURCES.english },
    ],
  },
  {
    id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'O clima depende da cidade',
    intro: 'As estações são opostas às do hemisfério norte: verão de dezembro a fevereiro e inverno de junho a agosto. A Austrália reúne regiões muito diferentes.',
    blocks: [
      { title: 'Quatro paisagens climáticas', text: 'Darwin e Cairns têm clima tropical; Sydney e Melbourne, condições mais temperadas; Perth tem verões mais secos; o interior é em grande parte árido ou semiárido.', note: 'São descrições gerais. Consulte a previsão e o clima da sua cidade de destino.' },
      { title: 'O que levar', text: 'Planeje roupas para variações de temperatura e chuva, especialmente no sudeste. Inclua proteção solar na rotina ao ar livre.' },
    ],
  },
  {
    id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Faça as contas antes de escolher',
    intro: 'Moradia, alimentação, transporte, seguro-saúde e mensalidade variam muito por cidade, curso e estilo de vida.',
    blocks: [
      { title: 'AU$ 29.710 não é um orçamento universal', text: 'O Study Australia informa esse valor como referência mínima anual de capacidade financeira para a solicitação do visto de estudante. Custos reais podem ser maiores, e outras despesas, como mensalidade e viagem, precisam ser consideradas.', note: 'Valor em dólares australianos por ano, verificado em 24/10/2026. Confira a exigência vigente antes de solicitar o visto.', source: AUSTRALIA_SOURCES.visa },
      { title: 'Monte um orçamento da cidade', text: 'Compare residência estudantil, casa de família e moradia compartilhada. Inclua seguro-saúde, materiais e uma reserva para imprevistos. Cozinhar em casa e verificar benefícios estudantis podem ajudar.', source: AUSTRALIA_SOURCES.costs, link: { label: 'Abrir calculadora de custo de vida', url: 'https://costofliving.studyaustralia.gov.au/' } },
    ],
  },
  {
    id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Pesquise bolsas elegíveis para você',
    intro: 'Benefícios, nacionalidades aceitas, níveis de estudo e prazos são definidos em cada edital. Uma bolsa parcial não necessariamente cobre o custo de vida.',
    blocks: [
      { title: 'Bolsas de universidades', text: 'A UNSW apresenta, entre outras, a International Scientia Coursework Scholarship, a Australia’s Global University Award e a International Student Award. Modalidade, valor e elegibilidade precisam ser conferidos na chamada vigente.', note: 'A fonte lista opções de mensalidade integral ou AU$ 20.000 por ano, AU$ 10.000 por um ano e desconto de 20% para grupos elegíveis. Não há concessão automática.', source: AUSTRALIA_SOURCES.unsw, link: { label: 'Pesquisar bolsas da UNSW', url: 'https://www.unsw.edu.au/study/your-future/international-scholarships' } },
      { title: 'Atenção ao Australia Awards', text: 'O Brasil não aparece na lista atual de países participantes do Australia Awards Scholarships. Portanto, não conte com esse programa como opção para brasileiros sem uma mudança oficial de elegibilidade.', source: AUSTRALIA_SOURCES.awards },
      { title: 'Compare outras instituições', text: 'Sydney, Melbourne, Monash e ANU mantêm páginas próprias de bolsas. Pesquise por nível de estudo e nacionalidade e confira se o apoio cobre mensalidade, manutenção ou ambos.', note: 'Não existe um valor típico confiável para todas as bolsas.' },
    ],
  },
  {
    id: 'universidades', tab: 'Universidades', kicker: '05 · Educação', title: 'Escolha pelo curso, não só pelo nome',
    intro: 'Compare currículo, requisitos, campus, cidade, custo e oportunidades de pesquisa. Posições em rankings mudam de edição para edição.',
    blocks: [
      { title: 'Group of Eight', text: 'O grupo reúne ANU, University of Melbourne, University of Sydney, UNSW Sydney, University of Queensland, Monash University, University of Western Australia e Adelaide University.', note: 'Adelaide University é o nome atual do membro do Go8 desde a fusão de 2026.', source: AUSTRALIA_SOURCES.go8 },
      { title: 'Além do Go8', text: 'UTS, RMIT, Griffith e Macquarie também são pontos de partida para pesquisar cursos. Confira diretamente em cada universidade a oferta, o idioma, as taxas e os critérios de entrada.' },
    ],
  },
  {
    id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Encontre sua rede de apoio',
    intro: 'A universidade, os serviços estudantis e a comunidade local podem ajudar na chegada. Experiências pessoais não substituem informações oficiais.',
    blocks: [
      { title: 'Brasileiros na Austrália', text: 'O Censo de 2021 registrou 46.720 residentes nascidos no Brasil. O dado não representa todos os descendentes nem é uma estimativa atual da comunidade.', source: AUSTRALIA_SOURCES.brazil },
      { title: 'Cultura e convivência', text: 'Informalidade, pontualidade, atividades ao ar livre e esportes fazem parte de muitas experiências locais. Reconheça a diversidade do país e o respeito aos povos aborígenes e das ilhas do Estreito de Torres.', note: 'São referências gerais, não características de todas as pessoas.' },
      { title: 'Onde buscar ajuda', text: 'Comece pelo escritório internacional da universidade, grupos estudantis e representações consulares brasileiras. Confirme procedimentos de visto, moradia e trabalho nos canais responsáveis.' },
    ],
  },
  {
    id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Planeje pelo calendário do curso',
    intro: 'Muitas universidades trabalham com semestres de fevereiro/março a junho e de julho/agosto a novembro, mas há variações e cursos em trimestres.',
    blocks: [
      { title: 'Não existe prazo único', text: 'Registre separadamente as datas de inscrição no curso, bolsa, exame de inglês, envio de documentos e início das aulas. Estudantes internacionais podem ter prazos anteriores aos demais.' },
      { title: 'Da oferta ao visto', text: 'Após aceitar uma oferta e cumprir as condições da instituição, você recebe a Confirmation of Enrolment (CoE), necessária à solicitação do visto. Reserve tempo para a análise; confira requisitos e forma de aplicação atuais.', source: AUSTRALIA_SOURCES.visaRules },
    ],
  },
  {
    id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Organize uma candidatura real',
    intro: 'Use esta sequência como checklist inicial, ajustando-a às exigências do curso e de cada bolsa.',
    blocks: [
      { title: '1. Defina e compare', text: 'Escolha nível, área e cidade. Compare programa, mensalidade, orçamento, idioma e bolsas. Confirme se brasileiros e sua formação são aceitos.' },
      { title: '2. Prepare documentos', text: 'Histórico, diploma, comprovante de inglês, currículo e carta de motivação podem ser pedidos. Recomendações e proposta de pesquisa aparecem com frequência em algumas pós-graduações.', note: 'Tradução, formato, validade e quantidade de documentos dependem de cada edital.' },
      { title: '3. Revise e envie', text: 'Adapte carta e currículo ao programa, peça recomendações com antecedência e guarde comprovantes. Se houver entrevista, pratique explicar experiências relevantes em inglês.' },
    ],
  },
  {
    id: 'trabalho', tab: 'Trabalho', kicker: '09 · Regras do visto', title: 'Trabalho pode complementar, não substituir o plano',
    intro: 'As condições do visto de estudante (subclasse 500) definem quando e quanto se pode trabalhar.',
    blocks: [
      { title: 'Limite durante as aulas', text: 'Em regra, o limite é de 48 horas por quinzena enquanto o curso está em sessão. Nas férias programadas, o limite de horas não se aplica. Mestrandos por pesquisa e doutorandos têm exceção após o início do curso.', note: 'Em geral, não é permitido começar a trabalhar antes do início do curso. Há regras específicas para atividades obrigatórias e para quem tinha outro visto.', source: AUSTRALIA_SOURCES.work },
      { title: 'Salário mínimo nacional', text: 'Desde 1.º de julho de 2026, a referência nacional é AU$ 26,44 por hora ou AU$ 1.004,90 por semana, antes de impostos. Trabalho casual pode ter adicional; acordos e categorias profissionais podem estabelecer valores diferentes.', note: 'Valor de 2026, verificado em 24/10/2026. Não use o salário mínimo de 2025 para planejar o orçamento.', source: AUSTRALIA_SOURCES.wages },
      { title: 'Registros e proteção', text: 'Verifique como obter o Tax File Number (TFN); o ABN se aplica a certas atividades por conta própria. Mantenha registro das horas e consulte as condições do visto antes de aceitar trabalho ou estágio.', source: AUSTRALIA_SOURCES.work },
    ],
  },
]
