import { useEffect, useState } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { hskExams, type HskExam, type HskLevel } from '../data/hskPractice'
import './TopikPage.css'

type Progress = { phase: 'intro' | 'exam' | 'results'; section: number; question: number; deadline: number; answers: Record<string, number | string> }
const empty = (): Progress => ({ phase: 'intro', section: 0, question: 0, deadline: 0, answers: {} })
const storageKey = (level: HskLevel) => `daydreaming-hsk-${level}-exam-1`
function load(level: HskLevel, exam: HskExam): Progress {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey(level)) || 'null') as Progress | null
    if (saved && ['intro', 'exam', 'results'].includes(saved.phase) && Number.isInteger(saved.section) && saved.section >= 0 && saved.section < exam.sections.length && Number.isInteger(saved.question) && saved.question >= 0 && saved.question < exam.sections[saved.section].questions.length && Number.isFinite(saved.deadline) && saved.answers && typeof saved.answers === 'object') return saved
  } catch { /* armazenamento indisponível */ }
  return empty()
}
const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
const source = 'https://www.chinesetest.cn/userfiles/upload/1418809036299.pdf'

export function HskPage() {
  useDocumentTitle('Simulados inspirados no HSK | Daydreaming')
  return <main className="topik-page container">
    <nav className="topik-crumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span>/</span>HSK</nav>
    <header className="topik-hero"><div><p className="topik-kicker">Prática de mandarim</p><h1>Escolha seu nível HSK</h1><p>Seis simulados autorais, do HSK 1 ao HSK 6, com a quantidade de tarefas e a duração publicadas para a estrutura anterior ao HSK 3.0.</p></div><span lang="zh-Hans" aria-hidden="true">汉语</span></header>
    <p className="topik-notice"><strong>Estes testes não são oficiais.</strong> As questões, os textos e a escuta são autorais e simplificados. Tarefas que usam imagens na prova real foram adaptadas para texto. O formato quantitativo segue a estrutura publicada dos níveis 1–6; não representa o HSK 3.0 anunciado para dezembro de 2026. O resultado não é certificado nem previsão de aprovação.</p>
    <section aria-labelledby="hsk-choose"><h2 id="hsk-choose">Exame 1 por nível</h2><div className="topik-choices">{hskExams.map(exam => <article className="topik-choice" key={exam.level}><span className="topik-choice__level">{exam.level}</span><div><h3>HSK {exam.level}</h3><p>{exam.questions.length} tarefas · {exam.duration} minutos no formato publicado, incluindo 5 minutos administrativos</p><ul>{exam.sections.map(section => <li key={section.id}>{section.name}: <strong>{section.questions.length} {section.id === 'writing' ? 'tarefas' : 'questões'} · {section.minutes} min</strong></li>)}</ul><Link className="topik-button" to={`/exames/hsk/${exam.level}`}>Abrir Exame 1 <span aria-hidden="true">→</span></Link></div></article>)}</div></section>
    <p className="topik-source">Referência para quantidades e duração: <a href={source} target="_blank" rel="noopener noreferrer">estrutura publicada pelo Chinese Test Service</a>. A nova versão HSK 3.0 tem regras e materiais próprios.</p>
  </main>
}

export function HskExamPage({ level }: { level: string }) {
  const exam = hskExams.find(item => String(item.level) === level)
  if (!exam) return null
  return <ExamView key={exam.level} exam={exam} />
}

function ExamView({ exam }: { exam: HskExam }) {
  useDocumentTitle(`HSK ${exam.level} · Exame 1 | Daydreaming`)
  const [progress, setProgress] = useState<Progress>(() => load(exam.level, exam))
  const [now, setNow] = useState(Date.now)
  const [audioError, setAudioError] = useState('')
  const [showTranscript, setShowTranscript] = useState(false)
  const section = exam.sections[progress.section]
  const question = section.questions[progress.question]
  const remaining = progress.phase === 'exam' ? Math.max(0, Math.ceil((progress.deadline - now) / 1000)) : section.minutes * 60
  const breadcrumb = <nav className="topik-crumb" aria-label="Você está em"><Link to="/exames/hsk">HSK</Link><span>/</span><span>HSK {exam.level} · Exame 1</span></nav>

  useEffect(() => { try { sessionStorage.setItem(storageKey(exam.level), JSON.stringify(progress)) } catch { /* armazenamento indisponível */ } }, [exam.level, progress])
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
    setNow(tick); setAudioError(''); setShowTranscript(false)
    setProgress({ phase: 'exam', section: 0, question: 0, deadline: tick + exam.sections[0].minutes * 60000, answers: {} })
  }
  function answer(value: number | string) { setProgress(current => ({ ...current, answers: { ...current.answers, [question.id]: value } })) }
  function move(index: number) { window.speechSynthesis?.cancel(); setAudioError(''); setShowTranscript(false); setProgress(current => ({ ...current, question: index })) }
  function nextSection() {
    window.speechSynthesis?.cancel(); setAudioError(''); setShowTranscript(false)
    const tick = Date.now(); setNow(tick)
    setProgress(current => current.section + 1 >= exam.sections.length ? { ...current, phase: 'results' }
      : { ...current, section: current.section + 1, question: 0, deadline: tick + exam.sections[current.section + 1].minutes * 60000 })
  }
  function play() {
    if (!question.audio || !('speechSynthesis' in window)) { setAudioError('Áudio indisponível. Abra a transcrição para continuar.'); return }
    const voice = window.speechSynthesis.getVoices().find(item => item.lang.toLowerCase().startsWith('zh'))
    if (!voice) { setAudioError('Voz em mandarim indisponível neste dispositivo. Abra a transcrição para continuar.'); return }
    const utterance = new SpeechSynthesisUtterance(question.audio)
    utterance.lang = 'zh-CN'; utterance.voice = voice; utterance.rate = exam.level <= 2 ? .8 : .95
    utterance.onerror = () => setAudioError('Não foi possível reproduzir o áudio. Abra a transcrição para continuar.')
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); setAudioError('')
  }

  if (progress.phase === 'intro') return <main className="topik-page container">{breadcrumb}<header className="topik-hero"><div><p className="topik-kicker">HSK {exam.level} · Exame 1</p><h1>Prepare sua prática</h1><p>{exam.questions.length} tarefas nas seções de escuta, leitura{exam.level >= 3 ? ' e escrita' : ''}.</p></div><span lang="zh-Hans" aria-hidden="true">汉语</span></header>
    <p className="topik-notice"><strong>Simulado inspirado no HSK, não oficial.</strong> O tempo das questões soma {exam.duration - 5} minutos; os outros 5 minutos da duração publicada são para dados pessoais e não são simulados. Textos e áudios sintéticos são mais curtos que os da prova real, e itens com imagens foram adaptados para texto. {exam.level >= 3 ? 'A escrita fica registrada, sem correção automática.' : ''}</p>
    <div className="topik-overview">{exam.sections.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, '0')}</span><h2>{item.name}</h2><p>{item.questions.length} {item.id === 'writing' ? 'tarefas' : 'questões'} · {item.minutes} minutos</p></article>)}</div>
    <p>O cronômetro continua após recarregar a página. Respostas ficam apenas nesta sessão do navegador; não é possível voltar a uma seção encerrada.</p><button className="topik-button" onClick={begin}>Começar Exame 1</button>
  </main>

  if (progress.phase === 'results') {
    const objective = exam.questions.filter(item => item.skill !== 'writing')
    const hits = objective.filter(item => progress.answers[item.id] === item.answer).length
    return <main className="topik-page container">{breadcrumb}<header className="topik-hero"><div><p className="topik-kicker">Relatório de prática</p><h1>HSK {exam.level}: {hits} de {objective.length} acertos objetivos</h1><p>O resultado não equivale a pontos, aprovação ou certificado oficial HSK.</p></div></header>
      <div className="topik-report">{exam.sections.map(item => { const answered = item.questions.filter(q => progress.answers[q.id] !== undefined && progress.answers[q.id] !== '').length; const correct = item.id === 'writing' ? null : item.questions.filter(q => progress.answers[q.id] === q.answer).length; return <article key={item.id}><h2>{item.name}</h2><strong>{correct === null ? `${answered} / ${item.questions.length}` : `${correct} / ${item.questions.length}`}</strong><p>{correct === null ? 'tarefas registradas · sem correção automática' : `${answered} respondidas`}</p></article> })}</div>
      <p className="topik-notice">As alternativas e os textos são autorais. Tarefas abertas exigem avaliação humana; por isso, não convertemos acertos em nota oficial ou nível de proficiência.</p>
      <section className="topik-review"><h2>Revisar respostas</h2>{exam.sections.map(item => <details key={item.id}><summary>{item.name}</summary><ol>{item.questions.map(q => <li key={q.id}><strong lang="zh-Hans">{q.prompt}</strong>{q.passage && <p lang="zh-Hans">Texto: {q.passage}</p>}{q.audio && <p lang="zh-Hans">Transcrição: {q.audio}</p>}{q.options ? <><p>Sua resposta: {typeof progress.answers[q.id] === 'number' ? q.options[progress.answers[q.id] as number] : 'Não respondida'}</p><p>Resposta esperada: {q.options[q.answer!]}</p></> : <><p>Sua escrita:</p><p lang="zh-Hans" className="topik-saved">{progress.answers[q.id] || 'Não respondida.'}</p><p>{q.guide}</p></>}</li>)}</ol></details>)}</section>
      <div className="topik-actions"><button className="topik-button" onClick={begin}>Refazer Exame 1</button><Link className="topik-button topik-button--light" to="/exames/hsk">Escolher outro nível</Link></div>
    </main>
  }

  return <main className="topik-page container">{breadcrumb}<header className="topik-exam-head"><div><p className="topik-kicker">HSK {exam.level} · seção {progress.section + 1} de {exam.sections.length}</p><h1>{section.name}</h1><p>Tarefa {progress.question + 1} de {section.questions.length}</p></div><strong className="topik-timer" aria-label={`Tempo restante: ${clock(remaining)}`}>{clock(remaining)}</strong></header>
    <div className="topik-progress" role="progressbar" aria-label="Progresso da seção" aria-valuenow={progress.question + 1} aria-valuemin={1} aria-valuemax={section.questions.length}><span style={{ width: `${(progress.question + 1) / section.questions.length * 100}%` }} /></div>
    <section className="topik-task" aria-labelledby="hsk-question-title">
      {question.passage && <div className="topik-passage"><strong>Leia o texto</strong><p lang="zh-Hans">{question.passage}</p></div>}
      {question.audio && <div className="topik-audio"><p>Ouça antes de responder. A voz é gerada pelo navegador.</p><button className="topik-button topik-button--light" onClick={play}>▶ Ouvir trecho</button><button className="topik-text-button" onClick={() => setShowTranscript(value => !value)} aria-expanded={showTranscript}>{showTranscript ? 'Ocultar transcrição' : 'Mostrar transcrição'}</button>{audioError && <p role="alert">{audioError}</p>}{showTranscript && <p lang="zh-Hans">{question.audio}</p>}</div>}
      <h2 id="hsk-question-title" lang="zh-Hans">{question.prompt}</h2>
      {question.options ? <fieldset><legend>Escolha uma resposta</legend>{question.options.map((option, index) => <label key={index} className={progress.answers[question.id] === index ? 'is-selected' : ''}><input type="radio" name={question.id} checked={progress.answers[question.id] === index} onChange={() => answer(index)} /><span>{index + 1}</span><span lang="zh-Hans">{option}</span></label>)}</fieldset> : <label className="topik-write"><span>Sua resposta em chinês</span><textarea lang="zh-Hans" rows={exam.level === 6 ? 16 : exam.level === 5 && progress.question >= 8 ? 8 : 3} value={String(progress.answers[question.id] ?? '')} onChange={event => answer(event.target.value)} />{question.guide && <small>{question.guide}</small>}<small>{String(progress.answers[question.id] ?? '').length} caracteres</small></label>}
    </section>
    <div className="topik-actions"><button className="topik-button topik-button--light" disabled={progress.question === 0} onClick={() => move(progress.question - 1)}>← Anterior</button>{progress.question + 1 < section.questions.length ? <button className="topik-button" onClick={() => move(progress.question + 1)}>Próxima →</button> : <button className="topik-button" onClick={nextSection}>{progress.section + 1 === exam.sections.length ? 'Ver relatório' : 'Iniciar próxima seção'} →</button>}</div>
    <p className="topik-source">Ao avançar, a seção anterior fica encerrada. <a href={source} target="_blank" rel="noopener noreferrer">Consulte a estrutura publicada pelo Chinese Test Service.</a></p>
  </main>
}
