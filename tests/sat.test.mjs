import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateSatQuestion } from '../server/sat.mjs'
import { scorePractice4, scorePractice5, scorePractice6, scorePractice7, scorePractice8, scorePractice9, scorePractice10, scoreRangeForRaw, SAT_SCORING_SOURCE_5, SAT_SCORING_SOURCE_6, SAT_SCORING_SOURCE_7, SAT_SCORING_SOURCE_8, SAT_SCORING_SOURCE_9, SAT_SCORING_SOURCE_10 } from '../server/satScoring.mjs'

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

test('CRUD distingue as versões 4 a 10', () => {
  assert.equal(validateSatQuestion({ ...valid, form_code:'practice-5-paper' }).data.form_code, 'practice-5-paper')
  assert.equal(validateSatQuestion({ ...valid, form_code:'practice-6-paper' }).data.form_code, 'practice-6-paper')
  assert.equal(validateSatQuestion({ ...valid, form_code:'practice-7-paper' }).data.form_code, 'practice-7-paper')
  assert.equal(validateSatQuestion({ ...valid, form_code:'practice-8-paper' }).data.form_code, 'practice-8-paper')
  assert.equal(validateSatQuestion({ ...valid, form_code:'practice-9-paper' }).data.form_code, 'practice-9-paper')
  assert.equal(validateSatQuestion({ ...valid, form_code:'practice-10-paper' }).data.form_code, 'practice-10-paper')
  assert.match(validateSatQuestion({ ...valid, form_code:'practice-11-paper' }).error, /Versão/)
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

test('teste 5 mantém as mesmas métricas com sua própria tabela oficial', () => {
  assert.match(SAT_SCORING_SOURCE_5, /scoring-sat-practice-test-5-digital\.pdf$/)
  assert.deepEqual(scorePractice5(0, 0), {
    readingWriting:{ lower:200, upper:200 }, math:{ lower:200, upper:200 }, total:{ lower:400, upper:400 },
  })
  assert.deepEqual(scorePractice5(66, 54), {
    readingWriting:{ lower:790, upper:800 }, math:{ lower:790, upper:800 }, total:{ lower:1580, upper:1600 },
  })
  assert.deepEqual(scoreRangeForRaw('reading-writing', 33, 'practice-5-paper'), { lower:450, upper:490 })
  assert.deepEqual(scoreRangeForRaw('math', 33, 'practice-5-paper'), { lower:490, upper:550 })
  assert.deepEqual(scoreRangeForRaw('math', 54, 'practice-5-paper'), { lower:790, upper:800 })
  assert.throws(() => scoreRangeForRaw('math', 0, 'practice-11-paper'), RangeError)
})

test('teste 6 usa sua tabela oficial sem mudar as métricas do relatório', () => {
  assert.match(SAT_SCORING_SOURCE_6, /scoring-sat-practice-test-6-digital\.pdf$/)
  assert.deepEqual(scorePractice6(0, 0), {
    readingWriting:{ lower:200, upper:200 }, math:{ lower:200, upper:200 }, total:{ lower:400, upper:400 },
  })
  assert.deepEqual(scorePractice6(66, 54), {
    readingWriting:{ lower:790, upper:800 }, math:{ lower:790, upper:800 }, total:{ lower:1580, upper:1600 },
  })
  assert.deepEqual(scoreRangeForRaw('reading-writing', 33, 'practice-6-paper'), { lower:470, upper:510 })
  assert.deepEqual(scoreRangeForRaw('math', 33, 'practice-6-paper'), { lower:510, upper:540 })
  assert.deepEqual(scoreRangeForRaw('reading-writing', 41, 'practice-6-paper'), { lower:530, upper:590 })
})

test('teste 7 usa sua tabela oficial sem mudar as métricas do relatório', () => {
  assert.match(SAT_SCORING_SOURCE_7, /scoring-sat-practice-test-7-digital\.pdf$/)
  assert.deepEqual(scorePractice7(0, 0), {
    readingWriting:{ lower:200, upper:200 }, math:{ lower:200, upper:200 }, total:{ lower:400, upper:400 },
  })
  assert.deepEqual(scorePractice7(66, 54), {
    readingWriting:{ lower:800, upper:800 }, math:{ lower:800, upper:800 }, total:{ lower:1600, upper:1600 },
  })
  assert.deepEqual(scoreRangeForRaw('reading-writing', 33, 'practice-7-paper'), { lower:420, upper:460 })
  assert.deepEqual(scoreRangeForRaw('math', 33, 'practice-7-paper'), { lower:500, upper:560 })
  assert.deepEqual(scoreRangeForRaw('math', 54, 'practice-7-paper'), { lower:800, upper:800 })
})

test('teste 8 usa sua tabela oficial sem mudar as métricas do relatório', () => {
  assert.match(SAT_SCORING_SOURCE_8, /scoring-sat-practice-test-8-digital\.pdf$/)
  assert.deepEqual(scorePractice8(0, 0), {
    readingWriting:{ lower:200, upper:200 }, math:{ lower:200, upper:200 }, total:{ lower:400, upper:400 },
  })
  assert.deepEqual(scorePractice8(66, 54), {
    readingWriting:{ lower:800, upper:800 }, math:{ lower:800, upper:800 }, total:{ lower:1600, upper:1600 },
  })
  assert.deepEqual(scoreRangeForRaw('reading-writing', 33, 'practice-8-paper'), { lower:430, upper:470 })
  assert.deepEqual(scoreRangeForRaw('math', 33, 'practice-8-paper'), { lower:490, upper:550 })
  assert.deepEqual(scoreRangeForRaw('math', 54, 'practice-8-paper'), { lower:800, upper:800 })
})

test('teste 9 usa sua tabela oficial sem mudar as métricas do relatório', () => {
  assert.match(SAT_SCORING_SOURCE_9, /scoring-sat-practice-test-9-digital\.pdf$/)
  assert.deepEqual(scorePractice9(0, 0), {
    readingWriting:{ lower:200, upper:200 }, math:{ lower:200, upper:200 }, total:{ lower:400, upper:400 },
  })
  assert.deepEqual(scorePractice9(66, 54), {
    readingWriting:{ lower:800, upper:800 }, math:{ lower:800, upper:800 }, total:{ lower:1600, upper:1600 },
  })
  assert.deepEqual(scoreRangeForRaw('reading-writing', 33, 'practice-9-paper'), { lower:420, upper:460 })
  assert.deepEqual(scoreRangeForRaw('math', 33, 'practice-9-paper'), { lower:500, upper:560 })
  assert.deepEqual(scoreRangeForRaw('math', 54, 'practice-9-paper'), { lower:800, upper:800 })
})

test('teste 10 usa sua tabela oficial sem mudar as métricas do relatório', () => {
  assert.match(SAT_SCORING_SOURCE_10, /scoring-sat-practice-test-10-digital\.pdf$/)
  assert.deepEqual(scorePractice10(0, 0), {
    readingWriting:{ lower:200, upper:200 }, math:{ lower:200, upper:200 }, total:{ lower:400, upper:400 },
  })
  assert.deepEqual(scorePractice10(66, 54), {
    readingWriting:{ lower:800, upper:800 }, math:{ lower:800, upper:800 }, total:{ lower:1600, upper:1600 },
  })
  assert.deepEqual(scoreRangeForRaw('reading-writing', 33, 'practice-10-paper'), { lower:420, upper:460 })
  assert.deepEqual(scoreRangeForRaw('math', 33, 'practice-10-paper'), { lower:490, upper:550 })
  assert.deepEqual(scoreRangeForRaw('math', 54, 'practice-10-paper'), { lower:800, upper:800 })
})

if (process.env.SAT_API_URL) {
  const origin = process.env.SAT_API_URL
  test('desafio diário no banco: questão sem gabarito, resposta e perda de sol', async () => {
    const initialResponse = await fetch(`${origin}/api/sat/daily?section=reading-writing`)
    assert.equal(initialResponse.status, 200)
    const cookie = initialResponse.headers.get('set-cookie')?.split(';')[0]
    assert.ok(cookie)
    const initial = await initialResponse.json()
    assert.equal(initial.available, true)
    assert.equal(initial.total, 5)
    assert.equal(initial.section, 'reading-writing')
    assert.equal(initial.question.section, 'reading-writing')
    assert.equal('accepted_answers' in initial.question, false)
    const mathResponse = await fetch(`${origin}/api/sat/daily?section=math`, { headers:{ Cookie:cookie } })
    assert.equal(mathResponse.status, 200)
    const math = await mathResponse.json()
    assert.equal(math.section, 'math')
    assert.equal(math.question.section, 'math')
    assert.equal(math.lives, 3)
    const answerResponse = await fetch(`${origin}/api/sat/daily/answer`, {
      method:'POST', headers:{ Cookie:cookie, Origin:origin, 'Content-Type':'application/json' },
      body:JSON.stringify({ section:'reading-writing', questionId:initial.question.id, answer:'Z' }),
    })
    assert.equal(answerResponse.status, 200)
    const after = await answerResponse.json()
    assert.equal(after.lives, 2)
    assert.equal(after.answered, 1)
    assert.equal(after.feedback.correct, false)
    const mathAgain = await fetch(`${origin}/api/sat/daily?section=math`, { headers:{ Cookie:cookie } }).then(result => result.json())
    assert.equal(mathAgain.lives, 3)
    assert.equal(mathAgain.answered, 0)
    const replay = await fetch(`${origin}/api/sat/daily/answer`, {
      method:'POST', headers:{ Cookie:cookie, Origin:origin, 'Content-Type':'application/json' },
      body:JSON.stringify({ section:'reading-writing', questionId:initial.question.id, answer:'A' }),
    })
    assert.equal(replay.status, 409)
    const foreignOrigin = await fetch(`${origin}/api/sat/daily/answer`, {
      method:'POST', headers:{ Cookie:cookie, Origin:'https://example.com', 'Content-Type':'application/json' },
      body:JSON.stringify({ section:'reading-writing', questionId:initial.question.id, answer:'A' }),
    })
    assert.equal(foreignOrigin.status, 403)
  })
  test('API retorna relatório de faixa com seções e módulos', async () => {
    for (const formCode of ['practice-4-paper', 'practice-5-paper', 'practice-6-paper', 'practice-7-paper', 'practice-8-paper', 'practice-9-paper', 'practice-10-paper']) {
      const examResponse = await fetch(`${origin}/api/sat/exam?form=${formCode}`)
      assert.equal(examResponse.status, 200)
      const exam = await examResponse.json()
      assert.equal(exam.ready, true)
      assert.equal(exam.questions.length, 120)
      assert.ok(exam.questions.every(question => question.form_code === formCode))
      const response = await fetch(`${origin}/api/sat/exam/grade`, {
        method:'POST', headers:{ Origin:origin, 'Content-Type':'application/json' }, body:JSON.stringify({ formCode, answers:[] }),
      })
      assert.equal(response.status, 200)
      const report = await response.json()
      assert.equal(report.formCode, formCode)
      assert.deepEqual(report.scoreRange, { lower:400, upper:400 })
      assert.deepEqual(report.sections['reading-writing'].scoreRange, { lower:200, upper:200 })
      assert.deepEqual(report.sections.math.scoreRange, { lower:200, upper:200 })
      assert.deepEqual(report.modules.map(item => item.correct), [0, 0, 0, 0])
      assert.match(report.scoringSource, /^https:\/\//)
      assert.equal(report.scoringSource.includes(`test-${formCode.split('-')[1]}-digital.pdf`), true)
    }
  })
}
