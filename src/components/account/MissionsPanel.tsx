import { useEffect, useState } from 'react'
import { Link } from '../../router/Link'
import './MissionsPanel.css'

type Mission = { key:string; frequency:'daily' | 'weekly' | 'monthly' | 'once'; title:string; detail:string; xp:number; href:string; target:number; progress:number; completed:boolean }
type MissionState = { xp:number; level:number; nextLevelXp:number; practiceDays:number; completedCurrent:number; missions:Mission[]; recentAwards:{ key:string; xp:number; awardedAt:string }[] }
const frequencyNames = { daily:'Hoje', weekly:'Esta semana', monthly:'Este mês', once:'Conquistas únicas' } as const
const frequencies = ['daily','weekly','monthly','once'] as const

export function MissionsPanel() {
  const [state, setState] = useState<MissionState | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const response = await fetch('/api/account/missions', { credentials:'same-origin' })
        if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('A API de missões não respondeu corretamente. Reinicie npm run dev.')
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Não foi possível carregar as missões.')
        if (active) { setState(result); setError('') }
      } catch (cause) { if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as missões.') }
      finally { if (active) setLoading(false) }
    }
    void load()
    window.addEventListener('daydreaming:missions-changed', load)
    return () => { active = false; window.removeEventListener('daydreaming:missions-changed', load) }
  }, [])

  const levelProgress = state ? (state.xp % 100) : 0
  return <div className="missions-panel">
    <div><p className="account-page__eyebrow">Progresso real</p><h2>Missões e XP</h2><p>A XP é registrada automaticamente quando você conclui ações verificáveis. Respostas erradas não reduzem sua XP, e dias sem atividade não retiram pontos.</p></div>
    {loading && !state && <p role="status">Carregando suas missões…</p>}
    {error && <p className="missions-panel__error" role="alert">{error}</p>}
    {state && <>
      <div className="account-v4__progress-stats">
        <div className="account-v4__level-card"><span className="account-v4__stat-label">Seu nível</span><div className="account-v4__level-identity"><span className="account-v4__level-number" aria-label={`Nível ${state.level}`}>{state.level}</span><div><strong>Explorador(a)</strong><small>{state.xp} XP acumulados</small></div></div><div className="account-v4__progress-track" role="progressbar" aria-label="Progresso de XP até o próximo nível" aria-valuemin={0} aria-valuemax={100} aria-valuenow={levelProgress}><span style={{ width:`${levelProgress}%` }} /></div><small>{state.nextLevelXp} XP para o nível {state.level + 1}</small></div>
        <div><span className="account-v4__stat-label">Missões neste período</span><strong className="account-v4__stat-value">{state.completedCurrent} de {state.missions.length}</strong><small>As missões diárias, semanais e mensais se renovam. A XP conquistada permanece.</small></div>
        <div><span className="account-v4__stat-label">Dias de prática</span><strong className="account-v4__stat-value">{state.practiceDays}</strong><small>Dias diferentes com um desafio SAT ou MEXT concluído e associado à sua conta.</small></div>
      </div>
      <div className="missions-panel__groups">{frequencies.map((frequency) => <section key={frequency} aria-labelledby={`mission-${frequency}`}><h3 id={`mission-${frequency}`}>{frequencyNames[frequency]}</h3><ul>{state.missions.filter((mission) => mission.frequency === frequency).map((mission) => <li key={mission.key} className={mission.completed ? 'is-complete' : ''}><div><strong>{mission.title}</strong><p>{mission.detail}</p><span>{mission.completed ? 'Concluída automaticamente' : mission.target > 1 ? `${mission.progress} de ${mission.target} dias` : 'A fazer'}</span></div><div><b>+{mission.xp} XP</b>{!mission.completed && <Link to={mission.href}>Ir para a atividade →</Link>}</div></li>)}</ul></section>)}</div>
      {state.recentAwards.length > 0 && <section className="missions-panel__recent" aria-labelledby="missions-recent-title"><h3 id="missions-recent-title">XP recebida recentemente</h3><ul>{state.recentAwards.map((item, index) => <li key={`${item.key}-${item.awardedAt}-${index}`}><span>{state.missions.find((mission) => mission.key === item.key)?.title || item.key}</span><strong>+{item.xp} XP</strong></li>)}</ul></section>}
      <p className="missions-panel__note">Para ganhar XP nos desafios, entre na sua conta. O desafio continua disponível sem login, mas um resultado anônimo só pode ser associado à conta no mesmo dia e neste navegador. Abrir uma página ou marcar tarefas na jornada não concede XP.</p>
    </>}
  </div>
}
