import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const payload = JSON.parse(await readFile(process.argv[2], 'utf8'))
const pool = database()
try {
  const { rows: [row] } = await pool.query(`SELECT count(*)::integer AS total,
    count(*) FILTER (WHERE catalog_status = 'listed')::integer AS listed,
    count(*) FILTER (WHERE benefits <> '' OR personal_support <> '')::integer AS with_amount,
    count(*) FILTER (WHERE translation_method = 'machine')::integer AS translated
    FROM study_korea_imports`)
  console.log(JSON.stringify(row, null, 2))
  if (row.total !== payload.reported_total || row.listed !== payload.reported_total ||
      row.with_amount !== payload.records.filter(r => r.benefits || r.personal_support).length ||
      row.translated !== payload.records.filter(r => r.translation_method === 'machine').length) process.exitCode = 1
} finally { await pool.end() }
