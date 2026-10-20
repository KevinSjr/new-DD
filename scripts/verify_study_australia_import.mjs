import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path) throw new Error('Informe o JSON de coleta para comparação.')
const payload = JSON.parse(await readFile(path, 'utf8'))
const pool = database()
try {
  const result = await pool.query(`SELECT count(*)::integer AS total,
    count(DISTINCT source_id)::integer AS unique_ids,
    count(*) FILTER (WHERE catalog_status = 'listed')::integer AS listed,
    count(*) FILTER (WHERE international_students IS TRUE)::integer AS international,
    count(*) FILTER (WHERE nationality_listing ILIKE '%Brazil%')::integer AS brazil_listed,
    count(*) FILTER (WHERE tenable_overseas IS TRUE)::integer AS overseas
    FROM study_australia_imports`)
  const counts = result.rows[0]
  console.log(JSON.stringify(counts, null, 2))
  if (counts.total !== payload.reported_total || counts.unique_ids !== payload.reported_total ||
      counts.listed !== payload.reported_total ||
      counts.international !== payload.records.filter(record => record.international_students === true).length ||
      counts.brazil_listed !== payload.records.filter(record =>
        /Brazil/i.test(record.nationality?.name || record.nationality_label || '')).length ||
      counts.overseas !== payload.records.filter(record => record.tenable_overseas === true).length) process.exitCode = 1
} finally { await pool.end() }
