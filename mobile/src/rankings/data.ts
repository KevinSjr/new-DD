import { SUBJECT_AREAS, type SubjectAreaKey } from '../data/subjectAreas'
import generalData from '../data/rankings/qs-world-university-rankings-2027-top1000.json'
import artsData from '../data/rankings/qs-subject-rankings-2026-arts-humanities.json'
import engineeringData from '../data/rankings/qs-subject-rankings-2026-engineering-technology.json'
import lifeData from '../data/rankings/qs-subject-rankings-2026-life-sciences-medicine.json'
import naturalData from '../data/rankings/qs-subject-rankings-2026-natural-sciences.json'
import socialData from '../data/rankings/qs-subject-rankings-2026-social-sciences-management.json'

export type RankingKey = 'general' | SubjectAreaKey
export type RankingEntry = {index:number;rank:string;university:string;location:string;region?:string;score?:number|null;overall_score?:number|null}
export type RankingDataset = {edition:number;count:number;source_url:string;source_file:string;attribution?:string;area?:string;
  methodology_weights?:Record<string,number>;universities:RankingEntry[]}
export const RANKING_AREAS=Object.keys(SUBJECT_AREAS) as SubjectAreaKey[]
const datasets:Record<RankingKey,unknown>={general:generalData,'arts-humanities':artsData,'engineering-technology':engineeringData,
  'life-sciences-medicine':lifeData,'natural-sciences':naturalData,'social-sciences-management':socialData}
export function isRankingKey(value:string):value is RankingKey{return value==='general'||Object.hasOwn(SUBJECT_AREAS,value)}
export function rankingTitle(key:RankingKey){return key==='general'?'Universidades no mundo':SUBJECT_AREAS[key].title}
export function rankingScore(key:RankingKey,item:RankingEntry){return key==='general'?item.overall_score:item.score}
export function rankingDataset(key:RankingKey):RankingDataset{
  const data=datasets[key] as RankingDataset
  const expected=key==='general'?1000:SUBJECT_AREAS[key].count
  if(data?.edition!==(key==='general'?2027:2026)||data.count!==expected||data.universities?.length!==expected||
    !data.universities.every((item,index)=>item.index===index+1&&typeof item.rank==='string'&&typeof item.university==='string'&&typeof item.location==='string'&&
      (key!=='general'||typeof item.region==='string')&&
      (rankingScore(key,item)===null||typeof rankingScore(key,item)==='number'&&Number.isFinite(rankingScore(key,item)))))
    throw new Error('Os dados deste ranking estão incompletos. Atualize o aplicativo.')
  if(key!=='general'&&(data.area!==SUBJECT_AREAS[key].sourceName||!data.methodology_weights||
    !['academic','employer','citations_per_paper','h_index','international_research_network'].every((weight,index)=>
      data.methodology_weights?.[weight]===SUBJECT_AREAS[key].weights[index])))
    throw new Error('A área do ranking não corresponde à fonte esperada.')
  return data
}
