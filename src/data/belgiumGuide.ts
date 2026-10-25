export type BelgiumSource = { label: string; url: string; verifiedAt: string }
export type BelgiumBlock = {
  title: string
  text: string
  items?: readonly string[]
  note?: string
  source?: BelgiumSource
  link?: { label: string; url: string }
}
export type BelgiumSection = {
  id: string
  tab: string
  kicker: string
  title: string
  intro: string
  blocks: readonly BelgiumBlock[]
}

const verifiedAt = '2026-10-24'

export const BELGIUM_SOURCES = {
  population: { label: 'Statbel · População em 1.º de janeiro de 2026', url: 'https://statbel.fgov.be/en/news/1-january-2026-belgium-had-11867634-inhabitants', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  flandersProgrammes: { label: 'Study in Flanders · Busca de programas', url: 'https://www.studyinflanders.be/programmes', verifiedAt },
  frenchProgrammes: { label: 'Wallonie-Bruxelles Campus · Busca de programas', url: 'https://www.studyinbelgium.be/en/our-formations', verifiedAt },
  frenchStudy: { label: 'Wallonie-Bruxelles Campus · Guia para brasileiros', url: 'https://www.studyinbelgium.be/pt-br/guia-pratico-para-os-estudantes-e-pesquisadores-brasileiros/mestrado-e-doutorado', verifiedAt },
  visaFunds: { label: 'Study in Flanders · Exigências do visto', url: 'https://www.studyinflanders.be/practical-information/visa-requirements', verifiedAt },
  flandersFees: { label: 'Study in Flanders · Taxas de matrícula 2026–2027', url: 'https://www.studyinflanders.be/practical-information/tuition-fees', verifiedAt },
  frenchFees: { label: 'Wallonie-Bruxelles Campus · Taxas de inscrição 2026–2027', url: 'https://www.studyinbelgium.be/fr/etudier-en-belgique-francophone-les-frais-dinscription', verifiedAt },
  erasmus: { label: 'Erasmus+ · Mestrados conjuntos Erasmus Mundus', url: 'https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters', verifiedAt },
  masterMind: { label: 'Study in Flanders · Master Mind Scholarship', url: 'https://www.studyinflanders.be/scholarships/master-mind-scholarships', verifiedAt },
  masterMindEligibility: { label: 'Study in Flanders · Elegibilidade Master Mind', url: 'https://www.studyinflanders.be/scholarships/master-mind-scholarships/eligibility-criteria', verifiedAt },
  vlir: { label: 'VLIR-UOS · Países elegíveis ao ICP Connect', url: 'https://www.vliruos.be/icp-connect-scholarship-country-list', verifiedAt },
  euStudent: { label: 'Comissão Europeia · Estudantes na Bélgica', url: 'https://home-affairs.ec.europa.eu/policies/migration-and-asylum/eu-immigration-portal/student-belgium_en', verifiedAt },
  flandersWork: { label: 'Study in Flanders · Trabalho durante os estudos', url: 'https://www.studyinflanders.be/practical-information/work-and-study', verifiedAt },
  afterStudy: { label: 'Study in Flanders · Após a graduação', url: 'https://www.studyinflanders.be/after-your-studies', verifiedAt },
} satisfies Record<string, BelgiumSource>

export const BELGIUM_SECTIONS: readonly BelgiumSection[] = [
  {
    id: 'idiomas', tab: 'Idiomas', kicker: '01 · Comunicação', title: 'Escolha o curso e o idioma juntos',
    intro: 'Neerlandês, francês e alemão são idiomas oficiais. A língua de ensino depende da região, da instituição e do programa.',
    blocks: [
      { title: 'Cada região tem seu contexto', text: 'Em Flandres predomina o neerlandês; na Valônia, o francês. Bruxelas é oficialmente bilíngue. A comunidade germanófona fica no leste. Há opções em inglês, especialmente na pós-graduação.', source: BELGIUM_SOURCES.flandersProgrammes },
      { title: 'Antes de pagar por um exame', text: 'Verifique na página do curso qual é o idioma de ensino, quais certificados são aceitos e a pontuação exigida. IELTS e TOEFL podem ser aceitos para cursos em inglês; a prova de francês ou neerlandês varia por instituição.', note: 'Não há uma nota mínima única para estudar na Bélgica.', source: BELGIUM_SOURCES.frenchStudy },
    ],
  },
  {
    id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Prepare-se para chuva e variações',
    intro: 'O clima é temperado oceânico. Invernos tendem a ser frios e úmidos; verões, mais amenos do que em grande parte do Brasil.',
    blocks: [
      { title: 'Ao longo do ano', text: 'Primavera e outono podem alternar chuva e períodos amenos. No inverno, os dias são mais curtos. Consulte a previsão da cidade de destino antes da viagem.' },
      { title: 'Na mala', text: 'Casaco impermeável, sapatos fechados e roupas em camadas ajudam na adaptação. Mesmo no verão, vale ter uma camada extra para dias frescos.' },
    ],
  },
  {
    id: 'custos', tab: 'Custos', kicker: '03 · Planejamento financeiro', title: 'Separe custo de vida, matrícula e visto',
    intro: 'A comprovação financeira exigida para o visto não é uma estimativa suficiente de todas as suas despesas.',
    blocks: [
      { title: 'Comprovação para o visto', text: 'Para 2026–2027, o portal Study in Flanders informa € 1.062 por mês como valor mínimo de recursos. Bolsas, conta bloqueada ou patrocínio podem ser aceitos conforme as regras aplicáveis.', note: 'Referência em euros por mês, consultada em 24/10/2026. Verifique o valor e a forma de comprovação com a representação belga antes de solicitar o visto.', source: BELGIUM_SOURCES.visaFunds },
      { title: 'Taxas em Flandres', text: 'O portal oficial apresenta, para cursos integrais de 60 créditos em 2026–2027, uma faixa geral de € 5.300 a € 12.000 para estudantes de fora da UE/EEE; escolas de artes podem ter valores diferentes.', note: 'Faixa de referência em euros por ano letivo, não preço de um curso específico. Confira a tabela da universidade e possíveis isenções.', source: BELGIUM_SOURCES.flandersFees },
      { title: 'Taxas na Bélgica francófona', text: 'O Wallonie-Bruxelles Campus informa € 5.369 no ano letivo 2026–2027 para muitos estudantes de fora da UE: € 1.194 de inscrição e € 4.175 de contribuição adicional. Há exceções, e cursos especializados podem custar diferente.', note: 'Valor em euros por ano letivo. O total de € 3.340 do texto de referência não corresponde à regra geral oficial de 2026–2027.', source: BELGIUM_SOURCES.frenchFees },
      { title: 'Seu orçamento real', text: 'Inclua moradia, alimentação, transporte, seguro, materiais, caução e imprevistos. Compare a cidade e a universidade; o valor necessário pode ser maior que o mínimo do visto.' },
    ],
  },
  {
    id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Priorize editais que aceitam seu perfil',
    intro: 'Uma bolsa pode ser integral, parcial ou restrita a determinadas nacionalidades. Confira sempre a chamada do ano de ingresso.',
    blocks: [
      { title: 'Erasmus Mundus', text: 'Mestrados conjuntos aceitam candidaturas de estudantes do mundo todo. Alguns oferecem bolsa integral para participação e contribuição para viagem, visto e manutenção. A inscrição é feita no programa escolhido.', source: BELGIUM_SOURCES.erasmus, link: { label: 'Pesquisar mestrados Erasmus Mundus', url: 'https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters' } },
      { title: 'Master Mind Scholarship', text: 'Programa flamengo para mestrados. A chamada 2026–2027 está encerrada; a edição seguinte pode mudar valores e regras. A página de elegibilidade informa que, em geral, estudantes de diferentes nacionalidades podem concorrer, sujeitos aos demais critérios.', note: 'Confirme se o curso e a instituição participam, além do calendário da próxima chamada.', source: BELGIUM_SOURCES.masterMindEligibility, link: { label: 'Conhecer a Master Mind', url: BELGIUM_SOURCES.masterMind.url } },
      { title: 'VLIR-UOS ICP Connect: atenção à nacionalidade', text: 'A lista atual de países elegíveis não inclui o Brasil. Não considere essa bolsa como uma opção para candidatos apenas com nacionalidade brasileira sem mudança oficial nas regras.', source: BELGIUM_SOURCES.vlir },
      { title: 'Universidades e outros programas', text: 'Pesquise bolsas diretamente nas universidades, no ARES e em editais brasileiros como os da CAPES e do CNPq. Benefícios, áreas e critérios variam; não há valor típico que sirva para todos.' },
    ],
  },
  {
    id: 'universidades', tab: 'Universidades', kicker: '05 · Escolha do curso', title: 'Compare programa, idioma e cidade',
    intro: 'A Bélgica reúne instituições em comunidades linguísticas diferentes. Este guia não classifica universidades por ranking.',
    blocks: [
      { title: 'Pontos de partida', text: 'KU Leuven, Ghent University, University of Antwerp, UCLouvain, Université libre de Bruxelles (ULB), Vrije Universiteit Brussel (VUB) e University of Liège são exemplos para iniciar a pesquisa.', note: 'A oferta de cursos e a língua de ensino precisam ser conferidas no programa específico.', source: BELGIUM_SOURCES.flandersProgrammes, link: { label: 'Pesquisar cursos na Bélgica francófona', url: BELGIUM_SOURCES.frenchProgrammes.url } },
      { title: 'Critérios de comparação', text: 'Verifique currículo, requisitos para diplomas brasileiros, idioma, taxas, possibilidade de bolsa e custo de moradia da cidade.', source: BELGIUM_SOURCES.frenchStudy },
    ],
  },
  {
    id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Encontre sua rede de apoio',
    intro: 'A experiência varia entre cidades e comunidades linguísticas. Use relatos pessoais para orientação, mas confirme procedimentos em fontes oficiais.',
    blocks: [
      { title: 'Comunidade brasileira', text: 'Procure o escritório internacional da universidade, associações locais e a representação brasileira em Bruxelas. O guia não usa chegadas anuais como se fossem o total de brasileiros residentes no país.' },
      { title: 'Cultura', text: 'Bruges, Ghent, Antuérpia e Bruxelas oferecem arquitetura histórica, quadrinhos, gastronomia e eventos. Conhecer o idioma e os costumes da região escolhida ajuda na integração.', note: 'As referências culturais são exemplos, não descrevem todas as pessoas ou cidades.' },
    ],
  },
  {
    id: 'calendario', tab: 'Calendário', kicker: '07 · Datas importantes', title: 'Monte o calendário do seu curso',
    intro: 'O ano letivo costuma começar em setembro ou outubro; exames frequentemente ocorrem em janeiro e junho. Cada instituição define suas datas.',
    blocks: [
      { title: 'Sem prazo universal de candidatura', text: 'Prazos de curso, bolsa, equivalência do diploma, visto e moradia devem ser registrados separadamente. Candidatos de fora da UE podem ter datas diferentes.', note: 'As datas informais do texto de referência não foram publicadas aqui como prazos oficiais.' },
      { title: 'Feriados e funcionamento', text: 'Feriados nacionais e regionais podem afetar serviços e atendimento. Confirme no calendário da universidade e da cidade quando precisar agendar exames, visitas ou documentos.' },
    ],
  },
  {
    id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Prepare uma candidatura por vez',
    intro: 'Os requisitos mudam por curso e comunidade linguística. Use a sequência abaixo como ponto de partida.',
    blocks: [
      { title: '1. Escolha e confirme', text: 'Defina nível e área. Leia a página oficial do curso para confirmar idioma, equivalência do diploma, taxas, prazo e condições para estudantes brasileiros.' },
      { title: '2. Reúna os documentos', text: 'Histórico, diploma, currículo, carta de motivação, recomendações e prova de idioma podem ser exigidos. Tradução, apostila e projeto de pesquisa dependem do programa.', source: BELGIUM_SOURCES.frenchStudy },
      { title: '3. Avalie bolsa e orçamento', text: 'Compare os benefícios da bolsa com as taxas e despesas da cidade. Prepare comprovantes financeiros e tempo para o visto antes de assumir compromissos.', source: BELGIUM_SOURCES.visaFunds },
      { title: '4. Revise e envie', text: 'Adapte sua carta ao curso, confira formatos e guarde comprovantes. Se houver entrevista, prepare exemplos concretos de experiências relevantes.' },
    ],
  },
  {
    id: 'visto', tab: 'Visto', kicker: '09 · Permanência', title: 'Planeje a documentação de entrada',
    intro: 'Para estudos de longa duração, brasileiros geralmente precisam solicitar o visto D e atender às condições de residência.',
    blocks: [
      { title: 'Antes da viagem', text: 'A solicitação é feita à representação diplomática ou consular belga competente. A documentação pode incluir matrícula, recursos financeiros, seguro-saúde e outros comprovantes.', note: 'Procedimento e tempo de análise variam; confirme a lista atual antes de agendar.', source: BELGIUM_SOURCES.euStudent },
      { title: 'Ao chegar e ao renovar', text: 'Registre-se no município de residência em até 8 dias úteis. A autorização de estudante é renovável, mas a renovação depende de requisitos, inclusive progresso acadêmico.', note: 'A regra de créditos não é simplesmente 45 por ano na graduação ou 60 por ano no mestrado; confira a condição aplicável ao seu ciclo e período.', source: BELGIUM_SOURCES.euStudent },
    ],
  },
  {
    id: 'trabalho', tab: 'Trabalho', kicker: '10 · Carreira', title: 'Trabalho deve caber no plano de estudos',
    intro: 'Um emprego pode complementar o orçamento, mas não deve ser a única fonte financeira prevista para o curso e o visto.',
    blocks: [
      { title: 'Durante o curso', text: 'Estudantes de fora da UE com residência válida podem, em regra, trabalhar até 20 horas por semana durante as aulas. Nas férias escolares oficiais, esse limite não se aplica. O trabalho não pode atrapalhar as atividades do curso.', note: 'Confira a autorização de residência e as regras específicas antes de aceitar uma vaga.', source: BELGIUM_SOURCES.flandersWork },
      { title: 'Depois de concluir', text: 'Concluintes elegíveis podem solicitar até 12 meses adicionais de permanência para buscar emprego ou iniciar uma atividade empresarial. A autorização não é automática e não substitui as regras para residência por trabalho.', source: BELGIUM_SOURCES.afterStudy },
      { title: 'Onde procurar', text: 'Além do serviço de carreiras da universidade, pesquise nos canais regionais VDAB (Flandres), Le Forem (Valônia) e Actiris (Bruxelas). Idioma e região fazem diferença.' },
    ],
  },
]
