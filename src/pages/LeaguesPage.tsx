import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '../router/Link'
import { useLocation } from '../router/navigation'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Icon } from '../components/ui/Icon'
import trophyArt from '../../mobile/assets/images/leagues/trophy.png'
import shieldArt from '../../mobile/assets/images/leagues/shield.png'
import './LeaguesPage.css'

type Source = 'sat-reading-writing' | 'sat-math' | 'mext'
type Tier = 'bronze' | 'silver' | 'gold'
type Entry = { alias:string; points:number; correct:number; livesLost:number; days:number; rank:number|null; you:boolean }
type League = { source:Source; joined:boolean; weekStart:string; weekEnd:string; daysRemaining:number;
  rules:{perCorrect:number;dailyLimit:string;silverAt:number;goldAt:number}; tier?:Tier;
  participants?:number; promotionAt?:number|null; previousRewardXp?:number; you?:Entry; leaders?:Entry[] }
const sources: {id:Source;label:string;short:string;practice:string}[] = [
  {id:'sat-reading-writing',label:'SAT · Leitura e escrita',short:'Leitura e escrita',practice:'/exames/sat/desafio-diario'},
  {id:'sat-math',label:'SAT · Matemática',short:'Matemática',practice:'/exames/sat/desafio-diario'},
  {id:'mext',label:'MEXT',short:'MEXT',practice:'/exames/mext/desafio-diario'},
]
const tierNames:Record<Tier,string> = {bronze:'Bronze',silver:'Prata',gold:'Ouro'}
const formatDate = (date:string) => date.split('-').reverse().join('/')

async function request<T>(path:string, method='GET'):Promise<T> {
  let response:Response
  try { response = await fetch(path,{method,credentials:'same-origin'}) }
  catch { throw new Error('Não foi possível acessar a API. Confira se o servidor está em execução.') }
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('A API não respondeu corretamente. Reinicie o servidor de desenvolvimento.')
  const data = await response.json().catch(()=>({}))
  if (!response.ok) throw new Error(data.error || 'Não foi possível carregar a liga.')
  return data as T
}

export function LeaguesPage() {
  useDocumentTitle('Ligas semanais | Daydreaming')
  const {search} = useLocation()
  const requested = new URLSearchParams(search).get('source')
  const initial = sources.find(item=>item.id===requested)?.id || 'sat-reading-writing'
  const [source,setSource] = useState<Source>(initial)
  const [league,setLeague] = useState<League|null>(null)
  const [loggedIn,setLoggedIn] = useState<boolean|null>(null)
  const [loading,setLoading] = useState(true)
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  const [confirmLeave,setConfirmLeave] = useState(false)
  const requestId = useRef(0)

  useEffect(()=>{ setSource(initial) },[initial])

  const load = useCallback(async () => {
    const id = ++requestId.current
    setLoading(true);setError('');setLeague(null)
    try {
      const account = await request<{user:unknown|null}>('/api/account/me')
      if (id!==requestId.current) return
      const authenticated = Boolean(account.user)
      setLoggedIn(authenticated)
      if (authenticated) {
        const result = await request<League>(`/api/account/leagues/${source}`)
        if (id===requestId.current) setLeague(result)
      }
    } catch (cause) { if (id===requestId.current) setError(cause instanceof Error?cause.message:'Não foi possível carregar a liga.') }
    finally { if (id===requestId.current) setLoading(false) }
  },[source])
  useEffect(()=>{ void load() },[load])

  async function changeMembership(method:'POST'|'DELETE') {
    if (busy) return
    setBusy(true);setError('')
    try {
      if (method==='POST') setLeague(await request<League>(`/api/account/leagues/${source}`,method))
      else { await request(`/api/account/leagues/${source}`,method); await load() }
      setConfirmLeave(false)
    } catch (cause) { setError(cause instanceof Error?cause.message:'Não foi possível atualizar sua liga.') }
    finally { setBusy(false) }
  }

  const selected = sources.find(item=>item.id===source)!
  const tier = league?.tier || 'bronze'
  const points = league?.you?.points || 0
  const target = league?.promotionAt || league?.rules.goldAt || 280
  const progress = Math.min(100,Math.round(points/target*100))
  return <main className="leagues-page container">
    <nav className="leagues-page__breadcrumb" aria-label="Você está em"><Link to="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Ligas semanais</span></nav>
    <header className="leagues-page__hero"><img className="leagues-page__hero-art" src={trophyArt} alt="" />
      <div><p className="leagues-page__eyebrow">Desafios diários</p><h1>Ligas semanais</h1>
        <p>Complete desafios, some acertos durante os sete dias e avance de liga.</p></div>
      <div className="leagues-page__week-pill"><Icon name="calendar" size={21} /><span>{league ? `${formatDate(league.weekStart)} – ${formatDate(league.weekEnd)}` : 'De segunda a domingo'}</span></div>
    </header>

    <div className="leagues-page__source" role="group" aria-label="Escolha a liga">
      {sources.map(item=><button type="button" key={item.id} className={source===item.id?'is-active':''} aria-pressed={source===item.id} disabled={busy}
        onClick={()=>{setSource(item.id);setConfirmLeave(false)}}>{item.label}</button>)}
    </div>

    {loading && <p role="status" className="leagues-page__message">Carregando a liga…</p>}
    {error && <div className="leagues-page__message" role="alert"><p>{error}</p><button type="button" onClick={()=>void load()}>Tentar novamente</button></div>}
    {!loading && !error && loggedIn===false && <section className="leagues-page__message"><h2>Entre para participar</h2>
      <p>Os pontos ficam associados à sua conta. No ranking, as outras pessoas veem somente um apelido.</p>
      <Link className="leagues-page__button" to="/conta">Entrar na conta</Link></section>}
    {!loading && league && <div className="leagues-page__dashboard">
      <section className={`leagues-page__feature leagues-page__feature--${tier}`} aria-labelledby="league-current-title">
        <div className="leagues-page__feature-art"><img src={trophyArt} alt="" /><strong>Liga {tierNames[tier]}</strong>
          <p>{league.joined?'Continue praticando para manter ou melhorar sua posição.':'Escolha sua liga e comece a somar pontos.'}</p></div>
        <div className="leagues-page__feature-data"><p className="leagues-page__eyebrow">{selected.label}</p><h2 id="league-current-title">Sua liga nesta semana</h2>
          <div className="leagues-page__numbers"><div><span><Icon name="trophy" size={20} /> Sua posição</span><strong>{league.you?.rank?`#${league.you.rank}`:'—'}</strong><small>{league.you?.rank?`de ${league.participants} participantes com pontos`:'Acerte para aparecer no ranking'}</small></div>
            <div><span><Icon name="star" size={20} /> Seus pontos</span><strong>{points} <small>pts</small></strong><small>{league.you?.correct||0} acertos nesta semana</small></div></div>
          <div className="leagues-page__track" role="progressbar" aria-label="Pontos até a próxima faixa" aria-valuenow={Math.min(points,target)} aria-valuemin={0} aria-valuemax={target}><span style={{width:`${progress}%`}} /></div>
          <p className="leagues-page__time"><Icon name="calendar" size={19} /> Termina em {league.daysRemaining} {league.daysRemaining===1?'dia':'dias'} · horário de Brasília</p>
          {league.joined?<a className="leagues-page__button" href="#ranking-da-liga">Ver ranking da liga <span aria-hidden="true">→</span></a>
            :<button className="leagues-page__button" type="button" disabled={busy} onClick={()=>void changeMembership('POST')}>{busy?'Entrando…':'Entrar nesta liga'}</button>}
        </div>
      </section>

      <section className="leagues-page__card leagues-page__ranking-card" id="ranking-da-liga" aria-labelledby="ranking-title"><div className="leagues-page__card-heading"><Icon name="trophy" size={24} /><h2 id="ranking-title">Ranking da Liga {tierNames[tier]}</h2></div>
        {!league.joined?<p>Entre nesta liga para acompanhar os participantes e a sua posição.</p>:!league.leaders?.length?<p>Ninguém pontuou ainda. Faça um desafio diário para aparecer aqui.</p>:
          <ol className="leagues-page__ranking">{league.leaders.map(entry=><li key={entry.alias} className={entry.you?'is-you':''}>
            <span className="leagues-page__rank">{entry.rank}</span><div><strong>{entry.you?'Você · ':''}{entry.alias}</strong><small>{entry.days} {entry.days===1?'dia':'dias'} · {entry.correct} acertos · {entry.livesLost} {entry.livesLost===1?'vida perdida':'vidas perdidas'}</small></div><b>{entry.points} pts</b>
          </li>)}</ol>}
        {league.joined && league.you?.rank && league.you.rank>10 && <p className="leagues-page__own">Sua posição: #{league.you.rank} · {league.you.points} pontos.</p>}
      </section>

      <section className="leagues-page__card leagues-page__rewards" aria-labelledby="rewards-title"><div className="leagues-page__card-heading"><Icon name="star" size={24} /><h2 id="rewards-title">Recompensas da liga</h2></div>
        <p>Seu desempenho nesta semana define a liga da próxima e o bônus de XP.</p>
        <div className="leagues-page__reward-grid"><div><Icon name="trophy" size={38} /><strong>Bronze</strong><small>Comece a praticar</small></div><div><Icon name="star" size={38} /><strong>Prata</strong><small>{league.rules.silverAt} pontos · 20 XP</small></div><div><img src={shieldArt} alt="" /><strong>Ouro</strong><small>{league.rules.goldAt} pontos · 40 XP</small></div></div>
        <small>O bônus é automático após o encerramento da semana. Prata e Ouro não se somam.</small>
      </section>

      <section className="leagues-page__card leagues-page__how" aria-labelledby="how-title"><div className="leagues-page__card-heading"><Icon name="check" size={24} /><h2 id="how-title">Como funciona?</h2></div>
        <ul><li>Os acertos dos sete dias são somados. Cada acerto vale {league.rules.perCorrect} pontos.</li><li>{league.rules.dailyLimit}.</li><li>Em empate, fica à frente quem perdeu menos vidas; depois, quem praticou em mais dias.</li></ul>
        <div className="leagues-page__actions"><Link className="leagues-page__button" to={selected.practice}>Praticar {selected.short}</Link>
          {league.joined && (!confirmLeave?<button className="leagues-page__leave" type="button" onClick={()=>setConfirmLeave(true)}>Sair desta liga</button>:<div className="leagues-page__confirm"><p>Ao sair, você deixa de aparecer no ranking. Pode entrar novamente depois.</p>
            <button type="button" disabled={busy} onClick={()=>void changeMembership('DELETE')}>Confirmar saída</button><button type="button" onClick={()=>setConfirmLeave(false)}>Cancelar</button></div>)}</div>
      </section>
    </div>}
  </main>
}
