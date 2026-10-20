import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path) throw new Error('Informe o JSON de coleta DAAD para comparação.')
const payload = JSON.parse(await readFile(path, 'utf8'))
const pool = database()
try {
  const result = await pool.query(`SELECT count(*)::integer AS total,
    count(DISTINCT source_id)::integer AS unique_ids,
    count(*) FILTER (WHERE catalog_status = 'listed')::integer AS listed,
    count(*) FILTER (WHERE brazil_listed)::integer AS brazil_listed,
    count(*) FILTER (WHERE is_daad)::integer AS daad_programmes,
    count(*) FILTER (WHERE amount_detail <> '')::integer AS with_amount,
    count(*) FILTER (WHERE deadline_brazil <> '' OR deadline_detail <> '' OR deadline_general <> '')::integer AS with_deadline
    FROM daad_imports`)
  const counts = result.rows[0]
  console.log(JSON.stringify(counts, null, 2))
  if (counts.total !== payload.reported_total || counts.unique_ids !== payload.reported_total ||
      counts.listed !== payload.reported_total ||
      counts.brazil_listed !== payload.records.filter(record => record.brazil_listed).length ||
      counts.daad_programmes !== payload.records.filter(record => record.is_daad).length ||
      counts.with_amount !== payload.records.filter(record => record.amount_detail).length ||
      counts.with_deadline !== payload.records.filter(record =>
        record.deadline_brazil || record.deadline_detail || record.deadline_general).length) process.exitCode = 1
} finally { await pool.end() }
