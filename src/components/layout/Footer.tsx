import type { MouseEvent } from 'react'
import { Link } from '../../router/Link'
import { Logo } from '../ui/Logo'
import './Footer.css'

/*
 * Rodapé (micro tarefa 1.9 da v1, mantido na home v2; links atualizados na 1.6 v2).
 * Aviso resumido da versão atual. Uma política completa, com responsável e contato,
 * precisa ser publicada antes da abertura do cadastro ao público.
 * Os links "/#..." funcionam também a partir das páginas de país (voltam à home).
 */

const FOOTER_LINKS = [
  { label: 'Trilha', to: '/#trilha' },
  { label: 'Ferramentas', to: '/#ferramentas' },
  { label: 'Países', to: '/#paises' },
  { label: 'Rankings', to: '/rankings' },
  { label: 'Exames', to: '/exames' },
  { label: 'Como tratamos os dados', to: '/#confianca' },
  { label: 'Privacidade', to: '/#privacidade' },
] as const

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        {/* ---------- Marca ---------- */}
        <div className="site-footer__brand">
          <Logo width={200} />
          <p>
            Para estudantes brasileiros que querem descobrir, comparar e planejar oportunidades de
            estudo no exterior.
          </p>
          <p className="site-footer__status">Projeto em desenvolvimento.</p>
        </div>

        {/* ---------- Navegação ---------- */}
        <nav aria-label="Rodapé">
          <h2 className="site-footer__title">Navegue</h2>
          <ul className="site-footer__links">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---------- Privacidade ---------- */}
        <section id="privacidade" className="site-footer__privacy" aria-labelledby="privacidade-titulo">
          <h2 id="privacidade-titulo" className="site-footer__title">
            Privacidade e dados pessoais
          </h2>
          <p className="site-footer__tag">Aviso provisório</p>
          <p>
            Ao criar uma conta, guardamos nome, e-mail, senha protegida por hash e as preferências
            opcionais do perfil no banco de dados. Um cookie de sessão, inacessível ao JavaScript,
            mantém o acesso por até 30 dias. Você pode editar ou excluir sua conta na página
            <Link to="/conta"> Minha conta</Link>. Os desafios diários do SAT e MEXT continuam usando
            cookies anônimos separados; suas respostas não são vinculadas ao perfil.
          </p>
          <p>
            Este aviso é resumido. Antes de abrir o cadastro ao público, é necessário publicar uma
            política de privacidade completa com responsável, contato, finalidade, retenção e direitos
            dos titulares conforme a LGPD.
          </p>
        </section>
      </div>

      <div className="container site-footer__bottom">
        <p>© {year} Daydreaming</p>
        <a
          href="#top"
          onClick={(event: MouseEvent<HTMLAnchorElement>) => {
            // Funciona mesmo se não houver elemento com id="top"; respeita a rolagem suave/reduzida do CSS.
            event.preventDefault()
            window.scrollTo({ top: 0 })
          }}
        >
          Voltar ao topo
        </a>
      </div>
    </footer>
  )
}
