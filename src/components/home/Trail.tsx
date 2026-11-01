import { Link } from '../../router/Link'
import { JOURNEY_STAGES } from '../../data/journey'
import './Trail.css'

export function Trail() {
  return <section className="trail" id="trilha" aria-labelledby="trilha-titulo">
    <div className="container trail__layout">
      <div className="trail__copy"><p className="trail__eyebrow">Planeje no seu ritmo</p><h2 id="trilha-titulo">Sua jornada para estudar fora</h2><p>Da escolha do destino ao acompanhamento da candidatura, organize tarefas reais em uma trilha que você pode retomar quando quiser.</p><Link className="trail__cta" to="/conta?tab=jornada">Começar ou continuar minha jornada <span aria-hidden="true">→</span></Link><small>Você pode explorar países e bolsas sem criar uma conta. Entre apenas para salvar seu plano.</small></div>
      <ol className="trail__preview" aria-label="Etapas da jornada">{JOURNEY_STAGES.map((stage, index) => <li key={stage.title}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{stage.title}</strong><p>{stage.description}</p></div></li>)}</ol>
    </div>
  </section>
}
