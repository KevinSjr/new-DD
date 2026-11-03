import { database } from './db.mjs'
import { scholarshipCatalogItem, savedScholarshipCatalog } from './scholarshipCatalog.mjs'
import { recordAchievementEvent } from './achievements.mjs'

const fail = (status, message) => { throw Object.assign(new Error(message), { status }) }
const validKey = (value, limit) => typeof value === 'string' && value.length > 0 && value.length <= limit && !/[\x00-\x1f\x7f]/.test(value)

export async function handleSavedScholarshipsRequest(req, res, userId, url, { json, body }) {
  if (url.pathname !== '/api/account/saved-scholarships') return false
  const pool = database()
  if (req.method === 'GET') {
    json(res, 200, { items:await savedScholarshipCatalog(pool, userId) })
    return true
  }
  if (req.method === 'POST') {
    const input = await body(req)
    if (!validKey(input?.source, 80) || !validKey(input?.sourceId, 200)) fail(400, 'Identificador da bolsa inválido.')
    const item = await scholarshipCatalogItem(pool, input.source, input.sourceId)
    if (!item) fail(404, 'Esta bolsa não está disponível no catálogo.')
    const result = await pool.query(`INSERT INTO user_saved_scholarships
      (user_id,source,source_id,title,source_label,source_url) VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (user_id,source,source_id) DO UPDATE SET
        title=EXCLUDED.title,source_label=EXCLUDED.source_label,source_url=EXCLUDED.source_url
      RETURNING source,source_id,title,source_label,source_url,saved_at`,
    [userId,item.source,item.source_id,item.title,item.source_label,item.source_url])
    await recordAchievementEvent(userId,{ kind:'sch-save', target:`${item.source}:${item.source_id}`, details:{} })
    json(res, 200, { item:result.rows[0] })
    return true
  }
  if (req.method === 'DELETE') {
    const source = url.searchParams.get('source')
    const sourceId = url.searchParams.get('sourceId')
    if (!validKey(source, 80) || !validKey(sourceId, 200)) fail(400, 'Identificador da bolsa inválido.')
    await pool.query('DELETE FROM user_saved_scholarships WHERE user_id=$1 AND source=$2 AND source_id=$3', [userId,source,sourceId])
    json(res, 200, { deleted:true })
    return true
  }
  return false
}
