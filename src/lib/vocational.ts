import { INTEREST_AREAS, QUESTION_STEPS, type InterestArea } from '../data/vocationalQuestions.ts'

export type VocationalAnswer = 1 | 2 | 3 | 4 | 5
export type VocationalScore = { area: InterestArea; mean: number }

const areaKeys = Object.keys(INTEREST_AREAS) as InterestArea[]

export function calculateVocationalScores(answers: Record<string, VocationalAnswer>): VocationalScore[] {
  return areaKeys.map((area) => {
    const values = QUESTION_STEPS.flat().filter((question) => question.area === area)
      .map((question) => answers[question.id])
    if (values.some((value) => value === undefined)) throw new Error('Responda todas as atividades antes de ver o resultado.')
    const ratings = values.filter((value): value is VocationalAnswer => value !== undefined)
    return { area, mean: ratings.reduce((sum, value) => sum + value, 0) / ratings.length }
  }).sort((a, b) => b.mean - a.mean)
}
