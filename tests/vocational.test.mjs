import test from 'node:test'
import assert from 'node:assert/strict'
import { QUESTION_STEPS } from '../src/data/vocationalQuestions.ts'
import { calculateVocationalScores } from '../src/lib/vocational.ts'

test('questionnaire has ten steps of six unique questions', () => {
  const questions = QUESTION_STEPS.flat()
  assert.equal(QUESTION_STEPS.length, 10)
  assert.ok(QUESTION_STEPS.every(step => step.length === 6))
  assert.equal(new Set(questions.map(question => question.id)).size, 60)
})

test('scores all six interests and ranks the two highest', () => {
  const answers = Object.fromEntries(QUESTION_STEPS.flat().map(question =>
    [question.id, question.area === 'social' ? 5 : question.area === 'creative' ? 4 : 2]))
  const scores = calculateVocationalScores(answers)
  assert.equal(scores.length, 6)
  assert.deepEqual(scores.slice(0,2).map(item => [item.area,item.mean]), [['social',5],['creative',4]])
  assert.ok(scores.slice(2).every(item => item.mean === 2))
})

test('does not produce a partial result when an activity is unanswered', () => {
  const answers = Object.fromEntries(QUESTION_STEPS.flat().slice(1).map(question => [question.id,3]))
  assert.throws(() => calculateVocationalScores(answers), /Responda todas/)
})
