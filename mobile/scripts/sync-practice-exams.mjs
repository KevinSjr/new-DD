import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const mobileRoot=fileURLToPath(new URL('../',import.meta.url))
const names=[
  'toeflPractice','ieltsPractice','goethePractice','goetheExpansion',
  'delfDalfPractice','delfDalfExercises','jlptPractice','jlptBlueprint',
  'topikPractice','hskPractice','delePractice',
]
const directory=resolve(mobileRoot,'src/data/practice')
if(!process.argv.includes('--check'))await mkdir(directory,{recursive:true})
for(const name of names){
  const expected=await readFile(resolve(mobileRoot,'../src/data',name+'.ts'),'utf8')
  const target=resolve(directory,name+'.ts')
  if((await readFile(target,'utf8').catch(()=>null))===expected)continue
  if(process.argv.includes('--check'))throw new Error(name+' difere do site. Execute npm run sync:practice-exams em mobile.')
  await writeFile(target,expected,'utf8')
  console.log('Simulado sincronizado: '+name)
}
