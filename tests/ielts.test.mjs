import test from 'node:test'
import assert from 'node:assert/strict'
import { listeningSets, readingSets, writingTasks, speakingParts } from '../src/data/ieltsPractice.ts'
import { ieltsObjectiveReport, isIeltsAnswerCorrect, wordCount } from '../src/lib/ieltsPractice.ts'

test('Exame 1 has complete IELTS Academic section counts and unique objective items', () => {
  assert.deepEqual(listeningSets.map(set => set.items.length), [10, 10, 10, 10])
  assert.deepEqual(readingSets.map(set => set.items.length), [14, 13, 13])
  const readingWords = readingSets.reduce((total, set) => total + set.context.match(/[A-Za-z]+/g).length, 0)
  assert.ok(readingWords >= 2150 && readingWords <= 2750)
  assert.equal(writingTasks.length, 2)
  assert.equal(speakingParts.length, 3)
  const items = [...listeningSets, ...readingSets].flatMap(set => set.items)
  assert.equal(new Set(items.map(item => item.id)).size, 80)
  for (const item of items) {
    assert.ok(item.prompt.trim() && item.answer.trim() && item.explanation.trim())
    if (item.kind === 'choice') assert.ok(item.options.includes(item.answer), item.id)
  }
})

test('short answers accept case and punctuation variants but enforce word limits', () => {
  const item = listeningSets[1].items[1]
  assert.equal(isIeltsAnswerCorrect(item, 'Post office'), true)
  assert.equal(isIeltsAnswerCorrect(item, 'the post office'), false)
  const variant = listeningSets[3].items[1]
  assert.equal(isIeltsAnswerCorrect(variant, 'swamps'), true)
  assert.equal(isIeltsAnswerCorrect(variant, 'peatlands'), true)
  assert.equal(isIeltsAnswerCorrect(variant, 'marshes and swamps'), false)
  assert.equal(wordCount('  one   two\nthree '), 3)
})

test('practice report counts objective answers only', () => {
  const report = ieltsObjectiveReport({ l1: 'A single room at Oak House', r1: 'How shared objects are lent and managed', w1: 'An essay' })
  assert.deepEqual(report.map(section => [section.correct, section.answered, section.total]), [[1, 1, 40], [1, 1, 40]])
})
