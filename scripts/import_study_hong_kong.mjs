import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON da página Study in Hong Kong.')
const payload = JSON.parse(await readFile(path, 'utf8'))
const listingUrl = 'https://www.studyinhongkong.edu.hk/en/hong-kong-education/scholarships.php'
if (payload.source !== 'study_hong_kong' || payload.listing_url !== listingUrl ||
    !Array.isArray(payload.records) || payload.records.length !== 11 ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta de Hong Kong inválida ou incompleta.')
for (const record of payload.records) {
  if (!/^[0-9a-f]{24}$/.test(record.id) || !record.title ||
      ![listingUrl, `${listingUrl}#bars`].includes(record.source_url) ||
      !/^https:\/\//.test(record.provider_url) || !record.fund_title ||
      !record.description || !record.amount_listing || !record.nationality_listing ||
      !record.study_level || record.destination !== 'Hong Kong' ||
      !['non_local', 'belt_and_road'].includes(record.scheme_group)) {
    throw new Error(`Registro inválido: ${record.id}`)
  }
}

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    await client.query(`INSERT INTO study_hong_kong_imports
      (source_id,title,source_url,provider_url,fund_title,description,amount_listing,
       amount_reference_year,nationality_listing,study_level,destination,scheme_group,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (source_id) DO UPDATE SET title=excluded.title,source_url=excluded.source_url,
        provider_url=excluded.provider_url,fund_title=excluded.fund_title,
        description=excluded.description,amount_listing=excluded.amount_listing,
        amount_reference_year=excluded.amount_reference_year,
        nationality_listing=excluded.nationality_listing,study_level=excluded.study_level,
        destination=excluded.destination,scheme_group=excluded.scheme_group,
        fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.title, record.source_url, record.provider_url,
      record.fund_title, record.description, record.amount_listing,
      record.amount_reference_year, record.nationality_listing,
      record.study_level, record.destination, record.scheme_group, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} programas/modalidades de Hong Kong importados.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
