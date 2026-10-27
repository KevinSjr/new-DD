import { useState } from 'react'
import { Link } from '../../router/Link'
import { COUNTRY_GUIDES } from '../../data/countries'
import '../ui/Button.css'
import './Passports.css'

/*
 * "Passaportes" de países (home v2, micro tarefa 1.5).
 * Só países com guia publicado (estado 'available' e href em data/countries.ts) viram links.
 * São 25 destinos; só 6 aparecem de início e o botão "Ver os outros" mostra o resto.
 * Idioma e clima só aparecem para países com guia publicado. Os demais mostram apenas
 * "Guia em preparação": nada de dado não verificado.
 * A sigla é a do aeroporto internacional de referência, só um detalhe visual do bilhete.
 */
type Tone = 'sun' | 'coral' | 'sky' | 'mint' | 'lilac'

type Passport = {
  slug: string
  name: string
  /** Sigla IATA do aeroporto de referência (detalhe visual). */
  code: string
  /** Só preencher quando o dado estiver no guia publicado do país. */
  facts?: { language: string; climate: string }
}

/** Ordem pedida pelo projeto. Cada slug é o mesmo usado em data/countries.ts. */
const PASSPORTS: Passport[] = [
  { slug: 'estados-unidos', name: 'Estados Unidos', code: 'JFK', facts: { language: 'Inglês predominante', climate: 'Varia conforme a região' } },
  { slug: 'reino-unido', name: 'Reino Unido', code: 'LHR' },
  { slug: 'canada', name: 'Canadá', code: 'YYZ', facts: { language: 'Inglês e francês', climate: 'Varia conforme a região' } },
  { slug: 'australia', name: 'Austrália', code: 'SYD', facts: { language: 'Inglês', climate: 'Varia conforme a região' } },
  {
    slug: 'alemanha',
    name: 'Alemanha',
    code: 'FRA',
    facts: { language: 'Alemão', climate: 'Temperado, com quatro estações' },
  },
  { slug: 'franca', name: 'França', code: 'CDG' },
  { slug: 'japao', name: 'Japão', code: 'NRT' },
  { slug: 'china', name: 'China', code: 'PEK', facts: { language: 'Mandarim', climate: 'Varia conforme a região' } },
  { slug: 'coreia-do-sul', name: 'Coreia do Sul', code: 'ICN', facts: { language: 'Coreano', climate: 'Quatro estações' } },
  { slug: 'espanha', name: 'Espanha', code: 'MAD', facts: { language: 'Espanhol e línguas cooficiais', climate: 'Varia conforme a região' } },
  { slug: 'paises-baixos', name: 'Países Baixos (Holanda)', code: 'AMS' },
  { slug: 'italia', name: 'Itália', code: 'FCO' },
  { slug: 'portugal', name: 'Portugal', code: 'LIS' },
  { slug: 'irlanda', name: 'Irlanda', code: 'DUB' },
  { slug: 'suica', name: 'Suíça', code: 'ZRH' },
  { slug: 'suecia', name: 'Suécia', code: 'ARN' },
  { slug: 'finlandia', name: 'Finlândia', code: 'HEL', facts: { language: 'Finlandês e sueco', climate: 'Invernos frios' } },
  { slug: 'dinamarca', name: 'Dinamarca', code: 'CPH', facts: { language: 'Dinamarquês', climate: 'Temperado e ventoso' } },
  { slug: 'belgica', name: 'Bélgica', code: 'BRU', facts: { language: 'Neerlandês, francês e alemão', climate: 'Temperado oceânico' } },
  { slug: 'noruega', name: 'Noruega', code: 'OSL' },
  { slug: 'taiwan', name: 'Taiwan', code: 'TPE' },
  { slug: 'hong-kong', name: 'Hong Kong', code: 'HKG' },
  { slug: 'singapura', name: 'Singapura', code: 'SIN' },
  { slug: 'malasia', name: 'Malásia', code: 'KUL' },
  { slug: 'nova-zelandia', name: 'Nova Zelândia', code: 'AKL' },
]

/** A cor do bilhete só decora: alterna pela posição na lista. */
const TONES: Tone[] = ['sky', 'sun', 'coral', 'mint', 'lilac']

/** Quantos bilhetes aparecem antes de "Ver todos". */
const VISIBLE_AT_FIRST = 6

function TicketBody({ passport, open }: { passport: Passport; open: boolean }) {
  return (
    <span className="ticket__body">
      <span className="ticket__stub">
        <small>GRU</small>
        <b>{passport.code}</b>
      </span>
      <span className="ticket__main">
        <strong>{passport.name}</strong>
        {passport.facts && (
          <>
            <span>
              <small>Idioma</small>
              {passport.facts.language}
            </span>
            <span>
              <small>Clima</small>
              {passport.facts.climate}
            </span>
          </>
        )}
        <span className={`ticket__tag${open ? ' ticket__tag--open' : ''}`}>
          {open ? 'Abrir guia' : 'Guia em preparação'}
        </span>
        <i className="ticket__barcode" aria-hidden="true" />
      </span>
    </span>
  )
}

export function Passports() {
  const [showAll, setShowAll] = useState(false)
  const shown = showAll ? PASSPORTS : PASSPORTS.slice(0, VISIBLE_AT_FIRST)
  const hidden = PASSPORTS.length - VISIBLE_AT_FIRST

  return (
    <section className="passports" id="paises" aria-labelledby="paises-titulo">
      <div className="container">
        <div className="passports__head">
          <h2 id="paises-titulo">Para onde vai o seu sonho?</h2>
          <p>
            {PASSPORTS.length} destinos no radar. Cada um terá um guia com o que você precisa saber
            antes de embarcar. Os guias da Alemanha, Austrália, Bélgica, Canadá, China, Coreia do Sul, Dinamarca, Espanha, Estados Unidos e Finlândia já estão publicados.
          </p>
        </div>
        <ul className="passports__grid" id="passaportes-lista">
          {shown.map((passport, index) => {
            const tone = TONES[index % TONES.length]
            const guide = COUNTRY_GUIDES.find((g) => g.slug === passport.slug)
            const href = guide && guide.status === 'available' ? guide.href : undefined
            return (
              <li key={passport.slug}>
                {href ? (
                  <Link className={`ticket ticket--${tone} ticket--link`} to={href}>
                    <TicketBody passport={passport} open />
                  </Link>
                ) : (
                  <div className={`ticket ticket--${tone}`}>
                    <TicketBody passport={passport} open={false} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
        <div className="passports__more">
          <button
            type="button"
            className="btn btn--secondary btn--md"
            aria-expanded={showAll}
            aria-controls="passaportes-lista"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? 'Mostrar menos' : `Ver os outros ${hidden} destinos`}
          </button>
        </div>
      </div>
    </section>
  )
}
