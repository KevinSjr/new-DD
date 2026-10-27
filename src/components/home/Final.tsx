import { Button } from '../ui/Button'
import './Final.css'

/*
 * Chamada final (home v2, micro tarefa 1.6).
 * Ainda não existe conta nem cadastro, então não há "Criar conta" funcionando: o botão
 * principal leva aos guias publicados e o outro é um botão desativado, com "(em breve)".
 */
export function Final() {
  return (
    <section className="final" aria-labelledby="final-titulo">
      <div className="final__box">
        <h2 id="final-titulo">Pronto para decolar?</h2>
        <p>Explore os guias de países e escolha o próximo destino da sua jornada.</p>
        <div className="final__actions">
          <Button href="/#paises" variant="secondary" size="lg">
            Explorar países
          </Button>
          <button type="button" className="final__soon" aria-disabled="true">
            Criar conta <span className="final__soon-tag">(em breve)</span>
          </button>
        </div>
      </div>
    </section>
  )
}
