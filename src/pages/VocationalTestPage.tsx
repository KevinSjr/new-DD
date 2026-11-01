import { useEffect, useRef, useState } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Link } from '../router/Link'
import { INTEREST_AREAS, QUESTION_STEPS, VALUES, type InterestArea } from '../data/vocationalQuestions'
import { CareerRecommendations } from '../components/vocational/CareerRecommendations'
import './VocationalTestPage.css'

type Answer = 1 | 2 | 3 | 4 | 5
type Scores = { area: InterestArea; mean: number }[]

const SCALE: { value: Answer; label: string }[] = [
  { value: 1, label: 'Não gostaria' },
  { value: 2, label: 'Gostaria pouco' },
  { value: 3, label: 'Não sei / indiferente' },
  { value: 4, label: 'Gostaria' },
  { value: 5, label: 'Gostaria muito' },
]

const areaKeys = Object.keys(INTEREST_AREAS) as InterestArea[]

function calculateScores(answers: Record<string, Answer>): Scores {
  return areaKeys.map((area) => {
    const values = QUESTION_STEPS.flat().filter((question) => question.area === area)
      .map((question) => answers[question.id])
      .filter((answer): answer is Answer => answer !== undefined)
    return { area, mean: values.reduce((sum, value) => sum + value, 0) / values.length }
  }).sort((a, b) => b.mean - a.mean)
}

export function VocationalTestPage() {
  useDocumentTitle('Explore seus interesses | Daydreaming')
  const [screen, setScreen] = useState<'intro' | 'questions' | 'values' | 'result'>('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [priorities, setPriorities] = useState<string[]>([])
  const [error, setError] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (screen === 'intro') return
    headingRef.current?.focus()
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [screen, step])

  const currentQuestions = QUESTION_STEPS[step]
  const answeredCount = Object.keys(answers).length
  const scores = screen === 'result' ? calculateScores(answers) : []
  const leaders = scores.slice(0, 2)
  const closeScores = leaders.length > 1 && leaders[0].mean - leaders[1].mean <= 0.3

  function nextStep() {
    const unanswered = currentQuestions.find((question) => answers[question.id] === undefined)
    if (unanswered) {
      setError('Responda às seis atividades desta etapa. Se a atividade for nova para você, imagine como seria experimentá-la.')
      document.getElementById(`question-${unanswered.id}`)?.scrollIntoView({ block: 'center' })
      return
    }
    setError('')
    if (step < QUESTION_STEPS.length - 1) setStep(step + 1)
    else setScreen('values')
  }

  function showResult() {
    const firstIncompleteStep = QUESTION_STEPS.findIndex((questions) =>
      questions.some((question) => answers[question.id] === undefined))
    if (firstIncompleteStep !== -1) {
      setStep(firstIncompleteStep)
      setError('Responda às atividades que faltam para ver seu resultado.')
      setScreen('questions')
      return
    }
    setError('')
    setScreen('result')
  }

  function restart() {
    setAnswers({})
    setPriorities([])
    setStep(0)
    setError('')
    setScreen('intro')
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  function togglePriority(value: string) {
    setPriorities((previous) => previous.includes(value)
      ? previous.filter((item) => item !== value)
      : previous.length < 3 ? [...previous, value] : previous)
  }

  return (
    <article className="vocational">
      <div className="container vocational__breadcrumb">
        <nav aria-label="Você está em"><Link to="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Explorar interesses</span></nav>
      </div>

      {screen === 'intro' && (
        <div className="container vocational__intro">
          <div className="vocational__intro-copy">
            <p className="vocational__eyebrow">Uma bússola, não um rótulo</p>
            <h1>Descubra quais atividades despertam seu interesse</h1>
            <p className="vocational__lead">Em 60 situações do cotidiano de estudo e trabalho, você vai perceber padrões para investigar áreas e cursos com mais clareza.</p>
            <div className="vocational__intro-facts"><span>60 atividades</span><span>10 etapas curtas</span><span>Sem cadastro</span></div>
            <button type="button" className="vocational__button" onClick={() => setScreen('questions')}>Começar a explorar <span aria-hidden="true">→</span></button>
            <p className="vocational__privacy">Suas respostas ficam apenas nesta página enquanto ela estiver aberta. Não são enviadas nem salvas pelo site.</p>
          </div>
          <aside className="vocational__intro-panel" aria-label="Como responder">
            <span className="vocational__panel-symbol" aria-hidden="true">✳</span>
            <h2>Responda pelo interesse, não pelo desempenho</h2>
            <p>Imagine que você terá a oportunidade de aprender o necessário. Pense no quanto gostaria de realizar cada atividade, independentemente das suas notas, do orçamento ou da opinião de outras pessoas.</p>
            <p>O resultado é uma orientação exploratória. Ele não define sua profissão, habilidade ou chance de aprovação.</p>
          </aside>
        </div>
      )}

      {screen === 'questions' && (
        <div className="container vocational__flow">
          <header className="vocational__flow-head">
            <p className="vocational__eyebrow">Etapa {step + 1} de 10 · {answeredCount} de 60 respondidas</p>
            <h1 tabIndex={-1} ref={headingRef}>O que você gostaria de fazer?</h1>
            <p>Imagine que pode aprender o necessário. Escolha a opção que melhor representa seu interesse hoje.</p>
            <progress max="10" value={step + 1} aria-label="Progresso do questionário" />
          </header>
          {error && <p className="vocational__error" role="alert">{error}</p>}
          <div className="vocational__questions">
            {currentQuestions.map((question, index) => (
              <fieldset className="vocational__question" id={`question-${question.id}`} key={question.id}>
                <legend><span className="vocational__question-number">{String(step * 6 + index + 1).padStart(2, '0')}</span>{question.text}</legend>
                <div className="vocational__options">
                  {SCALE.map((option) => (
                    <label key={option.value} className={`vocational__option${answers[question.id] === option.value ? ' vocational__option--selected' : ''}`}>
                      <input type="radio" name={question.id} value={option.value} checked={answers[question.id] === option.value}
                        onChange={() => { setAnswers((previous) => ({ ...previous, [question.id]: option.value })); setError('') }} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="vocational__actions">
            <button type="button" className="vocational__button vocational__button--secondary" onClick={() => step === 0 ? setScreen('intro') : setStep(step - 1)}>Voltar</button>
            <button type="button" className="vocational__button" onClick={nextStep}>{step === 9 ? 'Ir para prioridades' : 'Próxima etapa'} <span aria-hidden="true">→</span></button>
          </div>
        </div>
      )}

      {screen === 'values' && (
        <div className="container vocational__flow">
          <header className="vocational__flow-head">
            <p className="vocational__eyebrow">Última etapa · opcional</p>
            <h1 tabIndex={-1} ref={headingRef}>O que importa na sua escolha?</h1>
            <p>Selecione até três prioridades. Elas não mudam sua pontuação de interesses: ajudam você a interpretar o resultado.</p>
          </header>
          <div className="vocational__values" role="group" aria-label="Prioridades para a escolha de um curso ou trabalho">
            {VALUES.map((value) => (
              <label key={value} className={`vocational__value${priorities.includes(value) ? ' vocational__value--selected' : ''}`}>
                <input type="checkbox" checked={priorities.includes(value)} disabled={!priorities.includes(value) && priorities.length >= 3}
                  onChange={() => togglePriority(value)} />
                <span>{value}</span>
              </label>
            ))}
          </div>
          <p className="vocational__selection-count" aria-live="polite">{priorities.length} de 3 prioridades selecionadas</p>
          <div className="vocational__actions">
            <button type="button" className="vocational__button vocational__button--secondary" onClick={() => { setStep(9); setScreen('questions') }}>Rever respostas</button>
            <button type="button" className="vocational__button" onClick={showResult}>Ver meu panorama <span aria-hidden="true">→</span></button>
          </div>
        </div>
      )}

      {screen === 'result' && (
        <div className="container vocational__result">
          <header className="vocational__result-head">
            <p className="vocational__eyebrow">Seu panorama de interesses</p>
            <h1 tabIndex={-1} ref={headingRef}>Seus dois interesses em destaque</h1>
            <p>{closeScores ? 'As duas médias ficaram próximas. Explore ambas antes de escolher um caminho.' : 'Estas são as duas atividades que mais combinaram com suas respostas de hoje.'}</p>
          </header>

          <section className="vocational__result-card vocational__chart" aria-labelledby="vocational-dimensions">
            <div className="vocational__chart-head"><h2 id="vocational-dimensions">Seu panorama</h2><p>Média de interesse de 1 a 5. A barra mostra sua resposta média, não aptidão ou chance de sucesso.</p></div>
            <ol className="vocational__scores">
              {leaders.map((score, index) => (
                <li key={score.area}>
                  <div className="vocational__score-label"><span className="vocational__rank">0{index + 1}</span><div><strong>{INTEREST_AREAS[score.area].label}</strong><small>{INTEREST_AREAS[score.area].short}</small></div><span className="vocational__score-value">{score.mean.toFixed(1).replace('.', ',')} <small>/ 5</small></span></div>
                  <div className="vocational__bar" role="meter" aria-label={`Interesse ${INTEREST_AREAS[score.area].label}`} aria-valuemin={0} aria-valuemax={5} aria-valuenow={score.mean}><span style={{ width: `${score.mean / 5 * 100}%` }} /></div>
                </li>
              ))}
            </ol>
            <div className="vocational__chart-axis" aria-hidden="true"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
          </section>

          <CareerRecommendations scores={leaders} />

          {priorities.length > 0 && <section className="vocational__priorities" aria-labelledby="vocational-priorities"><h2 id="vocational-priorities">O que importa para você</h2><ul>{priorities.map((item) => <li key={item}>{item}</li>)}</ul><p>Essas prioridades ajudam na pesquisa, mas não alteram as notas do gráfico.</p></section>}

          <section className="vocational__next" aria-labelledby="vocational-next">
            <div><p className="vocational__eyebrow">Próximo passo</p><h2 id="vocational-next">Explore um curso de cada área</h2><p>Compare as disciplinas e a rotina profissional antes de decidir.</p></div>
            <Link className="vocational__button" to="/rankings">Explorar áreas de estudo <span aria-hidden="true">→</span></Link>
          </section>
          <p className="vocational__method">Este questionário original usa as seis dimensões de interesses do modelo RIASEC, mas ainda não passou por validação psicométrica com estudantes brasileiros. Ele não substitui orientação profissional individual nem avaliação psicológica. As respostas não são armazenadas; recarregar a página apaga o resultado. Referência conceitual: <a href="https://www.onetcenter.org/IP.html" target="_blank" rel="noopener noreferrer">O*NET Interest Profiler</a>.</p>
          <button type="button" className="vocational__restart" onClick={restart}>Refazer o questionário</button>
        </div>
      )}
    </article>
  )
}
