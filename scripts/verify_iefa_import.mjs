import { database } from '../server/db.mjs'

const pool = database()
try {
  const counts = await pool.query(`SELECT count(*)::integer AS total,
    count(DISTINCT source_id)::integer AS unique_ids,
    count(*) FILTER (WHERE review_status = 'pending')::integer AS pending,
    count(*) FILTER (WHERE review_status <> 'pending')::integer AS other
    FROM scholarship_imports WHERE source = 'iefa'`)
  const migrations = await pool.query('SELECT version FROM schema_migrations ORDER BY version')
  const published = await pool.query("SELECT count(*)::integer AS total FROM scholarships WHERE status = 'published' AND deleted_at IS NULL")
  console.log(JSON.stringify({ imports: counts.rows[0], migrations: migrations.rows.map(row => row.version), publishedScholarships: published.rows[0].total }, null, 2))
  if (counts.rows[0].total !== 1203 || counts.rows[0].unique_ids !== 1203 || counts.rows[0].pending !== 1203) process.exitCode = 1
} finally { await pool.end() }
