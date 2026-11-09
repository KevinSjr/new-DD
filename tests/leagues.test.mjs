import assert from 'node:assert/strict'
import { test } from 'node:test'
import { leagueDay, leaguePoints, leagueRewardXp, leagueSource, leagueTier, leagueWeekStart } from '../server/leagues.mjs'

test('semana da liga começa na segunda-feira em São Paulo', () => {
  assert.equal(leagueDay(new Date('2026-11-09T02:30:00Z')),'2026-11-08')
  assert.equal(leagueWeekStart('2026-11-08'),'2026-11-02')
  assert.equal(leagueWeekStart('2026-11-09'),'2026-11-09')
})

test('somente acertos geram pontos; liga seguinte depende da semana anterior', () => {
  assert.equal(leaguePoints([{correct:false},{correct:false},{correct:false}]),0)
  assert.equal(leaguePoints([{correct:true},{correct:true},{correct:false}]),20)
  assert.equal(leaguePoints(Array.from({length:5},()=>({correct:true}))),50)
  assert.equal(leagueTier(139),'bronze')
  assert.equal(leagueTier(140),'silver')
  assert.equal(leagueTier(279),'silver')
  assert.equal(leagueTier(280),'gold')
  assert.equal(leagueRewardXp(139),0)
  assert.equal(leagueRewardXp(140),20)
  assert.equal(leagueRewardXp(280),40)
  assert.equal(leagueSource('sat-reading-writing'),'sat-reading-writing')
  assert.equal(leagueSource('sat-math'),'sat-math')
  assert.throws(()=>leagueSource('sat'),/Liga não encontrada/)
  assert.throws(()=>leagueSource('gpa'),/Liga não encontrada/)
})
