import assert from 'node:assert/strict'
import { topikExams } from '../src/data/topikPractice.ts'

assert.deepEqual(topikExams.map(exam => [exam.level, exam.questions.length, exam.sections.reduce((sum, section) => sum + section.minutes, 0)]), [
  ['I', 70, 100],
  ['II', 104, 180],
])
assert.deepEqual(topikExams[0].sections.map(section => [section.id, section.questions.length, section.minutes]), [
  ['listening', 30, 40], ['reading', 40, 60],
])
assert.deepEqual(topikExams[1].sections.map(section => [section.id, section.questions.length, section.minutes]), [
  ['listening', 50, 60], ['writing', 4, 50], ['reading', 50, 70],
])
for (const exam of topikExams) {
  const ids = exam.questions.map(question => question.id)
  assert.equal(new Set(ids).size, ids.length, `IDs duplicados no TOPIK ${exam.level}`)
  for (const question of exam.questions) {
    if (question.skill === 'writing') {
      assert.equal(question.options, undefined)
      assert.equal(question.answer, undefined)
      continue
    }
    assert.equal(question.options.length, 4, question.id)
    assert.equal(new Set(question.options).size, 4, question.id)
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, question.id)
    assert.ok(question.skill === 'listening' ? question.audio : question.passage, question.id)
  }
}
console.log('TOPIK: estrutura e banco de questões válidos.')
