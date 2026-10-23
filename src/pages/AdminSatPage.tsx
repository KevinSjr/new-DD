import { useState, type FormEvent } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './AdminScholarshipsPage.css'

type Choice = { key: string; text: string }
type Question = {
  id: number; form_code: 'practice-4-paper' | 'practice-5-paper' | 'practice-6-paper'; section: 'reading-writing' | 'math'; module_number: number; question_number: number;
  passage: string; prompt: string; choices: Choice[]; answer_type: 'multiple-choice' | 'numeric';
  accepted_answers: string[]; explanation: string; image_path: string | null; source_url: string; source_page: number | null; status: 'draft' | 'published' | 'archived'
}
type Draft = Omit<Question, 'id' | 'accepted_answers'> & { answer: string }
const sourceUrl = 'https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-digital.pdf'
const blank = (): Draft => ({ form_code:'practice-4-paper', section:'reading-writing', module_number:1, question_number:1, passage:'', prompt:'',
  choices:'ABCD'.split('').map(key => ({ key, text:'' })), answer_type:'multiple-choice', answer:'A', explanation:'',
  image_path:null, source_url:sourceUrl, source_page:null, status:'draft' })

export function AdminSatPage() {
  useDocumentTitle('Gestão de questões SAT | Daydreaming')
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useState('')
  const [items, setItems] = useState<Question[]>([])
  const [form, setForm] = useState<Draft>(blank)
  const [editing, setEditing] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const change = <K extends keyof Draft>(key: K, value: Draft[K]) => setForm(current => ({ ...current, [key]:value }))
  async function request<T>(path: string, credential = auth, init: RequestInit = {}): Promise<T> {
    const response = await fetch(path, { ...init, headers:{ Authorization:`Basic ${credential}`, ...(init.body ? { 'Content-Type':'application/json' } : {}) } })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || 'Falha ao carregar as questões.')
    return data as T
  }
  async function reload(credential = auth) { setItems(await request<Question[]>('/api/admin/sat/questions', credential)) }
  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      const credential = btoa(unescape(encodeURIComponent(`${user}:${password}`)))
      await request('/api/admin/me', credential); await reload(credential)
      setAuth(credential); setPassword('')
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Falha ao entrar.') }
    finally { setBusy(false) }
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    const payload = { ...form, accepted_answers:form.answer_type === 'numeric' ? form.answer.split(';').map(item => item.trim()).filter(Boolean) : [form.answer],
      choices:form.answer_type === 'numeric' ? [] : form.choices }
    try {
      await request(editing ? `/api/admin/sat/questions/${editing}` : '/api/admin/sat/questions', auth,
        { method:editing ? 'PUT' : 'POST', body:JSON.stringify(payload) })
      await reload(); setForm(blank()); setEditing(null); setMessage('Questão salva no banco.')
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Não foi possível salvar.') }
    finally { setBusy(false) }
  }
  async function archive(item: Question) {
    if (!window.confirm(`Arquivar a questão do teste ${item.form_code.split('-')[1]}, ${item.section} ${item.module_number}.${item.question_number}? Ela sairá da prática.`)) return
    setBusy(true); setMessage('')
    try { await request(`/api/admin/sat/questions/${item.id}`, auth, { method:'DELETE' }); await reload(); setMessage('Questão arquivada.') }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Não foi possível arquivar.') }
    finally { setBusy(false) }
  }
  const filtered = items.filter(item => `${item.form_code} ${item.section} ${item.module_number} ${item.question_number} ${item.prompt}`.toLowerCase().includes(search.toLowerCase()))
  if (!auth) return <main className="sch-admin sch-admin--login"><header className="sch-admin__intro"><div><span>Área restrita</span><h1>Questões SAT</h1><p>Entre com o administrador do Daydreaming para gerenciar as questões.</p></div></header>
    <form className="sch-admin__panel" onSubmit={login}><h2>Entrar</h2><label>Usuário<input autoComplete="username" required value={user} onChange={event => setUser(event.target.value)} /></label>
      <label>Senha<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} /></label>
      <button disabled={busy}>Acessar painel</button>{message && <p role="alert">{message}</p>}</form></main>
  return <main className="sch-admin"><header className="sch-admin__intro"><div><span>Área restrita</span><h1>Banco de questões SAT</h1><p>Crie, revise e publique questões. Apenas as publicadas entram na prática.</p></div>
    <button className="sch-admin__secondary" onClick={() => { setAuth(''); setItems([]); setForm(blank()); setEditing(null) }}>Sair</button></header>
    {message && <p className="sch-admin__message" role="status">{message}</p>}
    <div className="sch-admin__grid"><section className="sch-admin__panel"><div className="sch-admin__section-head"><h2>Questões</h2><button className="sch-admin__secondary" onClick={() => { setForm(blank()); setEditing(null) }}>Nova questão</button></div>
      <label>Buscar questão<input type="search" value={search} onChange={event => setSearch(event.target.value)} /></label>
      <p>{items.filter(item => item.status === 'published').length} publicadas de {items.length} cadastradas.</p>
      {filtered.length ? <ul className="sch-admin__list">{filtered.map(item => <li key={item.id}><strong>Teste {item.form_code.split('-')[1]} · {item.section === 'math' ? 'Math' : 'Reading and Writing'} · Módulo {item.module_number}, questão {item.question_number}</strong>
        <small>{item.status === 'published' ? 'Publicada' : item.status === 'draft' ? 'Rascunho' : 'Arquivada'} · {item.prompt.slice(0, 90)}</small>
        <div className="sch-admin__actions"><button className="sch-admin__secondary" disabled={busy} onClick={() => { setEditing(item.id); setForm({ ...item, image_path:item.image_path || null, answer:item.accepted_answers.join('; ') }); window.scrollTo({ top:0,behavior:'smooth' }) }}>Editar</button>
          <button className="sch-admin__danger" disabled={busy} onClick={() => archive(item)}>Arquivar</button></div></li>)}</ul> : <p>Nenhuma questão encontrada.</p>}
    </section>
    <form className="sch-admin__panel" onSubmit={save}><div className="sch-admin__section-head"><h2>{editing ? 'Editar questão' : 'Nova questão'}</h2><span>{editing ? `#${editing}` : 'Rascunho'}</span></div>
      <label>Versão do teste<select value={form.form_code} onChange={event => { const formCode = event.target.value as Draft['form_code']; setForm(current => ({ ...current, form_code:formCode, source_url:/sat-practice-test-[456]-digital\.pdf$/.test(current.source_url) ? `https://satsuite.collegeboard.org/media/pdf/sat-practice-test-${formCode.split('-')[1]}-digital.pdf` : current.source_url })) }}><option value="practice-4-paper">Teste prático 4</option><option value="practice-5-paper">Teste prático 5</option><option value="practice-6-paper">Teste prático 6</option></select></label>
      <div className="sch-admin__pair"><label>Seção<select value={form.section} onChange={event => change('section', event.target.value as Draft['section'])}><option value="reading-writing">Reading and Writing</option><option value="math">Math</option></select></label>
        <label>Módulo<select value={form.module_number} onChange={event => change('module_number', Number(event.target.value))}><option value={1}>1</option><option value={2}>2</option></select></label></div>
      <div className="sch-admin__pair"><label>Número da questão<input type="number" min="1" max={form.section === 'math' ? 27 : 33} required value={form.question_number} onChange={event => change('question_number', Number(event.target.value))} /></label>
        <label>Página no PDF<input type="number" min="1" value={form.source_page || ''} onChange={event => change('source_page', event.target.value ? Number(event.target.value) : null)} /></label></div>
      <label>Texto de apoio<textarea rows={6} value={form.passage} onChange={event => change('passage', event.target.value)} /></label>
      <label>Pergunta *<textarea rows={3} required value={form.prompt} onChange={event => change('prompt', event.target.value)} /></label>
      <label>Tipo de resposta<select value={form.answer_type} onChange={event => change('answer_type', event.target.value as Draft['answer_type'])}><option value="multiple-choice">Múltipla escolha</option><option value="numeric">Resposta numérica (Math)</option></select></label>
      {form.answer_type === 'multiple-choice' && <fieldset><legend>Alternativas</legend>{form.choices.map((choice, index) => <label key={choice.key}>{choice.key}<input required value={choice.text} onChange={event => change('choices', form.choices.map((item, at) => at === index ? { ...item, text:event.target.value } : item))} /></label>)}</fieldset>}
      <label>{form.answer_type === 'numeric' ? 'Respostas aceitas, separadas por ponto e vírgula *' : 'Resposta correta *'}{form.answer_type === 'multiple-choice' ? <select value={form.answer} onChange={event => change('answer', event.target.value)}>{'ABCD'.split('').map(key => <option key={key} value={key}>{key}</option>)}</select> : <input required value={form.answer} onChange={event => change('answer', event.target.value)} />}</label>
      <label>Explicação da resposta<textarea rows={4} value={form.explanation} onChange={event => change('explanation', event.target.value)} /></label>
      <label>Caminho da imagem (opcional, em /sat-assets/)<input value={form.image_path || ''} onChange={event => change('image_path', event.target.value || null)} /></label>
      <label>Fonte HTTPS *<input type="url" required value={form.source_url} onChange={event => change('source_url', event.target.value)} /></label>
      <label>Estado<select value={form.status} onChange={event => change('status', event.target.value as Draft['status'])}><option value="draft">Rascunho</option><option value="published">Publicada</option><option value="archived">Arquivada</option></select></label>
      <p className="sch-admin__hint">Confira texto, imagem e gabarito antes de publicar. O modo exame só é liberado quando os quatro módulos estiverem completos.</p>
      <button disabled={busy}>{busy ? 'Salvando…' : 'Salvar questão'}</button>
    </form></div>
  </main>
}
