import type { GpaMethod } from '../data/gpaMethods'

export type CourseInput = { name: string; grade: string; credits: string }
export type GpaInput =
  | { mode: 'average'; average: string }
  | { mode: 'courses'; courses: CourseInput[]; passingGrade: string; includeFailed: boolean }
export type CourseResult = { name: string; grade: number; credits: number | null; points: number; letter: string; excluded: boolean }
export type GpaResult = { gpa: number | null; sourceAverage: number | null; letter: string | null; courses: CourseResult[]; weighted: boolean; emptyAfterExclusions: boolean }

export class GpaInputError extends Error {}

export function parseDecimal(value: string, label: string, min: number, max = Infinity): number {
  const normalized = value.trim().replace(',', '.')
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) throw new GpaInputError(`${label}: informe um número válido.`)
  const number = Number(normalized)
  if (!Number.isFinite(number) || number < min || number > max) throw new GpaInputError(`${label}: informe um valor entre ${min} e ${max === Infinity ? 'mais' : max}.`)
  return number
}

export function convertGrade(grade: number, method: GpaMethod): { points: number; letter: string } {
  if (!Number.isFinite(grade) || grade < 0 || grade > 10) throw new GpaInputError('Nota: informe um valor entre 0 e 10.')
  const band = method.bands.find(({ min, max }) => grade >= min && (grade < max || (grade === 10 && max === 10)))
  if (!band) throw new Error('Método de conversão incompleto.')
  return { points: method.id === 'proportional' ? grade / 10 * 4 : (band.points ?? 0), letter: band.letter }
}

export function calculateGpa(input: GpaInput, method: GpaMethod): GpaResult {
  if (input.mode === 'average') {
    const sourceAverage = parseDecimal(input.average, 'Média geral', 0, 10)
    const converted = convertGrade(sourceAverage, method)
    return { gpa: converted.points, sourceAverage, letter: converted.letter, courses: [], weighted: false, emptyAfterExclusions: false }
  }
  if (input.courses.length === 0) throw new GpaInputError('Adicione pelo menos uma disciplina.')
  const passingGrade = parseDecimal(input.passingGrade, 'Nota mínima de aprovação', 0, 10)
  const withCredits = input.courses.filter(course => course.credits.trim() !== '').length
  if (withCredits > 0 && withCredits < input.courses.length) throw new GpaInputError('Preencha os créditos de todas as disciplinas ou limpe todos os campos de créditos.')
  const weighted = withCredits === input.courses.length
  const courses = input.courses.map((course, index) => {
    const grade = parseDecimal(course.grade, `Nota da disciplina ${index + 1}`, 0, 10)
    const credits = weighted ? parseDecimal(course.credits, `Créditos da disciplina ${index + 1}`, 0) : null
    if (credits !== null && credits <= 0) throw new GpaInputError(`Créditos da disciplina ${index + 1}: informe um número maior que zero.`)
    const excluded = grade < passingGrade && !input.includeFailed
    const converted = convertGrade(grade, method)
    return { name: course.name.trim() || `Disciplina ${index + 1}`, grade, credits, points: grade < passingGrade ? 0 : converted.points, letter: grade < passingGrade ? 'Reprovação' : converted.letter, excluded }
  })
  const included = courses.filter(course => !course.excluded)
  const totalWeight = included.reduce((sum, course) => sum + (course.credits ?? 1), 0)
  if (totalWeight === 0) return { gpa: null, sourceAverage: null, letter: null, courses, weighted, emptyAfterExclusions: true }
  const gpa = included.reduce((sum, course) => sum + course.points * (course.credits ?? 1), 0) / totalWeight
  const sourceAverage = included.reduce((sum, course) => sum + course.grade * (course.credits ?? 1), 0) / totalWeight
  return { gpa, sourceAverage, letter: convertGrade(sourceAverage, method).letter, courses, weighted, emptyAfterExclusions: false }
}
