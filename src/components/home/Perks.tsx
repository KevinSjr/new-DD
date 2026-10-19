import { Icon, type IconName } from '../ui/Icon'
import './Perks.css'

/*
 * Quatro cartões de funcionalidades logo abaixo do topo (home v2, micro tarefa 1.2).
 * Só a trilha existe, como demonstração (1.3). Vidas, metas e ligas ainda não existem e
 * trazem "Em breve". A etiqueta tem contorno tracejado + texto, nunca só cor.
 */
type Perk = {
  icon: IconName
  tone: 'sky' | 'sun' | 'mint' | 'lilac'
  title: string
  text: string
  /** Etiqueta de estado: o que realmente existe hoje. */
  tag: string
}

const PERKS: Perk[] = [
  { icon: 'route', tone: 'sky', title: 'Trilha por etapas', text: 'Da descoberta à candidatura, uma etapa de cada vez.', tag: 'Demonstração' },
  { icon: 'sun', tone: 'sun', title: 'Vidas', text: 'Errou? Perde um sol. Revise e volte mais forte.', tag: 'Em breve' },
  { icon: 'target', tone: 'mint', title: 'Metas diárias', text: 'Pequenas metas mantêm o ritmo sem pesar.', tag: 'Em breve' },
  { icon: 'trophy', tone: 'lilac', title: 'Ligas', text: 'Dispute a semana com outros estudantes e suba de liga.', tag: 'Em breve' },
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
              <span className={`perk__tile perk__tile--${perk.tone}`}>
                <Icon name={perk.icon} size={24} strokeWidth={2.8} />
              </span>
              <div>
                <h3 className="perk__title">{perk.title}</h3>
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
