export type SingaporeSource = { label: string; url: string; verifiedAt: string }
export type SingaporeBlock = { title: string; text: string; note?: string; source?: SingaporeSource; link?: { label: string; url: string } }
export type SingaporeSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly SingaporeBlock[] }

const verifiedAt = '2026-10-28'

export const SINGAPORE_SOURCES = {
  population: { label: 'National Population and Talent Division · Population in Brief 2026', url: 'https://www.population.gov.sg/media-centre/population-in-brief-2026/', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  languages: { label: 'Singapore Statutes Online · Constituição, artigo 153A', url: 'https://sso.agc.gov.sg/Act/CONS1963?ProvIds=pr153A-', verifiedAt },
  homeLanguage: { label: 'SingStat · Censo de 2020, idiomas falados em casa', url: 'https://www.singstat.gov.sg/publication-resources/singapore-census-of-population-2020-statistical-release-1-demographic-characteristics-education-language-and-religion', verifiedAt },
  climate: { label: 'Meteorological Service Singapore · Clima', url: 'https://www.weather.gov.sg/climate-climate-of-singapore/', verifiedAt },
  singa: { label: 'A*STAR · Folheto oficial do SINGA', url: 'https://www.a-star.edu.sg/docs/librariesprovider1/default-document-library/scholarships/flyers/240711_ia_brochure.pdf?sfvrsn=9d134969_1', verifiedAt },
  nusScholarship: { label: 'NUS · International Undergraduate Scholarship', url: 'https://nus.edu.sg/oam/scholarships/scholarships-for-freshmen-singapore-permanent-residents/nus-international-undergraduate-scholarship', verifiedAt },
  ntuScholarships: { label: 'NTU · Scholarships and Awards', url: 'https://www.ntu.edu.sg/admissions/undergraduate/scholarships-and-awards', verifiedAt },
  nus: { label: 'National University of Singapore · Site oficial', url: 'https://www.nus.edu.sg/', verifiedAt },
  ntu: { label: 'Nanyang Technological University · Site oficial', url: 'https://www.ntu.edu.sg/', verifiedAt },
  smu: { label: 'Singapore Management University · Site oficial', url: 'https://www.smu.edu.sg/', verifiedAt },
  studentPass: { label: 'ICA · Solicitação do Student’s Pass', url: 'https://www.ica.gov.sg/reside/STP/apply', verifiedAt },
  cancelPass: { label: 'ICA · Cancelamento do Student’s Pass', url: 'https://www.ica.gov.sg/reside/STP/cancel', verifiedAt },
  work: { label: 'Ministry of Manpower · Trabalho de estudantes estrangeiros', url: 'https://www.mom.gov.sg/passes-and-permits/work-pass-exemption-for-foreign-students/', verifiedAt },
  graduate: { label: 'ICA · Long-Term Visit Pass para graduados em busca de trabalho', url: 'https://www.ica.gov.sg/reside/LTVP/apply/graduate-from-an-institute-of-higher-learning-seeking-employment-in-singapore', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, SingaporeSource>

export const SINGAPORE_SECTIONS: readonly SingaporeSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Entenda os idiomas do país e do curso', intro: 'O inglês é amplamente usado, mas a vida cotidiana também inclui outras línguas.', blocks: [
    { title: 'Quatro idiomas oficiais', text: 'Inglês, mandarim, malaio e tâmil são idiomas oficiais; o malaio é o idioma nacional. Verifique em que idioma o curso será ministrado e quais comprovantes de proficiência a universidade aceita.', source: SINGAPORE_SOURCES.languages },
    { title: 'Idioma em casa', text: 'No censo de 2020, o inglês era o idioma mais falado em casa por 48,3% dos residentes de cinco anos ou mais. Esse percentual descreve idioma, não origem étnica ou proficiência de toda a população.', source: SINGAPORE_SOURCES.homeLanguage },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Prepare-se para calor e chuva', intro: 'A localização próxima ao equador influencia a rotina durante todo o ano.', blocks: [
    { title: 'Clima tropical', text: 'O serviço meteorológico descreve temperaturas elevadas, umidade alta e chuva abundante ao longo do ano. Há períodos de monção, mas não estações seca e chuvosa claramente separadas.', source: SINGAPORE_SOURCES.climate, link: { label: 'Consultar o clima oficial', url: SINGAPORE_SOURCES.climate.url } },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Monte o orçamento em dólares de Singapura', intro: 'Mensalidade e moradia dependem do curso e da instituição.', blocks: [
    { title: 'Custos do campus e da cidade', text: 'Consulte a estimativa de despesas da universidade escolhida. Some mensalidade, acomodação, alimentação, transporte, seguro, materiais e despesas iniciais; não trate um valor médio sem fonte como orçamento suficiente.' },
    { title: 'Bolsa e compromisso financeiro', text: 'Confirme se o financiamento cobre taxa de curso e manutenção. Algumas modalidades de subsídio de mensalidade podem incluir obrigações após a formatura; leia as condições antes de aceitar.', source: SINGAPORE_SOURCES.nusScholarship },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Compare bolsas pelo nível de estudo', intro: 'Cobertura, critérios e prazos variam por programa e ciclo.', blocks: [
    { title: 'SINGA para pesquisa', text: 'O Singapore International Graduate Award, da A*STAR, apoia estudos de doutorado e pesquisa em instituições participantes. O folheto oficial descreve apoio à mensalidade, auxílio mensal e benefícios de viagem e instalação por até quatro anos. Confira os valores e o prazo do ciclo atual diretamente no programa.', source: SINGAPORE_SOURCES.singa, link: { label: 'Consultar o folheto da A*STAR', url: SINGAPORE_SOURCES.singa.url } },
    { title: 'Bolsa internacional da NUS', text: 'A NUS publica uma bolsa de graduação para estudantes internacionais de países elegíveis. A seleção considera a candidatura à graduação; o benefício está ligado ao MOE Tuition Grant, que pode gerar compromisso de trabalho após o curso. Leia todos os critérios antes de concluir que a bolsa se aplica ao seu caso.', source: SINGAPORE_SOURCES.nusScholarship, link: { label: 'Ver a bolsa da NUS', url: SINGAPORE_SOURCES.nusScholarship.url } },
    { title: 'Bolsas da NTU', text: 'A NTU reúne bolsas de graduação com regras próprias. O prazo de candidatura à bolsa acompanha a janela de admissão; confira a modalidade e a elegibilidade no edital correspondente.', source: SINGAPORE_SOURCES.ntuScholarships, link: { label: 'Ver bolsas da NTU', url: SINGAPORE_SOURCES.ntuScholarships.url } },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Encontre um programa compatível', intro: 'Estas universidades são pontos de partida, sem ordem de ranking.', blocks: [
    { title: 'National University of Singapore (NUS)', text: 'Consulte requisitos, taxas, calendário e financiamento do curso desejado.', source: SINGAPORE_SOURCES.nus, link: { label: 'Explorar a NUS', url: SINGAPORE_SOURCES.nus.url } },
    { title: 'Nanyang Technological University (NTU)', text: 'Compare opções de graduação, pós-graduação e pesquisa na página oficial.', source: SINGAPORE_SOURCES.ntu, link: { label: 'Explorar a NTU', url: SINGAPORE_SOURCES.ntu.url } },
    { title: 'Singapore Management University (SMU)', text: 'Verifique o programa específico, suas exigências e bolsas disponíveis.', source: SINGAPORE_SOURCES.smu, link: { label: 'Explorar a SMU', url: SINGAPORE_SOURCES.smu.url } },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Conheça a rotina antes de chegar', intro: 'Idioma, moradia e regras locais fazem parte do planejamento.', blocks: [
    { title: 'Vida cotidiana', text: 'Singapura reúne comunidades, idiomas e tradições diferentes. Centros de alimentação conhecidos como hawker centres são uma opção para conhecer a culinária local. Consulte as orientações da universidade sobre chegada e moradia.' },
    { title: 'Apoio consular', text: 'Para serviços consulares brasileiros, consulte a Embaixada do Brasil em Singapura e os canais do Itamaraty.', source: SINGAPORE_SOURCES.consular, link: { label: 'Acessar o e-Consular', url: SINGAPORE_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Anote o prazo de cada curso e bolsa', intro: 'Não há uma janela única válida para todas as instituições.', blocks: [
    { title: 'Admissão', text: 'Consulte o ano acadêmico, a data de início e o prazo da candidatura no programa desejado. Graduação, pós-graduação e pesquisa podem ter calendários diferentes.' },
    { title: 'Financiamento', text: 'Algumas bolsas exigem candidatura própria ou seguem a janela de admissão. No caso da NTU, verifique a bolsa antes de receber o resultado de admissão; não espere pela oferta para conferir o prazo.', source: SINGAPORE_SOURCES.ntuScholarships },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Prepare uma candidatura verificável', intro: 'O edital do programa determina documentos e etapas.', blocks: [
    { title: '1. Compare programas', text: 'Verifique conteúdo, nível de estudo, idioma, taxas, perfil de pesquisa e requisitos acadêmicos diretamente com a instituição.' },
    { title: '2. Confirme a bolsa', text: 'Leia a cobertura, os critérios, a duração, possíveis compromissos posteriores e o prazo. A possibilidade de se candidatar não equivale à aprovação.', source: SINGAPORE_SOURCES.nusScholarship },
    { title: '3. Organize os documentos', text: 'Prepare histórico, certificados, referências e comprovantes de idioma apenas conforme as instruções do curso e da bolsa. Reserve tempo para traduções, se exigidas.' },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada e permanência', title: 'Confira as condições do Student’s Pass', intro: 'Estudar e permanecer no país exigem autorização adequada.', blocks: [
    { title: 'Antes de viajar', text: 'Em geral, estrangeiros aceitos em curso de tempo integral precisam solicitar o Student’s Pass à Immigration & Checkpoints Authority (ICA), salvo exceções previstas. As etapas dependem do tipo de instituição.', source: SINGAPORE_SOURCES.studentPass, link: { label: 'Consultar a ICA', url: SINGAPORE_SOURCES.studentPass.url } },
    { title: 'Ao encerrar os estudos', text: 'A ICA orienta cancelar o Student’s Pass em até sete dias depois de encerrar ou interromper os estudos. Planeje qualquer permanência posterior antes de perder a autorização válida.', source: SINGAPORE_SOURCES.cancelPass },
    { title: 'Busca de emprego após a graduação', text: 'Graduados de instituições de ensino superior elegíveis podem consultar a opção de Long-Term Visit Pass para buscar emprego. A concessão depende da ICA; para trabalhar depois dos estudos, verifique o work pass adequado.', source: SINGAPORE_SOURCES.graduate, link: { label: 'Ver a opção para graduados', url: SINGAPORE_SOURCES.graduate.url } },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Verifique se sua instituição permite trabalho', intro: 'O Student’s Pass, por si só, não autoriza qualquer emprego.', blocks: [
    { title: 'Durante o período letivo', text: 'Estudantes de tempo integral com Student’s Pass em instituições listadas pelo Ministry of Manpower podem trabalhar sem outro work pass por até 16 horas semanais, ou em estágio que atenda aos requisitos do curso. Confira a lista e as condições da sua instituição.', source: SINGAPORE_SOURCES.work },
    { title: 'Durante as férias', text: 'Há uma lista própria de instituições para a isenção nas férias. A regra exige, entre outras condições, matrícula em tempo integral, Student’s Pass válido e idade mínima de 14 anos. Estudantes de intercâmbio não podem trabalhar sob essa isenção.', source: SINGAPORE_SOURCES.work, link: { label: 'Ver as regras do MOM', url: SINGAPORE_SOURCES.work.url } },
  ] },
]
