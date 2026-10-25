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
]
