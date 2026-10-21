import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const payload = JSON.parse(await readFile(process.argv[2], 'utf8'))
const pool = database()
try {
  const result = await pool.query(`SELECT count(*)::integer AS total,
    count(*) FILTER (WHERE catalog_status = 'listed')::integer AS listed,
    count(*) FILTER (WHERE brazil_listed)::integer AS brazil_listed,
    count(*) FILTER (WHERE translation_method = 'machine')::integer AS translated
    FROM campusbourses_imports`)
  const row = result.rows[0]
  console.log(JSON.stringify(row, null, 2))
  if (row.total !== payload.reported_total || row.listed !== payload.reported_total ||
      row.brazil_listed !== payload.records.filter(record => record.brazil_listed).length ||
      row.translated !== payload.records.filter(record => record.translation_method === 'machine').length) process.exitCode = 1
} finally { await pool.end() }
