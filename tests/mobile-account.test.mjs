import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { test } from 'node:test'

if (process.env.ACCOUNT_API_URL) {
  test('cliente móvel usa token sem cookie e revoga a sessão ao sair', async () => {
    const base = process.env.ACCOUNT_API_URL
    const password = 'senha longa exclusiva para teste móvel'
    let token = ''
    const call = async (path, method = 'GET', data, headers = {}) => {
      const response = await fetch(`${base}${path}`, {
        method,
        headers:{ 'X-Daydreaming-Client':'mobile', ...(token ? { Authorization:`Bearer ${token}` } : {}),
          ...(data ? { 'Content-Type':'application/json' } : {}), ...headers },
        body:data ? JSON.stringify(data) : undefined,
      })
      return { status:response.status, cookie:response.headers.get('set-cookie'), data:await response.json() }
    }
    try {
      const registered = await call('/api/account/register','POST',{
        displayName:'Teste Móvel', email:`mobile-${randomUUID()}@example.test`, password,
      })
      assert.equal(registered.status,201)
      assert.equal(registered.cookie,null)
      assert.match(registered.data.sessionToken,/^[a-f0-9]{64}$/)
      token = registered.data.sessionToken
      assert.equal((await call('/api/account/me')).data.user.id,registered.data.user.id)
      const profile = await call('/api/account/profile','PUT',{
        displayName:'Teste Perfil Móvel',fullName:'Pessoa de Teste',schoolName:'Escola Teste',schoolYear:'Último ano',
        city:'São Paulo',stateCode:'SP',studyLevel:'graduacao',interestArea:'Engenharia e tecnologia',
        destinationSlug:'canada',destinationSlugs:['canada','alemanha'],targetYear:'2028',
        gpa:'3,5',satScore:'1200',toeflScore:'100',ieltsScore:'7,5',
        languages:['Português','Inglês'],plannedExams:['SAT','TOEFL'],
      })
      assert.equal(profile.status,200)
      assert.equal(profile.data.user.displayName,'Teste Perfil Móvel')
      const storedProfile = (await call('/api/account/me')).data.user
      assert.equal(storedProfile.schoolName,'Escola Teste')
      assert.equal(storedProfile.gpa,3.5)
      assert.deepEqual(storedProfile.destinationSlugs,['canada','alemanha'])
      assert.deepEqual(storedProfile.plannedExams,['SAT','TOEFL'])
      assert.equal((await call('/api/account/journey')).status,200)
      assert.equal((await call('/api/account/saved-scholarships')).status,200)
      const missions = await call('/api/account/missions')
      assert.equal(missions.status,200)
      assert.equal(typeof missions.data.streak.current,'number')
      assert.equal(typeof missions.data.streak.best,'number')
      assert.equal(typeof missions.data.streak.practicedToday,'boolean')
      assert.ok(Array.isArray(missions.data.achievements))
      assert.equal((await call('/api/account/logout','POST')).status,200)
      assert.equal((await call('/api/account/me')).data.user,null)
      token = ''
      const login = await call('/api/account/login','POST',{ email:registered.data.user.email,password })
      assert.equal(login.status,200)
      token = login.data.sessionToken
      assert.equal((await call('/api/account/me','DELETE',{ password })).status,200)
      token = ''
    } finally {
      if (token) await call('/api/account/me','DELETE',{ password }).catch(() => {})
    }
  })
}
