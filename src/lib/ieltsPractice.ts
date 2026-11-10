import { listeningSets, readingSets, type IeltsItem } from '../data/ieltsPractice.ts'

export type IeltsAnswers = Record<string, string>

export function normaliseIeltsAnswer(value: string): string {
  return value.trim().toLocaleLowerCase('en').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ')
}

export function isIeltsAnswerCorrect(item: IeltsItem, value: string): boolean {
  const answer = normaliseIeltsAnswer(value)
  if (!answer) return false
  if (item.kind === 'text' && item.wordLimit && answer.split(' ').length > item.wordLimit) return false
  return item.answer.split('|').some(variant => normaliseIeltsAnswer(variant) === answer)
}

export function ieltsObjectiveReport(answers: IeltsAnswers) {
  return [
    { id: 'listening', title: 'Listening', items: listeningSets.flatMap(set => set.items) },
    { id: 'reading', title: 'Reading', items: readingSets.flatMap(set => set.items) },
  ].map(section => ({
    id: section.id,
    title: section.title,
    correct: section.items.filter(item => isIeltsAnswerCorrect(item, answers[item.id] ?? '')).length,
    answered: section.items.filter(item => Boolean(answers[item.id]?.trim())).length,
    total: section.items.length,
  }))
}

export function wordCount(value: string) { return value.trim() ? value.trim().split(/\s+/).length : 0 }
