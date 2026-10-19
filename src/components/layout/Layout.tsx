import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { useScrollOnNavigate } from '../../router/navigation'

/** Estrutura comum a todas as páginas: link de pular, cabeçalho, conteúdo e rodapé. */
export function Layout({ children }: { children: ReactNode }) {
  useScrollOnNavigate()

  return (
    <div id="top">
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
