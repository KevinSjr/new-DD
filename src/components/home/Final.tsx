import { COUNTRY_GUIDES } from '../../data/countries'
import { Button } from '../ui/Button'
import './Final.css'

/*
 * Chamada final (home v2, micro tarefa 1.6).
 * Ainda não existe conta nem cadastro, então não há "Criar conta" funcionando: o botão
 * principal leva ao único guia publicado e o outro é um botão desativado, com "(em breve)".
 */
export function Final() {
  const guide = COUNTRY_GUIDES.find((g) => g.slug === 'alemanha' && g.status === 'available')
  const guideHref = guide?.href ?? '/#paises'

  return (
    <section className="final" aria-labelledby="final-titulo">
      <div className="final__box">
        <h2 id="final-titulo">Pronto para decolar?</h2>
        <p>Comece pelo que já está no ar: o guia da Alemanha. O resto da trilha chega aos poucos.</p>
        <div className="final__actions">
          <Button href={guideHref} variant="secondary" size="lg">
            Ver o guia da Alemanha
          </Button>
          <button type="button" className="final__soon" aria-disabled="true">
            Criar conta <span className="final__soon-tag">(em breve)</span>
          </button>
        </div>
      </div>
    </section>
  )
}
