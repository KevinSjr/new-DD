import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo da coleta suíça.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'swiss_excellence' ||
    payload.listing_url !== 'https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships-at-a-glance' ||
    !Array.isArray(payload.records) || payload.reported_total !== payload.records.length ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta suíça inválida.')

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    if (!/^(research-fellowship|phd)-\d{4}-\d{4}-brazil$/.test(record.id) ||
        ['title', 'summary', 'edition', 'deadline_timezone', 'duration', 'study_level', 'field_of_study']
          .some(field => typeof record[field] !== 'string' || !record[field].trim()) ||
        !/^https:\/\/www\.sbfi\.admin\.ch\//.test(record.source_url) ||
        !/^https:\/\/www\.sbfi\.admin\.ch\//.test(record.country_details_url) ||
        !/^https:\/\/www\.go\.eskas\.ch\//.test(record.application_url) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(record.opening_date) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(record.deadline_date) ||
        !Number.isInteger(record.amount_monthly_chf) || record.amount_monthly_chf <= 0 ||
        typeof record.brazil_listed !== 'boolean') throw new Error(`Registro suíço inválido: ${record.id}`)
    await client.query(`INSERT INTO swiss_excellence_imports
      (source_id,title,summary,edition,source_url,country_details_url,application_url,opening_date,
       deadline_date,deadline_timezone,amount_monthly_chf,duration,study_level,field_of_study,brazil_listed,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT (source_id) DO UPDATE SET
        title=excluded.title,summary=excluded.summary,edition=excluded.edition,
        source_url=excluded.source_url,country_details_url=excluded.country_details_url,
        application_url=excluded.application_url,opening_date=excluded.opening_date,
        deadline_date=excluded.deadline_date,deadline_timezone=excluded.deadline_timezone,
        amount_monthly_chf=excluded.amount_monthly_chf,duration=excluded.duration,
        study_level=excluded.study_level,field_of_study=excluded.field_of_study,
        brazil_listed=excluded.brazil_listed,fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.title, record.summary, record.edition, record.source_url,
      record.country_details_url, record.application_url, record.opening_date,
      record.deadline_date, record.deadline_timezone, record.amount_monthly_chf,
      record.duration, record.study_level, record.field_of_study, record.brazil_listed,
      payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} modalidades suíças importadas/atualizadas.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
