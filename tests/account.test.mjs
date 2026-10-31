import assert from 'node:assert/strict'
import { test } from 'node:test'
import { randomUUID } from 'node:crypto'
import { hashPassword, verifyPassword, validateRegistration, validateProfile } from '../server/account.mjs'

test('senhas recebem salt individual e nunca são comparadas em texto puro', async () => {
  const first = await hashPassword('uma senha longa e exclusiva')
  const second = await hashPassword('uma senha longa e exclusiva')
  assert.notEqual(first, second)
  assert.equal(first.includes('uma senha longa'), false)
  assert.equal(await verifyPassword('uma senha longa e exclusiva', first), true)
  assert.equal(await verifyPassword('senha incorreta', first), false)
  assert.equal(await verifyPassword('qualquer senha', 'hash inválido'), false)
})

test('cadastro limita dados pessoais e normaliza e-mail', () => {
  const valid = validateRegistration({ displayName: '  Ana   Silva  ', email: ' ANA@EXAMPLE.COM ', password: 'senha com doze caracteres' })
  assert.equal(valid.name, 'Ana Silva')
  assert.equal(valid.email, 'ana@example.com')
  assert.throws(() => validateRegistration({ displayName: 'A', email: 'ana@example.com', password: 'senha curta' }), /nome/)
  assert.throws(() => validateRegistration({ displayName: 'Ana', email: 'inválido', password: 'senha com doze caracteres' }), /e-mail/)
  assert.throws(() => validateRegistration({ displayName: 'Ana', email: 'ana@example.com', password: 'curta' }), /senha/)
})

test('perfil aceita campos opcionais e rejeita valores fora do domínio', () => {
  const valid = validateProfile({ displayName: 'Ana', studyLevel: '', interestArea: '', destinationSlug: '' })
  assert.equal(valid.level, null)
  assert.equal(valid.area, null)
  assert.equal(valid.destination, null)
  assert.throws(() => validateProfile({ displayName: 'Ana', studyLevel: 'admin', interestArea: '', destinationSlug: '' }), /nível/)
  assert.throws(() => validateProfile({ displayName: 'Ana', studyLevel: '', interestArea: '', destinationSlug: '../outro' }), /destino/)
  const detailed = validateProfile({ displayName: 'Ana', studyLevel: 'graduacao', interestArea: 'Ciências', destinationSlugs: ['canada', 'alemanha'], fullName: 'Ana Silva', schoolName: 'Escola Pública', schoolYear: '3º ano', city: 'São Paulo', stateCode: 'sp', gpa: '3,80', satScore: '1200', toeflScore: '102', ieltsScore: '7.5', languages: ['Português', 'Inglês'], plannedExams: ['SAT'], targetYear: '2028' })
  assert.deepEqual(detailed.destinations, ['canada', 'alemanha'])
  assert.equal(detailed.stateCode, 'SP')
  assert.equal(detailed.gpa, 3.8)
  assert.equal(detailed.ieltsScore, 7.5)
  assert.throws(() => validateProfile({ displayName: 'Ana', destinationSlugs: ['canada', 'alemanha', 'franca', 'japao'] }), /três destinos/)
  assert.throws(() => validateProfile({ displayName: 'Ana', gpa: 4.5 }), /GPA/)
  assert.throws(() => validateProfile({ displayName: 'Ana', languages: ['Inglês', 'Inglês'] }), /Idiomas/)
})

if (process.env.ACCOUNT_API_URL) {
  test('API persiste perfil e protege sessão, senha e exclusão da conta', async () => {
    const origin = process.env.ACCOUNT_API_URL
    const email = `teste-${randomUUID()}@example.test`
    const initialPassword = 'senha inicial longa para teste'
    const replacementPassword = 'nova senha longa para teste'
    let cookie = ''
    let activePassword = initialPassword
    let removedAccount = false
    async function request(path, method = 'GET', data, extraHeaders = {}) {
      const response = await fetch(`${origin}${path}`, {
        method,
        headers: { ...(cookie ? { Cookie: cookie } : {}), ...(data === undefined ? {} : { 'Content-Type': 'application/json' }), Origin: origin, ...extraHeaders },
        body: data === undefined ? undefined : JSON.stringify(data),
      })
      const nextCookie = response.headers.get('set-cookie')?.split(';')[0]
      if (nextCookie) cookie = nextCookie
      return { status: response.status, setCookie: response.headers.get('set-cookie'), data: await response.json() }
    }
    try {
      const anonymousUpdate = await request('/api/account/profile', 'PUT', { displayName: 'Pessoa Teste', studyLevel: '', interestArea: '', destinationSlug: '' })
      assert.equal(anonymousUpdate.status, 401)
      const registered = await request('/api/account/register', 'POST', { displayName: 'Pessoa Teste', email, password: initialPassword })
      assert.equal(registered.status, 201)
      assert.ok(cookie.startsWith('dd_account='))
      assert.match(registered.setCookie, /HttpOnly; SameSite=Strict/)
      assert.equal(registered.data.user.email, email)
      assert.equal('password_hash' in registered.data.user, false)
      const me = await request('/api/account/me')
      assert.equal(me.data.user.email, email)
      const forbidden = await request('/api/account/profile', 'PUT', { displayName: 'Alterado', studyLevel: '', interestArea: '', destinationSlug: '' }, { Origin: 'https://outro.example' })
      assert.equal(forbidden.status, 403)
      const viteAlternatePort = await request('/api/account/profile', 'PUT', { displayName: 'Pessoa Teste', studyLevel: '', interestArea: '', destinationSlug: '' }, { Origin: 'http://127.0.0.1:5174' })
      assert.equal(viteAlternatePort.status, 200)
      const invalidDestination = await request('/api/account/profile', 'PUT', { displayName: 'Pessoa Teste', studyLevel: '', interestArea: '', destinationSlug: 'destino-inexistente' })
      assert.equal(invalidDestination.status, 400)
      const saved = await request('/api/account/profile', 'PUT', { displayName: 'Pessoa Atualizada', studyLevel: 'mestrado', interestArea: 'Ciência de dados', destinationSlug: 'canada', destinationSlugs: ['canada', 'alemanha'], fullName: 'Pessoa de Teste', schoolName: 'Escola Teste', schoolYear: 'Último ano', city: 'São Paulo', stateCode: 'SP', gpa: '3.8', satScore: '1200', toeflScore: '100', ieltsScore: '7.5', languages: ['Português', 'Inglês'], plannedExams: ['SAT'], targetYear: '2028' })
      assert.equal(saved.status, 200)
      assert.equal(saved.data.user.destinationSlug, 'canada')
      assert.deepEqual(saved.data.user.destinationSlugs, ['canada', 'alemanha'])
      assert.equal(saved.data.user.schoolName, 'Escola Teste')
      assert.equal(saved.data.user.gpa, 3.8)
      const changed = await request('/api/account/password', 'POST', { currentPassword: initialPassword, newPassword: replacementPassword })
      assert.equal(changed.status, 200)
      activePassword = replacementPassword
      const signedOut = await request('/api/account/logout', 'POST')
      assert.equal(signedOut.status, 200)
      const noSession = await request('/api/account/me')
      assert.equal(noSession.data.user, null)
      const oldLogin = await request('/api/account/login', 'POST', { email, password: initialPassword })
      assert.equal(oldLogin.status, 401)
      const newLogin = await request('/api/account/login', 'POST', { email, password: replacementPassword })
      assert.equal(newLogin.status, 200)
      assert.equal(newLogin.data.user.interestArea, 'Ciência de dados')
      assert.deepEqual(newLogin.data.user.destinationSlugs, ['canada', 'alemanha'])
      assert.equal(newLogin.data.user.schoolYear, 'Último ano')
      const removed = await request('/api/account/me', 'DELETE', { password: replacementPassword })
      assert.equal(removed.status, 200)
      removedAccount = true
      assert.equal((await request('/api/account/me')).data.user, null)
    } finally {
      if (!removedAccount) {
        if (!cookie || cookie.endsWith('=')) await request('/api/account/login', 'POST', { email, password: activePassword }).catch(() => {})
        if (cookie && !cookie.endsWith('=')) await request('/api/account/me', 'DELETE', { password: activePassword }).catch(() => {})
      }
    }
  })
}
