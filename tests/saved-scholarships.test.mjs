import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { test } from 'node:test'

if (process.env.ACCOUNT_API_URL) {
  test('bolsas salvas pertencem à conta e referenciam registros do catálogo', async () => {
    const origin = process.env.ACCOUNT_API_URL
    const password = 'senha longa exclusiva de teste'
    const accounts = []
    const call = (path, cookie = '', method = 'GET', payload) => fetch(`${origin}${path}`, {
      method,
      headers:{ Origin:origin, ...(cookie ? { Cookie:cookie } : {}), ...(payload ? { 'Content-Type':'application/json' } : {}) },
      ...(payload ? { body:JSON.stringify(payload) } : {}),
    })
    async function register() {
      const response = await call('/api/account/register', '', 'POST', {
        displayName:'Teste Bolsas', email:`bolsas-${randomUUID()}@example.test`, password,
      })
      assert.equal(response.status, 201)
      const cookie = response.headers.get('set-cookie').split(';')[0]
      accounts.push(cookie)
      return cookie
    }
    try {
      const catalog = await (await call('/api/scholarship-catalog')).json()
      assert.ok(catalog.items.length > 0, 'o catálogo precisa ter uma bolsa para o teste')
      const scholarship = catalog.items[0]
      const payload = { source:scholarship.source, sourceId:scholarship.source_id }
      assert.equal((await call('/api/account/saved-scholarships')).status, 401)
      const owner = await register()
      const other = await register()
      const invalid = await call('/api/account/saved-scholarships', owner, 'POST', { source:'invalid', sourceId:'missing' })
      assert.equal(invalid.status, 404)
      assert.equal((await call('/api/account/saved-scholarships', owner, 'POST', payload)).status, 200)
      assert.equal((await call('/api/account/saved-scholarships', owner, 'POST', payload)).status, 200)
      const ownerItems = (await (await call('/api/account/saved-scholarships', owner)).json()).items
      assert.equal(ownerItems.length, 1)
      assert.equal(ownerItems[0].title, scholarship.title)
      assert.deepEqual((await (await call('/api/account/saved-scholarships', other)).json()).items, [])
      const deadlineInput = { title:'Candidatura de teste', dueDate:'2027-03-15', savedSource:scholarship.source, savedSourceId:scholarship.source_id }
      assert.equal((await call('/api/account/journey/deadlines', other, 'POST', deadlineInput)).status, 400)
      const deadline = await call('/api/account/journey/deadlines', owner, 'POST', deadlineInput)
      assert.equal(deadline.status, 201)
      const deadlineId = (await deadline.json()).id
      const missions = await (await call('/api/account/missions', owner)).json()
      assert.equal(missions.achievements.find(item => item.key === 'sch-application-plan').completed, true)
      const query = new URLSearchParams({ source:scholarship.source, sourceId:scholarship.source_id })
      assert.equal((await call(`/api/account/saved-scholarships?${query}`, other, 'DELETE')).status, 200)
      assert.equal((await (await call('/api/account/saved-scholarships', owner)).json()).items.length, 1)
      assert.equal((await call(`/api/account/saved-scholarships?${query}`, owner, 'DELETE')).status, 200)
      assert.deepEqual((await (await call('/api/account/saved-scholarships', owner)).json()).items, [])
      const journey = await (await call('/api/account/journey', owner)).json()
      assert.equal(journey.deadlines.find(item => item.id === deadlineId).savedSource, null)
    } finally {
      for (const cookie of accounts) {
        await call('/api/account/me', cookie, 'DELETE', { password }).catch(() => {})
      }
    }
  })
}
