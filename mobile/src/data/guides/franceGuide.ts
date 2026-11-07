export type FranceSource = { label: string; url: string; verifiedAt: string }
export type FranceBlock = { title: string; text: string; note?: string; source?: FranceSource; link?: { label: string; url: string } }
export type FranceSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly FranceBlock[] }

const verifiedAt = '2026-10-26'

export const FRANCE_SOURCES = {
  population: { label: 'INSEE · Estimativa de população em janeiro de 2026', url: 'https://www.insee.fr/fr/statistiques/serie/001641586', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/system/files/documents/global-report-document/hdr2025reporten.pdf', verifiedAt },
  language: { label: 'Campus France · Estudar em francês ou inglês', url: 'https://www.campusfrance.org/en/finding-a-university-programme-France', verifiedAt },
  climate: { label: 'Météo-France · Clima da França continental e Córsega', url: 'https://education.meteofrance.fr/changement-climatique/le-climat-en-france-hexagonale-et-corse', verifiedAt },
  tuition: { label: 'Campus France · Mensalidades 2026/27', url: 'https://www.campusfrance.org/en/tuition-fees-France', verifiedAt },
  scholarships: { label: 'Campus France · Bolsas para estudantes estrangeiros', url: 'https://www.campusfrance.org/en/bursaries-foreign-students', verifiedAt },
  eiffel: { label: 'Campus France · Chamada Eiffel 2027', url: 'https://www.campusfrance.org/fr/le-programme-de-bourses-france-excellence-eiffel', verifiedAt },
  etudesEnFrance: { label: 'Campus France Brasil · Candidatura via Études en France', url: 'https://www.bresil.campusfrance.org/candidatura-via-etudes-en-france', verifiedAt },
  application: { label: 'Campus France · Procedimento Études en France', url: 'https://www.campusfrance.org/en/application-etudes-en-france-procedure', verifiedAt },
  visa: { label: 'France-Visas · Visto de estudante', url: 'https://www.france-visas.gouv.fr/etudiant', verifiedAt },
  work: { label: 'Service-Public · Trabalho de estudante estrangeiro', url: 'https://www.service-public.fr/particuliers/vosdroits/F2728', verifiedAt },
  minimumWage: { label: 'Governo francês · Salário mínimo em 2026', url: 'https://www.info.gouv.fr/actualite/le-smic-revalorise-au-1er-janvier-2026', verifiedAt },
  afterGraduation: { label: 'Service-Public · Busca de emprego após os estudos', url: 'https://www.service-public.fr/particuliers/vosdroits/F17319', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, FranceSource>

export const FRANCE_SECTIONS: readonly FranceSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Confirme a língua do curso', intro: 'O francês é o idioma oficial; também há programas ministrados em inglês.', blocks: [
    { title: 'Cursos em francês', text: 'DELF, DALF, TCF e TEF podem ser usados para comprovar proficiência. Cada programa define quais certificados aceita e o nível necessário; não há um patamar único para toda graduação ou pós-graduação.', source: FRANCE_SOURCES.language },
    { title: 'Cursos em inglês', text: 'Verifique se o programa é totalmente ou parcialmente em inglês, as provas aceitas e as exigências para estágios e disciplinas opcionais.', source: FRANCE_SOURCES.language, link: { label: 'Pesquisar cursos no Campus France', url: FRANCE_SOURCES.language.url } },
    { title: 'Aprender francês', text: 'A proximidade com o português pode ajudar com o vocabulário, mas a pronúncia e o uso acadêmico exigem prática. Consulte cursos de idioma e os requisitos do seu programa.' },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Planeje-se pelo clima da cidade', intro: 'O oeste, o leste, o sul e as áreas de montanha apresentam condições diferentes.', blocks: [
    { title: 'Regiões climáticas', text: 'Météo-France distingue áreas oceânicas e oceânicas alteradas, semi-continentais, mediterrâneas e de montanha na França continental e na Córsega. Não use a previsão de Paris como média do país.', source: FRANCE_SOURCES.climate },
    { title: 'Consulte dados locais', text: 'Compare temperatura e chuva ao longo do ano na cidade onde pretende estudar, especialmente na época de chegada.', source: FRANCE_SOURCES.climate, link: { label: 'Ver os tipos de clima no Météo-France', url: FRANCE_SOURCES.climate.url } },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Confira as taxas e o custo da sua cidade', intro: 'Mensalidade e manutenção dependem da instituição, do programa e do local de estudo.', blocks: [
    { title: 'Tabela pública 2026/27', text: 'Nas instituições públicas cobertas pela tabela de taxas diferenciadas, o Campus France informa €2.902 por ano para graduação, €3.950 para mestrado e €398 para doutorado na edição 2026/27. Há situações de isenção e instituições com preços próprios.', note: 'Os valores não se aplicam automaticamente a todo brasileiro. Confirme o preço da instituição, a modalidade, o ano de ingresso e possíveis isenções.', source: FRANCE_SOURCES.tuition },
    { title: 'Moradia e despesas', text: 'Pesquise aluguel, alimentação, transporte, seguro e custos de chegada com a universidade e serviços locais. Registre a cidade, a moeda e o período de referência para montar um orçamento individual.' },
    { title: 'Financiamento antes do visto', text: 'Planeje como demonstrar recursos para o período de estudos. Confira os requisitos atuais no France-Visas e no consulado responsável.', source: FRANCE_SOURCES.visa },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Procure chamadas para seu nível e perfil', intro: 'A nacionalidade, a instituição e a edição determinam quem pode concorrer.', blocks: [
    { title: 'France Excellence Eiffel · sessão 2027', text: 'A chamada aberta em outubro de 2026 é voltada a mestrado e doutorado. A instituição francesa seleciona e envia a candidatura; estudantes não se inscrevem diretamente no Campus France. O prazo de 6 de janeiro de 2027 é para as instituições, portanto confirme o prazo interno do curso.', note: 'A indicação pela universidade não garante a bolsa. Leia as regras da edição para idade, área, duração e benefícios.', source: FRANCE_SOURCES.eiffel, link: { label: 'Consultar a chamada Eiffel 2027', url: FRANCE_SOURCES.eiffel.url } },
    { title: 'Bolsas da instituição', text: 'Sorbonne Université, ENS-PSL, Sciences Po e HEC Paris são instituições cujas páginas de financiamento podem ser pesquisadas. Benefícios, elegibilidade e datas variam por programa e edição.' },
    { title: 'Pesquisar outras opções', text: 'O Campus France reúne bolsas de governos, instituições, fundações e outros financiadores. Use filtros de nacionalidade, nível e área; confirme os detalhes no edital do responsável pela bolsa.', source: FRANCE_SOURCES.scholarships, link: { label: 'Pesquisar bolsas no Campus France', url: FRANCE_SOURCES.scholarships.url } },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare programas além dos rankings', intro: 'Posições mudam conforme a edição e a metodologia.', blocks: [
    { title: 'Instituições para conhecer', text: 'CentraleSupélec, École Polytechnique, ENS-PSL, ESSEC, HEC Paris, INSEAD, Paris-Saclay, Sciences Po e Sorbonne Université são exemplos em ordem alfabética, não um ranking.' },
    { title: 'O que comparar', text: 'Confira reconhecimento do curso, idioma, currículo, cidade, taxas, bolsas e apoio a estudantes internacionais. Se usar QS, THE ou ARWU, anote o ano e a metodologia.' },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Conheça o cotidiano sem estereótipos', intro: 'Costumes variam entre cidades e pessoas; informação local ajuda na chegada.', blocks: [
    { title: 'Convívio', text: 'Cumprimentar com “Bonjour” e usar “vous” em situações formais são práticas úteis para começar. Observe como as pessoas se dirigem a você e ajuste o tom.' },
    { title: 'Cultura e deslocamento', text: 'Laicidade tem papel importante na vida pública. Greves e manifestações podem afetar serviços e transportes, por isso consulte avisos locais em dias de viagem.' },
    { title: 'Datas e comunidade', text: 'A Festa Nacional ocorre em 14 de julho e a Fête de la Musique em 21 de junho. Para encontrar apoio brasileiro, consulte redes da universidade e confirme a representação consular responsável; não há aqui um número verificado de brasileiros residentes.', source: FRANCE_SOURCES.consular, link: { label: 'Consultar o e-Consular', url: FRANCE_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Anote os prazos do curso e da bolsa', intro: 'O calendário acadêmico geralmente começa no segundo semestre do ano, mas cada instituição publica suas datas.', blocks: [
    { title: 'Ano letivo', text: 'Muitos programas começam em setembro e se estendem até junho, com dois semestres. Verifique o calendário acadêmico do seu curso para matrícula, provas e férias.' },
    { title: 'Processos diferentes', text: 'Inscrição no curso, bolsa Eiffel ou outra ajuda, procedimento Études en France e visto podem ter etapas e prazos separados. O Parcoursup não é o caminho geral para candidatos brasileiros com formação brasileira.', source: FRANCE_SOURCES.application },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Siga a rota correspondente ao seu curso', intro: 'A plataforma e os documentos dependem do nível, da instituição e da sua formação anterior.', blocks: [
    { title: '1. Escolha o programa', text: 'Confirme nível, idioma, requisitos, taxa e prazo diretamente com a universidade.' },
    { title: '2. Verifique Études en France', text: 'O Brasil participa do procedimento Études en France, mas a aplicação exata depende do curso e da situação do candidato. Consulte a página do Campus France Brasil antes de abrir o processo.', source: FRANCE_SOURCES.etudesEnFrance, link: { label: 'Ver a orientação para o Brasil', url: FRANCE_SOURCES.etudesEnFrance.url } },
    { title: '3. Prepare documentos', text: 'Histórico, diploma, certificado de idioma, carta de motivação, currículo, recomendações e projeto de estudos podem ser exigidos. Confira traduções, formato e quantidade na página do programa.' },
    { title: '4. Revise e envie', text: 'Confirme todos os prazos, anexos e comprovantes de envio. Depois da admissão, consulte o procedimento de visto antes da viagem.', source: FRANCE_SOURCES.visa },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada no país', title: 'Prepare o visto adequado à duração do curso', intro: 'A admissão não substitui as formalidades de entrada e residência.', blocks: [
    { title: 'Visto de estudante', text: 'O France-Visas distingue o procedimento conforme a duração dos estudos. Para cursos superiores com mais de três meses, pode ser emitido visto de longa duração equivalente à autorização de residência, sujeito a formalidades após a chegada.', source: FRANCE_SOURCES.visa, link: { label: 'Consultar o France-Visas', url: FRANCE_SOURCES.visa.url } },
    { title: 'Após a conclusão', text: 'Pessoas de fora da UE que obtiveram na França um diploma de mestrado ou equivalente podem, em condições específicas, solicitar autorização para buscar emprego ou criar empresa. Confira elegibilidade e procedimento no Service-Public.', source: FRANCE_SOURCES.afterGraduation },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Acompanhe o limite anual de trabalho', intro: 'A permissão estudantil tem condições próprias; não planeje custear todo o curso com renda de trabalho.', blocks: [
    { title: 'Limite de 964 horas por ano', text: 'Para estudantes estrangeiros com visto ou título de residência adequado, o limite geral é de 964 horas de trabalho por ano. Isso corresponde a 60% da jornada anual legal; não equivale a um teto fixo de 20 horas em toda semana.', note: 'Há regras específicas por tipo de autorização e para trabalho além do limite. Consulte o órgão responsável antes de aceitar uma atividade.', source: FRANCE_SOURCES.work },
    { title: 'Salário mínimo em 2026', text: 'Na França metropolitana, o SMIC desde 1.º de janeiro de 2026 é de €12,02 brutos por hora ou €1.823,03 brutos por mês para jornada completa de 35 horas semanais. Há valor diferente em Mayotte; trabalho estudantil parcial não gera automaticamente o salário mensal integral.', source: FRANCE_SOURCES.minimumWage },
    { title: 'Orçamento realista', text: 'O France-Visas alerta que o trabalho de meio período é renda complementar e não cobre necessariamente todas as despesas. Compare a renda líquida esperada com o orçamento do curso e da cidade.', source: FRANCE_SOURCES.visa },
  ] },
]
