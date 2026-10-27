export type NetherlandsSource = { label: string; url: string; verifiedAt: string }
export type NetherlandsBlock = { title: string; text: string; note?: string; source?: NetherlandsSource; link?: { label: string; url: string } }
export type NetherlandsSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly NetherlandsBlock[] }

const verifiedAt = '2026-10-27'

export const NETHERLANDS_SOURCES = {
  population: { label: 'CBS · População mensal, agosto de 2026', url: 'https://www.cbs.nl/en-gb/figures/detail/83474ENG', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  language: { label: 'Study in NL · Requisitos de admissão e idioma', url: 'https://www.studyinnl.org/plan-your-stay/admission-requirements', verifiedAt },
  dutch: { label: 'Study in NL · Cursos em neerlandês', url: 'https://www.studyinnl.org/dutch-education/study-programmes-in-dutch', verifiedAt },
  climate: { label: 'KNMI · Dados mensais e anuais', url: 'https://www.knmi.nl/nederland-nu/klimatologie/maandgegevens', verifiedAt },
  housing: { label: 'Study in NL · Encontrar moradia', url: 'https://www.studyinnl.org/life-in-nl/finding-a-place-to-live', verifiedAt },
  tuition: { label: 'Study in NL · Taxas de ensino 2026/27', url: 'https://www.studyinnl.org/finances/tuition-fees', verifiedAt },
  scholarship: { label: 'Study in NL · NL Scholarship', url: 'https://www.studyinnl.org/finances/nl-scholarship', verifiedAt },
  groningen: { label: 'Universidade de Groningen · NL Scholarship para mestrado', url: 'https://www.rug.nl/education/master/international-students/financial-matters/holland-scholarship/?lang=en', verifiedAt },
  institutions: { label: 'Study in NL · Universidades de pesquisa', url: 'https://www.studyinnl.org/dutch-education/research-universities', verifiedAt },
  application: { label: 'Study in NL · Como se candidatar', url: 'https://www.studyinnl.org/plan-your-stay/how-to-apply', verifiedAt },
  residence: { label: 'IND · Permissão de residência para ensino superior', url: 'https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education', verifiedAt },
  orientation: { label: 'IND · Permissão para ano de orientação', url: 'https://ind.nl/en/residence-permits/work/residence-permit-for-orientation-year', verifiedAt },
  minimumWage: { label: 'Governo neerlandês · Salário mínimo por hora', url: 'https://www.government.nl/themes/work/minimum-wage/minimum-wage-amounts', verifiedAt },
  arrival: { label: 'Study in NL · Providências após a chegada', url: 'https://www.studyinnl.org/life-in-nl/to-do-after-arrival', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, NetherlandsSource>

export const NETHERLANDS_SECTIONS: readonly NetherlandsSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Escolha o curso e confirme o idioma', intro: 'Há programas em inglês e em neerlandês. A instituição define a comprovação necessária.', blocks: [
    { title: 'Cursos em inglês', text: 'Muitas instituições oferecem programas em inglês. Testes como IELTS e TOEFL podem ser aceitos, mas a prova e a pontuação exigidas variam por curso; consulte o edital do programa.', source: NETHERLANDS_SOURCES.language },
    { title: 'Neerlandês no cotidiano', text: 'Aprender neerlandês ajuda na vida diária e pode ampliar opções de trabalho. Para programas ministrados nesse idioma, confirme o nível e o exame aceito pela instituição.', source: NETHERLANDS_SOURCES.dutch },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Consulte o clima da sua cidade', intro: 'A influência marítima traz vento e chuva em diferentes épocas do ano.', blocks: [
    { title: 'Planeje a chegada', text: 'Consulte os registros mensais de temperatura e precipitação do KNMI para a região onde pretende estudar. Evite usar uma previsão de poucos dias como referência para o ano todo.', source: NETHERLANDS_SOURCES.climate, link: { label: 'Consultar dados do KNMI', url: NETHERLANDS_SOURCES.climate.url } },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Comece o orçamento pela moradia', intro: 'Aluguel e mensalidade variam bastante entre cidades, instituições e programas.', blocks: [
    { title: 'Taxas para estudantes de fora do EEE', text: 'O Study in NL informa, para 2026/27, faixas médias anuais de €9.000 a €20.000 na graduação e €12.000 a €30.000 no mestrado para estudantes de fora da União Europeia e do Espaço Econômico Europeu. São referências, não o preço do seu curso.', note: 'Confira a taxa exata, possíveis custos de inscrição e o ano de ingresso na página da instituição.', source: NETHERLANDS_SOURCES.tuition },
    { title: 'Moradia exige antecedência', text: 'O Study in NL alerta para a falta de acomodação estudantil em várias cidades e recomenda organizar a moradia antes da chegada. Verifique se a universidade oferece apoio e compare opções legítimas.', source: NETHERLANDS_SOURCES.housing, link: { label: 'Ler orientações de moradia', url: NETHERLANDS_SOURCES.housing.url } },
    { title: 'Outras despesas', text: 'Monte o orçamento com alimentação, transporte, seguro, materiais e gastos iniciais. Use estimativas da universidade e da cidade escolhida, anotando moeda e período de referência.' },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Compare a bolsa com o custo total', intro: 'Uma bolsa parcial pode ajudar sem cobrir mensalidade, moradia e demais despesas.', blocks: [
    { title: 'NL Scholarship', text: 'O programa nacional oferece €5.000 no primeiro ano para candidatos de fora do EEE em graduação ou mestrado de tempo integral em instituições participantes. Não é bolsa integral. Confira a lista de instituições, as exigências e o prazo específicos de cada uma.', source: NETHERLANDS_SOURCES.scholarship, link: { label: 'Consultar a NL Scholarship', url: NETHERLANDS_SOURCES.scholarship.url } },
    { title: 'Exemplo: Universidade de Groningen', text: 'Na oferta de Groningen, a NL Scholarship é voltada a mestrados selecionados e contribui para despesas de vida. A página consultada ainda informa prazo de 1.º de fevereiro de 2026 para a edição 2026/27; não use essa data para uma candidatura futura.', source: NETHERLANDS_SOURCES.groningen },
    { title: 'Outras bolsas', text: 'Busque a página de financiamento da universidade e confira curso, nacionalidade, valor, condições e edição. Uma referência antiga a uma bolsa não confirma que ela continua aberta.' },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare o programa, não só o nome', intro: 'Rankings variam por edição e método; currículo e custo podem pesar mais para sua escolha.', blocks: [
    { title: 'Instituições para pesquisar', text: 'TU Delft, University of Amsterdam e Utrecht University são exemplos de universidades de pesquisa. A lista é ilustrativa, sem ordem de qualidade ou posição em ranking.', source: NETHERLANDS_SOURCES.institutions },
    { title: 'O que verificar', text: 'Compare reconhecimento do curso, idioma, taxas, cidade, apoio a estudantes internacionais e oportunidades ligadas à sua área. Se usar um ranking, observe edição, ano e metodologia.' },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Prepare a rotina além das aulas', intro: 'Transporte, moradia e registros locais fazem parte da chegada.', blocks: [
    { title: 'Primeiros dias', text: 'A bicicleta é comum no deslocamento, mas confira as opções e regras da sua cidade. Seja pontual em compromissos e observe o estilo de comunicação das pessoas, sem presumir que todos agem da mesma forma.' },
    { title: 'Registro local', text: 'Para estadias superiores a quatro meses, o Study in NL orienta o registro no município para obter o BSN, número necessário para vários serviços. Consulte a universidade e a prefeitura sobre documentos.', source: NETHERLANDS_SOURCES.arrival },
    { title: 'Apoio brasileiro', text: 'Procure a equipe internacional da instituição e confirme no e-Consular a representação brasileira responsável. Não há aqui estimativa verificada da comunidade brasileira.', source: NETHERLANDS_SOURCES.consular },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Anote os prazos do seu curso', intro: 'Instituições e programas podem ter calendários distintos.', blocks: [
    { title: 'Início das aulas', text: 'Muitos programas começam em setembro; alguns têm entrada em fevereiro. Confira datas de candidatura, matrícula e chegada diretamente na página do curso.' },
    { title: 'Seleção e Studielink', text: 'A inscrição de muitos cursos passa pelo Studielink, mas algumas instituições usam outro processo para candidatos internacionais. Cursos com seleção limitada podem ter prazos anteriores. Confirme o procedimento e o horário limite do seu programa.', source: NETHERLANDS_SOURCES.application },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Siga as etapas exigidas pela instituição', intro: 'A universidade define como avaliar formação anterior, idioma e documentos.', blocks: [
    { title: '1. Selecione programas', text: 'Confira currículo, idioma, taxa, requisitos acadêmicos e prazo. Para diplomas brasileiros, a instituição decide como avaliar a equivalência.', source: NETHERLANDS_SOURCES.language },
    { title: '2. Confirme o canal de inscrição', text: 'Verifique se o curso usa Studielink e se existe uma etapa própria no portal da universidade. Não presuma que a inscrição em uma plataforma concluiu a candidatura.', source: NETHERLANDS_SOURCES.application, link: { label: 'Ver instruções do Study in NL', url: NETHERLANDS_SOURCES.application.url } },
    { title: '3. Prepare os documentos', text: 'Histórico, diploma, comprovante de idioma e carta de motivação podem ser pedidos. Confira traduções, legalização e demais exigências na página do programa e, após admissão, no IND.', source: NETHERLANDS_SOURCES.residence },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada no país', title: 'Planeje a residência após a admissão', intro: 'A instituição reconhecida inicia o pedido de residência estudantil junto ao IND.', blocks: [
    { title: 'Permissão para estudar', text: 'Para o ensino superior, a instituição patrocinadora reconhecida solicita a permissão de residência e, quando exigido, a autorização provisória de entrada (MVV). Verifique recursos financeiros, documentos e instruções específicas para seu caso.', source: NETHERLANDS_SOURCES.residence, link: { label: 'Consultar as regras do IND', url: NETHERLANDS_SOURCES.residence.url } },
    { title: 'Depois da graduação', text: 'O IND oferece uma permissão de um ano, chamada orientation year, para pessoas que cumprem condições de formação ou pesquisa. Ela permite procurar emprego; confirme sua elegibilidade e o momento da solicitação.', source: NETHERLANDS_SOURCES.orientation },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Entenda a escolha entre horas semanais e verão', intro: 'Trabalho remunerado depende das condições da sua permissão de residência.', blocks: [
    { title: 'Emprego com autorização', text: 'O empregador solicita ao UWV a autorização de trabalho (TWV). O estudante escolhe entre trabalhar até 16 horas por semana ou em tempo integral apenas em junho, julho e agosto; não pode somar os dois esquemas.', source: NETHERLANDS_SOURCES.residence },
    { title: 'Autônomo e estágio', text: 'O IND permite trabalho autônomo sem TWV e sem limite específico de horas, desde que a pessoa mantenha as condições da residência, registre a atividade na KvK e pague impostos. Estágio que integra o curso também dispensa TWV; confirme as condições com a instituição.', source: NETHERLANDS_SOURCES.residence },
    { title: 'Seguro e salário mínimo', text: 'Trabalhar pode exigir seguro de saúde holandês. Desde 1.º de julho de 2026, o salário mínimo legal é de €14,99 brutos por hora para pessoas de 21 anos ou mais; para menores de 21, os valores são diferentes. A renda mensal depende das horas efetivamente trabalhadas.', source: NETHERLANDS_SOURCES.minimumWage, link: { label: 'Ver a tabela salarial oficial', url: NETHERLANDS_SOURCES.minimumWage.url } },
  ] },
]
