import { useEffect, useState } from 'react'
import { GPA_METHODS } from '../../data/gpaMethods'
import { Link } from '../../router/Link'
import './SavedGpaEstimates.css'

type Estimate = { bands: number; proportional: number; letters: number; sourceAverage: number; inputMode: 'average' | 'courses'; weighted: boolean; passingGrade: number | null; includeFailed: boolean | null; savedAt: string }
const format = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function SavedGpaEstimates() {
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetch('/api/account/gpa-estimates', { credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('A API não respondeu corretamente. Reinicie npm run dev.')
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || 'Não foi possível carregar as estimativas.')
        return payload as { estimate: Estimate | null }
      })
      .then(({ estimate }) => { if (active) setEstimate(estimate) })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as estimativas.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function remove() {
    if (!window.confirm('Remover as três estimativas de GPA salvas no seu perfil?')) return
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/account/gpa-estimates', { method: 'DELETE', credentials: 'same-origin' })
      if (!response.ok) throw new Error('Não foi possível remover as estimativas.')
      setEstimate(null)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível remover as estimativas.') }
    finally { setBusy(false) }
  }

  return <section className="saved-gpa" aria-labelledby="saved-gpa-title"><div className="saved-gpa__heading"><div><h3 id="saved-gpa-title">Estimativas da calculadora de GPA</h3><p>Estes resultados são aproximações e não substituem a avaliação da universidade ou de uma empresa de credenciais.</p></div><Link to="/calculadora-gpa">{estimate ? 'Refazer cálculo' : 'Abrir calculadora'}</Link></div>
    {loading && <p role="status">Carregando estimativas…</p>}
    {error && <p role="alert" className="saved-gpa__error">{error}</p>}
    {!loading && !error && !estimate && <p>Você ainda não salvou estimativas de GPA.</p>}
    {estimate && <><dl className="saved-gpa__values">{GPA_METHODS.map((method) => <div key={method.id}><dt>{method.name}</dt><dd>{format(estimate[method.id])} / 4,0</dd><a href={method.source.url} target="_blank" rel="noopener noreferrer">Fonte do método <span className="sr-only">(abre em nova aba)</span></a></div>)}</dl>
      <p className="saved-gpa__details">Média brasileira usada: {format(estimate.sourceAverage)} / 10 · {estimate.inputMode === 'average' ? 'Média geral (CR)' : `${estimate.weighted ? 'Média ponderada por créditos' : 'Média simples'} · aprovação a partir de ${format(estimate.passingGrade!)} · ${estimate.includeFailed ? 'reprovações incluídas' : 'reprovações ignoradas'}`} · salvo em {new Date(estimate.savedAt).toLocaleDateString('pt-BR')}.</p>
      <button type="button" disabled={busy} onClick={() => void remove()}>{busy ? 'Removendo…' : 'Remover estimativas salvas'}</button>
    </>}
  </section>
}
