import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo do Study in Taiwan.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'study_taiwan' ||
    payload.listing_url !== 'https://www.studyintaiwan.org/how-to-apply/scholarship' ||
    !Array.isArray(payload.records) || !payload.records.length ||
    payload.records.length !== payload.reported_total ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta incompleta ou inválida.')

// The catalogue includes navigation/administrative entries that are not awards.
const excludedTitles = new Set([
  'Phased Payment of Tuition Fee',
  'Scholarships in School',
  'Scholarships out of School',
  'Regulations of the Office of International Affairs',
])
const included = payload.records.filter(record => !excludedTitles.has(record.title))
for (const record of payload.records) {
  if (!/^[0-9a-f]{24}$/.test(record.id) || !record.title || !record.source_title ||
      !record.institution || record.destination !== 'Taiwan' ||
      record.source_url !== (record.listing_page === 1
        ? payload.listing_url : `${payload.listing_url}?p=${record.listing_page}`) ||
      !Number.isInteger(record.listing_page) || record.listing_page < 1 ||
      record.listing_page > payload.pages ||
      (record.provider_url !== null && !/^https?:\/\//.test(record.provider_url))) {
    throw new Error(`Registro inválido: ${record.id}`)
  }
}

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of included) {
    await client.query(`INSERT INTO study_taiwan_imports
      (source_id,title,source_title,institution,institution_type,funding_category,sponsor_tag,
       destination,source_url,provider_url,listing_page,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      ON CONFLICT (source_id) DO UPDATE SET title=excluded.title,source_title=excluded.source_title,
        institution=excluded.institution,institution_type=excluded.institution_type,
        funding_category=excluded.funding_category,sponsor_tag=excluded.sponsor_tag,
        destination=excluded.destination,source_url=excluded.source_url,
        provider_url=excluded.provider_url,listing_page=excluded.listing_page,
        fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.title, record.source_title, record.institution,
      record.institution_type, record.funding_category, record.sponsor_tag,
      record.destination, record.source_url, record.provider_url,
      record.listing_page, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${included.length} registros Study in Taiwan importados; ${payload.records.length - included.length} itens administrativos/diretórios excluídos.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
