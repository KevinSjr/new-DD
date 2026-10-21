import { writeFile } from 'node:fs/promises'

const listingUrl = 'https://www.globaladmissions.com/scholarships-for/brazil/belgium'
const output = process.argv[2]
if (!output || output.endsWith('.partial.json')) throw new Error('Informe um novo caminho JSON para a coleta.')

const decode = text => text.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&(?:amp|quot|apos|lt|gt|euro|nbsp);/g, entity => ({
    '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&euro;': '€', '&nbsp;': ' ',
  })[entity])
const clean = html => decode(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
const rowValue = (html, label) => {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = html.match(new RegExp(`<tr[^>]*>\\s*<td[^>]*>\\s*${escaped}\\s*<\\/td>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>\\s*<\\/tr>`, 'i'))
  return match?.[1] || null
}
async function getHtml(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Daydreaming scholarship catalogue research' },
    signal: AbortSignal.timeout(20000),
  })
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return response.text()
}

const html = await getHtml(listingUrl)
const section = html.slice(html.indexOf('At a glance'))
const tbody = section.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1]
if (!tbody) throw new Error('Tabela pública de bolsas não encontrada; estrutura da página mudou.')
const rows = [...tbody.matchAll(/<tr\b([^>]*)>([\s\S]*?)<\/tr>/g)]
const reportedTotal = Number(html.match(/Scholarships listed\s*<\/dt>\s*<dd[^>]*>(\d+)<\/dd>/)?.[1])
if (!Number.isInteger(reportedTotal) || rows.length !== reportedTotal || rows.length === 0) {
  throw new Error(`Contagem inconsistente: ${rows.length} linhas, ${reportedTotal} anunciadas.`)
}

const records = []
for (const [, attributes, row] of rows) {
  const cells = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(match => match[1])
  const anchor = cells[0]?.match(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/)
  if (cells.length !== 6 || !anchor) throw new Error('Linha da tabela sem as seis colunas esperadas.')
  const sourceUrl = new URL(decode(anchor[1]), listingUrl)
  if (sourceUrl.origin !== 'https://www.globaladmissions.com' || !sourceUrl.pathname.startsWith('/scholarship/')) {
    throw new Error(`Link individual inesperado: ${sourceUrl.href}`)
  }
  const id = sourceUrl.pathname.slice('/scholarship/'.length).replace(/\/$/, '')
  const detail = await getHtml(sourceUrl.href)
  const officialCell = rowValue(detail, 'Official Website')
  const officialHref = officialCell?.match(/href="([^"]+)"/)?.[1]
  let providerUrl = null
  if (officialHref) {
    const candidate = new URL(decode(officialHref), sourceUrl)
    if (candidate.protocol === 'https:') providerUrl = candidate.href
  }
  const record = {
    id, title: clean(anchor[2]), source_url: sourceUrl.href, provider_url: providerUrl,
    coverage_listing: clean(cells[1]), study_level: clean(cells[2]),
    funder_type: clean(cells[3]), deadline_listing: clean(cells[4]),
    destination_listing: clean(cells[5]),
    open_to_all_listing: /data-open-to-all="true"/.test(attributes),
    nationality_detail: clean(rowValue(detail, 'Eligible Nationalities') || '') || null,
    deadline_detail: clean(rowValue(detail, 'Deadline') || '') || null,
  }
  if (!/^[a-z0-9-]+$/.test(id) || !record.title || !record.coverage_listing ||
      !record.study_level || record.destination_listing !== 'Belgium') {
    throw new Error(`Registro inválido: ${id}`)
  }
  records.push(record)
  console.log(`${records.length}/${rows.length} ${id}`)
}
if (new Set(records.map(record => record.id)).size !== records.length) throw new Error('IDs duplicados.')
const payload = { source: 'global_admissions_belgium', listing_url: listingUrl,
  fetched_at: new Date().toISOString(), reported_total: reportedTotal, records }
await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' })
console.log(`${records.length} bolsas da listagem Brasil → Bélgica coletadas.`)
