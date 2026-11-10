import test from 'node:test'
import assert from 'node:assert/strict'
import {goetheExams} from '../src/data/goethePractice.ts'

test('Goethe practice has six distinct levels and the four skills',()=>{
 assert.deepEqual(goetheExams.map(exam=>exam.level),['A1','A2','B1','B2','C1','C2'])
 for(const exam of goetheExams){
  assert.equal(exam.times.length,4)
  assert.match(exam.source,/^https:\/\/www\.goethe\.de\//)
  assert.ok(exam.audio && exam.reading && exam.writing && exam.speaking)
  for(const item of [...exam.listeningQuestions,...exam.readingQuestions]){
   assert.ok(item.prompt && item.options.length>=2 && item.answer>=0 && item.answer<item.options.length)
  }
 }
})

test('Exame 1 has the official number of objective items at each level',()=>{
 const expected={A1:15,A2:20,B1:30,B2:30,C1:30,C2:30}
 for(const exam of goetheExams){
  assert.equal(exam.listeningQuestions.length,expected[exam.level],`${exam.level} Hören`)
  assert.equal(exam.readingQuestions.length,expected[exam.level],`${exam.level} Lesen`)
  for(const questions of [exam.listeningQuestions,exam.readingQuestions]){
   assert.equal(new Set(questions.map(question=>question.prompt)).size,questions.length)
   for(const question of questions){
    assert.equal(new Set(question.options).size,question.options.length)
    assert.ok(question.options[question.answer])
   }
  }
 }
})
