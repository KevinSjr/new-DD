export type GpaBand = { min: number; max: number; points: number | null; letter: string }
export type GpaMethod = {
  id: 'bands' | 'proportional' | 'letters'
  name: string
  explanation: string
  bands: GpaBand[]
  source: { label: string; url: `https://${string}`; verifiedAt: '2026-10-19' }
}

// Limites inferiores inclusivos, superiores exclusivos; somente 10 pertence ao último limite.
// Estas referências são aproximações publicadas pelas fontes, não regras oficiais de universidades.
export const GPA_METHODS: GpaMethod[] = [
  {
    id: 'bands', name: 'Tabela por faixas',
    explanation: 'Associa cada intervalo de nota a pontos fixos. Referência a validar pela instituição de destino.',
    bands: [
      { min: 0, max: 5, points: 0, letter: 'F' },
      { min: 5, max: 6, points: 1.5, letter: 'C- (valor da fonte)' },
      { min: 6, max: 6.5, points: 2, letter: 'C' },
      { min: 6.5, max: 7, points: 2.3, letter: 'C+' },
      { min: 7, max: 7.5, points: 2.7, letter: 'B-' },
      { min: 7.5, max: 8, points: 3, letter: 'B' },
      { min: 8, max: 8.5, points: 3.3, letter: 'B+' },
      { min: 8.5, max: 9, points: 3.7, letter: 'A-' },
      { min: 9, max: 10, points: 4, letter: 'A' },
    ],
    source: { label: 'SmartCGPA — Brazil GPA converter', url: 'https://smartcgpa.com/international-gpa-converter/brazil', verifiedAt: '2026-10-19' },
  },
  {
    id: 'proportional', name: 'Proporcional',
    explanation: 'Multiplica cada nota por 0,4. A fonte também mostra conceitos aproximados por nota; os pontos variam continuamente.',
    bands: [
      { min: 0, max: 5, points: null, letter: 'D/F' },
      { min: 5, max: 6, points: null, letter: 'C' },
      { min: 6, max: 7, points: null, letter: 'C+/B-' },
      { min: 7, max: 8, points: null, letter: 'B' },
      { min: 8, max: 9, points: null, letter: 'B+/A-' },
      { min: 9, max: 10, points: null, letter: 'A/A+' },
    ],
    source: { label: 'Calculadora Brasil — GPA', url: 'https://calculadorabrasil.com.br/gpa/', verifiedAt: '2026-10-19' },
  },
  {
    id: 'letters', name: 'Letras aproximadas',
    explanation: 'Agrupa as notas em conceitos A a F, com pontos fixos. Referência a validar pela instituição de destino.',
    bands: [
      { min: 0, max: 6, points: 0, letter: 'F' },
      { min: 6, max: 7, points: 1, letter: 'D' },
      { min: 7, max: 8, points: 2, letter: 'C' },
      { min: 8, max: 9, points: 3, letter: 'B' },
      { min: 9, max: 10, points: 4, letter: 'A' },
    ],
    source: { label: 'Universidade do Intercâmbio — sistemas de notas', url: 'https://www.universidadedointercambio.com/sistemas-de-notas-universidades-estrangeiras/', verifiedAt: '2026-10-19' },
  },
]
