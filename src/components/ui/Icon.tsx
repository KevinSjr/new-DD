/*
 * Ícones simples, desenhados à mão no mesmo estilo de traço (24 × 24, linha arredondada).
 * São decorativos: o significado sempre vem do texto ao lado, por isso ficam escondidos
 * de leitores de tela. Sem biblioteca externa.
 */
const PATHS = {
  route: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h5a4 4 0 0 0 0-8h-2a4 4 0 0 1 0-4h5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
    </>
  ),
  check: <path d="M5 12.5 10 17.5 19.5 7" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  plane: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  calculator: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2.5" />
      <path d="M8 6.5h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18.5h.01M12 18.5h.01M16 18.5h.01" />
    </>
  ),
  clipboard: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 14l2 2 4-4" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3Z" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" />
    </>
  ),
  map: <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3ZM9 3v15M15 6v15" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
    </>
  ),
  leaf: <path d="M20 4c-8 0-14 2-15 9a7 7 0 0 0 7 7c7-1 9-7 8-16ZM5 20c3-6 7-9 12-11" />,
  sparkles: (
    <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8ZM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z" />
  ),
  zap: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  book: <><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1ZM12 6v14" /></>,
  bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 15l2 2 5-5" /></>,
  chart: <><path d="M3 21h18M6 17v-5M12 17V7M18 17V3" /></>,
  document: <><path d="M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM14 2v6h5M8 13h8M8 17h6" /></>,
  flame: <path d="M12 22c-4 0-7-3-7-7 0-3 2-5 4-7 0 3 2 3 2 3 0-4 2-7 4-9 0 5 4 7 4 13 0 4-3 7-7 7Zm0-2c2 0 3-1 3-3 0-1-1-3-3-4 0 2-3 3-3 4 0 2 1 3 3 3Z" />,
  graduation: <><path d="m2 9 10-5 10 5-10 5L2 9ZM6 11v6c4 3 8 3 12 0v-6M22 9v7" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5" /></>,
  medal: <><circle cx="12" cy="15" r="5" /><path d="m9 11-3-8h4l2 5 2-5h4l-3 8M12 12l.8 1.6 1.7.3-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.3Z" /></>,
  pen: <><path d="m4 20 4.5-1 11-11a2 2 0 0 0-3-3l-11 11L4 20ZM14 7l3 3M4 22h16" /></>,
  sliders: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" fill="white" /><circle cx="16" cy="12" r="2" fill="white" /><circle cx="10" cy="18" r="2" fill="white" /></>,
  star: <path d="m12 2 3.1 6.3 7 1-5.1 5 .9 7-5.9-3.3-5.9 3.3.9-7-5.1-5 7-1L12 2Z" />,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  translate: <><path d="M3 5h12M9 3v2M6 8c.5 4 3 7 7 9M13 8c-.5 4-3 7-7 9M14 21l4-10 4 10M15.5 17h5" /></>,
} as const

export type IconName = keyof typeof PATHS

type IconProps = {
  name: IconName
  /** Tamanho em pixels (largura e altura). */
  size?: number
  strokeWidth?: number
}

export function Icon({ name, size = 24, strokeWidth = 2.6 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
