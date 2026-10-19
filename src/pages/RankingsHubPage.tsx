import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Link } from '../router/Link'
import { Icon } from '../components/ui/Icon'
import './RankingsHubPage.css'

export function RankingsHubPage() {
  useDocumentTitle('Escolha um ranking | Day Dreaming')

  return (
    <article className="rankings-hub">
      <div className="container ranking-page__breadcrumb">
        <nav aria-label="Você está em"><Link to="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Rankings</span></nav>
      </div>

      <header className="rankings-hub__hero">
        <div className="container">
          <p className="ranking-page__eyebrow">Explore com contexto</p>
          <h1>Qual ranking você quer consultar?</h1>
          <p>Compare universidades no mundo todo ou comece por uma área de estudo. Cada lista informa sua própria edição, fonte e limites dos dados.</p>
        </div>
      </header>

      <div className="container rankings-hub__body">
        <section aria-labelledby="rankings-geral-title">
          <div className="rankings-hub__section-heading">
            <p className="ranking-page__eyebrow">Visão geral</p>
            <h2 id="rankings-geral-title">Ranking por universidade</h2>
            <p>Para descobrir instituições antes de escolher uma área específica.</p>
          </div>
          <Link className="rankings-hub__choice rankings-hub__choice--general" to="/ranking">
            <span className="rankings-hub__icon"><Icon name="globe" size={30} /></span>
            <span className="rankings-hub__choice-content"><strong>Universidades no mundo</strong><span>QS World University Rankings 2027 · primeiras 1.000 instituições da planilha</span></span>
            <span className="rankings-hub__action">Explorar universidades <span aria-hidden="true">→</span></span>
          </Link>
        </section>

        <section aria-labelledby="rankings-areas-title">
          <div className="rankings-hub__section-heading">
            <p className="ranking-page__eyebrow">Por área de estudo</p>
            <h2 id="rankings-areas-title">Rankings de áreas</h2>
            <p>O ranking de uma área ampla não substitui o ranking de cada disciplina. As cinco áreas de estudo estão disponíveis abaixo.</p>
          </div>
          <div className="rankings-hub__available">
          <Link className="rankings-hub__choice rankings-hub__choice--subject" to="/rankings/artes-humanidades">
            <span className="rankings-hub__icon"><Icon name="sparkles" size={30} /></span>
            <span className="rankings-hub__choice-content"><strong>Artes e Humanidades</strong><span>QS by Subject 2026 · ranking da área e 13 disciplinas</span></span>
            <span className="rankings-hub__action">Ver ranking da área <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="rankings-hub__choice rankings-hub__choice--subject" to="/rankings/engenharia-tecnologia">
            <span className="rankings-hub__icon"><Icon name="calculator" size={30} /></span>
            <span className="rankings-hub__choice-content"><strong>Engenharia e Tecnologia</strong><span>QS by Subject 2026 · ranking da área e 8 disciplinas</span></span>
            <span className="rankings-hub__action">Ver ranking da área <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="rankings-hub__choice rankings-hub__choice--subject" to="/rankings/ciencias-da-vida-medicina">
            <span className="rankings-hub__icon"><Icon name="leaf" size={30} /></span>
            <span className="rankings-hub__choice-content"><strong>Ciências da Vida e Medicina</strong><span>QS by Subject 2026 · ranking da área e 9 disciplinas</span></span>
            <span className="rankings-hub__action">Ver ranking da área <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="rankings-hub__choice rankings-hub__choice--subject" to="/rankings/ciencias-naturais">
            <span className="rankings-hub__icon"><Icon name="globe" size={30} /></span>
            <span className="rankings-hub__choice-content"><strong>Ciências Naturais</strong><span>QS by Subject 2026 · ranking da área e 9 disciplinas</span></span>
            <span className="rankings-hub__action">Ver ranking da área <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="rankings-hub__choice rankings-hub__choice--subject" to="/rankings/ciencias-sociais-administracao">
            <span className="rankings-hub__icon"><Icon name="compass" size={30} /></span>
            <span className="rankings-hub__choice-content"><strong>Ciências Sociais e Administração</strong><span>QS by Subject 2026 · ranking da área e 16 disciplinas</span></span>
            <span className="rankings-hub__action">Ver ranking da área <span aria-hidden="true">→</span></span>
          </Link>
          </div>
        </section>
      </div>
    </article>
  )
}
