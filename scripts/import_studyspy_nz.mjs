import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo do StudySpy.')
const payload = JSON.parse(await readFile(path, 'utf8'))
const plainText = value => value?.replace(/<[^>]*>/g, ' ')
  .replace(/&(?:amp|nbsp|lt|gt|quot|apos);/g, entity => ({
    '&amp;': '&', '&nbsp;': ' ', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
  })[entity]).replace(/\s+/g, ' ').trim() || null
const categories = ['International Only', 'Both domestic and international']
const aggregateIds = new Set(['15792'])
if (payload.source !== 'studyspy_nz' || payload.listing_url !== 'https://studyspy.ac.nz/search/scholarships' ||
    !Array.isArray(payload.records) || !payload.records.length ||
    !categories.every(category => Number.isInteger(payload.categories?.[category])) ||
    categories.reduce((sum, category) => sum + payload.categories[category], 0) !== payload.records.length ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta incompleta ou inválida.')
for (const record of payload.records) {
  if (!/^\d+$/.test(record.id) || !record.title ||
      !new RegExp(`^https://studyspy[.]ac[.]nz/scholarships/${record.id}/[a-z0-9-]+$`).test(record.source_url) ||
      !categories.includes(record.nationality_category) ||
      !['eligible_countries', 'eligible_regions', 'eligible_ethnicities', 'study_levels']
        .every(key => Array.isArray(record[key])) ||
      (record.close_date_unix !== null && (!Number.isInteger(record.close_date_unix) || record.close_date_unix <= 0)) ||
      (record.provider_url && !record.provider_url.startsWith('https://')) ||
      (record.application_form_url && !record.application_form_url.startsWith('https://'))) {
    throw new Error(`Registro inválido: ${record.id}`)
  }
}

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    const closeDate = record.close_date_unix
      ? new Date(record.close_date_unix * 1000).toISOString().slice(0, 10) : null
    await client.query(`INSERT INTO studyspy_nz_imports
      (source_id,title,source_url,provider_name,provider_type,description,entry_requirements,
       nationality_category,eligible_countries,eligible_regions,eligible_ethnicities,study_levels,
       subject_or_faculty,value_description,value_number,number_available,tenure,close_date,
       is_open_listing,is_always_open,provider_url,application_form_url,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12::jsonb,
        $13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
      ON CONFLICT (source_id) DO UPDATE SET title=excluded.title,source_url=excluded.source_url,
        provider_name=excluded.provider_name,provider_type=excluded.provider_type,
        description=excluded.description,entry_requirements=excluded.entry_requirements,
        nationality_category=excluded.nationality_category,eligible_countries=excluded.eligible_countries,
        eligible_regions=excluded.eligible_regions,eligible_ethnicities=excluded.eligible_ethnicities,
        study_levels=excluded.study_levels,subject_or_faculty=excluded.subject_or_faculty,
        value_description=excluded.value_description,value_number=excluded.value_number,
        number_available=excluded.number_available,tenure=excluded.tenure,close_date=excluded.close_date,
        is_open_listing=excluded.is_open_listing,is_always_open=excluded.is_always_open,
        provider_url=excluded.provider_url,application_form_url=excluded.application_form_url,
        fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.title, record.source_url, record.provider_name, record.provider_type,
      plainText(record.description), plainText(record.entry_requirements), record.nationality_category,
      JSON.stringify(record.eligible_countries), JSON.stringify(record.eligible_regions),
      JSON.stringify(record.eligible_ethnicities), JSON.stringify(record.study_levels),
      record.subject_or_faculty, record.value_description, record.value_number,
      record.number_available, record.tenure, closeDate, record.is_open_listing,
      record.is_always_open, record.provider_url, record.application_form_url, payload.fetched_at])
  }
  for (const id of aggregateIds) {
    await client.query(`UPDATE studyspy_nz_imports SET catalog_status = 'rejected', updated_at = now()
      WHERE source_id = $1`, [id])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} fichas StudySpy importadas; ${aggregateIds.size} página agregadora fora do buscador.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
