import type { ComponentPropsWithoutRef, MouseEvent } from 'react'
import { navigate } from './navigation'

type LinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  /** Endereço de destino. Use "/#secao" para chegar a uma seção da página inicial. */
  to: string
}

/**
 * Link interno: navega sem recarregar a página. Mantém o comportamento normal do
 * navegador para Ctrl/Cmd+clique, botão do meio, "abrir em nova aba" e target="_blank".
 */
export function Link({ to, onClick, target, children, ...rest }: LinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (target && target !== '_self') return
    event.preventDefault()
    navigate(to)
  }

  return (
    <a href={to} target={target} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
