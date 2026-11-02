import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { test } from 'node:test'

if (process.env.ACCOUNT_API_URL) {
  test('documentos ficam privados, podem ser baixados e excluídos', async () => {
    const origin = process.env.ACCOUNT_API_URL
    const password = 'senha longa exclusiva de teste'
    const accounts = []
    async function call(path, cookie = '', method = 'GET', body, headers = {}) {
      return fetch(`${origin}${path}`, {
        method, body,
        headers:{ Origin:origin, ...(cookie ? { Cookie:cookie } : {}), ...headers },
      })
    }
    async function register() {
      const response = await call('/api/account/register', '', 'POST', JSON.stringify({
        displayName:'Teste Documentos', email:`documentos-${randomUUID()}@example.test`, password,
      }), { 'Content-Type':'application/json' })
      assert.equal(response.status, 201)
      const cookie = response.headers.get('set-cookie').split(';')[0]
      accounts.push(cookie)
      return cookie
    }
    try {
      assert.equal((await call('/api/account/documents')).status, 401)
      const owner = await register()
      const other = await register()
      const empty = await (await call('/api/account/documents', owner)).json()
      assert.deepEqual(empty.documents, [])
      const content = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF\n')
      const headers = { 'Content-Type':'application/pdf', 'X-Document-Name':encodeURIComponent('Histórico traduzido.pdf'), 'X-Document-Category':'traducao' }
      const invalid = await call('/api/account/documents', owner, 'POST', Buffer.from('não é PDF'), headers)
      assert.equal(invalid.status, 415)
      const uploaded = await call('/api/account/documents', owner, 'POST', content, headers)
      assert.equal(uploaded.status, 201)
      const document = (await uploaded.json()).document
      assert.equal(document.fileName, 'Histórico traduzido.pdf')
      assert.equal(document.category, 'traducao')
      const list = await (await call('/api/account/documents', owner)).json()
      assert.equal(list.documents.length, 1)
      assert.equal('content' in list.documents[0], false)
      const downloadPath = `/api/account/documents/${document.id}/download`
      assert.equal((await call(downloadPath, other)).status, 404)
      const downloaded = await call(downloadPath, owner)
      assert.equal(downloaded.status, 200)
      assert.match(downloaded.headers.get('content-disposition'), /^attachment;/)
      assert.deepEqual(Buffer.from(await downloaded.arrayBuffer()), content)
      assert.equal((await call(`/api/account/documents/${document.id}`, other, 'DELETE')).status, 404)
      assert.equal((await call(`/api/account/documents/${document.id}`, owner, 'DELETE')).status, 200)
      assert.equal((await call(downloadPath, owner)).status, 404)
    } finally {
      for (const cookie of accounts) {
        await call('/api/account/me', cookie, 'DELETE', JSON.stringify({ password }), { 'Content-Type':'application/json' }).catch(() => {})
      }
    }
  })
}
