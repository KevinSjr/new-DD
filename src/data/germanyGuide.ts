export type GermanySource = {
  label: string
  url: string
  verifiedAt: string
}

export type GermanyBlock = {
  title: string
  text: string
  items?: readonly string[]
  note?: string
  source?: GermanySource
  link?: { label: string; url: string }
}

export type GermanySection = {
  id: string
  tab: string
  kicker: string
  title: string
  intro: string
  blocks: readonly GermanyBlock[]
}

const verifiedAt = '2026-10-18'

export const GERMANY_SOURCES = {
  daadRequirements: {
    label: 'DAAD · Requisitos para estudar',
    url: 'https://www.daad.de/en/studying-in-germany/requirements/overview/',
    verifiedAt,
  },
  daadLanguage: {
    label: 'DAAD · O idioma alemão',
    url: 'https://www.daad.de/en/studying-in-germany/living-in-germany/german-language/',
    verifiedAt,
  },
  daadCosts: {
    label: 'DAAD · Custos de estudo e vida',
    url: 'https://www.daad.de/en/studying-in-germany/living-in-germany/finances/',
    verifiedAt,
  },
  daadScholarships: {
    label: 'DAAD · Bolsas de estudo',
    url: 'https://www.daad.de/en/studying-in-germany/scholarships/daad-scholarships/',
    verifiedAt,
  },
  funding: {
    label: 'DAAD · Outras formas de financiamento',
    url: 'https://www.daad.de/en/studying-in-germany/scholarships/funding-options/',
    verifiedAt,
  },
  germanyScholarship: {
    label: 'Portal federal · Deutschlandstipendium',
    url: 'https://verwaltung.bund.de/leistungsverzeichnis/en/leistung/99061013017000/herausgeber/BY-99462/region/090000000000',
    verifiedAt,
  },
  visa: {
    label: 'Make it in Germany · Visto de estudo',
    url: 'https://www.make-it-in-germany.com/en/visa-residence/types/studying',
    verifiedAt,
  },
  work: {
    label: 'Make it in Germany · Estudo e trabalho',
    url: 'https://www.make-it-in-germany.com/en/study-vocational-training/studies-in-germany/work',
    verifiedAt,
  },
  afterStudies: {
    label: 'Make it in Germany · Após a graduação',
    url: 'https://www.make-it-in-germany.com/en/study-vocational-training/studies-in-germany/prospects-after',
    verifiedAt,
  },
  tum: {
    label: 'TUM · Cursos e estudos',
    url: 'https://www.tum.de/en/studies',
    verifiedAt,
  },
  lmu: {
    label: 'LMU Munich · Site oficial',
    url: 'https://www.lmu.de/en/index.html',
    verifiedAt,
  },
  heidelberg: {
    label: 'Heidelberg University · Site oficial',
    url: 'https://www.uni-heidelberg.de/en',
    verifiedAt,
  },
} satisfies Record<string, GermanySource>

export const GERMANY_SECTIONS: readonly GermanySection[] = [
  {
    id: 'idioma',
    tab: 'Idioma',
    kicker: '01 · Comunicação',
    title: 'O idioma abre caminhos',
    intro: 'O alemão ajuda na vida cotidiana e é a língua de ensino de muitos cursos. Há programas internacionais ministrados em inglês, especialmente na pós-graduação.',
    blocks: [
      {
        title: 'Cursos em alemão',
        text: 'A instituição define o nível e os certificados aceitos. TestDaF e DSH são caminhos frequentes; alguns cursos também aceitam certificados do Goethe-Institut.',
        note: 'B2 ou C1 podem aparecer nos requisitos, mas não são uma regra para todos os cursos.',
        source: GERMANY_SOURCES.daadLanguage,
      },
      {
        title: 'Cursos em inglês',
        text: 'O programa pode pedir comprovação de inglês. Confira no curso desejado quais provas são aceitas, a pontuação mínima e a validade do resultado.',
        source: GERMANY_SOURCES.daadRequirements,
      },
      {
        title: 'Antes de pagar por um exame',
        text: 'Abra a página de admissão do curso e anote o idioma de ensino, o certificado exigido e o prazo de entrega. A exigência da bolsa pode ser diferente da exigência da universidade.',
      },
    ],
  },
  {
    id: 'clima',
    tab: 'Clima',
    kicker: '02 · Vida cotidiana',
    title: 'Prepare-se para as estações',
    intro: 'O clima muda conforme a região. Planejar roupas e deslocamentos ajuda a evitar despesas inesperadas no início da viagem.',
    blocks: [
      { title: 'Primavera e verão', text: 'Na primavera, a temperatura tende a subir de forma gradual. O verão traz dias mais longos, mas pode haver períodos chuvosos ou de calor.' },
      { title: 'Outono e inverno', text: 'No outono, os dias encurtam e esfriam. O inverno pode trazer geadas e neve em algumas regiões; isso não acontece da mesma forma em todas as cidades.' },
      { title: 'Inclua no orçamento', text: 'Considere casaco, calçados apropriados e itens para chuva. Procure informações climáticas da cidade de destino antes de comprar.' },
    ],
  },
  {
    id: 'custos',
    tab: 'Custos',
    kicker: '03 · Planejamento financeiro',
    title: 'Transforme valores em orçamento',
    intro: 'A cidade, a moradia e o curso fazem diferença. Use os valores abaixo como ponto de partida e refaça as contas para a sua situação.',
    blocks: [
      {
        title: 'Vida mensal: € 900 a € 1.200',
        text: 'Estimativa do DAAD para despesas de vida por mês. Moradia costuma ser a maior parcela e cidades com aluguéis altos podem ultrapassar essa faixa.',
        items: ['Moradia e alimentação', 'Transporte e seguro de saúde', 'Materiais, telefone, vestuário e imprevistos'],
        note: 'Estimativa em euros por mês, consultada em 18/10/2026. Não é uma garantia de custo individual.',
        source: GERMANY_SOURCES.daadCosts,
      },
      {
        title: 'Mensalidade não é a mesma coisa que contribuição semestral',
        text: 'Em geral, cursos de graduação e muitos mestrados de instituições públicas não cobram mensalidade. Ainda assim, há contribuição semestral e exceções conforme estado, universidade e programa.',
        note: 'Baden-Württemberg cobra mensalidade de muitos estudantes de fora da UE; instituições da Baviera também podem cobrar. Confira a página do curso.',
        source: GERMANY_SOURCES.daadCosts,
      },
      {
        title: 'Comprovação financeira para o visto',
        text: 'Em 2026, o portal oficial informa € 11.904 por ano como referência mínima para a conta bloqueada de estudante. Bolsas e outras formas de comprovação podem ser aceitas conforme o caso.',
        note: 'Esse é um requisito de comprovação, não uma estimativa suficiente para qualquer cidade. Confirme o valor e o procedimento na representação alemã responsável pela sua solicitação.',
        source: GERMANY_SOURCES.visa,
      },
    ],
  },
  {
    id: 'bolsas',
    tab: 'Bolsas',
    kicker: '04 · Financiamento',
    title: 'Encontre apoio que combina com seu plano',
    intro: 'Uma bolsa pode cobrir apenas parte das despesas. Leia o edital antes de contar com o benefício no orçamento.',
    blocks: [
      {
        title: 'DAAD',
        text: 'O Serviço Alemão de Intercâmbio Acadêmico reúne oportunidades para diferentes perfis. Muitas bolsas são voltadas principalmente a graduados, doutorandos e pesquisadores; financiamento de curso completo ou para ingressantes é excepcional.',
        items: ['Filtre por país de origem, nível e área.', 'Leia benefícios, documentos, idioma e prazo do programa específico.', 'Confira se brasileiros podem se candidatar.'],
        source: GERMANY_SOURCES.daadScholarships,
        link: { label: 'Pesquisar bolsas no DAAD', url: 'https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/' },
      },
      {
        title: 'Deutschlandstipendium',
        text: 'Programa de apoio de € 300 por mês para estudantes selecionados por universidades participantes. A inscrição, os critérios e o calendário são definidos pela instituição.',
        note: 'Valor de referência em 2026. Não significa elegibilidade ou concessão automática para estudantes internacionais.',
        source: GERMANY_SOURCES.germanyScholarship,
      },
      {
        title: 'Universidades e fundações',
        text: 'Outras organizações e universidades também oferecem financiamento. As condições variam por programa e podem considerar trajetória acadêmica, engajamento e circunstâncias pessoais.',
        source: GERMANY_SOURCES.funding,
      },
      {
        title: 'Erasmus+',
        text: 'Consulte a modalidade e os acordos da sua instituição antes de planejar uma candidatura. Não presuma acesso direto a uma bolsa para uma graduação completa.',
        link: { label: 'Conhecer o Erasmus+', url: 'https://erasmus-plus.ec.europa.eu/' },
      },
    ],
  },
  {
    id: 'universidades',
    tab: 'Universidades',
    kicker: '05 · Instituições',
    title: 'Escolha primeiro o curso',
    intro: 'Os exemplos abaixo servem para iniciar a pesquisa, não formam um ranking. Compare o programa, o idioma, os requisitos e o custo da cidade.',
    blocks: [
      { title: 'Technical University of Munich (TUM)', text: 'Explore cursos e critérios de admissão diretamente na instituição.', source: GERMANY_SOURCES.tum },
      { title: 'Ludwig-Maximilians-Universität München (LMU)', text: 'Consulte a oferta de cursos e as orientações para estudantes internacionais.', source: GERMANY_SOURCES.lmu },
      { title: 'Heidelberg University', text: 'Compare programas, idioma de ensino e etapas de candidatura.', source: GERMANY_SOURCES.heidelberg },
      { title: 'Critérios de comparação', text: 'Verifique grade curricular, reconhecimento dos estudos anteriores, idioma, taxas, bolsas, moradia e oportunidades de estágio ou pesquisa.', source: GERMANY_SOURCES.daadRequirements },
    ],
  },
  {
    id: 'comunidade',
    tab: 'Brasileiros',
    kicker: '06 · Rede de apoio',
    title: 'Encontre pessoas e serviços de apoio',
    intro: 'O contato com outras pessoas pode facilitar a adaptação. Para procedimentos oficiais, confirme sempre as regras na fonte responsável.',
    blocks: [
      {
        title: 'Onde começar',
        text: 'Procure o escritório internacional da universidade, serviços estudantis, associações locais, grupos de estudantes e representações consulares brasileiras.',
        items: ['Pergunte sobre moradia e orientação de chegada.', 'Busque eventos e grupos de integração.', 'Confirme vistos e documentos em canais oficiais.'],
      },
      { title: 'Informação comunitária exige checagem', text: 'Relatos pessoais ajudam a entender experiências possíveis, mas regras, prazos e custos podem ter mudado ou variar conforme a cidade e o tipo de autorização.' },
    ],
  },
  {
    id: 'cultura',
    tab: 'Cultura',
    kicker: '07 · Adaptação',
    title: 'Aprenda com o lugar e com as pessoas',
    intro: 'Costumes variam entre regiões, gerações e ambientes. Use estas ideias como pontos de observação, sem generalizar a experiência de todos.',
    blocks: [
      { title: 'Rotina e comunicação', text: 'Em contextos acadêmicos e profissionais, planeje chegar no horário e avise se houver atraso. Perguntar quando uma regra não estiver clara costuma ser o melhor caminho.' },
      { title: 'Vida na cidade', text: 'Conheça as orientações locais de reciclagem e transporte. Eventos estudantis, festivais regionais e mercados sazonais podem ajudar a descobrir a cidade.' },
      { title: 'Próximo passo', text: 'Antes da viagem, visite a página de boas-vindas da universidade e anote os serviços de apoio a estudantes internacionais.' },
    ],
  },
  {
    id: 'calendario',
    tab: 'Calendário',
    kicker: '08 · Datas importantes',
    title: 'Cada curso tem seu calendário',
    intro: 'O semestre de inverno e o de verão são referências gerais. Prazos de curso, bolsa, exame e visto precisam entrar no mesmo plano.',
    blocks: [
      { title: 'Semestre de inverno', text: 'Muitos programas começam no período de outono. A candidatura costuma ocorrer meses antes, conforme o curso e a instituição.' },
      { title: 'Semestre de verão', text: 'Alguns programas permitem ingresso na primavera; outros aceitam candidatos somente uma vez ao ano.' },
      {
        title: 'Monte seu calendário real',
        text: 'Anote a data publicada para o programa escolhido e verifique se candidatos internacionais têm prazo diferente.',
        items: ['Inscrição no curso e na bolsa', 'Exame de idioma e traduções', 'Cartas de recomendação', 'Envio de documentos e procedimentos consulares'],
        note: 'Não use 15 de janeiro ou 15 de julho como prazo universal.',
      },
    ],
  },
  {
    id: 'candidatura',
    tab: 'Candidatura',
    kicker: '09 · Plano de ação',
    title: 'Da pesquisa ao envio',
    intro: 'Organize uma candidatura por vez. As exigências finais pertencem ao curso, à bolsa e à autoridade responsável.',
    blocks: [
      {
        title: '1. Encontre uma oportunidade compatível',
        text: 'Defina nível, área e objetivo. Confira se o edital aceita sua nacionalidade, sua formação e sua etapa de estudos.',
        items: ['Pesquise no DAAD e na universidade.', 'Leia o edital inteiro.', 'Confira se brasileiros podem participar.'],
        source: GERMANY_SOURCES.funding,
      },
      {
        title: '2. Confirme a elegibilidade',
        text: 'Verifique nível de formação, área, idioma, desempenho exigido e necessidade de admissão universitária. Algumas bolsas são destinadas a quem já concluiu a graduação.',
        source: GERMANY_SOURCES.daadScholarships,
      },
      {
        title: '3. Reúna os documentos',
        text: 'Histórico, diploma, recomendações, identificação e formulários podem ser pedidos. Confira formatos, idiomas aceitos e necessidade de traduções certificadas.',
        source: GERMANY_SOURCES.daadRequirements,
      },
      {
        title: '4. Adapte o currículo e a carta',
        text: 'Organize formação, experiências, projetos e competências relevantes. Na carta, explique por que escolheu o programa e como ele se conecta aos seus objetivos. Use exemplos concretos e siga o formato pedido.',
        note: 'Fotografia no currículo não é uma regra universal. Evite dados pessoais desnecessários.',
      },
      {
        title: '5. Confira o idioma',
        text: 'Veja o exame aceito pelo curso e pela bolsa, a nota mínima, a validade do certificado e a data em que o resultado precisa estar pronto.',
        source: GERMANY_SOURCES.daadLanguage,
      },
      {
        title: '6. Planeje os prazos',
        text: 'Registre o prazo de cada programa com ano e fuso horário. Reserve tempo para recomendações, provas, traduções e procedimentos consulares.',
        note: 'Não use datas genéricas como prazo definitivo.',
      },
      {
        title: '7. Avalie o financiamento',
        text: 'Confirme se o benefício é mensal ou único, o que cobre, quanto dura e se existe condição para renovação. Compare o valor com as despesas da cidade.',
        source: GERMANY_SOURCES.funding,
      },
      {
        title: '8. Revise, envie e acompanhe',
        text: 'Confira o edital uma última vez, envie antes do prazo e guarde o comprovante. Se precisar de visto, separe também tempo para a comprovação financeira e os documentos exigidos.',
        source: GERMANY_SOURCES.visa,
      },
    ],
  },
  {
    id: 'trabalho',
    tab: 'Trabalho',
    kicker: '10 · Carreira',
    title: 'Trabalho pode complementar o plano',
    intro: 'As condições dependem da autorização de residência e da atividade. Não conte com um emprego futuro como única base financeira do visto.',
    blocks: [
      {
        title: 'Durante os estudos',
        text: 'Para estudantes de países terceiros, a regra geral permite até 140 dias completos ou 280 meios-dias por ano sem aprovação da Agência Federal de Emprego. Há alternativas e exceções previstas para certas atividades.',
        note: 'Confirme as condições da sua autorização antes de aceitar trabalho, estágio ou atividade autônoma.',
        source: GERMANY_SOURCES.work,
      },
      {
        title: 'Depois da conclusão',
        text: 'Graduados de países terceiros podem, se atenderem aos requisitos, solicitar autorização de residência por até 18 meses para procurar emprego qualificado.',
        note: 'A solicitação precisa ser feita em tempo hábil e não é automática. A autoridade competente decide cada caso.',
        source: GERMANY_SOURCES.afterStudies,
      },
      { title: 'Ao comparar vagas', text: 'Considere idioma, região, contrato e diferença entre salário bruto e líquido. Evite usar uma faixa salarial sem fonte e período de referência.' },
    ],
  },
]
