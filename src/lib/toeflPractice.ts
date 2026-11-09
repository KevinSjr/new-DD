import { practiceSections, type ChoiceItem, type PracticeItem, type Skill } from '../data/toeflPractice.ts'

export type PracticeAnswers = Record<string,string>

export function normalizeSentence(value:string):string {
  return value.toLowerCase().replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').trim()
}

export function isObjectiveCorrect(item:PracticeItem, answer:string):boolean {
  if(item.kind==='choice') return answer===String((item as ChoiceItem).answer)
  if(item.kind==='sentence') {
    const indices=answer.split('|').map(Number)
    if(indices.length!==item.words.length||new Set(indices).size!==item.words.length||indices.some(index=>!Number.isInteger(index)||index<0||index>=item.words.length))return false
    return normalizeSentence(indices.map(index=>item.words[index]).join(' '))===normalizeSentence(item.answer)
  }
  return false
}

export function practiceReport(answers:PracticeAnswers) {
  return practiceSections.map(section=>{
    const objective=section.items.filter(item=>item.kind!=='response')
    const correct=objective.filter(item=>isObjectiveCorrect(item,answers[item.id]||'')).length
    const attempted=objective.filter(item=>!!answers[item.id]?.trim()).length
    const open=section.items.filter(item=>item.kind==='response')
    const completed=open.filter(item=>!!answers[item.id]?.trim()).length
    return {skill:section.id as Skill,title:section.title,correct,attempted,total:objective.length,
      completed,openTotal:open.length}
  })
}
