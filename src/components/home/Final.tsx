import { Button } from '../ui/Button'
import './Final.css'

/*
 * Chamada final (home v2, micro tarefa 1.6).
 * A pessoa pode explorar destinos sem conta ou criar um perfil opcional.
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
          <Button href="/conta" variant="secondary" size="lg">Criar conta</Button>
        </div>
      </div>
    </section>
  )
}
