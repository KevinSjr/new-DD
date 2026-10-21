import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo da coleta Universitaly/MAECI.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'universitaly_maeci' ||
    payload.listing_url !== 'https://www.universitaly.it/en/borse-studio' ||
    !Array.isArray(payload.records) || payload.reported_total !== payload.records.length ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta inválida.')

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    if (!/^maeci-\d{4}-\d{4}$/.test(record.id) ||
        ['title', 'summary', 'study_levels', 'deadline_timezone'].some(field => !record[field] || typeof record[field] !== 'string') ||
        !/^https:\/\/www\.esteri\.it\//.test(record.source_url) ||
        !/^https:\/\/www\.esteri\.it\//.test(record.program_url) ||
        !/^https:\/\/www\.esteri\.it\//.test(record.eligible_countries_url) ||
        !/^https:\/\/studyinitaly\.esteri\.it\//.test(record.application_url) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(record.deadline_date) ||
        !Number.isInteger(record.amount_regular_eur) || !Number.isInteger(record.amount_language_eur) ||
        typeof record.brazil_listed !== 'boolean') throw new Error(`Registro MAECI inválido: ${record.id}`)
    await client.query(`INSERT INTO italy_maeci_imports
      (source_id,title,summary,source_url,program_url,application_url,eligible_countries_url,
       deadline_date,deadline_timezone,amount_regular_eur,amount_language_eur,study_levels,brazil_listed,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (source_id) DO UPDATE SET
        title=excluded.title,summary=excluded.summary,source_url=excluded.source_url,
        program_url=excluded.program_url,application_url=excluded.application_url,
        eligible_countries_url=excluded.eligible_countries_url,deadline_date=excluded.deadline_date,
        deadline_timezone=excluded.deadline_timezone,amount_regular_eur=excluded.amount_regular_eur,
        amount_language_eur=excluded.amount_language_eur,study_levels=excluded.study_levels,
        brazil_listed=excluded.brazil_listed,fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.title, record.summary, record.source_url, record.program_url,
      record.application_url, record.eligible_countries_url, record.deadline_date,
      record.deadline_timezone, record.amount_regular_eur, record.amount_language_eur,
      record.study_levels, record.brazil_listed, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} chamada MAECI vinculada pelo Universitaly importada/atualizada.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
