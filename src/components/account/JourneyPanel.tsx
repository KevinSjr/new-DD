import { useEffect, useState, type FormEvent } from 'react'
import { Link } from '../../router/Link'
import { JOURNEY_STAGES, JOURNEY_TASK_COUNT } from '../../data/journey'
import './JourneyPanel.css'

type TaskState = { key: string; status: 'done' | 'skipped' }
type Deadline = { id: string; title: string; dueDate: string; note: string | null }
type Journey = { tasks: TaskState[]; deadlines: Deadline[] }

async function request<T>(path: string, method = 'GET', data?: unknown): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, { method, credentials: 'same-origin', headers: data === undefined ? undefined : { 'Content-Type': 'application/json' }, body: data === undefined ? undefined : JSON.stringify(data) })
  } catch { throw new Error('Não foi possível acessar a API. Confira se o servidor está em execução.') }
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('A API não respondeu corretamente. Reinicie npm run dev.')
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Não foi possível salvar. Tente novamente.')
  return payload as T
}

function dateLabel(value: string) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function JourneyPanel() {
  const [journey, setJourney] = useState<Journey | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busyKey, setBusyKey] = useState('')
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [note, setNote] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    request<Journey>('/api/account/journey').then((data) => { if (active) setJourney(data) }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar a jornada.') })
    return () => { active = false }
  }, [])

  const taskStatus = new Map(journey?.tasks.map((task) => [task.key, task.status]))
  const done = journey?.tasks.filter((task) => task.status === 'done').length || 0
  const skipped = journey?.tasks.filter((task) => task.status === 'skipped').length || 0
  const progress = Math.round(done / JOURNEY_TASK_COUNT * 100)
  const today = new Date().toLocaleDateString('en-CA')

  async function changeTask(key: string, status: 'done' | 'skipped' | null) {
    if (!journey) return
    setBusyKey(key); setError(''); setNotice('')
    try {
      await request(`/api/account/journey/tasks/${key}`, status ? 'PUT' : 'DELETE', status ? { status } : undefined)
      setJourney({ ...journey, tasks: [...journey.tasks.filter((task) => task.key !== key), ...(status ? [{ key, status }] : [])] })
      setNotice(status === 'done' ? 'Etapa marcada como concluída.' : status === 'skipped' ? 'Etapa pulada. Você pode retomá-la quando quiser.' : 'Etapa reaberta.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar a etapa.') }
    finally { setBusyKey('') }
  }

  function resetForm() { setTitle(''); setDueDate(''); setNote(''); setEditingId(null) }

  async function saveDeadline(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!journey) return
    setBusyKey('deadline'); setError(''); setNotice('')
    try {
      const result = await request<Deadline>(editingId ? `/api/account/journey/deadlines/${editingId}` : '/api/account/journey/deadlines', editingId ? 'PUT' : 'POST', { title, dueDate, note })
      setJourney({ ...journey, deadlines: [...journey.deadlines.filter((item) => item.id !== result.id), result].sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title)) })
      setNotice(editingId ? 'Prazo atualizado.' : 'Prazo salvo na sua conta.')
      resetForm()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar o prazo.') }
    finally { setBusyKey('') }
  }

  async function removeDeadline(id: string) {
    if (!journey || !window.confirm('Remover este prazo da sua jornada?')) return
    setBusyKey(id); setError(''); setNotice('')
    try {
      await request(`/api/account/journey/deadlines/${id}`, 'DELETE')
      setJourney({ ...journey, deadlines: journey.deadlines.filter((item) => item.id !== id) })
      if (editingId === id) resetForm()
      setNotice('Prazo removido.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível remover o prazo.') }
    finally { setBusyKey('') }
  }

  return <div className="journey">
    <div className="journey__heading"><p className="account-page__eyebrow">Seu plano, no seu ritmo</p><h2>Minha jornada</h2><p>Avance por etapas reais da sua preparação. Você escolhe quando concluir ou pular uma tarefa; abrir um link não marca progresso automaticamente.</p>{journey && <a className="journey__button" href="#journey-deadlines-title">Adicionar um prazo</a>}</div>
    {error && <p className="journey__message journey__message--error" role="alert">{error}</p>}
    {notice && <p className="journey__message" role="status">{notice}</p>}
    {!journey && !error && <p role="status">Carregando sua jornada…</p>}
    {!journey && error && <button type="button" className="journey__button" onClick={() => { setError(''); request<Journey>('/api/account/journey').then(setJourney).catch((cause) => setError(cause instanceof Error ? cause.message : 'Não foi possível carregar.')) }}>Tentar novamente</button>}
    {journey && <>
      <div className="journey__overview"><div><strong>{done} de {JOURNEY_TASK_COUNT}</strong><span>tarefas concluídas{skipped ? ` · ${skipped} puladas` : ''}</span></div><div className="journey__progress" role="progressbar" aria-label="Progresso da jornada" aria-valuemin={0} aria-valuemax={JOURNEY_TASK_COUNT} aria-valuenow={done}><span style={{ width: `${progress}%` }} /></div><p>{progress}% da jornada concluída. As tarefas puladas não entram no cálculo.</p></div>
      <section className="journey__deadlines" aria-labelledby="journey-deadlines-title"><div><h3 id="journey-deadlines-title">Meus prazos</h3><p>Registre datas das oportunidades que você está acompanhando. Confira sempre o ano e o fuso horário no edital.</p></div>
        <form className="journey__deadline-form" onSubmit={saveDeadline}><label>O que vence?<input required minLength={2} maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: candidatura ao curso" /></label><label>Data<input required type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><label className="journey__note">Observação (opcional)<input maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ex.: confira o horário no site oficial" /></label><div><button className="account-page__primary" type="submit" disabled={Boolean(busyKey)}>{editingId ? 'Salvar alteração' : 'Adicionar prazo'}</button>{editingId && <button className="journey__button" type="button" onClick={resetForm}>Cancelar edição</button>}</div></form>
        {journey.deadlines.length === 0 ? <p className="journey__empty">Nenhum prazo registrado ainda.</p> : <ul className="journey__deadline-list">{journey.deadlines.map((item) => <li key={item.id}><div><strong>{item.title}</strong><span>{dateLabel(item.dueDate)}{item.dueDate < today ? ' · prazo passado' : item.dueDate === today ? ' · hoje' : ''}</span>{item.note && <p>{item.note}</p>}</div><div><button type="button" disabled={Boolean(busyKey)} onClick={() => { setEditingId(item.id); setTitle(item.title); setDueDate(item.dueDate); setNote(item.note || ''); document.querySelector('.journey__deadline-form')?.scrollIntoView({ block: 'center' }) }}>Editar</button><button type="button" disabled={Boolean(busyKey)} onClick={() => void removeDeadline(item.id)}>Remover</button></div></li>)}</ul>}
      </section>
      <ol className="journey__stages">{JOURNEY_STAGES.map((stage, index) => {
        const stageDone = stage.tasks.filter((task) => taskStatus.get(task.key) === 'done').length
        return <li key={stage.title} className="journey__stage"><div className="journey__stage-head"><span className="journey__number">{String(index + 1).padStart(2, '0')}</span><div><h3>{stage.title}</h3><p>{stage.description}</p></div><span className="journey__count">{stageDone}/{stage.tasks.length}</span></div><ul className="journey__tasks">{stage.tasks.map((task) => {
          const state = taskStatus.get(task.key)
          return <li key={task.key} className={state === 'done' ? 'is-done' : ''}><div className="journey__task-copy"><strong>{task.title}</strong><p>{task.detail}</p><span>{state === 'done' ? 'Concluída por você' : state === 'skipped' ? 'Pulada por você' : 'A fazer'}</span></div><div className="journey__task-actions">{'href' in task && task.href && <Link to={task.href}>{task.action}</Link>}{state ? <button type="button" disabled={Boolean(busyKey)} onClick={() => void changeTask(task.key, null)}>Reabrir</button> : <><button type="button" disabled={Boolean(busyKey)} onClick={() => void changeTask(task.key, 'done')}>Concluir</button><button type="button" disabled={Boolean(busyKey)} onClick={() => void changeTask(task.key, 'skipped')}>Pular</button></>}</div></li>
        })}</ul></li>
      })}</ol>
    </>}
  </div>
}
