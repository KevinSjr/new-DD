import test from 'node:test'
import assert from 'node:assert/strict'
import { GPA_METHODS } from '../src/data/gpaMethods.ts'
import { calculateGpa, convertGrade, parseDecimal, GpaInputError } from '../src/lib/gpa.ts'

const [bands, proportional, letters] = GPA_METHODS
const row = (grade, credits = '') => ({ name: '', grade, credits })

test('accepts decimal comma or point and rejects invalid/out-of-range values', () => {
  assert.equal(parseDecimal('8,5', 'Nota', 0, 10), 8.5)
  assert.equal(parseDecimal('8.5', 'Nota', 0, 10), 8.5)
  for (const value of ['', 'abc', '8,5,2', '-1', '10,01', 'Infinity']) {
    assert.throws(() => parseDecimal(value, 'Nota', 0, 10), GpaInputError)
  }
})

test('band boundaries are inclusive below and exclusive above, except 10', () => {
  for (const [grade, expected] of [[10, 4], [9, 4], [8.99, 3.7], [8.5, 3.7], [6, 2], [5.99, 1.5], [5, 1.5], [4.99, 0], [0, 0]]) {
    assert.equal(convertGrade(grade, bands).points, expected, String(grade))
  }
  assert.equal(convertGrade(8.95, bands).points, 3.7)
  assert.equal(convertGrade(5.99, letters).points, 0)
  assert.equal(convertGrade(8.5, proportional).points, 3.4)
})

test('average mode converts directly without rounding', () => {
  const result = calculateGpa({ mode: 'average', average: '8,95' }, proportional)
  assert.equal(result.gpa, 3.5799999999999996)
  assert.equal(result.sourceAverage, 8.95)
})

test('unweighted and weighted course averages', () => {
  const base = { mode: 'courses', passingGrade: '6', includeFailed: true }
  const simple = calculateGpa({ ...base, courses: [row('9'), row('7')] }, bands)
  assert.equal(simple.gpa, 3.35)
  assert.equal(simple.sourceAverage, 8)
  assert.equal(simple.weighted, false)
  const weighted = calculateGpa({ ...base, courses: [row('9', '3'), row('7', '1')] }, bands)
  assert.equal(weighted.gpa, 3.675)
  assert.equal(weighted.sourceAverage, 8.5)
  assert.equal(weighted.weighted, true)
})

test('mixed credits and nonpositive credits are rejected', () => {
  const base = { mode: 'courses', passingGrade: '6', includeFailed: true }
  assert.throws(() => calculateGpa({ ...base, courses: [row('9', '3'), row('7')] }, bands), GpaInputError)
  assert.throws(() => calculateGpa({ ...base, courses: [row('9', '0')] }, bands), GpaInputError)
})

test('failed courses count as zero or are excluded; all excluded is empty, never NaN', () => {
  const base = { mode: 'courses', passingGrade: '6', courses: [row('5'), row('9')] }
  assert.equal(calculateGpa({ ...base, includeFailed: true }, proportional).gpa, 1.8)
  assert.equal(calculateGpa({ ...base, includeFailed: false }, proportional).gpa, 3.6)
  const empty = calculateGpa({ ...base, courses: [row('5')], includeFailed: false }, proportional)
  assert.equal(empty.gpa, null)
  assert.equal(empty.emptyAfterExclusions, true)
})

test('the same input can be calculated under all three methods', () => {
  const results = GPA_METHODS.map(method => calculateGpa({ mode: 'average', average: '8,5' }, method).gpa)
  assert.deepEqual(results, [3.7, 3.4, 3])
})
