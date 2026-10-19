/**
 * Estado de um guia de país:
 * - "available": guia publicado, com página própria (exige `href`).
 * - "in-progress": guia em preparação, ainda sem página.
 */
export type CountryGuideStatus = 'available' | 'in-progress'

export type CountryGuide = {
  /** Identificador estável, usado como chave e (no futuro) na URL da página. */
  slug: string
  name: string
  status: CountryGuideStatus
  /** Destino da página do guia. Obrigatório quando status === "available". */
  href?: string
}
