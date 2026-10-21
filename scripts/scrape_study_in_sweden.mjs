import { writeFile } from 'node:fs/promises'

const listingUrl = 'https://studyinsweden.se/scholarships/'
const output = process.argv[2]
if (!output || output.endsWith('.partial.json')) throw new Error('Informe um caminho JSON de saída completo.')

const response = await fetch(listingUrl, { headers: { 'User-Agent': 'Daydreaming scholarship catalog research (contact via project)' }, signal: AbortSignal.timeout(30000) })
if (!response.ok) throw new Error(`Study in Sweden: HTTP ${response.status}`)
const html = await response.text()
const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)
if (!match) throw new Error('JSON da listagem não encontrado; estrutura da página mudou.')
const scholarships = JSON.parse(match[1])?.props?.pageProps?.scholarships
if (!Array.isArray(scholarships) || scholarships.length === 0) throw new Error('A lista de bolsas está vazia ou ausente.')

const cleanUrl = value => value.replace(/&amp;|&#0*38;/gi, '&').trim()
async function safeProviderUrl(original) {
  if (original.startsWith('https://')) return original
  if (!original.startsWith('http://')) return null
  const upgraded = original.replace(/^http:/, 'https:')
  try {
    const head = await fetch(upgraded, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(8000) })
    if (head.ok && head.url.startsWith('https://')) return upgraded
  } catch { /* Preserve the original link in the data, but do not expose an unverified HTTPS upgrade. */ }
  return null
}

const records = []
for (const entry of scholarships) {
  const acf = entry.acf || {}
  const originalProviderUrl = cleanUrl(String(acf.link?.url || ''))
  const title = String(acf.name || entry.title?.rendered || '').trim()
  const category = String(acf.scholarship_type?.name || '').trim()
  const regions = Array.isArray(acf.regions) ? acf.regions.map(region => String(region.name || '').trim()).filter(Boolean) : []
  const university = acf.university && typeof acf.university === 'object' ? String(acf.university.post_title || '').trim() : ''
  if (!Number.isInteger(entry.id) || !title || !['University scholarships', 'Other scholarships', 'Swedish Institute scholarships'].includes(category) ||
      !/^https?:\/\//.test(originalProviderUrl) || entry.type !== 'scholarship') throw new Error(`Registro inválido: ${entry.id}`)
  records.push({
    id: String(entry.id), title, category, university, regions,
    original_provider_url: originalProviderUrl,
    provider_url: await safeProviderUrl(originalProviderUrl),
    source_modified_at: entry.modified_gmt ? `${entry.modified_gmt}Z` : null,
  })
}
if (new Set(records.map(record => record.id)).size !== records.length) throw new Error('IDs duplicados.')
records.sort((a, b) => Number(a.id) - Number(b.id))
const payload = { source: 'study_in_sweden', listing_url: listingUrl, fetched_at: new Date().toISOString(), reported_total: records.length, records }
await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' })
console.log(`${records.length} registros coletados. Brasil explícito: ${records.filter(record => record.regions.includes('Brazil')).length}; grupo não-UE: ${records.filter(record => record.regions.includes('Not in European Union')).length}; links HTTPS do provedor: ${records.filter(record => record.provider_url).length}.`)
