import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo do ScholarshipChina.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'scholarship_china' || !Array.isArray(payload.records) ||
    payload.reported_total !== payload.records.length ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta inválida ou incompleta.')

const fields = ['program_id', 'institution', 'city', 'province', 'field_of_study', 'study_level',
  'teaching_language', 'intake_season', 'scholarship_type', 'regular_tuition',
  'tuition_after_scholarship', 'regular_tuition_unit', 'tuition_after_unit',
  'accommodation_after_scholarship', 'deadline_text']
const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    if (!/^[0-9]+$/.test(record.id) ||
        record.url !== `https://scholarshipchina.com/scholarship/details?id=${record.id}` ||
        typeof record.title !== 'string' || !record.title.trim() ||
        fields.some(field => typeof record[field] !== 'string') ||
        (record.intake_year !== null && (!Number.isInteger(record.intake_year) || record.intake_year < 2000)) ||
        (record.deadline_date !== null && !/^\d{4}-\d{2}-\d{2}$/.test(record.deadline_date)) ||
        !['source_en', 'source_en_extract'].includes(record.translation_method)) {
      throw new Error(`Registro ScholarshipChina inválido: ${record.id}`)
    }
    await client.query(`INSERT INTO scholarship_china_imports
      (source_id,source_url,title,program_id,institution,city,province,field_of_study,
       study_level,teaching_language,intake_year,intake_season,scholarship_type,
       regular_tuition,tuition_after_scholarship,regular_tuition_unit,tuition_after_unit,
       accommodation_after_scholarship,deadline_text,deadline_date,english_excerpt,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
      ON CONFLICT (source_id) DO UPDATE SET
       source_url=excluded.source_url,title=excluded.title,program_id=excluded.program_id,
       institution=excluded.institution,city=excluded.city,province=excluded.province,
       field_of_study=excluded.field_of_study,study_level=excluded.study_level,
       teaching_language=excluded.teaching_language,intake_year=excluded.intake_year,
       intake_season=excluded.intake_season,scholarship_type=excluded.scholarship_type,
       regular_tuition=excluded.regular_tuition,tuition_after_scholarship=excluded.tuition_after_scholarship,
       regular_tuition_unit=excluded.regular_tuition_unit,tuition_after_unit=excluded.tuition_after_unit,
       accommodation_after_scholarship=excluded.accommodation_after_scholarship,
       deadline_text=excluded.deadline_text,deadline_date=excluded.deadline_date,
       english_excerpt=excluded.english_excerpt,
       fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.url, record.title, ...fields.map(field => record[field]).slice(0, 7),
      record.intake_year, ...fields.map(field => record[field]).slice(7), record.deadline_date,
      record.translation_method === 'source_en_extract', payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} programas ScholarshipChina importados/atualizados.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
