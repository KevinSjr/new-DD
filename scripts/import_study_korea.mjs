import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo do Study in Korea.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'study_korea' || !Array.isArray(payload.records) ||
    payload.reported_total !== payload.records.length ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta inválida ou incompleta.')

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    if (!/^(SCL_)?\d+$/.test(record.id) || !/^\d+$/.test(record.university_id) ||
        record.url !== `https://www.studyinkorea.go.kr/ko/search/universityInfo.do?tab=univ-basic-info&univCd=${record.university_id}&scholarshipId=${record.id}` ||
        !record.title || !record.institution ||
        ['title', 'institution', 'location', 'listing_eligibility', 'qualifications', 'benefits', 'personal_support']
          .some(field => typeof record[field] !== 'string') ||
        (record.source_updated_at !== null && !/^\d{4}-\d{2}-\d{2}$/.test(record.source_updated_at)) ||
        !['source_en', 'machine'].includes(record.translation_method)) {
      throw new Error(`Registro Study in Korea inválido: ${record.id}`)
    }
    await client.query(`INSERT INTO study_korea_imports
      (source_id,source_url,university_id,title,institution,location,listing_eligibility,
       qualifications,benefits,personal_support,source_updated_at,translation_method,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (source_id) DO UPDATE SET
       source_url=excluded.source_url,university_id=excluded.university_id,title=excluded.title,
       institution=excluded.institution,location=excluded.location,
       listing_eligibility=excluded.listing_eligibility,qualifications=excluded.qualifications,
       benefits=excluded.benefits,personal_support=excluded.personal_support,
       source_updated_at=excluded.source_updated_at,translation_method=excluded.translation_method,
       fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.url, record.university_id, record.title, record.institution, record.location,
      record.listing_eligibility, record.qualifications, record.benefits, record.personal_support,
      record.source_updated_at, record.translation_method, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} bolsas Study in Korea importadas/atualizadas.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
