export type Region = 'america' | 'europe' | 'asia' | 'oceania'
export type Climate = 'snow' | 'mild' | 'warm'
export type LanguageEnvironment = 'english' | 'romance' | 'other'

export type DestinationProfile = {
  slug: string
  name: string
  region: Region
  /** Possibilidades climáticas amplas, não previsão para uma cidade ou campus. */
  climates: Climate[]
  /** Idioma do cotidiano em linhas gerais; não afirma idioma de um curso específico. */
  language: LanguageEnvironment
}

// Curadoria exploratória para comparar preferências, verificada em 19/10/2026.
// Região: ONU M49. Clima: síntese ampla a validar por cidade no portal climático do Banco Mundial.
// Idioma: agrupamento editorial para explorar afinidade; o idioma do programa deve ser conferido na instituição.
export const DESTINATION_SOURCES = {
  region: 'https://unstats.un.org/unsd/methodology/m49/',
  climate: 'https://climateknowledgeportal.worldbank.org/explore',
  verifiedAt: '2026-10-19',
} as const

export const DESTINATION_PROFILES: readonly DestinationProfile[] = [
  { slug: 'estados-unidos', name: 'Estados Unidos', region: 'america', climates: ['snow', 'mild', 'warm'], language: 'english' },
  { slug: 'reino-unido', name: 'Reino Unido', region: 'europe', climates: ['mild'], language: 'english' },
  { slug: 'canada', name: 'Canadá', region: 'america', climates: ['snow', 'mild'], language: 'english' },
  { slug: 'australia', name: 'Austrália', region: 'oceania', climates: ['mild', 'warm'], language: 'english' },
  { slug: 'alemanha', name: 'Alemanha', region: 'europe', climates: ['snow', 'mild'], language: 'other' },
  { slug: 'franca', name: 'França', region: 'europe', climates: ['snow', 'mild', 'warm'], language: 'romance' },
  { slug: 'japao', name: 'Japão', region: 'asia', climates: ['snow', 'mild', 'warm'], language: 'other' },
  { slug: 'china', name: 'China', region: 'asia', climates: ['snow', 'mild', 'warm'], language: 'other' },
  { slug: 'coreia-do-sul', name: 'Coreia do Sul', region: 'asia', climates: ['snow', 'mild'], language: 'other' },
  { slug: 'espanha', name: 'Espanha', region: 'europe', climates: ['mild', 'warm'], language: 'romance' },
  { slug: 'paises-baixos', name: 'Países Baixos (Holanda)', region: 'europe', climates: ['mild'], language: 'other' },
  { slug: 'italia', name: 'Itália', region: 'europe', climates: ['snow', 'mild', 'warm'], language: 'romance' },
  { slug: 'portugal', name: 'Portugal', region: 'europe', climates: ['mild', 'warm'], language: 'romance' },
  { slug: 'irlanda', name: 'Irlanda', region: 'europe', climates: ['mild'], language: 'english' },
  { slug: 'suica', name: 'Suíça', region: 'europe', climates: ['snow', 'mild'], language: 'other' },
  { slug: 'suecia', name: 'Suécia', region: 'europe', climates: ['snow', 'mild'], language: 'other' },
  { slug: 'finlandia', name: 'Finlândia', region: 'europe', climates: ['snow'], language: 'other' },
  { slug: 'dinamarca', name: 'Dinamarca', region: 'europe', climates: ['mild'], language: 'other' },
  { slug: 'belgica', name: 'Bélgica', region: 'europe', climates: ['mild'], language: 'romance' },
  { slug: 'noruega', name: 'Noruega', region: 'europe', climates: ['snow', 'mild'], language: 'other' },
  { slug: 'taiwan', name: 'Taiwan', region: 'asia', climates: ['warm'], language: 'other' },
  { slug: 'hong-kong', name: 'Hong Kong', region: 'asia', climates: ['warm'], language: 'english' },
  { slug: 'singapura', name: 'Singapura', region: 'asia', climates: ['warm'], language: 'english' },
  { slug: 'malasia', name: 'Malásia', region: 'asia', climates: ['warm'], language: 'other' },
  { slug: 'nova-zelandia', name: 'Nova Zelândia', region: 'oceania', climates: ['snow', 'mild'], language: 'english' },
]
