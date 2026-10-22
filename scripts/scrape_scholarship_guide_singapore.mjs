import { writeFile } from 'node:fs/promises'

const listingUrl = 'https://www.scholarshipguide.com.sg/scholarship?ScholarshipSearch%5BstatusAvailability%5D=&ScholarshipSearch%5BstudentLv%5D=&ScholarshipSearch%5Bcourse%5D=&ScholarshipSearch%5Blocation%5D=&ScholarshipSearch%5Bnationality%5D=2&ScholarshipSearch%5BproviderID%5D=&ScholarshipSearch%5BfeaturedProvider%5D=0&ScholarshipSearch%5Bdes%5D='
const output = process.argv[2]
if (!output || output.endsWith('.partial.json')) throw new Error('Informe um novo caminho JSON para a coleta.')

const decode = value => value.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&(?:amp|quot|apos|lt|gt|nbsp|rsquo|ndash);/g, entity => ({
    '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ',
    '&rsquo;': '’', '&ndash;': '–',
  })[entity])
const clean = value => decode(value.replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
const pick = (html, pattern) => clean(html.match(pattern)?.[1] || '') || null
const field = (html, label) => {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return pick(html, new RegExp(`<span class=['"]label['"]>\\s*${escaped}:?\\s*<\\/span>\\s*<span class=['"]d-sm-inline d-block['"]>([\\s\\S]*?)<\\/span>`, 'i'))
}
async function get(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Daydreaming scholarship catalogue research' },
    signal: AbortSignal.timeout(30000),
  })
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return response.text()
}

const first = await get(listingUrl)
if (!/value="2" selected>Other Citizen<\/option>/.test(first)) {
  throw new Error('O filtro nationality=2 não corresponde mais a Other Citizen.')
}
const pages = Math.max(1, ...[...first.matchAll(/page=(\d+)&amp;per-page=15/g)].map(match => Number(match[1])))
if (pages > 100) throw new Error('Paginação inesperada.')
const listed = []
let filteredTotal = 0
for (let page = 1; page <= pages; page++) {
  const url = page === 1 ? listingUrl : `${listingUrl}&page=${page}&per-page=15`
  const html = page === 1 ? first : await get(url)
  const starts = [...html.matchAll(/<div data-key="(\d+)">/g)]
  if (!starts.length) throw new Error(`Sem cartões na página ${page}.`)
  const summary = html.match(/<div class="summary">Showing (\d+) - (\d+) <\/div>/)
  if (!summary || Number(summary[1]) !== (page - 1) * 15 + 1 ||
      Number(summary[2]) !== (page - 1) * 15 + starts.length ||
      (page < pages && starts.length !== 15)) throw new Error(`Paginação inconsistente na página ${page}.`)
  filteredTotal = Number(summary[2])
  for (let index = 0; index < starts.length; index++) {
    const card = html.slice(starts[index].index, starts[index + 1]?.index || html.indexOf('<nav', starts[index].index))
    const id = starts[index][1]
    const anchor = card.match(/<a class="item-title mb-3" href="([^"]+)">([\s\S]*?)<\/a>/)
    const locations = field(card, 'Locations')
    if (!anchor || !locations || !field(card, 'Nationality')?.includes('Other Citizen')) {
      throw new Error(`Cartão inesperado: ${id}`)
    }
    listed.push({ id, title: clean(anchor[2]), source_url: new URL(decode(anchor[1]), listingUrl).href,
      description_listing: pick(card, /<p class=['"]d-block item-description['"]>([\s\S]*?)<\/p>/),
      status_listing: pick(card, /<div class="[^"]*open-until[^"]*">([\s\S]*?)<\/div>/),
      student_level: field(card, 'Student Level'), nationality_listing: field(card, 'Nationality'),
      institutions: field(card, 'Tenable Universities \/ Institutions'),
      term: field(card, 'Term'), locations, listing_page: page })
  }
  console.log(`Página ${page}/${pages}: ${starts.length} cartões`)
}
if (new Set(listed.map(record => record.id)).size !== listed.length || listed.length !== filteredTotal) {
  throw new Error('IDs duplicados ou contagem inválida.')
}
const singapore = listed.filter(record => record.locations.split(',').map(value => value.trim()).includes('Singapore'))
const excludedByDestination = listed.length - singapore.length
console.log(`${listed.length} no filtro Other Citizen; ${singapore.length} incluem Singapore no destino.`)

const records = []
for (let index = 0; index < singapore.length; index += 4) {
  const batch = singapore.slice(index, index + 4)
  const details = await Promise.all(batch.map(async record => {
    const html = await get(record.source_url)
    const content = html.slice(html.indexOf("id='right-col'"), html.indexOf('<footer'))
    if (!content || !content.includes(`<h3>${record.title}</h3>`)) {
      throw new Error(`Ficha não reconhecida: ${record.id}`)
    }
    const fields = new Map([...content.matchAll(/<h6 class="m-0">([^<]+)<\/h6>\s*<label class="list">([\s\S]*?)<\/label>/g)]
      .map(match => [clean(match[1]), clean(match[2])]))
    const calendar = pick(content, /<i class="fa-solid fa-calendar fa-sm"><\/i>\s*([^<]+)<\/p>/)
    const course = pick(content, /<h6 class="m-0">Course of Study<\/h6>\s*<label class="list">([\s\S]*?)(?:<\/list>|<\/label>)/) || null
    const award = fields.get('Value of Awards') || null
    return { ...record, deadline_detail: calendar, course_of_study: course,
      award_value: award, requirements: fields.get('Requirement/Conditions') || null }
  }))
  records.push(...details)
  console.log(`Fichas ${records.length}/${singapore.length}`)
}
if (records.length !== singapore.length || records.some(record => !record.source_url.startsWith('https://www.scholarshipguide.com.sg/scholarship/'))) {
  throw new Error('Coleta de fichas incompleta.')
}
await writeFile(output, `${JSON.stringify({ source: 'scholarship_guide_singapore', listing_url: listingUrl,
  fetched_at: new Date().toISOString(), pages, filtered_total: filteredTotal,
  excluded_by_destination: excludedByDestination, records }, null, 2)}\n`, { flag: 'wx' })
console.log(`${records.length} fichas com Singapura como destino coletadas.`)
