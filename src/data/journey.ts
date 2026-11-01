export const JOURNEY_STAGES = [
  { title: 'Definir objetivo', description: 'Escolha o que busca e quando pretende começar.', tasks: [
    { key: 'define-goal', title: 'Definir nível e área de estudo', detail: 'Registre suas preferências na aba Metas de intercâmbio.', action: 'Editar metas', href: '/conta?tab=metas' },
    { key: 'choose-destinations', title: 'Escolher destinos de interesse', detail: 'Compare lugares e selecione até três destinos no seu perfil.', action: 'Descobrir destinos', href: '/descobridor-de-destinos' },
    { key: 'set-timeline', title: 'Definir quando quer começar', detail: 'Escolha um ano estimado. Você pode mudá-lo depois.', action: 'Editar metas', href: '/conta?tab=metas' },
  ] },
  { title: 'Pesquisar opções', description: 'Monte uma lista curta de possibilidades reais.', tasks: [
    { key: 'compare-countries', title: 'Comparar guias de países', detail: 'Considere idioma, custos, estudos e vida cotidiana.', action: 'Ver países', href: '/#paises' },
    { key: 'search-scholarships', title: 'Pesquisar bolsas', detail: 'Use filtros e abra as fontes para conferir cada oportunidade.', action: 'Explorar bolsas', href: '/bolsas' },
    { key: 'shortlist-programs', title: 'Selecionar cursos ou instituições', detail: 'Guarde sua lista em um lugar de sua escolha e confira os sites oficiais.', action: 'Ver rankings', href: '/rankings' },
  ] },
  { title: 'Conferir requisitos', description: 'Valide as condições diretamente com cada instituição.', tasks: [
    { key: 'check-eligibility', title: 'Conferir requisitos das opções escolhidas', detail: 'Verifique nacionalidade, nível, notas e documentos na fonte oficial.' },
    { key: 'check-exams', title: 'Verificar exames exigidos', detail: 'Anote provas, notas mínimas e validade dos resultados.', action: 'Ver exames', href: '/exames' },
    { key: 'map-deadlines', title: 'Registrar prazos importantes', detail: 'Adicione os prazos das candidaturas abaixo, com o ano correto.' },
  ] },
  { title: 'Preparar candidatura', description: 'Organize materiais conforme os editais escolhidos.', tasks: [
    { key: 'gather-documents', title: 'Reunir documentos', detail: 'Faça sua lista de histórico, traduções e comprovantes exigidos.' },
    { key: 'write-application', title: 'Preparar textos e formulários', detail: 'Adapte cartas e respostas aos critérios de cada candidatura.' },
    { key: 'review-application', title: 'Revisar antes de enviar', detail: 'Confira dados, anexos, formato e prazo na plataforma oficial.' },
  ] },
  { title: 'Acompanhar candidaturas', description: 'Registre envios e prepare os próximos passos.', tasks: [
    { key: 'submit-application', title: 'Enviar candidatura', detail: 'Marque somente depois de confirmar o envio no canal oficial.' },
    { key: 'track-responses', title: 'Acompanhar respostas e pedidos', detail: 'Consulte seu e-mail e portais oficiais. Anote novos prazos.' },
    { key: 'plan-next-step', title: 'Planejar a próxima etapa', detail: 'Após a resposta, verifique matrícula, visto e financiamento aplicáveis.' },
  ] },
] as const

export const JOURNEY_TASK_COUNT = JOURNEY_STAGES.reduce((total, stage) => total + stage.tasks.length, 0)
