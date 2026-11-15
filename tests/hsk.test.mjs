import assert from 'node:assert/strict'
import { hskExams } from '../src/data/hskPractice.ts'

const expected = [
  [1, 20, 20, 0, 40], [2, 35, 25, 0, 55], [3, 40, 30, 10, 90],
  [4, 45, 40, 15, 105], [5, 45, 45, 10, 125], [6, 50, 50, 1, 140],
]
for (const [level, listening, reading, writing, duration] of expected) {
  const exam = hskExams.find(item => item.level === level)
  assert.ok(exam)
  assert.equal(exam.duration, duration)
  assert.equal(exam.sections.find(item => item.id === 'listening')?.questions.length, listening)
  assert.equal(exam.sections.find(item => item.id === 'reading')?.questions.length, reading)
  assert.equal(exam.sections.find(item => item.id === 'writing')?.questions.length || 0, writing)
  assert.equal(exam.questions.length, listening + reading + writing)
  assert.equal(new Set(exam.questions.map(item => item.id)).size, exam.questions.length)
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
console.log('HSK: seis níveis, tempos, contagens e alternativas válidos.')
