export type UnitedStatesSource = { label: string; url: string; verifiedAt: string }
export type UnitedStatesBlock = { title: string; text: string; note?: string; source?: UnitedStatesSource; link?: { label: string; url: string } }
export type UnitedStatesSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly UnitedStatesBlock[] }

const verifiedAt = '2026-10-26'

export const UNITED_STATES_SOURCES = {
  population: { label: 'U.S. Census Bureau · Estimativa de 2025', url: 'https://www.census.gov/quickfacts/fact/table/US/PST040224', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/specific-country-data', verifiedAt },
  climate: { label: 'National Weather Service · Dados climáticos', url: 'https://www.weather.gov/wrh/climate', verifiedAt },
  costs: { label: 'EducationUSA · Financiamento da graduação', url: 'https://educationusa.state.gov/your-5-steps-us-study/finance-your-studies/undergraduate', verifiedAt },
  fulbright: { label: 'Comissão Fulbright Brasil · Bolsas para brasileiros', url: 'https://fulbright.org.br/bolsas-para-brasileiros/', verifiedAt },
  fulbright2026: { label: 'Agência FAPESP · Chamada Fulbright de julho de 2026', url: 'https://agencia.fapesp.br/programa-fulbright-tem-bolsas-para-brasileiros/58740', verifiedAt },
  openDoors: { label: 'IIE Open Doors · Dados rápidos de 2025', url: 'https://opendoorsdata.org/wp-content/uploads/2025/11/OD25_Fast-Facts.pdf', verifiedAt },
  educationUSA: { label: 'EducationUSA · Cinco passos para estudar nos EUA', url: 'https://educationusa.state.gov/your-5-steps-us-study', verifiedAt },
  visa: { label: 'U.S. Department of State · Visto de estudante', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html', verifiedAt },
  employment: { label: 'ICE/SEVP · Trabalho de estudantes F-1', url: 'https://www.ice.gov/sevis/employment', verifiedAt },
  practicalTraining: { label: 'ICE/SEVP · CPT e OPT', url: 'https://www.ice.gov/sevis/practical-training', verifiedAt },
  rule: { label: 'Federal Register · Regra publicada em julho de 2026', url: 'https://www.govinfo.gov/content/pkg/FR-2026-07-17/pdf/2026-14439.pdf', verifiedAt },
  injunction: { label: 'NAFSA · Suspensão judicial da regra em setembro de 2026', url: 'https://www.nafsa.org/legal-defense-DS', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, UnitedStatesSource>

export const UNITED_STATES_SECTIONS: readonly UnitedStatesSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Confirme a proficiência exigida pelo curso', intro: 'O inglês predomina na vida acadêmica, mas cada instituição define seus critérios.', blocks: [
    { title: 'Certificados de inglês', text: 'TOEFL, IELTS e outras provas podem ser aceitos. Consulte os testes, notas mínimas, validade e possíveis dispensas diretamente na página de admissão do programa.' },
    { title: 'Além da prova', text: 'Leia a descrição das aulas, avaliações, estágio e serviços de apoio para entender o uso cotidiano do inglês no curso.' },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Compare o clima da cidade escolhida', intro: 'O território é grande: não há um clima único para os Estados Unidos.', blocks: [
    { title: 'Regiões e estações', text: 'Áreas da Califórnia têm clima mediterrâneo, o Nordeste costuma ter invernos frios, partes do Sul são quentes e úmidas, e o interior pode ter grandes variações. A cidade importa mais que a média nacional.' },
    { title: 'Planeje a chegada', text: 'Consulte médias mensais e alertas meteorológicos locais para a época em que começará a estudar.', source: UNITED_STATES_SOURCES.climate, link: { label: 'Consultar dados climáticos', url: UNITED_STATES_SOURCES.climate.url } },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Use o orçamento publicado pela universidade', intro: 'Mensalidades e despesas variam muito entre instituições, cidades e modalidades.', blocks: [
    { title: 'Custo total de frequência', text: 'Procure “cost of attendance” e veja separadamente tuition, taxas, moradia, alimentação, seguro, transporte e materiais. Confirme o ano acadêmico e os valores para estudantes internacionais.', source: UNITED_STATES_SOURCES.costs },
    { title: 'Planejamento em dólares', text: 'Monte o orçamento em USD, inclua custos de candidatura e chegada e confira se a bolsa cobre apenas a mensalidade ou também a manutenção. Não use uma faixa nacional como preço do seu curso.' },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Encontre oportunidades para o seu perfil', intro: 'Cobertura, elegibilidade e prazo são definidos em cada edital.', blocks: [
    { title: 'Fulbright Brasil', text: 'A Comissão Fulbright mantém uma lista de oportunidades para brasileiros, sobretudo em modalidades acadêmicas e de pesquisa. Confira a chamada atual: programas, benefícios e datas mudam a cada edição.', note: 'A existência do programa não significa que toda bolsa esteja aberta ou que todo candidato brasileiro atenda aos requisitos.', source: UNITED_STATES_SOURCES.fulbright, link: { label: 'Ver bolsas para brasileiros', url: UNITED_STATES_SOURCES.fulbright.url } },
    { title: 'Exemplo de edição encerrada', text: 'Em julho de 2026, a Agência FAPESP divulgou 81 vagas Fulbright para brasileiros: 9 cátedras, até 50 bolsas de doutorado sanduíche, 12 para ensino de português e 10 para professores ou pesquisadores visitantes. O prazo divulgado foi 2 de agosto de 2026.', note: 'Esta chamada está encerrada. Consulte a página da Fulbright para encontrar a próxima edição e os requisitos de cada modalidade.', source: UNITED_STATES_SOURCES.fulbright2026 },
    { title: 'Ajuda financeira da universidade', text: 'Pesquise apoio por mérito, necessidade financeira, área de estudo ou esporte. A disponibilidade para estudantes internacionais varia; a instituição informa se o pedido é automático ou separado.', source: UNITED_STATES_SOURCES.costs },
    { title: 'Compare a cobertura', text: 'Anote o que a bolsa paga, por quanto tempo e quais condições precisam ser mantidas. Use o orçamento total do curso para calcular o valor que ainda faltará.' },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Escolha pelo programa e pelo apoio disponível', intro: 'Rankings mudam por ano e metodologia; a adequação do curso merece atenção própria.', blocks: [
    { title: 'Instituições para pesquisar', text: 'Harvard University, Massachusetts Institute of Technology (MIT) e Stanford University são exemplos em ordem alfabética, não uma classificação.' },
    { title: 'Critérios úteis', text: 'Compare currículo, pesquisa, localização, custo total, ajuda financeira, requisitos de admissão e suporte a estudantes internacionais.' },
    { title: 'Presença internacional', text: 'O Open Doors 2025 registrou 1.177.766 estudantes internacionais em 2024/25, incluindo participantes em treinamento prático opcional (OPT); 17.277 eram do Brasil.', note: 'Esses dados descrevem um ano acadêmico passado e não indicam chance de admissão.', source: UNITED_STATES_SOURCES.openDoors },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Prepare a rotina além da sala de aula', intro: 'A experiência varia entre estados, cidades e comunidades universitárias.', blocks: [
    { title: 'Convivência', text: 'O trato pode ser informal, redes de contato são relevantes e gorjetas são comuns em restaurantes. Observe os costumes da cidade e da instituição escolhidas.' },
    { title: 'Comunidade brasileira', text: 'O Open Doors registrou 17.277 estudantes brasileiros em 2024/25. Esse número não representa toda a população brasileira residente nos Estados Unidos.', source: UNITED_STATES_SOURCES.openDoors },
    { title: 'Apoio consular', text: 'Localize o consulado brasileiro responsável por sua região e confira os serviços oficiais antes de viajar.', source: UNITED_STATES_SOURCES.consular, link: { label: 'Consultar serviços consulares', url: UNITED_STATES_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Siga as datas de cada instituição', intro: 'O semestre de outono costuma começar em agosto ou setembro, mas o calendário não é nacional.', blocks: [
    { title: 'Ano acadêmico', text: 'Muitas instituições têm semestres de outono e primavera, com sessão de verão opcional. Veja as datas de matrícula, orientação e início das aulas no programa.' },
    { title: 'Prazos de candidatura', text: 'Early action, regular decision e outras modalidades podem ter datas diferentes. Registre separadamente os prazos de curso, bolsa, testes e visto.' },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Confira cada exigência antes de enviar', intro: 'Testes e documentos mudam conforme o nível de estudo e a universidade.', blocks: [
    { title: '1. Selecione o curso', text: 'Confira área, currículo, custo, ajuda financeira e requisitos para formação obtida no Brasil.', source: UNITED_STATES_SOURCES.educationUSA },
    { title: '2. Verifique provas', text: 'SAT, ACT, GRE, GMAT e provas de inglês podem ser exigidos, opcionais ou dispensados. Consulte a política atual do curso; não presuma uma regra para todas as instituições.' },
    { title: '3. Prepare a candidatura', text: 'Histórico, recomendações, redação pessoal (essay ou personal statement) e comprovantes de idioma são exemplos comuns. Confira traduções, formato e limite de palavras.' },
    { title: '4. Revise e envie', text: 'Use o portal indicado pela instituição, como o Common App quando aplicável. Confirme anexos, prazo e recebimento da candidatura.', link: { label: 'Conhecer o Common App', url: 'https://www.commonapp.org/' } },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada no país', title: 'Planeje o visto conforme o seu programa', intro: 'A instituição e o consulado orientam as etapas para seu caso.', blocks: [
    { title: 'Visto de estudante', text: 'Após a admissão, confirme se o programa emite o formulário necessário para o visto F-1 ou outra categoria. Consulte taxas, documentos e entrevista nas fontes oficiais antes de viajar.', source: UNITED_STATES_SOURCES.visa },
    { title: 'Regra de permanência de 2026 suspensa', text: 'Uma regra publicada em julho de 2026 previa substituir “duration of status” por prazo fixo de admissão. Decisão judicial de 14 de setembro suspendeu sua entrada em vigor. Em 26/10/2026, o modelo anterior permanecia em vigor enquanto o processo seguia.', note: 'Não planeje prazo de saída, extensão ou transferência com base na regra suspensa. Confirme alterações com o escritório internacional da universidade e as autoridades oficiais.', source: UNITED_STATES_SOURCES.injunction, link: { label: 'Ler a regra publicada', url: UNITED_STATES_SOURCES.rule.url } },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante e após o curso', title: 'Peça orientação antes de começar qualquer trabalho', intro: 'O tipo de atividade e a autorização F-1 determinam o que é permitido.', blocks: [
    { title: 'No campus', text: 'Estudantes F-1 elegíveis podem trabalhar até 20 horas por semana durante as aulas e mais durante recessos oficiais, conforme as regras aplicáveis. Confirme procedimentos com o escritório internacional (DSO) antes de começar.', source: UNITED_STATES_SOURCES.employment },
    { title: 'CPT e OPT', text: 'CPT é treinamento curricular autorizado pelo DSO e registrado no formulário I-20. OPT é treinamento ligado à área de estudo e depende de pedido de autorização ao USCIS. Há condições de tempo, carga horária e elegibilidade.', source: UNITED_STATES_SOURCES.practicalTraining },
    { title: 'Extensão STEM OPT', text: 'Alguns cursos elegíveis em ciência, tecnologia, engenharia e matemática permitem solicitar extensão de 24 meses do OPT, sujeita a requisitos do estudante e do empregador. Verifique sua elegibilidade e a autorização antes de trabalhar.', source: UNITED_STATES_SOURCES.practicalTraining },
    { title: 'Remuneração', text: 'Salários e pisos variam por estado, cidade e função. Não use uma faixa horária nacional como expectativa de renda para financiar todo o curso.' },
  ] },
]
