import { Link } from '../../router/Link'
import { Icon } from '../ui/Icon'
import trophyArt from '../../../mobile/assets/images/leagues/trophy.png'
import './LeaguesSpotlight.css'

export function LeaguesSpotlight() {
  return <section className="leagues-spotlight" aria-labelledby="leagues-spotlight-title">
    <div className="container leagues-spotlight__inner">
      <div className="leagues-spotlight__copy">
        <p className="leagues-spotlight__eyebrow"><Icon name="star" size={17} /> Sua semana de prática</p>
        <h2 id="leagues-spotlight-title">Cada acerto leva você mais longe.</h2>
        <p>Pratique nos desafios diários e acompanhe seus pontos nas ligas semanais de SAT e MEXT. Leitura e escrita, matemática e MEXT têm rankings separados.</p>
        <div className="leagues-spotlight__footer">
          <Link className="leagues-spotlight__link" to="/ligas">Ver minhas ligas <span aria-hidden="true">→</span></Link>
          <span className="leagues-spotlight__hint">Uma semana de cada vez, no seu ritmo.</span>
        </div>
      </div>
      <div className="leagues-spotlight__art" aria-hidden="true">
        <div className="leagues-spotlight__halo" />
        <img src={trophyArt} alt="" loading="lazy" />
        <span className="leagues-spotlight__spark leagues-spotlight__spark--one"><Icon name="star" size={22} /></span>
        <span className="leagues-spotlight__spark leagues-spotlight__spark--two"><Icon name="star" size={15} /></span>
        <span className="leagues-spotlight__art-label">SAT <span>·</span> MEXT</span>
      </div>
    </div>
  </section>
}
