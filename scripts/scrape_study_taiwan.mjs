import { createHash } from 'node:crypto'
import { writeFile } from 'node:fs/promises'

const listingUrl = 'https://www.studyintaiwan.org/how-to-apply/scholarship'
const output = process.argv[2]
if (!output || output.endsWith('.partial.json')) throw new Error('Informe um novo caminho JSON para a coleta.')

const decode = value => value.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&(?:amp|quot|apos|lt|gt|nbsp);/g, entity => ({
    '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ',
  })[entity])
const clean = value => decode(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
const field = (html, className) => clean(html.match(new RegExp(`<div class="${className}">([\\s\\S]*?)<\\/div>`))?.[1] || '') || null
async function get(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Daydreaming scholarship catalogue research' },
    signal: AbortSignal.timeout(30000),
  })
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return response.text()
}

const first = await get(listingUrl)
const reportedTotal = Number(first.match(/<span class="numOfResults">(\d+)<\/span>/)?.[1])
const pages = Math.max(1, ...[...first.matchAll(/\/how-to-apply\/scholarship\?p=(\d+)/g)].map(match => Number(match[1])))
if (!reportedTotal || pages > 100) throw new Error('Total ou paginação não reconhecidos.')

const records = []
for (let page = 1; page <= pages; page++) {
  const html = page === 1 ? first : await get(`${listingUrl}?p=${page}`)
  const region = html.split('id="searchResultsList"')[1]?.split('<nav id="pages"')[0]
  if (!region) throw new Error(`Área de resultados ausente na página ${page}.`)
  const starts = [...region.matchAll(/<div class="item pb-5 row gx-0">/g)].map(match => match.index)
  if (!starts.length) throw new Error(`Nenhuma bolsa na página ${page}.`)
  for (let index = 0; index < starts.length; index++) {
    const card = region.slice(starts[index], starts[index + 1] || region.length)
    const sourceTitle = field(card, 'title')
    // Three entries contain an English title alongside Chinese characters.
    const title = sourceTitle?.replace(/[\p{Script=Han}]+/gu, '').trim()
    const institution = field(card, 'typename')
    const institutionType = clean(card.match(/<div class="type [^"]+">([\s\S]*?)<\/div>/)?.[1] || '') || null
    const tags = [...card.matchAll(/<span class="badge">([\s\S]*?)<\/span>/g)].map(match => clean(match[1]))
    const href = card.match(/<a class="focus-button onw btn btn-details" href="([^"]+)"/)?.[1]
    const destination = clean(card.match(/<span class="school-tag">([\s\S]*?)<\/span>/)?.[1] || '')
    const providerUrl = href ? new URL(decode(href)).href : null
    if (!title || !institution || destination !== 'Taiwan' || (providerUrl && !/^https?:\/\//.test(providerUrl))) {
      throw new Error(`Registro inválido na página ${page}, posição ${index + 1}.`)
    }
    const id = createHash('sha256').update(`${institution}\u0000${sourceTitle}`).digest('hex').slice(0, 24)
    records.push({ id, title, source_title: sourceTitle, institution, institution_type: institutionType,
      funding_category: tags[0] || null, sponsor_tag: tags[1] || null,
      destination, provider_url: providerUrl, listing_page: page,
      source_url: page === 1 ? listingUrl : `${listingUrl}?p=${page}` })
  }
  console.log(`Página ${page}/${pages}: ${starts.length} resultados`)
}
if (records.length !== reportedTotal || new Set(records.map(record => record.id)).size !== records.length) {
  throw new Error(`Contagem inconsistente: ${records.length} coletados, ${reportedTotal} anunciados.`)
}
await writeFile(output, `${JSON.stringify({ source: 'study_taiwan', listing_url: listingUrl,
  fetched_at: new Date().toISOString(), reported_total: reportedTotal, pages, records }, null, 2)}\n`, { flag: 'wx' })
console.log(`${records.length} registros coletados do catálogo Study in Taiwan.`)
