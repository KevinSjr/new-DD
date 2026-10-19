import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import './Hero.css'

/*
 * Topo da home (home v2, micro tarefa 1.2).
 * A ilustração e os três selos flutuantes são DECORATIVOS e de exemplo: o site ainda não
 * tem metas, sequências, ligas nem conta de usuário. A legenda visível diz isso, e o
 * "Já tenho conta" é um botão desativado com o texto "(em breve)" (não finge função).
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <div className="container hero__grid">
        <div className="hero__text">
          <h1 id="hero-titulo">Sonhe acordado. Estude lá fora.</h1>
          <p className="hero__lead">
            Descubra, compare e planeje oportunidades de estudo no exterior em um só lugar. Hoje o
            site já tem o guia da Alemanha e seis rankings para explorar; as outras ferramentas chegam por etapas.
          </p>
          <div className="hero__actions">
            <Button href="/#trilha" size="lg">
              Começar minha trilha
            </Button>
            <button type="button" className="hero__soon" aria-disabled="true">
              Já tenho conta <span className="hero__soon-tag">(em breve)</span>
            </button>
          </div>
        </div>

        <figure className="hero__art">
          <div className="hero__stage" aria-hidden="true">
            <svg viewBox="0 0 480 560" className="hero__svg" focusable="false">
              <defs>
                <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#8fc0ff" />
                  <stop offset=".55" stopColor="#d9ebff" />
                  <stop offset="1" stopColor="#ffe3cf" />
                </linearGradient>
                <radialGradient id="hero-sun" cx=".4" cy=".35" r=".7">
                  <stop offset="0" stopColor="#ffe27a" />
                  <stop offset="1" stopColor="#ffb52e" />
                </radialGradient>
                <clipPath id="hero-arch">
                  <path d="M0 560V240a240 240 0 0 1 480 0v320z" />
                </clipPath>
              </defs>
              <g clipPath="url(#hero-arch)">
                <rect width="480" height="560" fill="url(#hero-sky)" />
                <circle cx="170" cy="200" r="96" fill="#ffd25a" opacity=".22" />
                <circle cx="170" cy="200" r="70" fill="#ffd25a" opacity=".3" />
                <circle cx="170" cy="200" r="48" fill="url(#hero-sun)" />
                <g className="hero__cloud hero__cloud--a" fill="#fff" opacity=".95">
                  <rect x="40" y="120" width="120" height="34" rx="17" />
                  <circle cx="78" cy="122" r="22" />
                  <circle cx="116" cy="116" r="28" />
                </g>
                <g className="hero__cloud hero__cloud--b" fill="#fff" opacity=".85">
                  <rect x="300" y="290" width="150" height="38" rx="19" />
                  <circle cx="340" cy="292" r="24" />
                  <circle cx="388" cy="284" r="32" />
                </g>
                <path
                  className="hero__route"
                  d="M70 492C130 400 270 440 258 330S370 190 392 140"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="1 16"
                />
                <g transform="translate(392 140) rotate(-50)">
                  <path d="M-22 0 22 -14 8 0 22 14Z" fill="#2a6fe8" />
                  <path d="M-22 0 8 0 -2 12Z" fill="#1b4fb8" />
                </g>
                <circle cx="70" cy="492" r="12" fill="#fff" stroke="#2a6fe8" strokeWidth="6" />
                <g fill="#fff">
                  <circle cx="40" cy="548" r="52" />
                  <circle cx="120" cy="550" r="64" />
                  <circle cx="214" cy="556" r="56" />
                  <circle cx="300" cy="552" r="68" />
                  <circle cx="400" cy="556" r="58" />
                  <circle cx="470" cy="548" r="50" />
                </g>
              </g>
            </svg>

            <div className="hero__chip hero__chip--goal">
              <span className="hero__chip-ico hero__chip-ico--mint">
                <Icon name="target" size={18} strokeWidth={3} />
              </span>
              <div>
                <b>Meta do dia</b>
                <i className="hero__bar">
                  <u />
                </i>
              </div>
            </div>
            <div className="hero__chip hero__chip--streak">
              <span className="hero__chip-ico hero__chip-ico--sun">
                <Icon name="zap" size={18} strokeWidth={3} />
              </span>
              <b>Dias seguidos</b>
            </div>
            <div className="hero__chip hero__chip--league">
              <span className="hero__chip-ico hero__chip-ico--lilac">
                <Icon name="trophy" size={18} strokeWidth={3} />
              </span>
              <div>
                <b>Liga semanal</b>
                <small>Exemplo</small>
              </div>
            </div>
          </div>
          <figcaption className="hero__caption">
            Ilustração de exemplo. Metas, sequências e ligas ainda não existem no site.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
