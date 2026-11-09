import { useEffect, useRef, useState } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { practiceSections, TOEFL_PRACTICE_EXAM, type PracticeItem } from '../data/toeflPractice'
import { isObjectiveCorrect, practiceReport, type PracticeAnswers } from '../lib/toeflPractice'
import './ToeflPage.css'

type Progress = { phase:'intro'|'exam'|'results'; section:number; item:number; answers:PracticeAnswers; deadline:number }
const key='daydreaming-toefl-practice-v1'
const initial:Progress={phase:'intro',section:0,item:0,answers:{},deadline:0}

function loadProgress():Progress {
  try {
    const saved=sessionStorage.getItem(key)
    if(!saved)return initial
    const value=JSON.parse(saved) as Progress
    if(!['intro','exam','results'].includes(value.phase)||!Number.isInteger(value.section)||value.section<0||value.section>=practiceSections.length||
      !Number.isInteger(value.item)||value.item<0||value.item>=practiceSections[value.section].items.length||
      !value.answers||typeof value.answers!=='object'||!Number.isFinite(value.deadline))return initial
    return value
  }catch{return initial}
}

function formatTime(seconds:number){return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`}
function currentAnswer(item:PracticeItem,answers:PracticeAnswers){return answers[item.id]||''}

export function ToeflPage(){
  useDocumentTitle(`${TOEFL_PRACTICE_EXAM.title} de inglês no formato TOEFL | Daydreaming`)
  const [progress,setProgress]=useState<Progress>(loadProgress)
  const [showResult,setShowResult]=useState(false)
  const [now,setNow]=useState(0)
  const [audioError,setAudioError]=useState('')
  const [recording,setRecording]=useState(false)
  const [recordingFor,setRecordingFor]=useState('')
  const [showTranscript,setShowTranscript]=useState(false)
  const recorder=useRef<MediaRecorder|null>(null)
  const recordings=useRef<Record<string,string>>({})
  const [recordingUrls,setRecordingUrls]=useState<Record<string,string>>({})

  useEffect(()=>{try{sessionStorage.setItem(key,JSON.stringify(progress))}catch{/* Private browsing can disable storage. */}},[progress])
  useEffect(()=>{
    if(progress.phase!=='exam')return
    const timer=window.setInterval(()=>{
      const tick=Date.now()
      setNow(tick)
      if(tick>=progress.deadline){
        window.speechSynthesis?.cancel()
        if(recorder.current?.state==='recording')recorder.current.stop()
        setShowTranscript(false)
        if(progress.section===practiceSections.length-1)setShowResult(true)
        setProgress(current=>{
          if(current.phase!=='exam'||current.deadline>tick)return current
          if(current.section===practiceSections.length-1)return {...current,phase:'results'}
          const next=current.section+1
          return {...current,section:next,item:0,deadline:tick+practiceSections[next].minutes*60_000}
        })
      }
    },1000)
    return()=>window.clearInterval(timer)
  },[progress.phase,progress.deadline,progress.section])
  useEffect(()=>()=>{window.speechSynthesis?.cancel();recorder.current?.stop();Object.values(recordings.current).forEach(url=>URL.revokeObjectURL(url))},[])
  const section=practiceSections[progress.section]
  const item=section.items[progress.item]
  const remaining=progress.phase==='exam'&&now>0?Math.max(0,Math.ceil((progress.deadline-now)/1000)):section.minutes*60

  function updateAnswer(value:string){setProgress(current=>({...current,answers:{...current.answers,[item.id]:value}}))}
  function begin(){Object.values(recordings.current).forEach(url=>URL.revokeObjectURL(url));recordings.current={};setRecordingUrls({})
    setShowResult(false)
    setProgress({phase:'exam',section:0,item:0,answers:{},deadline:Date.now()+practiceSections[0].minutes*60_000});setNow(Date.now())}
  function move(delta:number){
    window.speechSynthesis?.cancel();setAudioError('');setShowTranscript(false)
    setProgress(current=>({...current,item:Math.max(0,Math.min(section.items.length-1,current.item+delta))}))
  }
  function endSection(){
    const unanswered=section.items.filter(entry=>!progress.answers[entry.id]?.trim()).length
    if(unanswered>0&&!window.confirm(`Há ${unanswered} ${unanswered===1?'item sem resposta':'itens sem resposta'} nesta seção. Avançar mesmo assim?`))return
    window.speechSynthesis?.cancel();setAudioError('');setShowTranscript(false)
    if(progress.section===practiceSections.length-1){setShowResult(true);setProgress(current=>({...current,phase:'results'}))}
    else {const next=progress.section+1;setProgress(current=>({...current,section:next,item:0,deadline:Date.now()+practiceSections[next].minutes*60_000}));setNow(Date.now())}
  }
  function speak(text:string){
    if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){setAudioError('Seu navegador não oferece leitura em voz. Abra a transcrição abaixo.');return}
    setAudioError('');window.speechSynthesis.cancel()
    const utterance=new SpeechSynthesisUtterance(text)
    utterance.lang='en-US';utterance.rate=.9
    utterance.onerror=()=>setAudioError('Não foi possível reproduzir a voz neste navegador. Use a transcrição abaixo.')
    window.speechSynthesis.speak(utterance)
  }
  async function startRecording(){
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setAudioError('Gravação indisponível neste navegador. Pratique em voz alta e marque o item como praticado.');return}
    try {
      const targetId=item.id
      const stream=await navigator.mediaDevices.getUserMedia({audio:true})
      const media=new MediaRecorder(stream);const chunks:BlobPart[]=[]
      media.ondataavailable=event=>{if(event.data.size)chunks.push(event.data)}
      media.onstop=()=>{
        stream.getTracks().forEach(track=>track.stop())
        if(chunks.length){const old=recordings.current[targetId];if(old)URL.revokeObjectURL(old)
          const url=URL.createObjectURL(new Blob(chunks,{type:media.mimeType||'audio/webm'}))
          recordings.current[targetId]=url
          setRecordingUrls(current=>({...current,[targetId]:url}))
          setProgress(current=>({...current,answers:{...current.answers,[targetId]:'Praticado com gravação'}}))}
        setRecording(false);setRecordingFor('')
      }
      recorder.current=media;setRecordingFor(targetId);setRecording(true);setAudioError('');media.start()
    }catch{setAudioError('Microfone não disponível ou acesso negado. Você pode praticar em voz alta sem gravar.')}
  }
  function stopRecording(){if(recorder.current?.state==='recording')recorder.current.stop()}

  if(progress.phase==='intro'||(progress.phase==='results'&&!showResult))return <main className="toefl-page container">
    <nav className="toefl-page__crumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span>/</span><span aria-current="page">TOEFL · {TOEFL_PRACTICE_EXAM.title}</span></nav>
    <header className="toefl-page__hero"><div><p className="toefl-page__eyebrow">{TOEFL_PRACTICE_EXAM.title} · prática original no formato TOEFL iBT 2026</p>
      <h1>{TOEFL_PRACTICE_EXAM.title}: pratique as quatro habilidades</h1>
      <p>Este é o primeiro simulado da coleção, com {TOEFL_PRACTICE_EXAM.totalItems} tarefas de Reading, Listening, Writing e Speaking. O conteúdo foi criado pelo Daydreaming e não pertence à ETS.</p>
      <div className="toefl-page__hero-actions"><button className="toefl-page__primary" onClick={begin}>{progress.phase==='results'?'Refazer':'Iniciar'} {TOEFL_PRACTICE_EXAM.title}</button><Link className="toefl-page__hero-secondary" to="/exames/toefl/desafio-diario">Escolher desafio diário</Link></div></div>
      <div className="toefl-page__hero-mark" aria-hidden="true"><span>R</span><span>L</span><span>W</span><span>S</span></div></header>
    {progress.phase==='results'&&<section className="toefl-page__previous-result" aria-label="Resultado anterior"><div><strong>Você já concluiu o {TOEFL_PRACTICE_EXAM.title} nesta aba.</strong><p>Seu relatório continua disponível para consulta enquanto esta sessão estiver aberta.</p></div><button type="button" className="toefl-page__secondary" onClick={()=>setShowResult(true)}>Ver último resultado</button></section>}
    <section className="toefl-page__intro" aria-labelledby="toefl-structure"><h2 id="toefl-structure">Como funciona o {TOEFL_PRACTICE_EXAM.title}</h2>
      <p>Quer praticar em menos tempo? No <Link to="/exames/toefl/desafio-diario">desafio diário</Link>, você escolhe Reading, Listening, Writing ou Speaking e faz cinco tarefas por área.</p>
      <div className="toefl-page__structure">{practiceSections.map((part,index)=><div key={part.id}><b>{String(index+1).padStart(2,'0')}</b><h3>{part.title}</h3><p>{part.items.length} itens · {part.minutes} min</p></div>)}</div>
      <p>As tarefas seguem os tipos publicados pela <a href="https://www.ets.org/toefl/test-takers/ibt/about/content.html" target="_blank" rel="noopener noreferrer">ETS para o TOEFL iBT atualizado</a>. Esta versão é linear, sem adaptação de dificuldade. Áudios usam uma voz sintética do navegador; gravações de fala ficam somente nesta sessão.</p>
      <p><strong>Resultado:</strong> mostramos acertos nas tarefas objetivas e um roteiro para revisar escrita e fala. Não calculamos a pontuação oficial de 1 a 6 nem prometemos equivalência com o exame real.</p>
      <p>Suas respostas são guardadas apenas nesta aba durante a sessão. Ao fechá-la, o progresso é apagado. As gravações não são enviadas nem salvas.</p>
    </section>
  </main>

  if(progress.phase==='results'){
    const report=practiceReport(progress.answers)
    return <main className="toefl-page container"><nav className="toefl-page__crumb"><Link to="/exames">Exames</Link><span>/</span><span aria-current="page">{TOEFL_PRACTICE_EXAM.title} · resultado</span></nav>
      <header className="toefl-page__result-head"><p className="toefl-page__eyebrow">{TOEFL_PRACTICE_EXAM.title} concluído</p><h1>Seu relatório do {TOEFL_PRACTICE_EXAM.title}</h1><p>Este resultado descreve apenas seu desempenho neste simulado original. Não é uma nota TOEFL, uma certificação ou uma previsão da nota oficial.</p></header>
      <div className="toefl-page__report">{report.map(part=><section key={part.skill}><h2>{part.title}</h2>{part.total>0?<><strong>{part.correct} de {part.total}</strong><p>acertos em tarefas objetivas · {part.attempted} respondidas</p>{part.openTotal>0&&<p>{part.completed} de {part.openTotal} tarefas abertas praticadas, sem nota automática</p>}</>:<><strong>{part.completed} de {part.openTotal}</strong><p>tarefas abertas praticadas · avaliação pessoal, sem nota automática</p></>}</section>)}</div>
      <section className="toefl-page__review"><h2>O que revisar agora</h2><p>Reveja as questões objetivas que você errou ou deixou em branco. Para escrita, confira clareza, organização, gramática e se respondeu ao pedido. Para fala, ouça sua gravação quando disponível e observe inteligibilidade, desenvolvimento da ideia e fluidez.</p>
        <div className="toefl-page__review-list">{practiceSections.flatMap(part=>part.items.filter(entry=>entry.kind!=='response'&&!isObjectiveCorrect(entry,progress.answers[entry.id]||'')).map(entry=><details key={entry.id}><summary>{part.title} · {entry.prompt}</summary><p>{entry.kind==='choice'?`Resposta: ${entry.options[entry.answer]}. ${entry.explanation}`:entry.kind==='sentence'?`Resposta sugerida: ${entry.answer}`:''}</p></details>))}</div>
        <p>Informações sobre a prova oficial e a escala de notas: <a href="https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.htm.html" target="_blank" rel="noopener noreferrer">ETS — Understanding TOEFL Scores</a>.</p>
        <div className="toefl-page__result-actions"><button className="toefl-page__primary" onClick={begin}>Refazer o {TOEFL_PRACTICE_EXAM.title}</button><button className="toefl-page__secondary" onClick={()=>setShowResult(false)}>Voltar à apresentação</button></div></section>
    </main>
  }

  const answer=currentAnswer(item,progress.answers)
  const completed=section.items.filter(entry=>progress.answers[entry.id]?.trim()).length
  return <main className="toefl-page container">
    <nav className="toefl-page__crumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span>/</span><span aria-current="page">TOEFL · {TOEFL_PRACTICE_EXAM.title}</span></nav>
    <header className="toefl-page__exam-head"><div><p className="toefl-page__eyebrow">{TOEFL_PRACTICE_EXAM.title} · simulado não oficial</p><h1>{section.title}</h1><p>{item.task} · item {progress.item+1} de {section.items.length}</p></div>
      <div className="toefl-page__timer" aria-live="off" aria-label={`Tempo restante: ${Math.floor(remaining/60)} minutos e ${remaining%60} segundos`}>{formatTime(remaining)}</div></header>
    <div className="toefl-page__progress" aria-label={`${completed} de ${section.items.length} itens respondidos nesta seção`}><span style={{width:`${completed/section.items.length*100}%`}} /></div>
    <nav className="toefl-page__steps" aria-label="Seções do simulado">{practiceSections.map((part,index)=><span key={part.id} className={index===progress.section?'is-current':index<progress.section?'is-done':''}>{index+1}. {part.title}</span>)}</nav>
    <section className="toefl-page__question" aria-labelledby="toefl-question-title">
      <p className="toefl-page__eyebrow">{item.task}</p>
      {item.kind==='choice'&&item.context&&<div className="toefl-page__passage"><strong>Read the text</strong><p>{item.context}</p></div>}
      {'audio'in item&&item.audio&&<div className="toefl-page__audio"><button type="button" onClick={()=>speak(item.audio!)}>▶ Ouvir voz sintética</button><button type="button" onClick={()=>setShowTranscript(value=>!value)} aria-expanded={showTranscript}>{showTranscript?'Ocultar':'Ler'} transcrição</button>
        {showTranscript&&<p className="toefl-page__transcript">{item.audio}</p>}{audioError&&<p role="status">{audioError}</p>}</div>}
      <h2 id="toefl-question-title">{item.prompt}</h2>
      {item.kind==='choice'&&<fieldset className="toefl-page__options"><legend>Selecione uma resposta</legend>{item.options.map((option,index)=><label key={index} className={answer===String(index)?'is-selected':''}><input type="radio" name={item.id} checked={answer===String(index)} onChange={()=>updateAnswer(String(index))}/><span>{String.fromCharCode(65+index)}</span>{option}</label>)}</fieldset>}
      {item.kind==='sentence'&&<div className="toefl-page__sentence"><p>Monte a frase selecionando os blocos na ordem correta:</p><div className="toefl-page__words">{item.words.map((word,index)=><button key={index} type="button" disabled={answer.split('|').includes(String(index))} onClick={()=>updateAnswer([answer,String(index)].filter(Boolean).join('|'))}>{word}</button>)}</div><div className="toefl-page__assembled"><strong>Sua frase:</strong> {answer.split('|').filter(Boolean).map(index=>item.words[Number(index)]).join(' ')||'Selecione os blocos acima.'}</div><button type="button" className="toefl-page__text-button" onClick={()=>updateAnswer('')}>Limpar frase</button></div>}
      {item.kind==='response'&&section.id==='writing'&&<label className="toefl-page__writing">Your response<textarea value={answer} onChange={event=>updateAnswer(event.target.value)} rows={9} spellCheck={false} placeholder="Write your answer in English…"/><span>{answer.trim()?answer.trim().split(/\s+/).length:0} words</span></label>}
      {item.kind==='response'&&section.id==='speaking'&&<div className="toefl-page__speaking"><p>{item.guidance}</p><div className="toefl-page__record-actions"><button type="button" disabled={recording} onClick={()=>void startRecording()}>Gravar resposta</button><button type="button" disabled={!recording} onClick={stopRecording}>Parar gravação</button></div>
        {recording&&recordingFor===item.id&&<p role="status">Gravando no seu navegador…</p>}
        {recordingUrls[item.id]&&<audio controls src={recordingUrls[item.id]} aria-label="Sua resposta gravada"/>}
        <button type="button" className="toefl-page__text-button" onClick={()=>updateAnswer('Praticado em voz alta')}>Pratiquei em voz alta sem gravar</button>
        {answer&&<p className="toefl-page__saved" role="status">Tarefa marcada como praticada.</p>}</div>}
      {item.kind==='response'&&section.id==='writing'&&<p className="toefl-page__guidance">{item.guidance}</p>}
    </section>
    <div className="toefl-page__actions"><button type="button" className="toefl-page__secondary" disabled={progress.item===0||recording} onClick={()=>move(-1)}>← Anterior</button>
      {progress.item<section.items.length-1?<button type="button" className="toefl-page__primary" disabled={recording} onClick={()=>move(1)}>Próximo item →</button>
        :<button type="button" className="toefl-page__primary" disabled={recording} onClick={endSection}>{progress.section===practiceSections.length-1?'Ver relatório':'Próxima seção'} →</button>}</div>
    <p className="toefl-page__footnote">Conteúdo original Daydreaming inspirado nos tipos de tarefa do TOEFL iBT. Sem vínculo com a ETS. Respostas abertas e fala não recebem correção automática.</p>
  </main>
}
