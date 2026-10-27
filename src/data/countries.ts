import type { CountryGuide } from '../types/country'

/*
 * Lista dos guias de países da página inicial.
 *
 * Aqui entram SOMENTE nomes e o estado de cada guia. Informações sobre o país
 * (custos, vistos, requisitos, prazos) pertencem à página de cada guia e exigem
 * fonte oficial e data de verificação.
 *
 * Para publicar um guia: mude o status para "available" e informe o `href`.
 */
export const COUNTRY_GUIDES: readonly CountryGuide[] = [
  { slug: 'alemanha', name: 'Alemanha', status: 'available', href: '/paises/alemanha' },
  { slug: 'australia', name: 'Austrália', status: 'available', href: '/paises/australia' },
  { slug: 'belgica', name: 'Bélgica', status: 'available', href: '/paises/belgica' },
  { slug: 'canada', name: 'Canadá', status: 'available', href: '/paises/canada' },
  { slug: 'china', name: 'China', status: 'available', href: '/paises/china' },
  { slug: 'coreia-do-sul', name: 'Coreia do Sul', status: 'available', href: '/paises/coreia-do-sul' },
  { slug: 'dinamarca', name: 'Dinamarca', status: 'available', href: '/paises/dinamarca' },
  { slug: 'espanha', name: 'Espanha', status: 'available', href: '/paises/espanha' },
  { slug: 'estados-unidos', name: 'Estados Unidos', status: 'available', href: '/paises/estados-unidos' },
  { slug: 'finlandia', name: 'Finlândia', status: 'available', href: '/paises/finlandia' },
  { slug: 'franca', name: 'França', status: 'available', href: '/paises/franca' },
  { slug: 'paises-baixos', name: 'Países Baixos (Holanda)', status: 'available', href: '/paises/paises-baixos' },
]
