import test from 'node:test'
import assert from 'node:assert/strict'
import { practiceSections, TOEFL_PRACTICE_EXAM } from '../src/data/toeflPractice.ts'
import { isObjectiveCorrect, practiceReport } from '../src/lib/toeflPractice.ts'
import { answerDaily, brazilDayKey, dailyItems, newDailyRecord, validDailyRecord } from '../src/lib/toeflDaily.ts'

test('practice covers all four updated TOEFL-style sections with original item counts',()=>{
  assert.deepEqual(practiceSections.map(section=>[section.id,section.items.length]),[
    ['reading',50],['listening',47],['writing',12],['speaking',11],
  ])
  assert.deepEqual(TOEFL_PRACTICE_EXAM,{id:'exame-1',title:'Exame 1',totalItems:120})
  const ids=practiceSections.flatMap(section=>section.items.map(item=>item.id))
  assert.equal(new Set(ids).size,ids.length)
  for(const section of practiceSections){
    for(const item of section.items){
      assert.ok(item.prompt.trim(),item.id)
      if(item.kind==='choice'){
        assert.ok(item.options.length>=2,item.id)
        assert.ok(item.answer>=0&&item.answer<item.options.length,item.id)
        assert.ok(item.explanation.trim(),item.id)
      }
    }
  }
  assert.deepEqual([...new Set(practiceSections[0].items.map(item=>item.task))],['Complete the Words','Read in Daily Life','Read an Academic Passage'])
  assert.deepEqual([...new Set(practiceSections[1].items.map(item=>item.task))],['Listen and Choose a Response','Listen to a Conversation','Listen to an Announcement','Listen to an Academic Talk'])
})

test('objective review checks choices and sentence order without assigning an official score',()=>{
  const reading=practiceSections[0].items[0]
  assert.equal(reading.kind,'choice')
  assert.equal(isObjectiveCorrect(reading,String(reading.answer)),true)
  assert.equal(isObjectiveCorrect(reading,String((reading.answer+1)%reading.options.length)),false)
  const sentence=practiceSections[2].items[0]
  assert.equal(sentence.kind,'sentence')
  const order=sentence.answer.replace(/[.]/g,'').split(' ').join(' ')
  assert.ok(order)
  const correctIndices=[4,3,1,0,2].join('|')
  assert.equal(isObjectiveCorrect(sentence,correctIndices),true)
  assert.equal(isObjectiveCorrect(sentence,'0|1|2|3|4'),false)
  const report=practiceReport({[reading.id]:String(reading.answer),[sentence.id]:correctIndices})
  assert.equal(report[0].correct,1)
  assert.equal(report[2].correct,1)
  assert.equal(report[3].total,0)
})

test('daily challenges select five distinct items per skill and rotate by Brasília day',()=>{
  assert.equal(brazilDayKey(new Date('2026-11-09T01:59:00Z')),'2026-11-08')
  assert.equal(brazilDayKey(new Date('2026-11-09T03:00:00Z')),'2026-11-09')
  const day='2026-11-09'
  for(const skill of ['reading','listening','writing','speaking']){
    const items=dailyItems(skill,day)
    assert.equal(items.length,5)
    assert.equal(new Set(items.map(item=>item.id)).size,5)
    assert.deepEqual(dailyItems(skill,day).map(item=>item.id),items.map(item=>item.id))
    assert.notDeepEqual(dailyItems(skill,'2026-11-10').map(item=>item.id),items.map(item=>item.id))
  }
  assert.equal(dailyItems('writing',day).filter(item=>item.kind==='response').length,1)
  assert.equal(dailyItems('speaking',day).filter(item=>item.task==='Take an Interview').length,3)
})

test('daily scoring limits Reading and Listening lives but does not grade open responses',()=>{
  const day='2026-11-09'
  const reading=newDailyRecord('reading',day)
  assert.equal(validDailyRecord(reading,'reading',day),true)
  const item=dailyItems('reading',day)[0]
  assert.equal(item.kind,'choice')
  const wrong=String((item.answer+1)%item.options.length)
  const once=answerDaily(reading,item,wrong,false)
  assert.equal(once.lives,2)
  assert.equal(once.correct,0)
  assert.deepEqual(answerDaily(once,item,wrong,false),once)
  const writing=newDailyRecord('writing',day)
  const sentence=dailyItems('writing',day)[0]
  assert.equal(answerDaily(writing,sentence,'0|1|2|3',false).lives,3)
  const speaking=newDailyRecord('speaking',day)
  const spoken=dailyItems('speaking',day)[0]
  const practiced=answerDaily(speaking,spoken,'Praticado em voz alta',false)
  assert.equal(practiced.correct,0)
  assert.equal(practiced.lives,3)
})

test('daily challenge completes after five tasks or ends when the third sun is lost',()=>{
  const day='2026-11-09'
  const items=dailyItems('reading',day)
  let completed=newDailyRecord('reading',day)
  for(let index=0;index<items.length;index++){
    completed=answerDaily({...completed,index},items[index],String(items[index].answer),true)
  }
  assert.equal(completed.status,'completed')
  assert.equal(completed.correct,5)
  let failed=newDailyRecord('reading',day)
  for(let index=0;index<3;index++){
    failed=answerDaily({...failed,index},items[index],String((items[index].answer+1)%items[index].options.length),false)
  }
  assert.equal(failed.status,'failed')
  assert.equal(failed.lives,0)
})
