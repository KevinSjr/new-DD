import { useTrailProgress } from '../../hooks/useTrailProgress'
import { Icon } from '../ui/Icon'
import './Trail.css'

/*
 * Trilha compacta (home v2, micro tarefa 1.3).
 * DEMONSTRAÇÃO: os cinco passos seguem a jornada planejada (descobrir, entender requisitos,
 * comparar, preparar a candidatura, acompanhar etapas). Nada aqui é uma ferramenta pronta,
 * não há conta, progresso salvo, pontos nem ranking. Os passos são "completados" só pela
 * rolagem da página, e a legenda visível diz isso.
 */
type Tone = 'sky' | 'lilac' | 'mint'

type Stage = {
  tone: Tone
  title: string
  subtitle: string
  steps: string[]
}

const STAGES: Stage[] = [
  {
    tone: 'sky',
    title: 'Descubra seu rumo',
    subtitle: 'O que estudar e para onde ir',
    steps: ['Descobrir', 'Entender requisitos'],
  },
  {
    tone: 'lilac',
    title: 'Compare e escolha',
    subtitle: 'Países, universidades e bolsas',
    steps: ['Comparar opções'],
  },
  {
    tone: 'mint',
    title: 'Prepare-se',
    subtitle: 'Candidatura e acompanhamento',
    steps: ['Preparar candidatura', 'Acompanhar etapas'],
  },
]

const TOTAL = STAGES.reduce((sum, stage) => sum + stage.steps.length, 0)

/** Deslocamento horizontal de cada passo (em px), para a trilha serpentear. */
const OFFSETS = [0, 64, 0, -64, 0]

const STATE_TEXT = {
  done: 'concluída na demonstração',
  current: 'etapa atual da demonstração',
  locked: 'ainda não alcançada',
} as const

/** Linha pontilhada entre dois passos. A parte colorida cresce quando o passo de origem é concluído. */
function Link({ from, to, done }: { from: number; to: number; done: boolean }) {
  const a = 160 + from
  const b = 160 + to
  const d = `M${a} 0C${a} 55 ${b} 45 ${b} 100`
  return (
    <svg
      className={`trail__link${done ? ' is-done' : ''}`}
      viewBox="0 0 320 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="trail__link-base" d={d} pathLength={1} />
      <path className="trail__link-fill" d={d} pathLength={1} />
    </svg>
  )
}

export function Trail() {
  const { done, refs } = useTrailProgress(TOTAL)
  const finished = done >= TOTAL
  const current = Math.min(done + 1, TOTAL)
  let index = -1

  return (
    <section className="trail" id="trilha" aria-labelledby="trilha-titulo">
      <div className="container trail__grid">
        <div className="trail__intro">
          <h2 id="trilha-titulo">Uma trilha do sonho ao embarque</h2>
          <p className="trail__lead">
            Cinco passos, da descoberta ao acompanhamento da candidatura. Role a página e veja a
            trilha ser completada.
          </p>
          <p className="trail__demo">
            <strong>Demonstração.</strong> A trilha ainda não está disponível: os passos mostram a
            jornada planejada e são completados só pela rolagem, sem salvar nada.
          </p>
        </div>

        <div className="trail__phone">
          <div className="trail__hud">
            <span className="trail__hud-text">
              {finished ? 'Trilha completa' : `Etapa ${current} de ${TOTAL}`}
            </span>
            <span className="trail__hud-bar" aria-hidden="true">
              <u style={{ width: `${(done / TOTAL) * 100}%` }} />
            </span>
          </div>

          <div className="trail__stages">
            {STAGES.map((stage) => (
              <div className="trail__stage" key={stage.title}>
                <div className={`trail__banner trail__banner--${stage.tone}`}>
                  <h3>{stage.title}</h3>
                  <p>{stage.subtitle}</p>
                </div>
                <ol className="trail__steps">
                  {stage.steps.map((label, i) => {
                    index += 1
                    const n = index
                    const state = n < done ? 'done' : n === done ? 'current' : 'locked'
                    const hasNext = i < stage.steps.length - 1
                    return (
                      <li className="trail__step" key={label} style={{ ['--x' as string]: `${OFFSETS[n]}px` }}>
                        {hasNext && <Link from={OFFSETS[n]} to={OFFSETS[n + 1]} done={n < done} />}
                        <div
                          className="trail__node"
                          data-state={state}
                          ref={(el: HTMLDivElement | null) => {
                            refs.current[n] = el
                          }}
                        >
                          {state === 'current' && (
                            <span className="trail__bubble" aria-hidden="true">
                              Aqui
                            </span>
                          )}
                          <svg viewBox="0 0 84 72" className="trail__cloud" aria-hidden="true" focusable="false">
                            <g className="trail__cloud-shade" transform="translate(0 7)">
                              <rect x="4" y="30" width="76" height="30" rx="15" />
                              <circle cx="26" cy="34" r="16" />
                              <circle cx="45" cy="27" r="21" />
                              <circle cx="63" cy="36" r="14" />
                            </g>
                            <g className="trail__cloud-fill">
                              <rect x="4" y="30" width="76" height="30" rx="15" />
                              <circle cx="26" cy="34" r="16" />
                              <circle cx="45" cy="27" r="21" />
                              <circle cx="63" cy="36" r="14" />
                            </g>
                          </svg>
                          <span className="trail__node-ico">
                            <Icon
                              name={state === 'done' ? 'check' : state === 'current' ? 'plane' : 'lock'}
                              size={30}
                              strokeWidth={3}
                            />
                          </span>
                        </div>
                        <p className="trail__label">
                          {label}
                          <span className="sr-only"> — {STATE_TEXT[state]}</span>
                        </p>
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
          </div>

          <p className={`trail__end${finished ? ' is-on' : ''}`}>
            {finished
              ? 'Trilha completa na demonstração. Boa viagem!'
              : 'Continue rolando para completar a trilha.'}
          </p>
        </div>
      </div>
    </section>
  )
}
