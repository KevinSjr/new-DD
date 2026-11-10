import test from 'node:test'
import assert from 'node:assert/strict'
import { JLPT_BLUEPRINT } from '../src/data/jlptBlueprint.ts'
import { JLPT_LEVELS, jlptExams } from '../src/data/jlptPractice.ts'

test('Exame 1 follows the current section times and published approximate item counts', () => {
  assert.deepEqual(JLPT_LEVELS, ['N5', 'N4', 'N3', 'N2', 'N1'])
  for (const exam of jlptExams) {
    const blueprint = JLPT_BLUEPRINT[exam.level]
    assert.deepEqual(exam.sections.map(section => section.minutes), blueprint.minutes)
    const counts = ['vocabulary', 'grammar', 'reading', 'listening'].map(skill => exam.questions.filter(item => item.skill === skill).length)
    assert.deepEqual(counts, blueprint.items, exam.level)
    assert.equal(exam.questions.length, blueprint.items.reduce((sum, value) => sum + value, 0))
  }
})

test('Every authored item has a valid, unambiguous answer and supported comprehension evidence', () => {
  for (const exam of jlptExams) {
    assert.equal(new Set(exam.questions.map(item => item.id)).size, exam.questions.length)
    for (const item of exam.questions) {
      assert.equal(item.options.length, 4, item.id)
      assert.equal(new Set(item.options).size, 4, item.id)
      assert.ok(item.prompt && Number.isInteger(item.answer) && item.answer >= 0 && item.answer < 4, item.id)
      if (item.skill === 'reading' || item.skill === 'listening') {
        const source = item.context || item.audio || ''
        assert.ok(source.includes(item.options[item.answer]), `${item.id}: answer absent from passage or audio`)
      }
    }
  }
})
