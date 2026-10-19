import { Button } from '../components/ui/Button'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './NotFoundPage.css'

export function NotFoundPage() {
  useDocumentTitle('Página não encontrada | Day Dreaming')

  return (
    <section className="not-found" aria-labelledby="nao-encontrada-titulo">
      <div className="container not-found__box">
        <p className="not-found__eyebrow">Erro 404</p>
        <h1 id="nao-encontrada-titulo" className="not-found__title">
          Não encontramos esta página
        </h1>
        <p className="not-found__text">
          O endereço pode ter sido digitado errado ou a página ainda não existe. Você pode voltar
          ao início e continuar de lá.
        </p>
        <Button href="/">Voltar ao início</Button>
      </div>
    </section>
  )
}
