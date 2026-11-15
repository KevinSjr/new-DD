import { useEffect, useRef, useState } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { deleExams, findDeleExam, type DeleExam } from '../data/delePractice'
import './DelfDalfPage.css'

type Progress = { phase:'intro'|'preparation'|'exam'|'results'; section:number; item:number; deadline:number; answers:Record<string,string> }
const fresh=():Progress=>({phase:'intro',section:0,item:0,deadline:0,answers:{}})
function storageKey(level:string){return 'daydreaming-dele-'+level.toLowerCase()+'-v1'}
function load(level:string,exam:DeleExam):Progress{
  try{
    const value=JSON.parse(sessionStorage.getItem(storageKey(level))||'null') as Progress|null
    if(value&&['intro','preparation','exam','results'].includes(value.phase)&&Number.isInteger(value.section)&&value.section>=0&&value.section<exam.sections.length&&Number.isInteger(value.item)&&value.item>=0&&value.item<exam.sections[value.section].items.length&&typeof value.deadline==='number'&&value.answers&&typeof value.answers==='object')return value
  }catch{/* Storage can be unavailable. */}
  return fresh()
}
function clock(seconds:number){return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')}

export function DelePage(){
  useDocumentTitle('Simulados DELE | Daydreaming')
  return <main className="french-page container">
    <nav className="french-page__crumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span>/</span><span aria-current="page">DELE</span></nav>
    <header className="french-page__hero"><div><p className="french-page__eyebrow">Prática de espanhol · A1 a C2</p><h1>Escolha seu nível DELE</h1><p>Seis simulados autorais para praticar compreensão, escrita e fala. Cada Exame 1 usa a contagem de itens e os tempos de referência do nível correspondente.</p></div><div className="french-page__hero-art" aria-hidden="true"><span>ES</span><b>A1 → C2</b></div></header>
    <p className="french-page__notice"><strong>Estes não são exames oficiais do DELE.</strong> O conteúdo foi criado pelo Daydreaming e é uma prática inspirada no formato do Instituto Cervantes. Os documentos são mais curtos, o áudio usa voz sintética e a fala não tem examinador. Não emitimos nota oficial nem diploma.</p>
    <section className="french-page__levels" aria-labelledby="dele-levels"><div className="french-page__section-head"><p className="french-page__eyebrow">Exames gerais para adultos</p><h2 id="dele-levels">Escolha o Exame 1</h2><p>Consulte a instituição de destino para saber qual nível é exigido.</p></div><div className="french-page__grid">{deleExams.map(exam=>{
      const objective=exam.sections.filter(section=>section.kind==='reading'||section.kind==='listening'||section.kind==='integrated').reduce((sum,section)=>sum+section.items.length,0)
      const minutes=exam.sections.reduce((sum,section)=>sum+section.minutes+(section.preparationMinutes||0),0)
      return <article className="french-page__level" key={exam.level}><div className="french-page__level-top"><span className="french-page__level-badge">{exam.level}</span><span>Exame 1 · {exam.sections.length} provas</span></div><h3>DELE {exam.level}</h3><p>{exam.level==='C2'?'Compreensão e uso da língua em uma prova integrada, além de escrita e fala.':'Leitura, compreensão auditiva, escrita e fala.'}</p><div className="french-page__level-meta"><span>{objective} itens objetivos</span><span>{minutes} min com preparação oral</span></div><Link className="french-page__primary" to={'/exames/dele/'+exam.level.toLowerCase()}>Abrir DELE {exam.level} →</Link></article>
    })}</div></section>
    <p className="french-page__source">Estrutura: <a href="https://examenes.cervantes.es/es/dele/que-es" target="_blank" rel="noopener noreferrer">Instituto Cervantes</a>. Cada nível apresenta a fonte específica da prova. Consulta em 15/11/2026.</p>
  </main>
}

export function DeleExamPage({level}:{level:string}){
  const exam=findDeleExam(level)
  if(!exam)return null
  return <DeleExam key={exam.level} exam={exam}/>
}

function DeleExam({exam}:{exam:DeleExam}){
  useDocumentTitle(exam.title+' | Daydreaming')
  const [progress,setProgress]=useState<Progress>(()=>load(exam.level,exam))
  const [now,setNow]=useState(Date.now())
  const [transcript,setTranscript]=useState(false)
  const [audioError,setAudioError]=useState('')
  const [recording,setRecording]=useState(false)
  const [recordings,setRecordings]=useState<Record<string,string>>({})
  const recorder=useRef<MediaRecorder|null>(null)
  const streams=useRef<MediaStream|null>(null)
  const urls=useRef<string[]>([])
  const section=exam.sections[progress.section]
  const item=section.items[progress.item]
  const value=progress.answers[item.id]||''
  const remaining=Math.max(0,Math.ceil((progress.deadline-now)/1000))

  useEffect(()=>{try{sessionStorage.setItem(storageKey(exam.level),JSON.stringify(progress))}catch{/* Continue without storage. */}},[exam.level,progress])
  useEffect(()=>{
    if(progress.phase!=='exam'&&progress.phase!=='preparation')return
    const timer=window.setInterval(()=>setNow(Date.now()),1000)
    return()=>clearInterval(timer)
  },[progress.phase])
  useEffect(()=>{
    if((progress.phase!=='exam'&&progress.phase!=='preparation')||now<progress.deadline)return
    window.speechSynthesis?.cancel()
    if(recorder.current?.state==='recording')recorder.current.stop()
    setProgress(current=>{
      if(current.phase==='preparation')return {...current,phase:'exam',deadline:Date.now()+exam.sections[current.section].minutes*60_000}
      if(current.phase!=='exam')return current
      if(current.section===exam.sections.length-1)return {...current,phase:'results'}
      const next=current.section+1;const oral=exam.sections[next].kind==='speaking'
      return {...current,section:next,item:0,phase:oral?'preparation':'exam',deadline:Date.now()+(oral?exam.sections[next].preparationMinutes||0:exam.sections[next].minutes)*60_000}
    })
    setTranscript(false)
  },[now,progress.phase,progress.deadline,exam])
  useEffect(()=>()=>{window.speechSynthesis?.cancel();if(recorder.current?.state==='recording')recorder.current.stop();streams.current?.getTracks().forEach(track=>track.stop());urls.current.forEach(url=>URL.revokeObjectURL(url))},[])

  function start(){
    window.speechSynthesis?.cancel();urls.current.forEach(url=>URL.revokeObjectURL(url));urls.current=[];setRecordings({});setTranscript(false);setAudioError('')
    const tick=Date.now();setNow(tick);setProgress({phase:'exam',section:0,item:0,deadline:tick+exam.sections[0].minutes*60_000,answers:{}})
  }
  function advance(){
    if(recording)return
    const unanswered=section.items.filter(entry=>!progress.answers[entry.id]?.trim()).length
    if(unanswered>0&&!window.confirm('Há '+unanswered+' '+(unanswered===1?'item sem resposta':'itens sem resposta')+' nesta prova. Avançar mesmo assim?'))return
    window.speechSynthesis?.cancel();setTranscript(false);setAudioError('')
    if(progress.section===exam.sections.length-1){setProgress(current=>({...current,phase:'results'}));return}
    const next=progress.section+1;const nextSection=exam.sections[next];const oral=nextSection.kind==='speaking';const tick=Date.now();setNow(tick)
    setProgress(current=>({...current,section:next,item:0,phase:oral?'preparation':'exam',deadline:tick+(oral?nextSection.preparationMinutes||0:nextSection.minutes)*60_000}))
  }
  function speak(){
    if(!item.audio||!('speechSynthesis' in window)){setAudioError('A síntese de voz não está disponível neste navegador. Use a transcrição acessível.');return}
    window.speechSynthesis.cancel()
    const utterance=new SpeechSynthesisUtterance(item.audio);utterance.lang='es-ES';utterance.rate=exam.level==='A1'||exam.level==='A2'?.86:1
    const spanish=window.speechSynthesis.getVoices().find(voice=>voice.lang.toLowerCase().startsWith('es'))
    if(spanish)utterance.voice=spanish
    utterance.onerror=()=>setAudioError('Não foi possível reproduzir a voz. Use a transcrição acessível.')
    window.speechSynthesis.speak(utterance);setAudioError('')
  }
  async function startRecording(){
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setAudioError('Microfone indisponível. Pratique em voz alta e marque a tarefa como praticada.');return}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});streams.current=stream
      const media=new MediaRecorder(stream);const chunks:BlobPart[]=[];const id=item.id
      media.ondataavailable=event=>{if(event.data.size)chunks.push(event.data)}
      media.onstop=()=>{stream.getTracks().forEach(track=>track.stop());streams.current=null;setRecording(false)
        if(chunks.length){const url=URL.createObjectURL(new Blob(chunks,{type:media.mimeType||'audio/webm'}));urls.current.push(url);setRecordings(current=>({...current,[id]:url}));setProgress(current=>({...current,answers:{...current.answers,[id]:'Praticado com gravação'}}))}
      }
      recorder.current=media;media.start();setRecording(true);setAudioError('')
    }catch{setAudioError('Não foi possível acessar o microfone. Você pode praticar sem gravar.')}
  }

  if(progress.phase==='intro')return <main className="french-page container"><nav className="french-page__crumb"><Link to="/exames/dele">DELE</Link><span>/</span><span aria-current="page">{exam.level}</span></nav>
    <header className="french-page__hero"><div><p className="french-page__eyebrow">Simulado autoral · Exame 1</p><h1>DELE {exam.level}</h1><p>Pratique as provas do nível {exam.level} com contagem de itens e cronômetros alinhados à estrutura publicada pelo Instituto Cervantes.</p><button className="french-page__primary" type="button" onClick={start}>Iniciar Exame 1</button></div><div className="french-page__hero-art" aria-hidden="true"><span>{exam.level}</span><b>Español</b></div></header>
    <section className="french-page__details"><h2>Como será a prática</h2><div className="french-page__steps">{exam.sections.map((part,index)=><div key={part.id}><span>{String(index+1).padStart(2,'0')}</span><h3>{part.title}</h3><p>{part.taskSizes.length} tarefas · {part.items.length} {part.items.length===1?'item':'itens'} · {part.minutes} min{part.preparationMinutes?' + '+part.preparationMinutes+' min de preparação':''}</p></div>)}</div>
      <p><strong>Adaptação:</strong> os documentos são curtos e originais. A compreensão auditiva usa voz sintética e oferece transcrição para acessibilidade. Escrita e fala exigem avaliação humana; o relatório não calcula pontos oficiais nem declara aprovação. O exame real pode agendar a prova oral em outro momento.</p>
      <p>Respostas escritas ficam apenas nesta aba do navegador. As gravações não são enviadas ou salvas e desaparecem ao recarregar. <a href={exam.sourceUrl} target="_blank" rel="noopener noreferrer">Veja a estrutura do DELE {exam.level} no Instituto Cervantes</a>.</p>
    </section></main>

  if(progress.phase==='results'){
    const objective=exam.sections.filter(part=>part.kind!=='writing'&&part.kind!=='speaking')
    return <main className="french-page container"><nav className="french-page__crumb"><Link to="/exames/dele">DELE</Link><span>/</span><span aria-current="page">Relatório {exam.level}</span></nav><header className="french-page__result-head"><p className="french-page__eyebrow">Exame 1 concluído</p><h1>Seu relatório de prática</h1><p>Simulado inspirado no DELE {exam.level}. Os acertos abaixo não equivalem à nota oficial nem comprovam proficiência.</p></header>
      <div className="french-page__report">{exam.sections.map(part=>{const choice=part.items.filter(entry=>entry.kind==='choice');const correct=choice.filter(entry=>progress.answers[entry.id]===String(entry.answer)).length;const practiced=part.items.filter(entry=>!!progress.answers[entry.id]?.trim()).length;return <section key={part.id}><h2>{part.title}</h2><p><strong>{choice.length?correct+' / '+choice.length:practiced+' / '+part.items.length}</strong></p><p>{choice.length?'acertos objetivos · '+practiced+' respondidas':'tarefas praticadas · avaliação humana necessária'}</p></section>})}</div>
      <section className="french-page__review"><h2>Revisar respostas</h2><p>{objective.reduce((sum,part)=>sum+part.items.filter(entry=>progress.answers[entry.id]===String(entry.answer)).length,0)} acertos objetivos no total. Revise documentos e respostas abertas antes de tentar novamente.</p>{exam.sections.flatMap(part=>part.items.map(entry=>({part,entry}))).map(({part,entry})=><details key={entry.id}><summary>{part.title} · tarefa {entry.task} · {entry.kind==='choice'?progress.answers[entry.id]===String(entry.answer)?'correta':'revisar':progress.answers[entry.id]?'praticada':'não praticada'}</summary><p>{entry.prompt}</p>{entry.kind==='choice'?<><p><strong>Sua resposta:</strong> {progress.answers[entry.id]===undefined?'Em branco':entry.options?.[Number(progress.answers[entry.id])]}</p><p><strong>Gabarito:</strong> {entry.options?.[entry.answer!]}</p><p>{entry.context}</p></>:<><p>{entry.review}</p>{entry.kind==='writing'&&progress.answers[entry.id]&&<blockquote className="french-page__own-answer">{progress.answers[entry.id]}</blockquote>}{entry.kind==='speaking'&&recordings[entry.id]&&<audio controls src={recordings[entry.id]} aria-label="Sua gravação"/>}</>}</details>)}<div className="french-page__actions"><button className="french-page__primary" type="button" onClick={start}>Refazer Exame 1</button><Link className="french-page__secondary" to="/exames/dele">Escolher outro nível</Link></div></section>
    </main>
  }

  if(progress.phase==='preparation')return <main className="french-page container"><nav className="french-page__crumb"><Link to="/exames/dele">DELE</Link><span>/</span><span aria-current="page">Preparação oral</span></nav><header className="french-page__exam-head"><div><p className="french-page__eyebrow">DELE {exam.level} · Exame 1</p><h1>Preparação da prova oral</h1><p>Leia as tarefas e organize suas respostas antes de falar.</p></div><span className="french-page__timer" aria-label={'Tempo restante: '+clock(remaining)}>{clock(remaining)}</span></header><section className="french-page__task"><h2>Temas da prova</h2>{section.items.map(entry=><div className="french-page__context" key={entry.id}><strong>Tarefa {entry.task}</strong><p>{entry.prompt}</p></div>)}</section><div className="french-page__actions"><button className="french-page__primary" type="button" onClick={()=>{const tick=Date.now();setNow(tick);setProgress(current=>({...current,phase:'exam',deadline:tick+section.minutes*60_000}))}}>Começar prova oral →</button></div></main>

  const completed=section.items.filter(entry=>!!progress.answers[entry.id]?.trim()).length
  return <main className="french-page container"><nav className="french-page__crumb"><Link to="/exames/dele">DELE</Link><span>/</span><span aria-current="page">{exam.level} · Exame 1</span></nav><header className="french-page__exam-head"><div><p className="french-page__eyebrow">Prática não oficial · DELE {exam.level}</p><h1>{section.title}</h1><p>Tarefa {item.task} de {section.taskSizes.length} · item {progress.item+1} de {section.items.length}</p></div><span className="french-page__timer" aria-label={'Tempo restante: '+clock(remaining)}>{clock(remaining)}</span></header><div className="french-page__progress" role="progressbar" aria-label="Itens respondidos nesta prova" aria-valuemin={0} aria-valuemax={section.items.length} aria-valuenow={completed}><span style={{width:completed/section.items.length*100+'%'}}/></div><div className="french-page__section-nav" aria-label="Provas do simulado">{exam.sections.map((part,index)=><span className={index===progress.section?'is-current':index<progress.section?'is-done':''} key={part.id}>{index+1}. {part.title}</span>)}</div>
    <section className="french-page__task" aria-labelledby="dele-item-title"><p className="french-page__eyebrow">Tarefa {item.task}</p>{item.audio?<div className="french-page__audio"><button type="button" onClick={speak}>▶ Ouvir voz sintética</button><button type="button" aria-expanded={transcript} onClick={()=>setTranscript(current=>!current)}>{transcript?'Ocultar':'Ler'} transcrição</button>{transcript&&<p>{item.audio}</p>}</div>:<div className="french-page__context"><strong>{item.kind==='choice'?'Documento':'Situação'}</strong><p>{item.context}</p></div>}{audioError&&<p className="french-page__error" role="status">{audioError}</p>}<h2 id="dele-item-title">{item.prompt}</h2>
      {item.kind==='choice'&&<fieldset className="french-page__options"><legend>Escolha uma resposta</legend>{item.options?.map((option,index)=><label key={index} className={value===String(index)?'is-selected':''}><input type="radio" name={item.id} checked={value===String(index)} onChange={()=>setProgress(current=>({...current,answers:{...current.answers,[item.id]:String(index)}}))}/><span>{String.fromCharCode(65+index)}</span>{option}</label>)}</fieldset>}
      {item.kind==='writing'&&<label className="french-page__writing">Sua resposta em espanhol<textarea rows={12} value={value} spellCheck={false} onChange={event=>setProgress(current=>({...current,answers:{...current.answers,[item.id]:event.target.value}}))} placeholder="Escriba su respuesta aquí…"/><span>{value.trim()?value.trim().split(/\s+/).length:0} palavras · texto sem correção automática</span></label>}
      {item.kind==='speaking'&&<div className="french-page__speaking"><p>Responda em espanhol. Você pode gravar ou apenas praticar em voz alta.</p><div className="french-page__actions"><button type="button" className="french-page__secondary" disabled={recording} onClick={()=>void startRecording()}>Gravar resposta</button><button type="button" className="french-page__secondary" disabled={!recording} onClick={()=>recorder.current?.stop()}>Parar gravação</button></div>{recording&&<p role="status">Gravando nesta aba…</p>}{recordings[item.id]&&<audio controls src={recordings[item.id]} aria-label="Ouvir sua resposta"/>}<button type="button" className="french-page__text-button" disabled={recording} onClick={()=>setProgress(current=>({...current,answers:{...current.answers,[item.id]:'Praticado em voz alta'}}))}>Pratiquei sem gravar</button>{value&&<p role="status">Prática registrada.</p>}</div>}
    </section><div className="french-page__actions french-page__navigation"><button type="button" className="french-page__secondary" disabled={progress.item===0||recording} onClick={()=>{window.speechSynthesis?.cancel();setTranscript(false);setProgress(current=>({...current,item:current.item-1}))}}>← Anterior</button>{progress.item<section.items.length-1?<button type="button" className="french-page__primary" disabled={recording} onClick={()=>{window.speechSynthesis?.cancel();setTranscript(false);setProgress(current=>({...current,item:current.item+1}))}}>Próximo item →</button>:<button type="button" className="french-page__primary" disabled={recording} onClick={advance}>{progress.section===exam.sections.length-1?'Ver relatório':'Próxima prova'} →</button>}</div><p className="french-page__footnote">Conteúdo autoral inspirado no DELE. O relógio reproduz o tempo de referência; suas respostas abertas precisam de avaliação humana.</p>
  </main>
}
