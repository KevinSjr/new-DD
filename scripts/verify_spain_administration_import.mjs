import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const payload = JSON.parse(await readFile(process.argv[2], 'utf8'))
const pool = database()
try {
  const { rows: [row] } = await pool.query(`SELECT count(*)::integer AS total,
    count(*) FILTER (WHERE catalog_status = 'listed')::integer AS listed,
    count(*) FILTER (WHERE deadline_end IS NOT NULL)::integer AS with_deadline,
    count(*) FILTER (WHERE deadline_end < CURRENT_DATE)::integer AS past_deadline,
    count(*) FILTER (WHERE official_notice_url IS NOT NULL)::integer AS with_notice
    FROM spain_administration_imports`)
  console.log(JSON.stringify(row, null, 2))
  if (row.total !== payload.reported_total || row.listed !== payload.reported_total ||
      row.with_deadline !== payload.records.filter(record => record.deadline_end).length ||
      row.with_notice !== payload.records.filter(record => record.official_notice_url).length) process.exitCode = 1
} finally { await pool.end() }
