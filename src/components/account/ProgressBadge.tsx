import { Icon, type IconName } from '../ui/Icon'

const palettes: Record<string, [string, string, string]> = {
  'Perfil e plano':['#2795c8','#d9f2ff','#11527c'],
  'Prática geral':['#e18b39','#fff0cf','#88461e'],
  'Guias de países':['#42a894','#d6f5e9','#176a63'],
  'Buscador de bolsas':['#d8943d','#fff1ca','#79501b'],
  'Rankings':['#6c83d6','#e7ebff','#344595'],
  'Descobridor de destinos':['#41a6ca','#dff5fc','#185775'],
  'Teste vocacional':['#a17cc8','#f1e6fa','#604285'],
  'Calculadora de GPA':['#5b9bba','#e0f2f9','#225773'],
  SAT:['#de7765','#ffe8df','#8d3e38'],
  MEXT:['#b383c5','#f3e4f5','#71447d'],
  'Minha jornada':['#55a884','#e2f5df','#286748'],
  Sequências:['#dc8844','#fff0d1','#8d4c1e'],
  daily:['#e18b39','#fff0cf','#88461e'],
  weekly:['#5a9bbc','#e0f2f9','#225773'],
  monthly:['#a17cc8','#f1e6fa','#604285'],
  once:['#55a884','#e2f5df','#286748'],
}

type Props = { icon: IconName; category: string; completed: boolean; available?: boolean }

export function ProgressBadge({ icon, category, completed, available = true }: Props) {
  const [edge, light, ink] = palettes[category] ?? palettes['Perfil e plano']
  return <span className={`progress-badge${completed ? ' progress-badge--earned' : ''}${!available ? ' progress-badge--unavailable' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 72 78" width="64" height="69" fill="none" focusable="false">
      <path d="m18 48-4 25 11-5 7 8 4-23M54 48l4 25-11-5-7 8-4-23" fill={edge} stroke={ink} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="36" cy="32" r="29" fill={edge} stroke={ink} strokeWidth="1.5" />
      <circle cx="36" cy="32" r="26" stroke={light} strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="36" cy="32" r="22.5" fill={light} stroke={ink} strokeWidth="2" />
      <circle cx="36" cy="32" r="18.5" stroke={edge} strokeWidth="1" strokeDasharray="2 2.5" />
      <g transform="translate(23 19)" color={ink}><Icon name={icon} size={26} strokeWidth={2.1} /></g>
      <path d="m12 55 3 1.2 1.2 3L17.5 56l3-1.2-3-1.2-1.3-3-1.2 3ZM58 7l1.1 2.7L62 11l-2.9 1.1L58 15l-1.1-2.9L54 11l2.9-1.3Z" fill={completed ? '#ffce59' : edge} />
    </svg>
  </span>
}
