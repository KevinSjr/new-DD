import assert from 'node:assert/strict'
import { test } from 'node:test'
import { streakFromDays } from '../server/streak.mjs'

test('a sequência conta dias distintos e preserva o recorde após uma pausa', () => {
  assert.deepEqual(streakFromDays([], '2026-11-02'), { current:0, best:0, practicedToday:false })
  assert.deepEqual(streakFromDays(['2026-10-28', '2026-10-29', '2026-10-29', '2026-11-01'], '2026-11-02'),
    { current:1, best:2, practicedToday:false })
  assert.deepEqual(streakFromDays(['2026-10-28', '2026-10-29'], '2026-11-02'),
    { current:0, best:2, practicedToday:false })
})

test('a sequência atravessa meses e anos e não zera antes de terminar o dia seguinte', () => {
  const days = ['2025-12-31', '2026-01-01', '2026-01-02']
  assert.deepEqual(streakFromDays(days, '2026-01-02'), { current:3, best:3, practicedToday:true })
  assert.deepEqual(streakFromDays(days, '2026-01-03'), { current:3, best:3, practicedToday:false })
  assert.deepEqual(streakFromDays(days, '2026-01-04'), { current:0, best:3, practicedToday:false })
})
