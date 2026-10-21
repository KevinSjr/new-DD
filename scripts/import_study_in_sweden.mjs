import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo do Study in Sweden.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'study_in_sweden' || payload.listing_url !== 'https://studyinsweden.se/scholarships/' ||
    !Array.isArray(payload.records) || payload.reported_total !== payload.records.length ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta Study in Sweden inválida.')

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    if (!/^\d+$/.test(record.id) || !record.title ||
        !['University scholarships', 'Other scholarships', 'Swedish Institute scholarships'].includes(record.category) ||
        typeof record.university !== 'string' || !Array.isArray(record.regions) ||
        record.regions.some(region => typeof region !== 'string') ||
        !/^https?:\/\//.test(record.original_provider_url) ||
        (record.provider_url !== null && !/^https:\/\//.test(record.provider_url)) ||
        (record.source_modified_at !== null && Number.isNaN(Date.parse(record.source_modified_at)))) {
      throw new Error(`Registro Study in Sweden inválido: ${record.id}`)
    }
    await client.query(`INSERT INTO study_in_sweden_imports
      (source_id,title,category,university,regions_listing,original_provider_url,provider_url,source_modified_at,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (source_id) DO UPDATE SET title=excluded.title,category=excluded.category,
        university=excluded.university,regions_listing=excluded.regions_listing,
        original_provider_url=excluded.original_provider_url,provider_url=excluded.provider_url,
        source_modified_at=excluded.source_modified_at,fetched_at=excluded.fetched_at,updated_at=now()`,
    [Number(record.id), record.title, record.category, record.university, record.regions.join(', '),
      record.original_provider_url, record.provider_url, record.source_modified_at, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} registros Study in Sweden importados/atualizados.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
