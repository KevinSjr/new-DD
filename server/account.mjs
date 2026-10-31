import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { database } from './db.mjs'

const scrypt = promisify(scryptCallback)
const cookieName = 'dd_account'
const sessionDays = 30
const studyLevels = new Set(['graduacao', 'pos-graduacao', 'mestrado', 'doutorado', 'intercambio', 'idiomas', 'curso-curto', 'pesquisa', 'outro'])
const languages = new Set(['Português', 'Inglês', 'Espanhol', 'Alemão', 'Francês', 'Japonês', 'Coreano', 'Mandarim', 'Outro'])
const plannedExams = new Set(['TOEFL', 'IELTS', 'Duolingo English Test', 'SAT', 'GRE', 'GMAT', 'JLPT', 'TOPIK', 'HSK', 'Outro'])
const targetYears = new Set(['2027', '2028', '2029-plus', 'undecided'])
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
  const level = input?.studyLevel === '' || input?.studyLevel === undefined ? null : input.studyLevel
  const area = typeof input?.interestArea === 'string' ? input.interestArea.trim() || null : null
  const destination = input?.destinationSlug === '' || input?.destinationSlug === undefined ? null : input.destinationSlug
  const optionalText = (value, max, label) => {
    if (value === undefined || value === null || value === '') return null
    if (typeof value !== 'string') throw error(400, `${label} inválido.`)
    const cleaned = value.trim().replace(/\s+/g, ' ')
    if (cleaned.length > max) throw error(400, `${label} deve ter até ${max} caracteres.`)
    return cleaned || null
  }
  const optionalNumber = (value, min, max, label, step) => {
    if (value === undefined || value === null || value === '') return null
    const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.replace(',', '.')) : NaN
    if (!Number.isFinite(number) || number < min || number > max || (step && Math.abs(number / step - Math.round(number / step)) > 1e-8)) throw error(400, `${label} fora do intervalo permitido.`)
    return number
  }
  const list = (value, allowed, label) => {
    if (value === undefined || value === null) return []
    if (!Array.isArray(value) || value.length > 10 || value.some(item => !allowed.has(item)) || new Set(value).size !== value.length) throw error(400, `${label} inválidos.`)
    return value
  }
  const fullName = optionalText(input?.fullName, 120, 'Nome completo')
  const schoolName = optionalText(input?.schoolName, 120, 'Escola')
  const schoolYear = optionalText(input?.schoolYear, 80, 'Série ou ano')
  const city = optionalText(input?.city, 100, 'Cidade')
  const stateCode = optionalText(input?.stateCode, 2, 'Estado')?.toUpperCase() || null
  const gpa = optionalNumber(input?.gpa, 0, 4, 'GPA', 0.01)
  const satScore = optionalNumber(input?.satScore, 400, 1600, 'SAT', 1)
  const toeflScore = optionalNumber(input?.toeflScore, 0, 120, 'TOEFL', 1)
  const ieltsScore = optionalNumber(input?.ieltsScore, 0, 9, 'IELTS', 0.5)
  const selectedLanguages = list(input?.languages, languages, 'Idiomas')
  const selectedExams = list(input?.plannedExams, plannedExams, 'Exames')
  const targetYear = input?.targetYear === '' || input?.targetYear === undefined ? null : input.targetYear
  const destinations = input?.destinationSlugs === undefined ? (destination ? [destination] : []) : input.destinationSlugs
  if (name.length < 2 || name.length > 80) throw error(400, 'Informe um nome de 2 a 80 caracteres.')
  if (level !== null && !studyLevels.has(level)) throw error(400, 'Escolha um nível de estudo válido.')
  if (area !== null && area.length > 100) throw error(400, 'A área de interesse deve ter até 100 caracteres.')
  if (destination !== null && (typeof destination !== 'string' || !/^[a-z0-9-]{2,50}$/.test(destination))) throw error(400, 'Escolha um destino válido.')
  if (stateCode !== null && !/^[A-Z]{2}$/.test(stateCode)) throw error(400, 'Informe uma sigla de estado com duas letras.')
  if (targetYear !== null && !targetYears.has(targetYear)) throw error(400, 'Escolha um ano de início válido.')
  if (!Array.isArray(destinations) || destinations.length > 3 || new Set(destinations).size !== destinations.length || destinations.some(item => typeof item !== 'string' || !/^[a-z0-9-]{2,50}$/.test(item))) throw error(400, 'Escolha até três destinos válidos.')
  return { name, level, area, destination: destinations[0] || null, destinations, fullName, schoolName, schoolYear, city, stateCode, gpa, satScore, toeflScore, ieltsScore, languages: selectedLanguages, plannedExams: selectedExams, targetYear }
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
    p.*, ARRAY(SELECT d.country_slug FROM user_profile_destinations d WHERE d.user_id=a.id ORDER BY d.position) AS destination_slugs
    FROM user_sessions s JOIN user_accounts a ON a.id=s.user_id
    JOIN user_profiles p ON p.user_id=a.id
    WHERE s.token_hash=$1 AND s.expires_at > now()`, [tokenHash(token)])
  return result.rows[0] || null
}

function publicUser(row) {
  return {
    id: row.id, email: row.email, displayName: row.display_name,
    studyLevel: row.study_level, interestArea: row.interest_area,
    destinationSlug: row.destination_slug, destinationSlugs: row.destination_slugs || [],
    fullName: row.full_name, schoolName: row.school_name, schoolYear: row.school_year,
    city: row.city, stateCode: row.state_code,
    gpa: row.gpa === null || row.gpa === undefined ? null : Number(row.gpa),
    satScore: row.sat_score, toeflScore: row.toefl_score,
    ieltsScore: row.ielts_score === null || row.ielts_score === undefined ? null : Number(row.ielts_score),
    languages: row.languages || [], plannedExams: row.planned_exams || [],
    targetYear: row.target_year, createdAt: row.created_at,
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
    const loaded = await database().query(`SELECT a.id,a.email,a.display_name,a.created_at,p.*,
      ARRAY(SELECT d.country_slug FROM user_profile_destinations d WHERE d.user_id=a.id ORDER BY d.position) AS destination_slugs
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
    if (data.destinations.length) {
      const exists = await database().query('SELECT slug FROM countries WHERE slug = ANY($1::text[])', [data.destinations])
      if (exists.rowCount !== data.destinations.length) throw error(400, 'Escolha destinos válidos.')
    }
    const client = await database().connect()
    try {
      await client.query('BEGIN')
      await client.query('UPDATE user_accounts SET display_name=$1,updated_at=now() WHERE id=$2', [data.name, user.id])
      await client.query(`UPDATE user_profiles SET study_level=$1,interest_area=$2,destination_slug=$3,
        full_name=$4,school_name=$5,school_year=$6,city=$7,state_code=$8,
        gpa=$9,sat_score=$10,toefl_score=$11,ielts_score=$12,languages=$13,planned_exams=$14,target_year=$15,updated_at=now()
        WHERE user_id=$16`, [data.level, data.area, data.destination, data.fullName, data.schoolName, data.schoolYear,
        data.city, data.stateCode, data.gpa, data.satScore, data.toeflScore, data.ieltsScore,
        data.languages, data.plannedExams, data.targetYear, user.id])
      await client.query('DELETE FROM user_profile_destinations WHERE user_id=$1', [user.id])
      for (const [index, slug] of data.destinations.entries()) {
        await client.query('INSERT INTO user_profile_destinations (user_id,country_slug,position) VALUES ($1,$2,$3)', [user.id, slug, index + 1])
      }
      await client.query('COMMIT')
    } catch (cause) { await client.query('ROLLBACK'); throw cause } finally { client.release() }
    json(res, 200, { user: { ...publicUser(user), displayName: data.name, studyLevel: data.level, interestArea: data.area,
      destinationSlug: data.destination, destinationSlugs: data.destinations, fullName: data.fullName,
      schoolName: data.schoolName, schoolYear: data.schoolYear, city: data.city, stateCode: data.stateCode,
      gpa: data.gpa, satScore: data.satScore, toeflScore: data.toeflScore, ieltsScore: data.ieltsScore,
      languages: data.languages, plannedExams: data.plannedExams, targetYear: data.targetYear } })
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
