import { useEffect, useState } from 'react'
import { Link } from '../../router/Link'
import { achievementIcons, missionIcons } from './progressIcons'
import { ProgressBadge } from './ProgressBadge'
import './MissionsPanel.css'

type Mission = { key:string; frequency:'daily' | 'weekly' | 'monthly' | 'once'; title:string; detail:string; xp:number; href:string; target:number; progress:number; completed:boolean }
type Achievement = { category:string; key:string; title:string; detail:string; xp:number; href:string; target:number; progress:number; completed:boolean; available:boolean }
type MissionState = { xp:number; level:number; nextLevelXp:number; practiceDays:number; streak:{ current:number; best:number; practicedToday:boolean }; completedCurrent:number; missions:Mission[]; achievements:Achievement[]; recentAwards:{ key:string; xp:number; awardedAt:string }[] }
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
        if (!result.streak || !Array.isArray(result.achievements)) throw new Error('A API ainda está na versão anterior. Reinicie npm run dev para ver suas conquistas.')
        if (active) { setState(result); setError('') }
      } catch (cause) { if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as missões.') }
      finally { if (active) setLoading(false) }
    }
    void load()
    window.addEventListener('daydreaming:missions-changed', load)
    return () => { active = false; window.removeEventListener('daydreaming:missions-changed', load) }
  }, [])

  const levelProgress = state ? (state.xp % 100) : 0
  const achievementCategories = state ? [...new Set(state.achievements.map(item => item.category))] : []
  const availableAchievements = state?.achievements.filter(item => item.available) || []
  return <div className="missions-panel">
    <div><p className="account-page__eyebrow">Progresso real</p><h2>Missões, conquistas e XP</h2><p>A XP é registrada automaticamente conforme suas ações na conta. Respostas erradas não reduzem sua XP, e dias sem atividade não retiram pontos.</p></div>
    {loading && !state && <p role="status">Carregando suas missões…</p>}
    {error && <p className="missions-panel__error" role="alert">{error}</p>}
    {state && <>
      <div className="account-v4__progress-stats">
        <div className="account-v4__level-card"><span className="account-v4__stat-label">Seu nível</span><div className="account-v4__level-identity"><span className="account-v4__level-number" aria-label={`Nível ${state.level}`}>{state.level}</span><div><strong>Explorador(a)</strong><small>{state.xp} XP acumulados</small></div></div><div className="account-v4__progress-track" role="progressbar" aria-label="Progresso de XP até o próximo nível" aria-valuemin={0} aria-valuemax={100} aria-valuenow={levelProgress}><span style={{ width:`${levelProgress}%` }} /></div><small>{state.nextLevelXp} XP para o nível {state.level + 1}</small></div>
        <div><span className="account-v4__stat-label">Missões neste período</span><strong className="account-v4__stat-value">{state.completedCurrent} de {state.missions.length}</strong><small>As missões diárias, semanais e mensais se renovam. A XP conquistada permanece.</small></div>
        <div><span className="account-v4__stat-label">Dias seguidos</span><strong className="account-v4__stat-value">{state.streak.current}</strong><small>{state.streak.practicedToday ? 'Você já fez uma atividade hoje.' : state.streak.current > 0 ? 'Explore ou pratique hoje para manter a sequência.' : 'Faça uma atividade para começar.'}</small><small>Recorde: {state.streak.best} {state.streak.best === 1 ? 'dia' : 'dias'} · {state.practiceDays} {state.practiceDays === 1 ? 'dia de prática no total' : 'dias de prática no total'}.</small></div>
      </div>
      <div className="missions-panel__groups">{frequencies.map((frequency) => <section key={frequency} aria-labelledby={`mission-${frequency}`}><h3 id={`mission-${frequency}`}>{frequencyNames[frequency]}</h3><ul>{state.missions.filter((mission) => mission.frequency === frequency).map((mission) => <li key={mission.key} className={mission.completed ? 'is-complete' : ''}><div className="missions-panel__item-main"><ProgressBadge icon={missionIcons[mission.key] ?? 'target'} category={mission.frequency} completed={mission.completed} /><div className="missions-panel__item-copy"><strong>{mission.title}</strong><p>{mission.detail}</p><span>{mission.completed ? 'Concluída automaticamente' : mission.target > 1 ? `${mission.progress} de ${mission.target} dias` : 'A fazer'}</span></div></div><div className="missions-panel__item-actions"><b>+{mission.xp} XP</b>{!mission.completed && <Link to={mission.href}>Ir para a atividade →</Link>}</div></li>)}</ul></section>)}</div>
      <section className="missions-panel__achievements" aria-labelledby="achievements-title"><div className="missions-panel__achievements-heading"><div><h3 id="achievements-title">Suas conquistas</h3><p>Marcos únicos da sua exploração e preparação. Cada um concede XP uma vez.</p></div><strong>{availableAchievements.filter(item => item.completed).length} de {availableAchievements.length}</strong></div>
        {achievementCategories.map(category => { const group = state.achievements.filter(item => item.category === category); return <details key={category}><summary>{category} <span>{group.filter(item => item.completed).length} de {group.filter(item => item.available).length}</span></summary><ul>{group.map(item => <li key={item.key} className={`${item.completed ? 'is-complete' : ''} ${!item.available ? 'is-unavailable' : ''}`}><div className="missions-panel__item-main"><ProgressBadge icon={achievementIcons[item.key] ?? 'star'} category={item.category} completed={item.completed} available={item.available} /><div className="missions-panel__item-copy"><strong>{item.title}</strong><p>{item.detail}</p><span>{item.completed ? 'Conquistada' : item.available ? `${item.progress} de ${item.target}` : 'Ainda indisponível nesta versão'}</span></div></div><div className="missions-panel__item-actions"><b>{item.available ? `+${item.xp} XP` : 'Em preparação'}</b>{item.available && !item.completed && <Link to={item.href}>Explorar →</Link>}</div></li>)}</ul></details> })}
      </section>
      {state.recentAwards.length > 0 && <section className="missions-panel__recent" aria-labelledby="missions-recent-title"><h3 id="missions-recent-title">XP recebida recentemente</h3><ul>{state.recentAwards.map((item, index) => <li key={`${item.key}-${item.awardedAt}-${index}`}><span>{item.key === 'avatar-first' ? 'Avatar personalizado' : state.missions.find((mission) => mission.key === item.key)?.title || state.achievements.find(achievement => `achievement-${achievement.key}` === item.key)?.title || item.key}</span><strong>+{item.xp} XP</strong></li>)}</ul></section>}
      <p className="missions-panel__note">Entre na conta antes de explorar para registrar conquistas. Alguns marcos da jornada são baseados em etapas que você próprio marcou como concluídas. Simulados e testes continuam disponíveis sem login. A coleção não guarda respostas; para a conquista de evolução no SAT, guarda somente as faixas de pontuação das duas áreas.</p>
    </>}
  </div>
}
