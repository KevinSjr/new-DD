import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { database } from './db.mjs'

const scrypt = promisify(scryptCallback)
const cookieName = 'dd_account'
const sessionDays = 30
const studyLevels = new Set(['graduacao', 'pos-graduacao', 'mestrado', 'doutorado', 'intercambio', 'idiomas', 'curso-curto', 'pesquisa', 'outro'])
const loginAttempts = new Map()
const error = (status, message) => Object.assign(new Error(message), { status })
const tokenHash = token => createHash('sha256').update(token).digest('hex')

export function validateRegistration(input) {
  const name = typeof input?.displayName === 'string' ? input.displayName.trim().replace(/\s+/g, ' ') : ''
  const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : ''
  const password = input?.password
  if (name.length < 2 || name.length > 80) throw error(400, 'Informe um nome de 2 a 80 caracteres.')
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw error(400, 'Informe um e-mail válido.')
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw error(400, 'A senha deve ter de 12 a 128 caracteres.')
  return { name, email, password }
}

export function validateProfile(input) {
  const name = typeof input?.displayName === 'string' ? input.displayName.trim().replace(/\s+/g, ' ') : ''
  const level = input?.studyLevel === '' ? null : input?.studyLevel
  const area = typeof input?.interestArea === 'string' ? input.interestArea.trim() || null : null
  const destination = input?.destinationSlug === '' ? null : input?.destinationSlug
  if (name.length < 2 || name.length > 80) throw error(400, 'Informe um nome de 2 a 80 caracteres.')
  if (level !== null && !studyLevels.has(level)) throw error(400, 'Escolha um nível de estudo válido.')
  if (area !== null && area.length > 100) throw error(400, 'A área de interesse deve ter até 100 caracteres.')
  if (destination !== null && (typeof destination !== 'string' || !/^[a-z0-9-]{2,50}$/.test(destination))) throw error(400, 'Escolha um destino válido.')
  return { name, level, area, destination }
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derived = await scrypt(password, salt, 64)
  return `scrypt$${salt}$${derived.toString('hex')}`
}

export async function verifyPassword(password, stored) {
  const parts = typeof stored === 'string' ? stored.split('$') : []
  if (parts.length !== 3 || parts[0] !== 'scrypt' || !/^[a-f0-9]{32}$/.test(parts[1]) || !/^[a-f0-9]{128}$/.test(parts[2])) return false
  const derived = await scrypt(password, parts[1], 64)
  return timingSafeEqual(derived, Buffer.from(parts[2], 'hex'))
}

function cookieToken(req) {
  const match = (req.headers.cookie || '').match(/(?:^|;\s*)dd_account=([a-f0-9]{64})(?:;|$)/)
  return match?.[1] || null
}

function setCookie(res, token, production) {
  const secure = production ? '; Secure' : ''
  const value = token
    ? `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/api/account; Max-Age=${sessionDays * 86400}${secure}`
    : `${cookieName}=; HttpOnly; SameSite=Strict; Path=/api/account; Max-Age=0${secure}`
  res.setHeader('Set-Cookie', value)
}

async function createSession(res, userId, production) {
  const token = randomBytes(32).toString('hex')
  await database().query('DELETE FROM user_sessions WHERE expires_at <= now()')
  await database().query('INSERT INTO user_sessions (token_hash,user_id,expires_at) VALUES ($1,$2,now() + interval \'30 days\')', [tokenHash(token), userId])
  setCookie(res, token, production)
}

async function currentUser(req) {
  const token = cookieToken(req)
  if (!token) return null
  const result = await database().query(`SELECT a.id,a.email,a.display_name,a.created_at,
    p.study_level,p.interest_area,p.destination_slug
    FROM user_sessions s JOIN user_accounts a ON a.id=s.user_id
    JOIN user_profiles p ON p.user_id=a.id
    WHERE s.token_hash=$1 AND s.expires_at > now()`, [tokenHash(token)])
  return result.rows[0] || null
}

function publicUser(row) {
  return {
    id: row.id, email: row.email, displayName: row.display_name,
    studyLevel: row.study_level, interestArea: row.interest_area,
    destinationSlug: row.destination_slug, createdAt: row.created_at,
  }
}

function checkRate(req) {
  const key = req.socket.remoteAddress || 'unknown'
  const record = loginAttempts.get(key)
  if (record && record.until > Date.now() && record.count >= 10) throw error(429, 'Muitas tentativas. Tente novamente em 15 minutos.')
  return key
}

function failedLogin(key) {
  const old = loginAttempts.get(key)
  const next = old && old.until > Date.now() ? old : { count: 0, until: Date.now() + 15 * 60_000 }
  next.count += 1
  loginAttempts.set(key, next)
}

export async function handleAccountRequest(req, res, url, { json, body, originAllowed, production }) {
  if (!url.pathname.startsWith('/api/account/')) return false
  const path = url.pathname
  const method = req.method
  if (method === 'GET' && path === '/api/account/me') {
    const user = await currentUser(req)
    json(res, 200, { user: user ? publicUser(user) : null })
    return true
  }
  if (method === 'GET' && path === '/api/account/destinations') {
    const result = await database().query('SELECT slug,name FROM countries ORDER BY name')
    json(res, 200, result.rows)
    return true
  }
  if (!originAllowed(req)) throw error(403, 'Origem não permitida.')

  if (method === 'POST' && path === '/api/account/register') {
    const key = checkRate(req)
    const { name, email, password } = validateRegistration(await body(req))
    const passwordHash = await hashPassword(password)
    const client = await database().connect()
    let row
    try {
      await client.query('BEGIN')
      const inserted = await client.query('INSERT INTO user_accounts (email,password_hash,display_name) VALUES ($1,$2,$3) RETURNING id,email,display_name,created_at', [email, passwordHash, name])
      row = inserted.rows[0]
      await client.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [row.id])
      await client.query('COMMIT')
    } catch (cause) {
      await client.query('ROLLBACK')
      if (cause.code === '23505') throw error(409, 'Este e-mail já está cadastrado.')
      throw cause
    } finally { client.release() }
    await createSession(res, row.id, production)
    loginAttempts.delete(key)
    json(res, 201, { user: publicUser({ ...row, study_level: null, interest_area: null, destination_slug: null }) })
    return true
  }

  if (method === 'POST' && path === '/api/account/login') {
    const key = checkRate(req)
    const data = await body(req)
    const email = typeof data?.email === 'string' ? data.email.trim().toLowerCase() : ''
    const password = data?.password
    if (email.length > 254 || typeof password !== 'string' || password.length > 128) throw error(400, 'Credenciais inválidas.')
    const found = await database().query('SELECT id,password_hash FROM user_accounts WHERE lower(email)=$1', [email])
    const row = found.rows[0]
    const valid = row && await verifyPassword(password, row.password_hash)
    if (!valid) { failedLogin(key); throw error(401, 'E-mail ou senha incorretos.') }
    await createSession(res, row.id, production)
    loginAttempts.delete(key)
    const loaded = await database().query(`SELECT a.id,a.email,a.display_name,a.created_at,p.study_level,p.interest_area,p.destination_slug
      FROM user_accounts a JOIN user_profiles p ON p.user_id=a.id WHERE a.id=$1`, [row.id])
    json(res, 200, { user: publicUser(loaded.rows[0]) })
    return true
  }

  if (method === 'POST' && path === '/api/account/logout') {
    const token = cookieToken(req)
    if (token) await database().query('DELETE FROM user_sessions WHERE token_hash=$1', [tokenHash(token)])
    setCookie(res, null, production)
    json(res, 200, { ok: true })
    return true
  }

  const user = await currentUser(req)
  if (!user) throw error(401, 'Entre na sua conta para continuar.')

  if (method === 'PUT' && path === '/api/account/profile') {
    const data = validateProfile(await body(req))
    if (data.destination) {
      const exists = await database().query('SELECT 1 FROM countries WHERE slug=$1', [data.destination])
      if (!exists.rowCount) throw error(400, 'Escolha um destino válido.')
    }
    const client = await database().connect()
    try {
      await client.query('BEGIN')
      await client.query('UPDATE user_accounts SET display_name=$1,updated_at=now() WHERE id=$2', [data.name, user.id])
      await client.query(`UPDATE user_profiles SET study_level=$1,interest_area=$2,destination_slug=$3,updated_at=now()
        WHERE user_id=$4`, [data.level, data.area, data.destination, user.id])
      await client.query('COMMIT')
    } catch (cause) { await client.query('ROLLBACK'); throw cause } finally { client.release() }
    json(res, 200, { user: { ...publicUser(user), displayName: data.name, studyLevel: data.level, interestArea: data.area, destinationSlug: data.destination } })
    return true
  }

  if (method === 'POST' && path === '/api/account/password') {
    const data = await body(req)
    if (typeof data?.currentPassword !== 'string' || !(await verifyPassword(data.currentPassword, (await database().query('SELECT password_hash FROM user_accounts WHERE id=$1', [user.id])).rows[0]?.password_hash))) {
      throw error(401, 'Senha atual incorreta.')
    }
    if (typeof data.newPassword !== 'string' || data.newPassword.length < 12 || data.newPassword.length > 128) throw error(400, 'A nova senha deve ter de 12 a 128 caracteres.')
    const passwordHash = await hashPassword(data.newPassword)
    const client = await database().connect()
    try {
      await client.query('BEGIN')
      await client.query('UPDATE user_accounts SET password_hash=$1,updated_at=now() WHERE id=$2', [passwordHash, user.id])
      await client.query('DELETE FROM user_sessions WHERE user_id=$1', [user.id])
      await client.query('COMMIT')
    } catch (cause) { await client.query('ROLLBACK'); throw cause } finally { client.release() }
    await createSession(res, user.id, production)
    json(res, 200, { ok: true })
    return true
  }

  if (method === 'DELETE' && path === '/api/account/me') {
    const data = await body(req)
    const stored = await database().query('SELECT password_hash FROM user_accounts WHERE id=$1', [user.id])
    if (typeof data?.password !== 'string' || !(await verifyPassword(data.password, stored.rows[0]?.password_hash))) throw error(401, 'Senha incorreta.')
    await database().query('DELETE FROM user_accounts WHERE id=$1', [user.id])
    setCookie(res, null, production)
    json(res, 200, { deleted: true })
    return true
  }

  throw error(404, 'Rota não encontrada.')
}
