import assert from 'node:assert/strict'
import { test } from 'node:test'
import { practiceExams } from '../src/exams/practiceCatalog.ts'
import { EXAMS } from '../src/data/exams.ts'

const levels={toefl:1,ielts:1,'goethe-zertifikat':6,'delf-dalf':6,jlpt:5,topik:2,hsk:6,dele:6}

test('all new site exams have a mobile variant with the complete section data',()=>{
  assert.deepEqual(Object.fromEntries(practiceExams.map(exam=>[exam.id,exam.variants.length])),levels)
  assert.ok(practiceExams.every(exam=>EXAMS.some(entry=>entry.id===exam.id)))
  for(const exam of practiceExams)for(const variant of exam.variants){
    assert.ok(variant.sourceUrl.startsWith('https://'))
    assert.ok(variant.sections.length>0)
    const items=variant.sections.flatMap(section=>section.items)
    assert.ok(items.length>0)
    assert.equal(new Set(items.map(item=>item.id)).size,items.length)
    for(const section of variant.sections){
      assert.ok(section.minutes>0)
      assert.ok(section.items.length>0)
      for(const item of section.items){
        assert.ok(item.prompt.trim())
        if(item.kind==='choice'){
          assert.ok(item.options.length>=2)
          assert.ok(Number.isInteger(Number(item.answer)))
          assert.ok(Number(item.answer)>=0&&Number(item.answer)<item.options.length)
        }
      }
    }
  }
})

test('the large exam variants retain their site item counts',()=>{
  const count=(id,variant)=>practiceExams.find(exam=>exam.id===id).variants.find(item=>item.id===variant).sections.reduce((sum,section)=>sum+section.items.length,0)
  assert.equal(count('toefl','exame-1'),120)
  assert.equal(count('ielts','academic-1'),85)
  assert.equal(count('topik','ii'),104)
  assert.equal(count('dele','c2'),58)
})
