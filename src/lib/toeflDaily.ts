import { listeningItems, readingItems, speakingItems, writingItems, type PracticeItem, type Skill } from '../data/toeflPractice.ts'

export type DailyRecord = {
  day:string; skill:Skill; status:'active'|'completed'|'failed'; index:number;
  answers:Record<string,string>; correct:number; lives:number
}
export type DailyStore = {day:string; records:Partial<Record<Skill,DailyRecord>>}
export const DAILY_STORAGE_KEY='daydreaming-toefl-daily-v1'
export const DAILY_ITEM_COUNT=5

export function brazilDayKey(date:Date):string {
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date)
  const get=(part:string)=>parts.find(item=>item.type===part)?.value||''
  return `${get('year')}-${get('month')}-${get('day')}`
}

function dayNumber(day:string):number {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day))throw new Error('Data diária inválida')
  return Math.floor(Date.parse(`${day}T00:00:00Z`)/86_400_000)
}

export function dailyItems(skill:Skill,day:string):PracticeItem[] {
  const n=dayNumber(day)
  if(skill==='reading')return Array.from({length:5},(_,group)=>readingItems[group*10+(n+group*3)%10])
  if(skill==='listening')return [listeningItems[n%2],...Array.from({length:4},(_,slot)=>{
    const group=(n+slot)%9
    return listeningItems[2+group*5+(n+slot*2)%5]
  })]
  if(skill==='writing')return [
    ...Array.from({length:4},(_,slot)=>writingItems[(n*4+slot)%10]),
    writingItems[10+n%2],
  ]
  return [
    ...Array.from({length:2},(_,slot)=>speakingItems[(n*2+slot)%6]),
    ...Array.from({length:3},(_,slot)=>speakingItems[6+(n*3+slot)%5]),
  ]
}

export function newDailyRecord(skill:Skill,day:string):DailyRecord {
  return {day,skill,status:'active',index:0,answers:{},correct:0,lives:3}
}

export function validDailyRecord(value:unknown,skill:Skill,day:string):value is DailyRecord {
  if(!value||typeof value!=='object')return false
  const record=value as Partial<DailyRecord>
  return record.day===day&&record.skill===skill&&['active','completed','failed'].includes(record.status||'')&&
    typeof record.index==='number'&&Number.isInteger(record.index)&&record.index>=0&&record.index<DAILY_ITEM_COUNT&&
    typeof record.correct==='number'&&Number.isInteger(record.correct)&&record.correct>=0&&record.correct<=DAILY_ITEM_COUNT&&
    typeof record.lives==='number'&&Number.isInteger(record.lives)&&record.lives>=0&&record.lives<=3&&
    !!record.answers&&typeof record.answers==='object'
}

export function answerDaily(record:DailyRecord,item:PracticeItem,answer:string,correct:boolean):DailyRecord {
  if(record.status!=='active'||!answer.trim()||record.answers[item.id])return record
  const objective=item.kind!=='response'
  const nextCorrect=record.correct+(objective&&correct?1:0)
  const nextLives=record.lives-(record.skill==='reading'||record.skill==='listening'?objective&&!correct?1:0:0)
  const last=record.index===DAILY_ITEM_COUNT-1
  return {...record,answers:{...record.answers,[item.id]:answer},correct:nextCorrect,lives:nextLives,
    status:nextLives===0?'failed':last?'completed':'active'}
}
