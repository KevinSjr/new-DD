import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateSatQuestion } from '../server/sat.mjs'
import { scorePractice4, scoreRangeForRaw } from '../server/satScoring.mjs'

const valid = {
  section:'reading-writing', module_number:1, question_number:1, passage:'Short passage', prompt:'Which choice is best?',
  choices:'ABCD'.split('').map(key => ({ key, text:`Choice ${key}` })), answer_type:'multiple-choice',
  accepted_answers:['B'], explanation:'The answer follows from the passage.',
  source_url:'https://satsuite.collegeboard.org/example', source_page:4, status:'published',
}

test('uma questão completa pode ser publicada', () => {
  const result = validateSatQuestion(valid)
  assert.equal(result.error, undefined)
  assert.equal(result.data.accepted_answers[0], 'B')
})

test('publicação sem explicação é bloqueada', () => {
  assert.match(validateSatQuestion({ ...valid, explanation:'' }).error, /explicação/)
})

test('módulos e numeração fora do teste em papel são rejeitados', () => {
  assert.match(validateSatQuestion({ ...valid, module_number:3 }).error, /Seção/)
  assert.match(validateSatQuestion({ ...valid, section:'math', question_number:28 }).error, /Seção/)
})

test('gabarito inválido e fonte não segura são rejeitados', () => {
  assert.match(validateSatQuestion({ ...valid, accepted_answers:['E'] }).error, /resposta/)
  assert.match(validateSatQuestion({ ...valid, source_url:'http://example.com' }).error, /HTTPS/)
})

test('resposta numérica só é válida em Math', () => {
  const numeric = { ...valid, answer_type:'numeric', choices:[], accepted_answers:['1/2'], section:'math' }
  assert.equal(validateSatQuestion(numeric).error, undefined)
  assert.match(validateSatQuestion({ ...numeric, section:'reading-writing' }).error, /Tipo/)
})

test('tabela oficial converte os extremos sem inventar nota única', () => {
  assert.deepEqual(scorePractice4(0, 0), {
    readingWriting:{ lower:200, upper:200 }, math:{ lower:200, upper:200 }, total:{ lower:400, upper:400 },
  })
  assert.deepEqual(scorePractice4(66, 54), {
    readingWriting:{ lower:790, upper:800 }, math:{ lower:790, upper:800 }, total:{ lower:1580, upper:1600 },
  })
})

test('tabela respeita pontos de mudança e limites de cada seção', () => {
  assert.deepEqual(scoreRangeForRaw('reading-writing', 7), { lower:200, upper:210 })
  assert.deepEqual(scoreRangeForRaw('math', 7), { lower:200, upper:220 })
  assert.deepEqual(scoreRangeForRaw('reading-writing', 33), { lower:470, upper:490 })
  assert.deepEqual(scoreRangeForRaw('math', 33), { lower:510, upper:540 })
  assert.deepEqual(scoreRangeForRaw('math', 54), { lower:790, upper:800 })
  assert.deepEqual(scoreRangeForRaw('reading-writing', 55), { lower:650, upper:670 })
  assert.throws(() => scoreRangeForRaw('math', 55), RangeError)
  assert.throws(() => scoreRangeForRaw('reading-writing', -1), RangeError)
})

if (process.env.SAT_API_URL) {
  const origin = process.env.SAT_API_URL
  test('desafio diário no banco: questão sem gabarito, resposta e perda de sol', async () => {
    const initialResponse = await fetch(`${origin}/api/sat/daily`)
    assert.equal(initialResponse.status, 200)
    const cookie = initialResponse.headers.get('set-cookie')?.split(';')[0]
    assert.ok(cookie)
    const initial = await initialResponse.json()
    assert.equal(initial.available, true)
    assert.equal(initial.total, 5)
    assert.equal('accepted_answers' in initial.question, false)
    const answerResponse = await fetch(`${origin}/api/sat/daily/answer`, {
      method:'POST', headers:{ Cookie:cookie, Origin:origin, 'Content-Type':'application/json' },
      body:JSON.stringify({ questionId:initial.question.id, answer:'Z' }),
    })
    assert.equal(answerResponse.status, 200)
    const after = await answerResponse.json()
    assert.equal(after.lives, 2)
    assert.equal(after.answered, 1)
    assert.equal(after.feedback.correct, false)
    const replay = await fetch(`${origin}/api/sat/daily/answer`, {
      method:'POST', headers:{ Cookie:cookie, Origin:origin, 'Content-Type':'application/json' },
      body:JSON.stringify({ questionId:initial.question.id, answer:'A' }),
    })
    assert.equal(replay.status, 409)
    const foreignOrigin = await fetch(`${origin}/api/sat/daily/answer`, {
      method:'POST', headers:{ Cookie:cookie, Origin:'https://example.com', 'Content-Type':'application/json' },
      body:JSON.stringify({ questionId:initial.question.id, answer:'A' }),
    })
    assert.equal(foreignOrigin.status, 403)
  })
  test('API retorna relatório de faixa com seções e módulos', async () => {
    const response = await fetch(`${origin}/api/sat/exam/grade`, {
      method:'POST', headers:{ Origin:origin, 'Content-Type':'application/json' }, body:JSON.stringify({ answers:[] }),
    })
    assert.equal(response.status, 200)
    const report = await response.json()
    assert.deepEqual(report.scoreRange, { lower:400, upper:400 })
    assert.deepEqual(report.sections['reading-writing'].scoreRange, { lower:200, upper:200 })
    assert.deepEqual(report.sections.math.scoreRange, { lower:200, upper:200 })
    assert.deepEqual(report.modules.map(item => item.correct), [0, 0, 0, 0])
    assert.match(report.scoringSource, /^https:\/\//)
  })
}
