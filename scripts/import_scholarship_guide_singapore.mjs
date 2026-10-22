import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo do Scholarship Guide.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'scholarship_guide_singapore' ||
    !payload.listing_url?.startsWith('https://www.scholarshipguide.com.sg/scholarship?') ||
    !payload.listing_url.includes('ScholarshipSearch%5Bnationality%5D=2') ||
    !Array.isArray(payload.records) || !payload.records.length ||
    payload.filtered_total !== payload.records.length + payload.excluded_by_destination ||
    !Number.isInteger(payload.pages) || payload.pages < 1 ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta incompleta ou inválida.')

const excludedTitles = new Set([
  'Various donated scholarships (NTU)', 'Various donated scholarships (NUS)',
  'Various donated scholarships (SIT)', 'Various donated scholarships (SMU)',
  'Various donated scholarships (SUTD)',
])
const included = payload.records.filter(record => !excludedTitles.has(record.title))
for (const record of payload.records) {
  if (!/^\d+$/.test(record.id) || !record.title ||
      !/^https:\/\/www[.]scholarshipguide[.]com[.]sg\/scholarship\/[a-z0-9-]+$/.test(record.source_url) ||
      !record.nationality_listing?.includes('Other Citizen') ||
      !record.locations?.split(',').map(value => value.trim()).includes('Singapore') ||
      !record.status_listing || !record.student_level ||
      !Number.isInteger(record.listing_page) || record.listing_page < 1 ||
      record.listing_page > payload.pages || !record.award_value) {
    throw new Error(`Registro inválido: ${record.id}`)
  }
}
const deadlineDate = record => {
  if (!record.status_listing.startsWith('Open Until ')) return null
  const detail = Date.parse(record.deadline_detail || '')
  const listing = Date.parse(record.status_listing.slice('Open Until '.length))
  if (Number.isNaN(detail) || Number.isNaN(listing) || detail !== listing) {
    throw new Error(`Prazo divergente ou inválido: ${record.id}`)
  }
  return new Date(detail).toISOString().slice(0, 10)
}

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of included) {
    await client.query(`INSERT INTO scholarship_guide_singapore_imports
      (source_id,title,source_url,description_listing,status_listing,student_level,
       nationality_listing,institutions,term,locations,listing_page,deadline_detail,
       deadline_date,course_of_study,award_value,requirements,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      ON CONFLICT (source_id) DO UPDATE SET title=excluded.title,source_url=excluded.source_url,
        description_listing=excluded.description_listing,status_listing=excluded.status_listing,
        student_level=excluded.student_level,nationality_listing=excluded.nationality_listing,
        institutions=excluded.institutions,term=excluded.term,locations=excluded.locations,
        listing_page=excluded.listing_page,deadline_detail=excluded.deadline_detail,
        deadline_date=excluded.deadline_date,course_of_study=excluded.course_of_study,
        award_value=excluded.award_value,requirements=excluded.requirements,
        fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.title, record.source_url, record.description_listing,
      record.status_listing, record.student_level, record.nationality_listing,
      record.institutions, record.term, record.locations, record.listing_page,
      record.deadline_detail, deadlineDate(record), record.course_of_study,
      record.award_value, record.requirements, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${included.length} oportunidades Scholarship Guide importadas; ${payload.records.length - included.length} páginas agregadoras excluídas.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
