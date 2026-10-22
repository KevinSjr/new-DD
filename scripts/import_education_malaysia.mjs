import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo da Education Malaysia.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'education_malaysia' ||
    payload.listing_url !== 'https://educationmalaysia.gov.my/plan-your-studies/choose-what-to-study/scholarship-listing' ||
    !Array.isArray(payload.records) || !payload.records.length ||
    !Number.isInteger(payload.listed_total) || payload.listed_total !== payload.records.length ||
    !Number.isInteger(payload.pages) || payload.pages !== Math.ceil(payload.listed_total / 25) ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta incompleta ou inválida.')

for (const record of payload.records) {
  if (!/^\d+$/.test(record.id) || !record.provider || !record.course || !record.study_level ||
      !record.source_url.startsWith('https://educationmalaysia.gov.my/') ||
      !Number.isInteger(record.listing_page) || record.listing_page < 1 || record.listing_page > payload.pages) {
    throw new Error(`Registro inválido: ${record.id}`)
  }
}

// The Mauritius government entry in this catalogue does not name a Malaysian destination.
const included = payload.records.filter(record => !record.provider.includes('Republic of Mauritus'))
const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of included) {
    await client.query(`INSERT INTO education_malaysia_imports
      (source_id,provider,course,source_url,study_level,award_listing,listing_page,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (source_id) DO UPDATE SET provider=excluded.provider,course=excluded.course,
        source_url=excluded.source_url,study_level=excluded.study_level,
        award_listing=excluded.award_listing,listing_page=excluded.listing_page,
        fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.provider, record.course, record.source_url, record.study_level,
      record.award_listing, record.listing_page, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${included.length} combinações de bolsa e curso importadas; ${payload.records.length - included.length} registro(s) sem destino malaio excluído(s).`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
