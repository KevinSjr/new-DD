import { SymbolView, type SymbolViewProps } from 'expo-symbols'

type Name = SymbolViewProps['name']
const names = {
  home:{ ios:'house.fill',android:'home',web:'home' },
  globe:{ ios:'globe.americas.fill',android:'public',web:'public' },
  search:{ ios:'magnifyingglass',android:'search',web:'search' },
  journey:{ ios:'flag.fill',android:'flag',web:'flag' },
  person:{ ios:'person.fill',android:'person',web:'person' },
  chevron:{ ios:'chevron.right',android:'chevron_right',web:'chevron_right' },
  star:{ ios:'star.fill',android:'star',web:'star' },
  bookmark:{ ios:'bookmark.fill',android:'bookmark',web:'bookmark' },
  calendar:{ ios:'calendar',android:'calendar_month',web:'calendar_month' },
  document:{ ios:'doc.text.fill',android:'description',web:'description' },
  shield:{ ios:'checkmark.shield.fill',android:'verified_user',web:'verified_user' },
  school:{ ios:'graduationcap.fill',android:'school',web:'school' },
  plane:{ ios:'airplane',android:'flight',web:'flight' },
  compass:{ ios:'safari.fill',android:'explore',web:'explore' },
  back:{ ios:'chevron.left',android:'chevron_left',web:'chevron_left' },
  trophy:{ ios:'trophy.fill',android:'emoji_events',web:'emoji_events' },
  check:{ ios:'checkmark.circle.fill',android:'check_circle',web:'check_circle' },
  settings:{ ios:'gearshape.fill',android:'settings',web:'settings' },
} satisfies Record<string,Name>

export function AppIcon({ name, size = 22, color }: { name:keyof typeof names; size?:number; color:string }) {
  return <SymbolView name={names[name]} size={size} tintColor={color} fallback={null} />
}
