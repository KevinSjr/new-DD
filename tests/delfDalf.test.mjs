import test from 'node:test'
import assert from 'node:assert/strict'
import { frenchExams, findFrenchExam } from '../src/data/delfDalfPractice.ts'
import { frenchSectionReview, newFrenchProgress, nextFrenchSection, validFrenchProgress, wordCount } from '../src/lib/delfDalfPractice.ts'

test('six independent DELF/DALF levels cover their component skills',()=>{
  assert.deepEqual(frenchExams.map(exam=>exam.level),['A1','A2','B1','B2','C1','C2'])
  assert.deepEqual(frenchExams.map(exam=>exam.sections.map(section=>section.minutes)),[
    [20,30,30,7],[25,30,45,8],[25,45,45,15],[30,60,60,20],[40,50,150,30],[210,30],
  ])
  assert.equal(new Set(frenchExams.map(exam=>exam.id)).size,6)
  for(const exam of frenchExams){
    assert.equal(findFrenchExam(exam.id),exam)
    assert.match(exam.sourceUrl,/^https:\/\//)
    assert.deepEqual(exam.sections.map(section=>section.id),exam.level==='C2'?['writing','speaking']:['listening','reading','writing','speaking'])
    const ids=exam.sections.flatMap(section=>section.tasks.map(task=>task.id))
    assert.equal(new Set(ids).size,ids.length)
    for(const section of exam.sections){
      assert.ok(section.minutes>0)
      assert.ok(section.tasks.length>0)
      for(const task of section.tasks){
        assert.ok(task.prompt.trim(),task.id)
        assert.ok(task.context.trim(),task.id)
        if(task.kind==='choice'){
          assert.ok(task.options.length>=2&&task.options.length<=8)
          assert.ok(task.answer>=0&&task.answer<task.options.length)
          assert.equal(new Set(task.options).size,task.options.length)
          assert.ok(task.explanation.trim())
          if(section.id==='listening')assert.ok(task.audio?.trim())
        }else assert.ok(task.review.length>0)
      }
    }
  }
  assert.equal(findFrenchExam('unknown'),undefined)
})

test('review reports objective answers and open practice separately',()=>{
  const exam=findFrenchExam('delf-a1-1')
  const listening=exam.sections[0]
  const first=listening.tasks[0]
  const second=listening.tasks[1]
  const answers={[first.id]:String(first.answer),[second.id]:String((second.answer+1)%4)}
  assert.deepEqual(frenchSectionReview(listening,answers),{correct:1,objectiveTotal:21,answered:2,practiced:0,openTotal:0})
  const writing=exam.sections[2]
  assert.deepEqual(frenchSectionReview(writing,{[writing.tasks[0].id]:'Bonjour !'}),{correct:0,objectiveTotal:0,answered:0,practiced:1,openTotal:2})
  assert.equal(wordCount('  Bonjour   à tous  '),3)
  assert.equal(wordCount('   '),0)
})

test('DELF A1–B2 comprehension follows the published exercise and item matrix',()=>{
  const matrix={A1:{listening:[4,4,4,4,5],reading:[5,5,5,5]},A2:{listening:[6,6,6,4],reading:[6,6,6,5]},B1:{listening:[6,7,7],reading:[16,7,7]},B2:{listening:[7,7,6],reading:[7,7,6]}}
  const documents={A1:{listening:[1,1,1,1,1],reading:[1,1,5,1]},A2:{listening:[6,3,1,4],reading:[6,1,3,1]},B1:{listening:[1,1,1],reading:[4,1,1]},B2:{listening:[1,1,3],reading:[1,1,3]}}
  for(const [level,skills] of Object.entries(matrix)){
    const exam=frenchExams.find(item=>item.level===level)
    for(const [skill,expected] of Object.entries(skills)){
      const section=exam.sections.find(item=>item.id===skill)
      const actual=expected.map((_,index)=>section.tasks.filter(item=>item.exercise===index+1).length)
      assert.deepEqual(actual,expected,`${level} ${skill}`)
      assert.deepEqual(expected.map((_,index)=>new Set(section.tasks.filter(item=>item.exercise===index+1).map(item=>item.supportId)).size),documents[level][skill],`${level} ${skill} documents`)
      assert.equal(section.tasks.length,expected.reduce((sum,count)=>sum+count,0))
      for(const item of section.tasks){
        assert.match(item.supportId,/^(A1|A2|B1|B2)-/)
        assert.equal(item.listenLimit,skill==='listening'&&level==='B2'&&item.exercise===3?1:skill==='listening'?2:undefined)
      }
    }
  }
})

test('association, binary questions and oral preparation use their distinct formats',()=>{
  const byLevel=Object.fromEntries(frenchExams.map(exam=>[exam.level,exam]))
  const inExercise=(level,skill,exercise)=>byLevel[level].sections.find(section=>section.id===skill).tasks.filter(task=>task.exercise===exercise)
  assert.deepEqual(inExercise('A1','listening',4).map(task=>task.format),Array(4).fill('matching'))
  assert.equal(inExercise('A1','listening',4)[0].options.length,6)
  assert.deepEqual(inExercise('A1','listening',5).map(task=>task.format),Array(5).fill('yes-no'))
  assert.equal(inExercise('A2','reading',1)[0].options.length,8)
  assert.equal(inExercise('A2','reading',1)[0].uniqueMatch,true)
  assert.deepEqual(inExercise('B2','reading',3).map(task=>task.format),Array(6).fill('matching'))
  assert.equal(inExercise('B2','reading',3)[0].uniqueMatch,undefined)
  const c1Listening=byLevel.C1.sections.find(section=>section.id==='listening')
  assert.equal(new Set(c1Listening.tasks.map(task=>task.supportId)).size,4)
  assert.deepEqual(c1Listening.tasks.slice(-3).map(task=>task.listenLimit),[1,1,1])
  assert.match(byLevel.C2.sections[0].tasks[0].prompt,/Sujet 1.*Sujet 2/)
  assert.ok(byLevel.C2.sections[1].tasks[0].audio)
  for(const exam of frenchExams){
    const index=exam.sections.findIndex(section=>section.id==='speaking')
    const state=nextFrenchSection(exam,index,1000)
    assert.equal(state.phase,exam.level==='C2'?'oral-listening':'preparation')
    assert.equal(exam.sections[index].preparationMinutes,{A1:10,A2:10,B1:10,B2:30,C1:60,C2:60}[exam.level])
  }
})

test('saved progress requires valid section and task for its specific exam',()=>{
  const exam=findFrenchExam('dalf-c2-1')
  const progress=newFrenchProgress()
  assert.equal(validFrenchProgress(progress,exam),true)
  assert.equal(validFrenchProgress({...progress,section:2},exam),false)
  assert.equal(validFrenchProgress({...progress,task:100},exam),false)
  assert.equal(validFrenchProgress({...progress,answers:[]},exam),false)
})
