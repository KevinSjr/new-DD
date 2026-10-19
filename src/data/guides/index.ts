import type { CountryGuideContent } from '../../types/countryGuide'

/*
 * Conteúdo dos guias de países, por slug.
 *
 * Para criar um guia:
 *  1. Copie `_modelo.ts` para `<slug>.ts` e preencha SOMENTE com informações
 *     conferidas em fontes oficiais, cada uma com link e data de verificação.
 *  2. Importe o arquivo aqui e acrescente ao objeto abaixo.
 *  3. Em `data/countries.ts`, mude o status do país para "available" e informe
 *     o `href` ("/paises/<slug>").
 *
 * Enquanto um país não aparecer aqui, a página dele mostra todos os temas como
 * "sem informações verificadas".
 */
export const COUNTRY_GUIDE_CONTENT: Readonly<Record<string, CountryGuideContent>> = {
}
