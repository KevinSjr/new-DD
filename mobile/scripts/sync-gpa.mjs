import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const mobileRoot = fileURLToPath(new URL('../', import.meta.url))
const repoRoot = resolve(mobileRoot, '..')
const files = ['src/data/gpaMethods.ts', 'src/lib/gpa.ts']
const check = process.argv.includes('--check')

for (const relative of files) {
  const source = await readFile(resolve(repoRoot, relative), 'utf8')
  const target = resolve(mobileRoot, relative)
  const current = await readFile(target, 'utf8').catch(() => null)
  if (current === source) continue
  if (check) throw new Error(relative + ' no app difere da versão do site. Execute npm run sync:gpa em mobile.')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, source, 'utf8')
  console.log('GPA sincronizado: ' + relative)
}
