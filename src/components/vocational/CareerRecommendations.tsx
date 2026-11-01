import { CAREERS_BY_AREA, type CareerPath } from '../../data/vocationalCareers'
import { INTEREST_AREAS, type InterestArea } from '../../data/vocationalQuestions'

type AreaScore = { area: InterestArea; mean: number }

function CareerGroup({ score }: { score: AreaScore }) {
  const area = INTEREST_AREAS[score.area]

  return (
    <section className="vocational__career-group" aria-label={`Possibilidades da área ${area.label}`}>
      <div className="vocational__career-heading"><h3>{area.label}</h3></div>
      <ul className="vocational__career-list">
        {CAREERS_BY_AREA[score.area].slice(0, 3).map((career: CareerPath) => (
          <li key={career.title}>
            <strong>{career.title}</strong>
            <span>Formações para pesquisar: {career.courses}</span>
          </li>
        ))}
      </ul>
      <details className="vocational__career-more"><summary>Ver mais opções desta área</summary><ul className="vocational__career-list">{CAREERS_BY_AREA[score.area].slice(3).map((career: CareerPath) => <li key={career.title}><strong>{career.title}</strong><span>Formações para pesquisar: {career.courses}</span></li>)}</ul></details>
    </section>
  )
}

export function CareerRecommendations({ scores }: { scores: AreaScore[] }) {
  return (
    <section className="vocational__careers" aria-labelledby="vocational-careers-title">
      <div className="vocational__career-intro">
        <p className="vocational__eyebrow">Para continuar a descoberta</p>
        <h2 id="vocational-careers-title">Caminhos para explorar</h2>
        <p>Alguns exemplos ligados aos seus dois maiores interesses. A ordem das profissões não é um ranking pessoal.</p>
      </div>

      <div className="vocational__career-groups">
        {scores.map((score) => <CareerGroup key={score.area} score={score} />)}
      </div>
      <p className="vocational__career-note">São exemplos para pesquisa, não indicação de profissão ou formação obrigatória. Confira a grade curricular e os requisitos do país onde pretende estudar.</p>
    </section>
  )
}
