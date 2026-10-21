import { writeFile } from 'node:fs/promises'

const listingUrl = 'https://www.scholarshipsads.com/scholarships-in-norway'
const output = process.argv[2]
if (!output || output.endsWith('.partial.json')) throw new Error('Informe um novo destino JSON.')

const clean = value => value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/\s+/g, ' ').trim()
const pick = (html, pattern) => clean(html.match(pattern)?.[1] || '') || null
async function get(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'Daydreaming scholarship catalogue research' }, signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return response.text()
}

const first = await get(listingUrl)
const reportedTotal = Number(first.match(/<b>(\d+)<\/b><span>Scholarships<\/span>/)?.[1])
const pages = Math.max(1, ...[...first.matchAll(/scholarships-in-norway\?page=(\d+)/g)].map(match => Number(match[1])))
if (!reportedTotal || pages > 30) throw new Error('Total ou paginação não reconhecidos.')
const records = []
let pagesCollected = 0
for (let page = 1; page <= pages; page++) {
  let html
  try { html = page === 1 ? first : await get(`${listingUrl}?page=${page}`) }
  catch (error) {
    if (page === 1) throw error
    console.warn(`Coleta interrompida na página ${page}: ${error.message}`)
    break
  }
  pagesCollected++
  const structured = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => { try { return JSON.parse(match[1]) } catch { return null } })
    .flatMap(value => value?.['@graph'] || [value])
    .find(value => value?.mainEntity?.itemListElement)
  const deadlineByUrl = new Map(structured?.mainEntity.itemListElement.map(entry => [entry.item.url, entry.item.availabilityEnds || null]) || [])
  const starts = [...html.matchAll(/<div class="scholarship-card\b/g)].map(match => match.index)
  if (!starts.length) throw new Error(`Nenhum cartão na página ${page}.`)
  for (let index = 0; index < starts.length; index++) {
    const card = html.slice(starts[index], starts[index + 1] || html.indexOf('pagination-wrap', starts[index]))
    const anchor = card.match(/<h3 class="sc-title"><a href="([^"]+)">([\s\S]*?)<\/a><\/h3>/)
    if (!anchor) throw new Error(`Título ausente na página ${page}.`)
    const sourceUrl = new URL(anchor[1])
    if (sourceUrl.origin !== 'https://www.scholarshipsads.com' || sourceUrl.pathname === '/scholarships-in-norway') throw new Error(`Link inválido: ${sourceUrl}`)
    const entries = [...card.matchAll(/<li><i class="([^"]+)"><\/i>\s*([\s\S]*?)<\/li>/g)]
    const field = icon => clean(entries.find(match => match[1] === icon)?.[2] || '') || null
    records.push({ id: sourceUrl.pathname.slice(1).replace(/\/$/, ''), title: clean(anchor[2]), source_url: sourceUrl.href,
      summary: pick(card, /<div class="sc-desc"><p>([\s\S]*?)<\/p>/),
      amount_listing: field('icon-dollor'), institution_listing: field('icon-place'),
      study_level: field('icon-Bachelor2'), field_of_study: field('icon-book'),
      nationality_listing: field('icon-world'), destinations: field('icon-map'),
      status_listing: pick(card, /<span class="sc-badge">([\s\S]*?)<\/span>/),
      deadline_date_listing: deadlineByUrl.get(sourceUrl.href) || null, listing_page: page })
  }
  console.log(`Página ${page}/${pages}: ${starts.length} cartões`)
}
if ((pagesCollected === pages && records.length !== reportedTotal) || new Set(records.map(record => record.id)).size !== records.length || records.some(record => !record.title || !record.destinations?.includes('Norway'))) throw new Error(`Coleta inconsistente: ${records.length}/${reportedTotal}.`)
await writeFile(output, `${JSON.stringify({ source: 'scholarshipsads_norway', listing_url: listingUrl, fetched_at: new Date().toISOString(), reported_total: reportedTotal, pages, pages_collected: pagesCollected, collection_complete: pagesCollected === pages, records }, null, 2)}\n`, { flag: 'wx' })
console.log(`${records.length} de ${reportedTotal} registros coletados; cobertura ${pagesCollected}/${pages} páginas.`)
