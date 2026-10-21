import { readFile } from 'node:fs/promises'
import { database } from '../server/db.mjs'

const path = process.argv[2]
if (!path || path.endsWith('.partial.json')) throw new Error('Informe o JSON completo das bolsas espanholas.')
const payload = JSON.parse(await readFile(path, 'utf8'))
if (payload.source !== 'spain_administration' || payload.filter?.pag_idTipo !== '2' ||
    !Array.isArray(payload.records) || payload.reported_total !== payload.records.length ||
    new Set(payload.records.map(record => record.id)).size !== payload.records.length ||
    Number.isNaN(Date.parse(payload.fetched_at))) throw new Error('Coleta inválida ou incompleta.')

const pool = database()
const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const record of payload.records) {
    const expectedUrl = `https://administracion.gob.es/ayudas/buscador-becas-avanzado/detalle-de-ayuda--subvencion--beca-o-premio?idRegistro=${record.id}&selectorServicio=buscadorBecasAvanzado`
    if (!/^\d+$/.test(record.id) || record.url !== expectedUrl || !record.title ||
        ['title', 'organization', 'geographic_scope', 'beneficiaries', 'application_details', 'amount_detail']
          .some(field => typeof record[field] !== 'string') ||
        ['deadline_start', 'deadline_end', 'publication_date'].some(field => record[field] !== null && !/^\d{4}-\d{2}-\d{2}$/.test(record[field])) ||
        typeof record.deadline_invalid !== 'boolean' ||
        (record.official_notice_url !== null && !/^https:\/\//.test(record.official_notice_url)) ||
        record.translation_method !== 'machine') {
      throw new Error(`Registro espanhol inválido: ${record.id}`)
    }
    await client.query(`INSERT INTO spain_administration_imports
      (source_id,source_url,title,organization,geographic_scope,beneficiaries,
       application_details,amount_detail,deadline_start,deadline_end,deadline_invalid,publication_date,
       official_notice_url,translation_method,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (source_id) DO UPDATE SET
       source_url=excluded.source_url,title=excluded.title,organization=excluded.organization,
       geographic_scope=excluded.geographic_scope,beneficiaries=excluded.beneficiaries,
       application_details=excluded.application_details,amount_detail=excluded.amount_detail,
       deadline_start=excluded.deadline_start,deadline_end=excluded.deadline_end,
       deadline_invalid=excluded.deadline_invalid,
       publication_date=excluded.publication_date,official_notice_url=excluded.official_notice_url,
       translation_method=excluded.translation_method,fetched_at=excluded.fetched_at,updated_at=now()`,
    [record.id, record.url, record.title, record.organization, record.geographic_scope,
      record.beneficiaries, record.application_details, record.amount_detail,
      record.deadline_start, record.deadline_end, record.deadline_invalid, record.publication_date,
      record.official_notice_url, record.translation_method, payload.fetched_at])
  }
  await client.query('COMMIT')
  console.log(`${payload.records.length} bolsas do portal espanhol importadas/atualizadas.`)
} catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release(); await pool.end() }
