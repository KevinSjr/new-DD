import type { ReactNode } from 'react'
import { Link } from '../../router/Link'
import './Button.css'

type CommonProps = {
  /** primary = azul; secondary = branco com contorno; accent = amarelo; success = menta. */
  variant?: 'primary' | 'secondary' | 'accent' | 'success'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
}

/** Botão que navega: vira um link (<a>). */
type LinkProps = CommonProps & { href: string; onClick?: () => void }

/** Botão que executa uma ação: vira um <button>. */
type ActionProps = CommonProps & {
  href?: undefined
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
}

export function Button(props: LinkProps | ActionProps) {
  const { variant = 'primary', size = 'md', children, className } = props
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, className].filter(Boolean).join(' ')

  if (props.href !== undefined) {
    // Endereços que começam com "/" são páginas do site (sem recarregar); o resto (#seção, https://...) é link comum.
    if (props.href.startsWith('/')) {
      return (
        <Link className={classes} to={props.href} onClick={props.onClick}>
          {children}
        </Link>
      )
    }
    return (
      <a className={classes} href={props.href} onClick={props.onClick}>
        {children}
      </a>
    )
  }

  return (
    <button
      className={classes}
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {children}
    </button>
  )
}
