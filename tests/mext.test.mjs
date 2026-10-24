import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile, readdir } from 'node:fs/promises'
import { matchesMextAnswer, MEXT_EXPECTED, MEXT_MINUTES, MEXT_B_EXPECTED, MEXT_B_MINUTES, mextAvailability, getMextExam, gradeMextExam } from '../server/mext.mjs'
import { database } from '../server/db.mjs'

test('respostas de alternativa e verdadeiro/falso ignoram caixa, mas não aceitam vazio', () => {
  const question = { answer_type:'choice', accepted_answers:['B'] }
  assert.equal(matchesMextAnswer(question, 'b'), true)
  assert.equal(matchesMextAnswer(question, ''), false)
  assert.equal(matchesMextAnswer(question, 'A'), false)
  assert.equal(matchesMextAnswer({ answer_type:'true-false', accepted_answers:['T'] }, 't'), true)
})

test('respostas numéricas aceitam fração exata ou decimal equivalente', () => {
  const question = { answer_type:'numeric', accepted_answers:['5/16'] }
  assert.equal(matchesMextAnswer(question, '5/16'), true)
  assert.equal(matchesMextAnswer(question, '0,3125'), true)
  assert.equal(matchesMextAnswer(question, '0.31'), false)
  assert.equal(matchesMextAnswer(question, '0/0'), false)
})

test('a edição A exige as quantidades e tempos conferidos nos PDFs', () => {
  assert.deepEqual(MEXT_EXPECTED, { japanese:45, english:70, math:32 })
  assert.deepEqual(MEXT_MINUTES, { japanese:100, english:60, math:60 })
})

test('a edição B exige as seis disciplinas e aceita formas cadastradas', () => {
  assert.deepEqual(MEXT_B_EXPECTED, { japanese:48, english:50, math:20, chemistry:40, physics:24, biology:73 })
  assert.deepEqual(MEXT_B_MINUTES, { japanese:100, english:60, math:60, chemistry:60, physics:60, biology:60 })
  assert.equal(matchesMextAnswer({ answer_type:'text', accepted_answers:['C(1-alpha)'] }, 'C (1 - α)'), true)
  assert.equal(matchesMextAnswer({ answer_type:'text', accepted_answers:['n+7'] }, 'n + 7'), true)
  assert.equal(matchesMextAnswer({ answer_type:'numeric', accepted_answers:['0.23'] }, '2.3*10^-1'), true)
  assert.equal(matchesMextAnswer({ answer_type:'numeric', accepted_answers:['5/6', 'log8(4sqrt2)'] }, 'log8(4sqrt2)'), true)
  assert.equal(matchesMextAnswer({ answer_type:'numeric', accepted_answers:['22.8'] }, '22,8%'), true)
})

test('a migração inclui os 147 itens e os assets locais', async () => {
  const sql = await readFile('db/migrations/041_mext_2025_a_seed.sql', 'utf8')
  assert.equal((sql.match(/INSERT INTO mext_questions/g) || []).length, 147)
  const assets = await readdir('public/mext-assets/2025-a')
  assert.ok(assets.some(name => name === 'english-p02-q01.jpg'))
  assert.ok(assets.some(name => name === 'japanese-p03-q01.jpg'))
  assert.ok(assets.some(name => name === 'math-p02.jpg'))
})

test('a migração B inclui 255 itens e os assets locais', async () => {
  const sql = await readFile('db/migrations/043_mext_2025_b_seed.sql', 'utf8')
  assert.equal((sql.match(/INSERT INTO mext_questions/g) || []).length, 255)
  const assets = await readdir('public/mext-assets/2025-b')
  assert.ok(assets.includes('japanese-p03.jpg'))
  assert.ok(assets.includes('japanese-i-q01.jpg'))
  assert.ok(assets.includes('math-p02.jpg'))
  assert.ok(assets.includes('biology-p11.jpg'))
})

if (process.env.DATABASE_URL || process.env.PGDATABASE) {
  test('o PostgreSQL publica todos os itens, assets e pesos do gabarito', async () => {
    try {
      const availability = await mextAvailability()
      assert.equal(availability.ready, true)
      const result = await database().query("SELECT id,subject,accepted_answers,asset_paths FROM mext_questions WHERE edition=2025 AND track='A' AND status='published'")
      assert.equal(result.rows.length, 147)
      const publicExam = await getMextExam()
      assert.equal(publicExam.questions.length, 147)
      assert.ok(publicExam.questions.every(question => !('accepted_answers' in question)))
      for (const row of result.rows) {
        for (const path of row.asset_paths) {
          const target = `public${path}`
          assert.ok((await readFile(target)).length > 1000, target)
        }
      }
      const grade = await gradeMextExam({ answers:result.rows.map(row => ({ questionId:Number(row.id), answer:row.accepted_answers[0] })) })
      assert.equal(grade.earned, 300)
      assert.deepEqual(Object.fromEntries(Object.entries(grade.sections).map(([subject, section]) => [subject, section.earned])), { japanese:100, english:100, math:100 })
      for (const science of ['physics', 'biology']) {
        const availabilityB = await mextAvailability('B', science)
        assert.equal(availabilityB.ready, true)
        const examB = await getMextExam('B', science)
        assert.equal(examB.questions.length, science === 'physics' ? 182 : 231)
        assert.ok(examB.questions.every(question => !('accepted_answers' in question)))
        const answersB = await database().query("SELECT id,subject,section,accepted_answers,asset_paths FROM mext_questions WHERE edition=2025 AND track='B' AND subject=ANY($1::text[]) AND status='published'", [availabilityB.subjects.map(item => item.subject)])
        for (const row of answersB.rows) for (const path of row.asset_paths) assert.ok((await readFile(`public${path}`)).length > 1000, path)
        const secondPairId = answersB.rows.filter(row => row.subject === 'biology' && row.section === 'II-3')[1]?.id
        const gradeB = await gradeMextExam({ track:'B', science, answers:answersB.rows.map(row => ({ questionId:Number(row.id), answer:row.id === secondPairId ? 'H' : row.accepted_answers[0] })) })
        assert.equal(gradeB.earned, 500)
        assert.equal(gradeB.maximum, 500)
      }
      const pair = await database().query("SELECT id,accepted_answers FROM mext_questions WHERE track='B' AND subject='biology' AND section='II-3' ORDER BY position")
      assert.equal(pair.rows.length, 2)
      const duplicatePair = await gradeMextExam({ track:'B', science:'biology', answers:pair.rows.map(row => ({ questionId:Number(row.id), answer:'C' })) })
      assert.equal(duplicatePair.sections.biology.earned, 2)
      const reversedPair = await gradeMextExam({ track:'B', science:'biology', answers:[{questionId:Number(pair.rows[0].id),answer:'H'},{questionId:Number(pair.rows[1].id),answer:'C'}] })
      assert.equal(reversedPair.sections.biology.earned, 4)
    } finally { await database().end() }
  })
}
