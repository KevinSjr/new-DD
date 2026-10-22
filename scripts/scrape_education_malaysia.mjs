import { writeFile } from 'node:fs/promises'

const listingUrl = 'https://educationmalaysia.gov.my/plan-your-studies/choose-what-to-study/scholarship-listing'
const output = process.argv[2]
if (!output || output.endsWith('.partial.json')) throw new Error('Informe um novo arquivo JSON de saída.')

const decode = value => value.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, dec) => String.fromCodePoint(parseInt(hex || dec, hex ? 16 : 10)))
  .replace(/&(?:amp|quot|apos|lt|gt|nbsp|rsquo|ndash);/g, entity => ({
    '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ',
    '&rsquo;': '’', '&ndash;': '–',
  })[entity])
const clean = value => decode((value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
async function get(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'Daydreaming scholarship catalogue research' }, signal: AbortSignal.timeout(45000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response.text()
    } catch (error) {
      if (attempt === 3) throw new Error(`${url}: ${error.message}`)
      await new Promise(resolve => setTimeout(resolve, attempt * 1500))
    }
  }
}
function parsePage(html, page) {
  const count = html.match(/(\d+) out of (\d+) results/)
  const current = html.match(/class="scholarship-current-page" value="(\d+)"/)
  const totalPages = html.match(/class="scholarship-total-page" value="(\d+)"/)
  if (!count || !current || !totalPages || Number(current[1]) !== page) throw new Error(`Paginação inesperada: página ${page}`)
  const cards = [...html.matchAll(/<div class="scholarship-list wow animate__fadeInUp"[^>]*>/g)]
  const records = cards.map((match, index) => {
    const card = html.slice(match.index, cards[index + 1]?.index || html.indexOf('</div>\n\n            <input type="hidden"', match.index))
    const anchor = card.match(/<a href="([^"]+)" class="scholarship-header"[^>]*>[\s\S]*?<span>\s*([\s\S]*?)<\/span>\s*<h4>([\s\S]*?)<\/h4>/)
    const id = card.match(/class="form-check-input compare_check"[^>]*value="(\d+)"/)
    const meta = [...card.matchAll(/<li>\s*<img[^>]*\/><span>([\s\S]*?)<\/span>\s*<\/li>/g)].map(item => clean(item[1]))
    if (!anchor || !id || !meta.length) throw new Error(`Cartão inesperado: página ${page}, item ${index + 1}`)
    return { id: id[1], provider: clean(anchor[2]), course: clean(anchor[3]), source_url: decode(anchor[1]),
      study_level: meta[0], award_listing: meta[1] || null, listing_page: page }
  })
  if (Number(count[1]) !== Math.min(page * 25, Number(count[2])) || records.length !== Math.min(25, Number(count[2]) - (page - 1) * 25)) {
    throw new Error(`Contagem inesperada: página ${page}`)
  }
  return { total: Number(count[2]), pages: Number(totalPages[1]), records }
}

const first = parsePage(await get(listingUrl), 1)
if (first.pages < 1 || first.pages > 100) throw new Error('Número de páginas inesperado.')
const records = [...first.records]
for (let page = 2; page <= first.pages; page++) {
  const result = parsePage(await get(`${listingUrl}?currentpage=${page}`), page)
  if (result.total !== first.total || result.pages !== first.pages) throw new Error(`Total mudou na página ${page}`)
  records.push(...result.records)
  console.log(`Listagem ${page}/${first.pages}: ${records.length}/${first.total}`)
}
if (records.length !== first.total || new Set(records.map(record => record.id)).size !== records.length) {
  throw new Error('Coleta incompleta ou IDs duplicados.')
}
await writeFile(output, `${JSON.stringify({ source: 'education_malaysia', listing_url: listingUrl,
  fetched_at: new Date().toISOString(), pages: first.pages, listed_total: first.total, records }, null, 2)}\n`, { flag: 'wx' })
console.log(`Salvos ${records.length} cartões da Education Malaysia.`)
