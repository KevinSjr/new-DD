import { useEffect, useRef, useState } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Link } from '../router/Link'
import { INTEREST_AREAS, QUESTION_STEPS, VALUES, type InterestArea } from '../data/vocationalQuestions'
import { CareerRecommendations } from '../components/vocational/CareerRecommendations'
import './VocationalTestPage.css'

type Answer = 0 | 1 | 2 | 3 | 4 | 5
type Scores = { area: InterestArea; mean: number; count: number }[]

const SCALE: { value: Answer; label: string }[] = [
  { value: 1, label: 'Não gostaria' },
  { value: 2, label: 'Gostaria pouco' },
  { value: 3, label: 'Não sei / indiferente' },
  { value: 4, label: 'Gostaria' },
  { value: 5, label: 'Gostaria muito' },
  { value: 0, label: 'Não consigo avaliar' },
]

const areaKeys = Object.keys(INTEREST_AREAS) as InterestArea[]

function calculateScores(answers: Record<string, Answer>): Scores {
  return areaKeys.map((area) => {
    const values = QUESTION_STEPS.flat().filter((question) => question.area === area)
      .map((question) => answers[question.id])
      .filter((answer): answer is Exclude<Answer, 0> => answer !== undefined && answer !== 0)
    return { area, count: values.length, mean: values.reduce((sum, value) => sum + value, 0) / values.length }
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
  const leaders = scores.slice(0, 3)
  const closeScores = leaders.length > 1 && leaders[0].mean - leaders[1].mean <= 0.3
  const broadProfile = scores.length > 0 && scores[0].mean - scores[scores.length - 1].mean <= 0.5

  function nextStep() {
    const unanswered = currentQuestions.find((question) => answers[question.id] === undefined)
    if (unanswered) {
      setError('Responda às seis atividades desta etapa. Se não conhecer alguma, marque “Não consigo avaliar”.')
      document.getElementById(`question-${unanswered.id}`)?.scrollIntoView({ block: 'center' })
      return
    }
    setError('')
    if (step < QUESTION_STEPS.length - 1) setStep(step + 1)
    else setScreen('values')
  }

  function showResult() {
    const deficient = calculateScores(answers).find((score) => score.count < 8)
    if (deficient) {
      const firstSkippedStep = QUESTION_STEPS.findIndex((questions) =>
        questions.some((question) => question.area === deficient.area && answers[question.id] === 0))
      setStep(Math.max(0, firstSkippedStep))
      setError(`Para mostrar o resultado, precisamos de pelo menos oito respostas avaliadas em cada área. Revise as atividades de ${INTEREST_AREAS[deficient.area].label.toLowerCase()} marcadas como “Não consigo avaliar”.`)
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
            <h1 tabIndex={-1} ref={headingRef}>{broadProfile ? 'Seus interesses percorrem diferentes caminhos' : `Seu interesse se destaca em ${INTEREST_AREAS[leaders[0].area].label.toLowerCase()}`}</h1>
            <p>{broadProfile ? 'Suas respostas ficaram próximas entre as áreas. Experimentar atividades reais pode ajudar você a perceber o que mais gosta.' : closeScores ? `Você também demonstrou interesse semelhante em ${INTEREST_AREAS[leaders[1].area].label.toLowerCase()}. Não há motivo para escolher apenas uma área.` : 'Este é um ponto de partida para pesquisar possibilidades, não uma definição de carreira.'}</p>
          </header>

          <div className="vocational__result-grid">
            <section className="vocational__result-card" aria-labelledby="vocational-dimensions">
              <h2 id="vocational-dimensions">As seis dimensões</h2>
              <p className="vocational__muted">Média de interesse de 1 a 5. Não representa aptidão nem porcentagem de compatibilidade.</p>
              <ol className="vocational__scores">
                {scores.map((score) => (
                  <li key={score.area}>
                    <div className="vocational__score-label"><strong>{INTEREST_AREAS[score.area].label}</strong><span>{score.mean.toFixed(1).replace('.', ',')} / 5</span></div>
                    <div className="vocational__bar" aria-hidden="true"><span style={{ width: `${(score.mean - 1) * 25}%` }} /></div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="vocational__result-card vocational__result-card--insight" aria-labelledby="vocational-insights">
              <h2 id="vocational-insights">O que vale investigar</h2>
              <div className="vocational__insights">
                {leaders.map((score, index) => (
                  <div key={score.area}>
                    <span className="vocational__insight-index">0{index + 1}</span>
                    <h3>{INTEREST_AREAS[score.area].short}</h3>
                    <p>{INTEREST_AREAS[score.area].description}</p>
                    <p className="vocational__explore">{INTEREST_AREAS[score.area].explore}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <CareerRecommendations scores={scores} broadProfile={broadProfile} />

          {priorities.length > 0 && <section className="vocational__priorities" aria-labelledby="vocational-priorities"><h2 id="vocational-priorities">Suas prioridades</h2><p>Você marcou estes aspectos para levar em conta ao comparar opções. Eles não entraram no cálculo acima.</p><ul>{priorities.map((item) => <li key={item}>{item}</li>)}</ul></section>}

          <section className="vocational__next" aria-labelledby="vocational-next">
            <div><p className="vocational__eyebrow">Próximo passo</p><h2 id="vocational-next">Transforme pistas em pesquisa</h2><p>Escolha duas opções acima, abra as grades curriculares e compare as atividades reais. Depois veja instituições e requisitos nas fontes oficiais.</p></div>
            <Link className="vocational__button" to="/rankings">Explorar áreas de estudo <span aria-hidden="true">→</span></Link>
          </section>
          <p className="vocational__method">Este questionário original usa as seis dimensões de interesses do modelo RIASEC, mas ainda não passou por validação psicométrica com estudantes brasileiros. Ele não substitui orientação profissional individual nem avaliação psicológica. As respostas não são armazenadas; recarregar a página apaga o resultado. Referência conceitual: <a href="https://www.onetcenter.org/IP.html" target="_blank" rel="noopener noreferrer">O*NET Interest Profiler</a>.</p>
          <button type="button" className="vocational__restart" onClick={restart}>Refazer o questionário</button>
        </div>
      )}
    </article>
  )
}
