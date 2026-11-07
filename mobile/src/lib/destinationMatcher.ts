import type { Climate, DestinationProfile, Region } from '../data/destinationProfiles'

export type DestinationAnswers = {
  regions: Region[]
  climate: Climate | 'any'
  language: 'english' | 'learn' | 'similar'
  learningTime: 'none' | 'year' | 'long'
  budget: 'low' | 'medium' | 'high'
  tuition: 'low' | 'scholarship' | 'can-pay'
  place: 'large' | 'medium' | 'nature'
  work: 'need' | 'nice' | 'no'
  after: 'stay' | 'maybe' | 'return'
  level: 'undergraduate' | 'graduate' | 'research' | 'exchange' | 'language' | 'short' | 'undecided'
  field: 'stem' | 'health' | 'humanities' | 'business' | 'arts' | 'undecided'
  priorities: ('climate' | 'language')[]
}

export type DestinationMatch = { profile: DestinationProfile; score: number; reasons: string[]; cautions: string[] }

export function matchDestinations(answers: DestinationAnswers, profiles: readonly DestinationProfile[]): DestinationMatch[] {
  const climateMatters = answers.climate !== 'any'
  const languageMatters = answers.language !== 'learn' || answers.learningTime === 'none'
  const climateWeight = climateMatters ? (answers.priorities.includes('climate') ? 2 : 1) : 0
  const languageWeight = languageMatters ? (answers.priorities.includes('language') ? 2 : 1) : 0
  const totalWeight = climateWeight + languageWeight
  return profiles.map(profile => {
    const selectedRegion = answers.regions.includes(profile.region)
    const climateScore = answers.climate !== 'any' && profile.climates.includes(answers.climate) ? 1 : 0
    const languageScore = answers.language === 'english'
      ? profile.language === 'english' ? 1 : 0
      : answers.language === 'similar'
        ? profile.language === 'romance' ? 1 : 0
        : answers.learningTime === 'none' && profile.language === 'english' ? 1 : 0
    const score = totalWeight === 0 ? 0 : (climateScore * climateWeight + languageScore * languageWeight) / totalWeight
    const reasons: string[] = []
    const cautions: string[] = []
    if (selectedRegion) reasons.push('Está em uma das regiões que você escolheu.')
    else cautions.push('Fica fora das regiões selecionadas.')
    if (climateMatters) {
      if (climateScore) reasons.push('Há regiões com o clima que você prefere; confirme a cidade.')
      else cautions.push('O clima que você prefere não aparece nesta classificação ampla.')
    }
    if (languageMatters) {
      if (languageScore) reasons.push('O idioma do cotidiano se aproxima da sua preferência.')
      else cautions.push('O idioma do cotidiano pode exigir outra preparação.')
    }
    return { profile, score, reasons, cautions }
  }).sort((a, b) => Number(answers.regions.includes(b.profile.region)) - Number(answers.regions.includes(a.profile.region))
    || b.score - a.score || a.profile.name.localeCompare(b.profile.name, 'pt-BR'))
}
