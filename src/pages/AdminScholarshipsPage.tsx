import { useEffect, useState, type FormEvent } from 'react'
import './AdminScholarshipsPage.css'

type Country = { slug: string; name: string }
type Scholarship = {
  id: number; title: string; organization: string; edition: string | null; summary: string; eligibility: string;
  funding_details: string; study_level: string; deadline_type: string; deadline_date: string | null;
  deadline_timezone: string | null; application_url: string | null; source_label: string; source_url: string;
  source_verified_at: string; status: string; deleted_at: string | null; countries: string[]
}
type FormData = Omit<Scholarship, 'id' | 'deleted_at'>
const empty: FormData = { title:'',organization:'',edition:'',summary:'',eligibility:'',funding_details:'',study_level:'graduacao',
  deadline_type:'unknown',deadline_date:null,deadline_timezone:null,application_url:'',source_label:'',source_url:'',source_verified_at:'',status:'draft',countries:[] }
const levels = [['graduacao','Graduação'],['pos-graduacao','Pós-graduação'],['mestrado','Mestrado'],['doutorado','Doutorado'],
  ['intercambio','Intercâmbio'],['idiomas','Idiomas'],['curso-curto','Curso curto'],['pesquisa','Pesquisa'],['outro','Outro']]
const statusLabel: Record<string,string> = { draft:'Rascunho', published:'Publicada', archived:'Arquivada' }

export function AdminScholarshipsPage() {
  const [auth, setAuth] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [countries, setCountries] = useState<Country[]>([])
  const [items, setItems] = useState<Scholarship[]>([])
  const [form, setForm] = useState<FormData>(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [search, setSearch] = useState('')

  async function request(path: string, credential = auth, init: RequestInit = {}) {
    const response = await fetch(path, { ...init, headers: { Authorization: `Basic ${credential}`, ...(init.body ? { 'Content-Type':'application/json' } : {}) } })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error || 'Não foi possível concluir a operação.')
    return payload
  }
  async function refresh(credential = auth) {
    const [records, destinations] = await Promise.all([request('/api/admin/scholarships', credential), request('/api/countries', credential)])
    setItems(records); setCountries(destinations)
  }
  useEffect(() => { document.title = 'Administração de bolsas | Daydreaming' }, [])
  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      const credential = btoa(unescape(encodeURIComponent(`${username}:${password}`)))
      await request('/api/admin/me', credential)
      await refresh(credential)
      setAuth(credential); setPassword('')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao entrar.') }
    finally { setBusy(false) }
  }
  const change = (key: keyof FormData, value: string | string[] | null) => setForm(current => ({ ...current, [key]:value }))
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      await request(editing ? `/api/admin/scholarships/${editing}` : '/api/admin/scholarships', auth, {
        method:editing ? 'PUT':'POST', body:JSON.stringify(form),
      })
      await refresh(); setEditing(null); setForm(empty); setMessage('Bolsa salva com sucesso.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao salvar.') }
    finally { setBusy(false) }
  }
  async function remove(item: Scholarship) {
    if (!window.confirm(`Arquivar e remover “${item.title}” da publicação? Você poderá restaurá-la.`)) return
    setBusy(true); setMessage('')
    try { await request(`/api/admin/scholarships/${item.id}`, auth, { method:'DELETE' }); await refresh(); setMessage('Bolsa removida. É possível restaurá-la.') }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao remover.') }
    finally { setBusy(false) }
  }
  async function restore(item: Scholarship) {
    setBusy(true); setMessage('')
    try { await request(`/api/admin/scholarships/${item.id}/restore`, auth, { method:'POST' }); await refresh(); setMessage('Bolsa restaurada como rascunho.') }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao restaurar.') }
    finally { setBusy(false) }
  }
  const filtered = items.filter(item => `${item.title} ${item.organization}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))

  if (!auth) return <section className="sch-admin sch-admin--login"><div className="sch-admin__intro"><span>Área restrita</span><h1>Gestão de bolsas</h1><p>Acesse para cadastrar e revisar oportunidades. Nada é publicado automaticamente.</p></div>
    <form className="sch-admin__panel" onSubmit={login}><h2>Entrar</h2><label>Usuário<input autoComplete="username" required value={username} onChange={e => setUsername(e.target.value)} /></label>
      <label>Senha<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
      <button disabled={busy}>Acessar painel</button>{message && <p role="alert">{message}</p>}</form></section>

  return <section className="sch-admin"><header className="sch-admin__intro"><div><span>Área restrita</span><h1>Banco de bolsas</h1><p>Cadastre, revise e publique apenas oportunidades confirmadas diretamente na fonte.</p></div>
    <button className="sch-admin__secondary" onClick={() => { setAuth(''); setForm(empty); setEditing(null); setItems([]) }}>Sair</button></header>
    {message && <p className="sch-admin__message" role="status">{message}</p>}
    <div className="sch-admin__grid"><div className="sch-admin__panel"><div className="sch-admin__section-head"><h2>Oportunidades</h2><button className="sch-admin__secondary" onClick={() => { setForm(empty); setEditing(null) }}>Nova bolsa</button></div>
      <label>Buscar por título ou organização<input type="search" value={search} onChange={e => setSearch(e.target.value)} /></label>
      {filtered.length ? <ul className="sch-admin__list">{filtered.map(item => <li key={item.id}><div><strong>{item.title}</strong><small>{item.organization} · {statusLabel[item.status]}{item.deleted_at ? ' · Removida' : ''}</small></div>
        <div className="sch-admin__actions"><button className="sch-admin__secondary" disabled={busy || !!item.deleted_at} onClick={() => { setEditing(item.id); setForm({ ...item, edition:item.edition || '', deadline_date:item.deadline_date?.slice(0,10) || null, source_verified_at:item.source_verified_at?.slice(0,10) || '', application_url:item.application_url || '' }); window.scrollTo({ top:0,behavior:'smooth' }) }}>Editar</button>
        {item.deleted_at ? <button className="sch-admin__secondary" disabled={busy} onClick={() => restore(item)}>Restaurar</button> : <button className="sch-admin__danger" disabled={busy} onClick={() => remove(item)}>Remover</button>}</div></li>)}</ul> : <p>Nenhuma bolsa encontrada. Comece criando um rascunho com fonte oficial.</p>}</div>
    <form className="sch-admin__panel sch-admin__form" onSubmit={save}><div className="sch-admin__section-head"><h2>{editing ? 'Editar bolsa' : 'Nova bolsa'}</h2><span>{editing ? `#${editing}` : 'Rascunho'}</span></div>
      <label>Título *<input required minLength={3} maxLength={200} value={form.title} onChange={e => change('title',e.target.value)} /></label>
      <label>Organização responsável *<input required minLength={2} maxLength={200} value={form.organization} onChange={e => change('organization',e.target.value)} /></label>
      <label>Edição/ano<input maxLength={100} value={form.edition || ''} onChange={e => change('edition',e.target.value)} /></label>
      <label>Nível de estudo *<select value={form.study_level} onChange={e => change('study_level',e.target.value)}>{levels.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <fieldset><legend>Países de destino *</legend><div className="sch-admin__countries">{countries.map(country => <label key={country.slug}><input type="checkbox" checked={form.countries.includes(country.slug)} onChange={e => change('countries',e.target.checked ? [...form.countries,country.slug] : form.countries.filter(slug => slug !== country.slug))} />{country.name}</label>)}</div></fieldset>
      <label>Resumo<textarea rows={3} value={form.summary} onChange={e => change('summary',e.target.value)} /></label>
      <label>Quem pode se candidatar<textarea rows={4} value={form.eligibility} onChange={e => change('eligibility',e.target.value)} /></label>
      <label>O que a bolsa cobre<textarea rows={4} value={form.funding_details} onChange={e => change('funding_details',e.target.value)} /></label>
      <label>Tipo de prazo *<select value={form.deadline_type} onChange={e => { change('deadline_type',e.target.value); if (e.target.value !== 'fixed') setForm(current => ({ ...current,deadline_type:e.target.value,deadline_date:null,deadline_timezone:null })) }}><option value="unknown">Não confirmado</option><option value="rolling">Contínuo</option><option value="fixed">Data definida</option></select></label>
      {form.deadline_type === 'fixed' && <div className="sch-admin__pair"><label>Data *<input type="date" required value={form.deadline_date || ''} onChange={e => change('deadline_date',e.target.value)} /></label><label>Fuso horário *<input required placeholder="Ex.: America/New_York" value={form.deadline_timezone || ''} onChange={e => change('deadline_timezone',e.target.value)} /></label></div>}
      <label>Link oficial de inscrição<input type="url" placeholder="https://" value={form.application_url || ''} onChange={e => change('application_url',e.target.value)} /></label>
      <div className="sch-admin__source"><h3>Fonte e verificação</h3><label>Nome da fonte *<input required value={form.source_label} onChange={e => change('source_label',e.target.value)} /></label><label>URL da fonte (HTTPS) *<input required type="url" pattern="https://.*" value={form.source_url} onChange={e => change('source_url',e.target.value)} /></label><label>Verificada em *<input required type="date" value={form.source_verified_at} onChange={e => change('source_verified_at',e.target.value)} /></label></div>
      <label>Status *<select value={form.status} onChange={e => change('status',e.target.value)}><option value="draft">Rascunho</option><option value="published">Publicada</option><option value="archived">Arquivada</option></select></label>
      <p className="sch-admin__hint">Para publicar, são obrigatórios resumo, elegibilidade, cobertura e link de inscrição. Confira sempre a fonte original.</p>
      <button disabled={busy}>{busy ? 'Salvando…' : editing ? 'Salvar alterações' : 'Criar bolsa'}</button></form></div></section>
}
