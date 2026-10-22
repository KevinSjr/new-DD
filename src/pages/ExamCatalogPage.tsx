import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { EXAMS, type Exam, type ExamCategory } from '../data/exams'
import './ExamCatalogPage.css'

const groups: { category: ExamCategory; id: string; eyebrow: string; title: string; introduction: string }[] = [
  {
    category: 'admission',
    id: 'admissao',
    eyebrow: 'Admissão e seleção',
    title: 'Provas ligadas à candidatura',
    introduction: 'Comece pelo requisito do curso ou da bolsa: nem toda candidatura exige o mesmo teste.',
  },
  {
    category: 'language',
    id: 'idiomas',
    eyebrow: 'Proficiência em idiomas',
    title: 'Comprove o idioma de estudo',
    introduction: 'O exame e o nível aceitos variam conforme a instituição, o programa e a finalidade da candidatura.',
  },
]

function ExamRow({ exam, index }: { exam: Exam; index: number }) {
  return (
    <li className="exam-catalog__row">
      <span className="exam-catalog__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div className="exam-catalog__entry">
        <div className="exam-catalog__entry-head">
          <div>
            <span className="exam-catalog__context">{exam.context}</span>
            <h3>{exam.name}</h3>
          </div>
          <span className="exam-catalog__status">{exam.id === 'sat' ? 'Prática inicial disponível' : 'Em preparação'}</span>
        </div>
        <p>{exam.description}</p>
        {exam.id === 'sat' && <Link className="exam-catalog__open" to="/exames/sat">Escolher modo de prática <span aria-hidden="true">→</span></Link>}
      </div>
    </li>
  )
}

export function ExamCatalogPage() {
  useDocumentTitle('Catálogo de exames | Daydreaming')

  return (
    <article className="exam-catalog">
      <div className="container exam-catalog__breadcrumb">
        <nav aria-label="Você está em">
          <Link to="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Exames</span>
        </nav>
      </div>

      <header className="exam-catalog__hero">
        <div className="container exam-catalog__hero-inner">
          <div>
            <p className="exam-catalog__eyebrow">Prepare o próximo passo</p>
            <h1>Encontre o exame certo para sua candidatura</h1>
            <p>Escolha uma prova e acompanhe a preparação dos exercícios dentro do Daydreaming. O SAT já tem um desafio inicial; os demais conteúdos estão em construção.</p>
            <a className="exam-catalog__jump" href="#admissao">Explorar exames <span aria-hidden="true">↓</span></a>
          </div>
          <aside className="exam-catalog__hero-note" aria-label="Como usar o catálogo">
            <span>Antes de estudar</span>
            <p>Veja no edital ou na página do curso <strong>qual exame, versão e nível</strong> são aceitos. Não existe uma prova obrigatória para todos os destinos.</p>
          </aside>
        </div>
      </header>

      <div className="container exam-catalog__body">
        <div className="exam-catalog__summary" aria-label="Conteúdo do catálogo">
          <p><strong>{EXAMS.length} opções</strong> para conhecer</p>
          <nav aria-label="Ir para categoria">
            <a href="#admissao">Admissão e seleção</a>
            <a href="#idiomas">Idiomas</a>
          </nav>
        </div>

        {groups.map(group => {
          const exams = EXAMS.filter(exam => exam.category === group.category)
          return (
            <section className="exam-catalog__section" id={group.id} key={group.id} aria-labelledby={`${group.id}-titulo`}>
              <div className="exam-catalog__section-intro">
                <p className="exam-catalog__eyebrow">{group.eyebrow} · {exams.length} opções</p>
                <h2 id={`${group.id}-titulo`}>{group.title}</h2>
                <p>{group.introduction}</p>
              </div>
              <ol className="exam-catalog__list">
                {exams.map((exam, index) => <ExamRow key={exam.id} exam={exam} index={index} />)}
              </ol>
            </section>
          )
        })}

        <p className="exam-catalog__disclaimer">Este catálogo é um ponto de partida, não uma lista de exigências. Consulte a instituição ou a entidade responsável antes de pagar uma inscrição ou escolher material de estudo.</p>
      </div>
    </article>
  )
}
