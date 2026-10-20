import { useEffect, useRef, useState } from 'react'
import { Logo } from '../ui/Logo'
import { Button } from '../ui/Button'
import { Link } from '../../router/Link'
import './Header.css'

/*
 * Links do menu. Cada destino é uma seção da página inicial; o prefixo "/" faz
 * o link funcionar também a partir de outras páginas (como os guias de países).
 */
const NAV_ITEMS = [
  { label: 'Trilha', to: '/#trilha' },
  { label: 'Ferramentas', to: '/#ferramentas' },
  { label: 'Países', to: '/#paises' },
  { label: 'Rankings', to: '/rankings' },
  { label: 'Bolsas', to: '/bolsas' },
] as const

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Esc fecha o menu no celular e devolve o foco ao botão que o abriu
  useEffect(() => {
    if (!menuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link className="site-header__brand" to="/" aria-label="Day Dreaming, ir para o início">
          <Logo width={88} />
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="site-header__toggle"
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg className="site-header__toggle-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
          <span>{menuOpen ? 'Fechar' : 'Menu'}</span>
        </button>

        <nav id="menu-principal" className="site-nav" aria-label="Principal" data-open={menuOpen}>
          <ul className="site-nav__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link className="site-nav__link" to={item.to} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="site-nav__actions">
            {/*
              Contas ainda não existem. O botão aparece (como na referência), mas é marcado como
              "em breve" com contorno tracejado e não faz nada. aria-disabled mantém o botão
              alcançável pelo teclado e lido pelo leitor de tela.
            */}
            <button type="button" className="site-nav__soon" aria-disabled="true">
              Entrar <span className="site-nav__soon-tag">(em breve)</span>
            </button>
            <Button href="/#trilha" size="sm" onClick={() => setMenuOpen(false)}>
              Começar
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
