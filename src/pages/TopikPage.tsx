import { useEffect, useState } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { topikExams, type TopikExam, type TopikLevel } from '../data/topikPractice'
import './TopikPage.css'

type Progress = { phase: 'intro' | 'exam' | 'results'; section: number; question: number; deadline: number; answers: Record<string, number | string> }
const initial = (): Progress => ({ phase: 'intro', section: 0, question: 0, deadline: 0, answers: {} })
const key = (level: TopikLevel) => `daydreaming-topik-${level}-exam-1`
function load(level: TopikLevel): Progress {
  try {
    const value = JSON.parse(sessionStorage.getItem(key(level)) || 'null') as Progress | null
    if (value && ['intro', 'exam', 'results'].includes(value.phase) && Number.isInteger(value.section) && Number.isInteger(value.question) && Number.isFinite(value.deadline) && value.answers && typeof value.answers === 'object') return value
  } catch { /* armazenamento indisponível */ }
  return initial()
}
const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

export function TopikPage() {
  useDocumentTitle('Simulados inspirados no TOPIK | Daydreaming')
  return <main className="topik-page container">
    <nav className="topik-crumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span>/</span>TOPIK</nav>
    <header className="topik-hero"><div><p className="topik-kicker">Prática de coreano</p><h1>Escolha seu simulado TOPIK</h1><p>Dois exames autorais inspirados na versão em papel: TOPIK I para os níveis 1–2 e TOPIK II para os níveis 3–6.</p></div><span lang="ko" aria-hidden="true">한국어</span></header>
    <p className="topik-notice"><strong>Não é um teste oficial do TOPIK.</strong> Os textos, questões e materiais de escuta são autorais e simplificados. A quantidade de itens e o tempo seguem a estrutura da prova em papel, mas o resultado não é um certificado nem uma previsão de nível oficial.</p>
    <section aria-labelledby="topik-choose"><h2 id="topik-choose">Exame 1 por modalidade</h2><div className="topik-choices">{topikExams.map(exam => <article className="topik-choice" key={exam.level}><span className="topik-choice__level">{exam.level}</span><div><h3>TOPIK {exam.level}</h3><p>{exam.level === 'I' ? 'Iniciante · níveis 1 e 2' : 'Intermediário e avançado · níveis 3 a 6'}</p><ul>{exam.sections.map(section => <li key={section.id}>{section.name}: <strong>{section.questions.length} {section.id === 'writing' ? 'tarefas' : 'questões'} · {section.minutes} min</strong></li>)}</ul><Link className="topik-button" to={`/exames/topik/${exam.level.toLowerCase()}`}>Abrir Exame 1 <span aria-hidden="true">→</span></Link></div></article>)}</div></section>
    <p className="topik-source">Estrutura e duração: <a href="https://www.niied.go.kr/web/NIIED/contents/niiedEng/eng_topikOverview" target="_blank" rel="noopener noreferrer">NIIED, órgão responsável pelo TOPIK</a>. A versão no computador (IBT) tem outra contagem de itens, tempo e escala de pontuação.</p>
  </main>
}

export function TopikExamPage({ level }: { level: string }) {
  const exam = topikExams.find(item => item.level.toLowerCase() === level)
  if (!exam) return null
  return <ExamView key={exam.level} exam={exam} />
}

function ExamView({ exam }: { exam: TopikExam }) {
  useDocumentTitle(`TOPIK ${exam.level} · Exame 1 | Daydreaming`)
  const [progress, setProgress] = useState<Progress>(() => load(exam.level))
  const [now, setNow] = useState(Date.now)
  const [audioError, setAudioError] = useState('')
  const [transcript, setTranscript] = useState(false)
  const section = exam.sections[progress.section] || exam.sections[0]
  const question = section.questions[progress.question] || section.questions[0]
  const remaining = progress.phase === 'exam' ? Math.max(0, Math.ceil((progress.deadline - now) / 1000)) : section.minutes * 60
  const crumb = <nav className="topik-crumb" aria-label="Você está em"><Link to="/exames/topik">TOPIK</Link><span>/</span><span>{exam.level} · Exame 1</span></nav>

  useEffect(() => { try { sessionStorage.setItem(key(exam.level), JSON.stringify(progress)) } catch { /* armazenamento indisponível */ } }, [exam.level, progress])
  useEffect(() => {
    if (progress.phase !== 'exam') return
    const timer = window.setInterval(() => {
      const tick = Date.now()
      setNow(tick)
      if (tick < progress.deadline) return
      window.speechSynthesis?.cancel()
      setProgress(current => {
        if (current.phase !== 'exam' || current.deadline > tick) return current
        let updated = current
        while (updated.phase === 'exam' && updated.deadline <= tick) {
          const next = updated.section + 1
          updated = next >= exam.sections.length ? { ...updated, phase: 'results' }
            : { ...updated, section: next, question: 0, deadline: updated.deadline + exam.sections[next].minutes * 60000 }
        }
        return updated
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [exam, progress.phase, progress.deadline])
  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  function begin() {
    const tick = Date.now()
    setNow(tick); setAudioError(''); setTranscript(false)
    setProgress({ phase: 'exam', section: 0, question: 0, deadline: tick + exam.sections[0].minutes * 60000, answers: {} })
  }
  function answer(value: number | string) { setProgress(current => ({ ...current, answers: { ...current.answers, [question.id]: value } })) }
  function move(next: number) { window.speechSynthesis?.cancel(); setAudioError(''); setTranscript(false); setProgress(current => ({ ...current, question: next })) }
  function nextSection() {
    window.speechSynthesis?.cancel(); setAudioError(''); setTranscript(false)
    const tick = Date.now(); setNow(tick)
    setProgress(current => current.section + 1 >= exam.sections.length ? { ...current, phase: 'results' }
      : { ...current, section: current.section + 1, question: 0, deadline: tick + exam.sections[current.section + 1].minutes * 60000 })
  }
  function play() {
    if (!question.audio || !('speechSynthesis' in window)) { setAudioError('Áudio indisponível neste navegador. Use a transcrição para continuar.'); return }
    const voice = window.speechSynthesis.getVoices().find(item => item.lang.toLowerCase().startsWith('ko'))
    if (!voice) { setAudioError('Voz coreana indisponível neste dispositivo. Use a transcrição para continuar.'); return }
    const utterance = new SpeechSynthesisUtterance(question.audio)
    utterance.lang = 'ko-KR'; utterance.voice = voice; utterance.rate = exam.level === 'I' ? .85 : .95
    utterance.onerror = () => setAudioError('Não foi possível reproduzir a voz. Use a transcrição para continuar.')
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); setAudioError('')
  }

  if (progress.phase === 'intro') return <main className="topik-page container">{crumb}<header className="topik-hero"><div><p className="topik-kicker">TOPIK {exam.level} · Exame 1</p><h1>Prepare-se para a prática</h1><p>{exam.questions.length} tarefas em {exam.sections.reduce((sum, item) => sum + item.minutes, 0)} minutos, divididas como a prova em papel.</p></div><span lang="ko" aria-hidden="true">한국어</span></header>
    <p className="topik-notice"><strong>Simulado autoral, não oficial.</strong> A escuta usa a voz coreana do navegador; se ela não estiver instalada, a transcrição permite continuar. Os materiais são mais curtos e simples que os da prova real. A escrita não recebe correção automática.</p>
    <div className="topik-overview">{exam.sections.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, '0')}</span><h2>{item.name}</h2><p>{item.questions.length} {item.id === 'writing' ? 'tarefas' : 'questões'} · {item.minutes} minutos</p></article>)}</div>
    <p>O tempo começa quando você inicia e continua após recarregar a página. Respostas ficam somente nesta sessão do navegador; a seção encerrada não pode ser reaberta.</p><button className="topik-button" onClick={begin}>Começar Exame 1</button>
  </main>

  if (progress.phase === 'results') {
    const objective = exam.questions.filter(item => item.skill !== 'writing')
    const hits = objective.filter(item => progress.answers[item.id] === item.answer).length
    return <main className="topik-page container">{crumb}<header className="topik-hero"><div><p className="topik-kicker">Relatório de prática</p><h1>TOPIK {exam.level}: {hits} de {objective.length} acertos objetivos</h1><p>Este resultado serve para revisar o estudo. Não equivale à pontuação oficial, não determina seu nível TOPIK e não é um certificado.</p></div></header>
      <div className="topik-report">{exam.sections.map(item => { const answered = item.questions.filter(q => progress.answers[q.id] !== undefined && progress.answers[q.id] !== '').length; const correct = item.id === 'writing' ? null : item.questions.filter(q => progress.answers[q.id] === q.answer).length; return <article key={item.id}><h2>{item.name}</h2><strong>{correct === null ? `${answered} / ${item.questions.length}` : `${correct} / ${item.questions.length}`}</strong><p>{correct === null ? 'tarefas registradas · sem correção automática' : `${answered} respondidas`}</p></article> })}</div>
      <p className="topik-notice">A prova oficial aplica critérios próprios, especialmente na escrita. Não convertemos acertos em pontos dos níveis 1 a 6.</p>
      <section className="topik-review"><h2>Revisar respostas</h2>{exam.sections.map(item => <details key={item.id}><summary>{item.name}</summary><ol>{item.questions.map(q => <li key={q.id}><strong lang="ko">{q.prompt}</strong>{q.passage && <p lang="ko">Texto: {q.passage}</p>}{q.audio && <p lang="ko">Transcrição: {q.audio}</p>}{q.options ? <><p>Sua resposta: {typeof progress.answers[q.id] === 'number' ? q.options[progress.answers[q.id] as number] : 'Não respondida'}</p><p>Resposta esperada: {q.options[q.answer!]}</p></> : <><p>Sua escrita:</p><p lang="ko" className="topik-saved">{progress.answers[q.id] || 'Não respondida.'}</p><p>{q.guide}</p></>}</li>)}</ol></details>)}</section>
      <div className="topik-actions"><button className="topik-button" onClick={begin}>Refazer Exame 1</button><Link className="topik-button topik-button--light" to="/exames/topik">Escolher outra modalidade</Link></div>
    </main>
  }

  return <main className="topik-page container">{crumb}<header className="topik-exam-head"><div><p className="topik-kicker">TOPIK {exam.level} · seção {progress.section + 1} de {exam.sections.length}</p><h1>{section.name}</h1><p>Tarefa {progress.question + 1} de {section.questions.length}</p></div><strong className="topik-timer" aria-label={`Tempo restante: ${clock(remaining)}`}>{clock(remaining)}</strong></header>
    <div className="topik-progress" role="progressbar" aria-label="Progresso da seção" aria-valuenow={progress.question + 1} aria-valuemin={1} aria-valuemax={section.questions.length}><span style={{ width: `${(progress.question + 1) / section.questions.length * 100}%` }} /></div>
    <section className="topik-task" aria-labelledby="topik-question-title">
      {question.passage && <div className="topik-passage"><strong>Leia o texto</strong><p lang="ko">{question.passage}</p></div>}
      {question.audio && <div className="topik-audio"><p>Ouça antes de responder. A voz é gerada pelo navegador.</p><button className="topik-button topik-button--light" onClick={play}>▶ Ouvir trecho</button><button className="topik-text-button" onClick={() => setTranscript(value => !value)} aria-expanded={transcript}>{transcript ? 'Ocultar transcrição' : 'Mostrar transcrição'}</button>{audioError && <p role="alert">{audioError}</p>}{transcript && <p lang="ko">{question.audio}</p>}</div>}
      <h2 id="topik-question-title" lang="ko">{question.prompt}</h2>
      {question.options ? <fieldset><legend>Escolha uma resposta</legend>{question.options.map((option, index) => <label key={index} className={progress.answers[question.id] === index ? 'is-selected' : ''}><input type="radio" name={question.id} checked={progress.answers[question.id] === index} onChange={() => answer(index)} /><span>{index + 1}</span><span lang="ko">{option}</span></label>)}</fieldset> : <label className="topik-write"><span>Sua resposta em coreano</span><textarea lang="ko" rows={question.id.endsWith('54') ? 16 : question.id.endsWith('53') ? 9 : 3} value={String(progress.answers[question.id] ?? '')} onChange={event => answer(event.target.value)} />{question.guide && <small>{question.guide}</small>}<small>{String(progress.answers[question.id] ?? '').length} caracteres</small></label>}
    </section>
    <div className="topik-actions"><button className="topik-button topik-button--light" disabled={progress.question === 0} onClick={() => move(progress.question - 1)}>← Anterior</button>{progress.question + 1 < section.questions.length ? <button className="topik-button" onClick={() => move(progress.question + 1)}>Próxima →</button> : <button className="topik-button" onClick={nextSection}>{progress.section + 1 === exam.sections.length ? 'Ver relatório' : 'Iniciar próxima seção'} →</button>}</div>
    <p className="topik-source">Depois de avançar para outra seção, não é possível voltar. <a href="https://www.niied.go.kr/web/NIIED/contents/niiedEng/eng_topikOverview" target="_blank" rel="noopener noreferrer">Confira o formato oficial no NIIED.</a></p>
  </main>
}
