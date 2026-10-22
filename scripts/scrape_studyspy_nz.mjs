import { writeFile } from 'node:fs/promises'

const listingUrl = 'https://studyspy.ac.nz/search/scholarships'
const output = process.argv[2]
if (!output || output.endsWith('.partial.json')) throw new Error('Informe um novo arquivo JSON de saída.')

async function get(url, options) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(30000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response
    } catch (error) {
      if (attempt === 3) throw new Error(`${url}: ${error.message}`)
      await new Promise(resolve => setTimeout(resolve, attempt * 1200))
    }
  }
}

const html = await (await get(listingUrl)).text()
const appId = html.match(/appId:\s*"([A-Z0-9]+)"/)?.[1]
const apiKey = html.match(/apiKey:\s*"([a-z0-9]+)"/)?.[1]
if (!appId || !apiKey || !html.includes('/js/scholarshipSearch.js')) {
  throw new Error('Configuração da busca pública do StudySpy não encontrada.')
}
const endpoint = `https://${appId}-dsn.algolia.net/1/indexes/scholarships/query`
async function search(category, page) {
  const params = new URLSearchParams({ hitsPerPage: '100', page: String(page),
    filters: `domesticOrInternational:"${category}"` })
  const response = await get(endpoint, { method: 'POST', headers: {
    'content-type': 'application/json', 'x-algolia-application-id': appId, 'x-algolia-api-key': apiKey,
  }, body: JSON.stringify({ params: params.toString() }) })
  const result = await response.json()
  if (!Array.isArray(result.hits) || !Number.isInteger(result.nbHits) ||
      !Number.isInteger(result.nbPages) || result.page !== page || result.nbPages > 10) {
    throw new Error(`Resposta inesperada para ${category}, página ${page}.`)
  }
  return result
}

const categories = ['International Only', 'Both domestic and international']
const records = []
const categoryTotals = {}
for (const category of categories) {
  const first = await search(category, 0)
  categoryTotals[category] = first.nbHits
  for (let page = 0; page < first.nbPages; page++) {
    const result = page === 0 ? first : await search(category, page)
    if (result.nbHits !== first.nbHits || result.nbPages !== first.nbPages ||
        result.hits.length !== Math.min(100, first.nbHits - page * 100)) {
      throw new Error(`Paginação inconsistente para ${category}, página ${page}.`)
    }
    for (const hit of result.hits) {
      if (!/^\d+$/.test(String(hit.objectID)) || !hit.name || !hit.slug ||
          hit.domesticOrInternational?.toLowerCase() !== category.toLowerCase()) {
        throw new Error(`Bolsa incompleta na categoria ${category}: ${hit.objectID}`)
      }
      records.push({ id: String(hit.objectID), title: hit.name,
        source_url: `https://studyspy.ac.nz/scholarships/${hit.objectID}/${hit.slug}`,
        provider_name: hit.providerName || hit.providedBy || null, provider_type: hit.providerType || null,
        description: hit.description || null, entry_requirements: hit.entryRequirements || null,
        nationality_category: category, eligible_countries: hit.eligibleCountries || [],
        eligible_regions: hit.eligibleRegions || [], eligible_ethnicities: hit.eligibleEthnicities || [],
        study_levels: hit.studyLevels || [], subject_or_faculty: hit.subjectOrFaculty || null,
        value_description: hit.valueDescription || null, value_number: hit.value ?? null,
        number_available: hit.numberAvailable ?? null, tenure: hit.tenure || hit.tenureDescription || null,
        close_date_unix: hit.closeDate > 0 ? hit.closeDate : null,
        is_open_listing: typeof hit.isOpen === 'boolean' ? hit.isOpen : null,
        is_always_open: hit.isAlwaysOpen === true,
        provider_url: /^https:\/\//.test(hit.url || '') ? hit.url : null,
        application_form_url: /^https:\/\//.test(hit.applicationFormUrl || '') ? hit.applicationFormUrl : null })
    }
    console.log(`${category}: página ${page + 1}/${first.nbPages}, ${records.length} fichas até agora`)
  }
}
if (records.length !== Object.values(categoryTotals).reduce((a, b) => a + b, 0) ||
    new Set(records.map(record => record.id)).size !== records.length) {
  throw new Error('Coleta incompleta ou IDs duplicados.')
}
await writeFile(output, `${JSON.stringify({ source: 'studyspy_nz', listing_url: listingUrl,
  fetched_at: new Date().toISOString(), categories: categoryTotals, records }, null, 2)}\n`, { flag: 'wx' })
console.log(`Salvas ${records.length} bolsas com categoria internacional no StudySpy.`)
