export type UnitedKingdomSource = { label: string; url: string; verifiedAt: string }
export type UnitedKingdomBlock = { title: string; text: string; note?: string; source?: UnitedKingdomSource; link?: { label: string; url: string } }
export type UnitedKingdomSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly UnitedKingdomBlock[] }

const verifiedAt = '2026-10-28'

export const UNITED_KINGDOM_SOURCES = {
  population: { label: 'ONS · Estimativa populacional de 2025', url: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/annualmidyearpopulationestimates/latest', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  studentVisa: { label: 'GOV.UK · Student visa', url: 'https://www.gov.uk/student-visa', verifiedAt },
  visaMoney: { label: 'GOV.UK · Recursos para o Student visa', url: 'https://www.gov.uk/student-visa/money', verifiedAt },
  visaChanges: { label: 'GOV.UK · Alterações das regras de imigração HC 584', url: 'https://www.gov.uk/government/publications/statement-of-changes-to-the-immigration-rules-hc-584-3-september-2026/statement-of-changes-to-the-immigration-rules-hc-584-3-september-2026-accessible', verifiedAt },
  cheveningBrazil: { label: 'Chevening · Bolsas para o Brasil', url: 'https://www.chevening.org/scholarship/brazil/', verifiedAt },
  cheveningEligibility: { label: 'Chevening · Critérios de elegibilidade', url: 'https://www.chevening.org/resource-hub/guidance/eligibility/', verifiedAt },
  oxford: { label: 'Universidade de Oxford · Site oficial', url: 'https://www.ox.ac.uk/', verifiedAt },
  cambridge: { label: 'Universidade de Cambridge · Site oficial', url: 'https://www.cam.ac.uk/', verifiedAt },
  imperial: { label: 'Imperial College London · Site oficial', url: 'https://www.imperial.ac.uk/', verifiedAt },
  ucas: { label: 'UCAS · Datas de candidatura', url: 'https://www.ucas.com/applying/applying-to-university/dates-and-deadlines-for-uni-applications', verifiedAt },
  work: { label: 'GOV.UK · Regras de imigração para estudantes', url: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-student', verifiedAt },
  wage: { label: 'GOV.UK · Salário mínimo nacional', url: 'https://www.gov.uk/national-minimum-wage-rates', verifiedAt },
  graduate: { label: 'GOV.UK · Regras do Graduate visa', url: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-graduate', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, UnitedKingdomSource>

export const UNITED_KINGDOM_SECTIONS: readonly UnitedKingdomSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Confira o inglês exigido pelo curso', intro: 'O idioma principal é o inglês, mas requisitos de admissão e visto dependem do programa.', blocks: [
    { title: 'Inglês no dia a dia', text: 'Sotaques e dialetos variam entre regiões. Galês e gaélico escocês também têm uso regional. Planeje a adaptação linguística conforme a cidade escolhida.' },
    { title: 'Admissão e visto', text: 'A instituição define os comprovantes de proficiência aceitos para o curso. O visto de estudante também tem requisitos de inglês; confira como a instituição e o governo britânico tratam seu caso antes de pagar por um teste.', source: UNITED_KINGDOM_SOURCES.studentVisa, link: { label: 'Conferir o Student visa', url: UNITED_KINGDOM_SOURCES.studentVisa.url } },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Pesquise o clima da cidade', intro: 'O tempo varia conforme a região e a época do ano.', blocks: [
    { title: 'Planejamento local', text: 'O Reino Unido tem clima geralmente temperado e tempo variável. Chuva, vento e temperatura diferem entre cidades; consulte as médias locais e o calendário do curso antes de preparar roupas e orçamento.' },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Calcule curso, moradia e visto em libras', intro: 'Mensalidade e custo de vida variam bastante entre cursos e cidades.', blocks: [
    { title: 'Orçamento da cidade', text: 'Peça à universidade uma estimativa para moradia, alimentação, transporte e materiais. Compare o custo do seu campus, especialmente se estiver em Londres; não use uma média nacional como orçamento pessoal.' },
    { title: 'Recursos para pedidos antes de 30/11/2026', text: 'Para o Student visa, o valor de manutenção é £1.529 por mês em Londres ou £1.171 fora de Londres, por até nove meses. Some a parte da taxa do curso ainda não paga e confira as regras de comprovação.', source: UNITED_KINGDOM_SOURCES.visaMoney },
    { title: 'Mudança a partir de 30/11/2026', text: 'As regras publicadas elevam a manutenção para £1.570 por mês em Londres ou £1.203 fora de Londres, por até nove meses. O valor aplicável depende da data do pedido.', source: UNITED_KINGDOM_SOURCES.visaChanges },
    { title: 'Comprovantes financeiros', text: 'Em geral, os recursos precisam estar disponíveis por pelo menos 28 dias. O Brasil está na lista de nacionalidades que normalmente não precisam enviar os comprovantes financeiros com o pedido, mas a imigração pode solicitá-los posteriormente. A obrigação de ter os recursos permanece.', source: UNITED_KINGDOM_SOURCES.visaMoney },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Procure bolsas vinculadas ao curso', intro: 'Cada programa define cobertura, elegibilidade e calendário próprios.', blocks: [
    { title: 'Chevening para brasileiros', text: 'A bolsa Chevening apoia mestrados de um ano no Reino Unido. O ciclo de 2027/28 está encerrado em 28/10/2026. Antes de planejar uma candidatura futura, confira os requisitos completos e a nova janela de inscrições.', source: UNITED_KINGDOM_SOURCES.cheveningBrazil, link: { label: 'Consultar Chevening Brasil', url: UNITED_KINGDOM_SOURCES.cheveningBrazil.url } },
    { title: 'Critérios da Chevening', text: 'Entre os requisitos estão pelo menos 2.800 horas de experiência profissional após a graduação e o compromisso de retornar ao país de origem por dois anos depois da bolsa. A seleção depende de todos os critérios oficiais.', source: UNITED_KINGDOM_SOURCES.cheveningEligibility },
    { title: 'Bolsas universitárias', text: 'Verifique a página de financiamento de cada universidade e curso. Compare cobertura da mensalidade e manutenção, condições para estudantes internacionais e prazo de candidatura; uma vaga no curso não garante bolsa.' },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Comece pelo programa, não pelo ranking', intro: 'Estas instituições são exemplos para iniciar a pesquisa, sem ordem de classificação.', blocks: [
    { title: 'Universidade de Oxford', text: 'Compare requisitos, custos e formas de financiamento na página do curso.', source: UNITED_KINGDOM_SOURCES.oxford, link: { label: 'Explorar Oxford', url: UNITED_KINGDOM_SOURCES.oxford.url } },
    { title: 'Universidade de Cambridge', text: 'Confira o calendário e as exigências do departamento desejado.', source: UNITED_KINGDOM_SOURCES.cambridge, link: { label: 'Explorar Cambridge', url: UNITED_KINGDOM_SOURCES.cambridge.url } },
    { title: 'Imperial College London', text: 'Veja idioma, taxas e oportunidades de apoio para o programa de interesse.', source: UNITED_KINGDOM_SOURCES.imperial, link: { label: 'Explorar Imperial', url: UNITED_KINGDOM_SOURCES.imperial.url } },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Prepare sua chegada', intro: 'A rotina muda conforme cidade, campus e comunidade.', blocks: [
    { title: 'Apoio da universidade', text: 'Procure o setor de estudantes internacionais para entender moradia, matrícula, saúde e acolhimento. Converse com estudantes do curso para conhecer a rotina local.' },
    { title: 'Apoio consular brasileiro', text: 'Consulte a representação brasileira responsável por sua região para serviços consulares e orientação em situações que exijam assistência.', source: UNITED_KINGDOM_SOURCES.consular, link: { label: 'Acessar o e-Consular', url: UNITED_KINGDOM_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Confira o calendário de 2027', intro: 'Prazos de graduação e pós-graduação seguem processos diferentes.', blocks: [
    { title: 'Graduação: prazo antecipado encerrado', text: 'Para entrada em 2027, o prazo de Oxford, Cambridge e da maioria dos cursos de Medicina, Odontologia e Veterinária foi 15/10/2026 às 18h, horário do Reino Unido. Confira exceções e próximos ciclos na UCAS.', source: UNITED_KINGDOM_SOURCES.ucas },
    { title: 'Graduação: prazo principal', text: 'O prazo de consideração igual para a maioria dos cursos é 13/01/2027 às 18h, horário do Reino Unido. Verifique a data exata e eventuais vagas posteriores no curso escolhido.', source: UNITED_KINGDOM_SOURCES.ucas, link: { label: 'Consultar datas na UCAS', url: UNITED_KINGDOM_SOURCES.ucas.url } },
    { title: 'Pós-graduação', text: 'Cada universidade e programa publica seu calendário de candidatura e de bolsas. Muitos cursos começam em setembro ou outubro, mas há outras datas de início.' },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Organize a candidatura', intro: 'Use a página oficial do curso como lista de requisitos.', blocks: [
    { title: '1. Escolha o curso', text: 'Compare conteúdo, idioma, custo total, cidade e exigências acadêmicas. Anote separadamente os prazos de admissão e financiamento.' },
    { title: '2. Graduação pela UCAS', text: 'A UCAS reúne candidaturas de graduação. Leia as regras do ciclo, prepare o histórico e a declaração pessoal conforme as instruções vigentes.', source: UNITED_KINGDOM_SOURCES.ucas, link: { label: 'Planejar a candidatura na UCAS', url: UNITED_KINGDOM_SOURCES.ucas.url } },
    { title: '3. Pós-graduação diretamente com a instituição', text: 'Confira documentos, referências, comprovação de inglês e eventuais propostas de pesquisa no edital específico. Não presuma que todos os programas aceitam os mesmos testes ou datas.' },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada e permanência', title: 'Planeje o Student visa', intro: 'A admissão no curso é apenas uma das etapas para estudar no país.', blocks: [
    { title: 'Antes do pedido', text: 'Confirme com a instituição o documento de patrocínio do curso e leia os requisitos atuais de identidade, inglês, recursos e taxas. Organize o pedido dentro dos prazos indicados pelo governo britânico.', source: UNITED_KINGDOM_SOURCES.studentVisa, link: { label: 'Consultar o visto de estudante', url: UNITED_KINGDOM_SOURCES.studentVisa.url } },
    { title: 'Após a conclusão', text: 'A Graduate route pode permitir permanência após um curso elegível. Para graduação e mestrado, pedidos antes de 01/01/2027 têm duração de dois anos; a partir dessa data, 18 meses. Para doutorado, a duração é de três anos. Confirme todos os requisitos antes de planejar trabalho ou permanência.', source: UNITED_KINGDOM_SOURCES.graduate },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Confira as condições do seu visto', intro: 'Horas permitidas dependem do nível do curso e do patrocinador.', blocks: [
    { title: 'Limites durante as aulas', text: 'Para curso superior em tempo integral com patrocinador elegível, o limite geral é 20 horas semanais no período letivo; para curso abaixo da graduação, pode ser 10 horas. Alguns estudantes não têm permissão para trabalhar. Confira as condições do seu visto e o calendário de férias da instituição.', source: UNITED_KINGDOM_SOURCES.work },
    { title: 'Atividades restritas', text: 'As regras do Student visa restringem, entre outras atividades, trabalho autônomo, atividade empresarial e ocupação permanente em tempo integral, com exceções específicas. Não conte com renda de trabalho ainda não obtida para financiar o curso.', source: UNITED_KINGDOM_SOURCES.work },
    { title: 'Salário mínimo', text: 'Desde abril de 2026, o mínimo nacional é £12,71 por hora para pessoas de 21 anos ou mais e £10,85 para 18 a 20 anos. Confira a faixa etária e a atualização vigente antes de aceitar uma oferta.', source: UNITED_KINGDOM_SOURCES.wage },
  ] },
]
