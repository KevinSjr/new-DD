import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { test } from 'node:test'
import { ACHIEVEMENT_DEFINITIONS, evaluateAchievements } from '../server/achievements.mjs'

test('definições de conquistas têm chaves únicas e XP dentro do esquema', () => {
  assert.ok(ACHIEVEMENT_DEFINITIONS.length >= 80)
  assert.equal(new Set(ACHIEVEMENT_DEFINITIONS.map(item => item.key)).size, ACHIEVEMENT_DEFINITIONS.length)
  for (const item of ACHIEVEMENT_DEFINITIONS) {
    assert.ok(`achievement-${item.key}`.length <= 60)
    assert.ok(item.xp >= 1 && item.xp <= 100)
    assert.ok(item.target >= 1)
  }
})

test('marcos de dias e evolução exigem dias distintos e melhora real de faixa', () => {
  const state = {
    day:'2026-11-02', events:[], claims:[], profile:{ goal:false,destinations:[] },
    deadlines:[], documents:[], saved:[], tasks:[], gpa:false, streak:{ best:3 },
  }
  const found = key => evaluateAchievements(state).find(item => item.key === key)
  state.claims.push({ source:'sat',variant:'math',day:'2026-10-28' },{ source:'mext',variant:'A:english',day:'2026-10-29' },{ source:'sat',variant:'reading-writing',day:'2026-11-02' })
  assert.equal(found('practice-three').completed,true)
  assert.equal(found('practice-return').completed,true)
  assert.equal(found('practice-both').completed,false)
  assert.equal(found('streak-3').completed,true)
  state.events.push(
    { kind:'destination-complete',target:'run-a',day:'2026-10-31',details:{ signature:'aaaa',top:['canada'] } },
    { kind:'destination-complete',target:'run-b',day:'2026-10-31',details:{ signature:'bbbb',top:['japao'] } },
  )
  assert.equal(found('dest-evolving').completed,false)
  state.events.push({ kind:'destination-complete',target:'run-c',day:'2026-11-02',details:{ signature:'bbbb',top:['japao'] } })
  assert.equal(found('dest-evolving').completed,true)
  state.events.push(
    { kind:'sat-report',target:'practice-4-paper',day:'2026-10-29',created_at:'2026-10-29T12:00:00Z',details:{ reading:{ lower:500,upper:550 },math:{ lower:500,upper:550 } } },
    { kind:'sat-report',target:'practice-5-paper',day:'2026-11-02',created_at:'2026-11-02T12:00:00Z',details:{ reading:{ lower:540,upper:570 },math:{ lower:530,upper:560 } } },
  )
  assert.equal(found('sat-improved').completed,false)
  state.events.at(-1).details.reading.lower = 560
  assert.equal(found('sat-improved').completed,true)
})

if (process.env.ACCOUNT_API_URL) {
  test('eventos desbloqueiam conquistas uma vez e ficam isolados por conta', async () => {
    const origin = process.env.ACCOUNT_API_URL
    const password = 'senha longa exclusiva de teste'
    const cookies = []
    const call = (path, cookie = '', method = 'GET', payload) => fetch(`${origin}${path}`, {
      method, headers:{ Origin:origin, ...(cookie ? { Cookie:cookie } : {}), ...(payload ? { 'Content-Type':'application/json' } : {}) },
      ...(payload ? { body:JSON.stringify(payload) } : {}),
    })
    const register = async () => {
      const response = await call('/api/account/register','', 'POST', {
        displayName:'Teste Conquistas', email:`conquistas-${randomUUID()}@example.test`, password,
      })
      assert.equal(response.status,201)
      const cookie = response.headers.get('set-cookie').split(';')[0]
      cookies.push(cookie)
      return cookie
    }
    const event = (cookie,kind,target,details={}) => call('/api/account/achievements/events',cookie,'POST',{ kind,target,details })
    const missions = async cookie => (await (await call('/api/account/missions',cookie)).json())
    const earned = (state,key) => state.achievements.find(item => item.key === key)
    try {
      assert.equal((await event('','guide-view','canada')).status,401)
      const owner = await register()
      const other = await register()
      assert.equal((await event(owner,'guide-view','desconhecido')).status,400)
      assert.equal((await event(owner,'destination-guide',`${randomUUID()}:canada`,{ run:randomUUID(), slug:'canada',rank:1 })).status,400)
      assert.equal((await event(owner,'guide-view','canada')).status,200)
      let state = await missions(owner)
      assert.equal(earned(state,'guide-first').completed,true)
      const xp = state.xp
      assert.equal((await event(owner,'guide-view','canada')).status,200)
      state = await missions(owner)
      assert.equal(state.xp,xp)
      assert.equal(earned(await missions(other),'guide-first').completed,false)
      await event(owner,'guide-view','alemanha')
      await event(owner,'guide-view','japao')
      state = await missions(owner)
      assert.equal(earned(state,'guide-three').completed,true)
      assert.equal(earned(state,'guide-four-regions').progress,3)
      await event(owner,'rank-view','general')
      await event(owner,'rank-page','general:1',{ scope:'general' })
      await event(owner,'rank-page','general:2',{ scope:'general' })
      state = await missions(owner)
      assert.equal(earned(state,'rank-two-pages').completed,true)
      assert.equal(earned(state,'voc-course').available,false)
    } finally {
      for (const cookie of cookies) await call('/api/account/me',cookie,'DELETE',{ password }).catch(() => {})
    }
  })
}
