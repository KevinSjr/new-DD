import assert from 'node:assert/strict'
import { database } from '../server/db.mjs'

const origin = process.env.SAT_ADMIN_TEST_URL
const user = process.env.SAT_ADMIN_TEST_USER
const password = process.env.SAT_ADMIN_TEST_PASSWORD
if (!origin || !user || !password) throw new Error('Configure SAT_ADMIN_TEST_URL, SAT_ADMIN_TEST_USER e SAT_ADMIN_TEST_PASSWORD para o teste isolado.')
const auth = `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`
const prompt = 'SAT QA temporary question – remove after test'
let id
async function request(path, method = 'GET', payload) {
  const response = await fetch(`${origin}${path}`, { method, headers:{ Authorization:auth, Origin:origin, ...(payload ? { 'Content-Type':'application/json' } : {}) }, body:payload ? JSON.stringify(payload) : undefined })
  const data = await response.json()
  assert.ok(response.ok, `${response.status}: ${data.error || 'erro'}`)
  return data
}
try {
  const draft = { section:'reading-writing', module_number:2, question_number:33, passage:'', prompt,
    choices:'ABCD'.split('').map(key => ({ key, text:`Option ${key}` })), answer_type:'multiple-choice', accepted_answers:['B'],
    explanation:'Temporary QA item.', source_url:'https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-digital.pdf', source_page:30, status:'draft' }
  id = (await request('/api/admin/sat/questions', 'POST', draft)).id
  assert.ok(id)
  const list = await request('/api/admin/sat/questions')
  assert.ok(list.some(item => item.id === id))
  await request(`/api/admin/sat/questions/${id}`, 'PUT', { ...draft, prompt:`${prompt} edited` })
  const edited = await request('/api/admin/sat/questions')
  assert.equal(edited.find(item => item.id === id).prompt, `${prompt} edited`)
  await request(`/api/admin/sat/questions/${id}`, 'DELETE')
  const archived = await request('/api/admin/sat/questions')
  assert.equal(archived.some(item => item.id === id), false)
  console.log('CRUD SAT: criação, leitura, edição e arquivamento passaram.')
} finally {
  if (id) await database().query('DELETE FROM sat_questions WHERE id=$1 AND prompt=$2 AND deleted_at IS NOT NULL', [id,`${prompt} edited`])
  await database().end()
}
