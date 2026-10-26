export type CanadaSource = { label: string; url: string; verifiedAt: string }
export type CanadaBlock = {
  title: string
  text: string
  note?: string
  source?: CanadaSource
  link?: { label: string; url: string }
}
export type CanadaSection = {
  id: string
  tab: string
  kicker: string
  title: string
  intro: string
  blocks: readonly CanadaBlock[]
}

const verifiedAt = '2026-10-26'

export const CANADA_SOURCES = {
  population: { label: 'Statistics Canada · População em 1.º de abril de 2026', url: 'https://www150.statcan.gc.ca/n1/daily-quotidien/260617/dq260617a-eng.htm', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  languages: { label: 'Statistics Canada · Idiomas no Censo 2021', url: 'https://www150.statcan.gc.ca/n1/daily-quotidien/220817/dq220817a-eng.htm', verifiedAt },
  finances: { label: 'IRCC · Comprovação financeira para a permissão de estudo', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html', verifiedAt },
  pal: { label: 'IRCC · Carta de atestação provincial ou territorial', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html', verifiedAt },
  pearson: { label: 'University of Toronto · Lester B. Pearson Scholarship', url: 'https://future.utoronto.ca/pearson-scholarships', verifiedAt },
  waterloo: { label: 'University of Waterloo · Bolsas internacionais', url: 'https://uwaterloo.ca/future-students/financing/international-scholarships', verifiedAt },
  vanier: { label: 'Governo do Canadá · Vanier', url: 'https://vanier.gc.ca/en/home-accueil.html', verifiedAt },
  doctoral: { label: 'NSERC · Canada Graduate Research Scholarship – Doctoral', url: 'https://nserc.canada.ca/en/funding-opportunity/canada-graduate-research-scholarship-doctoral-program', verifiedAt },
  educanada: { label: 'EduCanada · Bolsas internacionais', url: 'https://www.educanada.ca/scholarships-bourses/index.aspx?lang=eng', verifiedAt },
  brazil: { label: 'Statistics Canada · Imigração latino-americana', url: 'https://www150.statcan.gc.ca/n1/pub/11-627-m/11-627-m2024042-eng.htm', verifiedAt },
  campusWork: { label: 'IRCC · Trabalho dentro do campus', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-on-campus.html', verifiedAt },
  offCampusWork: { label: 'IRCC · Trabalho fora do campus', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html', verifiedAt },
  pgwp: { label: 'IRCC · Elegibilidade para permissão após a graduação', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html', verifiedAt },
  pgwpDuration: { label: 'IRCC · Duração da permissão após a graduação', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html', verifiedAt },
} satisfies Record<string, CanadaSource>

export const CANADA_SECTIONS: readonly CanadaSection[] = [
  {
    id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Inglês ou francês: comece pelo curso',
    intro: 'O Canadá tem dois idiomas oficiais, mas o idioma de ensino depende da província e da instituição.',
    blocks: [
      { title: 'O que mostra o Censo 2021', text: 'O Statistics Canada informa 75,5% da população com inglês e 21,4% com francês como primeira língua oficial falada; 18,0% declararam conseguir conversar nas duas línguas. Em Quebec, o francês é predominante.', note: 'Primeira língua oficial falada não é o mesmo indicador que língua materna. Os percentuais do texto enviado foram ajustados à publicação oficial.', source: CANADA_SOURCES.languages },
      { title: 'Teste exigido pelo programa', text: 'A instituição define certificados e notas mínimas. Confira o idioma de ensino e as exigências do curso e da bolsa antes de pagar IELTS, TOEFL ou outro exame.' },
    ],
  },
  {
    id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'O inverno muda conforme a cidade',
    intro: 'A costa do Pacífico, as pradarias, o centro-leste e a costa atlântica têm condições climáticas bastante diferentes.',
    blocks: [
      { title: 'Escolha pela cidade', text: 'Vancouver costuma ter inverno mais ameno e úmido; Calgary apresenta maior amplitude térmica; Toronto e Montreal têm invernos frios com neve; Halifax recebe influência marítima.', note: 'São descrições gerais. Consulte as médias mensais e a previsão da cidade escolhida.' },
      { title: 'Inclua o inverno no orçamento', text: 'Casaco, botas impermeáveis, luvas e gorro podem representar um gasto de chegada. Pesquise recomendações locais antes de comprar no Brasil.' },
    ],
  },
  {
    id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Comprovação não é custo total',
    intro: 'Mensalidade, passagem e manutenção precisam caber no seu planejamento sem depender de trabalho futuro.',
    blocks: [
      { title: 'CAD 23.448 para uma pessoa', text: 'Para pedidos de permissão de estudo feitos a partir de 1.º de setembro de 2026, o IRCC exige esse valor de referência para um ano de despesas de vida fora de Quebec. Mensalidade e transporte são adicionais.', note: 'Valor em dólares canadenses por ano para uma pessoa, consultado em 26/10/2026. Famílias e Quebec seguem valores próprios.', source: CANADA_SOURCES.finances },
      { title: 'Como comprovar', text: 'O IRCC aceita diferentes documentos financeiros. Um Guaranteed Investment Certificate (GIC) é uma opção, não uma obrigação universal. Confira a lista e as condições na solicitação.', source: CANADA_SOURCES.finances },
      { title: 'Faça um orçamento da instituição', text: 'Compare moradia, alimentação, transporte, seguro, materiais e roupas de inverno. As universidades costumam publicar estimativas para a própria cidade; confira o ano e a moeda.' },
    ],
  },
  {
    id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Confirme a chamada antes de contar com a bolsa',
    intro: 'Elegibilidade, benefícios e prazos mudam conforme a universidade, o nível de estudos e o ano de ingresso.',
    blocks: [
      { title: 'Lester B. Pearson · University of Toronto', text: 'Bolsa para ingresso na graduação que cobre mensalidade, livros, taxas e moradia por quatro anos. A candidatura exige indicação da escola. Para ingresso em setembro de 2027, a universidade publicou prazos de outubro e novembro de 2026.', note: 'Confira a página oficial para saber qual etapa ainda está aberta e se sua escola pode indicar.', source: CANADA_SOURCES.pearson },
      { title: 'University of Waterloo', text: 'A universidade lista uma bolsa de entrada de CAD 10.000 para estudantes internacionais e outras oportunidades por faculdade. Matemática e Ciências têm valores e processos próprios.', note: 'Valores são em dólares canadenses e variam conforme programa e edital; algumas bolsas exigem candidatura específica.', source: CANADA_SOURCES.waterloo },
      { title: 'Vanier não recebe novas candidaturas', text: 'Embora a antiga Vanier oferecesse CAD 50.000 por ano durante três anos, a página oficial informa que o programa deixou de receber inscrições. Consulte o programa doutoral que o substituiu.', source: CANADA_SOURCES.vanier, link: { label: 'Ver a bolsa doutoral atual', url: CANADA_SOURCES.doctoral.url } },
      { title: 'Doutorado: verifique a condição de estrangeiro', text: 'A Canada Graduate Research Scholarship – Doctoral admite candidatos internacionais sob condições: é preciso já estar matriculado em um doutorado elegível no Canadá no prazo da candidatura; até 15% das bolsas podem ir a estrangeiros.', source: CANADA_SOURCES.doctoral },
      { title: 'Busca oficial de outras bolsas', text: 'O EduCanada reúne oportunidades internacionais. Use o filtro adequado e leia o edital de cada resultado; o portal não garante elegibilidade para qualquer candidato brasileiro.', source: CANADA_SOURCES.educanada, link: { label: 'Pesquisar no EduCanada', url: CANADA_SOURCES.educanada.url } },
    ],
  },
  {
    id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare cursos, não só nomes',
    intro: 'Rankings mudam a cada edição. O melhor ponto de partida é o programa que atende seu objetivo, idioma e orçamento.',
    blocks: [
      { title: 'Instituições para pesquisar', text: 'McGill, McMaster, Simon Fraser, Toronto Metropolitan, University of Alberta, University of Calgary, University of Toronto, University of British Columbia e University of Waterloo são exemplos, em ordem alfabética, não um ranking.' },
      { title: 'Critérios de escolha', text: 'Verifique grade curricular, reconhecimento do diploma, idioma, custos para estrangeiros, suporte estudantil, financiamento e se o programa é elegível ao PGWP, quando isso importar para você.', source: CANADA_SOURCES.pgwp },
    ],
  },
  {
    id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Encontre apoio e conheça a região',
    intro: 'Serviços da universidade e canais consulares ajudam na chegada. Regras compartilhadas em grupos podem estar desatualizadas.',
    blocks: [
      { title: 'Brasileiros no Canadá', text: 'Um recorte do Censo 2021 identificou cerca de 20.400 imigrantes nascidos no Brasil. Esse número não representa todas as pessoas de origem brasileira ou uma estimativa atual de residentes.', source: CANADA_SOURCES.brazil },
      { title: 'Onde buscar ajuda', text: 'Procure o escritório internacional da instituição e os canais oficiais da embaixada brasileira em Ottawa ou dos consulados em Toronto, Montreal e Vancouver.' },
      { title: 'Costumes e cotidiano', text: 'Pontualidade e cortesia ajudam na convivência. Feriados e atividades de inverno variam por província; confira eventos e serviços locais, especialmente em Quebec.' },
    ],
  },
  {
    id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Planeje pelo ano de ingresso',
    intro: 'Muitas instituições iniciam o ano em setembro, com semestre de outono e semestre de inverno. Há exceções e períodos de verão.',
    blocks: [
      { title: 'Não existe prazo único', text: 'Anote separadamente datas do curso, bolsa, exame de idioma, avaliação de diploma e permissão de estudo. Candidatos internacionais podem ter prazos anteriores aos demais.' },
      { title: 'Organize com antecedência', text: 'Pesquisar cursos e idioma cerca de 12 a 15 meses antes é uma sugestão de planejamento, não um prazo oficial. Reserve tempo para carta de aceitação, documentos e possíveis exigências provinciais.', source: CANADA_SOURCES.pal },
    ],
  },
  {
    id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Transforme a pesquisa em candidatura',
    intro: 'Uma sequência simples ajuda a não misturar exigências da universidade, da bolsa e da imigração.',
    blocks: [
      { title: '1. Escolha o programa', text: 'Defina nível, área e província. Confirme idioma, duração, mensalidade, critérios acadêmicos e se a instituição é uma Designated Learning Institution (DLI).' },
      { title: '2. Reúna o que o edital pede', text: 'Histórico, diploma, prova de idioma, currículo, carta de motivação e recomendações são comuns. Pesquisa ou avaliação de diploma podem ser exigidas em alguns casos.' },
      { title: '3. Prepare financiamento e permissão', text: 'Compare bolsas e orçamento real. Verifique documentos de recursos, carta de aceitação e a necessidade de PAL/TAL ou, para Quebec, CAQ.', source: CANADA_SOURCES.pal },
      { title: '4. Revise antes de enviar', text: 'Adapte os documentos ao programa, confira datas no fuso indicado, envie dentro do prazo e guarde comprovantes.' },
    ],
  },
  {
    id: 'visto', tab: 'Permissão', kicker: '09 · Imigração', title: 'Confira as regras antes de solicitar',
    intro: 'A permissão de estudo tem exigências federais e, em alguns casos, provinciais.',
    blocks: [
      { title: 'PAL/TAL e CAQ', text: 'A maioria dos candidatos precisa de carta de atestação provincial ou territorial. Desde 1.º de janeiro de 2026, certos mestrados e doutorados com concessão de diploma em instituição pública têm isenção. Para Quebec, confira o CAQ e a atestação correspondente.', note: 'Isenções dependem do programa e da situação individual; confirme no IRCC antes de enviar o pedido.', source: CANADA_SOURCES.pal },
      { title: 'Fundos disponíveis', text: 'O IRCC exige recursos suficientes para mensalidade, manutenção e viagem. Não conte apenas com renda de um futuro emprego estudantil para cumprir o requisito.', source: CANADA_SOURCES.finances },
    ],
  },
  {
    id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante e após o curso', title: 'Trabalho tem condições específicas',
    intro: 'Direitos de trabalho dependem do programa, da instituição, da permissão e da fase dos estudos.',
    blocks: [
      { title: 'Dentro do campus', text: 'Não há limite semanal específico para quem cumpre os requisitos do IRCC. Verifique se sua permissão, matrícula e local de trabalho permitem a atividade.', source: CANADA_SOURCES.campusWork },
      { title: 'Fora do campus', text: 'Em regra, até 24 horas por semana durante as aulas e horas ilimitadas nas pausas programadas. É necessário atender às condições do IRCC, inclusive matrícula elegível e Social Insurance Number (SIN). Cursos exclusivamente de inglês ou francês como segunda língua não dão automaticamente esse direito.', note: 'Não é permitido trabalhar antes de o curso começar. Acompanhe suas horas para não violar a permissão.', source: CANADA_SOURCES.offCampusWork },
      { title: 'Depois da graduação: PGWP', text: 'A permissão pós-graduação exige instituição e programa elegíveis, em geral com pelo menos oito meses, e pedido em até 180 dias após a conclusão. Há requisitos de idioma e, para certos programas, de área de estudo.', note: 'CLB/NCLC 7 para diplomas universitários; CLB/NCLC 5 para muitos programas não universitários. A duração da permissão varia conforme curso e outras condições.', source: CANADA_SOURCES.pgwp, link: { label: 'Ver como a duração é definida', url: CANADA_SOURCES.pgwpDuration.url } },
      { title: 'Salário mínimo', text: 'A referência muda por província e pode mudar com o tempo. Consulte o governo provincial e o contrato da vaga, em vez de usar uma média nacional.' },
    ],
  },
]
