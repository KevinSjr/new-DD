import { useEffect, useRef, useState, type FormEvent } from 'react'
import './DocumentsPanel.css'

type Category = 'historico' | 'diploma' | 'traducao' | 'recomendacao' | 'certificado' | 'curriculo' | 'outro'
type Document = { id:string; fileName:string; category:Category; mimeType:string; sizeBytes:number; uploadedAt:string }
type DocumentsState = { documents:Document[]; maxDocuments:number; maxFileBytes:number }
const categories: { value:Category; label:string }[] = [
  { value:'historico', label:'Histórico escolar' }, { value:'diploma', label:'Diploma' },
  { value:'traducao', label:'Tradução' }, { value:'recomendacao', label:'Carta de recomendação' },
  { value:'certificado', label:'Certificado' }, { value:'curriculo', label:'Currículo' }, { value:'outro', label:'Outro' },
]
const formats: Record<string,string> = {
  '.pdf':'application/pdf', '.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
}
const formatBytes = (size:number) => size < 1024 * 1024 ? `${Math.ceil(size / 1024)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`

async function readJson(response:Response) {
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('A API de documentos não respondeu. Reinicie npm run dev.')
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a operação.')
  return data
}

export function DocumentsPanel() {
  const [state, setState] = useState<DocumentsState | null>(null)
  const [category, setCategory] = useState<Category>('traducao')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true
    fetch('/api/account/documents', { credentials:'same-origin' }).then(readJson).then((data:DocumentsState) => {
      if (active) setState(data)
    }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os documentos.') })
    return () => { active = false }
  }, [])

  async function upload(event:FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!file || !state || busy) return
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
    const mime = formats[extension]
    if (!mime) { setError('Escolha um arquivo PDF, DOCX, PNG ou JPG.'); return }
    if (file.size === 0 || file.size > state.maxFileBytes) { setError('Escolha um arquivo de até 5 MB.'); return }
    setBusy(true); setError(''); setNotice('')
    try {
      const response = await fetch('/api/account/documents', {
        method:'POST', credentials:'same-origin', body:file,
        headers:{ 'Content-Type':mime, 'X-Document-Name':encodeURIComponent(file.name), 'X-Document-Category':category },
      })
      const result = await readJson(response) as { document:Document }
      setState({ ...state, documents:[result.document, ...state.documents] })
      setNotice('Documento guardado na sua conta.')
      setFile(null)
      if (fileInput.current) fileInput.current.value = ''
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível enviar o arquivo.') }
    finally { setBusy(false) }
  }

  async function remove(document:Document) {
    if (!state || busy || !window.confirm(`Excluir “${document.fileName}” da sua conta? Esta ação não pode ser desfeita.`)) return
    setBusy(true); setError(''); setNotice('')
    try {
      await readJson(await fetch(`/api/account/documents/${document.id}`, { method:'DELETE', credentials:'same-origin' }))
      setState({ ...state, documents:state.documents.filter((item) => item.id !== document.id) })
      setNotice('Documento excluído.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível excluir o documento.') }
    finally { setBusy(false) }
  }

  return <div className="account-documents">
    <header><p className="account-page__eyebrow">Sua candidatura, organizada</p><h2>Meus documentos</h2><p>Guarde cópias de históricos, traduções, certificados e cartas que você possui. Os arquivos ficam disponíveis apenas na sua conta e são excluídos com ela.</p></header>
    {error && <p className="account-documents__error" role="alert">{error}</p>}
    {notice && <p className="account-documents__notice" role="status">{notice}</p>}
    {!state && !error && <p role="status">Carregando documentos…</p>}
    {!state && error && <button type="button" className="account-documents__button" onClick={() => { setError(''); fetch('/api/account/documents', { credentials:'same-origin' }).then(readJson).then(setState).catch((cause) => setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os documentos.')) }}>Tentar novamente</button>}
    {state && <>
      <form className="account-documents__upload" onSubmit={(event) => void upload(event)}>
        <div><h3>Adicionar documento</h3><p>PDF, DOCX, PNG ou JPG, até 5 MB por arquivo. {state.documents.length} de {state.maxDocuments} documentos usados.</p></div>
        <div className="account-documents__fields"><label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value as Category)}>{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label>Arquivo<input ref={fileInput} type="file" required accept=".pdf,.docx,.png,.jpg,.jpeg" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label></div>
        <button className="account-page__primary" type="submit" disabled={busy || !file || state.documents.length >= state.maxDocuments}>{busy ? 'Enviando…' : 'Guardar documento'}</button>
      </form>
      <section className="account-documents__library" aria-labelledby="documents-library-title"><div><h3 id="documents-library-title">Sua biblioteca</h3><span>{state.documents.length} {state.documents.length === 1 ? 'arquivo' : 'arquivos'}</span></div>
        {state.documents.length === 0 ? <p className="account-documents__empty">Nenhum documento enviado. Comece pelo arquivo que você já tem em mãos.</p> : <ul>{state.documents.map((document) => <li key={document.id}><div><strong>{document.fileName}</strong><span>{categories.find((item) => item.value === document.category)?.label} · {formatBytes(document.sizeBytes)} · {new Date(document.uploadedAt).toLocaleDateString('pt-BR')}</span></div><div><a href={`/api/account/documents/${document.id}/download`}>Baixar</a><button type="button" disabled={busy} onClick={() => void remove(document)}>Excluir</button></div></li>)}</ul>}
      </section>
      <p className="account-documents__note">Cartas confidenciais enviadas diretamente pelo recomendante à instituição devem ser acompanhadas no canal oficial da candidatura. Esta biblioteca não envia arquivos às universidades.</p>
    </>}
  </div>
}
