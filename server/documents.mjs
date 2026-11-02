import { database } from './db.mjs'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_DOCUMENTS = 20
const categories = new Set(['historico', 'diploma', 'traducao', 'recomendacao', 'certificado', 'curriculo', 'outro'])
const extensions = new Map([
  ['.pdf', 'application/pdf'],
  ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
])
const fail = (status, message) => { throw Object.assign(new Error(message), { status }) }

function documentRow(row) {
  return { id:row.id, fileName:row.file_name, category:row.category, mimeType:row.mime_type, sizeBytes:row.size_bytes, uploadedAt:row.uploaded_at }
}

function fileNameFromHeader(value) {
  if (typeof value !== 'string' || value.length > 600) fail(400, 'Nome do arquivo inválido.')
  let name
  try { name = decodeURIComponent(value) } catch { fail(400, 'Nome do arquivo inválido.') }
  name = name.trim()
  if (!name || name.length > 180 || /[\\/\x00-\x1f\x7f]/.test(name)) fail(400, 'Nome do arquivo inválido.')
  return name
}

function validSignature(mime, content) {
  if (mime === 'application/pdf') return content.subarray(0, 5).equals(Buffer.from('%PDF-'))
  if (mime === 'image/png') return content.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  if (mime === 'image/jpeg') return content.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
  if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return content.subarray(0, 4).equals(Buffer.from([80, 75, 3, 4])) && content.includes(Buffer.from('word/document.xml'))
  }
  return false
}

async function readUpload(req) {
  const declared = Number(req.headers['content-length'])
  if (Number.isFinite(declared) && declared > MAX_FILE_BYTES) fail(413, 'O arquivo deve ter no máximo 5 MB.')
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_FILE_BYTES) fail(413, 'O arquivo deve ter no máximo 5 MB.')
    chunks.push(chunk)
  }
  if (!size) fail(400, 'Escolha um arquivo para enviar.')
  return Buffer.concat(chunks, size)
}

export async function handleDocumentsRequest(req, res, userId, path, { json }) {
  if (path === '/api/account/documents') {
    if (req.method === 'GET') {
      const result = await database().query(`SELECT id::text,file_name,category,mime_type,size_bytes,uploaded_at
        FROM user_documents WHERE user_id=$1 ORDER BY uploaded_at DESC,id DESC`, [userId])
      json(res, 200, { documents:result.rows.map(documentRow), maxDocuments:MAX_DOCUMENTS, maxFileBytes:MAX_FILE_BYTES })
      return true
    }
    if (req.method === 'POST') {
      const fileName = fileNameFromHeader(req.headers['x-document-name'])
      const category = req.headers['x-document-category']
      const mime = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase()
      const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
      if (!categories.has(category)) fail(400, 'Escolha uma categoria válida.')
      if (extensions.get(extension) !== mime) fail(415, 'Envie um arquivo PDF, DOCX, PNG ou JPG.')
      const content = await readUpload(req)
      if (!validSignature(mime, content)) fail(415, 'O conteúdo do arquivo não corresponde ao formato informado.')
      const client = await database().connect()
      try {
        await client.query('BEGIN')
        await client.query('SELECT id FROM user_accounts WHERE id=$1 FOR UPDATE', [userId])
        const count = await client.query('SELECT count(*)::int AS total FROM user_documents WHERE user_id=$1', [userId])
        if (count.rows[0].total >= MAX_DOCUMENTS) fail(400, 'Você atingiu o limite de 20 documentos. Remova um antes de enviar outro.')
        const result = await client.query(`INSERT INTO user_documents (user_id,file_name,category,mime_type,size_bytes,content)
          VALUES ($1,$2,$3,$4,$5,$6) RETURNING id::text,file_name,category,mime_type,size_bytes,uploaded_at`,
        [userId,fileName,category,mime,content.length,content])
        await client.query('COMMIT')
        json(res, 201, { document:documentRow(result.rows[0]) })
      } catch (cause) { await client.query('ROLLBACK'); throw cause } finally { client.release() }
      return true
    }
  }

  const match = path.match(/^\/api\/account\/documents\/(\d+)(?:\/(download))?$/)
  if (!match) return false
  const id = match[1]
  if (req.method === 'GET' && match[2] === 'download') {
    const result = await database().query('SELECT file_name,mime_type,size_bytes,content FROM user_documents WHERE id=$1 AND user_id=$2', [id,userId])
    const row = result.rows[0]
    if (!row) fail(404, 'Documento não encontrado.')
    res.writeHead(200, {
      'Content-Type':row.mime_type,
      'Content-Length':row.size_bytes,
      'Content-Disposition':`attachment; filename="documento"; filename*=UTF-8''${encodeURIComponent(row.file_name)}`,
      'Cache-Control':'private, no-store',
      'X-Content-Type-Options':'nosniff',
      'Content-Security-Policy':"default-src 'none'; sandbox",
    })
    res.end(row.content)
    return true
  }
  if (req.method === 'DELETE' && !match[2]) {
    const result = await database().query('DELETE FROM user_documents WHERE id=$1 AND user_id=$2 RETURNING id', [id,userId])
    if (!result.rowCount) fail(404, 'Documento não encontrado.')
    json(res, 200, { deleted:true })
    return true
  }
  return false
}
