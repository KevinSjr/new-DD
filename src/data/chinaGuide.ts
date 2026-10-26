export type ChinaSource = { label: string; url: string; verifiedAt: string }
export type ChinaBlock = {
  title: string
  text: string
  note?: string
  source?: ChinaSource
  link?: { label: string; url: string }
}
export type ChinaSection = {
  id: string
  tab: string
  kicker: string
  title: string
  intro: string
  blocks: readonly ChinaBlock[]
}

const verifiedAt = '2026-10-26'

export const CHINA_SOURCES = {
  population: { label: 'Escritório Nacional de Estatísticas da China · 2025', url: 'https://www.stats.gov.cn/english/PressRelease/202601/t20260119_1962328.html', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  hsk: { label: 'Chinese Testing International · HSK 3.0', url: 'https://old.chinesetest.cn/gonewcontent.do?flag=kdnew&id=51336883', verifiedAt },
  scholarshipBrazil: { label: 'Embaixada da China no Brasil · Bolsa 2026/27', url: 'https://br.china-embassy.gov.cn/por/sghds/202511/t20251108_11749408.htm', verifiedAt },
  scholarshipBenefits: { label: 'Beijing Language and Culture University · CGS 2026', url: 'https://admission.blcu.edu.cn/en/2025/1106/c1146a3007/page.htm', verifiedAt },
  visa: { label: 'Embaixada da China no Brasil · Tipos de visto', url: 'https://br.china-embassy.gov.cn/por/lqfw/lqfw2/201310/t20131025_4348829.htm', verifiedAt },
  visaWaiver: { label: 'Embaixada da China no Brasil · Isenção até 31/12/2026', url: 'https://br.china-embassy.gov.cn/por/lqfw/lqfw2/', verifiedAt },
  residence: { label: 'Governo de Xangai · Visto de estudo e residência', url: 'https://english.shanghai.gov.cn/en-Individuals-ImmigrationandVisas-Visaapplication/20260813/019a51e0e74d426d9164b830681bc90f.html', verifiedAt },
  internship: { label: 'Governo de Xangai · Estágio fora do campus', url: 'https://english.shanghai.gov.cn/en-FAQs-StudyinShanghai/20260617/afc52d24472a4c41ab0e8706b10eb2d4.html', verifiedAt },
  studyWork: { label: 'Governo de Xangai · Trabalho durante os estudos', url: 'https://english.shanghai.gov.cn/en-FAQs-StudyinShanghai/20250828/4aa4af7d361b4e39b0499362890c5b03.html', verifiedAt },
} satisfies Record<string, ChinaSource>

export const CHINA_SECTIONS: readonly ChinaSection[] = [
  {
    id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Escolha o idioma pelo programa',
    intro: 'O mandarim padrão (Putonghua) é a principal língua de ensino. Há cursos em inglês, com exigências próprias.',
    blocks: [
      { title: 'Mandarim no dia a dia', text: 'É um idioma tonal, normalmente escrito com caracteres simplificados na China continental. Aprender o básico ajuda na rotina, mesmo quando o curso é em inglês.' },
      { title: 'HSK e a transição para o 3.0', text: 'O HSK é uma prova de proficiência em chinês. A organização anunciou o lançamento mundial do HSK 3.0 para 13/12/2026. Confirme no centro de provas e no edital qual versão e nível serão aceitos no seu ano de candidatura.', source: CHINA_SOURCES.hsk, link: { label: 'Consultar o exame HSK', url: 'https://www.chinesetest.cn/' } },
      { title: 'Proficiência para bolsas e cursos', text: 'O nível de HSK ou a prova de inglês depende do curso e da instituição. Não há uma nota única de IELTS, TOEFL ou HSK que sirva para todos os programas. Confira a página de admissão da universidade.' },
    ],
  },
  {
    id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'O clima muda muito entre as cidades',
    intro: 'Escolha a cidade antes de planejar roupas e moradia.',
    blocks: [
      { title: 'Norte e leste', text: 'Pequim tem inverno frio e seco e verão quente; Xangai tem verão úmido e quatro estações. Verifique médias mensais da cidade escolhida antes de fazer a mala.' },
      { title: 'Sul e oeste', text: 'Guangzhou é quente e úmida por boa parte do ano. O oeste tem regiões áridas e grande variação de temperatura. Um único resumo climático não representa todo o país.' },
      { title: 'Adaptação', text: 'Inclua roupas de inverno ou proteção contra chuva conforme o destino. A qualidade do ar varia por cidade e época: consulte um índice atualizado para sua região.' },
    ],
  },
  {
    id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Faça as contas na cidade do curso',
    intro: 'Mensalidade, alojamento, seguro, transporte e despesas diárias variam conforme instituição e local.',
    blocks: [
      { title: 'Use o orçamento da universidade', text: 'Procure a página oficial do programa para comparar mensalidade, alojamento, taxas e seguro. Confira moeda, período de referência e o que a instituição inclui.' },
      { title: 'Considere a chegada', text: 'Inclua passagem, visto, tradução de documentos, caução de moradia e gastos iniciais. Uma bolsa pode cobrir algumas dessas despesas, mas não presuma cobertura sem ler o edital.' },
    ],
  },
  {
    id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'A bolsa do governo tem canal para brasileiros',
    intro: 'A Embaixada da China no Brasil publicou as regras da edição 2026/27. O prazo daquela chamada terminou; acompanhe o próximo edital.',
    blocks: [
      { title: 'Chinese Government Scholarship (CGS)', text: 'Na edição 2026/27, o canal da Embaixada no Brasil recebeu candidaturas de brasileiros para bacharelado, mestrado, doutorado e estudos sem diploma. Era uma candidatura on-line da categoria A, com código da agência 0761.', note: 'A data-limite dessa edição foi 5/02/2026. Não trate esse prazo como vigente para futuras chamadas.', source: CHINA_SOURCES.scholarshipBrazil, link: { label: 'Ver o edital brasileiro', url: CHINA_SOURCES.scholarshipBrazil.url } },
      { title: 'Cobertura de bolsa integral', text: 'Um guia de universidade participante para 2026 lista isenção de mensalidade, alojamento ou auxílio-moradia, seguro médico e mesada mensal: CNY 2.500 na graduação, CNY 3.000 no mestrado e CNY 3.500 no doutorado.', note: 'Valores em yuan renminbi (CNY) por mês, referentes ao guia consultado para 2026. Confirme os benefícios do edital e da modalidade antes de planejar o orçamento.', source: CHINA_SOURCES.scholarshipBenefits },
      { title: 'Pré-admissão e CSCA', text: 'O edital brasileiro 2026/27 exigiu documento de aceitação ou intenção de aceitação de ao menos uma universidade. Para bacharelado, também exigiu resultado válido do CSCA (teste acadêmico de ingresso); as disciplinas da prova dependiam do curso.', source: CHINA_SOURCES.scholarshipBrazil },
      { title: 'Bolsas da própria instituição', text: 'Universidades podem oferecer programas e bolsas próprios. Compare idioma, cobertura, elegibilidade e prazos diretamente no edital de cada instituição; programas com nomes parecidos podem ter regras diferentes.' },
    ],
  },
  {
    id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Pesquise o curso antes do ranking',
    intro: 'A posição de uma universidade muda conforme o ranking, a edição e a metodologia.',
    blocks: [
      { title: 'Pontos de partida', text: 'Fudan, Nanjing, Peking, Renmin, Shanghai Jiao Tong, Tsinghua, USTC e Zhejiang são instituições conhecidas para pesquisar, em ordem alfabética, não uma classificação.' },
      { title: 'O que comparar', text: 'Confira idioma de ensino, área, currículo, cidade, custos, possibilidade de bolsa e suporte ao estudante internacional. Veja se o curso e a instituição aceitam a candidatura de estrangeiros naquele ano.' },
    ],
  },
  {
    id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Prepare a rotina além da sala de aula',
    intro: 'Conhecer serviços da universidade, idioma local e costumes ajuda na chegada.',
    blocks: [
      { title: 'Primeiras semanas', text: 'Peça à universidade orientações sobre moradia, seguro, registro local, transporte e aplicativos de pagamento e comunicação. O WeChat é amplamente usado, mas confirme as opções aceitas na sua cidade.' },
      { title: 'Cultura e convivência', text: 'O Festival da Primavera, o Festival do Meio do Outono e o Dia Nacional podem afetar o calendário e os serviços. Práticas sociais variam entre pessoas e regiões; procure conhecer a comunidade sem tratá-las como regras universais.' },
      { title: 'Apoio consular', text: 'Salve os contatos do escritório internacional da universidade e da representação brasileira responsável pela sua região. Confirme endereços e horários em canais oficiais antes de viajar.' },
    ],
  },
  {
    id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Planeje pelo edital do seu ingresso',
    intro: 'Muitas instituições têm ingresso no semestre de outono, mas datas e ciclos de bolsa variam.',
    blocks: [
      { title: 'Três calendários diferentes', text: 'Anote separadamente prazos do curso, da bolsa e do visto. O edital brasileiro da CGS 2026/27 fechou em fevereiro de 2026; a próxima edição precisa de confirmação oficial.', source: CHINA_SOURCES.scholarshipBrazil },
      { title: 'Tempo de preparação', text: 'Começar a pesquisa cerca de um ano antes é uma sugestão de planejamento. Reserve tempo para idioma, CSCA quando exigido, traduções, documentos médicos e possível pré-admissão.' },
    ],
  },
  {
    id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Da pesquisa ao envio',
    intro: 'Use a lista do programa escolhido e confira cada exigência antes de enviar documentos.',
    blocks: [
      { title: '1. Defina o programa', text: 'Escolha área, nível de estudo, idioma e universidade. Verifique mensalidade, bolsa, prazo e requisitos acadêmicos diretamente no edital.' },
      { title: '2. Converse com a instituição', text: 'Para a CGS 2026/27 pelo Brasil, era preciso obter uma aceitação ou intenção de aceitação antes da candidatura à bolsa. A universidade podia aplicar exame próprio, especialmente em artes.', source: CHINA_SOURCES.scholarshipBrazil },
      { title: '3. Prepare os documentos', text: 'O edital brasileiro exigiu tradução para o inglês de materiais que não estivessem em chinês ou inglês. Confirme também histórico, diploma, plano de estudos, recomendações, prova de idioma, exame médico e antecedentes quando a chamada pedir.', source: CHINA_SOURCES.scholarshipBrazil },
      { title: '4. Revise e envie', text: 'Confira nomes, datas, arquivos, fuso horário e confirmação de envio no portal oficial. Guarde cópias e acompanhe as comunicações da universidade e do canal da bolsa.' },
    ],
  },
  {
    id: 'visto', tab: 'Visto', kicker: '09 · Entrada e residência', title: 'Estudar exige a documentação correta',
    intro: 'A finalidade e a duração do curso determinam o tipo de visto.',
    blocks: [
      { title: 'X1 e X2', text: 'A Embaixada da China no Brasil informa que X1 é para estudos com mais de 180 dias e X2 para estudos de até 180 dias. Veja a lista atual de documentos para seu curso antes de solicitar.', source: CHINA_SOURCES.visa },
      { title: 'Depois da entrada com X1', text: 'Portadores de X1 devem solicitar autorização de residência dentro de 30 dias após a entrada, conforme as orientações oficiais. Confirme os passos com a universidade e a autoridade local de saída e entrada.', source: CHINA_SOURCES.residence },
      { title: 'Isenção de visto não cobre estudo', text: 'Para passaportes brasileiros comuns, a isenção para visitas de até 30 dias foi prorrogada até 31/12/2026 para turismo, negócios, visitas, intercâmbios e trânsito. Ela não substitui o visto de estudos.', note: 'A vigência e as condições podem mudar; consulte a Embaixada antes de viajar.', source: CHINA_SOURCES.visaWaiver },
    ],
  },
  {
    id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante e após o curso', title: 'Autorização vem antes de trabalhar',
    intro: 'Condições de estágio e trabalho dependem da permissão de residência e da autoridade local.',
    blocks: [
      { title: 'Estágio fora do campus', text: 'Orientações oficiais de Xangai exigem que o estágio esteja organizado ou reconhecido pela universidade, com consentimento dela e anotação da autoridade de saída e entrada na autorização de residência antes de começar.', note: 'Regra apresentada para Xangai. Confirme o procedimento na cidade e universidade onde estudará.', source: CHINA_SOURCES.internship },
      { title: 'Trabalho de meio período', text: 'Alunos com autorização de residência para estudo que pretendem trabalhar fora do campus precisam apresentar aprovações da instituição e do local de atividade para obter anotação de local e duração. Sem ela, a atividade fora do campus não é permitida.', source: CHINA_SOURCES.studyWork },
      { title: 'Após a formatura', text: 'Para permanecer e trabalhar depois do curso, consulte a universidade, o empregador e a autoridade de imigração sobre a situação aplicável. Não considere o visto de estudos uma permissão automática para emprego.' },
    ],
  },
]
