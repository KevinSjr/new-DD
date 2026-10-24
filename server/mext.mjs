import { createHash, randomBytes } from 'node:crypto'
import { database } from './db.mjs'

export const MEXT_SUBJECTS = ['japanese', 'english', 'math']
export const MEXT_EXPECTED = { japanese:45, english:70, math:32 }
export const MEXT_MINUTES = { japanese:100, english:60, math:60 }
export const MEXT_B_EXPECTED = { japanese:48, english:50, math:20, chemistry:40, physics:24, biology:73 }
export const MEXT_B_MINUTES = { japanese:100, english:60, math:60, chemistry:60, physics:60, biology:60 }
export const MEXT_DAILY_COUNT = 5
export const MEXT_DAILY_LIVES = 3
const EDITION = 2025
const publicFields = 'id,edition,track,subject,section,item_code,position,prompt,transcript,asset_paths,answer_type,choices,points,source_url,source_page'
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }) }
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone:'America/Sao_Paulo', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date())
const tokenFromCookie = req => (req.headers.cookie || '').match(/(?:^|;\s*)dd_mext_daily=([a-f0-9]{64})(?:;|$)/)?.[1]
const tokenHash = token => createHash('sha256').update(token).digest('hex')
const trackOrFail = value => {
  if (!['A', 'B'].includes(value)) fail('Modalidade inválida.')
  return value
}
const scienceOrFail = value => {
  if (!['physics', 'biology'].includes(value)) fail('Escolha Física ou Biologia para a modalidade B.')
  return value
}
const subjectsFor = (track, science) => track === 'A' ? MEXT_SUBJECTS : [...MEXT_SUBJECTS, 'chemistry', scienceOrFail(science)]
const subjectOrFail = (track, value) => {
  if (!(track === 'A' ? MEXT_SUBJECTS : Object.keys(MEXT_B_EXPECTED)).includes(value)) fail('Disciplina inválida.')
  return value
}

export function matchesMextAnswer(question, submitted) {
  const answer = String(submitted ?? '').trim().normalize('NFKC').replace(/−/g, '-')
  if (!answer) return false
  const normalizeText = value => String(value).normalize('NFKC').toLowerCase().replace(/[−–]/g, '-').replace(/α/g, 'alpha').replace(/→|⟶|=>/g, '->').replace(/[×·]/g, '*').replace(/\s+/g, '')
  if (question.answer_type === 'text') {
    return question.accepted_answers.some(value => normalizeText(value) === normalizeText(answer))
  }
  if (question.answer_type !== 'numeric') return question.accepted_answers.some(value => value.toUpperCase() === answer.toUpperCase())
  if (question.accepted_answers.some(value => normalizeText(value) === normalizeText(answer))) return true
  const numeric = value => {
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)\s*\*\s*10\s*\^\s*[+-]?\d+$/.test(value)) {
      const [coefficient, exponent] = value.split(/\s*\*\s*10\s*\^\s*/).map(Number)
      return coefficient * 10 ** exponent
    }
    if (/^[+-]?\d+\s*\/\s*\d+$/.test(value)) {
      const [numerator, denominator] = value.split('/').map(Number)
      return denominator ? numerator / denominator : NaN
    }
    return /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(value) ? Number(value) : NaN
  }
  const actual = numeric(answer.replace(',', '.').replace(/[×·]/g, '*').replace(/\s*(?:%|mol\/L|g)$/i, ''))
  return Number.isFinite(actual) && question.accepted_answers.some(value => Math.abs(actual - numeric(value)) < 1e-9)
}

export async function mextAvailability(track = 'A', science = 'physics') {
  trackOrFail(track)
  const subjectNames = subjectsFor(track, science)
  const expected = track === 'A' ? MEXT_EXPECTED : MEXT_B_EXPECTED
  const minutes = track === 'A' ? MEXT_MINUTES : MEXT_B_MINUTES
  const result = await database().query("SELECT subject,count(*)::integer AS published FROM mext_questions WHERE edition=$1 AND track=$2 AND status='published' GROUP BY subject", [EDITION,track])
  const subjects = subjectNames.map(subject => ({ subject, published:result.rows.find(row => row.subject === subject)?.published || 0, total:expected[subject], minutes:minutes[subject] }))
  return { edition:EDITION, track, science:track === 'B' ? science : null, ready:subjects.every(item => item.published === item.total), subjects }
}

export async function getMextExam(track = 'A', science = 'physics') {
  const availability = await mextAvailability(track, science)
  if (!availability.ready) return { ...availability, questions:[] }
  const result = await database().query(`SELECT ${publicFields} FROM mext_questions WHERE edition=$1 AND track=$2 AND subject=ANY($3::text[]) AND status='published' ORDER BY CASE subject WHEN 'japanese' THEN 1 WHEN 'english' THEN 2 WHEN 'math' THEN 3 WHEN 'chemistry' THEN 4 ELSE 5 END,position`, [EDITION,track,availability.subjects.map(item => item.subject)])
  return { ...availability, questions:result.rows }
}

export async function gradeMextExam(input) {
  const track = trackOrFail(input?.track || 'A')
  const availability = await mextAvailability(track, input?.science || 'physics')
  if (!input || !Array.isArray(input.answers) || input.answers.length > availability.subjects.reduce((sum, item) => sum + item.total, 0)) fail('Respostas inválidas.')
  if (!availability.ready) fail(`O exame ${track} ainda não está completo.`, 409)
  const submitted = new Map()
  for (const item of input.answers) {
    const id = Number(item?.questionId)
    const answer = String(item?.answer ?? '').trim().slice(0, 80)
    if (!Number.isSafeInteger(id) || submitted.has(id)) fail('Há respostas duplicadas ou inválidas.')
    submitted.set(id, answer)
  }
  const result = await database().query("SELECT id,subject,section,item_code,answer_type,accepted_answers,points FROM mext_questions WHERE edition=$1 AND track=$2 AND subject=ANY($3::text[]) AND status='published'", [EDITION,track,availability.subjects.map(item => item.subject)])
  const ids = new Set(result.rows.map(row => Number(row.id)))
  if ([...submitted.keys()].some(id => !ids.has(id))) fail('A lista contém uma questão de outro exame.')
  const sections = Object.fromEntries(availability.subjects.map(item => [item.subject, { earned:0, maximum:100, correct:0, total:item.total }]))
  const biologyPair = result.rows.filter(row => row.subject === 'biology' && row.section === 'II-3')
  const biologyPairCredits = new Set()
  const remainingPairAnswers = new Set(['C', 'H'])
  for (const row of biologyPair) {
    const answer = String(submitted.get(Number(row.id)) || '').toUpperCase()
    if (remainingPairAnswers.has(answer)) {
      biologyPairCredits.add(Number(row.id))
      remainingPairAnswers.delete(answer)
    }
  }
  for (const row of result.rows) {
    const isBiologyPair = row.subject === 'biology' && row.section === 'II-3'
    const correct = isBiologyPair ? biologyPairCredits.has(Number(row.id)) : matchesMextAnswer(row, submitted.get(Number(row.id)))
    if (correct) {
      sections[row.subject].earned += row.points
      sections[row.subject].correct += 1
    }
  }
  return {
    edition:EDITION, track, science:availability.science, sections,
    earned:Object.values(sections).reduce((sum, section) => sum + section.earned, 0), maximum:availability.subjects.length * 100,
    source:'https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/examination.html',
    note:'Pontuação de prática calculada pelos pesos do gabarito de 2025. Respostas abertas são comparadas com as formas cadastradas; uma forma matematicamente equivalente pode não ser reconhecida. Não é nota oficial nem prevê seleção.',
  }
}

async function dailyState(client, run) {
  const answers = run.answers || []
  const finished = answers.length >= run.question_ids.length || run.lives === 0
  const id = finished ? null : run.question_ids[answers.length]
  const question = id ? (await client.query(`SELECT ${publicFields} FROM mext_questions WHERE id=$1`, [id])).rows[0] : null
  return { available:true, day:run.day, track:run.track, subject:run.subject, lives:run.lives, maxLives:MEXT_DAILY_LIVES, total:run.question_ids.length, answered:answers.length, correct:answers.filter(item => item.correct).length, finished, question:question || null }
}

export async function getMextDaily(req, res, track, subject) {
  trackOrFail(track)
  subjectOrFail(track, subject)
  const day = today()
  await database().query('DELETE FROM mext_daily_runs WHERE day < $1::date', [day])
  const count = await database().query("SELECT count(*)::integer AS total FROM mext_questions WHERE edition=$1 AND track=$2 AND subject=$3 AND status='published'", [EDITION,track,subject])
  if (count.rows[0].total < MEXT_DAILY_COUNT) return { available:false, track, subject, needed:MEXT_DAILY_COUNT, published:count.rows[0].total }
  let token = tokenFromCookie(req)
  if (!token) {
    token = randomBytes(32).toString('hex')
    res.setHeader('Set-Cookie', `dd_mext_daily=${token}; Path=/api/mext; HttpOnly; SameSite=Lax; Max-Age=2592000${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
  }
  const hash = tokenHash(token)
  const client = await database().connect()
  try {
    const existing = await client.query('SELECT * FROM mext_daily_runs WHERE token_hash=$1 AND day=$2 AND track=$3 AND subject=$4', [hash,day,track,subject])
    if (existing.rowCount) return dailyState(client, existing.rows[0])
    const selected = await client.query("SELECT id FROM mext_questions WHERE edition=$3 AND track=$4 AND subject=$5 AND status='published' ORDER BY md5(id::text || $1 || $4 || $5) LIMIT $2", [day,MEXT_DAILY_COUNT,EDITION,track,subject])
    const ids = selected.rows.map(row => row.id)
    const inserted = await client.query('INSERT INTO mext_daily_runs (token_hash,day,track,subject,question_ids) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (token_hash,day,track,subject) DO UPDATE SET token_hash=EXCLUDED.token_hash RETURNING *', [hash,day,track,subject,ids])
    return dailyState(client, inserted.rows[0])
  } finally { client.release() }
}

export async function answerMextDaily(req, input) {
  const token = tokenFromCookie(req)
  if (!token) fail('Abra o desafio diário antes de responder.', 401)
  const track = trackOrFail(input?.track || 'A')
  const subject = subjectOrFail(track, input?.subject)
  const id = Number(input?.questionId)
  const answer = String(input?.answer ?? '').trim().slice(0, 80)
  if (!Number.isSafeInteger(id) || !answer) fail('Resposta inválida.')
  const client = await database().connect()
  try {
    await client.query('BEGIN')
    const result = await client.query('SELECT * FROM mext_daily_runs WHERE token_hash=$1 AND day=$2 AND track=$3 AND subject=$4 FOR UPDATE', [tokenHash(token),today(),track,subject])
    if (!result.rowCount) fail('Desafio não encontrado para hoje.', 404)
    const run = result.rows[0]
    const answers = run.answers || []
    if (run.lives === 0 || answers.length >= run.question_ids.length) fail('O desafio de hoje terminou.', 409)
    if (Number(run.question_ids[answers.length]) !== id) fail('Esta não é a questão atual.', 409)
    const question = (await client.query('SELECT accepted_answers,answer_type FROM mext_questions WHERE id=$1 AND track=$2 AND subject=$3', [id,track,subject])).rows[0]
    if (!question) fail('Questão não encontrada.', 404)
    const correct = matchesMextAnswer(question, answer)
    const lives = Math.max(0, run.lives - (correct ? 0 : 1))
    answers.push({ questionId:id, answer, correct })
    await client.query('UPDATE mext_daily_runs SET answers=$5,lives=$6,updated_at=now() WHERE token_hash=$1 AND day=$2 AND track=$3 AND subject=$4', [run.token_hash,run.day,track,subject,JSON.stringify(answers),lives])
    await client.query('COMMIT')
    return { ...await dailyState(client, { ...run, answers, lives }), feedback:{ correct, acceptedAnswers:question.accepted_answers } }
  } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
}
