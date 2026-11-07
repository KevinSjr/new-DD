export type ItalySource = { label: string; url: string; verifiedAt: string }
export type ItalyBlock = { title: string; text: string; note?: string; source?: ItalySource; link?: { label: string; url: string } }
export type ItalySection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly ItalyBlock[] }

const verifiedAt = '2026-10-28'

export const ITALY_SOURCES = {
  population: { label: 'ISTAT · Balanço demográfico de julho de 2026', url: 'https://www.istat.it/sistema-informativo-6/bilancio-demografico-mensile-luglio-2026/', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/data-center/country-insights', verifiedAt },
  study: { label: 'Embaixada da Itália no Brasil · Estudar na Itália', url: 'https://ambbrasilia.esteri.it/pt/italia-e-brasile/diplomazia-culturale/studiare-in-italia/', verifiedAt },
  application: { label: 'MAECI · Perguntas sobre estudo, visto e Universitaly', url: 'https://www.esteri.it/en/ministero/sportello_info/domandefrequenti/studiare-in-italia/', verifiedAt },
  brazilVisa: { label: 'Embaixada da Itália no Brasil · Visto de estudo', url: 'https://ambbrasilia.esteri.it/pt/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visto-di-lunga-durata-tipo-d/tipi-di-visto-di-lunga-durata-tipo-d/', verifiedAt },
  scholarship: { label: 'MAECI · Bolsas do governo italiano 2026/27', url: 'https://www.esteri.it/en/servizi-opportunita/opportunita/borse-di-studio/per-cittadini-stranieri/borsestudio_stranieri/', verifiedAt },
  work: { label: 'Sapienza Università di Roma · Permissão de residência para estudos', url: 'https://www.uniroma1.it/en/node/468546', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, ItalySource>

export const ITALY_SECTIONS: readonly ItalySection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Confira o idioma do programa', intro: 'Cursos em italiano e em inglês têm formas diferentes de comprovar proficiência.', blocks: [
    { title: 'Cursos em italiano', text: 'O italiano é o idioma principal do país e pode ser mais familiar para falantes de português. A universidade informa o nível, as provas e os certificados aceitos para o curso; confirme também a exigência do visto no consulado competente.', source: ITALY_SOURCES.application },
    { title: 'Cursos em inglês', text: 'Há programas ministrados em inglês. Verifique se todas as disciplinas são oferecidas nesse idioma e qual prova ou nível a instituição exige. Não use uma pontuação única de IELTS ou TOEFL para todos os cursos.', source: ITALY_SOURCES.study },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Planeje-se para a cidade escolhida', intro: 'O clima muda entre o norte, o centro, o sul e as áreas montanhosas.', blocks: [
    { title: 'Compare as estações', text: 'O norte tem influência continental e alpina; áreas costeiras do centro e do sul têm maior influência mediterrânea. Consulte dados mensais e previsão local antes de organizar a viagem.' },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Calcule custos do curso e da estadia', intro: 'Taxas e despesas variam por universidade, programa, cidade e situação pessoal.', blocks: [
    { title: 'Mensalidade e moradia', text: 'Consulte a tabela de taxas do seu curso e as condições de redução ou isenção na universidade. Monte uma estimativa separada para aluguel, alimentação, transporte, seguro e custos iniciais, com moeda e ano de referência.' },
    { title: 'Comprovação financeira para o visto', text: 'Para visto de matrícula universitária em 2026/27 e 2027/28, o MAECI informa recursos mínimos de €10.179,85 para o primeiro ano, além do custo da passagem de retorno. Esse mínimo de imigração não substitui um orçamento real da cidade.', note: 'Confira a documentação e as regras do consulado italiano responsável pelo seu domicílio no Brasil antes de solicitar o visto.', source: ITALY_SOURCES.application },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Verifique a próxima edição do edital', intro: 'Bolsas do governo e das universidades têm critérios e calendários próprios.', blocks: [
    { title: 'Bolsas MAECI', text: 'A chamada do governo italiano para 2026/27 contemplou modalidades de mestrado, formação artística, musical e de dança (AFAM), doutorado, pesquisa e cursos avançados de língua e cultura italiana. A inscrição ocorreu no portal Study in Italy e encerrou em 26 de março de 2026, às 14h na Itália.', note: 'A edição citada está encerrada. Verifique a lista de países, os benefícios e os requisitos da próxima chamada antes de considerar uma candidatura.', source: ITALY_SOURCES.scholarship, link: { label: 'Consultar as bolsas MAECI', url: ITALY_SOURCES.scholarship.url } },
    { title: 'Bolsas da universidade', text: 'Pesquise apoios da instituição e programas regionais de direito ao estudo. Confirme valor, duração, curso, renda exigida e documentos no edital responsável.', source: ITALY_SOURCES.application },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare opções de acordo com seu curso', intro: 'O nome da instituição é apenas uma parte da decisão.', blocks: [
    { title: 'Instituições para pesquisar', text: 'Politecnico di Milano, Sapienza Università di Roma, Università Bocconi e Università di Bologna são exemplos em ordem alfabética, sem posição de ranking.' },
    { title: 'O que verificar', text: 'Compare reconhecimento do programa, idioma, currículo, taxa, cidade, bolsa e serviços para estudantes internacionais. Rankings variam por ano e metodologia.' },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Conheça o cotidiano local', intro: 'Costumes e preços variam entre cidades e regiões.', blocks: [
    { title: 'Cultura', text: 'A culinária e as tradições artísticas têm grande diversidade regional. Explore eventos, museus e espaços estudantis da cidade onde pretende morar, sem tratar uma região como retrato do país inteiro.' },
    { title: 'Apoio brasileiro', text: 'Consulte a equipe internacional da universidade e confirme no e-Consular a representação brasileira responsável. Não há aqui uma estimativa verificada da comunidade brasileira.', source: ITALY_SOURCES.consular },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Organize as etapas em calendários separados', intro: 'Admissão, pré-inscrição, bolsa, visto e matrícula podem ter prazos diferentes.', blocks: [
    { title: 'Ano acadêmico', text: 'Muitos cursos começam em setembro ou outubro, mas cada instituição divulga as datas do seu programa. Anote o prazo da universidade antes de planejar a pré-inscrição.' },
    { title: 'Universitaly', text: 'Para candidatos de fora da UE residentes no exterior que precisam de visto de estudo, a pré-inscrição no Universitaly faz parte do processo de muitos cursos de ensino superior. A instituição valida a solicitação; confirme a sequência exata com ela e com o consulado.', source: ITALY_SOURCES.application },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Siga a rota indicada pela universidade', intro: 'A instituição avalia formação anterior, idioma e documentos.', blocks: [
    { title: '1. Escolha o curso', text: 'Confira requisitos acadêmicos, idioma, provas de seleção, taxas e prazo diretamente no edital do programa.' },
    { title: '2. Prepare a documentação', text: 'Histórico, diploma e comprovante de idioma são pedidos conforme o curso. A universidade informa quando exige tradução, Declaração de Valor ou documento do CIMEA para avaliar um título estrangeiro.', source: ITALY_SOURCES.brazilVisa },
    { title: '3. Faça a pré-inscrição necessária', text: 'Depois de seguir a candidatura da instituição, use o Universitaly quando seu caso exigir visto de estudo. Aguarde a validação da universidade antes de encaminhar o pedido de visto.', source: ITALY_SOURCES.brazilVisa, link: { label: 'Ver orientações da embaixada no Brasil', url: ITALY_SOURCES.brazilVisa.url } },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada no país', title: 'Confira o visto e a residência', intro: 'O consulado italiano responsável no Brasil informa o procedimento do seu caso.', blocks: [
    { title: 'Visto de estudo', text: 'Brasileiros admitidos em cursos de longa duração devem conferir o visto apropriado, a pré-inscrição validada e os documentos exigidos pela representação italiana competente. O prazo e os requisitos de outros tipos de curso podem ser diferentes.', source: ITALY_SOURCES.brazilVisa },
    { title: 'Depois de chegar', text: 'Para estadias que exigem permissão de residência, o MAECI orienta solicitá-la após a entrada na Itália e renová-la antes do vencimento. Peça à universidade instruções sobre a Questura e os documentos locais.', source: ITALY_SOURCES.application },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Entenda os limites do permesso di soggiorno', intro: 'As condições da residência estudantil podem mudar; confirme sua situação antes de aceitar trabalho.', blocks: [
    { title: 'Limite de horas', text: 'A orientação da Sapienza informa trabalho em tempo parcial de até 20 horas por semana e 1.040 horas por ano para quem tem permissão de residência de estudo. Não presuma liberação adicional para trabalho em tempo integral nas férias.', source: ITALY_SOURCES.work },
    { title: 'Renovação e próximos passos', text: 'A renovação pode exigir comprovante de matrícula e progresso acadêmico. Após concluir o curso, há possibilidades de conversão da permissão ou busca de emprego sob condições específicas; consulte a universidade e a Questura antes do vencimento.', source: ITALY_SOURCES.work },
  ] },
]
