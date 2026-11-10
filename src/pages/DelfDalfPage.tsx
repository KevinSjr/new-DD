import { useEffect, useRef, useState } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { findFrenchExam, frenchExams, type FrenchExam } from '../data/delfDalfPractice'
import { frenchSectionReview, newFrenchProgress, nextFrenchSection, validFrenchProgress, wordCount, type FrenchProgress } from '../lib/delfDalfPractice'
import './DelfDalfPage.css'

function storageKey(exam:FrenchExam){return `daydreaming-${exam.id}-progress-v4`}
function loadProgress(exam:FrenchExam):FrenchProgress {
  try {const raw=sessionStorage.getItem(storageKey(exam));const parsed=raw?JSON.parse(raw) as unknown:null
    if(validFrenchProgress(parsed,exam))return parsed
  }catch{/* Session storage may be unavailable. */}
  return newFrenchProgress()
}
function formatTime(seconds:number){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`}
function examHref(exam:FrenchExam){return `/exames/delf-dalf/${exam.id}`}

export function DelfDalfPage(){
  useDocumentTitle('Simulados DELF / DALF | Daydreaming')
  return <main className="french-page container">
    <nav className="french-page__crumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span>/</span><span aria-current="page">DELF / DALF</span></nav>
    <header className="french-page__hero"><div><p className="french-page__eyebrow">Prática de francês</p><h1>Escolha o nível do seu simulado</h1><p>Seis conjuntos originais de treino, de A1 a C2, inspirados nas provas DELF e DALF. Cada nível tem compreensão e produção adequadas à sua estrutura.</p></div><div className="french-page__hero-art" aria-hidden="true"><span>fr</span><b>A1 → C2</b></div></header>
    <p className="french-page__notice"><strong>Prática adaptada, não exame oficial.</strong> A1–B2 seguem a quantidade de exercícios, itens e documentos de compreensão da matriz da France Éducation international. Os textos e áudios são mais curtos e as opções ilustradas são adaptações. C1 e C2 ainda são versões abreviadas. A fala sem examinador não reproduz a aplicação oficial.</p>
    <section className="french-page__levels" aria-labelledby="french-levels-title"><div className="french-page__section-head"><p className="french-page__eyebrow">DELF e DALF · tout public</p><h2 id="french-levels-title">Escolha uma prova para começar</h2><p>Confira o nível exigido pela instituição antes de estudar. Você pode começar diretamente pelo nível que precisa.</p></div>
      <div className="french-page__grid">{frenchExams.map(exam=>{
        const objective=exam.sections.reduce((sum,section)=>sum+section.tasks.filter(task=>task.kind==='choice').length,0)
        return <article className="french-page__level" key={exam.id}><div className="french-page__level-top"><span className="french-page__level-badge">{exam.level}</span><span>{exam.level.startsWith('C')?'DALF':'DELF'} · Exame 1</span></div><h3>{exam.title}</h3><p>{exam.sections.length===2?'Duas provas integradas: compreensão e produção escritas; compreensão e produção orais.':'Quatro habilidades: ouvir, ler, escrever e falar.'}</p><div className="french-page__level-meta"><span>{exam.sections.length} provas</span><span>{objective?`${objective} itens objetivos`:'Produções abertas'}</span></div><Link className="french-page__primary" to={examHref(exam)}>Abrir {exam.title} <span aria-hidden="true">→</span></Link></article>
      })}</div>
    </section>
    <p className="french-page__source">Contagem dos itens A1–B2: <a href="https://www.france-education-international.fr/document/kit-evolutions-dd" target="_blank" rel="noopener noreferrer">documento de evolução das provas da France Éducation international (atualizado em 24/06/2024)</a>, consultado em 09/11/2026. Cada nível também mostra sua fonte de duração e estrutura.</p>
  </main>
}

export function DelfDalfExamPage({examId}:{examId:string}){
  const exam=findFrenchExam(examId)
  if(!exam)return null
  return <ExamView key={exam.id} exam={exam}/>
}

function ExamView({exam}:{exam:FrenchExam}){
  useDocumentTitle(`${exam.title} no estilo DELF / DALF | Daydreaming`)
  const [progress,setProgress]=useState<FrenchProgress>(()=>loadProgress(exam))
  const [showResult,setShowResult]=useState(false)
  const [now,setNow]=useState(0)
  const [transcript,setTranscript]=useState(false)
  const [audioError,setAudioError]=useState('')
  const [recording,setRecording]=useState(false)
  const [recordings,setRecordings]=useState<Record<string,string>>({})
  const recorderRef=useRef<MediaRecorder|null>(null)
  const recordingsRef=useRef<Record<string,string>>({})

  useEffect(()=>{try{sessionStorage.setItem(storageKey(exam),JSON.stringify(progress))}catch{/* Continue without persistence. */}},[exam,progress])
  useEffect(()=>{
    if(progress.phase!=='exam'&&progress.phase!=='preparation')return
    const timer=window.setInterval(()=>{
      const tick=Date.now();setNow(tick)
      if(tick<progress.deadline)return
      window.speechSynthesis?.cancel()
      if(progress.phase==='exam'&&progress.section===exam.sections.length-1)setShowResult(true)
      setProgress(current=>{
        if(current.deadline>tick)return current
        if(current.phase==='preparation')return {...current,phase:'exam',deadline:tick+exam.sections[current.section].minutes*60_000}
        if(current.phase!=='exam')return current
        if(current.section===exam.sections.length-1)return {...current,phase:'results'}
        return {...current,...nextFrenchSection(exam,current.section+1,tick)}
      })
      setTranscript(false)
    },1000)
    return()=>window.clearInterval(timer)
  },[exam,progress.phase,progress.deadline,progress.section])
  useEffect(()=>()=>{window.speechSynthesis?.cancel();if(recorderRef.current?.state==='recording')recorderRef.current.stop();Object.values(recordingsRef.current).forEach(url=>URL.revokeObjectURL(url))},[])

  const section=exam.sections[progress.section]
  const task=section.tasks[progress.task]
  const answer=progress.answers[task.id]||''
  const remaining=(progress.phase==='exam'||progress.phase==='preparation')&&now>0?Math.max(0,Math.ceil((progress.deadline-now)/1000)):(progress.phase==='preparation'?section.preparationMinutes??0:section.minutes)*60

  function begin(){
    window.speechSynthesis?.cancel()
    Object.values(recordingsRef.current).forEach(url=>URL.revokeObjectURL(url))
    recordingsRef.current={};setRecordings({});setShowResult(false);setTranscript(false);setAudioError('')
    const tick=Date.now();setNow(tick)
    setProgress({phase:'exam',section:0,task:0,answers:{},deadline:tick+exam.sections[0].minutes*60_000,listens:{}})
  }
  function updateAnswer(value:string){setProgress(current=>{
    const answers={...current.answers}
    if(task.kind==='choice'&&task.uniqueMatch){
      for(const item of section.tasks){
        if(item.id!==task.id&&item.kind==='choice'&&item.exercise===task.exercise&&item.uniqueMatch&&answers[item.id]===value)delete answers[item.id]
      }
    }
    answers[task.id]=value
    return {...current,answers}
  })}
  function move(delta:number){
    if(recording)return
    window.speechSynthesis?.cancel();setTranscript(false);setAudioError('')
    setProgress(current=>({...current,task:Math.max(0,Math.min(section.tasks.length-1,current.task+delta))}))
  }
  function endSection(){
    if(recording)return
    const missing=section.tasks.filter(item=>!progress.answers[item.id]?.trim()).length
    if(missing>0&&!window.confirm(`Há ${missing} ${missing===1?'item sem resposta':'itens sem resposta'} nesta prova. Avançar mesmo assim?`))return
    window.speechSynthesis?.cancel();setTranscript(false);setAudioError('')
    if(progress.section===exam.sections.length-1){setShowResult(true);setProgress(current=>({...current,phase:'results'}))}
    else {const tick=Date.now();setNow(tick);setProgress(current=>({...current,...nextFrenchSection(exam,current.section+1,tick)}))}
  }
  function finishOralListening(){
    window.speechSynthesis?.cancel();setTranscript(false);setAudioError('')
    const tick=Date.now();setNow(tick)
    setProgress(current=>({...current,phase:'preparation',deadline:tick+(section.preparationMinutes??0)*60_000}))
  }
  function finishPreparation(){
    window.speechSynthesis?.cancel();setTranscript(false);setAudioError('')
    const tick=Date.now();setNow(tick)
    setProgress(current=>({...current,phase:'exam',deadline:tick+exam.sections[current.section].minutes*60_000}))
  }
  function speak(text:string){
    if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){setAudioError('Voz sintética indisponível. Abra a transcrição.');return}
    if(task.kind==='choice'&&task.listenLimit){
      const key=task.supportId??task.id
      if((progress.listens[key]??0)>=task.listenLimit){setAudioError('Você já usou o limite de reproduções deste documento. A transcrição continua disponível.');return}
      setProgress(current=>({...current,listens:{...current.listens,[key]:(current.listens[key]??0)+1}}))
    }
    if(exam.level==='C2'&&progress.phase==='oral-listening'){
      const key='dalf-c2-oral-document'
      if((progress.listens[key]??0)>=2){setAudioError('As duas reproduções do documento já foram usadas.');return}
      setProgress(current=>({...current,listens:{...current.listens,[key]:(current.listens[key]??0)+1}}))
    }
    window.speechSynthesis.cancel();setAudioError('')
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang='fr-FR';utterance.rate=exam.level==='A1'?.82:.94
    utterance.onerror=()=>setAudioError('A reprodução falhou. Abra a transcrição para continuar.')
    window.speechSynthesis.speak(utterance)
  }
  async function startRecording(){
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setAudioError('Microfone indisponível. Pratique em voz alta e marque a tarefa como praticada.');return}
    try {
      const id=task.id
      const stream=await navigator.mediaDevices.getUserMedia({audio:true})
      const media=new MediaRecorder(stream);const chunks:BlobPart[]=[]
      media.ondataavailable=event=>{if(event.data.size)chunks.push(event.data)}
      media.onstop=()=>{
        stream.getTracks().forEach(track=>track.stop());setRecording(false)
        if(chunks.length){
          if(recordingsRef.current[id])URL.revokeObjectURL(recordingsRef.current[id])
          const url=URL.createObjectURL(new Blob(chunks,{type:media.mimeType||'audio/webm'}))
          recordingsRef.current[id]=url;setRecordings(current=>({...current,[id]:url}))
          setProgress(current=>({...current,answers:{...current.answers,[id]:'Praticado com gravação'}}))
        }
      }
      recorderRef.current=media;media.start();setRecording(true);setAudioError('')
    }catch{setAudioError('Acesso ao microfone negado ou indisponível. Você pode praticar sem gravar.')}
  }

  if(progress.phase==='intro'||progress.phase==='results'&&!showResult)return <main className="french-page container">
    <nav className="french-page__crumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span>/</span><Link to="/exames/delf-dalf">DELF / DALF</Link><span>/</span><span aria-current="page">{exam.title}</span></nav>
    <header className="french-page__hero"><div><p className="french-page__eyebrow">Simulado adaptado · nível {exam.level}</p><h1>{exam.title}</h1><p>Pratique {exam.sections.length===2?'as duas provas integradas':'as quatro habilidades'} com material original do Daydreaming. {exam.level.startsWith('C')?'Esta versão avançada é abreviada.':'A contagem de itens de compreensão segue a matriz oficial, com documentos adaptados.'}</p><button type="button" className="french-page__primary" onClick={begin}>{progress.phase==='results'?'Refazer':'Iniciar'} {exam.title}</button></div><div className="french-page__hero-art" aria-hidden="true"><span>{exam.level}</span><b>{exam.level.startsWith('C')?'DALF':'DELF'}</b></div></header>
    {progress.phase==='results'&&<section className="french-page__previous"><div><strong>Você já concluiu este simulado nesta aba.</strong><p>O relatório fica disponível enquanto esta sessão estiver aberta.</p></div><button type="button" className="french-page__secondary" onClick={()=>setShowResult(true)}>Ver último resultado</button></section>}
    <section className="french-page__details"><h2>Etapas do simulado</h2><div className="french-page__steps">{exam.sections.map((part,index)=>{const exercises=new Set(part.tasks.filter(task=>task.kind==='choice').map(task=>task.exercise)).size;return <div key={part.id}><span>{String(index+1).padStart(2,'0')}</span><h3>{part.title}</h3><p>{exercises?`${exercises} exercícios · ${part.tasks.length} itens`:`${part.tasks.length} tarefas`} · {part.minutes} min{part.preparationMinutes?` · preparação oficial: ${part.preparationMinutes} min`:''}</p></div>})}</div>
      <p><strong>Limites desta prática:</strong> {exam.level.startsWith('C')?'C1 e C2 têm menos itens e documentos mais curtos que os oficiais.':'A contagem e a distribuição de documentos de compreensão acompanham a matriz de 2024; os documentos são mais curtos e as ilustrações são adaptações.'} O áudio usa voz sintética e a interação oral é simulada. A preparação oral tem cronômetro próprio. Textos e gravações não recebem correção automática.</p>
      <p>O relatório mostra apenas acertos em escolhas objetivas e tarefas abertas praticadas. Ele não calcula pontos oficiais nem aprova ou reprova você. Respostas ficam em <code>sessionStorage</code> nesta aba; gravações desaparecem ao recarregar.</p>
      <p>Fonte para a estrutura: <a href={exam.sourceUrl} target="_blank" rel="noopener noreferrer">France Éducation international — {exam.title.split(' — ')[0]} {exam.level}</a> (consulta em 09/11/2026).</p>
    </section>
  </main>

  if(progress.phase==='results'){
    return <main className="french-page container"><nav className="french-page__crumb"><Link to="/exames/delf-dalf">DELF / DALF</Link><span>/</span><span aria-current="page">{exam.title} · resultado</span></nav>
      <header className="french-page__result-head"><p className="french-page__eyebrow">Prática concluída</p><h1>Relatório do {exam.title}</h1><p>Resultado de treino, sem nota oficial, diploma ou diagnóstico do seu nível de francês.</p></header>
      <div className="french-page__report">{exam.sections.map(part=>{const review=frenchSectionReview(part,progress.answers);return <section key={part.id}><h2>{part.title}</h2>{review.objectiveTotal>0?<p><strong>{review.correct} de {review.objectiveTotal}</strong> acertos objetivos · {review.answered} respondidas</p>:<p><strong>{review.practiced} de {review.openTotal}</strong> tarefas abertas praticadas</p>}{review.openTotal>0&&review.objectiveTotal>0&&<p>{review.practiced} de {review.openTotal} tarefas abertas praticadas</p>}</section>})}</div>
      <section className="french-page__review"><h2>Revise sua prática</h2><p>As escolhas objetivas recebem gabarito. Escrita e fala precisam de avaliação humana; use o roteiro para revisar o que produziu.</p>{exam.sections.flatMap(part=>part.tasks.map(item=>({part,item}))).map(({part,item})=><details key={item.id}><summary>{part.title} · {item.title}{item.kind==='choice'?progress.answers[item.id]===String(item.answer)?' · correta':' · revisar':''}</summary>{item.kind==='choice'?<p><strong>Resposta:</strong> {item.options[item.answer]}. {item.explanation}</p>:<><p>{progress.answers[item.id]?.trim()?'Tarefa praticada.':'Tarefa não praticada.'}</p>{item.kind==='writing'&&progress.answers[item.id]?.trim()&&<blockquote className="french-page__own-answer">{progress.answers[item.id]}</blockquote>}{item.kind==='speaking'&&recordings[item.id]&&<audio controls src={recordings[item.id]} aria-label={`Sua gravação: ${item.title}`}/>}<ul>{item.review.map((point,index)=><li key={index}>{point}</li>)}</ul></>}</details>)}
        <div className="french-page__actions"><button type="button" className="french-page__primary" onClick={begin}>Refazer {exam.title}</button><button type="button" className="french-page__secondary" onClick={()=>setShowResult(false)}>Voltar à apresentação</button></div>
      </section>
    </main>
  }

  if(progress.phase==='oral-listening')return <main className="french-page container">
    <nav className="french-page__crumb" aria-label="Você está em"><Link to="/exames/delf-dalf">DELF / DALF</Link><span>/</span><span aria-current="page">{exam.title} · documento oral</span></nav>
    <header className="french-page__exam-head"><div><p className="french-page__eyebrow">{exam.title} · prática não oficial</p><h1>Documento oral</h1><p>Ouça o documento até duas vezes. Depois começa o tempo de preparação da apresentação.</p></div></header>
    <section className="french-page__task"><div className="french-page__audio"><button type="button" disabled={(progress.listens['dalf-c2-oral-document']??0)>=2} onClick={()=>speak(task.audio??'')}>▶ Ouvir voz sintética ({progress.listens['dalf-c2-oral-document']??0}/2)</button><button type="button" aria-expanded={transcript} onClick={()=>setTranscript(value=>!value)}>{transcript?'Ocultar':'Ler'} transcrição</button>{transcript&&<p>{task.audio}</p>}</div>{audioError&&<p className="french-page__error" role="status">{audioError}</p>}</section>
    <div className="french-page__actions"><button type="button" className="french-page__primary" onClick={finishOralListening}>Iniciar preparação oral →</button></div>
    <p className="french-page__footnote">Áudio original do Daydreaming em voz sintética. A transcrição está disponível como apoio de acessibilidade.</p>
  </main>

  if(progress.phase==='preparation')return <main className="french-page container">
    <nav className="french-page__crumb" aria-label="Você está em"><Link to="/exames/delf-dalf">DELF / DALF</Link><span>/</span><span aria-current="page">{exam.title} · preparação oral</span></nav>
    <header className="french-page__exam-head"><div><p className="french-page__eyebrow">{exam.title} · prática não oficial</p><h1>Preparação da prova oral</h1><p>Leia o tema e organize sua resposta. A prova oral começa quando o tempo terminar ou quando você estiver pronto.</p></div><span className="french-page__timer" aria-label={`Tempo de preparação restante: ${formatTime(remaining)}`}>{formatTime(remaining)}</span></header>
    <section className="french-page__task" aria-labelledby="french-preparation-title"><h2 id="french-preparation-title">Material para preparação</h2>
      {audioError&&<p className="french-page__error" role="status">{audioError}</p>}
      {section.tasks.map(item=><div className="french-page__context" key={item.id}><strong>{item.title}</strong><p>{item.context}</p><p>{item.prompt}</p></div>)}
    </section>
    <div className="french-page__actions"><button type="button" className="french-page__primary" onClick={finishPreparation}>Iniciar prova oral →</button></div>
    <p className="french-page__footnote">O tempo de preparação é separado da duração da prova oral. O áudio e os temas são originais do Daydreaming.</p>
  </main>

  const isAudio=Boolean(task.audio)&&exam.level!=='C2'
  const completed=section.tasks.filter(entry=>progress.answers[entry.id]?.trim()).length
  return <main className="french-page container"><nav className="french-page__crumb"><Link to="/exames/delf-dalf">DELF / DALF</Link><span>/</span><span aria-current="page">{exam.title}</span></nav>
    <header className="french-page__exam-head"><div><p className="french-page__eyebrow">{exam.title} · prática não oficial</p><h1>{section.title}</h1><p>{task.kind==='choice'?`Questão ${progress.task+1} de ${section.tasks.length}`:`Tarefa ${progress.task+1} de ${section.tasks.length}`} · {task.title}</p></div><span className="french-page__timer" aria-label={`Tempo restante: ${formatTime(remaining)}`}>{formatTime(remaining)}</span></header>
    <div className="french-page__progress" role="progressbar" aria-label="Tarefas respondidas nesta prova" aria-valuemin={0} aria-valuemax={section.tasks.length} aria-valuenow={completed}><span style={{width:`${completed/section.tasks.length*100}%`}}/></div>
    <div className="french-page__section-nav" aria-label="Provas do simulado">{exam.sections.map((part,index)=><span className={index===progress.section?'is-current':index<progress.section?'is-done':''} key={part.id}>{index+1}. {part.title}</span>)}</div>
    <section className="french-page__task" aria-labelledby="french-task-title"><p className="french-page__eyebrow">{task.title}{task.kind==='choice'&&task.documentLabel?` · ${task.documentLabel}`:''}</p>
      {isAudio&&<div className="french-page__audio"><button type="button" disabled={task.kind==='choice'&&Boolean(task.listenLimit)&&((progress.listens[task.supportId??task.id]??0)>=task.listenLimit!)} onClick={()=>speak(task.audio!)}>▶ Ouvir voz sintética{task.kind==='choice'&&task.listenLimit?` (${progress.listens[task.supportId??task.id]??0}/${task.listenLimit})`:''}</button><button type="button" aria-expanded={transcript} onClick={()=>setTranscript(value=>!value)}>{transcript?'Ocultar':'Ler'} transcrição</button>{transcript&&<p>{task.audio}</p>}</div>}
      {audioError&&<p className="french-page__error" role="status">{audioError}</p>}
      {(!isAudio||task.kind==='speaking')&&<div className="french-page__context"><strong>{task.kind==='choice'?'Documento':'Situação e documentos'}</strong><p>{task.context}</p></div>}
      <h2 id="french-task-title">{task.prompt}</h2>
      {task.kind==='choice'&&<fieldset className="french-page__options"><legend>{task.format==='matching'?'Associe o documento à opção correspondente':task.format==='yes-no'?'Marque a resposta':'Escolha uma resposta'}</legend>{task.options.map((option,index)=><label key={index} className={answer===String(index)?'is-selected':''}><input type="radio" name={task.id} checked={answer===String(index)} onChange={()=>updateAnswer(String(index))}/><span>{String.fromCharCode(65+index)}</span>{task.optionIcons?.[index]&&<span className="french-page__option-icon" aria-hidden="true">{task.optionIcons[index]}</span>}{option}</label>)}</fieldset>}
      {task.kind==='writing'&&<label className="french-page__writing">Sua resposta em francês<textarea value={answer} onChange={event=>updateAnswer(event.target.value)} rows={12} spellCheck={false} placeholder="Rédigez votre réponse en français…" /><span>{wordCount(answer)} palavras{task.minWords?` · referência: ${task.minWords} ou mais`:''}. O tamanho não é corrigido automaticamente.</span></label>}
      {task.kind==='speaking'&&<div className="french-page__speaking"><p>Relances simulées :</p><ol>{task.followUps?.map((question,index)=><li key={index}>{question}</li>)}</ol><div className="french-page__actions"><button type="button" className="french-page__secondary" disabled={recording} onClick={()=>void startRecording()}>Gravar resposta</button><button type="button" className="french-page__secondary" disabled={!recording} onClick={()=>recorderRef.current?.stop()}>Parar gravação</button></div>{recording&&<p role="status">Gravando somente neste navegador…</p>}{recordings[task.id]&&<audio controls src={recordings[task.id]} aria-label="Ouvir sua resposta"/>}<button type="button" className="french-page__text-button" disabled={recording} onClick={()=>updateAnswer('Praticado em voz alta')}>Pratiquei sem gravar</button>{answer&&<p role="status">Prática registrada nesta aba.</p>}</div>}
    </section>
    <div className="french-page__actions french-page__navigation"><button type="button" className="french-page__secondary" disabled={progress.task===0||recording} onClick={()=>move(-1)}>← Anterior</button>{progress.task<section.tasks.length-1?<button type="button" className="french-page__primary" disabled={recording} onClick={()=>move(1)}>{task.kind==='choice'?'Próxima questão':'Próxima tarefa'} →</button>:<button type="button" className="french-page__primary" disabled={recording} onClick={endSection}>{progress.section===exam.sections.length-1?'Ver relatório':'Próxima prova'} →</button>}</div>
    <p className="french-page__footnote">Conteúdo original do Daydreaming. O relógio acompanha a duração de referência desta prova; a preparação oral tem etapa separada. Suas respostas abertas não recebem nota automática.</p>
  </main>
}
