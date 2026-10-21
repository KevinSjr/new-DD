import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo do Global Admissions.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'global_admissions_belgium' ||
    payload.listing_url !== 'https://www.globaladmissions.com/scholarships-for/brazil/belgium' ||
    !Array.isArray(payload.records) || payload.records.length === 0 ||
    payload.reported_total !== payload.records.length || Number.isNaN(Date.parse(payload.fetched_at)) ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length) {
  throw new Error('Coleta Global Admissions Bélgica inválida ou incompleta.')
}
for (const record of payload.records) {
  if (!/^[a-z0-9-]+$/.test(record.id) || !record.title ||
      record.source_url !== `https://www.globaladmissions.com/scholarship/${record.id}` ||
      (record.provider_url !== null && !/^https:\/\//.test(record.provider_url)) ||
      !record.coverage_listing || !record.study_level || !record.funder_type ||
      !record.deadline_listing || record.destination_listing !== 'Belgium' ||
      typeof record.open_to_all_listing !== 'boolean' ||
      (record.nationality_detail !== null && typeof record.nationality_detail !== 'string') ||
      (record.deadline_detail !== null && typeof record.deadline_detail !== 'string')) {
    throw new Error(`Registro Global Admissions inválido: ${record.id}`)
  }
}

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    await client.query(`INSERT INTO global_admissions_belgium_imports
      (source_id,title,source_url,provider_url,coverage_listing,study_level,funder_type,
       deadline_listing,deadline_detail,destination_listing,open_to_all_listing,nationality_detail,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (source_id) DO UPDATE SET title=excluded.title,source_url=excluded.source_url,
        provider_url=excluded.provider_url,coverage_listing=excluded.coverage_listing,
        study_level=excluded.study_level,funder_type=excluded.funder_type,
        deadline_listing=excluded.deadline_listing,deadline_detail=excluded.deadline_detail,
        destination_listing=excluded.destination_listing,open_to_all_listing=excluded.open_to_all_listing,
        nationality_detail=excluded.nationality_detail,fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.title, record.source_url, record.provider_url,
      record.coverage_listing, record.study_level, record.funder_type,
      record.deadline_listing, record.deadline_detail, record.destination_listing,
      record.open_to_all_listing, record.nationality_detail, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} bolsas Global Admissions Bélgica importadas/atualizadas.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
