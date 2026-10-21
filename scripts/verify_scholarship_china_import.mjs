import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const payload = JSON.parse(await readFile(process.argv[2], 'utf8'))
const pool = database()
try {
  const { rows: [row] } = await pool.query(`SELECT count(*)::integer AS total,
    count(*) FILTER (WHERE catalog_status = 'listed')::integer AS listed,
    count(*) FILTER (WHERE english_excerpt)::integer AS english_excerpt,
    count(*) FILTER (WHERE deadline_text <> '')::integer AS with_deadline,
    count(*) FILTER (WHERE tuition_after_scholarship <> '')::integer AS with_tuition
    FROM scholarship_china_imports`)
  console.log(JSON.stringify(row, null, 2))
  if (row.total !== payload.reported_total || row.listed !== payload.reported_total ||
      row.english_excerpt !== payload.records.filter(record => record.translation_method === 'source_en_extract').length ||
      row.with_deadline !== payload.records.filter(record => record.deadline_text).length ||
      row.with_tuition !== payload.records.filter(record => record.tuition_after_scholarship).length) process.exitCode = 1
} finally { await pool.end() }
