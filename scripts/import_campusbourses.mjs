import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo do CampusBourses.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'campusbourses' || !Array.isArray(payload.records) ||
    payload.reported_total !== payload.records.length ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta inválida ou incompleta.')

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    if (!Number.isSafeInteger(record.id) || record.id < 1 ||
        record.url !== `https://campusbourses.campusfrance.org/#/program/${record.id}&lang=en` ||
        !record.title || !record.summary ||
        !['source_en', 'machine'].includes(record.translation_method) ||
        typeof record.brazil_listed !== 'boolean' ||
        !Array.isArray(record.study_levels) || !Array.isArray(record.fields_of_study) ||
        !Array.isArray(record.nationalities) ||
        [...record.study_levels, ...record.fields_of_study, ...record.nationalities]
          .some(value => typeof value !== 'string') ||
        (record.translation_method === 'machine' && !record.source_original)) {
      throw new Error(`Registro CampusBourses inválido: ${record.id}`)
    }
    await client.query(`INSERT INTO campusbourses_imports
      (source_id,source_url,title,description_excerpt,amount_detail,deadline_date,
       study_levels,fields_of_study,nationality_listing,brazil_listed,translation_method,
       source_updated_at,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (source_id) DO UPDATE SET
        source_url=excluded.source_url,title=excluded.title,description_excerpt=excluded.description_excerpt,
        amount_detail=excluded.amount_detail,deadline_date=excluded.deadline_date,
        study_levels=excluded.study_levels,fields_of_study=excluded.fields_of_study,
        nationality_listing=excluded.nationality_listing,brazil_listed=excluded.brazil_listed,
        translation_method=excluded.translation_method,source_updated_at=excluded.source_updated_at,
        fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.url, record.title, record.summary, record.amount,
      record.deadline || null, record.study_levels.join(', '), record.fields_of_study.join(', '),
      record.nationalities.join(', '), record.brazil_listed, record.translation_method,
      record.source_updated_at || null, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} programas CampusBourses importados/atualizados.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
