import { CAREERS_BY_AREA, type CareerPath } from '../../data/vocationalCareers'
import { INTEREST_AREAS, type InterestArea } from '../../data/vocationalQuestions'

type AreaScore = { area: InterestArea; mean: number }

function CareerGroup({ score }: { score: AreaScore }) {
  const area = INTEREST_AREAS[score.area]

  return (
    <section className="vocational__career-group" aria-label={`Possibilidades da área ${area.label}`}>
      <div className="vocational__career-heading">
        <div>
          <p className="vocational__career-kicker">Área de interesse · média {score.mean.toFixed(1).replace('.', ',')} / 5</p>
          <h3>{area.label}</h3>
        </div>
        <p>{area.short}</p>
      </div>
      <ul className="vocational__career-list">
        {CAREERS_BY_AREA[score.area].map((career: CareerPath) => (
          <li key={career.title}>
            <strong>{career.title}</strong>
            <span>Formações para pesquisar: {career.courses}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function CareerRecommendations({ scores, broadProfile }: { scores: AreaScore[]; broadProfile: boolean }) {
  const featuredCount = broadProfile ? 3 : 2

  return (
    <section className="vocational__careers" aria-labelledby="vocational-careers-title">
      <div className="vocational__career-intro">
        <p className="vocational__eyebrow">Para continuar a descoberta</p>
        <h2 id="vocational-careers-title">Profissões e caminhos para investigar</h2>
        <p>Mostramos primeiro as opções associadas às {broadProfile ? 'três' : 'duas'} áreas com maiores médias nas suas respostas. Todas as opções de uma mesma área têm o mesmo destaque: o questionário não distingue uma profissão específica de outra.</p>
      </div>

      <div className="vocational__career-groups">
        {scores.slice(0, featuredCount).map((score) => <CareerGroup key={score.area} score={score} />)}
      </div>

      <details className="vocational__career-more">
        <summary>Ver opções das outras áreas</summary>
        <p>Interesses podem mudar com novas experiências. Estas opções continuam disponíveis mesmo que suas médias tenham sido menores.</p>
        <div className="vocational__career-groups">
          {scores.slice(featuredCount).map((score) => <CareerGroup key={score.area} score={score} />)}
        </div>
      </details>

      <p className="vocational__career-note">Estas associações são exemplos iniciais fornecidos pelo projeto, não recomendações validadas nem requisitos obrigatórios de formação. Antes de decidir, confira a grade curricular, a rotina profissional e as exigências do país onde pretende estudar ou atuar.</p>
    </section>
  )
}
