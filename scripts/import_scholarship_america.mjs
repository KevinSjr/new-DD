import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path) throw new Error('Informe o caminho do JSON coletado.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'scholarship_america' || !Array.isArray(payload.records) ||
    payload.records.length !== payload.reported_total ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Arquivo de coleta inválido ou incompleto.')

const client = await database().connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    if (!Number.isSafeInteger(record.id) || record.id < 1 ||
        !/^https:\/\/scholarshipamerica\.org\/scholarship\/[a-z0-9_-]+\/$/.test(record.url) ||
        !record.title || !['open', 'closed', 'unknown'].includes(record.listing_status) ||
        typeof record.brazil_mentioned !== 'boolean' || !Array.isArray(record.study_levels) ||
        record.study_levels.some(level => typeof level !== 'string')) throw new Error(`Registro inválido: ${record.id}`)
    await client.query(`INSERT INTO scholarship_america_imports
      (source_id,source_url,title,description_excerpt,eligibility_text,award_amount,listing_status,
       open_date,close_date,date_timezone,brazil_mentioned,fetched_at,study_levels)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (source_id) DO UPDATE SET
        source_url=excluded.source_url,title=excluded.title,description_excerpt=excluded.description_excerpt,
        eligibility_text=excluded.eligibility_text,award_amount=excluded.award_amount,
        listing_status=excluded.listing_status,open_date=excluded.open_date,close_date=excluded.close_date,
        date_timezone=excluded.date_timezone,brazil_mentioned=excluded.brazil_mentioned,
        fetched_at=excluded.fetched_at,study_levels=excluded.study_levels,updated_at=now()`,
    [record.id,record.url,record.title,record.description,record.eligibility,record.award_amount,
      record.listing_status,record.open_date,record.close_date,record.date_timezone,
      record.brazil_mentioned,payload.fetched_at,record.study_levels.join(', ')])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} registros da Scholarship America importados/atualizados como listados no catálogo.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await database().end() }
