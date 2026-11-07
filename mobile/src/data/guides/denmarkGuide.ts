export type DenmarkSource = { label: string; url: string; verifiedAt: string }
export type DenmarkBlock = { title: string; text: string; note?: string; source?: DenmarkSource; link?: { label: string; url: string } }
export type DenmarkSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly DenmarkBlock[] }

const verifiedAt = '2026-10-26'

export const DENMARK_SOURCES = {
  population: { label: 'Statistics Denmark · População em setembro de 2026', url: 'https://www.dst.dk/en/Statistik/emner/borgere/befolkning/befolkningstal', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  language: { label: 'Study in Denmark · Aprender dinamarquês', url: 'https://studyindenmark.dk/live-in-denmark/learning-danish', verifiedAt },
  languageClasses: { label: 'Study in Denmark · Curso municipal de dinamarquês', url: 'https://studyindenmark.dk/live-in-denmark/student-jobs', verifiedAt },
  tuition: { label: 'Study in Denmark · Mensalidades', url: 'https://studyindenmark.dk/study-options/tuition-fees-scholarships/tuition-fees-and-scholarships/download-pdf', verifiedAt },
  scholarships: { label: 'Study in Denmark · Bolsas para estudantes internacionais', url: 'https://studyindenmark.dk/study-options/scholarships', verifiedAt },
  visa: { label: 'Study in Denmark · Autorização de residência para estudantes', url: 'https://studyindenmark.dk/live-in-denmark/permits-visas-red-tape/residence-permits-non-eu-eea-citizens', verifiedAt },
  healthcare: { label: 'Study in Denmark · Acesso à saúde', url: 'https://studyindenmark.dk/live-in-denmark/health-safety/healthcare-1', verifiedAt },
  work: { label: 'Study in Denmark · Trabalho de estudantes', url: 'https://studyindenmark.dk/live-in-denmark/student-jobs', verifiedAt },
  jobSeeking: { label: 'SIRI · Busca de emprego após o curso', url: 'https://nyidanmark.dk/en-GB/You-want-to-apply/Study/Study---job-seeking/Study---3-years-job-seeking', verifiedAt },
  ruleChange: { label: 'SIRI · Mudança em 1.º de outubro de 2026', url: 'https://nyidanmark.dk/en-GB/News-Front-Page/2026/09/SIRI---Nye-regler-for-studerende', verifiedAt },
  pay: { label: 'Life in Denmark · Salários', url: 'https://lifeindenmark.borger.dk/working/work-rights/working-conditions/pay', verifiedAt },
  brazil: { label: 'Itamaraty · Embaixada em Copenhague', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, DenmarkSource>

export const DENMARK_SECTIONS: readonly DenmarkSection[] = [
  {
    id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Escolha o idioma pelo curso',
    intro: 'O dinamarquês é o idioma do país. Há programas em inglês, com requisitos definidos por cada instituição.',
    blocks: [
      { title: 'Programas em inglês', text: 'Confira na página do curso quais certificados de proficiência são aceitos e a nota necessária. Não há uma nota única de IELTS ou TOEFL válida para todas as universidades.' },
      { title: 'Programas em dinamarquês', text: 'A instituição pode exigir comprovação específica do idioma, como a Studieprøven. Leia os requisitos do programa antes de se inscrever.' },
      { title: 'Aprender após a chegada', text: 'O Study in Denmark informa que estudantes internacionais podem ter acesso a cursos de dinamarquês. Para os cursos oferecidos pelo município, são necessários residência, endereço registrado no CPR e, em certas situações, um depósito reembolsável.', note: 'Confirme as condições e os custos com o município; “gratuito” não significa ausência de depósito ou requisitos.', source: DENMARK_SOURCES.languageClasses, link: { label: 'Ver opções para aprender dinamarquês', url: DENMARK_SOURCES.language.url } },
    ],
  },
  {
    id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Pense nas estações e na luz do dia',
    intro: 'O clima é temperado, com vento e chuva frequentes. Os dias de inverno são mais curtos que os de verão.',
    blocks: [
      { title: 'Planeje pela cidade', text: 'Consulte médias mensais de temperatura, chuva e vento para seu destino. Casaco impermeável e roupas para camadas podem ser úteis, mas ajuste a mala à época de chegada.', link: { label: 'Consultar o instituto meteorológico', url: 'https://www.dmi.dk/' } },
      { title: 'Rotina no inverno', text: 'A redução da luz natural pode afetar horários e atividades. Verifique as opções de transporte e de lazer da cidade onde vai estudar.' },
    ],
  },
  {
    id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Compare mensalidade e manutenção',
    intro: 'Brasileiros em geral pagam mensalidade em cursos superiores completos; moradia e despesas variam entre cidades.',
    blocks: [
      { title: 'Mensalidade para não europeus', text: 'O Study in Denmark explica que o ensino superior gratuito é voltado a estudantes da UE/EEE, Suíça e algumas situações de intercâmbio. Para outras pessoas, a universidade define a mensalidade do programa.', note: 'Não use uma faixa geral como preço do seu curso; confirme o valor e o ano de ingresso diretamente com a instituição.', source: DENMARK_SOURCES.tuition },
      { title: 'Seu orçamento real', text: 'Compare dormitório ou aluguel, alimentação, transporte, seguro e gastos de chegada. Use as estimativas da universidade e registre moeda, período e data da consulta.' },
      { title: 'Saúde e registro', text: 'Estudantes de fora da UE/EEE que ficam por mais de três meses devem obter autorização de residência e registro no Civil Registration System (CPR). Acesso à saúde pública depende dessa situação e há exceções de cobertura, como serviços odontológicos.', source: DENMARK_SOURCES.healthcare },
    ],
  },
  {
    id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Bolsas são distribuídas pelas instituições',
    intro: 'O financiamento depende do programa, da universidade e da edição da chamada.',
    blocks: [
      { title: 'Bolsas governamentais para não europeus', text: 'Universidades dinamarquesas recebem um número limitado de bolsas para estudantes de curso completo de fora da UE/EEE e da Suíça. Elas podem cobrir total ou parcialmente a mensalidade e/ou oferecer auxílio para manutenção.', note: 'Ser brasileiro pode atender ao critério de nacionalidade, mas isso não confirma elegibilidade ou seleção. Confira todos os requisitos na universidade.', source: DENMARK_SOURCES.scholarships, link: { label: 'Entender as modalidades', url: DENMARK_SOURCES.scholarships.url } },
      { title: 'Procure a chamada do curso', text: 'University of Copenhagen, DTU, Aarhus University e Copenhagen Business School são exemplos de instituições para pesquisar. Verifique no próprio programa se há bolsa, cobertura, prazo e processo separado.' },
      { title: 'Não misture programas', text: 'Erasmus+, Nordplus e Fulbright têm públicos e condições próprios. Não os trate como bolsas diretas para todo candidato brasileiro; leia a elegibilidade de cada edital.', source: DENMARK_SOURCES.scholarships },
    ],
  },
  {
    id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Escolha pelo programa e pelo lugar',
    intro: 'Rankings mudam por ano e metodologia. O melhor ponto de partida é o curso que atende seus objetivos.',
    blocks: [
      { title: 'Instituições para pesquisar', text: 'Aalborg University, Aarhus University, Copenhagen Business School, DTU, IT University of Copenhagen, Roskilde University, University of Copenhagen e University of Southern Denmark são exemplos em ordem alfabética, não um ranking.' },
      { title: 'O que comparar', text: 'Verifique currículo, idioma, taxa para estudantes de fora da UE/EEE, apoio acadêmico, cidade, moradia e bolsas ligadas ao programa.' },
    ],
  },
  {
    id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Construa sua rotina e sua rede',
    intro: 'A universidade e os serviços locais podem ajudar nos primeiros passos.',
    blocks: [
      { title: 'Cotidiano', text: 'Bicicleta, pontualidade e o conceito de hygge aparecem frequentemente nas descrições da vida dinamarquesa. Há diferenças entre cidades e pessoas: use essas ideias como ponto de partida para conhecer a cultura.' },
      { title: 'Feriados e tradições', text: 'Sankt Hans, Fastelavn e o Dia da Constituição podem alterar atividades locais. Confirme datas e funcionamento dos serviços na cidade escolhida.' },
      { title: 'Apoio brasileiro', text: 'O Itamaraty lista a Embaixada do Brasil em Copenhague para atendimento consular na Dinamarca. Guarde o contato oficial e confira os serviços disponíveis antes de viajar.', source: DENMARK_SOURCES.brazil, link: { label: 'Consultar serviços consulares', url: DENMARK_SOURCES.brazil.url } },
    ],
  },
  {
    id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Siga o calendário do seu programa',
    intro: 'Muitas instituições têm semestres de outono e primavera, mas prazos de ingresso e bolsa variam.',
    blocks: [
      { title: 'Três prazos para acompanhar', text: 'Anote separadamente o fechamento do curso, da bolsa e da autorização de residência. Confira o ano de ingresso, o fuso indicado e a data dos documentos de idioma.' },
      { title: 'Prepare-se com antecedência', text: 'Separe tempo para histórico acadêmico, certificado de idioma, carta de motivação e recomendações quando o programa exigir. Não presuma um prazo nacional único.' },
    ],
  },
  {
    id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Da escolha ao envio',
    intro: 'Use a lista de documentos e os critérios da universidade como referência final.',
    blocks: [
      { title: '1. Selecione o curso', text: 'Defina nível, área, idioma e cidade. Veja os requisitos específicos, a mensalidade e a política para estudantes internacionais.' },
      { title: '2. Confira a bolsa', text: 'Procure a página da bolsa da instituição e verifique se a seleção é automática ou exige candidatura separada. Leia a cobertura antes de contar com esse financiamento.', source: DENMARK_SOURCES.scholarships },
      { title: '3. Prepare os documentos', text: 'Histórico, diploma, proficiência, carta de motivação e recomendações podem ser exigidos. Confira formato, traduções e autenticações no programa.' },
      { title: '4. Revise e envie', text: 'Verifique datas, anexos e confirmação de recebimento. Depois da admissão, siga a orientação oficial para solicitar a residência antes da viagem.', source: DENMARK_SOURCES.visa },
    ],
  },
  {
    id: 'residencia', tab: 'Residência', kicker: '09 · Entrada no país', title: 'Prepare a autorização antes de viajar',
    intro: 'Estudantes brasileiros precisam conferir as exigências de residência para estudar na Dinamarca.',
    blocks: [
      { title: 'Admissão e manutenção', text: 'O Study in Denmark informa que estudantes de fora da UE/EEE devem pedir autorização de residência antes da viagem. A admissão em instituição aprovada e a capacidade financeira fazem parte das condições.', source: DENMARK_SOURCES.visa },
      { title: 'Leia o cartão de residência', text: 'A autorização pode vir com permissão de trabalho limitada. O cartão mostra as condições aplicáveis; programas não aprovados pelo Estado podem seguir regras diferentes.', source: DENMARK_SOURCES.work },
    ],
  },
  {
    id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante e após o curso', title: 'As regras dependem da autorização',
    intro: 'Consulte as condições do seu cartão e a agência dinamarquesa SIRI antes de aceitar trabalho.',
    blocks: [
      { title: 'Durante os estudos', text: 'Para estudantes de fora da UE/EEE em programa superior aprovado pelo Estado, o Study in Denmark informa até 90 horas por mês de setembro a maio e trabalho em tempo integral em junho, julho e agosto.', note: 'A regra exata consta do cartão de residência. Trabalhar acima do permitido pode prejudicar a autorização.', source: DENMARK_SOURCES.work },
      { title: 'Busca de emprego após a graduação', text: 'Desde 1.º/10/2026, quem solicita residência para certos cursos superiores aprovados pelo Estado geralmente recebe período de busca de emprego de um ano após concluir o curso. Pedidos anteriores a essa data geralmente mantêm três anos; doutorados seguem, em geral, até três anos.', note: 'Há exceções por tipo de programa, data do pedido e validade do passaporte. Confira sua situação no SIRI.', source: DENMARK_SOURCES.ruleChange, link: { label: 'Ver condições de busca de emprego', url: DENMARK_SOURCES.jobSeeking.url } },
      { title: 'Trabalho nesse período', text: 'A permissão de busca de emprego mantém, em geral, o limite de 90 horas por mês e tempo integral em junho, julho e agosto. Para trabalhar além disso, é preciso pedir outra autorização adequada.', source: DENMARK_SOURCES.jobSeeking },
      { title: 'Salários', text: 'A Dinamarca não tem salário mínimo legal nacional. Remuneração costuma ser definida por acordo coletivo ou contrato; consulte a convenção e a oferta da vaga.', source: DENMARK_SOURCES.pay },
    ],
  },
]
