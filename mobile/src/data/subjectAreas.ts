export type SubjectAreaKey = 'arts-humanities' | 'engineering-technology' | 'life-sciences-medicine' | 'natural-sciences' | 'social-sciences-management'

type Subject = { name: string; url: string }

type SubjectArea = {
  title: string
  sourceName: string
  slug: string
  dataFile: string
  sourceUrl: string
  count: number
  missingScores: number
  weights: readonly [number, number, number, number, number]
  subjects: readonly Subject[]
}

export const SUBJECT_AREAS: Record<SubjectAreaKey, SubjectArea> = {
  'arts-humanities': {
    title: 'Artes e Humanidades',
    sourceName: 'Arts & Humanities',
    slug: 'artes-humanidades',
    dataFile: 'qs-subject-rankings-2026-arts-humanities.json',
    sourceUrl: 'https://www.topuniversities.com/university-subject-rankings/arts-humanities',
    count: 553,
    missingScores: 152,
    weights: [0.6, 0.2, 0.075, 0.075, 0.05],
    subjects: [
      { name: 'Linguística', url: 'https://www.topuniversities.com/university-subject-rankings/linguistics' },
      { name: 'Música', url: 'https://www.topuniversities.com/university-subject-rankings/music' },
      { name: 'Teologia, Divindade e Estudos Religiosos', url: 'https://www.topuniversities.com/university-subject-rankings/theology-divinity-religious-studies' },
      { name: 'Arqueologia', url: 'https://www.topuniversities.com/university-subject-rankings/archaeology' },
      { name: 'Arquitetura e Ambiente Construído', url: 'https://www.topuniversities.com/university-subject-rankings/architecture-built-environment' },
      { name: 'Arte e Design', url: 'https://www.topuniversities.com/university-subject-rankings/art-design' },
      { name: 'Estudos Clássicos e História Antiga', url: 'https://www.topuniversities.com/university-subject-rankings/classics-ancient-history' },
      { name: 'Língua e Literatura Inglesa', url: 'https://www.topuniversities.com/university-subject-rankings/english-language-literature' },
      { name: 'História', url: 'https://www.topuniversities.com/university-subject-rankings/history' },
      { name: 'História da Arte', url: 'https://www.topuniversities.com/university-subject-rankings/art-history' },
      { name: 'Línguas Modernas', url: 'https://www.topuniversities.com/university-subject-rankings/modern-languages' },
      { name: 'Artes Cênicas', url: 'https://www.topuniversities.com/university-subject-rankings/performing-arts' },
      { name: 'Filosofia', url: 'https://www.topuniversities.com/university-subject-rankings/philosophy' },
    ],
  },
  'engineering-technology': {
    title: 'Engenharia e Tecnologia',
    sourceName: 'Engineering & Technology',
    slug: 'engenharia-tecnologia',
    dataFile: 'qs-subject-rankings-2026-engineering-technology.json',
    sourceUrl: 'https://www.topuniversities.com/university-subject-rankings/engineering-technology',
    count: 556,
    missingScores: 154,
    weights: [0.4, 0.3, 0.1, 0.1, 0.1],
    subjects: [
      { name: 'Engenharia Química', url: 'https://www.topuniversities.com/university-subject-rankings/chemical-engineering' },
      { name: 'Engenharia Civil e Estrutural', url: 'https://www.topuniversities.com/university-subject-rankings/civil-structural-engineering' },
      { name: 'Ciência da Computação e Sistemas de Informação', url: 'https://www.topuniversities.com/university-subject-rankings/computer-science-information-systems' },
      { name: 'Ciência de Dados e Inteligência Artificial', url: 'https://www.topuniversities.com/university-subject-rankings/data-science-artificial-intelligence' },
      { name: 'Engenharia Elétrica e Eletrônica', url: 'https://www.topuniversities.com/university-subject-rankings/electrical-electronic-engineering' },
      { name: 'Engenharia de Petróleo', url: 'https://www.topuniversities.com/university-subject-rankings/engineering-petroleum' },
      { name: 'Engenharia Mecânica', url: 'https://www.topuniversities.com/university-subject-rankings/mechanical-aeronautical-manufacturing-engineering' },
      { name: 'Engenharia de Minas e Minerais', url: 'https://www.topuniversities.com/university-subject-rankings/mineral-mining-engineering' },
    ],
  },
  'life-sciences-medicine': {
    title: 'Ciências da Vida e Medicina',
    sourceName: 'Life Sciences & Medicine',
    slug: 'ciencias-da-vida-medicina',
    dataFile: 'qs-subject-rankings-2026-life-sciences-medicine.json',
    sourceUrl: 'https://www.topuniversities.com/university-subject-rankings/life-sciences-medicine',
    count: 550,
    missingScores: 149,
    weights: [0.4, 0.1, 0.2, 0.2, 0.1],
    subjects: [
      { name: 'Agricultura e Silvicultura', url: 'https://www.topuniversities.com/university-subject-rankings/agriculture-forestry' },
      { name: 'Anatomia e Fisiologia', url: 'https://www.topuniversities.com/university-subject-rankings/anatomy-physiology' },
      { name: 'Ciências Biológicas', url: 'https://www.topuniversities.com/university-subject-rankings/biological-sciences' },
      { name: 'Odontologia', url: 'https://www.topuniversities.com/university-subject-rankings/dentistry' },
      { name: 'Medicina', url: 'https://www.topuniversities.com/university-subject-rankings/medicine' },
      { name: 'Enfermagem', url: 'https://www.topuniversities.com/university-subject-rankings/nursing' },
      { name: 'Farmácia e Farmacologia', url: 'https://www.topuniversities.com/university-subject-rankings/pharmacy-pharmacology' },
      { name: 'Psicologia', url: 'https://www.topuniversities.com/university-subject-rankings/psychology' },
      { name: 'Medicina Veterinária', url: 'https://www.topuniversities.com/university-subject-rankings/veterinary-science' },
    ],
  },
  'natural-sciences': {
    title: 'Ciências Naturais',
    sourceName: 'Natural Sciences',
    slug: 'ciencias-naturais',
    dataFile: 'qs-subject-rankings-2026-natural-sciences.json',
    sourceUrl: 'https://www.topuniversities.com/university-subject-rankings/natural-sciences',
    count: 554,
    missingScores: 152,
    weights: [0.4, 0.2, 0.15, 0.15, 0.1],
    subjects: [
      { name: 'Química', url: 'https://www.topuniversities.com/university-subject-rankings/chemistry' },
      { name: 'Ciências da Terra e Marinhas', url: 'https://www.topuniversities.com/university-subject-rankings/earth-marine-sciences' },
      { name: 'Ciências Ambientais', url: 'https://www.topuniversities.com/university-subject-rankings/environmental-sciences' },
      { name: 'Geografia', url: 'https://www.topuniversities.com/university-subject-rankings/geography' },
      { name: 'Geologia', url: 'https://www.topuniversities.com/university-subject-rankings/geology' },
      { name: 'Geofísica', url: 'https://www.topuniversities.com/university-subject-rankings/geophysics' },
      { name: 'Ciência dos Materiais', url: 'https://www.topuniversities.com/university-subject-rankings/materials-sciences' },
      { name: 'Matemática', url: 'https://www.topuniversities.com/university-subject-rankings/mathematics' },
      { name: 'Física e Astronomia', url: 'https://www.topuniversities.com/university-subject-rankings/physics-astronomy' },
    ],
  },
  'social-sciences-management': {
    title: 'Ciências Sociais e Administração',
    sourceName: 'Social Sciences & Management',
    slug: 'ciencias-sociais-administracao',
    dataFile: 'qs-subject-rankings-2026-social-sciences-management.json',
    sourceUrl: 'https://www.topuniversities.com/university-subject-rankings/social-sciences-management',
    count: 550,
    missingScores: 151,
    weights: [0.5, 0.3, 0.075, 0.075, 0.05],
    subjects: [
      { name: 'Contabilidade e Finanças', url: 'https://www.topuniversities.com/university-subject-rankings/accounting-finance' },
      { name: 'Antropologia', url: 'https://www.topuniversities.com/university-subject-rankings/anthropology' },
      { name: 'Negócios e Administração', url: 'https://www.topuniversities.com/university-subject-rankings/business-management-studies' },
      { name: 'Comunicação e Estudos de Mídia', url: 'https://www.topuniversities.com/university-subject-rankings/communication-media-studies' },
      { name: 'Estudos de Desenvolvimento', url: 'https://www.topuniversities.com/university-subject-rankings/development-studies' },
      { name: 'Economia e Econometria', url: 'https://www.topuniversities.com/university-subject-rankings/economics-econometrics' },
      { name: 'Educação e Formação', url: 'https://www.topuniversities.com/university-subject-rankings/education-training' },
      { name: 'Gestão de Hotelaria e Lazer', url: 'https://www.topuniversities.com/university-subject-rankings/hospitality-leisure-management' },
      { name: 'Direito e Estudos Jurídicos', url: 'https://www.topuniversities.com/university-subject-rankings/law-legal-studies' },
      { name: 'Biblioteconomia e Gestão da Informação', url: 'https://www.topuniversities.com/university-subject-rankings/library-information-management' },
      { name: 'Marketing', url: 'https://www.topuniversities.com/university-subject-rankings/marketing' },
      { name: 'Ciência Política', url: 'https://www.topuniversities.com/university-subject-rankings/politics' },
      { name: 'Políticas Sociais e Administração', url: 'https://www.topuniversities.com/university-subject-rankings/social-policy-administration' },
      { name: 'Sociologia', url: 'https://www.topuniversities.com/university-subject-ranking/sociology' },
      { name: 'Áreas Relacionadas ao Esporte', url: 'https://www.topuniversities.com/university-subject-rankings/sports-related-subjects' },
      { name: 'Estatística e Pesquisa Operacional', url: 'https://www.topuniversities.com/university-subject-rankings/statistics-operational-research' },
    ],
  },
}
