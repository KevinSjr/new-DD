import assert from 'node:assert/strict'

const base = process.env.EXAM_API_URL || 'http://127.0.0.1:3002'
async function get(path, mobile = false) {
  const response = await fetch(base + path, mobile ? { headers:{ 'X-Daydreaming-Client':'mobile' } } : undefined)
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`)
  return response.json()
}

const sat = await get('/api/sat/exam?form=practice-4-paper')
assert.equal(sat.ready, true)
assert.equal(sat.questions.length, 120)
const mext = await get('/api/mext/exam?track=A&science=physics')
assert.equal(mext.ready, true)
assert.ok(mext.questions.length > 0)
for (const path of [sat.questions.find(item => item.image_path)?.image_path, mext.questions.find(item => item.asset_paths?.length)?.asset_paths[0]]) {
  assert.ok(path, 'Imagem de questão ausente')
  const response = await fetch(base + path)
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`)
  assert.match(response.headers.get('content-type') || '', /^image\//)
}
for (const path of ['/api/sat/daily?section=reading-writing','/api/mext/daily?track=A&subject=english']) {
  const daily = await get(path, true)
  assert.equal(daily.available, true)
  assert.match(daily.dailyToken, /^[a-f0-9]{64}$/)
  const resumed = await fetch(base + path, { headers:{ 'X-Daydreaming-Client':'mobile', 'X-Daydreaming-Daily-Token':daily.dailyToken } })
  assert.equal(resumed.status, 200)
  assert.equal((await resumed.json()).dailyToken, daily.dailyToken)
  const isSat = path.includes('/sat/')
  const response = await fetch(base + (isSat ? '/api/sat/daily/answer' : '/api/mext/daily/answer'), {
    method:'POST', headers:{ 'X-Daydreaming-Client':'mobile', 'X-Daydreaming-Daily-Token':daily.dailyToken, 'Content-Type':'application/json' },
    body:JSON.stringify({ ...(isSat ? { section:'reading-writing' } : { track:'A', subject:'english' }), questionId:daily.question.id,
      answer:isSat ? (daily.question.choices?.[0]?.key || '1') : (daily.question.choices?.[0] || '1') }),
  })
  assert.equal(response.status, 200, `${path} resposta: HTTP ${response.status}`)
  const answered = await response.json()
  assert.equal(answered.answered, 1)
  assert.equal(typeof answered.feedback.correct, 'boolean')
}
console.log('SAT, MEXT, imagens, sessão móvel e respostas: OK')
