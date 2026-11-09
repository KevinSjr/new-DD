import { useEffect, useRef, useState } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { practiceSections, TOEFL_PRACTICE_EXAM, type PracticeItem, type Skill } from '../data/toeflPractice'
import { isObjectiveCorrect } from '../lib/toeflPractice'
import { answerDaily, brazilDayKey, dailyItems, DAILY_ITEM_COUNT, DAILY_STORAGE_KEY, newDailyRecord, validDailyRecord, type DailyStore } from '../lib/toeflDaily'
import './ToeflPage.css'
import './ToeflDailyPage.css'

const skills:Skill[]=['reading','listening','writing','speaking']
const firstDay=brazilDayKey(new Date())
const skillDescriptions:Record<Skill,string>={
  reading:'Cinco questões de leitura, com três sóis para tentar chegar ao fim.',
  listening:'Ouça as falas e responda a cinco questões, com três sóis.',
  writing:'Monte quatro frases e escreva uma resposta curta. Sem perda de sóis.',
  speaking:'Pratique cinco respostas faladas, com gravação opcional. Sem nota automática.',
}

function readStore(day:string):DailyStore {
  try {
    const raw=localStorage.getItem(DAILY_STORAGE_KEY)
    if(raw){const value=JSON.parse(raw) as DailyStore
      if(value.day===day&&value.records&&typeof value.records==='object'){
        const records:DailyStore['records']={}
        for(const skill of skills)if(validDailyRecord(value.records[skill],skill,day))records[skill]=value.records[skill]
        return {day,records}
      }
    }
  }catch{/* Storage may be disabled. The current tab still works. */}
  return {day,records:{}}
}

function answerLabel(item:PracticeItem):string {
  if(item.kind==='choice')return `${item.options[item.answer]}. ${item.explanation}`
  if(item.kind==='sentence')return item.answer
  return item.guidance
}

export function ToeflDailyPage(){
  useDocumentTitle('Desafios diários de inglês | Daydreaming')
  const [day,setDay]=useState(firstDay)
  const [store,setStore]=useState<DailyStore>(()=>readStore(firstDay))
  const [selected,setSelected]=useState<Skill|null>(null)
  const [draft,setDraft]=useState('')
  const [showTranscript,setShowTranscript]=useState(false)
  const [audioError,setAudioError]=useState('')
  const [recording,setRecording]=useState(false)
  const [recordingUrl,setRecordingUrl]=useState('')
  const recorder=useRef<MediaRecorder|null>(null)
  const recordingUrlRef=useRef('')

  useEffect(()=>{try{localStorage.setItem(DAILY_STORAGE_KEY,JSON.stringify(store))}catch{/* Continue without persistence. */}},[store])
  useEffect(()=>{
    const timer=window.setInterval(()=>{
      const next=brazilDayKey(new Date())
      if(next!==day){setDay(next);setStore(readStore(next));setSelected(null);setDraft('');setShowTranscript(false)}
    },30_000)
    return()=>window.clearInterval(timer)
  },[day])
  useEffect(()=>()=>{
    window.speechSynthesis?.cancel()
    if(recorder.current?.state==='recording')recorder.current.stop()
    if(recordingUrlRef.current)URL.revokeObjectURL(recordingUrlRef.current)
  },[])

  const record=selected?store.records[selected]:undefined
  const items=selected?dailyItems(selected,day):[]
  const item=record?items[record.index]:undefined
  const submitted=!!(item&&record?.answers[item.id])
  const objective=selected==='reading'||selected==='listening'

  function resetMedia(){
    window.speechSynthesis?.cancel();setShowTranscript(false);setAudioError('')
    if(recordingUrlRef.current){URL.revokeObjectURL(recordingUrlRef.current);recordingUrlRef.current='';setRecordingUrl('')}
  }
  function choose(skill:Skill){if(recording)return;resetMedia();setSelected(skill);setDraft('')}
  function start(skill:Skill){
    resetMedia();setStore(current=>({...current,records:{...current.records,[skill]:newDailyRecord(skill,day)}}))
    setSelected(skill);setDraft('')
  }
  function next(){
    if(!selected||!record||!item||!submitted||record.status!=='active'||record.index>=DAILY_ITEM_COUNT-1)return
    resetMedia();setDraft('')
    setStore(current=>({...current,records:{...current.records,[selected]:{...record,index:record.index+1}}}))
  }
  function submit(){
    if(!selected||!record||!item||submitted||!draft.trim()||recording)return
    const nextRecord=answerDaily(record,item,draft,isObjectiveCorrect(item,draft))
    setStore(current=>({...current,records:{...current.records,[selected]:nextRecord}}))
  }
  function speak(text:string){
    if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){setAudioError('Este navegador não oferece voz sintética. Leia a transcrição.');return}
    window.speechSynthesis.cancel();setAudioError('')
    const voice=new SpeechSynthesisUtterance(text);voice.lang='en-US';voice.rate=.9
    voice.onerror=()=>setAudioError('Não foi possível reproduzir a voz. Leia a transcrição.')
    window.speechSynthesis.speak(voice)
  }
  async function startRecording(){
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setAudioError('Gravação indisponível. Você ainda pode praticar em voz alta.');return}
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:true})
      const media=new MediaRecorder(stream);const chunks:BlobPart[]=[]
      media.ondataavailable=event=>{if(event.data.size)chunks.push(event.data)}
      media.onstop=()=>{
        stream.getTracks().forEach(track=>track.stop());setRecording(false)
        if(chunks.length){if(recordingUrlRef.current)URL.revokeObjectURL(recordingUrlRef.current)
          const url=URL.createObjectURL(new Blob(chunks,{type:media.mimeType||'audio/webm'}))
          recordingUrlRef.current=url;setRecordingUrl(url);setDraft('Praticado com gravação')}
      }
      recorder.current=media;media.start();setRecording(true);setAudioError('')
    }catch{setAudioError('Microfone não disponível ou acesso negado. Pratique em voz alta sem gravar.')}
  }

  return <main className="toefl-page toefl-daily container">
    <nav className="toefl-page__crumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span>/</span><Link to="/exames/toefl">TOEFL</Link><span>/</span><span aria-current="page">Desafios diários</span></nav>
    <header className="toefl-daily__header"><div><p className="toefl-page__eyebrow">Prática diária não oficial</p><h1>Um pouco de inglês, todos os dias</h1><p>Escolha uma habilidade. Cada desafio tem cinco tarefas que mudam a cada dia no horário de Brasília.</p></div><span className="toefl-daily__date">{day.split('-').reverse().join('/')}</span></header>
    <p className="toefl-daily__notice">Os desafios usam tarefas do {TOEFL_PRACTICE_EXAM.title}, conteúdo original do Daydreaming inspirado nos tipos de tarefa do TOEFL iBT. Não fornecem nota TOEFL. O progresso fica somente neste navegador e não gera XP na conta.</p>
    <div className="toefl-daily__layout"><aside className="toefl-daily__skills" aria-label="Escolher habilidade">{skills.map(skill=>{
      const section=practiceSections.find(part=>part.id===skill)!
      const saved=store.records[skill]
      return <button key={skill} type="button" className={selected===skill?'is-selected':''} aria-pressed={selected===skill} onClick={()=>choose(skill)}>
        <span className="toefl-daily__skill-icon" aria-hidden="true">{skill[0].toUpperCase()}</span><span><strong>{section.title}</strong><small>{saved?.status==='completed'?'Concluído hoje':saved?.status==='failed'?'Encerrado hoje':saved?'Em andamento':'Disponível hoje'}</small></span><span aria-hidden="true">→</span>
      </button>
    })}</aside>
    <div className="toefl-daily__main">
      {!selected&&<section className="toefl-daily__welcome"><span className="toefl-daily__welcome-symbol" aria-hidden="true">✦</span><h2>Escolha a habilidade de hoje</h2><p>Reading e Listening corrigem as respostas e usam três sóis. Writing e Speaking ajudam você a praticar sem atribuir nota a textos ou gravações.</p></section>}
      {selected&&!record&&<section className="toefl-daily__start"><p className="toefl-page__eyebrow">{practiceSections.find(part=>part.id===selected)?.title}</p><h2>Seu desafio de hoje</h2><p>{skillDescriptions[selected]}</p><p>Depois de começar, você pode continuar nesta área durante o dia. Ao terminar, um novo desafio estará disponível amanhã.</p><button className="toefl-page__primary" onClick={()=>start(selected)}>Começar {practiceSections.find(part=>part.id===selected)?.title}</button></section>}
      {selected&&record&&record.status!=='active'&&<section className="toefl-daily__result"><p className="toefl-page__eyebrow">{record.status==='completed'?'Desafio concluído':'Desafio encerrado'}</p><h2>{practiceSections.find(part=>part.id===selected)?.title} de hoje</h2>
        {selected==='reading'||selected==='listening'?<p><strong>{record.correct}</strong> acertos em {Object.keys(record.answers).length} questões respondidas.</p>:selected==='writing'?<p><strong>{record.correct}</strong> frases corretas; {Object.keys(record.answers).length} tarefas praticadas.</p>:<p><strong>{Object.keys(record.answers).length}</strong> respostas praticadas, sem correção automática.</p>}
        {record.status==='failed'&&<p>Seus três sóis acabaram. O próximo desafio desta habilidade abre amanhã.</p>}
        <div className="toefl-daily__review"><h3>Revisar respostas</h3>{items.filter(entry=>record.answers[entry.id]).map(entry=><details key={entry.id}><summary>{entry.task} · {entry.prompt}</summary><p>{entry.kind==='response'?'Revise sua resposta com este roteiro: ':isObjectiveCorrect(entry,record.answers[entry.id])?'Resposta correta. ':'Resposta a revisar. '}{answerLabel(entry)}</p></details>)}</div>
        <button className="toefl-page__secondary" onClick={()=>{resetMedia();setSelected(null)}}>Escolher outra habilidade</button></section>}
      {selected&&record&&record.status==='active'&&item&&<section className="toefl-daily__challenge" aria-labelledby="toefl-daily-question"><div className="toefl-daily__meta"><span>{record.index+1} de {DAILY_ITEM_COUNT}</span>{objective&&<span aria-label={`${record.lives} de 3 sóis restantes`}>{'☀'.repeat(record.lives)}{'○'.repeat(3-record.lives)}</span>}</div>
        <div className="toefl-page__progress" aria-label={`${record.index} de ${DAILY_ITEM_COUNT} tarefas concluídas`}><span style={{width:`${record.index/DAILY_ITEM_COUNT*100}%`}}/></div>
        <p className="toefl-page__eyebrow">{item.task}</p>
        {item.kind==='choice'&&item.context&&<div className="toefl-page__passage"><strong>Read the text</strong><p>{item.context}</p></div>}
        {'audio'in item&&item.audio&&<div className="toefl-page__audio"><button type="button" onClick={()=>speak(item.audio!)}>▶ Ouvir voz sintética</button><button type="button" aria-expanded={showTranscript} onClick={()=>setShowTranscript(value=>!value)}>{showTranscript?'Ocultar':'Ler'} transcrição</button>{showTranscript&&<p className="toefl-page__transcript">{item.audio}</p>}</div>}
        {audioError&&<p className="toefl-daily__error" role="status">{audioError}</p>}
        <h2 id="toefl-daily-question">{item.prompt}</h2>
        {item.kind==='choice'&&<fieldset className="toefl-page__options" disabled={submitted}><legend>Escolha uma resposta</legend>{item.options.map((option,index)=><label key={index} className={draft===String(index)||submitted&&record.answers[item.id]===String(index)?'is-selected':''}><input type="radio" name={item.id} checked={submitted?record.answers[item.id]===String(index):draft===String(index)} onChange={()=>setDraft(String(index))}/><span>{String.fromCharCode(65+index)}</span>{option}</label>)}</fieldset>}
        {item.kind==='sentence'&&<div className="toefl-page__sentence"><p>Organize os blocos:</p><div className="toefl-page__words">{item.words.map((word,index)=><button key={index} type="button" disabled={submitted||draft.split('|').includes(String(index))} onClick={()=>setDraft(current=>[current,String(index)].filter(Boolean).join('|'))}>{word}</button>)}</div><div className="toefl-page__assembled"><strong>Sua frase:</strong> {(submitted?record.answers[item.id]:draft).split('|').filter(Boolean).map(index=>item.words[Number(index)]).join(' ')||'Selecione os blocos.'}</div><button type="button" className="toefl-page__text-button" disabled={submitted} onClick={()=>setDraft('')}>Limpar frase</button></div>}
        {item.kind==='response'&&selected==='writing'&&<label className="toefl-page__writing">Your response<textarea value={submitted?record.answers[item.id]:draft} disabled={submitted} onChange={event=>setDraft(event.target.value)} rows={7} spellCheck={false} placeholder="Write in English…"/><span>{draft.trim()?draft.trim().split(/\s+/).length:0} words · {item.guidance}</span></label>}
        {item.kind==='response'&&selected==='speaking'&&<div className="toefl-page__speaking"><p>{item.guidance}</p><div className="toefl-page__record-actions"><button type="button" disabled={recording||submitted} onClick={()=>void startRecording()}>Gravar resposta</button><button type="button" disabled={!recording} onClick={()=>recorder.current?.stop()}>Parar gravação</button></div>{recording&&<p role="status">Gravando neste navegador…</p>}{recordingUrl&&<audio controls src={recordingUrl} aria-label="Ouvir sua resposta"/>}<button type="button" className="toefl-page__text-button" disabled={recording||submitted} onClick={()=>setDraft('Praticado em voz alta')}>Pratiquei sem gravar</button></div>}
        {submitted&&<div className={`toefl-daily__feedback ${item.kind!=='response'&&isObjectiveCorrect(item,record.answers[item.id])?'is-correct':''}`} role="status"><strong>{item.kind==='response'?'Prática registrada':isObjectiveCorrect(item,record.answers[item.id])?'Boa resposta!':'Vale revisar'}</strong><p>{item.kind==='response'?item.guidance:answerLabel(item)}</p></div>}
        <div className="toefl-daily__actions">{!submitted?<button className="toefl-page__primary" disabled={!draft.trim()||recording} onClick={submit}>Concluir tarefa</button>:<button className="toefl-page__primary" onClick={next}>Próxima tarefa →</button>}</div>
      </section>}
    </div></div>
    <p className="toefl-page__footnote">A virada diária segue o horário de Brasília. Apagar os dados deste navegador remove o progresso local. Respostas abertas e fala não são avaliadas automaticamente.</p>
  </main>
}
