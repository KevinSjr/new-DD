import { createHash } from 'node:crypto'
import { writeFile } from 'node:fs/promises'

const listingUrl = 'https://www.studyinhongkong.edu.hk/en/hong-kong-education/scholarships.php'
const output = process.argv[2]
if (!output || output.endsWith('.partial.json')) throw new Error('Informe um novo caminho JSON para a coleta.')

const response = await fetch(listingUrl, {
  headers: { 'User-Agent': 'Daydreaming scholarship catalogue research' },
  signal: AbortSignal.timeout(30000),
})
if (!response.ok) throw new Error(`Página de bolsas: HTTP ${response.status}`)
const html = await response.text()
const decode = value => value.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&(?:amp|quot|apos|lt|gt|nbsp);/g, entity => ({
    '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ',
  })[entity])
const clean = value => decode(value.replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
const idFor = title => createHash('sha256').update(title).digest('hex').slice(0, 24)
const records = []

const nonLocal = html.slice(html.indexOf('Scholarships/awards for non-local students'), html.indexOf('<a name="bars">'))
const main = [...nonLocal.matchAll(/<li><strong><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/strong>([\s\S]*?)<\/li>/g)]
const mainTitles = [
  'Scholarship for Outstanding Performance (HKSAR Government Scholarship Fund)',
  'Outstanding Performance Scholarship (Self-financing Post-secondary Education Fund)',
  'Hong Kong PhD Fellowship Scheme',
]
if (main.length !== 3 || main.some((match, index) => !clean(match[2]).includes([
  'HKSAR Government Scholarship Fund', 'Self-financing Post-secondary Education Fund', 'Hong Kong PhD Fellowship Scheme',
][index]))) throw new Error('Estrutura dos três programas principais mudou.')
for (let index = 0; index < main.length; index++) {
  const [, href, fundTitle, body] = main[index]
  const description = clean(body)
  const amount = index < 2
    ? description.match(/HK\$80,000 \(approximately US\$10,300\) per year/)?.[0]
    : description.match(/annual stipend of HK\$344,400 \(approximately US\$44,150\)[\s\S]*?HK\$14,400 \(approximately US\$1,840\) per year/)?.[0]
  if (!amount) throw new Error(`Benefício esperado ausente em ${clean(fundTitle)}.`)
  const title = mainTitles[index]
  const providerUrl = new URL(decode(href)).href
  records.push({ id: idFor(title), title, source_url: listingUrl,
    provider_url: providerUrl, fund_title: clean(fundTitle),
    description, amount_listing: amount.replace(/\s+/g, ' ').trim(),
    amount_reference_year: index === 2 ? description.match(/\b\d{4}\/\d{2} academic year/)?.[0] || null : null,
    nationality_listing: index === 2 ? 'Students from around the world' : 'Non-local students',
    study_level: ['Degree and above', 'Undergraduate', 'PhD'][index],
    destination: 'Hong Kong', scheme_group: 'non_local' })
}

const beltSection = html.slice(html.indexOf('Scholarships for students from countries/regions along the Belt and Road'),
  html.indexOf('Other scholarships and award schemes'))
if (!beltSection.includes('All awardees would receive a scholarship to cover their tuition fees.')) {
  throw new Error('Cobertura de mensalidades da Belt and Road Scholarship não encontrada.')
}
const beltMatches = [...beltSection.matchAll(/<strong>(?:\((?:i|ii|iii)\)\s*)?(Belt and Road Scholarship \([^)]+\))<\/strong>/g)]
const schemes = beltMatches.filter(match => !match[1].endsWith('(Designated Countries)'))
if (schemes.length !== 8) throw new Error(`Esperadas oito modalidades Belt and Road; encontradas ${schemes.length}.`)
for (const match of schemes) {
  const title = match[1]
  const next = beltMatches.find(candidate => candidate.index > match.index)
  const description = clean(beltSection.slice(match.index + match[0].length, next?.index || beltSection.length))
  const group = title.match(/\(([^)]+)\)$/)?.[1]
  const namedCountry = !['Other Countries', 'Research Postgraduate'].includes(group) ? group : null
  if (!description.includes('Funding Source: HKSAR Government Scholarship Fund')) {
    throw new Error(`Fonte financiadora ausente em ${title}.`)
  }
  records.push({ id: idFor(title), title, source_url: `${listingUrl}#bars`,
    provider_url: records[0].provider_url, fund_title: 'HKSAR Government Scholarship Fund',
    description, amount_listing: 'Tuition fees covered', amount_reference_year: null,
    nationality_listing: namedCountry ? `Students from ${namedCountry}` : 'Students from Belt and Road countries',
    study_level: group === 'Research Postgraduate' ? 'Research postgraduate' : 'Undergraduate (first year)',
    destination: 'Hong Kong', scheme_group: 'belt_and_road' })
}
if (records.length !== 11 || new Set(records.map(record => record.id)).size !== records.length) {
  throw new Error('Contagem ou IDs inconsistentes.')
}
await writeFile(output, `${JSON.stringify({ source: 'study_hong_kong', listing_url: listingUrl,
  fetched_at: new Date().toISOString(), records }, null, 2)}\n`, { flag: 'wx' })
console.log(`${records.length} programas/modalidades coletados da página governamental.`)
