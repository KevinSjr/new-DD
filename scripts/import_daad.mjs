import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo da coleta DAAD.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'daad' || !Array.isArray(payload.records) ||
    payload.reported_total !== payload.records.length ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    !Number.isSafeInteger(payload.brazil_origin_filter_id) ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Arquivo de coleta inválido ou incompleto.')

const validSourceUrl = record => {
  try {
    const url = new URL(record.url)
    return url.protocol === 'https:' && url.hostname === 'www2.daad.de' &&
      url.pathname === '/deutschland/stipendium/datenbank/en/21148-scholarship-database/' &&
      url.searchParams.get('detail') === record.id &&
      (!record.brazil_listed || url.searchParams.get('origin') === String(payload.brazil_origin_filter_id)) &&
      [...url.searchParams.keys()].every(key => ['detail', 'origin'].includes(key)) && !url.hash
  } catch { return false }
}

const client = await database().connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    if (!/^\d+$/.test(record.id) || !Number.isSafeInteger(Number(record.id)) || !validSourceUrl(record) ||
        !record.title || typeof record.title !== 'string' ||
        typeof record.is_daad !== 'boolean' || typeof record.brazil_listed !== 'boolean' ||
        !Number.isSafeInteger(record.origin_count) || record.origin_count < 0 ||
        !Array.isArray(record.study_levels) || !Array.isArray(record.fields_of_study) ||
        !Array.isArray(record.purposes) ||
        [...record.study_levels, ...record.fields_of_study, ...record.purposes].some(item => typeof item !== 'string') ||
        ['description', 'deadline_brazil', 'deadline_general', 'deadline_detail', 'amount_detail']
          .some(key => typeof record[key] !== 'string')) throw new Error(`Registro DAAD inválido: ${record.id}`)
    await client.query(`INSERT INTO daad_imports
      (source_id,source_url,title,description_excerpt,is_daad,brazil_listed,origin_count,
       study_levels,fields_of_study,purposes,deadline_brazil,deadline_general,
       deadline_detail,amount_detail,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (source_id) DO UPDATE SET
        source_url=excluded.source_url,title=excluded.title,description_excerpt=excluded.description_excerpt,
        is_daad=excluded.is_daad,brazil_listed=excluded.brazil_listed,origin_count=excluded.origin_count,
        study_levels=excluded.study_levels,fields_of_study=excluded.fields_of_study,
        purposes=excluded.purposes,deadline_brazil=excluded.deadline_brazil,
        deadline_general=excluded.deadline_general,deadline_detail=excluded.deadline_detail,
        amount_detail=excluded.amount_detail,fetched_at=excluded.fetched_at,updated_at=now()`,
    [Number(record.id), record.url, record.title, record.description, record.is_daad,
      record.brazil_listed, record.origin_count, record.study_levels.join(', '),
      record.fields_of_study.join(', '), record.purposes.join(', '), record.deadline_brazil,
      record.deadline_general, record.deadline_detail, record.amount_detail, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} programas DAAD importados/atualizados como listados no catálogo.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await database().end() }
