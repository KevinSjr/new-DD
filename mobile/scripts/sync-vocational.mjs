import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const mobileRoot = fileURLToPath(new URL('../', import.meta.url))
const repoRoot = resolve(mobileRoot, '..')
const files = ['src/data/vocationalQuestions.ts', 'src/data/vocationalCareers.ts', 'src/lib/vocational.ts']
const check = process.argv.includes('--check')

for (const relative of files) {
  const source = await readFile(resolve(repoRoot, relative), 'utf8')
  const target = resolve(mobileRoot, relative)
  const current = await readFile(target, 'utf8').catch(() => null)
  if (current === source) continue
  if (check) throw new Error(relative + ' no app difere da versão do site. Execute npm run sync:vocational em mobile.')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, source, 'utf8')
  console.log('Teste vocacional sincronizado: ' + relative)
}
