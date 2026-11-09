import { Icon, type IconName } from '../ui/Icon'
import { Link } from '../../router/Link'
import './Perks.css'

/*
 * Acesso rápido às funcionalidades logo abaixo do topo.
 * Funcionalidades disponíveis recebem link; ideias futuras têm a etiqueta "Em breve".
 */
type Perk = {
  icon: IconName
  tone: 'sky' | 'sun' | 'mint' | 'lilac'
  title: string
  text: string
  /** Etiqueta de estado: o que realmente existe hoje. */
  tag: string
  href?: string
}

const PERKS: Perk[] = [
  { icon: 'route', tone: 'sky', title: 'Trilha por etapas', text: 'Da descoberta à candidatura, uma etapa de cada vez.', tag: 'Demonstração' },
  { icon: 'sun', tone: 'sun', title: 'Vidas', text: 'Errou? Perde um sol. Revise e volte mais forte.', tag: 'Em breve' },
  { icon: 'target', tone: 'mint', title: 'Metas diárias', text: 'Pequenas metas mantêm o ritmo sem pesar.', tag: 'Em breve' },
  { icon: 'trophy', tone: 'lilac', title: 'Ligas semanais', text: 'Some acertos nos desafios de SAT e MEXT ao longo da semana.', tag: 'Disponível', href: '/ligas' },
]

export function Perks() {
  return (
    <section className="perks" aria-labelledby="perks-titulo">
      <div className="container">
        <h2 id="perks-titulo" className="sr-only">
          Como a plataforma vai funcionar
        </h2>
        <ul className="perks__grid">
          {PERKS.map((perk) => (
            <li className="perk" key={perk.title}>
              {perk.href ? <Link className={`perk__tile perk__tile--${perk.tone}`} to={perk.href} aria-label="Abrir ligas semanais">
                <Icon name={perk.icon} size={24} strokeWidth={2.8} />
              </Link> : <span className={`perk__tile perk__tile--${perk.tone}`}>
                <Icon name={perk.icon} size={24} strokeWidth={2.8} />
              </span>}
              <div>
                <h3 className="perk__title">{perk.href ? <Link to={perk.href}>{perk.title}</Link> : perk.title}</h3>
                <p className="perk__text">{perk.text}</p>
                <span className="perk__tag">{perk.tag}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
