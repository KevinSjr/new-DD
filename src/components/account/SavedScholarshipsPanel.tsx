import { useEffect, useState } from 'react'
import { Link } from '../../router/Link'
import { recordAchievement } from '../../lib/achievementEvents'
import './SavedScholarshipsPanel.css'

type SavedScholarship = { source:string; source_id:string; title:string; source_label:string; source_url:string; saved_at:string; available:boolean }

export function SavedScholarshipsPanel() {
  const [items, setItems] = useState<SavedScholarship[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')

  async function load() {
    setError('')
    try {
      const response = await fetch('/api/account/saved-scholarships', { credentials:'same-origin' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Não foi possível carregar as bolsas salvas.')
      setItems(result.items)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as bolsas salvas.') }
  }
  useEffect(() => {
    let active = true
    fetch('/api/account/saved-scholarships', { credentials:'same-origin' }).then(async response => {
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Não foi possível carregar as bolsas salvas.')
      if (active) setItems(result.items)
    }).catch(cause => { if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as bolsas salvas.') })
    return () => { active = false }
  }, [])

  async function remove(item:SavedScholarship) {
    const key = `${item.source}:${item.source_id}`
    setBusy(key); setError('')
    try {
      const params = new URLSearchParams({ source:item.source, sourceId:item.source_id })
      const response = await fetch(`/api/account/saved-scholarships?${params}`, { method:'DELETE', credentials:'same-origin' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Não foi possível remover a bolsa.')
      setItems(previous => previous?.filter(row => row.source !== item.source || row.source_id !== item.source_id) || [])
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível remover a bolsa.') }
    finally { setBusy('') }
  }

  return <div className="account-saved-scholarships">
    <header><p className="account-page__eyebrow">Sua pesquisa</p><h2>Bolsas salvas</h2><p>Guarde oportunidades para consultar depois. Salvar uma bolsa não confirma que ela esteja aberta ou que você atenda aos critérios.</p></header>
    <Link className="account-saved-scholarships__explore" to="/bolsas">Explorar bolsas <span aria-hidden="true">→</span></Link>
    {error && <p role="alert" className="account-saved-scholarships__error">{error} <button type="button" onClick={() => void load()}>Tentar novamente</button></p>}
    {!items && !error && <p role="status">Carregando bolsas salvas…</p>}
    {items?.length === 0 && <p className="account-saved-scholarships__empty">Você ainda não salvou nenhuma bolsa. Explore o buscador e use “Salvar bolsa” nas oportunidades que quiser acompanhar.</p>}
    {items && items.length > 0 && <ul>{items.map(item => <li key={`${item.source}:${item.source_id}`}><div><h3>{item.title}</h3><p>{item.source_label} · Salva em {new Date(item.saved_at).toLocaleDateString('pt-BR')}</p>{!item.available && <p>Esta bolsa não está mais listada no catálogo. Confira a fonte original.</p>}</div><div className="account-saved-scholarships__actions"><a href={item.source_url} target="_blank" rel="noreferrer" onClick={() => recordAchievement('saved-source',`${item.source}:${item.source_id}`)}>Abrir fonte original <span aria-hidden="true">↗</span></a><button type="button" disabled={Boolean(busy)} onClick={() => void remove(item)}>{busy === `${item.source}:${item.source_id}` ? 'Removendo…' : 'Remover'}</button></div></li>)}</ul>}
    <p className="account-saved-scholarships__note">Os dados da oportunidade podem mudar após o salvamento. Confira prazo, valor e requisitos no edital antes de se candidatar.</p>
  </div>
}
