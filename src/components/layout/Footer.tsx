import type { MouseEvent } from 'react'
import { Link } from '../../router/Link'
import { Logo } from '../ui/Logo'
import './Footer.css'

/*
 * Rodapé (micro tarefa 1.9 da v1, mantido na home v2; links atualizados na 1.6 v2).
 * O aviso de privacidade descreve o estado ATUAL do site: sem conta, sem
 * formulários e sem coleta de dados pessoais. Se qualquer coleta for adicionada
 * (conta, progresso salvo, formulário, análise de uso), este texto precisa ser
 * atualizado ANTES da publicação, junto com uma política de privacidade completa.
 * Os links "/#..." funcionam também a partir das páginas de país (voltam à home).
 */

const FOOTER_LINKS = [
  { label: 'Trilha', to: '/#trilha' },
  { label: 'Ferramentas', to: '/#ferramentas' },
  { label: 'Países', to: '/#paises' },
  { label: 'Rankings', to: '/rankings' },
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
          <Logo width={140} />
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
            <strong>Hoje, o site não pede nem guarda dados pessoais.</strong> Não há conta,
            formulário nem cadastro de e-mail, e não usamos ferramentas de análise ou de
            publicidade. Como qualquer site, o servidor onde ele estiver hospedado pode registrar
            dados técnicos de acesso, como o endereço IP.
          </p>
          <p>
            Antes de qualquer coleta (conta, progresso salvo ou formulários), vamos publicar uma
            política de privacidade completa, explicar para que serve cada dado e pedir apenas o
            necessário, em conformidade com a Lei Geral de Proteção de Dados (LGPD, Lei nº
            13.709/2018).
          </p>
        </section>
      </div>

      <div className="container site-footer__bottom">
        <p>© {year} Day Dreaming</p>
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
