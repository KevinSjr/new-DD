/*
 * Temas de todo guia de país, na ordem em que aparecem. Usado na página inicial
 * (o que cada guia vai explicar) e nas páginas dos guias. Os textos descrevem o
 * TEMA, sem dados de nenhum país.
 */
export const GUIDE_TOPICS = [
  {
    id: 'visao-geral',
    title: 'Visão geral',
    text: 'Dados básicos do país, como capital, idioma e moeda, para situar você antes dos detalhes.',
  },
  {
    id: 'educacao',
    title: 'Educação',
    text: 'Como funciona o ensino superior, quais caminhos existem para estudantes estrangeiros e como escolher uma universidade.',
  },
  {
    id: 'idioma',
    title: 'Idioma',
    text: 'Qual idioma é usado nas aulas e no dia a dia e quais certificados costumam ser pedidos.',
  },
  {
    id: 'bolsas',
    title: 'Bolsas de estudo',
    text: 'Programas de apoio financeiro e um passo a passo para se preparar para candidaturas.',
  },
  {
    id: 'custo-de-vida',
    title: 'Custo de vida',
    text: 'Moradia, alimentação e transporte, sempre com moeda e período de referência.',
  },
  {
    id: 'calendario',
    title: 'Calendário acadêmico',
    text: 'Como o ano letivo é organizado e por que os prazos precisam ser conferidos em cada curso.',
  },
  {
    id: 'vistos',
    title: 'Vistos',
    text: 'Quais tipos de visto existem para estudar e o que cada um costuma exigir.',
  },
  {
    id: 'trabalho',
    title: 'Trabalho',
    text: 'Se estudantes podem trabalhar durante o curso e em quais condições, segundo as regras oficiais.',
  },
  {
    id: 'depois-da-formatura',
    title: 'Depois da formatura',
    text: 'O que a lei do país prevê para quem deseja permanecer após os estudos.',
  },
  {
    id: 'clima',
    title: 'Clima',
    text: 'O que esperar de cada estação, para você se preparar com antecedência.',
  },
  {
    id: 'vida-no-pais',
    title: 'Comunidade e cultura',
    text: 'Onde encontrar apoio, costumes locais e dicas para se adaptar.',
  },
  {
    id: 'proximos-passos',
    title: 'Próximos passos',
    text: 'Uma ordem sugerida para organizar sua pesquisa e sua candidatura.',
  },
] as const

export type GuideTopicId = (typeof GUIDE_TOPICS)[number]['id']
