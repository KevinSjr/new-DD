export const INTEREST_AREAS = {
  practical: {
    label: 'Prático',
    short: 'Construir e experimentar',
    description: 'Você pode gostar de transformar ideias em objetos, processos ou ações concretas.',
    explore: 'Observe cursos que envolvem projetos, laboratório, campo ou execução técnica, como engenharia, arquitetura e agronomia.',
  },
  investigative: {
    label: 'Investigativo',
    short: 'Pesquisar e compreender',
    description: 'Você pode gostar de fazer perguntas, analisar evidências e resolver problemas complexos.',
    explore: 'Examine a rotina de pesquisa e análise em áreas como ciências naturais, computação e saúde.',
  },
  creative: {
    label: 'Criativo',
    short: 'Criar e expressar',
    description: 'Você pode gostar de desenvolver ideias originais e dar forma a mensagens e experiências.',
    explore: 'Investigue processos de criação em design, artes, comunicação e outras áreas com produção autoral.',
  },
  social: {
    label: 'Social',
    short: 'Ensinar e apoiar',
    description: 'Você pode gostar de compreender pessoas, ensinar e contribuir para seu desenvolvimento.',
    explore: 'Conheça a prática cotidiana de educação, saúde e projetos comunitários — ela varia bastante entre cursos.',
  },
  enterprising: {
    label: 'Empreendedor',
    short: 'Mobilizar e liderar',
    description: 'Você pode gostar de iniciar projetos, defender ideias e coordenar pessoas e recursos.',
    explore: 'Pesquise atividades de gestão, negócios, relações públicas e liderança de projetos.',
  },
  organizational: {
    label: 'Organizacional',
    short: 'Estruturar e acompanhar',
    description: 'Você pode gostar de criar sistemas claros, acompanhar detalhes e manter processos confiáveis.',
    explore: 'Veja como organização e precisão aparecem em contabilidade, logística, gestão e informação.',
  },
} as const

export type InterestArea = keyof typeof INTEREST_AREAS

const groupedQuestions: Record<InterestArea, readonly string[]> = {
  practical: [
    'Montar um objeto ou equipamento seguindo um projeto.',
    'Descobrir e corrigir um defeito em um aparelho.',
    'Construir um protótipo e testá-lo.',
    'Usar instrumentos para medir características de materiais ou ambientes.',
    'Trabalhar em campo coletando amostras ou observações.',
    'Cultivar plantas ou cuidar de um ambiente natural.',
    'Aprender a usar ferramentas para produzir algo concreto.',
    'Ajustar um processo prático para que funcione melhor.',
    'Planejar e executar uma melhoria em um espaço físico.',
    'Realizar uma tarefa manual que exige precisão técnica.',
  ],
  investigative: [
    'Investigar por que um fenômeno acontece.',
    'Formular uma hipótese e pensar em como testá-la.',
    'Analisar dados para encontrar padrões.',
    'Ler pesquisas e comparar as evidências apresentadas.',
    'Resolver um problema matemático ou lógico desafiador.',
    'Planejar um experimento para responder a uma pergunta.',
    'Estudar como funciona um organismo, sistema ou tecnologia.',
    'Verificar se os dados realmente sustentam uma conclusão.',
    'Criar um modelo para explicar ou prever um fenômeno.',
    'Explorar uma questão que exige várias etapas antes de chegar a uma resposta.',
  ],
  creative: [
    'Escrever uma história, roteiro ou texto autoral.',
    'Criar a identidade visual de um projeto.',
    'Compor ou produzir uma peça musical.',
    'Experimentar imagens, sons, formas ou palavras para expressar uma ideia.',
    'Conceber uma apresentação ou performance artística.',
    'Encontrar uma forma original de comunicar uma mensagem.',
    'Imaginar diferentes conceitos para uma obra ou produto cultural.',
    'Revisar uma criação para torná-la mais expressiva.',
    'Produzir conteúdo audiovisual com uma narrativa própria.',
    'Interpretar uma ideia por meio de desenho, escrita, música ou atuação.',
  ],
  social: [
    'Explicar um conceito difícil até outra pessoa compreendê-lo.',
    'Ajudar alguém a organizar um plano de aprendizagem.',
    'Ouvir uma pessoa para entender suas necessidades antes de ajudá-la.',
    'Facilitar uma conversa entre pessoas com opiniões diferentes.',
    'Ensinar uma habilidade por meio da prática.',
    'Planejar uma atividade que incentive a participação de um grupo.',
    'Acompanhar o desenvolvimento de alguém ao longo de um projeto.',
    'Colaborar em uma iniciativa que atenda a uma necessidade da comunidade.',
    'Dar uma devolutiva construtiva para apoiar o progresso de alguém.',
    'Adaptar uma explicação para pessoas com necessidades diferentes.',
  ],
  enterprising: [
    'Defender uma proposta e conquistar apoio para ela.',
    'Negociar um acordo entre pessoas com interesses diferentes.',
    'Coordenar uma equipe para alcançar uma meta.',
    'Identificar uma oportunidade e iniciar um projeto.',
    'Apresentar uma ideia ou produto a um público.',
    'Planejar uma estratégia para atingir um objetivo.',
    'Convidar parceiros a participar de uma iniciativa.',
    'Tomar decisões em um projeto mesmo sem ter todas as respostas.',
    'Organizar pessoas e recursos para executar uma iniciativa.',
    'Encontrar maneiras de ampliar o alcance de um projeto.',
  ],
  organizational: [
    'Organizar registros para que outras pessoas encontrem informações facilmente.',
    'Conferir documentos ou números em busca de erros.',
    'Criar uma rotina para acompanhar etapas e prazos.',
    'Estruturar uma planilha ou sistema de classificação.',
    'Aplicar critérios claros para analisar diferentes casos.',
    'Padronizar etapas de um processo para reduzir falhas.',
    'Acompanhar um orçamento ou uso de recursos com precisão.',
    'Manter um arquivo atualizado e rastreável.',
    'Conciliar informações divergentes entre diferentes registros.',
    'Documentar um processo para que outra pessoa consiga reproduzi-lo.',
  ],
}

const areaOrder = Object.keys(INTEREST_AREAS) as InterestArea[]

// Um item de cada dimensão por etapa; a ordem alterna para reduzir respostas por bloco.
export const QUESTION_STEPS = Array.from({ length: 10 }, (_, step) =>
  areaOrder.map((area) => ({
    id: `${area}-${step + 1}`,
    area,
    text: groupedQuestions[area][step],
  })).sort((a, b) => (areaOrder.indexOf(a.area) + step * 2) % 6 - (areaOrder.indexOf(b.area) + step * 2) % 6),
)

export const VALUES = [
  'Autonomia para decidir como trabalhar',
  'Estabilidade financeira',
  'Impacto positivo na vida das pessoas',
  'Espaço para expressão criativa',
  'Aprofundamento técnico ou científico',
  'Oportunidade de liderar',
  'Colaboração no dia a dia',
  'Equilíbrio entre trabalho e vida pessoal',
  'Possibilidade de atuação internacional',
] as const
