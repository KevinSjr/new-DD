import { practiceSections as toeflSections } from '../data/practice/toeflPractice.ts'
import { listeningSets, readingSets, writingTasks, speakingParts, ieltsSections } from '../data/practice/ieltsPractice.ts'
import { goetheExams } from '../data/practice/goethePractice.ts'
import { frenchExams } from '../data/practice/delfDalfPractice.ts'
import { jlptExams } from '../data/practice/jlptPractice.ts'
import { topikExams } from '../data/practice/topikPractice.ts'
import { hskExams } from '../data/practice/hskPractice.ts'
import { deleExams } from '../data/practice/delePractice.ts'

export type PracticeItem = {
  id:string; kind:'choice'|'short'|'sentence'|'writing'|'speaking'; prompt:string
  context?:string; audio?:string; options?:string[]; answer?:string; explanation?:string; guidance?:string; words?:string[]; task?:string
}
export type PracticeSection = { id:string; title:string; minutes:number; preparationMinutes?:number; items:PracticeItem[] }
export type PracticeVariant = { id:string; title:string; sourceUrl:string; sections:PracticeSection[] }
export type PracticeExam = { id:string; name:string; language:string; variants:PracticeVariant[] }

const choice=(id:string,prompt:string,options:string[],answer:number,context?:string,audio?:string,explanation?:string,task?:string):PracticeItem=>
  ({id,kind:'choice',prompt,options,answer:String(answer),context,audio,explanation,task})
const open=(id:string,kind:'writing'|'speaking',prompt:string,context?:string,audio?:string,guidance?:string,task?:string):PracticeItem=>
  ({id,kind,prompt,context,audio,guidance,task})

const toefl:PracticeExam={id:'toefl',name:'TOEFL',language:'en-US',variants:[{
  id:'exame-1',title:'Exame 1',sourceUrl:'https://www.ets.org/toefl/ibt.html',sections:toeflSections.map(section=>({
    id:section.id,title:section.title,minutes:section.minutes,items:section.items.map(item=>item.kind==='choice'
      ?choice(item.id,item.prompt,item.options,item.answer,item.context,item.audio,item.explanation,item.task)
      :item.kind==='sentence'?{id:item.id,kind:'sentence',prompt:item.prompt,words:item.words,answer:item.answer,task:item.task}
      :open(item.id,section.id==='speaking'?'speaking':'writing',item.prompt,undefined,item.audio,item.guidance,item.task)),
  }))
}]}

const ielts:PracticeExam={id:'ielts',name:'IELTS Academic',language:'en-US',variants:[{
  id:'academic-1',title:'Academic · Exame 1',sourceUrl:'https://ielts.org/take-a-test/test-types/ielts-academic-test',sections:ieltsSections.map(section=>({
    id:section.id,title:section.title,minutes:section.minutes,items:section.id==='listening'||section.id==='reading'
      ?(section.id==='listening'?listeningSets:readingSets).flatMap((set,setIndex)=>set.items.map(item=>item.kind==='choice'
        ?choice(item.id,item.prompt,item.options||[],item.options?.indexOf(item.answer)??-1,set.context,section.id==='listening'?set.context:undefined,item.explanation,set.title)
        :{id:item.id,kind:'short' as const,prompt:item.prompt,context:set.context,audio:section.id==='listening'?set.context:undefined,answer:item.answer,explanation:item.explanation,task:set.title}))
      :section.id==='writing'?writingTasks.map(task=>open(task.id,'writing',task.prompt,'table' in task?task.table.caption+'\n'+[task.table.headings,...task.table.rows].map(row=>row.join(' | ')).join('\n'):undefined,undefined,task.guidance,task.title))
      :speakingParts.map(part=>open(part.id,'speaking',part.prompt,undefined,undefined,part.guidance,part.title)),
  }))
}]}

const goethe:PracticeExam={id:'goethe-zertifikat',name:'Goethe-Zertifikat',language:'de-DE',variants:goetheExams.map(exam=>({
  id:exam.level.toLowerCase(),title:exam.level+' · Exame 1',sourceUrl:exam.source,
  sections:[
    {id:'listening',title:'Hören',minutes:exam.times[0],items:exam.listeningQuestions.map((item,index)=>choice('h-'+index,item.prompt,item.options,item.answer,undefined,exam.audio))},
    {id:'reading',title:'Lesen',minutes:exam.times[1],items:exam.readingQuestions.map((item,index)=>choice('l-'+index,item.prompt,item.options,item.answer,exam.reading))},
    {id:'writing',title:'Schreiben',minutes:exam.times[2],items:[open('writing','writing',exam.writing)]},
    {id:'speaking',title:'Sprechen',minutes:exam.times[3],items:[open('speaking','speaking',exam.speaking)]},
  ],
}))}

const french:PracticeExam={id:'delf-dalf',name:'DELF / DALF',language:'fr-FR',variants:frenchExams.map(exam=>({
  id:exam.id,title:exam.level+' · Exame 1',sourceUrl:exam.sourceUrl,sections:exam.sections.map(section=>({
    id:section.id,title:section.title,minutes:section.minutes,preparationMinutes:section.preparationMinutes,
    items:section.tasks.map(task=>task.kind==='choice'
      ?choice(task.id,task.prompt,task.options,task.answer,task.context,task.audio,task.explanation,task.title)
      :open(task.id,task.kind,task.prompt,task.context,task.audio,task.review.join(' '),task.title)),
  })),
}))}

const jlpt:PracticeExam={id:'jlpt',name:'JLPT',language:'ja-JP',variants:jlptExams.map(exam=>({
  id:exam.level.toLowerCase(),title:exam.level+' · Exame 1',sourceUrl:'https://www.jlpt.jp/e/guideline/testsections.html',
  sections:exam.sections.map(section=>({id:section.id,title:section.title,minutes:section.minutes,items:section.questions.map(item=>choice(item.id,item.prompt,item.options,item.answer,item.context,item.audio,undefined,item.type))})),
}))}

const topik:PracticeExam={id:'topik',name:'TOPIK',language:'ko-KR',variants:topikExams.map(exam=>({
  id:exam.level.toLowerCase(),title:'TOPIK '+exam.level+' · Exame 1',sourceUrl:'https://www.niied.go.kr/web/NIIED/contents/niiedEng/eng_topikOverview',
  sections:exam.sections.map(section=>({id:section.id,title:section.name,minutes:section.minutes,items:section.questions.map(item=>item.options&&item.answer!==undefined
    ?choice(item.id,item.prompt,item.options,item.answer,item.passage,item.audio)
    :open(item.id,'writing',item.prompt,item.passage,undefined,item.guide))})),
}))}

const hsk:PracticeExam={id:'hsk',name:'HSK',language:'zh-CN',variants:hskExams.map(exam=>({
  id:String(exam.level),title:'HSK '+exam.level+' · Exame 1',sourceUrl:'https://www.chinesetest.cn/',
  sections:exam.sections.map(section=>({id:section.id,title:section.name,minutes:section.minutes,items:section.questions.map(item=>item.options&&item.answer!==undefined
    ?choice(item.id,item.prompt,item.options,item.answer,item.passage,item.audio)
    :open(item.id,'writing',item.prompt,item.passage,undefined,item.guide))})),
}))}

const dele:PracticeExam={id:'dele',name:'DELE',language:'es-ES',variants:deleExams.map(exam=>({
  id:exam.level.toLowerCase(),title:exam.level+' · Exame 1',sourceUrl:exam.sourceUrl,
  sections:exam.sections.map(section=>({id:section.id,title:section.title,minutes:section.minutes,preparationMinutes:section.preparationMinutes,
    items:section.items.map(item=>item.kind==='choice'
      ?choice(item.id,item.prompt,item.options||[],item.answer??-1,item.context,item.audio,item.review,'Tarefa '+item.task)
      :open(item.id,item.kind,item.prompt,item.context,item.audio,item.review,'Tarefa '+item.task)),
  })),
}))}

export const practiceExams=[toefl,ielts,goethe,french,jlpt,topik,hsk,dele]
export function findPracticeExam(id:string){return practiceExams.find(exam=>exam.id===id)}
