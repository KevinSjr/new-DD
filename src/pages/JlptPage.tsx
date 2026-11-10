import { useEffect, useState } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { type JlptLevel } from '../data/jlptBlueprint.ts'
import { JLPT_LEVELS, jlptExams, jlptSkillNames, type JlptExam } from '../data/jlptPractice.ts'
import './JlptPage.css'

type Progress = { phase: 'intro' | 'exam' | 'results'; section: number; question: number; deadline: number; answers: Record<string, number> }
const initial = (): Progress => ({ phase: 'intro', section: 0, question: 0, deadline: 0, answers: {} })
const storageKey = (level: JlptLevel) => `daydreaming-jlpt-${level}-exam-1`
function load(level: JlptLevel): Progress {
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey(level)) || 'null') as Progress | null
    if (value && ['intro', 'exam', 'results'].includes(value.phase) && Number.isInteger(value.section)
      && Number.isInteger(value.question) && Number.isFinite(value.deadline) && value.answers && typeof value.answers === 'object') return value
  } catch { /* armazenamento indisponível */ }
  return initial()
}
const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

export function JlptPage() {
  useDocumentTitle('Simulados inspirados no JLPT | Daydreaming')
  return <main className="jlpt-page container">
    <nav className="jlpt-crumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span>/</span><span>JLPT</span></nav>
    <header className="jlpt-hero">
      <div><p className="jlpt-eyebrow">Prática de japonês</p><h1>Escolha o nível que quer praticar</h1><p>Um Exame 1 autoral para cada nível do N5 ao N1, com vocabulário, gramática, leitura e compreensão auditiva.</p></div>
      <div className="jlpt-hero__symbol" aria-hidden="true">日<span>本</span>語</div>
    </header>
    <p className="jlpt-alert"><strong>Não é um exame oficial.</strong> Este é um teste inspirado no formato do JLPT. As questões e os textos são autorais e simplificados, especialmente nos níveis avançados. O resultado mostra acertos, sem reproduzir a pontuação escalonada ou um certificado.</p>
    <section aria-labelledby="jlpt-levels"><h2 id="jlpt-levels">Exame 1 por nível</h2><div className="jlpt-levels">{JLPT_LEVELS.map(level => {
      const exam = jlptExams.find(item => item.level === level)!
      const duration = exam.sections.reduce((sum, section) => sum + section.minutes, 0)
      return <article className="jlpt-level" key={level}>
        <span className="jlpt-level__badge">{level}</span><div><h3>{level === 'N5' ? 'Primeiros passos' : level === 'N4' ? 'Fundamentos' : level === 'N3' ? 'Intermediário' : level === 'N2' ? 'Avançado' : 'Proficiência avançada'}</h3><p>{exam.questions.length} questões · {duration} minutos de prova · {exam.sections.length} seções</p></div>
        <Link to={`/exames/jlpt/${level.toLowerCase()}`} className="jlpt-button">Abrir exame <span aria-hidden="true">→</span></Link>
      </article>
    })}</div></section>
    <p className="jlpt-source">Tempos e composição: <a href="https://www.jlpt.jp/e/guideline/testsections.html" target="_blank" rel="noopener noreferrer">JLPT oficial</a>. A quantidade de itens da prova real pode variar entre aplicações. <a href="https://www.jlpt.jp/e/samples/sampleindex.html" target="_blank" rel="noopener noreferrer">Consulte também os cadernos oficiais de prática.</a></p>
  </main>
}

export function JlptExamPage({ level }: { level: string }) {
  const exam = jlptExams.find(item => item.level.toLowerCase() === level)
  if (!exam) return null
  return <ExamView key={exam.level} exam={exam} />
}

function ExamView({ exam }: { exam: JlptExam }) {
  useDocumentTitle(`JLPT ${exam.level} · Exame 1 | Daydreaming`)
  const [progress, setProgress] = useState<Progress>(() => load(exam.level))
  const [now, setNow] = useState(Date.now)
  const [audioError, setAudioError] = useState('')
  const [transcript, setTranscript] = useState(false)
  const section = exam.sections[progress.section] || exam.sections[0]
  const question = section.questions[progress.question] || section.questions[0]
  const remaining = progress.phase === 'exam' ? Math.max(0, Math.ceil((progress.deadline - now) / 1000)) : section.minutes * 60
  const breadcrumb = <nav className="jlpt-crumb" aria-label="Você está em"><Link to="/exames/jlpt">JLPT</Link><span>/</span><span>{exam.level} · Exame 1</span></nav>

  useEffect(() => { try { sessionStorage.setItem(storageKey(exam.level), JSON.stringify(progress)) } catch { /* armazenamento indisponível */ } }, [exam.level, progress])
  useEffect(() => {
    if (progress.phase !== 'exam') return
    const timer = window.setInterval(() => {
      const tick = Date.now()
      setNow(tick)
      if (tick >= progress.deadline) {
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
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [exam, progress.phase, progress.deadline])
  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  function begin() {
    const tick = Date.now()
    setNow(tick); setAudioError(''); setTranscript(false)
    setProgress({ phase: 'exam', section: 0, question: 0, deadline: tick + exam.sections[0].minutes * 60000, answers: {} })
  }
  function select(index: number) { setProgress(current => ({ ...current, answers: { ...current.answers, [question.id]: index } })) }
  function move(next: number) { window.speechSynthesis?.cancel(); setAudioError(''); setTranscript(false); setProgress(current => ({ ...current, question: next })) }
  function nextSection() {
    window.speechSynthesis?.cancel(); setAudioError(''); setTranscript(false)
    const tick = Date.now(); setNow(tick)
    setProgress(current => current.section + 1 >= exam.sections.length ? { ...current, phase: 'results' }
      : { ...current, section: current.section + 1, question: 0, deadline: tick + exam.sections[current.section + 1].minutes * 60000 })
  }
  function play() {
    if (!question.audio || !('speechSynthesis' in window)) { setAudioError('Áudio indisponível neste navegador. Abra a transcrição para continuar.'); return }
    const voice = window.speechSynthesis.getVoices().find(item => item.lang.toLowerCase().startsWith('ja'))
    if (!voice) { setAudioError('Voz japonesa indisponível neste dispositivo. Abra a transcrição para continuar.'); return }
    const utterance = new SpeechSynthesisUtterance(question.audio)
    utterance.lang = 'ja-JP'; utterance.voice = voice; utterance.rate = exam.level === 'N5' || exam.level === 'N4' ? .82 : .94
    utterance.onerror = () => setAudioError('Não foi possível reproduzir a voz. Abra a transcrição para continuar.')
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); setAudioError('')
  }

  if (progress.phase === 'intro') return <main className="jlpt-page container">{breadcrumb}<header className="jlpt-hero"><div><p className="jlpt-eyebrow">{exam.level} · Exame 1</p><h1>Prática inspirada no JLPT {exam.level}</h1><p>{exam.questions.length} questões autorais, com os tempos de cada seção iguais aos divulgados para o exame.</p></div><div className="jlpt-hero__symbol" aria-hidden="true">日<span>本</span>語</div></header>
    <p className="jlpt-alert"><strong>Este teste não é oficial.</strong> A contagem é uma referência aproximada: o JLPT pode variar o número de questões. Audição usa a voz japonesa do navegador; se ela não estiver disponível, há transcrição. Acertos não são convertidos na nota oficial de 0 a 180.</p>
    <section className="jlpt-overview" aria-label="Seções do simulado">{exam.sections.map((part, index) => <div key={part.id}><span>{String(index + 1).padStart(2, '0')}</span><h2>{part.title}</h2><p>{part.questions.length} questões · {part.minutes} min</p></div>)}</section>
    <p>O cronômetro inicia ao começar e continua se você recarregar a aba. As respostas ficam apenas nesta sessão do navegador.</p><button className="jlpt-button" onClick={begin}>Começar Exame 1</button>
  </main>

  if (progress.phase === 'results') {
    const correct = exam.questions.filter(item => progress.answers[item.id] === item.answer).length
    return <main className="jlpt-page container">{breadcrumb}<header className="jlpt-hero"><div><p className="jlpt-eyebrow">Relatório · {exam.level}</p><h1>{correct} de {exam.questions.length} acertos</h1><p>Este relatório é uma revisão da prática. Não é a nota oficial, não prevê aprovação e não equivale a certificado JLPT.</p></div></header>
      <div className="jlpt-report">{(['vocabulary', 'grammar', 'reading', 'listening'] as const).map(skill => {
        const items = exam.questions.filter(item => item.skill === skill)
        const hits = items.filter(item => progress.answers[item.id] === item.answer).length
        return <article key={skill}><h2>{jlptSkillNames[skill]}</h2><strong>{hits} / {items.length}</strong><p>{Math.round(hits / items.length * 100)}% de acertos neste simulado</p></article>
      })}</div>
      <p className="jlpt-alert">O JLPT usa pontuação escalonada, calculada pelo padrão de respostas. Por isso, não transformamos a porcentagem de acertos em pontos de 0 a 180 nem aplicamos os cortes oficiais a este resultado.</p>
      <section className="jlpt-review"><h2>Revisar respostas</h2>{exam.sections.map(part => <details key={part.id}><summary>{part.title}</summary><ol>{part.questions.map(item => <li key={item.id}><strong>{item.prompt}</strong><p>Sua resposta: {progress.answers[item.id] === undefined ? 'Não respondida' : item.options[progress.answers[item.id]]}</p><p>Resposta esperada: {item.options[item.answer]}</p>{item.context && <p>Texto: {item.context}</p>}{item.audio && <p>Transcrição: {item.audio}</p>}</li>)}</ol></details>)}</section>
      <div className="jlpt-actions"><button className="jlpt-button" onClick={begin}>Refazer Exame 1</button><Link to="/exames/jlpt" className="jlpt-button jlpt-button--light">Escolher outro nível</Link></div>
    </main>
  }

  return <main className="jlpt-page container">{breadcrumb}<header className="jlpt-exam-head"><div><p className="jlpt-eyebrow">{exam.level} · seção {progress.section + 1} de {exam.sections.length}</p><h1>{section.title}</h1><p>Questão {progress.question + 1} de {section.questions.length} · {jlptSkillNames[question.skill]}</p></div><strong className="jlpt-timer" aria-label={`Tempo restante: ${clock(remaining)}`}>{clock(remaining)}</strong></header>
    <div className="jlpt-progress" role="progressbar" aria-label="Progresso da seção" aria-valuenow={progress.question + 1} aria-valuemin={1} aria-valuemax={section.questions.length}><span style={{ width: `${(progress.question + 1) / section.questions.length * 100}%` }} /></div>
    <section className="jlpt-question" aria-labelledby="jlpt-question-title"><p className="jlpt-question__type">{question.type}</p>
      {question.context && <div className="jlpt-context"><strong>Texto</strong><p lang="ja">{question.context}</p></div>}
      {question.audio && <div className="jlpt-audio"><p>Ouça antes de responder. A voz é gerada pelo seu navegador.</p><button type="button" className="jlpt-button jlpt-button--light" onClick={play}>▶ Ouvir trecho</button><button type="button" className="jlpt-transcript" onClick={() => setTranscript(value => !value)} aria-expanded={transcript}>{transcript ? 'Ocultar transcrição' : 'Mostrar transcrição'}</button>{audioError && <p role="alert">{audioError}</p>}{transcript && <p lang="ja">{question.audio}</p>}</div>}
      <h2 id="jlpt-question-title" lang="ja">{question.prompt}</h2>
      <fieldset><legend>Escolha uma resposta</legend>{question.options.map((option, index) => <label key={index} className={progress.answers[question.id] === index ? 'is-selected' : ''}><input type="radio" name={question.id} checked={progress.answers[question.id] === index} onChange={() => select(index)} /><span>{index + 1}</span><span lang="ja">{option}</span></label>)}</fieldset>
    </section>
    <div className="jlpt-navigation"><button className="jlpt-button jlpt-button--light" disabled={progress.question === 0} onClick={() => move(progress.question - 1)}>← Anterior</button>{progress.question + 1 < section.questions.length ? <button className="jlpt-button" onClick={() => move(progress.question + 1)}>Próxima questão →</button> : <button className="jlpt-button" onClick={nextSection}>{progress.section + 1 === exam.sections.length ? 'Ver relatório' : 'Iniciar próxima seção'} →</button>}</div>
    <p className="jlpt-source">Ao avançar para outra seção, você não poderá voltar. Os tempos e as contagens foram conferidos em <a href="https://www.jlpt.jp/e/guideline/testsections.html" target="_blank" rel="noopener noreferrer">fontes oficiais</a>; questões e áudios são autorais.</p>
  </main>
}
