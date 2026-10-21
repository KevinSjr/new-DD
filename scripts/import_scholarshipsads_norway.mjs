import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON de coleta.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'scholarshipsads_norway' ||
    payload.listing_url !== 'https://www.scholarshipsads.com/scholarships-in-norway' ||
    !Array.isArray(payload.records) || !payload.records.length ||
    payload.pages_collected < 1 || payload.pages_collected > payload.pages ||
    payload.collection_complete !== (payload.pages_collected === payload.pages) ||
    (payload.collection_complete && payload.records.length !== payload.reported_total) ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta inválida.')

// Editorial roundups and a historic tuition-free programme are not individual scholarships.
const excludedIds = new Set([
  'scholarships-in-norway-for-bachelors-masters-and-phd-programs-without-ielts',
  '4-without-ielts-scholarships-in-scandinavian-countries-for-international-students',
  'tuition-free-international-masters-programmes-at-the-norwegian-university-of-science-and-technology',
])
const included = payload.records.filter(record => !excludedIds.has(record.id))
for (const record of included) {
  if (!/^[a-z0-9-]+$/.test(record.id) ||
      record.source_url !== `https://www.scholarshipsads.com/${record.id}` ||
      !record.title || !record.destinations?.includes('Norway') ||
      !Number.isInteger(record.listing_page) || record.listing_page > payload.pages_collected ||
      (record.deadline_date_listing && !/^\d{4}-\d{2}-\d{2}$/.test(record.deadline_date_listing))) {
    throw new Error(`Registro inválido: ${record.id}`)
  }
}
const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of included) {
    await client.query(`INSERT INTO scholarshipsads_norway_imports
      (source_id,title,source_url,summary,amount_listing,institution_listing,study_level,
       field_of_study,nationality_listing,destinations,status_listing,deadline_date_listing,
       listing_page,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (source_id) DO UPDATE SET title=excluded.title,source_url=excluded.source_url,
        summary=excluded.summary,amount_listing=excluded.amount_listing,
        institution_listing=excluded.institution_listing,study_level=excluded.study_level,
        field_of_study=excluded.field_of_study,nationality_listing=excluded.nationality_listing,
        destinations=excluded.destinations,status_listing=excluded.status_listing,
        deadline_date_listing=excluded.deadline_date_listing,listing_page=excluded.listing_page,
        fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.title, record.source_url, record.summary, record.amount_listing,
      record.institution_listing, record.study_level, record.field_of_study,
      record.nationality_listing, record.destinations, record.status_listing,
      record.deadline_date_listing, record.listing_page, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${included.length} oportunidades importadas; ${payload.records.length - included.length} compilações/programas excluídos. Cobertura: ${payload.pages_collected}/${payload.pages} páginas.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
