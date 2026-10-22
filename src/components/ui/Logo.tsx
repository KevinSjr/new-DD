import horizontalLogoSrc from '../../assets/daydreaming-horizontal.png'
import primaryLogoSrc from '../../assets/daydreaming-primary.png'

const LOGO_RATIOS = {
  horizontal: 228 / 998,
  primary: 444 / 887,
} as const

type LogoProps = {
  /** Largura em pixels. A altura é calculada para manter a proporção. */
  width?: number
  className?: string
  variant?: keyof typeof LOGO_RATIOS
}

/**
 * Logo Daydreaming. A versão horizontal serve aos espaços estreitos do cabeçalho.
 * O texto alternativo já identifica a marca; quando a logo estiver dentro de um
 * link para a página inicial, esse alt serve como nome acessível do link.
 */
export function Logo({ width = 160, className, variant = 'primary' }: LogoProps) {
  return (
    <img
      src={variant === 'horizontal' ? horizontalLogoSrc : primaryLogoSrc}
      alt="Daydreaming"
      width={width}
      height={Math.round(width * LOGO_RATIOS[variant])}
      className={className}
      decoding="async"
    />
  )
}
