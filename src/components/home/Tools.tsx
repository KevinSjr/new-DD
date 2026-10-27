import { Link } from '../../router/Link'
import { Icon, type IconName } from '../ui/Icon'
import './Tools.css'

/*
 * As nove ferramentas planejadas (home v2, micro tarefa 1.4).
 * Cada cartão traz uma etiqueta de estado (contorno tracejado + texto).
 * Cartões com rota levam a ferramentas ou catálogos existentes; os demais
 * permanecem sinalizados como planejados.
 */
type Tone = 'sky' | 'sun' | 'mint' | 'coral' | 'lilac'

type Tool = {
  title: string
  description: string
  icon: IconName
  tone: Tone
  /** Se existir, o cartão vira link para a rota ou seção indicada. */
  href?: string
  tag: string
}

const SOON = 'Em breve'

const TOOLS: Tool[] = [
  { title: 'Calculadora de GPA', icon: 'calculator', tone: 'sky', href: '/calculadora-gpa', tag: 'Calculadora disponível', description: 'Estime seu GPA a partir da média ou das disciplinas e compare três métodos.' },
  { title: 'Catálogo de exames', icon: 'clipboard', tone: 'mint', href: '/exames', tag: 'Catálogo disponível', description: 'Conheça as provas de admissão e idioma e pratique o desafio inicial do SAT dentro da plataforma.' },
  { title: 'Teste vocacional', icon: 'compass', tone: 'lilac', href: '/teste-vocacional', tag: 'Questionário disponível', description: 'Explore seus interesses em 60 atividades e encontre caminhos para investigar, sem rótulos definitivos.' },
  { title: 'Rankings', icon: 'trophy', tone: 'sun', href: '/rankings', tag: 'Seis listas disponíveis', description: 'Compare universidades no ranking geral ou explore as cinco áreas de estudo do QS by Subject 2026.' },
  { title: 'Simulador de entrevista', icon: 'mic', tone: 'coral', tag: SOON, description: 'Ensaie as perguntas mais comuns de bolsas e universidades antes do dia.' },
  { title: 'Guia de países', icon: 'map', tone: 'sky', href: '/#paises', tag: 'Doze guias publicados', description: 'Custo de vida, clima, trabalho e tudo o que muda quando você chega.' },
  { title: 'Buscador de bolsas', icon: 'search', tone: 'mint', href: '/bolsas', tag: 'Busca disponível', description: 'Explore bolsas de diferentes fontes em um só lugar e confira os critérios no edital original.' },
  { title: 'Descobridor de destinos', icon: 'globe', tone: 'lilac', href: '/descobridor-de-destinos', tag: 'Exploração disponível', description: 'Compare 25 destinos pelas suas preferências de região, idioma e clima.' },
  { title: 'Match de bolsas e universidades', icon: 'sparkles', tone: 'sun', tag: SOON, description: 'Cruze seu perfil com bolsas e universidades e veja as melhores combinações.' },
]

function ToolBody({ tool }: { tool: Tool }) {
  return (
    <>
      <span className={`tool__tile tool__tile--${tool.tone}`}>
        <Icon name={tool.icon} size={30} strokeWidth={2.6} />
      </span>
      <h3 className="tool__title">{tool.title}</h3>
      <p className="tool__text">{tool.description}</p>
      <span className="tool__tag">{tool.tag}</span>
    </>
  )
}

export function Tools() {
  return (
    <section className="tools" id="ferramentas" aria-labelledby="ferramentas-titulo">
      <div className="container">
        <div className="tools__head">
          <h2 id="ferramentas-titulo">Nove ferramentas, uma só jornada</h2>
          <p>
            Comece pelos seus interesses e avance para a pesquisa de áreas e destinos. Hoje, você já
            pode usar o questionário exploratório, o descobridor de destinos, a calculadora de GPA,
            consultar os rankings, buscar bolsas, conhecer os exames e explorar os guias de países.
          </p>
        </div>
        <ul className="tools__grid">
          {TOOLS.map((tool) => (
            <li key={tool.title} className="tools__item">
              {tool.href ? (
                <Link className="tool tool--link" to={tool.href}>
                  <ToolBody tool={tool} />
                </Link>
              ) : (
                <div className="tool">
                  <ToolBody tool={tool} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
