export type ExamCategory = 'admission' | 'language'

export type Exam = {
  id: string
  name: string
  category: ExamCategory
  context: string
  description: string
  sourceLabel: string
  sourceUrl: string
}

// Catálogo informativo; cada página informa separadamente o conteúdo de prática disponível.
export const EXAMS: Exam[] = [
  {
    id: 'sat',
    name: 'SAT',
    category: 'admission',
    context: 'Admissão universitária',
    description: 'Avaliação acadêmica usada em processos de admissão de algumas universidades, especialmente nos Estados Unidos.',
    sourceLabel: 'College Board',
    sourceUrl: 'https://satsuite.collegeboard.org/sat',
  },
  {
    id: 'testas',
    name: 'TestAS',
    category: 'admission',
    context: 'Estudos na Alemanha',
    description: 'Teste de aptidão acadêmica para candidatos internacionais. Cada instituição decide se e como considera o resultado.',
    sourceLabel: 'TestAS',
    sourceUrl: 'https://www.testas.de/en/',
  },
  {
    id: 'mext',
    name: 'MEXT',
    category: 'admission',
    context: 'Seleção para bolsa no Japão',
    description: 'Não é um exame único: o processo da bolsa japonesa pode incluir provas escritas e entrevista, conforme a modalidade e a representação responsável.',
    sourceLabel: 'Study in Japan / JASSO',
    sourceUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/examination.html',
  },
  {
    id: 'toefl',
    name: 'TOEFL',
    category: 'language',
    context: 'Inglês',
    description: 'Exame de proficiência em inglês usado por instituições de ensino. Confirme qual versão é aceita no seu programa.',
    sourceLabel: 'ETS',
    sourceUrl: 'https://www.ets.org/toefl/ibt/english.html',
  },
  {
    id: 'ielts',
    name: 'IELTS',
    category: 'language',
    context: 'Inglês',
    description: 'Avaliação de inglês com modalidades diferentes. Verifique qual delas a instituição exige.',
    sourceLabel: 'IELTS',
    sourceUrl: 'https://ielts.org/',
  },
  {
    id: 'goethe-zertifikat',
    name: 'Goethe-Zertifikat',
    category: 'language',
    context: 'Alemão',
    description: 'Família de exames de alemão organizada por nível. Confira o certificado solicitado pelo curso.',
    sourceLabel: 'Goethe-Institut',
    sourceUrl: 'https://www.goethe.de/en/spr/prf.html',
  },
  {
    id: 'delf-dalf',
    name: 'DELF / DALF',
    category: 'language',
    context: 'Francês',
    description: 'Diplomas de francês em níveis diferentes; o requisito específico depende da instituição.',
    sourceLabel: 'France Éducation international',
    sourceUrl: 'https://www.france-education-international.fr/hub/diplomes-tests?langue=fr',
  },
  {
    id: 'jlpt',
    name: 'JLPT',
    category: 'language',
    context: 'Japonês',
    description: 'Exame de proficiência em japonês com níveis distintos. Confirme se o curso aceita o nível pretendido.',
    sourceLabel: 'JLPT oficial',
    sourceUrl: 'https://jlpt.jp/sp/e/index.cgi',
  },
  {
    id: 'topik',
    name: 'TOPIK',
    category: 'language',
    context: 'Coreano',
    description: 'Exame de proficiência em coreano. O nível exigido varia entre instituições e programas.',
    sourceLabel: 'TOPIK oficial',
    sourceUrl: 'https://www.topik.go.kr/',
  },
  {
    id: 'hsk',
    name: 'HSK',
    category: 'language',
    context: 'Chinês',
    description: 'Avaliação de proficiência em chinês. Confira a versão e o nível pedidos antes de se preparar.',
    sourceLabel: 'Chinese Test Service',
    sourceUrl: 'https://www.chinesetest.cn/',
  },
  {
    id: 'dele',
    name: 'DELE',
    category: 'language',
    context: 'Espanhol',
    description: 'Diplomas oficiais de espanhol em diferentes níveis, administrados pelo Instituto Cervantes.',
    sourceLabel: 'Instituto Cervantes',
    sourceUrl: 'https://examenes.cervantes.es/es/presentacion/dele',
  },
]
