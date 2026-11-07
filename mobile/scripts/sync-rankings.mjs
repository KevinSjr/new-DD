import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const mobileRoot=fileURLToPath(new URL('../',import.meta.url))
const files=[
  ['../src/data/subjectAreas.ts','src/data/subjectAreas.ts'],
  ...['qs-world-university-rankings-2027-top1000','qs-subject-rankings-2026-arts-humanities',
    'qs-subject-rankings-2026-engineering-technology','qs-subject-rankings-2026-life-sciences-medicine',
    'qs-subject-rankings-2026-natural-sciences','qs-subject-rankings-2026-social-sciences-management']
    .map(name=>[`../public/data/${name}.json`,`src/data/rankings/${name}.json`]),
]
for(const [sourcePath,targetPath] of files){
  const source=resolve(mobileRoot,sourcePath),target=resolve(mobileRoot,targetPath)
  const expected=await readFile(source)
  const actual=await readFile(target).catch(()=>null)
  if(actual?.equals(expected))continue
  if(process.argv.includes('--check'))throw new Error(`${targetPath} difere do site. Execute npm run sync:rankings em mobile.`)
  await mkdir(dirname(target),{recursive:true});await writeFile(target,expected)
  console.log(`Ranking sincronizado: ${targetPath}`)
}
