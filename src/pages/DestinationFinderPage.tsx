import { useEffect, useRef, useState } from 'react'
import { DESTINATION_PROFILES, DESTINATION_SOURCES, type Region } from '../data/destinationProfiles'
import { matchDestinations, type DestinationAnswers } from '../lib/destinationMatcher'
import { InfoBadge } from '../components/ui/InfoBadge'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Link } from '../router/Link'
import './DestinationFinderPage.css'

const regionOptions: { value: Region; label: string }[] = [
  { value: 'america', label: 'América do Norte' }, { value: 'europe', label: 'Europa' },
  { value: 'asia', label: 'Ásia' }, { value: 'oceania', label: 'Oceania' },
]
const questions = [
  [
    { key: 'climate', title: 'Que clima você prefere?', options: [['snow', 'Frio com neve'], ['mild', 'Ameno, com estações'], ['warm', 'Quente'], ['any', 'Tanto faz']] },
    { key: 'language', title: 'Em que idioma você quer estudar e viver?', options: [['english', 'Inglês'], ['learn', 'Aceito aprender o idioma local'], ['similar', 'Idioma parecido com português']] },
    { key: 'learningTime', title: 'Quanto tempo aceitaria investir em um novo idioma?', options: [['none', 'Nenhum'], ['year', 'Até 1 ano'], ['long', 'Quanto for preciso']] },
  ],
  [
    { key: 'budget', title: 'Qual é seu orçamento mensal para viver fora?', options: [['low', 'Baixo'], ['medium', 'Médio'], ['high', 'Alto']] },
    { key: 'tuition', title: 'Como pretende pagar o curso?', options: [['low', 'Preciso de curso sem ou com pouca mensalidade'], ['scholarship', 'Só com bolsa'], ['can-pay', 'Posso pagar']] },
    { key: 'place', title: 'Onde se sente melhor?', options: [['large', 'Cidade grande'], ['medium', 'Cidade média ou universitária'], ['nature', 'Perto da natureza']] },
    { key: 'work', title: 'Quer trabalhar durante o curso?', options: [['need', 'Preciso'], ['nice', 'Seria bom'], ['no', 'Não pretendo']] },
  ],
  [
    { key: 'after', title: 'O que gostaria de fazer depois do curso?', options: [['stay', 'Explorar oportunidades de permanência'], ['maybe', 'Ainda não sei'], ['return', 'Voltar ao Brasil']] },
    { key: 'level', title: 'O que pretende estudar?', options: [['undergraduate', 'Graduação'], ['graduate', 'Mestrado ou pós-graduação'], ['research', 'Doutorado ou pesquisa'], ['exchange', 'Intercâmbio'], ['language', 'Idioma'], ['short', 'Curso de curta duração'], ['undecided', 'Ainda não sei']] },
    { key: 'field', title: 'Qual área mais interessa?', options: [['stem', 'Exatas, tecnologia ou engenharia'], ['health', 'Saúde e ciências da vida'], ['humanities', 'Humanidades e educação'], ['business', 'Negócios e ciências sociais'], ['arts', 'Artes e criação'], ['undecided', 'Ainda não sei']] },
  ],
] as const
type RadioKey = Exclude<keyof DestinationAnswers, 'regions' | 'priorities'>
const stepKeys: (keyof DestinationAnswers)[][] = [
  ['regions', 'climate', 'language', 'learningTime'],
  ['budget', 'tuition', 'place', 'work'],
  ['after', 'level', 'field', 'priorities'],
]
const priorityOptions = [
  ['region', 'Região'], ['climate', 'Clima'], ['language', 'Idioma'],
] as const

function ResearchChecklist({ answers }: { answers: DestinationAnswers }) {
  const levelLabels: Record<DestinationAnswers['level'], string> = {
    undergraduate: 'graduação', graduate: 'mestrado ou pós-graduação', research: 'doutorado ou pesquisa',
    exchange: 'intercâmbio', language: 'idiomas', short: 'curta duração', undecided: 'um nível de estudo a definir',
  }
  return <div className="destination-checklist">
    <h3>Antes de escolher um destino, confirme</h3>
    <ul>
      <li>Um programa de {levelLabels[answers.level]}{answers.field === 'undecided' ? '' : ' na sua área de interesse'} e seu idioma de ensino.</li>
      {answers.learningTime !== 'none' && <li>O nível de idioma exigido pelo programa e se o tempo que você aceita investir para aprender é suficiente para alcançá-lo.</li>}
      <li>Mensalidade, moradia e despesas na cidade específica. Seu orçamento “{answers.budget === 'low' ? 'baixo' : answers.budget === 'medium' ? 'médio' : 'alto'}” não tem valor monetário definido e não foi usado para classificar países.</li>
      {answers.tuition === 'scholarship' && <li>Uma bolsa real que cubra os custos exigidos; nenhum destino aqui tem bolsa garantida.</li>}
      {answers.tuition === 'low' && <li>O preço do programa específico para estudantes brasileiros; cursos gratuitos ou baratos não foram presumidos.</li>}
      {answers.work !== 'no' && <li>As regras atuais de trabalho para o seu visto e curso. {answers.work === 'need' ? 'Não planeje pagar despesas essenciais com um trabalho ainda não confirmado.' : ''}</li>}
      {answers.after !== 'return' && <li>As regras atuais para permanecer após o curso; uma opção migratória não é garantida.</li>}
      {answers.place === 'nature' && <li>Cidades e campi próximos da natureza; o país inteiro não oferece o mesmo ambiente.</li>}
      {answers.place === 'large' && <li>Cursos e custos na cidade grande que você escolher.</li>}
      {answers.place === 'medium' && <li>Cidades universitárias de porte médio com cursos na sua área.</li>}
    </ul>
  </div>
}

export function DestinationFinderPage() {
  useDocumentTitle('Descobridor de destinos | Daydreaming')
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState<Partial<DestinationAnswers>>({ regions: [], priorities: [] })
  const [error, setError] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => { if (step >= 0) { headingRef.current?.focus(); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) } }, [step])
  const complete = step === 3
  const matches = complete ? matchDestinations(answers as DestinationAnswers, DESTINATION_PROFILES) : []
  const preferredMatches = complete ? matches.filter(match => answers.regions?.includes(match.profile.region)).slice(0, 5) : []

  function setRadio(key: RadioKey, value: string) {
    setAnswers(previous => ({ ...previous, [key]: value }))
    setError('')
  }
  function toggleRegion(value: Region) {
    setAnswers(previous => ({ ...previous, regions: previous.regions?.includes(value) ? previous.regions.filter(region => region !== value) : [...(previous.regions ?? []), value] }))
    setError('')
  }
  function togglePriority(value: 'region' | 'climate' | 'language') {
    setAnswers(previous => ({ ...previous, priorities: previous.priorities?.includes(value)
      ? previous.priorities.filter(priority => priority !== value)
      : (previous.priorities?.length ?? 0) < 2 ? [...(previous.priorities ?? []), value] : previous.priorities }))
    setError('')
  }
  function next() {
    const missing = stepKeys[step].find(key => key === 'regions' ? !answers.regions?.length : key === 'priorities' ? !answers.priorities?.length : !answers[key])
    if (missing) {
      setError('Responda todas as perguntas desta etapa para continuar.')
      document.getElementById(`destination-${missing}`)?.focus()
      return
    }
    setError('')
    setStep(step + 1)
  }
  function restart() { setAnswers({ regions: [], priorities: [] }); setError(''); setStep(-1) }

  return <main className="destination-page">
    <div className="container destination-page__top"><Link to="/#ferramentas">← Voltar às ferramentas</Link></div>
    {step === -1 && <div className="container destination-intro">
      <div><p className="destination-eyebrow">Explore possibilidades</p><h1>Que destino combina com você?</h1>
        <p>Responda sobre região, clima, idioma e seus planos de estudo. Ao final, veja destinos para investigar entre os 25 passaportes da home.</p>
        <div className="destination-intro__facts"><span>25 destinos</span><span>3 etapas</span><span>Sem cadastro</span></div>
        <button className="destination-primary" type="button" onClick={() => setStep(0)}>Começar a explorar →</button>
        <p className="destination-small">Suas respostas ficam apenas nesta página enquanto ela está aberta. Não são enviadas nem salvas.</p></div>
      <aside><span aria-hidden="true">✳</span><h2>Uma bússola, não uma decisão pronta</h2>
        <p>Esta versão compara preferências de região, idioma e clima. Orçamento, mensalidade, trabalho e permanência viram pontos de verificação — não afirmações sobre elegibilidade ou custo.</p>
        <p>O resultado não prevê aprovação, bolsa ou visto.</p></aside>
    </div>}
    {step >= 0 && step < 3 && <div className="container destination-flow">
      <header><p className="destination-eyebrow">Etapa {step + 1} de 3</p><h1 ref={headingRef} tabIndex={-1}>{['Onde você se imagina?', 'O que torna a viagem possível?', 'Que caminho quer seguir?'][step]}</h1>
        <progress value={step + 1} max={3} aria-label="Progresso do descobridor" /></header>
      {error && <p className="destination-error" role="alert">{error}</p>}
      {step === 0 && <fieldset className="destination-question" id="destination-regions" tabIndex={-1}><legend>Em qual parte do mundo você se imagina?</legend><p>Escolha uma ou mais regiões.</p>
        <div className="destination-choices">{regionOptions.map(option => <label key={option.value} className={answers.regions?.includes(option.value) ? 'is-selected' : ''}><input type="checkbox" checked={answers.regions?.includes(option.value) ?? false} onChange={() => toggleRegion(option.value)} />{option.label}</label>)}</div></fieldset>}
      {questions[step].map(question => <fieldset className="destination-question" key={question.key} id={`destination-${question.key}`} tabIndex={-1}><legend>{question.title}</legend>
        <div className="destination-choices">{question.options.map(([value, label]) => <label key={value} className={answers[question.key as RadioKey] === value ? 'is-selected' : ''}><input type="radio" name={`destination-${question.key}`} checked={answers[question.key as RadioKey] === value} onChange={() => setRadio(question.key as RadioKey, value)} />{label}</label>)}</div></fieldset>)}
      {step === 2 && <fieldset className="destination-question" id="destination-priorities" tabIndex={-1}><legend>Quais fatores mais importam ao comparar destinos?</legend><p>Escolha até dois. Eles terão peso maior na comparação inicial.</p>
        <div className="destination-choices">{priorityOptions.map(([value, label]) => <label key={value} className={answers.priorities?.includes(value) ? 'is-selected' : ''}><input type="checkbox" checked={answers.priorities?.includes(value) ?? false} disabled={!answers.priorities?.includes(value) && answers.priorities?.length === 2} onChange={() => togglePriority(value)} />{label}</label>)}</div></fieldset>}
      <div className="destination-flow__actions">{step > 0 && <button type="button" className="destination-secondary" onClick={() => { setError(''); setStep(step - 1) }}>Voltar</button>}<button type="button" className="destination-primary" onClick={next}>{step === 2 ? 'Ver destinos →' : 'Continuar →'}</button></div>
    </div>}
    {complete && <div className="container destination-result">
      <header><p className="destination-eyebrow">Sua rota começa aqui</p><h1 ref={headingRef} tabIndex={-1}>Destinos para investigar</h1><InfoBadge kind="estimate" />
        <p>Estes são os destinos mais alinhados dentro das regiões que você escolheu. A ordem não é uma porcentagem de chance nem confirma que um curso ou bolsa esteja disponível.</p></header>
      <div className="destination-result__grid">{preferredMatches.map((match, index) => <article className="destination-match" key={match.profile.slug}>
        <span className="destination-match__number">{String(index + 1).padStart(2, '0')}</span><div><h2>{match.profile.name}</h2>
          <p>{match.reasons[0] ?? 'Pode ser uma opção para explorar, mas não corresponde às primeiras preferências.'}</p>
          {match.reasons.length > 1 && <ul>{match.reasons.slice(1).map(reason => <li key={reason}>{reason}</li>)}</ul>}
          {match.cautions.length > 0 && <p className="destination-match__caution"><strong>Atenção:</strong> {match.cautions[0]}</p>}
          {match.profile.slug === 'alemanha' && <Link to="/paises/alemanha">Explorar guia da Alemanha →</Link>}</div></article>)}</div>
      <ResearchChecklist answers={answers as DestinationAnswers} />
      <details className="destination-others"><summary>Ver os 25 destinos, incluindo outras regiões</summary><ol>{matches.map(match => <li key={match.profile.slug}>{match.profile.name}</li>)}</ol></details>
      <div className="destination-method"><h2>Como chegamos a esta lista</h2><p>Primeiro mostramos apenas destinos das regiões escolhidas. Dentro delas, comparamos possibilidades gerais de clima e afinidade com o idioma do cotidiano. Os fatores que você priorizou receberam peso maior. Empates seguem a ordem dos passaportes da home. Clima pode variar muito por cidade; idioma de um curso depende da instituição.</p>
        <p>Custo de vida, mensalidade, bolsas, trabalho e regras após o curso <strong>não entram na classificação</strong> sem dados oficiais atualizados para o programa e para sua situação. Eles aparecem no checklist para orientar a próxima pesquisa.</p>
        <p>Referências gerais verificadas em 19/10/2026: <a href={DESTINATION_SOURCES.region} target="_blank" rel="noreferrer">regiões da ONU</a> e <a href={DESTINATION_SOURCES.climate} target="_blank" rel="noreferrer">portal climático do Banco Mundial</a>. As categorias amplas do teste são uma síntese editorial, não classificações oficiais de cursos ou cidades.</p></div>
      <div className="destination-result__actions"><Link to="/rankings">Explorar universidades nos rankings →</Link><button type="button" className="destination-secondary" onClick={restart}>Refazer teste</button></div>
    </div>}
  </main>
}
