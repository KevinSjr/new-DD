import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo do Study in Japan.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'study_japan' || !Array.isArray(payload.records) ||
    payload.reported_total !== payload.records.length ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta inválida ou incompleta.')

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    if (!/^[0-9-]+$/.test(record.id) ||
        record.url !== `https://www.studyinjapan.go.jp/en/search-for-scholarships/detail.php?lang=en&mid=${record.id}` ||
        !record.title || typeof record.organization !== 'string' ||
        !Array.isArray(record.study_levels) || !Array.isArray(record.support_types) ||
        [...record.study_levels, ...record.support_types].some(value => typeof value !== 'string') ||
        ['description', 'amount', 'deadline', 'fields_of_study', 'specific_countries', 'designated_regions']
          .some(key => typeof record[key] !== 'string') ||
        typeof record.brazil_mentioned !== 'boolean' ||
        (record.application_url && !/^https?:\/\//.test(record.application_url))) {
      throw new Error(`Registro Study in Japan inválido: ${record.id}`)
    }
    await client.query(`INSERT INTO study_japan_imports
      (source_id,source_url,title,organization,description_excerpt,support_types,amount_detail,
       deadline_text,fields_of_study,nationality_listing,designated_regions,study_levels,
       application_url,brazil_mentioned,source_updated_at,fetched_at,translated_note)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      ON CONFLICT (source_id) DO UPDATE SET
        source_url=excluded.source_url,title=excluded.title,organization=excluded.organization,
        description_excerpt=excluded.description_excerpt,support_types=excluded.support_types,
        amount_detail=excluded.amount_detail,deadline_text=excluded.deadline_text,
        fields_of_study=excluded.fields_of_study,nationality_listing=excluded.nationality_listing,
        designated_regions=excluded.designated_regions,study_levels=excluded.study_levels,
        application_url=excluded.application_url,brazil_mentioned=excluded.brazil_mentioned,
        source_updated_at=excluded.source_updated_at,fetched_at=excluded.fetched_at,
        translated_note=excluded.translated_note,updated_at=now()`,
    [record.id, record.url, record.title, record.organization, record.description,
      record.support_types.join(', '), record.amount, record.deadline, record.fields_of_study,
      record.specific_countries, record.designated_regions, record.study_levels.join(', '),
      record.application_url || null, record.brazil_mentioned, record.source_updated_at || null,
      payload.fetched_at, Boolean(record.source_original_amount)])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} registros Study in Japan importados/atualizados.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
