import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './SatPage.css'

type Question = {
  id: number; form_code: FormCode; section: SatSection; module_number: number; question_number: number;
  passage: string; prompt: string; choices: { key: string; text: string }[]; answer_type: 'multiple-choice' | 'numeric'; image_path: string | null
}
type FormCode = 'practice-4-paper' | 'practice-5-paper' | 'practice-6-paper' | 'practice-7-paper' | 'practice-8-paper' | 'practice-9-paper'
const formCodes: FormCode[] = ['practice-4-paper', 'practice-5-paper', 'practice-6-paper', 'practice-7-paper', 'practice-8-paper', 'practice-9-paper']
const testNumber = (formCode: FormCode) => formCode.split('-')[1]
type SatSection = 'reading-writing' | 'math'
type DailyState = { available: boolean; section?: SatSection; needed?: number; published?: number; lives: number; maxLives: number; total: number; answered: number; correct: number; finished: boolean; question: Question | null; feedback?: { correct: boolean; acceptedAnswers: string[]; explanation: string } }
type ExamState = { formCode: FormCode; ready: boolean; modules: { section: string; module_number: number; total: number; published: number; minutes: number }[]; questions: Question[] }
type ScoreRange = { lower: number; upper: number }
type Grade = {
  formCode: FormCode; correct: number; total: number; scoreRange: ScoreRange; scoringSource: string; note: string;
  sections: Record<'reading-writing' | 'math', { correct: number; total: number; scoreRange: ScoreRange }>;
  modules: { section: 'reading-writing' | 'math'; moduleNumber: number; correct: number; total: number }[];
}

const formatRange = ({ lower, upper }: ScoreRange) => lower === upper ? String(lower) : `${lower}–${upper}`

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: init?.body ? { 'Content-Type':'application/json' } : undefined })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Não foi possível carregar. Confira a API e o banco de dados.')
  return data as T
}

function QuestionView({ question, answer, onAnswer }: { question: Question; answer: string; onAnswer: (answer: string) => void }) {
  return <div className="sat-question" key={question.id}>
    <p className="sat-question__label">Teste {testNumber(question.form_code)} · {question.section === 'math' ? 'Matemática' : 'Leitura e escrita'} · Módulo {question.module_number} · Questão {question.question_number}</p>
    {question.image_path ? <>
      <div className="sat-question__image-frame" tabIndex={0} role="region" aria-label={`Questão ${question.question_number}: deslize ou use as setas para ler a imagem completa`}>
        <img className="sat-question__image" src={question.image_path} alt={`Enunciado original da questão ${question.question_number}. Há uma transcrição em texto a seguir.`} />
      </div>
      {question.passage && <details className="sat-question__transcript"><summary>Consultar transcrição em texto</summary>
        <p>Transcrição automática do PDF: fórmulas e gráficos podem não estar completos. Em caso de dúvida, consulte a imagem acima.</p>
        <p className="sat-question__passage">{question.passage}</p>
      </details>}
    </> : question.passage && <p className="sat-question__passage">{question.passage}</p>}
    <h2>{question.prompt}</h2>
    {question.answer_type === 'multiple-choice' ? <fieldset className="sat-question__choices"><legend>{question.image_path ? 'Marque a alternativa indicada na imagem' : 'Escolha uma alternativa'}</legend>
      {question.choices.map(choice => <label key={choice.key} className={answer === choice.key ? 'is-selected' : ''}>
        <input type="radio" name={`sat-${question.id}`} value={choice.key} checked={answer === choice.key} onChange={() => onAnswer(choice.key)} />
        <strong>{choice.key}</strong><span>{question.image_path ? `Alternativa ${choice.key}` : choice.text}</span>
      </label>)}
    </fieldset> : <label className="sat-question__numeric">Sua resposta<input value={answer} onChange={event => onAnswer(event.target.value)} inputMode="decimal" autoComplete="off" /></label>}
  </div>
}

export function SatHomePage() {
  useDocumentTitle('SAT: escolha seu modo | Daydreaming')
  const [availability, setAvailability] = useState<ExamState[] | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { Promise.all(formCodes.map(form => api<ExamState>(`/api/sat/exam/availability?form=${form}`))).then(setAvailability).catch(cause => setError(String(cause.message))) }, [])
  return <main className="sat-page container">
    <nav className="sat-page__breadcrumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span aria-hidden="true">/</span><span aria-current="page">SAT</span></nav>
    <header className="sat-page__header"><p className="sat-page__eyebrow">SAT · preparação</p><h1>Como você quer praticar hoje?</h1>
      <p>Escolha um treino curto com sóis ou reserve tempo para um simulado completo. Seus acertos aqui não geram pontuação oficial do SAT.</p></header>
    <div className="sat-page__modes">
      <section className="sat-page__mode"><span aria-hidden="true" className="sat-page__symbol">☀</span><h2>Desafio diário</h2>
        <p>Escolha Leitura e escrita ou Matemática. Cada área oferece cinco questões e três sóis por dia, misturando questões dos testes 4 a 9. Seu progresso fica associado a um cookie anônimo neste navegador.</p>
        <Link className="sat-page__button" to="/exames/sat/desafio-diario">Escolher área do desafio</Link></section>
      <section className="sat-page__mode"><span aria-hidden="true" className="sat-page__symbol">◷</span><h2>Modo exame</h2>
        <p>Escolha um dos testes práticos nº 4 a 9. Cada um tem quatro módulos e 120 questões em papel; nenhum reproduz o SAT digital adaptativo.</p>
        <p className="sat-page__availability" aria-live="polite">{error || (availability ? availability.map(item => `Teste ${testNumber(item.formCode)}: ${item.ready ? 'pronto' : `${item.modules.reduce((sum, module) => sum + module.published, 0)}/120 publicadas`}`).join(' · ') : 'Conferindo questões…')}</p>
        <Link className="sat-page__button sat-page__button--secondary" to="/exames/sat/simulado">Escolher teste completo</Link></section>
    </div>
    <p className="sat-page__note">O SAT digital atual tem 54 questões de Reading and Writing em 64 minutos e 44 de Math em 70 minutos, divididas em dois módulos por seção. O segundo módulo é adaptativo; esta plataforma ainda não reproduz essa adaptação. <a href="https://satsuite.collegeboard.org/sat/whats-on-the-test/structure" target="_blank" rel="noopener noreferrer">Confira o formato no College Board<span className="sr-only"> (abre em nova aba)</span></a>.</p>
  </main>
}

export function SatDailyPage() {
  useDocumentTitle('Desafio diário SAT | Daydreaming')
  const requestId = useRef(0)
  const [section, setSection] = useState<SatSection | null>(null)
  const [state, setState] = useState<DailyState | null>(null)
  const [answer, setAnswer] = useState('')
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  function chooseSection(nextSection: SatSection) {
    const currentRequest = ++requestId.current
    setSection(nextSection); setState(null); setAnswer(''); setFeedbackVisible(false); setError('')
    api<DailyState>(`/api/sat/daily?section=${nextSection}`).then(result => { if (requestId.current === currentRequest) setState(result) }).catch(cause => { if (requestId.current === currentRequest) setError(String(cause.message)) })
  }
  async function submit() {
    if (!state?.question || !answer.trim()) return
    setBusy(true); setError('')
    try {
      const next = await api<DailyState>('/api/sat/daily/answer', { method:'POST', body:JSON.stringify({ section, questionId:state.question.id, answer }) })
      setState(next); setFeedbackVisible(true); setAnswer('')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível registrar a resposta.') }
    finally { setBusy(false) }
  }
  return <main className="sat-page container"><nav className="sat-page__breadcrumb"><Link to="/exames/sat">SAT</Link><span aria-hidden="true">/</span><span aria-current="page">Desafio diário</span></nav>
    <header className="sat-page__header"><p className="sat-page__eyebrow">Um passo por dia</p><h1>Desafio diário do SAT</h1><p>Escolha uma área. Cada uma tem cinco questões e três sóis próprios; a cada erro você perde um sol daquela área. Eles voltam no próximo dia, no horário de Brasília.</p></header>
    <div className="sat-page__section-choices" aria-label="Área do desafio">
      <button className={`sat-page__button ${section === 'reading-writing' ? '' : 'sat-page__button--secondary'}`} aria-pressed={section === 'reading-writing'} onClick={() => chooseSection('reading-writing')}>Reading and Writing</button>
      <button className={`sat-page__button ${section === 'math' ? '' : 'sat-page__button--secondary'}`} aria-pressed={section === 'math'} onClick={() => chooseSection('math')}>Mathematics</button>
    </div>
    {error && <p className="sat-page__alert" role="alert">{error}</p>}
    {section && !state && !error && <p>Carregando o desafio de {section === 'math' ? 'Matemática' : 'Leitura e escrita'}…</p>}
    {state && !state.available && <div className="sat-page__panel"><h2>Questões em preparação</h2><p>Há {state.published} de {state.needed} questões necessárias para iniciar o desafio.</p></div>}
    {state?.available && <div className="sat-page__panel">
      <div className="sat-page__progress"><span>Questões: {state.answered}/{state.total}</span><span aria-label={`${state.lives} de ${state.maxLives} sóis restantes`}>{'☀'.repeat(state.lives)}{'○'.repeat(state.maxLives - state.lives)}</span></div>
      {feedbackVisible && state.feedback ? <div className={`sat-page__feedback ${state.feedback.correct ? 'is-correct' : 'is-incorrect'}`} role="status">
        <h2>{state.feedback.correct ? 'Resposta certa!' : 'Você perdeu um sol'}</h2>
        <p>Resposta: {state.feedback.acceptedAnswers.join(' ou ')}. {state.feedback.explanation}</p>
        <button className="sat-page__button" onClick={() => setFeedbackVisible(false)}>{state.finished ? 'Ver resultado' : 'Próxima questão'}</button>
      </div> : state.finished ? <div className="sat-page__result"><h2>Desafio de hoje concluído</h2><p>Você acertou {state.correct} de {state.answered} questões respondidas.</p><p>Volte amanhã para um novo desafio e três sóis renovados.</p></div> : state.question && <>
        <QuestionView question={state.question} answer={answer} onAnswer={setAnswer} />
        <button className="sat-page__button" disabled={busy || !answer.trim()} onClick={submit}>{busy ? 'Conferindo…' : 'Responder'}</button>
      </>}
    </div>}
    <p className="sat-page__note">As questões vêm das adaptações em papel dos testes práticos nº 4 a nº 9. O desafio não mede sua pontuação oficial no SAT.</p>
  </main>
}

function SatExamReport({ grade }: { grade: Grade }) {
  const sections = [
    { key:'reading-writing' as const, title:'Leitura e escrita' },
    { key:'math' as const, title:'Matemática' },
  ]
  return <section className="sat-page__panel sat-report" aria-labelledby="sat-report-title" aria-live="polite">
    <p className="sat-page__eyebrow">Fim do simulado · Teste {testNumber(grade.formCode)}</p>
    <h2 id="sat-report-title">Seu relatório final</h2>
    <div className="sat-report__summary">
      <p>Faixa total estimada neste teste prático</p>
      <strong>{formatRange(grade.scoreRange)} <span>de 1600</span></strong>
      <p>{grade.correct} acertos em {grade.total} questões</p>
    </div>
    <div className="sat-report__sections">
      {sections.map(({ key, title }) => {
        const section = grade.sections[key]
        const modules = grade.modules.filter(item => item.section === key)
        return <section key={key} className="sat-report__section" aria-label={title}>
          <h3>{title}</h3>
          <p className="sat-report__section-score">{formatRange(section.scoreRange)} <span>de 800</span></p>
          <dl>
            {modules.map(item => <div key={item.moduleNumber}><dt>Módulo {item.moduleNumber}</dt><dd>{item.correct}/{item.total} acertos</dd></div>)}
            <div><dt>Total da seção</dt><dd>{section.correct}/{section.total} acertos</dd></div>
          </dl>
        </section>
      })}
    </div>
    <div className="sat-report__method"><h3>Como calculamos</h3>
      <p>Somamos os acertos dos dois módulos de cada seção. Depois, usamos a tabela de conversão indicada abaixo para obter um limite inferior e um superior por seção. A faixa total é a soma dos respectivos limites das duas seções.</p>
      <p>{grade.note} <a href={grade.scoringSource} target="_blank" rel="noopener noreferrer">Consultar o guia oficial de pontuação<span className="sr-only"> (abre em nova aba)</span></a>.</p>
      <p>As respostas e este relatório não são salvos; recarregar a página apaga o resultado.</p>
    </div>
    <Link className="sat-page__button sat-page__button--secondary" to="/exames/sat">Voltar às opções do SAT</Link>
  </section>
}

export function SatExamPage() {
  useDocumentTitle('Simulado SAT | Daydreaming')
  const requestId = useRef(0)
  const [formCode, setFormCode] = useState<FormCode | null>(null)
  const [loading, setLoading] = useState(false)
  const [exam, setExam] = useState<ExamState | null>(null)
  const [error, setError] = useState('')
  const [started, setStarted] = useState(false)
  const [moduleIndex, setModuleIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [deadline, setDeadline] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [breakTime, setBreakTime] = useState(false)
  const [grade, setGrade] = useState<Grade | null>(null)
  function chooseForm(nextForm: FormCode) {
    const currentRequest = ++requestId.current
    setFormCode(nextForm); setExam(null); setError(''); setLoading(true)
    api<ExamState>(`/api/sat/exam?form=${nextForm}`).then(result => { if (requestId.current === currentRequest) setExam(result) }).catch(cause => { if (requestId.current === currentRequest) setError(String(cause.message)) }).finally(() => { if (requestId.current === currentRequest) setLoading(false) })
  }
  useEffect(() => {
    if (!started || !deadline || grade) return
    const tick = () => setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    tick(); const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [started, deadline, grade])
  const module = exam?.modules[moduleIndex]
  const questions = exam?.questions.filter(question => question.section === module?.section && question.module_number === module?.module_number) || []
  const question = questions[questionIndex]
  const beginModule = useCallback((index: number) => {
    const seconds = (exam?.modules[index].minutes || 0) * 60
    setModuleIndex(index); setQuestionIndex(0); setBreakTime(false); setRemaining(seconds); setDeadline(Date.now() + seconds * 1000)
  }, [exam])
  const finish = useCallback(async () => {
    setError('')
    try {
      const result = await api<Grade>('/api/sat/exam/grade', { method:'POST', body:JSON.stringify({ formCode, answers:Object.entries(answers).map(([questionId, answer]) => ({ questionId:Number(questionId), answer })) }) })
      if (!result.scoreRange || !result.sections?.['reading-writing']?.scoreRange || !result.sections?.math?.scoreRange || !Array.isArray(result.modules)) {
        throw new Error('A API ainda está na versão anterior. Reinicie a API e clique novamente em “Corrigir simulado”.')
      }
      setGrade(result)
    }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível corrigir o simulado.') }
  }, [answers, formCode])
  const nextModule = useCallback(() => {
    if (moduleIndex === 3) { void finish(); return }
    if (moduleIndex === 1) { setBreakTime(true); setRemaining(600); setDeadline(Date.now() + 10 * 60_000); return }
    beginModule(moduleIndex + 1)
  }, [moduleIndex, finish, beginModule])
  useEffect(() => {
    if (!started || !deadline || grade) return
    const timeout = window.setTimeout(() => { if (breakTime) beginModule(2); else nextModule() }, Math.max(0, deadline - Date.now()))
    return () => window.clearTimeout(timeout)
  }, [started, deadline, grade, breakTime, beginModule, nextModule])
  return <main className="sat-page container"><nav className="sat-page__breadcrumb"><Link to="/exames/sat">SAT</Link><span aria-hidden="true">/</span><span aria-current="page">Modo exame</span></nav>
    <header className="sat-page__header"><p className="sat-page__eyebrow">Prática em tempo real</p><h1>Simulado completo</h1><p>Escolha uma das reproduções não adaptativas dos testes práticos em papel nº 4 a nº 9. Ao terminar, você verá acertos e uma faixa estimada, nunca uma nota SAT oficial.</p></header>
    {!formCode && <div className="sat-page__exam-choices">
      <section className="sat-page__panel"><h2>Teste prático nº 4</h2><p>120 questões e relatório com a tabela de conversão própria do teste nº 4.</p><button className="sat-page__button" onClick={() => chooseForm('practice-4-paper')}>Preparar teste 4</button></section>
      <section className="sat-page__panel"><h2>Teste prático nº 5</h2><p>120 questões e o mesmo formato de relatório, com a tabela de conversão própria do teste nº 5.</p><button className="sat-page__button" onClick={() => chooseForm('practice-5-paper')}>Preparar teste 5</button></section>
      <section className="sat-page__panel"><h2>Teste prático nº 6</h2><p>120 questões e o mesmo formato de relatório, com a tabela de conversão própria do teste nº 6.</p><button className="sat-page__button" onClick={() => chooseForm('practice-6-paper')}>Preparar teste 6</button></section>
      <section className="sat-page__panel"><h2>Teste prático nº 7</h2><p>120 questões e o mesmo formato de relatório, com a tabela de conversão própria do teste nº 7.</p><button className="sat-page__button" onClick={() => chooseForm('practice-7-paper')}>Preparar teste 7</button></section>
      <section className="sat-page__panel"><h2>Teste prático nº 8</h2><p>120 questões e o mesmo formato de relatório, com a tabela de conversão própria do teste nº 8.</p><button className="sat-page__button" onClick={() => chooseForm('practice-8-paper')}>Preparar teste 8</button></section>
      <section className="sat-page__panel"><h2>Teste prático nº 9</h2><p>120 questões e o mesmo formato de relatório, com a tabela de conversão própria do teste nº 9.</p><button className="sat-page__button" onClick={() => chooseForm('practice-9-paper')}>Preparar teste 9</button></section>
    </div>}
    {formCode && !started && <button className="sat-page__change" onClick={() => { ++requestId.current; setFormCode(null); setExam(null); setError(''); setLoading(false) }}>Escolher outra versão</button>}
    {error && <p role="alert" className="sat-page__alert">{error}</p>}
    {loading && formCode && <p>Conferindo as questões do teste {testNumber(formCode)}…</p>}
    {exam && !exam.ready && <div className="sat-page__panel"><h2>Simulado em preparação</h2><p>Para começar, precisamos publicar todas as 120 questões e respostas verificadas do material enviado.</p>
      <ul>{exam.modules.map(item => <li key={`${item.section}-${item.module_number}`}>{item.section === 'math' ? 'Matemática' : 'Leitura e escrita'}, módulo {item.module_number}: {item.published}/{item.total}</li>)}</ul>
      <p>Enquanto isso, o <Link to="/exames/sat/desafio-diario">desafio diário</Link> já pode ser praticado.</p></div>}
    {exam?.ready && !started && formCode && <div className="sat-page__panel"><h2>Antes de iniciar · Teste {testNumber(formCode)}</h2><p>Quatro módulos: 33 questões de Reading and Writing em 39 minutos cada, 10 minutos de intervalo, e 27 questões de Math em 43 minutos cada. São os tempos da versão em papel enviada, não do SAT digital atual.</p><p>O progresso deste simulado não é salvo. Se recarregar a página, precisará recomeçar.</p><button className="sat-page__button" onClick={() => { setStarted(true); beginModule(0) }}>Iniciar simulado</button></div>}
    {started && !grade && breakTime && <div className="sat-page__panel"><h2>Intervalo</h2><p>Descanse antes de começar Matemática. Restam {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}.</p><button className="sat-page__button" onClick={() => beginModule(2)}>Começar Matemática agora</button></div>}
    {started && !grade && !breakTime && question && <div className="sat-page__panel">
      <div className="sat-page__progress"><span>Módulo {moduleIndex + 1}/4 · Questão {questionIndex + 1}/{questions.length}</span><span aria-live="off">Tempo: {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</span></div>
      <QuestionView question={question} answer={answers[question.id] || ''} onAnswer={value => setAnswers(current => ({ ...current, [question.id]:value }))} />
      <div className="sat-page__actions"><button className="sat-page__button sat-page__button--secondary" disabled={questionIndex === 0} onClick={() => setQuestionIndex(questionIndex - 1)}>Anterior</button>
        {questionIndex < questions.length - 1 ? <button className="sat-page__button" onClick={() => setQuestionIndex(questionIndex + 1)}>Próxima</button> : <button className="sat-page__button" onClick={nextModule}>{moduleIndex === 3 ? 'Corrigir simulado' : 'Encerrar módulo'}</button>}</div>
    </div>}
    {grade && <SatExamReport grade={grade} />}
  </main>
}
