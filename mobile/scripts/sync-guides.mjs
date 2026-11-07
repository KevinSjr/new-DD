import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const mobileRoot=fileURLToPath(new URL('../',import.meta.url))
const names=['germany','canada','unitedStates','unitedKingdom','france',
  'australia','japan','china','southKorea','newZealand','portugal','spain','italy','ireland','belgium',
  'denmark','finland','hongKong','malaysia','norway','netherlands','singapore','sweden','switzerland','taiwan']
const files=[
  ['../src/data/countries.ts','src/data/countries.ts'],
  ['../src/types/country.ts','src/types/country.ts'],
  ...names.map(name=>[`../src/data/${name}Guide.ts`,`src/data/guides/${name}Guide.ts`]),
]
for(const [sourcePath,targetPath] of files){
  const source=resolve(mobileRoot,sourcePath),target=resolve(mobileRoot,targetPath)
  const expected=await readFile(source)
  const actual=await readFile(target).catch(()=>null)
  if(actual?.equals(expected))continue
  if(process.argv.includes('--check'))throw new Error(`${targetPath} difere do site. Execute npm run sync:guides em mobile.`)
  await mkdir(dirname(target),{recursive:true});await writeFile(target,expected)
  console.log(`Guia sincronizado: ${targetPath}`)
}
