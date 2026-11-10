import { useEffect, useRef, useState } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ieltsSections, listeningSets, readingSets, speakingParts, writingTasks, type IeltsItem } from '../data/ieltsPractice'
import { ieltsObjectiveReport, isIeltsAnswerCorrect, wordCount, type IeltsAnswers } from '../lib/ieltsPractice'
import './IeltsPage.css'

type Phase = 'intro' | 'exam' | 'results'
type Progress = { phase: Phase; step: number; answers: IeltsAnswers; deadline: number; played: number[]; spoken: string[] }
const storageKey = 'daydreaming-ielts-academic-exam-1'
const initial: Progress = { phase: 'intro', step: 0, answers: {}, deadline: 0, played: [], spoken: [] }
const steps = [
  ...listeningSets.map((set, index) => ({ section: 0, title: set.title, index })),
  ...readingSets.map((set, index) => ({ section: 1, title: set.title, index })),
  ...writingTasks.map((task, index) => ({ section: 2, title: task.title, index })),
  ...speakingParts.map((part, index) => ({ section: 3, title: part.title, index })),
]
const firstStep = [0, 4, 7, 9]

function readProgress(): Progress {
  try {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return initial
    const value = JSON.parse(raw) as Progress
    if (!['intro', 'exam', 'results'].includes(value.phase) || !Number.isInteger(value.step) || value.step < 0 || value.step >= steps.length ||
      !value.answers || typeof value.answers !== 'object' || !Number.isFinite(value.deadline) || !Array.isArray(value.played) || !Array.isArray(value.spoken)) return initial
    return value
  } catch { return initial }
}

function formatTime(seconds: number) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}` }

export function IeltsPage() {
  useDocumentTitle('IELTS Academic · Exame 1 autoral | Daydreaming')
  const [progress, setProgress] = useState<Progress>(readProgress)
  const [showPrevious, setShowPrevious] = useState(false)
  const [now, setNow] = useState(Date.now)
  const [audioError, setAudioError] = useState('')
  const [recording, setRecording] = useState(false)
  const [recordingUrls, setRecordingUrls] = useState<Record<string, string>>({})
  const recorder = useRef<MediaRecorder | null>(null)
  const audioStreams = useRef<MediaStream | null>(null)
  const recordedUrls = useRef<string[]>([])
  const sectionIndex = steps[progress.step].section
  const section = ieltsSections[sectionIndex]
  const step = steps[progress.step]
  const secondsLeft = progress.phase === 'exam' ? Math.max(0, Math.ceil((progress.deadline - now) / 1000)) : section.minutes * 60

  useEffect(() => { try { sessionStorage.setItem(storageKey, JSON.stringify(progress)) } catch { /* Storage may be disabled. */ } }, [progress])
  useEffect(() => {
    if (progress.phase !== 'exam') return
    const timer = window.setInterval(() => {
      const tick = Date.now()
      setNow(tick)
      if (tick >= progress.deadline) {
        window.speechSynthesis?.cancel()
        setProgress(current => {
          if (current.phase !== 'exam' || current.deadline > tick) return current
          const next = firstStep[steps[current.step].section + 1]
          return next === undefined ? { ...current, phase: 'results' } : { ...current, step: next, deadline: tick + ieltsSections[steps[next].section].minutes * 60_000 }
        })
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [progress.phase, progress.deadline])
  useEffect(() => () => {
    window.speechSynthesis?.cancel()
    if (recorder.current?.state === 'recording') recorder.current.stop()
    audioStreams.current?.getTracks().forEach(track => track.stop())
    recordedUrls.current.forEach(url => URL.revokeObjectURL(url))
  }, [])

  function answer(id: string, value: string) { setProgress(current => ({ ...current, answers: { ...current.answers, [id]: value } })) }
  function start() {
    window.speechSynthesis?.cancel()
    recordedUrls.current.forEach(url => URL.revokeObjectURL(url))
    recordedUrls.current = []
    setRecordingUrls({})
    setAudioError('')
    setShowPrevious(false)
    const tick = Date.now()
    setNow(tick)
    setProgress({ phase: 'exam', step: 0, answers: {}, deadline: tick + ieltsSections[0].minutes * 60_000, played: [], spoken: [] })
  }
  function next() {
    const current = steps[progress.step]
    const items = current.section === 0 ? listeningSets[current.index].items : current.section === 1 ? readingSets[current.index].items : []
    const unanswered = items.filter(item => !progress.answers[item.id]?.trim()).length
    if (unanswered && !window.confirm(`${unanswered} ${unanswered === 1 ? 'questão sem resposta' : 'questões sem resposta'}. Avançar mesmo assim?`)) return
    window.speechSynthesis?.cancel()
    setAudioError('')
    if (recorder.current?.state === 'recording') recorder.current.stop()
    const nextStep = progress.step + 1
    if (nextStep >= steps.length) { setProgress(value => ({ ...value, phase: 'results' })); return }
    const nextSection = steps[nextStep].section
    const tick = Date.now()
    setNow(tick)
    setProgress(value => ({ ...value, step: nextStep, deadline: nextSection === current.section ? value.deadline : tick + ieltsSections[nextSection].minutes * 60_000 }))
  }
  function playListening() {
    if (progress.played.includes(step.index)) return
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { setAudioError('A reprodução de áudio não está disponível neste navegador. Você pode consultar a transcrição após o exame.'); return }
    const utterance = new SpeechSynthesisUtterance(listeningSets[step.index].context)
    utterance.lang = 'en-GB'
    utterance.rate = 0.9
    utterance.onerror = () => setAudioError('A reprodução falhou. Este bloco não pode ser avaliado como prática de Listening; a transcrição estará no relatório.')
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setProgress(value => ({ ...value, played: [...value.played, step.index] }))
  }
  async function beginRecording(id: string) {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { setAudioError('Gravação indisponível. Pratique em voz alta e marque a parte como praticada.'); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreams.current = stream
      const media = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      media.ondataavailable = event => { if (event.data.size) chunks.push(event.data) }
      media.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
        if (chunks.length) {
          const url = URL.createObjectURL(new Blob(chunks, { type: media.mimeType || 'audio/webm' }))
          recordedUrls.current.push(url)
          setRecordingUrls(value => ({ ...value, [id]: url }))
          setProgress(value => ({ ...value, spoken: value.spoken.includes(id) ? value.spoken : [...value.spoken, id] }))
        }
        setRecording(false)
      }
      recorder.current = media
      setAudioError('')
      setRecording(true)
      media.start()
    } catch { setAudioError('Não foi possível acessar o microfone. Você pode praticar sem gravar.') }
  }

  const breadcrumb = <nav className="ielts-page__crumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span>/</span><span aria-current="page">IELTS Academic · Exame 1</span></nav>
  if (progress.phase === 'intro' || (progress.phase === 'results' && !showPrevious)) return <main className="ielts-page container">
    {breadcrumb}
    <header className="ielts-page__hero"><div><p className="ielts-page__eyebrow">Exame 1 · prática autoral</p><h1>Pratique o formato IELTS Academic</h1><p>Um simulado completo de Listening, Reading, Writing e Speaking, criado pelo Daydreaming. <strong>Não é um teste oficial do IELTS</strong> e o resultado não substitui uma prova reconhecida.</p><button className="ielts-page__primary" onClick={start}>{progress.phase === 'results' ? 'Refazer Exame 1' : 'Começar Exame 1'}</button></div><div className="ielts-page__hero-art" aria-hidden="true"><span>L</span><span>R</span><span>W</span><span>S</span></div></header>
    {progress.phase === 'results' && <div className="ielts-page__previous"><p>Você concluiu o Exame 1 nesta aba.</p><button className="ielts-page__secondary" onClick={() => setShowPrevious(true)}>Ver último relatório</button></div>}
    <section className="ielts-page__intro"><h2>Como funciona</h2><div className="ielts-page__structure">{ieltsSections.map(part => <div key={part.id}><h3>{part.title}</h3><strong>{part.count} {part.count > 3 ? 'questões' : 'tarefas'}</strong><span>{part.minutes} min</span></div>)}</div><p>Listening usa voz sintética e cada gravação pode ser iniciada uma vez por parte. Reading reúne três textos acadêmicos. Writing tem descrição de dados e redação; Speaking tem entrevista, fala individual e discussão. As respostas e o cronômetro ficam apenas nesta aba.</p><p><strong>Resultado:</strong> mostramos acertos em Listening e Reading. Writing e Speaking recebem um roteiro de autoavaliação, sem banda oficial.</p><p>Estrutura de referência: <a href="https://ielts.org/take-a-test/test-types/ielts-academic-test" target="_blank" rel="noopener noreferrer">IELTS Academic oficial</a>. Conteúdo, dados e perguntas deste simulado são originais do Daydreaming.</p></section>
  </main>

  if (progress.phase === 'results') {
    const report = ieltsObjectiveReport(progress.answers)
    return <main className="ielts-page container">{breadcrumb}<header className="ielts-page__result-head"><p className="ielts-page__eyebrow">Exame 1 · relatório de prática</p><h1>Seu resultado no simulado</h1><p>Estes acertos não são uma banda IELTS. A conversão oficial pode variar entre provas, e Writing e Speaking exigem avaliação por critérios próprios.</p></header>
      <div className="ielts-page__report">{report.map(part => <section key={part.id}><h2>{part.title}</h2><strong>{part.correct} / {part.total}</strong><p>{part.answered} respostas preenchidas</p></section>)}<section><h2>Writing</h2><strong>{writingTasks.filter(task => progress.answers[task.id]?.trim()).length} / 2</strong><p>Tarefas redigidas; sem correção automática.</p></section><section><h2>Speaking</h2><strong>{progress.spoken.length} / 3</strong><p>Partes praticadas; sem correção automática.</p></section></div>
      <section className="ielts-page__review"><h2>Revisar respostas objetivas</h2>{[...listeningSets, ...readingSets].map(set => <details key={set.title}><summary>{set.title}</summary>{set.items.map(item => <div className="ielts-page__review-item" key={item.id}><strong>{item.prompt}</strong><p>Sua resposta: {progress.answers[item.id] || 'Não respondida'} · {isIeltsAnswerCorrect(item, progress.answers[item.id] || '') ? 'Correta' : `Resposta esperada: ${item.answer.split('|')[0]}`}</p><p>{item.explanation}</p></div>)}{listeningSets.includes(set) && <details><summary>Transcrição do áudio</summary><p>{set.context}</p></details>}</details>)}</section>
      <section className="ielts-page__review"><h2>Revisar produção</h2><p>Writing: compare sua resposta com os critérios de cumprimento da tarefa, organização, vocabulário e gramática. A Task 2 tem peso maior na prova oficial. Speaking: escute sua gravação e observe fluência, vocabulário, gramática e pronúncia. Esta página não atribui nota a essas habilidades.</p>{writingTasks.map(task => <details key={task.id}><summary>{task.title} · {wordCount(progress.answers[task.id] || '')} palavras</summary><p>{progress.answers[task.id] || 'Não respondida.'}</p><p>Mínimo de referência: {task.minimumWords} palavras. {task.guidance}</p></details>)}{speakingParts.map(part => <details key={part.id}><summary>{part.title}</summary><p>{part.guidance}</p>{recordingUrls[part.id] ? <audio controls src={recordingUrls[part.id]} aria-label={`Sua gravação de ${part.title}`} /> : <p>Sem gravação disponível nesta sessão.</p>}</details>)}</section><div className="ielts-page__actions"><button className="ielts-page__primary" onClick={start}>Refazer Exame 1</button><Link className="ielts-page__secondary" to="/exames">Voltar ao catálogo</Link></div></main>
  }

  const set = sectionIndex === 0 ? listeningSets[step.index] : sectionIndex === 1 ? readingSets[step.index] : null
  const writing = sectionIndex === 2 ? writingTasks[step.index] : null
  const speaking = sectionIndex === 3 ? speakingParts[step.index] : null
  const itemCount = set?.items.filter(item => progress.answers[item.id]?.trim()).length ?? 0
  return <main className="ielts-page container">{breadcrumb}<header className="ielts-page__exam-head"><div><p className="ielts-page__eyebrow">Exame 1 · simulado não oficial</p><h1>{section.title}</h1><p>{step.title}</p></div><div className="ielts-page__timer" aria-label={`Tempo restante nesta seção: ${formatTime(secondsLeft)}`}>{formatTime(secondsLeft)}</div></header>
    <div className="ielts-page__progress" role="progressbar" aria-label="Progresso do simulado" aria-valuenow={progress.step + 1} aria-valuemin={1} aria-valuemax={steps.length}><span style={{ width: `${(progress.step + 1) / steps.length * 100}%` }} /></div><nav className="ielts-page__steps" aria-label="Seções do simulado">{ieltsSections.map((part, index) => <span key={part.id} className={index === sectionIndex ? 'is-current' : index < sectionIndex ? 'is-done' : ''}>{part.title}</span>)}</nav>
    {set && <section className="ielts-page__work"><div className="ielts-page__work-head"><h2>{set.title}</h2><span>{itemCount} de {set.items.length} respondidas</span></div>{sectionIndex === 0 ? <div className="ielts-page__audio"><p>Ouça a gravação uma vez. As questões abaixo podem ser respondidas durante a reprodução. A transcrição aparece no relatório.</p><button className="ielts-page__primary" disabled={progress.played.includes(step.index)} onClick={playListening}>{progress.played.includes(step.index) ? 'Gravação iniciada' : 'Iniciar gravação'}</button>{audioError && <p role="alert">{audioError}</p>}</div> : <div className="ielts-page__passage"><h3>Texto de leitura</h3>{set.context.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>}
      <div className="ielts-page__questions">{set.items.map((item: IeltsItem, index) => <div className="ielts-page__question" key={item.id}><h3>{index + 1}. {item.prompt}</h3>{item.kind === 'choice' ? <fieldset><legend className="sr-only">Escolha uma resposta para a questão {index + 1}</legend>{item.options?.map(option => <label key={option}><input type="radio" name={item.id} checked={progress.answers[item.id] === option} onChange={() => answer(item.id, option)} /><span>{option}</span></label>)}</fieldset> : <label className="ielts-page__text-answer">Resposta curta <input type="text" autoComplete="off" value={progress.answers[item.id] || ''} onChange={event => answer(item.id, event.target.value)} /><small>Máximo de {item.wordLimit} {item.wordLimit === 1 ? 'palavra' : 'palavras'}.</small></label>}</div>)}</div></section>}
    {writing && <section className="ielts-page__work"><h2>{writing.title}</h2><p className="ielts-page__prompt">{writing.prompt}</p>{'table' in writing && writing.table && <div className="ielts-page__table-wrap"><table><caption>{writing.table.caption}</caption><thead><tr>{writing.table.headings.map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead><tbody>{writing.table.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>}<label className="ielts-page__writing">Sua resposta em inglês<textarea value={progress.answers[writing.id] || ''} onChange={event => answer(writing.id, event.target.value)} rows={12} spellCheck={false} /></label><p>{wordCount(progress.answers[writing.id] || '')} palavras · referência mínima: {writing.minimumWords}. {writing.guidance}</p></section>}
    {speaking && <section className="ielts-page__work"><h2>{speaking.title}</h2><p className="ielts-page__prompt">{speaking.prompt}</p><p>{speaking.guidance} Tempo de referência: {speaking.minutes} minutos.</p>{speaking.id === 's2' && <p>Use um minuto do tempo desta seção para preparar suas anotações antes de falar.</p>}<div className="ielts-page__record-actions"><button className="ielts-page__primary" disabled={recording} onClick={() => void beginRecording(speaking.id)}>Gravar resposta</button><button className="ielts-page__secondary" disabled={!recording} onClick={() => recorder.current?.stop()}>Parar gravação</button></div>{recording && <p role="status">Gravando nesta aba…</p>}{recordingUrls[speaking.id] && <audio controls src={recordingUrls[speaking.id]} aria-label="Ouvir sua resposta" />}{audioError && <p role="alert">{audioError}</p>}<button className="ielts-page__text-button" onClick={() => setProgress(value => ({ ...value, spoken: value.spoken.includes(speaking.id) ? value.spoken : [...value.spoken, speaking.id] }))}>Pratiquei em voz alta sem gravar</button>{progress.spoken.includes(speaking.id) && <p role="status">Parte marcada como praticada. Não há avaliação automática de fala.</p>}</section>}
    <div className="ielts-page__actions"><button className="ielts-page__secondary" disabled={progress.step === firstStep[sectionIndex] || recording} onClick={() => { window.speechSynthesis?.cancel(); setProgress(value => ({ ...value, step: value.step - 1 })) }}>Voltar à parte anterior</button><button className="ielts-page__primary" disabled={recording} onClick={next}>{progress.step === steps.length - 1 ? 'Ver relatório' : 'Próxima parte'} →</button></div><p className="ielts-page__note">Este simulado foi criado pelo Daydreaming. Não contém questões oficiais do IELTS, não é certificado e não calcula banda oficial.</p></main>
}
