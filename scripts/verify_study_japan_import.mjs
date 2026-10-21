import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const payload = JSON.parse(await readFile(process.argv[2], 'utf8'))
const pool = database()
try {
  const result = await pool.query(`SELECT count(*)::integer AS total,
    count(*) FILTER (WHERE catalog_status = 'listed')::integer AS listed,
    count(*) FILTER (WHERE brazil_mentioned)::integer AS brazil_mentioned,
    count(*) FILTER (WHERE translated_note)::integer AS translated_notes,
    count(*) FILTER (WHERE amount_detail <> '')::integer AS with_amount,
    count(*) FILTER (WHERE deadline_text <> '')::integer AS with_deadline
    FROM study_japan_imports`)
  const row = result.rows[0]
  console.log(JSON.stringify(row, null, 2))
  if (row.total !== payload.reported_total || row.listed !== payload.reported_total ||
      row.brazil_mentioned !== payload.records.filter(record => record.brazil_mentioned).length ||
      row.translated_notes !== payload.records.filter(record => record.source_original_amount).length ||
      row.with_amount !== payload.records.filter(record => record.amount).length ||
      row.with_deadline !== payload.records.filter(record => record.deadline).length) process.exitCode = 1
} finally { await pool.end() }
