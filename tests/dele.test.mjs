import assert from 'node:assert/strict'
import { test } from 'node:test'
import { deleExams, findDeleExam } from '../src/data/delePractice.ts'

const expected = {
  A1: { sections: [[45, [5,6,6,8]], [25,[5,5,8,7]], [25,[1,1]], [10,[1,1,1],10]], objective:50 },
  A2: { sections: [[60,[5,8,6,6]], [40,[6,6,6,7]], [45,[1,1]], [12,[1,1,1],12]], objective:50 },
  B1: { sections: [[70,[6,6,6,6,6]], [40,[6,6,6,6,6]], [60,[1,1]], [15,[1,1,1,1],15]], objective:60 },
  B2: { sections: [[70,[6,10,6,14]], [40,[6,6,6,6,6]], [80,[1,1]], [20,[1,1,1],20]], objective:66 },
  C1: { sections: [[90,[6,6,6,8,14]], [50,[6,8,6,10]], [80,[1,1]], [20,[1,1,1],20]], objective:70 },
  C2: { sections: [[105,[12,6,8,5,7,6,8]], [150,[1,1,1]], [20,[1,1,1],30]], objective:52 },
}

test('every level follows the published task, item, time and oral preparation matrix',()=>{
  assert.equal(deleExams.length,6)
  for(const exam of deleExams){
    const spec=expected[exam.level]
    assert.ok(spec)
    assert.equal(findDeleExam(exam.level.toLowerCase()),exam)
    assert.ok(exam.sourceUrl.startsWith('https://'))
    assert.equal(exam.sections.length,spec.sections.length)
    exam.sections.forEach((section,index)=>{
      const [minutes,sizes,preparation=0]=spec.sections[index]
      assert.equal(section.minutes,minutes)
      assert.deepEqual(section.taskSizes,sizes)
      assert.equal(section.preparationMinutes??0,preparation)
      assert.equal(section.items.length,sizes.reduce((sum,n)=>sum+n,0))
      sizes.forEach((size,task)=>assert.equal(section.items.filter(item=>item.task===task+1).length,size))
    })
    assert.equal(exam.sections.flatMap(section=>section.items).filter(item=>item.kind==='choice').length,spec.objective)
  }
})

test('objective items have unique identifiers, meaningful options and a valid answer',()=>{
  for(const exam of deleExams){
    const items=exam.sections.flatMap(section=>section.items)
    assert.equal(new Set(items.map(item=>item.id)).size,items.length)
    const choices=items.filter(item=>item.kind==='choice')
    assert.equal(new Set(choices.map(item=>item.context+'|'+item.prompt)).size,choices.length)
    for(const item of items){
      assert.ok(item.prompt.trim())
      if(item.kind==='choice'){
        assert.equal(item.options.length,3)
        assert.equal(new Set(item.options).size,3)
        assert.ok(Number.isInteger(item.answer)&&item.answer>=0&&item.answer<3)
      }
    }
  }
})

test('C2 has a single integrated comprehension section with seven tasks',()=>{
  const exam=findDeleExam('c2')
  assert.equal(exam.sections[0].kind,'integrated')
  assert.equal(exam.sections[0].taskSizes.length,7)
  assert.equal(exam.sections[0].items.length,52)
  assert.ok(exam.sections[0].items.filter(item=>item.task<=3).every(item=>!item.audio))
  assert.ok(exam.sections[0].items.filter(item=>item.task>=4).every(item=>item.audio))
})
