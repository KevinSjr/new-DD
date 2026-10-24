import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '../router/Link'
import { useLocation } from '../router/navigation'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './MextPage.css'

type Track = 'A' | 'B'
type Science = 'physics' | 'biology'
type Subject = 'japanese' | 'english' | 'math' | 'chemistry' | Science
type Question = {
  id: number; track: Track; subject: Subject; section: string; item_code: string; position: number;
  prompt: string; transcript: string; asset_paths: string[]; answer_type: 'choice' | 'numeric' | 'true-false' | 'text';
  choices: string[]; points: number; source_url: string; source_page: number
}
type Availability = { edition: number; track: Track; science: Science | null; ready: boolean; subjects: { subject: Subject; published: number; total: number; minutes: number }[] }
type Exam = Availability & { questions: Question[] }
type Daily = { available: boolean; track: Track; subject: Subject; needed?: number; published?: number; lives: number; maxLives: number; total: number; answered: number; correct: number; finished: boolean; question: Question | null; feedback?: { correct: boolean; acceptedAnswers: string[] } }
type Grade = { edition: number; track: Track; earned: number; maximum: number; sections: Record<Subject, { earned: number; maximum: number; correct: number; total: number }>; source: string; note: string }

const A_SUBJECTS: { key: Subject; label: string; minutes: number }[] = [
  { key:'japanese', label:'Japonês A', minutes:100 },
  { key:'english', label:'Inglês A', minutes:60 },
  { key:'math', label:'Matemática A', minutes:60 },
]
const B_SUBJECTS: { key: Subject; label: string; minutes: number }[] = [
  { key:'japanese', label:'Japonês B', minutes:100 },
  { key:'english', label:'Inglês B', minutes:60 },
  { key:'math', label:'Matemática B', minutes:60 },
  { key:'chemistry', label:'Química', minutes:60 },
  { key:'physics', label:'Física', minutes:60 },
  { key:'biology', label:'Biologia', minutes:60 },
]
const labelFor = (subject: Subject, track: Track) => (track === 'A' ? A_SUBJECTS : B_SUBJECTS).find(item => item.key === subject)?.label || subject

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers:init?.body ? { 'Content-Type':'application/json' } : undefined })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Não foi possível carregar. Confira a API e o banco de dados.')
  return data as T
}

function MextQuestion({ question, answer, onAnswer }: { question: Question; answer: string; onAnswer: (value: string) => void }) {
  return <section className="mext-question" aria-labelledby={`mext-question-${question.id}`}>
    <p className="mext-page__eyebrow">{labelFor(question.subject, question.track)} · Seção {question.section} · Item {question.item_code} · {question.points} {question.points === 1 ? 'ponto' : 'pontos'}</p>
    <h2 id={`mext-question-${question.id}`}>{question.prompt}</h2>
    <p className="mext-question__help">Leia o enunciado original na imagem. Use o controle de rolagem horizontal ou abra a imagem em outra aba para ampliar.</p>
    <div className="mext-question__images">
      {question.asset_paths.map((path, index) => <a key={path} href={path} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar página ${index + 1} do material original em nova aba`}>
        <img src={path} alt={`Página ${index + 1} do enunciado original do item ${question.item_code}. Transcrição automática disponível abaixo.`} loading="lazy" />
      </a>)}
    </div>
    <details className="mext-question__transcript"><summary>Ver transcrição automática em texto</summary>
      <p>Fórmulas, furigana e a ordem do texto podem diferir do PDF; a imagem original é a referência.</p>
      <pre>{question.transcript}</pre>
    </details>
    {question.answer_type === 'numeric' || question.answer_type === 'text' ? <label className="mext-question__number">Resposta para {question.item_code}
      <input type="text" inputMode={question.answer_type === 'numeric' ? 'decimal' : 'text'} autoComplete="off" value={answer} onChange={event => onAnswer(event.target.value)} placeholder={question.answer_type === 'numeric' ? 'Ex.: 5/16 ou 0,3125' : 'Use a notação do gabarito'} />
    </label> : <fieldset className="mext-question__choices"><legend>Selecione sua resposta</legend>
      {question.choices.map(choice => <label key={choice} className={answer === choice ? 'is-selected' : ''}>
        <input type="radio" name={`mext-${question.id}`} value={choice} checked={answer === choice} onChange={() => onAnswer(choice)} />
        <strong>{choice}</strong>
      </label>)}
    </fieldset>}
    <p className="mext-question__source"><a href={question.source_url} target="_blank" rel="noopener noreferrer">Ver PDF oficial da disciplina <span className="sr-only">(abre em nova aba)</span></a> · página {question.source_page}</p>
  </section>
}

export function MextHomePage() {
  useDocumentTitle('MEXT 2025: escolha seu modo | Daydreaming')
  const [availability, setAvailability] = useState<Availability[] | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { Promise.all([
    api<Availability>('/api/mext/exam/availability?track=A'),
    api<Availability>('/api/mext/exam/availability?track=B&science=physics'),
    api<Availability>('/api/mext/exam/availability?track=B&science=biology'),
  ]).then(results => {
    if (results[1].track !== 'B' || results[2].track !== 'B') throw new Error('A API ainda está na versão anterior. Reinicie a API para abrir o exame B.')
    setAvailability(results)
  }).catch(cause => setError(String(cause.message))) }, [])
  return <main className="mext-page container">
    <nav className="mext-page__breadcrumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span aria-hidden="true">/</span><span aria-current="page">MEXT</span></nav>
    <header className="mext-page__header"><p className="mext-page__eyebrow">Bolsa do governo japonês · provas anteriores</p><h1>Pratique o MEXT de graduação</h1>
      <p>Escolha um treino curto ou faça uma prova completa de 2025. A modalidade A reúne humanas; a B reúne ciências e exatas. Esta prática usa provas e gabaritos anteriores e não equivale à avaliação oficial.</p></header>
    <div className="mext-page__modes">
      <section className="mext-page__panel"><h2>Desafio diário</h2><p>Escolha a modalidade e uma disciplina. Cada combinação oferece cinco itens e três sóis próprios por dia.</p><Link className="mext-page__button" to="/exames/mext/desafio-diario">Escolher disciplina</Link></section>
      <section className="mext-page__panel"><h2>Modo exame · modalidade A</h2><p>Três provas na ordem de prática: Japonês (100 min), Inglês (60 min) e Matemática (60 min). O relatório apresenta pontos por disciplina.</p>
        <p className="mext-page__availability" aria-live="polite">{error || (availability ? availability[0].ready ? '147 itens prontos para o exame A' : availability[0].subjects.map(item => `${labelFor(item.subject, 'A')}: ${item.published}/${item.total}`).join(' · ') : 'Conferindo questões…')}</p>
        <Link className="mext-page__button mext-page__button--secondary" to="/exames/mext/exame?track=A">Abrir exame A</Link></section>
      <section className="mext-page__panel"><h2>Modo exame · modalidade B</h2><p>Japonês B, Inglês B, Matemática B, Química e Física ou Biologia. Selecione a ciência opcional antes de iniciar; cada disciplina tem cronômetro próprio.</p>
        <p className="mext-page__availability" aria-live="polite">{error || (availability ? availability[1].ready && availability[2].ready ? 'Exatas prontas: Física e Biologia disponíveis' : 'Conferindo itens da modalidade B…' : 'Conferindo questões…')}</p>
        <Link className="mext-page__button mext-page__button--secondary" to="/exames/mext/exame?track=B">Abrir exame B</Link></section>
    </div>
    <p className="mext-page__note">Antes de se candidatar, confira o edital e as exigências da representação japonesa responsável pela sua inscrição. <a href="https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/examination.html" target="_blank" rel="noopener noreferrer">Ver as provas oficiais de 2025<span className="sr-only"> (abre em nova aba)</span></a>.</p>
  </main>
}

export function MextDailyPage() {
  useDocumentTitle('Desafio diário MEXT | Daydreaming')
  const requestId = useRef(0)
  const [track, setTrack] = useState<Track>('A')
  const [subject, setSubject] = useState<Subject | null>(null)
  const [state, setState] = useState<Daily | null>(null)
  const [answer, setAnswer] = useState('')
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  function chooseTrack(next: Track) {
    ++requestId.current
    setTrack(next); setSubject(null); setState(null); setAnswer(''); setFeedbackVisible(false); setError('')
  }
  function chooseSubject(next: Subject) {
    const request = ++requestId.current
    setSubject(next); setState(null); setAnswer(''); setFeedbackVisible(false); setError('')
    api<Daily>(`/api/mext/daily?track=${track}&subject=${next}`).then(result => { if (result.track !== track) throw new Error('A API ainda está na versão anterior. Reinicie a API para usar a modalidade B.'); if (requestId.current === request) setState(result) }).catch(cause => { if (requestId.current === request) setError(String(cause.message)) })
  }
  async function submit() {
    if (!subject || !state?.question || !answer.trim()) return
    setBusy(true); setError('')
    try {
      const next = await api<Daily>('/api/mext/daily/answer', { method:'POST', body:JSON.stringify({ track, subject, questionId:state.question.id, answer }) })
      setState(next); setFeedbackVisible(true); setAnswer('')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível registrar a resposta.') }
    finally { setBusy(false) }
  }
  return <main className="mext-page container"><nav className="mext-page__breadcrumb"><Link to="/exames/mext">MEXT</Link><span aria-hidden="true">/</span><span aria-current="page">Desafio diário</span></nav>
    <header className="mext-page__header"><p className="mext-page__eyebrow">Prática curta · edição 2025</p><h1>Desafio diário MEXT</h1><p>Cada modalidade e disciplina têm cinco itens e três sóis. Um erro consome um sol dessa combinação; o desafio reinicia no próximo dia, no horário de Brasília.</p></header>
    <div className="mext-page__subject-picker" aria-label="Escolha a modalidade"><button className={`mext-page__button ${track === 'A' ? '' : 'mext-page__button--secondary'}`} aria-pressed={track === 'A'} onClick={() => chooseTrack('A')}>Humanas · A</button><button className={`mext-page__button ${track === 'B' ? '' : 'mext-page__button--secondary'}`} aria-pressed={track === 'B'} onClick={() => chooseTrack('B')}>Exatas · B</button></div>
    <div className="mext-page__subject-picker" aria-label="Escolha a disciplina">{(track === 'A' ? A_SUBJECTS : B_SUBJECTS).map(item => <button key={item.key} className={`mext-page__button ${subject === item.key ? '' : 'mext-page__button--secondary'}`} aria-pressed={subject === item.key} onClick={() => chooseSubject(item.key)}>{item.label}</button>)}</div>
    {error && <p className="mext-page__alert" role="alert">{error}</p>}
    {subject && !state && !error && <p>Carregando {labelFor(subject, track)}…</p>}
    {state && !state.available && <div className="mext-page__panel"><h2>Itens em preparação</h2><p>Há {state.published} de {state.needed} itens necessários nesta disciplina.</p></div>}
    {state?.available && <div className="mext-page__panel"><div className="mext-page__progress"><span>Itens: {state.answered}/{state.total}</span><span aria-label={`${state.lives} de ${state.maxLives} sóis restantes`}>{'☀'.repeat(state.lives)}{'○'.repeat(state.maxLives - state.lives)}</span></div>
      {feedbackVisible && state.feedback ? <div className={`mext-page__feedback ${state.feedback.correct ? 'is-correct' : 'is-incorrect'}`} role="status"><h2>{state.feedback.correct ? 'Resposta certa!' : 'Você perdeu um sol'}</h2><p>Gabarito: {state.feedback.acceptedAnswers.join(' ou ')}. Confira o item no material original para revisar.</p><button className="mext-page__button" onClick={() => setFeedbackVisible(false)}>{state.finished ? 'Ver resultado' : 'Próximo item'}</button></div>
      : state.finished ? <div className="mext-page__result"><h2>Desafio de hoje concluído</h2><p>{state.correct} acertos em {state.answered} itens respondidos.</p><p>Os sóis voltam amanhã. Seu progresso fica neste navegador por meio de um cookie anônimo.</p></div>
      : state.question && <><MextQuestion question={state.question} answer={answer} onAnswer={setAnswer} /><button className="mext-page__button" disabled={busy || !answer.trim()} onClick={submit}>{busy ? 'Conferindo…' : 'Responder'}</button></>}</div>}
  </main>
}

export function MextExamPage() {
  const { search } = useLocation()
  const track: Track = new URLSearchParams(search).get('track') === 'B' ? 'B' : 'A'
  useDocumentTitle(`Exame MEXT 2025 ${track} | Daydreaming`)
  const [science, setScience] = useState<Science>('physics')
  const subjects = useMemo(() => track === 'A' ? A_SUBJECTS : B_SUBJECTS.filter(item => item.key !== (science === 'physics' ? 'biology' : 'physics')), [track, science])
  const [exam, setExam] = useState<Exam | null>(null)
  const [error, setError] = useState('')
  const [started, setStarted] = useState(false)
  const [subjectIndex, setSubjectIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [deadline, setDeadline] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [grade, setGrade] = useState<Grade | null>(null)
  const [examEnded, setExamEnded] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    let active = true
    api<Exam>(`/api/mext/exam?track=${track}&science=${science}`).then(result => { if (result.track !== track) throw new Error('A API ainda está na versão anterior. Reinicie a API para abrir o exame B.'); if (active) setExam(result) }).catch(cause => { if (active) setError(String(cause.message)) })
    return () => { active = false }
  }, [track, science])
  const subject = subjects[subjectIndex]
  const questions = exam?.questions.filter(question => question.subject === subject.key) || []
  const question = questions[questionIndex]
  const beginSubject = useCallback((index: number) => {
    const seconds = subjects[index].minutes * 60
    setSubjectIndex(index); setQuestionIndex(0); setRemaining(seconds); setDeadline(Date.now() + seconds * 1000); setExamEnded(false)
  }, [subjects])
  const finish = useCallback(async () => {
    if (busy) return
    setBusy(true); setExamEnded(true); setError('')
    try {
      const result = await api<Grade>('/api/mext/exam/grade', { method:'POST', body:JSON.stringify({ track, science, answers:Object.entries(answers).map(([questionId, answer]) => ({ questionId:Number(questionId), answer })) }) })
      setGrade(result)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível corrigir o exame.') }
    finally { setBusy(false) }
  }, [answers, busy, track, science])
  const nextSubject = useCallback(() => {
    if (subjectIndex === subjects.length - 1) { void finish(); return }
    beginSubject(subjectIndex + 1)
  }, [subjectIndex, finish, beginSubject, subjects.length])
  useEffect(() => {
    if (!started || examEnded || grade || !deadline) return
    const tick = () => setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    tick(); const interval = window.setInterval(tick, 1000)
    const timeout = window.setTimeout(nextSubject, Math.max(0, deadline - Date.now()))
    return () => { window.clearInterval(interval); window.clearTimeout(timeout) }
  }, [started, examEnded, grade, deadline, nextSubject])
  return <main className="mext-page container"><nav className="mext-page__breadcrumb"><Link to="/exames/mext">MEXT</Link><span aria-hidden="true">/</span><span aria-current="page">Exame {track}</span></nav>
    <header className="mext-page__header"><p className="mext-page__eyebrow">Graduação · modalidade {track} · 2025</p><h1>Exame de prática: {track === 'A' ? 'humanas' : 'exatas'}</h1><p>{track === 'A' ? 'Três' : 'Cinco'} disciplinas, com cronômetros separados. Você pode deixar respostas em branco; o resultado soma os pontos de cada item conforme o gabarito fornecido.</p></header>
    {track === 'B' && !started && <fieldset className="mext-page__science"><legend>Escolha a ciência complementar para o exame B</legend><label><input type="radio" name="mext-science" value="physics" checked={science === 'physics'} onChange={() => { setScience('physics'); setExam(null); setError('') }} /> Física</label><label><input type="radio" name="mext-science" value="biology" checked={science === 'biology'} onChange={() => { setScience('biology'); setExam(null); setError('') }} /> Biologia</label></fieldset>}
    {error && <p className="mext-page__alert" role="alert">{error}</p>}
    {!exam && !error && <p>Carregando exame…</p>}
    {exam && !exam.ready && <div className="mext-page__panel"><h2>Exame em preparação</h2><ul>{exam.subjects.map(item => <li key={item.subject}>{labelFor(item.subject, track)}: {item.published}/{item.total}</li>)}</ul></div>}
    {exam?.ready && !started && <div className="mext-page__panel"><h2>Antes de começar</h2><p>Ordem da prática: {subjects.map(item => item.label).join(', ')}. Cada disciplina tem até 100 pontos. Respostas e resultado do exame não são salvos; recarregar a página recomeça a sessão.</p><p>Quando o tempo de uma disciplina terminar, a próxima começa automaticamente. Você também pode avançar antes.</p>{track === 'B' && <p>Em Matemática e Química, respostas abertas são corrigidas pelas formas cadastradas do gabarito. Uma forma equivalente pode exigir conferência manual com o PDF.</p>}<button className="mext-page__button" onClick={() => { setStarted(true); beginSubject(0) }}>Iniciar exame {track}</button></div>}
    {started && examEnded && !grade && <div className="mext-page__panel"><h2>Exame concluído</h2><p>{busy ? 'Corrigindo suas respostas…' : 'A correção não terminou. Tente novamente sem perder suas respostas.'}</p>{!busy && <button className="mext-page__button" onClick={() => void finish()}>Corrigir exame</button>}</div>}
    {started && !examEnded && !grade && question && <div className="mext-page__panel"><div className="mext-page__progress"><span>{subject.label} · item {questionIndex + 1}/{questions.length}</span><span aria-live="off">Tempo: {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</span></div>
      <MextQuestion question={question} answer={answers[question.id] || ''} onAnswer={value => setAnswers(current => ({ ...current, [question.id]:value }))} />
      <div className="mext-page__actions"><button className="mext-page__button mext-page__button--secondary" disabled={questionIndex === 0} onClick={() => setQuestionIndex(questionIndex - 1)}>Anterior</button>
        {questionIndex < questions.length - 1 ? <button className="mext-page__button" onClick={() => setQuestionIndex(questionIndex + 1)}>Próximo</button> : <button className="mext-page__button" disabled={busy} onClick={nextSubject}>{subjectIndex === subjects.length - 1 ? 'Corrigir exame' : 'Concluir disciplina'}</button>}</div>
    </div>}
    {grade && <section className="mext-page__panel mext-page__report" aria-live="polite"><p className="mext-page__eyebrow">Exame {track} · edição 2025</p><h2>Seu relatório de prática</h2><p className="mext-page__report-total">{grade.earned} <span>de {grade.maximum} pontos</span></p>
      <div className="mext-page__report-subjects">{subjects.map(item => <div key={item.key}><h3>{item.label}</h3><p>{grade.sections[item.key].earned}/100 pontos</p><p>{grade.sections[item.key].correct}/{grade.sections[item.key].total} itens corretos</p></div>)}</div>
      <p>{grade.note} <a href={grade.source} target="_blank" rel="noopener noreferrer">Consultar a fonte oficial<span className="sr-only"> (abre em nova aba)</span></a>.</p><p>Respostas e relatório não são salvos; recarregar apaga o resultado.</p><Link className="mext-page__button mext-page__button--secondary" to="/exames/mext">Voltar ao MEXT</Link>
    </section>}
  </main>
}
