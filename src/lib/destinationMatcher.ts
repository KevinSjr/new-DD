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
  priorities: ('region' | 'climate' | 'language')[]
}

export type DestinationMatch = { profile: DestinationProfile; score: number; reasons: string[]; cautions: string[] }

export function matchDestinations(answers: DestinationAnswers, profiles: readonly DestinationProfile[]): DestinationMatch[] {
  const weights = { region: 3, climate: 2, language: 3 }
  for (const priority of answers.priorities) weights[priority] += 2
  return profiles.map(profile => {
    const regionScore = answers.regions.includes(profile.region) ? 1 : 0
    const climateScore = answers.climate === 'any' ? 1 : profile.climates.includes(answers.climate) ? 1 : 0
    const languageScore = answers.language === 'english'
      ? profile.language === 'english' ? 1 : 0
      : answers.language === 'similar'
        ? profile.language === 'romance' ? 1 : 0
        : answers.learningTime === 'none' ? profile.language === 'english' ? 1 : 0 : 1
    const score = (regionScore * weights.region + climateScore * weights.climate + languageScore * weights.language)
      / (weights.region + weights.climate + weights.language)
    const reasons: string[] = []
    const cautions: string[] = []
    if (regionScore) reasons.push('Está em uma das regiões que você escolheu.')
    else cautions.push('Fica fora das regiões selecionadas.')
    if (answers.climate !== 'any') {
      if (climateScore) reasons.push('Há regiões com o clima que você prefere; confirme a cidade.')
      else cautions.push('O clima que você prefere não aparece nesta classificação ampla.')
    }
    if (languageScore) reasons.push('O ambiente linguístico se aproxima da sua preferência.')
    else cautions.push('O idioma do cotidiano pode exigir outra preparação.')
    return { profile, score, reasons, cautions }
  }).sort((a, b) => b.score - a.score || profiles.indexOf(a.profile) - profiles.indexOf(b.profile))
}
