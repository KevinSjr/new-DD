import type { FrenchExam, FrenchSection, FrenchTask } from '../data/delfDalfPractice.ts'

export type FrenchAnswers = Record<string,string>
export type FrenchProgress = {
  phase:'intro'|'oral-listening'|'preparation'|'exam'|'results'
  section:number
  task:number
  answers:FrenchAnswers
  deadline:number
  listens:Record<string,number>
}

export function newFrenchProgress():FrenchProgress {
  return {phase:'intro',section:0,task:0,answers:{},deadline:0,listens:{}}
}

export function nextFrenchSection(exam:FrenchExam,index:number,tick:number):Pick<FrenchProgress,'phase'|'section'|'task'|'deadline'> {
  const section=exam.sections[index]
  if(exam.level==='C2'&&section.id==='speaking')return {phase:'oral-listening',section:index,task:0,deadline:0}
  if(section.preparationMinutes)return {phase:'preparation',section:index,task:0,deadline:tick+section.preparationMinutes*60_000}
  return {phase:'exam',section:index,task:0,deadline:tick+section.minutes*60_000}
}

export function validFrenchProgress(value:unknown,exam:FrenchExam):value is FrenchProgress {
  if(!value||typeof value!=='object')return false
  const record=value as Partial<FrenchProgress>
  return ['intro','oral-listening','preparation','exam','results'].includes(record.phase||'')&&
    typeof record.section==='number'&&Number.isInteger(record.section)&&record.section>=0&&record.section<exam.sections.length&&
    (record.phase!=='preparation'||Boolean(exam.sections[record.section].preparationMinutes))&&
    (record.phase!=='oral-listening'||exam.level==='C2'&&exam.sections[record.section].id==='speaking')&&
    typeof record.task==='number'&&Number.isInteger(record.task)&&record.task>=0&&record.task<exam.sections[record.section].tasks.length&&
    !!record.answers&&typeof record.answers==='object'&&!Array.isArray(record.answers)&&
    typeof record.deadline==='number'&&Number.isFinite(record.deadline)&&
    !!record.listens&&typeof record.listens==='object'&&!Array.isArray(record.listens)
}

export function frenchSectionReview(section:FrenchSection,answers:FrenchAnswers){
  const choices=section.tasks.filter((task):task is Extract<FrenchTask,{kind:'choice'}>=>task.kind==='choice')
  const open=section.tasks.filter(task=>task.kind!=='choice')
  return {
    correct:choices.filter(task=>answers[task.id]===String(task.answer)).length,
    objectiveTotal:choices.length,
    answered:choices.filter(task=>answers[task.id]!==undefined).length,
    practiced:open.filter(task=>Boolean(answers[task.id]?.trim())).length,
    openTotal:open.length,
  }
}

export function wordCount(value:string):number {
  return value.trim()?value.trim().split(/\s+/).length:0
}
