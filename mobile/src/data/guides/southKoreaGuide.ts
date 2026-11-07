export type KoreaSource = { label: string; url: string; verifiedAt: string }
export type KoreaBlock = { title: string; text: string; note?: string; source?: KoreaSource; link?: { label: string; url: string } }
export type KoreaSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly KoreaBlock[] }

const verifiedAt = '2026-10-26'

export const KOREA_SOURCES = {
  population: { label: 'Ministério de Dados e Estatísticas · Censo 2025', url: 'https://mods.go.kr/board.es?act=view&bid=11739&list_no=446724&mid=a20108070000', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  topik: { label: 'Study in Korea · TOPIK e níveis', url: 'https://cdn.studyinkorea.go.kr/ko/community/qnaList.do', verifiedAt },
  scholarship: { label: 'Study in Korea · Bolsa Global Korea Scholarship', url: 'https://www.studyinkorea.go.kr/swb/plan/scholarship.do?tab=gks-tab1', verifiedAt },
  gks2026: { label: 'Study in Korea · Edital GKS-G 2026', url: 'https://www.studyinkorea.go.kr/ko/notice/scholarshipsRead.do?bbsId=BBSMSTR_000000000461&nttId=4420', verifiedAt },
  gksBrazil: { label: 'Embaixada da Coreia no Brasil · GKS-G 2026', url: 'https://overseas.mofa.go.kr/br-pt/brd/m_22116/view.do?seq=761279', verifiedAt },
  visa: { label: 'Study in Korea · Tipos de visto de estudo', url: 'https://studyinkorea.go.kr/en/plan/visaAndStay.do', verifiedAt },
  visaBrazil: { label: 'Consulado da Coreia em São Paulo · Visto D-2', url: 'https://overseas.mofa.go.kr/br-saopaulo-pt/brd/m_24319/view.do?page=1&seq=3', verifiedAt },
  work: { label: 'Study in Korea · Trabalho de estudantes', url: 'https://studyinkorea.go.kr/ko/work/aboutForeignerEmploymentSystem.do', verifiedAt },
  minimumWage: { label: 'Ministério do Emprego e Trabalho · Salário mínimo de 2026', url: 'https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144&pageUnit=10', verifiedAt },
} satisfies Record<string, KoreaSource>

export const KOREA_SECTIONS: readonly KoreaSection[] = [
  {
    id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Coreano ou inglês: siga o curso',
    intro: 'O coreano usa o alfabeto hangul. Alguns cursos são ministrados em inglês, mas cada programa define sua própria prova e nota.',
    blocks: [
      { title: 'Entenda o TOPIK', text: 'O Test of Proficiency in Korean (TOPIK) mede proficiência em coreano. TOPIK I corresponde aos níveis 1 e 2; TOPIK II, aos níveis 3 a 6. Consulte a universidade para saber o nível exigido e o portal do exame para o calendário atual.', source: KOREA_SOURCES.topik, link: { label: 'Consultar o TOPIK', url: 'https://www.topik.go.kr/' } },
      { title: 'Programas em inglês', text: 'A oferta e os certificados aceitos variam por instituição e curso. Verifique na página de admissão se IELTS, TOEFL ou outra comprovação é exigida; não há uma pontuação única para o país.' },
    ],
  },
  {
    id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Prepare-se para quatro estações',
    intro: 'O inverno pode ser frio e seco; o verão, quente e úmido, com chuvas sazonais.',
    blocks: [
      { title: 'Escolha pela cidade', text: 'Seul, Busan e outras cidades têm condições diferentes. Consulte as médias mensais da Agência Meteorológica da Coreia antes de planejar roupa, moradia e deslocamentos.', link: { label: 'Consultar o serviço meteorológico', url: 'https://www.weather.go.kr/' } },
      { title: 'Custos de adaptação', text: 'Roupas de inverno e gastos com aquecimento podem pesar na chegada. Inclua esses itens no orçamento da cidade escolhida.' },
    ],
  },
  {
    id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Calcule na moeda e na cidade do curso',
    intro: 'O won sul-coreano (KRW) é a moeda local. Moradia e mensalidade mudam conforme a universidade e a região.',
    blocks: [
      { title: 'Use valores da instituição', text: 'Consulte mensalidade, dormitório, seguro, refeições e transporte no site oficial do curso. Registre o ano e o período de cada valor para comparar propostas.' },
      { title: 'Planeje sem renda futura', text: 'Inclua passagem, documentos, instalação e uma reserva. A possibilidade de trabalho durante o curso depende de autorização e limites específicos; não a use como única fonte de manutenção.', source: KOREA_SOURCES.work },
    ],
  },
  {
    id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'A GKS tem editais e canais distintos',
    intro: 'A Global Korea Scholarship (GKS) é administrada pelo NIIED. Confira a edição, o nível e o canal antes de preparar a candidatura.',
    blocks: [
      { title: 'O que a GKS pode cobrir', text: 'O portal governamental lista passagem, apoio mensal, treinamento de idioma coreano, mensalidade e seguro médico entre os benefícios dos programas GKS. Valores e condições dependem da modalidade e do edital.', source: KOREA_SOURCES.scholarship },
      { title: 'Pós-graduação 2026', text: 'O edital GKS-G 2026 previa candidaturas pela embaixada do país de cidadania ou diretamente por uma universidade designada. Consulte seus anexos para cobertura, requisitos e documentos da edição.', note: 'Os valores de ₩900.000 mensais e bônus descritos em materiais antigos não foram usados como referência para 2026.', source: KOREA_SOURCES.gks2026, link: { label: 'Ler o edital GKS-G 2026', url: KOREA_SOURCES.gks2026.url } },
      { title: 'Canal brasileiro', text: 'Na seleção GKS-G 2026 via Embaixada da Coreia no Brasil, a inscrição on-line ocorreu de 3 a 25/02/2026, às 18h no horário da Coreia. Esse prazo já terminou; acompanhe o próximo anúncio oficial.', source: KOREA_SOURCES.gksBrazil },
      { title: 'Bolsas de universidades', text: 'Instituições como KAIST e Seoul National University podem divulgar financiamentos próprios. Verifique diretamente cada edital, pois cobertura, elegibilidade e prazos variam.' },
    ],
  },
  {
    id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare programas, não só posições',
    intro: 'Rankings usam metodologias e anos diferentes. O programa precisa fazer sentido para sua área, idioma e orçamento.',
    blocks: [
      { title: 'Onde começar a pesquisa', text: 'KAIST, Korea University, Seoul National University, Sungkyunkwan e Yonsei são exemplos de instituições, em ordem alfabética, não um ranking.' },
      { title: 'Critérios de escolha', text: 'Compare currículo, idioma de ensino, laboratório ou área de pesquisa, cidade, mensalidade, possibilidade de bolsa e apoio a estudantes estrangeiros.' },
    ],
  },
  {
    id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Conheça a rotina e sua rede de apoio',
    intro: 'O escritório internacional da universidade é um ponto de partida para dúvidas sobre chegada, moradia e documentação.',
    blocks: [
      { title: 'Vida estudantil', text: 'K-pop, séries e culinária podem ser portas de entrada para a cultura. Ritmo de estudos e relações sociais variam por pessoa, curso e instituição; evite tomar generalizações como regra.' },
      { title: 'Apoio brasileiro', text: 'Guarde os contatos da Embaixada do Brasil em Seul e confirme serviços e horários no portal do Itamaraty. Não há um número oficial de brasileiros residentes usado neste guia.', link: { label: 'Consultar o Itamaraty', url: 'https://www.gov.br/mre/pt-br/embaixada-seul' } },
    ],
  },
  {
    id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Organize curso, bolsa e visto separadamente',
    intro: 'Muitas universidades têm semestres iniciados em março e setembro, mas cada programa publica seu calendário.',
    blocks: [
      { title: 'Não há prazo único', text: 'Anote o fechamento do curso e da bolsa, a validade do exame de idioma e o tempo necessário para visto. Confirme o fuso horário indicado em cada edital.' },
      { title: 'Antecipe a preparação', text: 'Pesquisar programas cerca de um ano antes é uma sugestão de planejamento. Reserve tempo para traduções, comprovação de idioma, recomendações e, quando exigido, contato com orientador.' },
    ],
  },
  {
    id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Transforme a pesquisa em candidatura',
    intro: 'Os documentos da universidade, da bolsa e do visto têm finalidades diferentes.',
    blocks: [
      { title: '1. Defina o curso', text: 'Escolha nível, área, idioma e instituição. Leia a página de admissão e confirme se aceita candidatos internacionais naquele ingresso.' },
      { title: '2. Revise idioma e financiamento', text: 'Verifique TOPIK ou prova de inglês, custos e edital da bolsa. Para GKS, consulte o canal da embaixada ou da universidade designada e as regras do ano de candidatura.', source: KOREA_SOURCES.gks2026 },
      { title: '3. Separe documentos', text: 'Histórico, diploma, prova de idioma, plano de estudos e cartas podem ser pedidos. Use a lista do programa escolhido para traduções, autenticações e formato dos arquivos.' },
      { title: '4. Confira antes de enviar', text: 'Revise nomes, datas, fuso, anexos e confirmação de recebimento. Depois da admissão, siga a orientação consular para o visto adequado.', source: KOREA_SOURCES.visa },
    ],
  },
  {
    id: 'visto', tab: 'Visto', kicker: '09 · Entrada e residência', title: 'O tipo de curso define o visto',
    intro: 'Use a orientação consular referente ao seu local de residência no Brasil.',
    blocks: [
      { title: 'D-2 e D-4', text: 'O Study in Korea indica D-2 para cursos regulares de graduação e pós-graduação e D-4 para programas sem diploma, como treinamento de idioma. Confirme a subcategoria do seu caso.', source: KOREA_SOURCES.visa },
      { title: 'Exigências no Brasil', text: 'O Consulado da Coreia em São Paulo publicou a documentação para D-2, incluindo carta de admissão e comprovantes conforme a modalidade. Estudantes que permanecerem por mais de 90 dias devem solicitar o cartão de registro de residência em até 90 dias após a chegada.', note: 'Procedimentos e jurisdição consular variam. Consulte o consulado responsável antes de agendar ou pagar taxas.', source: KOREA_SOURCES.visaBrazil },
    ],
  },
  {
    id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante o curso', title: 'Peça autorização antes de começar',
    intro: 'A permissão de trabalho de meio período depende do visto, do curso, do idioma e da imigração local.',
    blocks: [
      { title: 'Autorização é necessária', text: 'O portal governamental informa que estudantes D-2 ou D-4 precisam cumprir requisitos de proficiência e obter permissão da imigração local para trabalhar meio período. Consulte também o escritório internacional da universidade.', source: KOREA_SOURCES.work },
      { title: 'Horas mudam conforme o perfil', text: 'A tabela oficial mostra limites diferentes para graduação e pós-graduação, ano do curso, nível de coreano e desempenho. Por exemplo, quem não cumpre o nível linguístico exigido pode ter limite de 10 ou 15 horas em dias úteis; as condições ampliadas dependem dos critérios indicados no portal.', note: 'Não use um limite único de horas para todos os estudantes. Confira sua situação antes de aceitar uma vaga.', source: KOREA_SOURCES.work },
      { title: 'Referência salarial de 2026', text: 'O salário mínimo nacional para 2026 é de ₩10.320 por hora. O equivalente mensal divulgado pelo governo é ₩2.156.880 para uma jornada de referência de 209 horas, não a renda esperada de um estudante com jornada limitada.', source: KOREA_SOURCES.minimumWage },
    ],
  },
]
