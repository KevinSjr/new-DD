import { createServer } from 'vite'

// A API compartilha o processo de desenvolvimento para que um único comando
// disponibilize o frontend e as rotas usadas por contas, bolsas e simulados.
await import('../server/index.mjs')

const vite = await createServer()
await vite.listen()
vite.printUrls()
