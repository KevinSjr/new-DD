import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path) throw new Error('Informe o JSON de coleta para comparação.')
const payload = JSON.parse(await readFile(path, 'utf8'))
const pool = database()
try {
  const result = await pool.query(`SELECT count(*)::integer AS total,
    count(DISTINCT source_id)::integer AS unique_ids,
    count(*) FILTER (WHERE review_status = 'pending')::integer AS pending,
    count(*) FILTER (WHERE brazil_mentioned)::integer AS brazil_mentioned,
    count(*) FILTER (WHERE listing_status = 'open')::integer AS open_count
    FROM scholarship_america_imports`)
  const counts = result.rows[0]
  console.log(JSON.stringify(counts, null, 2))
  if (counts.total !== payload.reported_total || counts.unique_ids !== payload.reported_total ||
      counts.pending !== payload.reported_total ||
      counts.brazil_mentioned !== payload.records.filter(record => record.brazil_mentioned).length ||
      counts.open_count !== payload.records.filter(record => record.listing_status === 'open').length) process.exitCode = 1
} finally { await pool.end() }
