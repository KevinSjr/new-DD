import { useRef, useState } from 'react'
import { GPA_METHODS } from '../data/gpaMethods'
import { calculateGpa, GpaInputError, type CourseInput, type GpaInput, type GpaResult } from '../lib/gpa'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { InfoBadge } from '../components/ui/InfoBadge'
import { Link } from '../router/Link'
import './GpaCalculatorPage.css'

type EntryMode = 'average' | 'courses'
type Calculated = { input: GpaInput; results: GpaResult[] }
const freshCourse = (): CourseInput => ({ name: '', grade: '', credits: '' })
const number = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function GpaCalculatorPage() {
  useDocumentTitle('Calculadora de GPA | Day Dreaming')
  const [mode, setMode] = useState<EntryMode>('average')
  const [average, setAverage] = useState('')
  const [courses, setCourses] = useState<CourseInput[]>([freshCourse()])
  const [passingPreset, setPassingPreset] = useState('6')
  const [customPassing, setCustomPassing] = useState('')
  const [includeFailed, setIncludeFailed] = useState(true)
  const [methodId, setMethodId] = useState(GPA_METHODS[0].id)
  const [calculated, setCalculated] = useState<Calculated | null>(null)
  const [error, setError] = useState('')
  const addRef = useRef<HTMLButtonElement>(null)
  const removeRefs = useRef<(HTMLButtonElement | null)[]>([])
  const method = GPA_METHODS.find(item => item.id === methodId) ?? GPA_METHODS[0]
  const selectedResult = calculated?.results[GPA_METHODS.findIndex(item => item.id === methodId)]

  function invalidate() { setCalculated(null); setError('') }
  function updateCourse(index: number, field: keyof CourseInput, value: string) {
    setCourses(previous => previous.map((course, courseIndex) => courseIndex === index ? { ...course, [field]: value } : course))
    invalidate()
  }
  function removeCourse(index: number) {
    const target = index < courses.length - 1 ? index : index - 1
    setCourses(previous => previous.filter((_, courseIndex) => courseIndex !== index))
    invalidate()
    requestAnimationFrame(() => target < 0 ? addRef.current?.focus() : removeRefs.current[target]?.focus())
  }
  function calculate() {
    const input: GpaInput = mode === 'average'
      ? { mode, average }
      : { mode, courses, passingGrade: passingPreset === 'custom' ? customPassing : passingPreset, includeFailed }
    try {
      setCalculated({ input, results: GPA_METHODS.map(item => calculateGpa(input, item)) })
      setError('')
    } catch (cause) {
      setCalculated(null)
      setError(cause instanceof GpaInputError ? cause.message : 'Não foi possível calcular. Revise os valores informados.')
    }
  }
  function clear() {
    setMode('average'); setAverage(''); setCourses([freshCourse()]); setPassingPreset('6')
    setCustomPassing(''); setIncludeFailed(true); setMethodId('bands'); setCalculated(null); setError('')
  }

  return <main className="gpa-page">
    <div className="container gpa-page__container">
      <Link to="/#ferramentas" className="gpa-page__back">← Voltar às ferramentas</Link>
      <header className="gpa-page__hero">
        <div><p className="gpa-page__eyebrow">Planeje sua candidatura</p><h1>Calculadora de GPA</h1>
          <p>Transforme suas notas brasileiras em uma estimativa na escala americana de 0 a 4,0. Compare métodos e entenda por que o resultado pode mudar.</p></div>
        <div className="gpa-page__hero-badge" aria-hidden="true">0–10 <span>→</span> 0–4,0</div>
      </header>
      <div className="gpa-page__layout">
        <section className="gpa-panel" aria-labelledby="gpa-input-title">
          <h2 id="gpa-input-title">Suas notas</h2>
          <p className="gpa-panel__intro">Escolha como deseja informar seu histórico. Nada é enviado ou salvo.</p>
          <fieldset className="gpa-mode"><legend>Modo de entrada</legend>
            <label><input type="radio" name="gpa-mode" checked={mode === 'average'} onChange={() => { setMode('average'); invalidate() }} /> Tenho só a média geral (CR)</label>
            <label><input type="radio" name="gpa-mode" checked={mode === 'courses'} onChange={() => { setMode('courses'); invalidate() }} /> Quero informar disciplina por disciplina</label>
          </fieldset>
          {mode === 'average' ? <div className="gpa-field"><label htmlFor="gpa-average">Média geral (CR), de 0 a 10</label>
            <input id="gpa-average" type="text" inputMode="decimal" placeholder="Ex.: 8,5" value={average} onChange={event => { setAverage(event.target.value); invalidate() }} />
            <small>Sem o histórico por disciplina, não é possível identificar reprovações ou ponderar por créditos.</small></div>
            : <div className="gpa-courses"><h3>Disciplinas</h3>
              {courses.map((course, index) => <div className="gpa-course" key={index}>
                <div className="gpa-course__top"><strong>Disciplina {index + 1}</strong><button type="button" className="gpa-link-button" ref={element => { removeRefs.current[index] = element }} onClick={() => removeCourse(index)} aria-label={`Remover disciplina ${index + 1}`}>Remover</button></div>
                <div className="gpa-course__fields">
                  <div className="gpa-field"><label htmlFor={`gpa-name-${index}`}>Nome <span>(opcional)</span></label><input id={`gpa-name-${index}`} value={course.name} onChange={event => updateCourse(index, 'name', event.target.value)} placeholder="Ex.: Matemática" /></div>
                  <div className="gpa-field"><label htmlFor={`gpa-grade-${index}`}>Nota (0 a 10)</label><input id={`gpa-grade-${index}`} type="text" inputMode="decimal" value={course.grade} onChange={event => updateCourse(index, 'grade', event.target.value)} placeholder="Ex.: 8,5" /></div>
                  <div className="gpa-field"><label htmlFor={`gpa-credits-${index}`}>Créditos ou horas <span>(opcional)</span></label><input id={`gpa-credits-${index}`} type="text" inputMode="decimal" value={course.credits} onChange={event => updateCourse(index, 'credits', event.target.value)} placeholder="Ex.: 60" /></div>
                </div></div>)}
              <button type="button" className="gpa-add" ref={addRef} onClick={() => { setCourses(previous => [...previous, freshCourse()]); invalidate() }}>+ Adicionar disciplina</button>
              <p className="gpa-note">Sem créditos, usamos média simples. Se informar créditos em alguma disciplina, preencha todas.</p>
              <fieldset className="gpa-options"><legend>Nota mínima de aprovação da sua instituição</legend>
                <div className="gpa-options__choices">{['5', '6', '7', 'custom'].map(value => <label key={value}><input type="radio" name="passing" value={value} checked={passingPreset === value} onChange={() => { setPassingPreset(value); invalidate() }} /> {value === 'custom' ? 'Outra' : `${value},0`}</label>)}</div>
                {passingPreset === 'custom' && <div className="gpa-field"><label htmlFor="gpa-passing">Nota mínima (0 a 10)</label><input id="gpa-passing" type="text" inputMode="decimal" value={customPassing} onChange={event => { setCustomPassing(event.target.value); invalidate() }} /></div>}
              </fieldset>
              <fieldset className="gpa-options"><legend>Disciplinas reprovadas</legend><div className="gpa-options__choices">
                <label><input type="radio" name="failed" checked={includeFailed} onChange={() => { setIncludeFailed(true); invalidate() }} /> Incluir (padrão)</label>
                <label><input type="radio" name="failed" checked={!includeFailed} onChange={() => { setIncludeFailed(false); invalidate() }} /> Ignorar</label></div>
                <p className="gpa-note">Notas abaixo da mínima valem 0,0 ponto quando incluídas. Ignorar reprovações pode ocultar parte do histórico exigido pela universidade.</p></fieldset>
            </div>}
          <fieldset className="gpa-methods"><legend>Método de conversão</legend>{GPA_METHODS.map(item => <label className={methodId === item.id ? 'gpa-method gpa-method--selected' : 'gpa-method'} key={item.id}>
            <span><input type="radio" name="gpa-method" checked={methodId === item.id} onChange={() => setMethodId(item.id)} /> <strong>{item.name}</strong></span><small>{item.explanation}</small></label>)}</fieldset>
          {error && <p className="gpa-error" role="alert">{error}</p>}
          <div className="gpa-actions"><button type="button" className="gpa-primary" onClick={calculate}>Calcular GPA</button><button type="button" className="gpa-secondary" onClick={clear}>Limpar tudo</button></div>
        </section>
        <aside className="gpa-panel gpa-guidance" aria-labelledby="gpa-guidance-title"><h2 id="gpa-guidance-title">Como ler esta estimativa</h2>
          <p>Não existe conversão oficial única entre as escalas. Cada universidade e cada avaliadora de credenciais, como WES e ECE, pode usar sua própria metodologia. O GPA calculado aqui não substitui uma avaliação oficial.</p>
          <p>Confira o método e os documentos exigidos pela universidade de destino antes de informar um GPA na candidatura.</p>
          <p>A fonte do método escolhido aparece no resultado. Os valores são referências a validar, não uma previsão de admissão.</p>
          <p><strong>Privacidade:</strong> o cálculo roda no seu navegador; nada é enviado ou salvo. Ao recarregar, os dados desaparecem.</p>
        </aside>
      </div>
      <section className="gpa-results" aria-live="polite" aria-atomic="true" aria-labelledby="gpa-result-title">
        {calculated && selectedResult && <><div className="gpa-results__heading"><h2 id="gpa-result-title">Seu resultado</h2><InfoBadge kind="estimate" /></div>
          {selectedResult.emptyAfterExclusions ? <p className="gpa-empty">Sem disciplinas para calcular. Inclua as reprovadas ou adicione uma disciplina aprovada.</p> : <div className="gpa-score"><strong>{number(selectedResult.gpa!)} <span>/ 4,0</span></strong><p>GPA estimado · {selectedResult.letter} <small>(conceito aproximado pela média brasileira)</small></p>
            <p>Média de origem: {number(selectedResult.sourceAverage!)} / 10</p></div>}
          <p className="gpa-source">Método: {method.name}. Fonte: <a href={method.source.url} target="_blank" rel="noreferrer">{method.source.label}</a>, verificada em 19/10/2026.</p>
          {methodId === 'bands' && <p className="gpa-note">Na faixa 5,0–5,9, a fonte associa C- a 1,5 ponto. Mantivemos o valor da fonte; em outras escalas americanas, C- vale aproximadamente 1,7.</p>}
          {calculated.input.mode === 'courses' && <>{!selectedResult.weighted && <p className="gpa-note">Nenhuma disciplina tem créditos: usamos média simples.</p>}
            <div className="gpa-table-wrap"><table><caption>Detalhes das disciplinas no método {method.name}</caption><thead><tr><th scope="col">Disciplina</th><th scope="col">Nota</th><th scope="col">Pontos</th><th scope="col">Créditos/horas</th><th scope="col">Situação</th></tr></thead><tbody>
              {selectedResult.courses.map((course, index) => <tr key={index}><th scope="row">{course.name}</th><td>{number(course.grade)}</td><td>{number(course.points)}</td><td>{course.credits === null ? '—' : number(course.credits)}</td><td>{course.excluded ? 'Ignorada' : course.letter === 'Reprovação' ? 'Reprovação incluída' : 'Incluída'}</td></tr>)}
              </tbody></table></div></>}
          <h3>Compare os três métodos</h3><p>Mesmas notas, regras diferentes. Os conceitos abaixo são aproximados pela média brasileira; o GPA por disciplina é a média dos pontos convertidos.</p>
          <div className="gpa-comparison">{GPA_METHODS.map((item, index) => <div className={item.id === methodId ? 'gpa-comparison__item gpa-comparison__item--active' : 'gpa-comparison__item'} key={item.id}><strong>{item.name}</strong><span>{calculated.results[index].gpa === null ? 'Sem disciplinas' : `${number(calculated.results[index].gpa)} / 4,0`}</span><small>{calculated.results[index].letter ?? '—'}</small></div>)}</div>
          <p className="gpa-note">Nenhum dos três resultados é oficial. Os valores podem variar conforme a avaliação. Consulte sempre a universidade de destino.</p>
        </>}
      </section>
    </div>
  </main>
}
