import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { scryptSync, timingSafeEqual } from 'node:crypto'
import { database } from './db.mjs'
import { STUDY_LEVELS, validateScholarship } from './validation.mjs'
import { scholarshipCatalog } from './scholarshipCatalog.mjs'
import { getDaily, answerDaily, examAvailability, getExam, gradeExam, listSatQuestions, saveSatQuestion, archiveSatQuestion, validateSatQuestion } from './sat.mjs'
import { getMextDaily, answerMextDaily, mextAvailability, getMextExam, gradeMextExam } from './mext.mjs'

const port = Number(process.env.API_PORT || 3001)
const host = process.env.API_HOST || '127.0.0.1'
const production = process.env.NODE_ENV === 'production'
const adminReady = Boolean(process.env.ADMIN_USERNAME && /^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(process.env.ADMIN_PASSWORD_HASH || ''))
if (production && process.env.PUBLIC_ORIGIN?.startsWith('https://') !== true) {
  throw new Error('Em produção, configure PUBLIC_ORIGIN com HTTPS.')
}

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  res.end(JSON.stringify(body))
}
const failures = new Map()
const blocked = req => {
  const record = failures.get(req.socket.remoteAddress)
  return record && record.until > Date.now() && record.count >= 10
}
const failedAuth = req => {
  const key = req.socket.remoteAddress
  const previous = failures.get(key)
  const current = previous && previous.until > Date.now() ? previous : { count:0, until:Date.now() + 15 * 60_000 }
  current.count += 1
  failures.set(key, current)
}
const authenticated = req => {
  if (!adminReady) return false
  const header = req.headers.authorization || ''
  if (!header.startsWith('Basic ')) return false
  let user, password
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
    const separator = decoded.indexOf(':')
    user = decoded.slice(0, separator); password = decoded.slice(separator + 1)
  } catch { return false }
  const [salt, hex] = process.env.ADMIN_PASSWORD_HASH.split(':')
  const candidate = scryptSync(password || '', salt, 64)
  const expected = Buffer.from(hex, 'hex')
  return user === process.env.ADMIN_USERNAME && timingSafeEqual(candidate, expected)
}
const originAllowed = req => {
  const origin = req.headers.origin
  if (!origin) return true // CLI/API clients using explicit Authorization
  if (process.env.PUBLIC_ORIGIN) return origin === process.env.PUBLIC_ORIGIN
  if (origin === `http://${req.headers.host}`) return true
  // O proxy do Vite mantém a Origin do navegador (:5173), mas encaminha Host como API (:3001).
  return !production && (host === '127.0.0.1' || host === 'localhost')
    && ['http://localhost:5173', 'http://127.0.0.1:5173'].includes(origin)
}
async function body(req) {
  if (!(req.headers['content-type'] || '').startsWith('application/json')) throw Object.assign(new Error('Envie JSON.'), { status: 415 })
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 40_000) throw Object.assign(new Error('Dados excedem o limite.'), { status: 413 })
  }
  try { return JSON.parse(raw) } catch { throw Object.assign(new Error('JSON inválido.'), { status: 400 }) }
}
const fields = `s.id,s.title,s.organization,s.edition,s.summary,s.eligibility,s.funding_details,s.study_level,s.deadline_type,
  s.deadline_date,s.deadline_timezone,s.application_url,s.source_label,s.source_url,s.source_verified_at,s.status,
  s.created_at,s.updated_at,s.deleted_at,coalesce(array_agg(sc.country_slug) FILTER (WHERE sc.country_slug IS NOT NULL),'{}') AS countries`
const group = ' GROUP BY s.id ORDER BY s.updated_at DESC'

async function list(publicOnly, search) {
  const term = search?.trim().slice(0, 100) || ''
  const where = publicOnly ? "s.deleted_at IS NULL AND s.status = 'published'" : 'TRUE'
  const result = await database().query(`SELECT ${fields} FROM scholarships s LEFT JOIN scholarship_countries sc ON sc.scholarship_id=s.id
    WHERE ${where} AND ($1 = '' OR s.title ILIKE '%' || $1 || '%' OR s.organization ILIKE '%' || $1 || '%')${group} LIMIT 500`, [term])
  return result.rows
}

const pageNumber = value => Math.min(10000, Math.max(1, Number.parseInt(value || '1', 10) || 1))
async function publicScholarships(params) {
  const q = (params.get('q') || '').trim().slice(0, 100)
  const country = (params.get('country') || '').trim()
  const level = (params.get('level') || '').trim()
  const page = pageNumber(params.get('page'))
  if (level && !STUDY_LEVELS.includes(level)) throw Object.assign(new Error('Nível de estudo inválido.'), { status: 400 })
  const values = [q, country, level]
  const where = `s.deleted_at IS NULL AND s.status = 'published'
    AND ($1 = '' OR s.title ILIKE '%' || $1 || '%' OR s.organization ILIKE '%' || $1 || '%' OR s.summary ILIKE '%' || $1 || '%')
    AND ($2 = '' OR EXISTS (SELECT 1 FROM scholarship_countries c WHERE c.scholarship_id=s.id AND c.country_slug=$2))
    AND ($3 = '' OR s.study_level=$3)`
  const count = await database().query(`SELECT count(*)::integer AS total FROM scholarships s WHERE ${where}`, values)
  const result = await database().query(`SELECT ${fields} FROM scholarships s LEFT JOIN scholarship_countries sc ON sc.scholarship_id=s.id
    WHERE ${where} GROUP BY s.id ORDER BY s.updated_at DESC LIMIT 12 OFFSET $4`, [...values, (page - 1) * 12])
  return { items: result.rows, total: count.rows[0].total, page, pageSize: 12 }
}

async function scholarshipLeads(params) {
  const q = (params.get('q') || '').trim().slice(0, 100)
  const nationality = params.get('nationality') || 'all'
  const page = pageNumber(params.get('page'))
  if (!['all', 'brazil', 'unrestricted', 'other'].includes(nationality)) throw Object.assign(new Error('Filtro de nacionalidade inválido.'), { status: 400 })
  const where = `source='iefa' AND catalog_status='listed'
    AND ($1 = '' OR title ILIKE '%' || $1 || '%' OR field_of_study ILIKE '%' || $1 || '%' OR description_excerpt ILIKE '%' || $1 || '%')
    AND ($2 = 'all' OR ($2 = 'brazil' AND nationality_listing = 'Brazil')
      OR ($2 = 'unrestricted' AND nationality_listing = 'Unrestricted')
      OR ($2 = 'other' AND nationality_listing NOT IN ('Brazil','Unrestricted')))`
  const values = [q, nationality]
  const count = await database().query(`SELECT count(*)::integer AS total FROM scholarship_imports WHERE ${where}`, values)
  const result = await database().query(`SELECT source_id,source_url,title,field_of_study,description_excerpt,
    nationality_listing,host_countries_listing,fetched_at FROM scholarship_imports WHERE ${where}
    ORDER BY title COLLATE "C" ASC, source_id ASC LIMIT 12 OFFSET $3`, [...values, (page - 1) * 12])
  return { items: result.rows, total: count.rows[0].total, page, pageSize: 12 }
}

async function scholarshipAmericaLeads(params) {
  const q = (params.get('q') || '').trim().slice(0, 100)
  const brazil = params.get('brazil') || 'all'
  const status = params.get('status') || 'all'
  const page = pageNumber(params.get('page'))
  if (!['all', 'mentioned'].includes(brazil) || !['all', 'open', 'closed'].includes(status)) {
    throw Object.assign(new Error('Filtro inválido.'), { status: 400 })
  }
  const where = `catalog_status='listed'
    AND ($1 = '' OR title ILIKE '%' || $1 || '%' OR description_excerpt ILIKE '%' || $1 || '%' OR eligibility_text ILIKE '%' || $1 || '%')
    AND ($2 = 'all' OR brazil_mentioned)
    AND ($3 = 'all' OR listing_status = $3)`
  const values = [q, brazil, status]
  const count = await database().query(`SELECT count(*)::integer AS total FROM scholarship_america_imports WHERE ${where}`, values)
  const result = await database().query(`SELECT source_id,source_url,title,description_excerpt,award_amount,
    listing_status,brazil_mentioned,open_date,close_date,date_timezone,fetched_at
    FROM scholarship_america_imports WHERE ${where}
    ORDER BY brazil_mentioned DESC, title COLLATE "C" ASC, source_id ASC LIMIT 12 OFFSET $4`,
  [...values, (page - 1) * 12])
  return { items: result.rows, total: count.rows[0].total, page, pageSize: 12 }
}

async function save(id, data) {
  const client = await database().connect()
  try {
    await client.query('BEGIN')
    let row
    const values = [data.title,data.organization,data.edition,data.summary,data.eligibility,data.funding_details,
      data.study_level,data.deadline_type,data.deadline_date,data.deadline_timezone,data.application_url,
      data.source_label,data.source_url,data.source_verified_at,data.status]
    if (id) {
      const update = await client.query(`UPDATE scholarships SET
        title=$1,organization=$2,edition=$3,summary=$4,eligibility=$5,funding_details=$6,
        study_level=$7,deadline_type=$8,deadline_date=$9,deadline_timezone=$10,application_url=$11,
        source_label=$12,source_url=$13,source_verified_at=$14,status=$15,updated_at=now()
        WHERE id=$16 AND deleted_at IS NULL RETURNING id`, [...values,id])
      if (!update.rowCount) { await client.query('ROLLBACK'); return null }
      row = update.rows[0]
      await client.query('DELETE FROM scholarship_countries WHERE scholarship_id=$1', [id])
    } else {
      const insert = await client.query(`INSERT INTO scholarships
        (title,organization,edition,summary,eligibility,funding_details,study_level,deadline_type,deadline_date,
        deadline_timezone,application_url,source_label,source_url,source_verified_at,status)
        VALUES (${values.map((_, i) => `$${i + 1}`).join(',')}) RETURNING id`, values)
      row = insert.rows[0]
    }
    for (const country of data.countries) await client.query('INSERT INTO scholarship_countries (scholarship_id,country_slug) VALUES ($1,$2)', [row.id,country])
    await client.query('COMMIT')
    return row.id
  } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
}

const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.json':'application/json', '.png':'image/png', '.webp':'image/webp', '.ico':'image/x-icon' }
async function serveStatic(req, res) {
  if (!production) return json(res, 404, { error: 'Rota não encontrada.' })
  const pathname = new URL(req.url, 'http://localhost').pathname
  const root = resolve('dist')
  const file = resolve(root, `.${pathname}`)
  if (file !== root && !file.startsWith(root + sep)) return json(res, 404, { error: 'Arquivo não encontrado.' })
  try {
    const target = (await stat(file)).isFile() ? file : resolve(root, 'index.html')
    const data = await readFile(target)
    res.writeHead(200, { 'Content-Type': `${mime[extname(target)] || 'application/octet-stream'}; charset=utf-8`, 'X-Content-Type-Options':'nosniff' })
    res.end(data)
  } catch { json(res, 404, { error: 'Arquivo não encontrado.' }) }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    if (!url.pathname.startsWith('/api/')) return serveStatic(req, res)
    if (req.method === 'GET' && url.pathname === '/api/health') {
      await database().query('SELECT 1')
      return json(res, 200, { ok: true })
    }
    if (req.method === 'GET' && url.pathname === '/api/countries') {
      const countries = await database().query('SELECT slug,name FROM countries ORDER BY name')
      return json(res, 200, countries.rows)
    }
    if (req.method === 'GET' && url.pathname === '/api/scholarships') return json(res, 200, await publicScholarships(url.searchParams))
    if (req.method === 'GET' && url.pathname === '/api/scholarship-leads') return json(res, 200, await scholarshipLeads(url.searchParams))
    if (req.method === 'GET' && url.pathname === '/api/scholarship-america-leads') return json(res, 200, await scholarshipAmericaLeads(url.searchParams))
    if (req.method === 'GET' && url.pathname === '/api/scholarship-catalog') return json(res, 200, await scholarshipCatalog(database(), url.searchParams))
    if (req.method === 'GET' && url.pathname === '/api/sat/daily') return json(res, 200, await getDaily(req, res, url.searchParams.get('section') || 'reading-writing'))
    if (req.method === 'POST' && url.pathname === '/api/sat/daily/answer') {
      if (!originAllowed(req)) return json(res, 403, { error:'Origem não permitida.' })
      return json(res, 200, await answerDaily(req, await body(req)))
    }
    if (req.method === 'GET' && url.pathname === '/api/sat/exam/availability') return json(res, 200, await examAvailability(url.searchParams.get('form') || undefined))
    if (req.method === 'GET' && url.pathname === '/api/sat/exam') return json(res, 200, await getExam(url.searchParams.get('form') || undefined))
    if (req.method === 'POST' && url.pathname === '/api/sat/exam/grade') {
      if (!originAllowed(req)) return json(res, 403, { error:'Origem não permitida.' })
      return json(res, 200, await gradeExam(await body(req)))
    }
    if (req.method === 'GET' && url.pathname === '/api/mext/daily') return json(res, 200, await getMextDaily(req, res, url.searchParams.get('track') || 'A', url.searchParams.get('subject') || 'english'))
    if (req.method === 'POST' && url.pathname === '/api/mext/daily/answer') {
      if (!originAllowed(req)) return json(res, 403, { error:'Origem não permitida.' })
      return json(res, 200, await answerMextDaily(req, await body(req)))
    }
    if (req.method === 'GET' && url.pathname === '/api/mext/exam/availability') return json(res, 200, await mextAvailability(url.searchParams.get('track') || 'A', url.searchParams.get('science') || 'physics'))
    if (req.method === 'GET' && url.pathname === '/api/mext/exam') return json(res, 200, await getMextExam(url.searchParams.get('track') || 'A', url.searchParams.get('science') || 'physics'))
    if (req.method === 'POST' && url.pathname === '/api/mext/exam/grade') {
      if (!originAllowed(req)) return json(res, 403, { error:'Origem não permitida.' })
      return json(res, 200, await gradeMextExam(await body(req)))
    }
    if (!url.pathname.startsWith('/api/admin/')) return json(res, 404, { error:'Rota não encontrada.' })
    if (!adminReady) return json(res, 503, { error:'Administração ainda não configurada neste servidor.' })
    if (!originAllowed(req)) return json(res, 403, { error:'Origem não permitida.' })
    if (blocked(req)) return json(res, 429, { error:'Muitas tentativas. Tente novamente em 15 minutos.' })
    if (!authenticated(req)) { failedAuth(req); return json(res, 401, { error:'Credenciais inválidas.' }) }
    failures.delete(req.socket.remoteAddress)
    if (req.method === 'GET' && url.pathname === '/api/admin/me') return json(res, 200, { username:process.env.ADMIN_USERNAME })
    if (req.method === 'GET' && url.pathname === '/api/admin/sat/questions') return json(res, 200, await listSatQuestions())
    if (req.method === 'POST' && url.pathname === '/api/admin/sat/questions') {
      const result = validateSatQuestion(await body(req))
      if (result.error) return json(res, 400, { error:result.error })
      return json(res, 201, { id:await saveSatQuestion(null, result.data) })
    }
    const satQuestion = url.pathname.match(/^\/api\/admin\/sat\/questions\/(\d+)$/)
    if (satQuestion && req.method === 'PUT') {
      const result = validateSatQuestion(await body(req))
      if (result.error) return json(res, 400, { error:result.error })
      const saved = await saveSatQuestion(satQuestion[1], result.data)
      return saved ? json(res, 200, { id:saved }) : json(res, 404, { error:'Questão não encontrada.' })
    }
    if (satQuestion && req.method === 'DELETE') {
      const archived = await archiveSatQuestion(satQuestion[1])
      return archived ? json(res, 200, { archived:true }) : json(res, 404, { error:'Questão não encontrada.' })
    }
    if (req.method === 'GET' && url.pathname === '/api/admin/scholarships') return json(res, 200, await list(false, url.searchParams.get('q')))
    if (req.method === 'POST' && url.pathname === '/api/admin/scholarships') {
      const countries = (await database().query('SELECT slug FROM countries')).rows.map(row => row.slug)
      const result = validateScholarship(await body(req), countries)
      if (result.error) return json(res, 400, { error:result.error })
      return json(res, 201, { id:await save(null, result.data) })
    }
    const match = url.pathname.match(/^\/api\/admin\/scholarships\/(\d+)(?:\/(restore))?$/)
    if (match) {
      const id = match[1]
      if (req.method === 'PUT' && !match[2]) {
        const countries = (await database().query('SELECT slug FROM countries')).rows.map(row => row.slug)
        const result = validateScholarship(await body(req), countries)
        if (result.error) return json(res, 400, { error:result.error })
        const saved = await save(id, result.data)
        return saved ? json(res, 200, { id:saved }) : json(res, 404, { error:'Bolsa não encontrada.' })
      }
      if (req.method === 'DELETE' && !match[2]) {
        const changed = await database().query("UPDATE scholarships SET deleted_at=now(),status='archived',updated_at=now() WHERE id=$1 AND deleted_at IS NULL RETURNING id", [id])
        return changed.rowCount ? json(res, 200, { restored:false }) : json(res, 404, { error:'Bolsa não encontrada.' })
      }
      if (req.method === 'POST' && match[2]) {
        const changed = await database().query("UPDATE scholarships SET deleted_at=NULL,status='draft',updated_at=now() WHERE id=$1 AND deleted_at IS NOT NULL RETURNING id", [id])
        return changed.rowCount ? json(res, 200, { restored:true }) : json(res, 404, { error:'Bolsa não encontrada.' })
      }
    }
    return json(res, 404, { error:'Rota não encontrada.' })
  } catch (error) {
    console.error('API error:', error?.code || error?.message)
    json(res, error.status || 500, { error:error.status ? error.message : 'Falha no servidor. Confira a conexão com o banco e as migrações.' })
  }
})
server.listen(port, host, () => console.log(`API em http://${host}:${port}`))
