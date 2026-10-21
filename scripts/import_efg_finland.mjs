import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo do European Funding Guide.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'efg_finland' ||
    payload.listing_url !== 'https://www.european-funding-guide.eu/fi-en/scholarships-finland' ||
    !Array.isArray(payload.records) || payload.records.length === 0 ||
    payload.reported_total !== payload.records.length || Number.isNaN(Date.parse(payload.fetched_at)) ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length) {
  throw new Error('Coleta EFG Finland inválida ou incompleta.')
}

for (const record of payload.records) {
  if (!Number.isInteger(record.id) || record.id <= 0 || !record.title || !record.summary ||
      !/^https:\/\/www\.european-funding-guide\.eu\/fi-en\//.test(record.source_url) ||
      (record.provider_url !== null && !/^https:\/\//.test(record.provider_url)) ||
      (record.deadline_date !== null && !/^\d{4}-\d{2}-\d{2}$/.test(record.deadline_date)) ||
      !record.brazil_criteria || !record.country_basis) throw new Error(`Registro EFG Finland inválido: ${record.id}`)
}

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    await client.query(`INSERT INTO efg_finland_imports
      (source_id,title,summary,source_url,provider_url,amount_detail,deadline_date,
       field_of_study,nationality_listing,study_level,brazil_criteria,destinations,country_basis,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (source_id) DO UPDATE SET title=excluded.title,summary=excluded.summary,
        source_url=excluded.source_url,provider_url=excluded.provider_url,
        amount_detail=excluded.amount_detail,deadline_date=excluded.deadline_date,
        field_of_study=excluded.field_of_study,nationality_listing=excluded.nationality_listing,
        study_level=excluded.study_level,brazil_criteria=excluded.brazil_criteria,
        destinations=excluded.destinations,country_basis=excluded.country_basis,
        fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.title, record.summary, record.source_url, record.provider_url,
      record.amount_detail, record.deadline_date, record.field_of_study, record.nationality_listing,
      record.study_level, record.brazil_criteria, record.destinations, record.country_basis,
      payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} registros públicos EFG Finland importados/atualizados.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
