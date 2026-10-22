import { Hero } from '../components/home/Hero'
import { Perks } from '../components/home/Perks'
import { Final } from '../components/home/Final'
import { Passports } from '../components/home/Passports'
import { Tools } from '../components/home/Tools'
import { Trail } from '../components/home/Trail'
import { Trust } from '../components/home/Trust'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/*
 * Home v2 completa: topo e cartões (1.2), trilha (1.3), ferramentas (1.4), países (1.5),
 * bloco de confiança e chamada final (1.6). O rodapé vem do Layout.
 */
export function HomePage() {
  useDocumentTitle('Daydreaming')

  return (
    <>
      <Hero />
      <Perks />
      <Trail />
      <Tools />
      <Passports />
      <Trust />
      <Final />
    </>
  )
}
