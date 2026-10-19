import logoSrc from '../../assets/logo.png'

// Proporção da imagem original (677 × 473), usada para evitar "pulo" de layout no carregamento.
const LOGO_RATIO = 473 / 677

type LogoProps = {
  /** Largura em pixels. A altura é calculada para manter a proporção. */
  width?: number
  className?: string
}

/**
 * Logo da nuvem "Day Dreaming". É o único elemento de marca do projeto.
 * O texto alternativo já identifica a marca; quando a logo estiver dentro de um
 * link para a página inicial, esse alt serve como nome acessível do link.
 */
export function Logo({ width = 160, className }: LogoProps) {
  return (
    <img
      src={logoSrc}
      alt="Day Dreaming"
      width={width}
      height={Math.round(width * LOGO_RATIO)}
      className={className}
      decoding="async"
    />
  )
}
