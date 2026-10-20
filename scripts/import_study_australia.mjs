import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo da coleta.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'study_australia' || !Array.isArray(payload.records) ||
    payload.reported_total !== payload.records.length ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Arquivo de coleta inválido ou incompleto.')

const validNumber = value => value == null || (typeof value === 'number' && Number.isFinite(value) && value >= 0)
const validBoolean = value => value == null || typeof value === 'boolean'
const providerUrl = value => value?.startsWith('www.') ? `https://${value}` : value || null
const validSourceUrl = record => {
  try {
    const url = new URL(record.url)
    return url.protocol === 'https:' && url.hostname === 'search.studyaustralia.gov.au' &&
      url.pathname.startsWith('/scholarship/') && url.pathname.endsWith(`/${record.id}`) &&
      !url.search && !url.hash
  } catch { return false }
}
const client = await database().connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    const nationality = record.nationality?.name || record.nationality_label || ''
    if (!/^[a-f0-9]{32}$/.test(record.id) ||
        !validSourceUrl(record) ||
        !record.title || typeof record.title !== 'string' ||
        !validNumber(record.amount_annual) || !validNumber(record.amount_max) ||
        !validBoolean(record.international_students) || !validBoolean(record.australian_students) ||
        !validBoolean(record.tenable_overseas) ||
        !Array.isArray(record.providers) || !Array.isArray(record.study_levels) ||
        !Array.isArray(record.fields_of_study) ||
        [...record.providers, ...record.study_levels, ...record.fields_of_study].some(item => typeof item !== 'string') ||
        (providerUrl(record.provider_url) && !/^https?:\/\//.test(providerUrl(record.provider_url)))) throw new Error(`Registro inválido: ${record.id}`)
    await client.query(`INSERT INTO study_australia_imports
      (source_id,source_url,title,description_excerpt,eligibility_text,providers,deadline_text,
       amount_annual,amount_max,amount_comment,nationality_listing,international_students,
       australian_students,tenable_overseas,study_levels,fields_of_study,provider_url,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      ON CONFLICT (source_id) DO UPDATE SET
        source_url=excluded.source_url,title=excluded.title,description_excerpt=excluded.description_excerpt,
        eligibility_text=excluded.eligibility_text,providers=excluded.providers,deadline_text=excluded.deadline_text,
        amount_annual=excluded.amount_annual,amount_max=excluded.amount_max,amount_comment=excluded.amount_comment,
        nationality_listing=excluded.nationality_listing,international_students=excluded.international_students,
        australian_students=excluded.australian_students,tenable_overseas=excluded.tenable_overseas,
        study_levels=excluded.study_levels,fields_of_study=excluded.fields_of_study,
        provider_url=excluded.provider_url,fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.url, record.title, record.description, record.eligibility,
      record.providers.join(', '), record.deadline, record.amount_annual, record.amount_max,
      record.amount_comment, nationality, record.international_students,
      record.australian_students, record.tenable_overseas, record.study_levels.join(', '),
      record.fields_of_study.join(', '), providerUrl(record.provider_url), payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} bolsas Study Australia importadas/atualizadas como listadas no catálogo.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await database().end() }
