import { createHash, randomBytes } from 'node:crypto'
import { database } from './db.mjs'
import { SAT_SCORING_SOURCE, SAT_SCORING_SOURCE_5, SAT_SCORING_SOURCE_6, SAT_SCORING_SOURCE_7, SAT_SCORING_SOURCE_8, SAT_SCORING_SOURCE_9, SAT_SCORING_SOURCE_10, SAT_SCORING_SOURCE_11, scorePractice4, scorePractice5, scorePractice6, scorePractice7, scorePractice8, scorePractice9, scorePractice10, scorePractice11 } from './satScoring.mjs'

export const DAILY_COUNT = 5
export const DAILY_LIVES = 3
const FORM_CODE = 'practice-4-paper'
export const SAT_FORMS = ['practice-4-paper', 'practice-5-paper', 'practice-6-paper', 'practice-7-paper', 'practice-8-paper', 'practice-9-paper', 'practice-10-paper', 'practice-11-paper']
export const SAT_SECTIONS = ['reading-writing', 'math']
const SOURCE = 'https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-digital.pdf'
const publicFields = 'id,form_code,section,module_number,question_number,passage,prompt,choices,answer_type,image_path'

const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }) }
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : ''
const integer = (value, min, max) => Number.isInteger(value) && value >= min && value <= max

export function validateSatQuestion(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Questão inválida.' }
  const section = input.section
  const moduleNumber = Number(input.module_number)
  const questionNumber = Number(input.question_number)
  const answerType = input.answer_type
  const choices = input.choices
  const accepted = input.accepted_answers
  const status = input.status || 'draft'
  const formCode = input.form_code || FORM_CODE
  const maxNumber = section === 'reading-writing' ? 33 : 27
  if (!['reading-writing', 'math'].includes(section) || !integer(moduleNumber, 1, 2) || !integer(questionNumber, 1, maxNumber)) return { error: 'Seção, módulo ou número inválido.' }
  if (!SAT_FORMS.includes(formCode)) return { error: 'Versão do teste inválida.' }
  if (!['multiple-choice', 'numeric'].includes(answerType) || (answerType === 'numeric' && section !== 'math')) return { error: 'Tipo de resposta inválido.' }
  if (!Array.isArray(choices) || (answerType === 'multiple-choice' && (choices.length !== 4 || choices.some((item, index) => item?.key !== 'ABCD'[index] || !clean(item?.text, 500)))) || (answerType === 'numeric' && choices.length)) return { error: 'Informe quatro alternativas A–D, ou nenhuma para resposta numérica.' }
  if (!Array.isArray(accepted) || accepted.length < 1 || accepted.length > 8 || accepted.some(value => !clean(value, 80))) return { error: 'Informe ao menos uma resposta aceita.' }
  const answers = accepted.map(value => clean(value, 80))
  if (answerType === 'multiple-choice' && (answers.length !== 1 || !'ABCD'.includes(answers[0]) || answers[0].length !== 1)) return { error: 'Escolha uma resposta entre A e D.' }
  const prompt = clean(input.prompt, 8000)
  const explanation = clean(input.explanation, 8000)
  const sourceUrl = clean(input.source_url, 2000) || (formCode === FORM_CODE ? SOURCE : `https://satsuite.collegeboard.org/media/pdf/sat-practice-test-${formCode.split('-')[1]}-digital.pdf`)
  const imagePath = clean(input.image_path, 500) || null
  const sourcePage = input.source_page === '' || input.source_page == null ? null : Number(input.source_page)
  if (!prompt || !/^https:\/\//.test(sourceUrl)) return { error: 'Enunciado e fonte HTTPS são obrigatórios.' }
  if (sourcePage !== null && !integer(sourcePage, 1, 10000)) return { error: 'Página da fonte inválida.' }
  if (imagePath && (!/^\/sat-assets\/[a-zA-Z0-9._/-]+$/.test(imagePath) || imagePath.includes('..'))) return { error: 'Imagem deve estar em /sat-assets/ no projeto.' }
  if (!['draft', 'published', 'archived'].includes(status) || (status === 'published' && !explanation)) return { error: 'Para publicar, inclua a explicação da resposta.' }
  return { data: {
    form_code: formCode, section, module_number: moduleNumber, question_number: questionNumber,
    passage: clean(input.passage, 12000), prompt, choices: choices.map(item => ({ key:item.key, text:clean(item.text, 500) })),
    answer_type: answerType, accepted_answers: answers, explanation, image_path: imagePath,
    source_url: sourceUrl, source_page: sourcePage, status,
  } }
}

export async function listSatQuestions() {
  const result = await database().query('SELECT * FROM sat_questions WHERE deleted_at IS NULL ORDER BY form_code,section,module_number,question_number LIMIT 1000')
  return result.rows
}

export async function saveSatQuestion(id, data) {
  const fields = Object.keys(data)
  const values = fields.map(key => key === 'choices' ? JSON.stringify(data[key]) : data[key])
  try {
    if (id) {
      const assignments = fields.map((key, index) => `${key}=$${index + 1}`).join(',')
      const result = await database().query(`UPDATE sat_questions SET ${assignments},updated_at=now() WHERE id=$${fields.length + 1} AND deleted_at IS NULL RETURNING id`, [...values, id])
      return result.rows[0]?.id || null
    }
    const result = await database().query(`INSERT INTO sat_questions (${fields.join(',')}) VALUES (${fields.map((_, index) => `$${index + 1}`).join(',')}) RETURNING id`, values)
    return result.rows[0].id
  } catch (error) {
    if (error.code === '23505') fail('Já existe uma questão ativa nesta posição.', 409)
    throw error
  }
}

export async function archiveSatQuestion(id) {
  const result = await database().query("UPDATE sat_questions SET status='archived',deleted_at=now(),updated_at=now() WHERE id=$1 AND deleted_at IS NULL RETURNING id", [id])
  return result.rowCount > 0
}

const today = () => new Intl.DateTimeFormat('en-CA', { timeZone:'America/Sao_Paulo', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date())
const tokenFromCookie = req => (req.headers.cookie || '').match(/(?:^|;\s*)dd_sat_daily=([a-f0-9]{64})(?:;|$)/)?.[1]
const tokenHash = token => createHash('sha256').update(token).digest('hex')
const normalize = value => String(value ?? '').trim().toLowerCase().replace(',', '.')
const publicQuestion = row => row && Object.fromEntries(publicFields.split(',').map(key => [key, row[key]]))

async function dailyState(client, run) {
  const answers = run.answers || []
  const finished = answers.length >= run.question_ids.length || run.lives === 0
  const currentId = finished ? null : run.question_ids[answers.length]
  const current = currentId ? (await client.query(`SELECT ${publicFields} FROM sat_questions WHERE id=$1`, [currentId])).rows[0] : null
  return {
    available: true, day:run.day, section:run.section, lives:run.lives, maxLives:DAILY_LIVES, total:run.question_ids.length,
    answered:answers.length, correct:answers.filter(item => item.correct).length, finished,
    question:publicQuestion(current),
  }
}

export async function getDaily(req, res, section = 'reading-writing') {
  if (!SAT_SECTIONS.includes(section)) fail('Área do desafio inválida.')
  const day = today()
  // O desafio não usa histórico: descarte respostas de dias anteriores.
  await database().query('DELETE FROM sat_daily_runs WHERE day < $1::date', [day])
  let token = tokenFromCookie(req)
  const count = await database().query("SELECT count(*)::integer AS total FROM sat_questions WHERE form_code=ANY($1) AND section=$2 AND status='published' AND deleted_at IS NULL", [SAT_FORMS,section])
  if (count.rows[0].total < DAILY_COUNT) return { available:false, needed:DAILY_COUNT, published:count.rows[0].total }
  if (!token) {
    token = randomBytes(32).toString('hex')
    res.setHeader('Set-Cookie', `dd_sat_daily=${token}; Path=/api/sat; HttpOnly; SameSite=Lax; Max-Age=2592000${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
  }
  const hash = tokenHash(token)
  const client = await database().connect()
  try {
    const existing = await client.query('SELECT * FROM sat_daily_runs WHERE token_hash=$1 AND day=$2 AND section=$3', [hash,day,section])
    if (existing.rowCount) return dailyState(client, existing.rows[0])
    const selected = await client.query("SELECT id FROM sat_questions WHERE form_code=ANY($3) AND section=$4 AND status='published' AND deleted_at IS NULL ORDER BY md5(id::text || $1 || $4) LIMIT $2", [day,DAILY_COUNT,SAT_FORMS,section])
    const ids = selected.rows.map(row => row.id)
    const inserted = await client.query('INSERT INTO sat_daily_runs (token_hash,day,section,question_ids) VALUES ($1,$2,$3,$4) ON CONFLICT (token_hash,day,section) DO UPDATE SET token_hash=EXCLUDED.token_hash RETURNING *', [hash,day,section,ids])
    return dailyState(client, inserted.rows[0])
  } finally { client.release() }
}

export async function answerDaily(req, input) {
  const token = tokenFromCookie(req)
  if (!token) fail('Abra o desafio diário antes de responder.', 401)
  const id = Number(input?.questionId)
  const answer = clean(input?.answer, 80)
  const section = input?.section || 'reading-writing'
  if (!SAT_SECTIONS.includes(section) || !Number.isSafeInteger(id) || !answer) fail('Resposta inválida.')
  const client = await database().connect()
  try {
    await client.query('BEGIN')
    const result = await client.query('SELECT * FROM sat_daily_runs WHERE token_hash=$1 AND day=$2 AND section=$3 FOR UPDATE', [tokenHash(token),today(),section])
    if (!result.rowCount) fail('Desafio não encontrado para hoje.', 404)
    const run = result.rows[0]
    const answers = run.answers || []
    if (run.lives <= 0 || answers.length >= run.question_ids.length) fail('O desafio de hoje terminou.', 409)
    if (Number(run.question_ids[answers.length]) !== id) fail('Esta não é a questão atual.', 409)
    const question = (await client.query('SELECT accepted_answers,explanation,answer_type FROM sat_questions WHERE id=$1', [id])).rows[0]
    const correct = question.accepted_answers.some(value => normalize(value) === normalize(answer))
    const lives = Math.max(0, run.lives - (correct ? 0 : 1))
    answers.push({ questionId:id, answer, correct })
    await client.query('UPDATE sat_daily_runs SET answers=$4,lives=$5,updated_at=now() WHERE token_hash=$1 AND day=$2 AND section=$3', [run.token_hash,run.day,section,JSON.stringify(answers),lives])
    await client.query('COMMIT')
    return { ...await dailyState(client, { ...run, answers, lives }), feedback:{ correct, acceptedAnswers:question.accepted_answers, explanation:question.explanation } }
  } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
}

const checkedForm = formCode => {
  if (!SAT_FORMS.includes(formCode)) fail('Versão do teste inválida.')
  return formCode
}

export async function examAvailability(formCode = FORM_CODE) {
  checkedForm(formCode)
  const counts = await database().query("SELECT section,module_number,count(*)::integer AS total FROM sat_questions WHERE form_code=$1 AND status='published' AND deleted_at IS NULL GROUP BY section,module_number", [formCode])
  const required = [
    { section:'reading-writing', module_number:1, total:33, minutes:39 },
    { section:'reading-writing', module_number:2, total:33, minutes:39 },
    { section:'math', module_number:1, total:27, minutes:43 },
    { section:'math', module_number:2, total:27, minutes:43 },
  ]
  return { formCode, ready:required.every(item => counts.rows.find(row => row.section === item.section && row.module_number === item.module_number)?.total === item.total), modules:required.map(item => ({ ...item, published:counts.rows.find(row => row.section === item.section && row.module_number === item.module_number)?.total || 0 })) }
}

export async function getExam(formCode = FORM_CODE) {
  const availability = await examAvailability(formCode)
  if (!availability.ready) return { ...availability, questions:[] }
  const result = await database().query(`SELECT ${publicFields} FROM sat_questions WHERE form_code=$1 AND status='published' AND deleted_at IS NULL ORDER BY CASE WHEN section='reading-writing' THEN 0 ELSE 1 END,module_number,question_number`, [formCode])
  return { ...availability, questions:result.rows }
}

export async function gradeExam(input) {
  if (!input || typeof input !== 'object' || !Array.isArray(input.answers) || input.answers.length > 120) fail('Respostas inválidas.')
  const formCode = checkedForm(input.formCode || FORM_CODE)
  const availability = await examAvailability(formCode)
  if (!availability.ready) fail('O simulado completo ainda não está disponível.', 409)
  const result = await database().query("SELECT id,section,module_number,accepted_answers FROM sat_questions WHERE form_code=$1 AND status='published' AND deleted_at IS NULL", [formCode])
  const submitted = new Map(input.answers.map(item => [Number(item?.questionId), clean(item?.answer, 80)]))
  const sections = { 'reading-writing':{ correct:0,total:66 }, math:{ correct:0,total:54 } }
  const modules = [
    { section:'reading-writing', moduleNumber:1, correct:0, total:33 },
    { section:'reading-writing', moduleNumber:2, correct:0, total:33 },
    { section:'math', moduleNumber:1, correct:0, total:27 },
    { section:'math', moduleNumber:2, correct:0, total:27 },
  ]
  for (const row of result.rows) {
    if (row.accepted_answers.some(value => normalize(value) === normalize(submitted.get(Number(row.id))))) {
      sections[row.section].correct++
      modules.find(item => item.section === row.section && item.moduleNumber === row.module_number).correct++
    }
  }
  const score = { 'practice-4-paper':scorePractice4, 'practice-5-paper':scorePractice5, 'practice-6-paper':scorePractice6, 'practice-7-paper':scorePractice7, 'practice-8-paper':scorePractice8, 'practice-9-paper':scorePractice9, 'practice-10-paper':scorePractice10, 'practice-11-paper':scorePractice11 }[formCode]
  const ranges = score(sections['reading-writing'].correct, sections.math.correct)
  sections['reading-writing'].scoreRange = ranges.readingWriting
  sections.math.scoreRange = ranges.math
  return {
    formCode, sections, modules, correct:sections['reading-writing'].correct + sections.math.correct, total:120,
    scoreRange:ranges.total, scoringSource:{ 'practice-4-paper':SAT_SCORING_SOURCE, 'practice-5-paper':SAT_SCORING_SOURCE_5, 'practice-6-paper':SAT_SCORING_SOURCE_6, 'practice-7-paper':SAT_SCORING_SOURCE_7, 'practice-8-paper':SAT_SCORING_SOURCE_8, 'practice-9-paper':SAT_SCORING_SOURCE_9, 'practice-10-paper':SAT_SCORING_SOURCE_10, 'practice-11-paper':SAT_SCORING_SOURCE_11 }[formCode],
    note:'Faixas estimadas pela tabela do College Board específica deste teste prático em papel. Não são uma nota oficial nem reproduzem a correção adaptativa do SAT digital.',
  }
}
