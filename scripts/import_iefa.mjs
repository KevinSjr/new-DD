import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path) throw new Error('Informe o caminho do JSON coletado.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'iefa' || payload.filter !== 'Brazil' || !Array.isArray(payload.records) ||
    payload.records.length !== payload.reported_total ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Arquivo de coleta inválido ou incompleto.')
const client = await database().connect()
let inserted = 0
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    if (!/^\d+$/.test(record.id) || !record.url.startsWith(`https://www.iefa.org/scholarships/${record.id}/`)) throw new Error(`Registro inválido: ${record.id}`)
    const result = await client.query(`INSERT INTO scholarship_imports
      (source,source_id,source_url,title,field_of_study,description_excerpt,nationality_listing,host_countries_listing,source_filter,fetched_at)
      VALUES ('iefa',$1,$2,$3,$4,$5,$6,$7,'Brazil',$8)
      ON CONFLICT (source,source_id) DO UPDATE SET
        title=excluded.title,field_of_study=excluded.field_of_study,description_excerpt=excluded.description_excerpt,
        nationality_listing=excluded.nationality_listing,host_countries_listing=excluded.host_countries_listing,
        fetched_at=excluded.fetched_at,updated_at=now()
      RETURNING id`, [record.id,record.url,record.title,record.field,record.description,record.nationality,record.host_countries,payload.fetched_at])
    inserted += result.rowCount
  }
  await client.query('COMMIT')
  console.log(`${inserted} registros IEFA importados/atualizados como listados no catálogo.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await database().end() }
