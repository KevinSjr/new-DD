import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { database } from '../server/db.mjs'

const client = await database().connect()
try {
  await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())')
  const files = (await readdir('db/migrations')).filter(file => /^\d+_.*\.sql$/.test(file)).sort()
  for (const file of files) {
    const exists = await client.query('SELECT 1 FROM schema_migrations WHERE version = $1', [file])
    if (exists.rowCount) continue
    await client.query('BEGIN')
    try {
      await client.query(await readFile(join('db/migrations', file), 'utf8'))
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file])
      await client.query('COMMIT')
      console.log(`Migração aplicada: ${file}`)
    } catch (error) { await client.query('ROLLBACK'); throw error }
  }
} finally { client.release(); await database().end() }
