import { useCallback, useEffect, useState } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './SatPage.css'

type Question = {
  id: number; section: 'reading-writing' | 'math'; module_number: number; question_number: number;
  passage: string; prompt: string; choices: { key: string; text: string }[]; answer_type: 'multiple-choice' | 'numeric'; image_path: string | null
}
type DailyState = { available: boolean; needed?: number; published?: number; lives: number; maxLives: number; total: number; answered: number; correct: number; finished: boolean; question: Question | null; feedback?: { correct: boolean; acceptedAnswers: string[]; explanation: string } }
type ExamState = { ready: boolean; modules: { section: string; module_number: number; total: number; published: number; minutes: number }[]; questions: Question[] }
type ScoreRange = { lower: number; upper: number }
type Grade = {
  correct: number; total: number; scoreRange: ScoreRange; scoringSource: string; note: string;
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
    <p className="sat-question__label">{question.section === 'math' ? 'Matemática' : 'Leitura e escrita'} · Módulo {question.module_number} · Questão {question.question_number}</p>
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
  const [availability, setAvailability] = useState<ExamState | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { api<ExamState>('/api/sat/exam/availability').then(setAvailability).catch(cause => setError(String(cause.message))) }, [])
  return <main className="sat-page container">
    <nav className="sat-page__breadcrumb" aria-label="Você está em"><Link to="/exames">Exames</Link><span aria-hidden="true">/</span><span aria-current="page">SAT</span></nav>
    <header className="sat-page__header"><p className="sat-page__eyebrow">SAT · preparação</p><h1>Como você quer praticar hoje?</h1>
      <p>Escolha um treino curto com sóis ou reserve tempo para um simulado completo. Seus acertos aqui não geram pontuação oficial do SAT.</p></header>
    <div className="sat-page__modes">
      <section className="sat-page__mode"><span aria-hidden="true" className="sat-page__symbol">☀</span><h2>Desafio diário</h2>
        <p>Cinco questões por dia, três sóis. Cada erro consome um sol; no dia seguinte, eles voltam. Seu progresso fica associado a um cookie anônimo neste navegador.</p>
        <Link className="sat-page__button" to="/exames/sat/desafio-diario">Jogar o desafio de hoje</Link></section>
      <section className="sat-page__mode"><span aria-hidden="true" className="sat-page__symbol">◷</span><h2>Modo exame</h2>
        <p>O teste prático nº 4 enviado é uma adaptação em papel: quatro módulos, 120 questões e tempos próprios. Não é o SAT digital adaptativo.</p>
        <p className="sat-page__availability" aria-live="polite">{error || (availability ? availability.ready ? 'Banco completo: simulado liberado.' : `Banco em preparação: ${availability.modules.reduce((sum, module) => sum + module.published, 0)}/120 questões publicadas.` : 'Conferindo questões…')}</p>
        <Link className="sat-page__button sat-page__button--secondary" to="/exames/sat/simulado">Ver o modo exame</Link></section>
    </div>
    <p className="sat-page__note">O SAT digital atual tem 54 questões de Reading and Writing em 64 minutos e 44 de Math em 70 minutos, divididas em dois módulos por seção. O segundo módulo é adaptativo; esta plataforma ainda não reproduz essa adaptação. <a href="https://satsuite.collegeboard.org/sat/whats-on-the-test/structure" target="_blank" rel="noopener noreferrer">Confira o formato no College Board<span className="sr-only"> (abre em nova aba)</span></a>.</p>
  </main>
}

export function SatDailyPage() {
  useDocumentTitle('Desafio diário SAT | Daydreaming')
  const [state, setState] = useState<DailyState | null>(null)
  const [answer, setAnswer] = useState('')
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { api<DailyState>('/api/sat/daily').then(setState).catch(cause => setError(String(cause.message))) }, [])
  async function submit() {
    if (!state?.question || !answer.trim()) return
    setBusy(true); setError('')
    try {
      const next = await api<DailyState>('/api/sat/daily/answer', { method:'POST', body:JSON.stringify({ questionId:state.question.id, answer }) })
      setState(next); setFeedbackVisible(true); setAnswer('')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível registrar a resposta.') }
    finally { setBusy(false) }
  }
  return <main className="sat-page container"><nav className="sat-page__breadcrumb"><Link to="/exames/sat">SAT</Link><span aria-hidden="true">/</span><span aria-current="page">Desafio diário</span></nav>
    <header className="sat-page__header"><p className="sat-page__eyebrow">Um passo por dia</p><h1>Desafio diário do SAT</h1><p>Responda cinco questões. Você começa com três sóis e perde um a cada erro. Os sóis voltam no próximo dia, no horário de Brasília.</p></header>
    {error && <p className="sat-page__alert" role="alert">{error}</p>}
    {!state && !error && <p>Carregando o desafio…</p>}
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
    <p className="sat-page__note">As questões iniciais vêm da adaptação em papel do teste prático nº 4. O desafio não mede sua pontuação oficial no SAT.</p>
  </main>
}

function SatExamReport({ grade }: { grade: Grade }) {
  const sections = [
    { key:'reading-writing' as const, title:'Leitura e escrita' },
    { key:'math' as const, title:'Matemática' },
  ]
  return <section className="sat-page__panel sat-report" aria-labelledby="sat-report-title" aria-live="polite">
    <p className="sat-page__eyebrow">Fim do simulado</p>
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
      <p>Somamos os acertos dos dois módulos de cada seção. Depois, usamos a tabela de conversão do guia de correção deste teste para obter um limite inferior e um superior por seção. A faixa total é a soma dos respectivos limites das duas seções.</p>
      <p>{grade.note} <a href={grade.scoringSource} target="_blank" rel="noopener noreferrer">Consultar o guia oficial de pontuação<span className="sr-only"> (abre em nova aba)</span></a>.</p>
      <p>As respostas e este relatório não são salvos; recarregar a página apaga o resultado.</p>
    </div>
    <Link className="sat-page__button sat-page__button--secondary" to="/exames/sat">Voltar às opções do SAT</Link>
  </section>
}

export function SatExamPage() {
  useDocumentTitle('Simulado SAT | Daydreaming')
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
  useEffect(() => { api<ExamState>('/api/sat/exam').then(setExam).catch(cause => setError(String(cause.message))) }, [])
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
      const result = await api<Grade>('/api/sat/exam/grade', { method:'POST', body:JSON.stringify({ answers:Object.entries(answers).map(([questionId, answer]) => ({ questionId:Number(questionId), answer })) }) })
      if (!result.scoreRange || !result.sections?.['reading-writing']?.scoreRange || !result.sections?.math?.scoreRange || !Array.isArray(result.modules)) {
        throw new Error('A API ainda está na versão anterior. Reinicie a API e clique novamente em “Corrigir simulado”.')
      }
      setGrade(result)
    }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível corrigir o simulado.') }
  }, [answers])
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
    <header className="sat-page__header"><p className="sat-page__eyebrow">Prática em tempo real</p><h1>Simulado completo</h1><p>Reprodução não adaptativa do teste prático em papel nº 4. Ao terminar, você verá seus acertos e uma faixa estimada de pontuação para este teste, nunca uma nota SAT oficial.</p></header>
    {error && <p role="alert" className="sat-page__alert">{error}</p>}
    {!exam && !error && <p>Conferindo as questões…</p>}
    {exam && !exam.ready && <div className="sat-page__panel"><h2>Simulado em preparação</h2><p>Para começar, precisamos publicar todas as 120 questões e respostas verificadas do material enviado.</p>
      <ul>{exam.modules.map(item => <li key={`${item.section}-${item.module_number}`}>{item.section === 'math' ? 'Matemática' : 'Leitura e escrita'}, módulo {item.module_number}: {item.published}/{item.total}</li>)}</ul>
      <p>Enquanto isso, o <Link to="/exames/sat/desafio-diario">desafio diário</Link> já pode ser praticado.</p></div>}
    {exam?.ready && !started && <div className="sat-page__panel"><h2>Antes de iniciar</h2><p>Quatro módulos: 33 questões de Reading and Writing em 39 minutos cada, 10 minutos de intervalo, e 27 questões de Math em 43 minutos cada. São os tempos da versão em papel enviada, não do SAT digital atual.</p><p>O progresso deste simulado não é salvo. Se recarregar a página, precisará recomeçar.</p><button className="sat-page__button" onClick={() => { setStarted(true); beginModule(0) }}>Iniciar simulado</button></div>}
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
