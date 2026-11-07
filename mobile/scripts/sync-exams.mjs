import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const mobileRoot = fileURLToPath(new URL('../', import.meta.url))
const source = resolve(mobileRoot, '../src/data/exams.ts')
const target = resolve(mobileRoot, 'src/data/exams.ts')
const expected = await readFile(source, 'utf8')
if ((await readFile(target, 'utf8').catch(() => null)) !== expected) {
  if (process.argv.includes('--check')) throw new Error('O catálogo do app difere do site. Execute npm run sync:exams em mobile.')
  await mkdir(dirname(target), { recursive:true })
  await writeFile(target, expected, 'utf8')
  console.log('Catálogo de exames sincronizado com o site.')
}
