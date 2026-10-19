import type { CountryGuideContent } from '../../types/countryGuide'

/*
 * MODELO de guia de país. Copie este arquivo para `<slug>.ts` (ex.: alemanha.ts).
 *
 * Regras (AGENTS.md, seção 9):
 *  - Nada de informação sem fonte oficial. Se não conseguiu confirmar, deixe o tema vazio.
 *  - "confirmed": está na fonte citada. "estimate": valor aproximado. "guide": explicação geral.
 *  - Toda informação "confirmed" ou "estimate" exige `source` com link https e `verifiedAt` (AAAA-MM-DD).
 *    Fatos sem fonte válida não são exibidos.
 *  - Custos: use "estimate" e preencha `money` (moeda e período de referência).
 *  - Prazos: escreva o ano e o fuso horário no `value`.
 *  - Datas de verificação com mais de 180 dias ganham aviso automático na página.
 *  - `items` serve para listas (documentos, etapas). Use rótulos (`label`) diferentes dentro do mesmo tema.
 *  - Veja `alemanha.ts` como exemplo completo.
 *
 * Exemplo de uma informação (troque pelos dados reais):
 *
 *   educacao: [
 *     {
 *       kind: 'confirmed',
 *       label: '<o que a informação descreve>',
 *       value: '<o dado, em linguagem simples>',
 *       source: { label: '<nome do órgão>', url: 'https://...', verifiedAt: '2026-10-17' },
 *     },
 *   ],
 */
export const MODELO: CountryGuideContent = {
  slug: 'slug-do-pais',
  topics: {
    'visao-geral': [],
    educacao: [],
    idioma: [],
    bolsas: [],
    'custo-de-vida': [],
    calendario: [],
    vistos: [],
    trabalho: [],
    'depois-da-formatura': [],
    clima: [],
    'vida-no-pais': [],
    'proximos-passos': [],
  },
  // officialLinks: [{ label: '<nome do site>', url: 'https://...' }],
}
