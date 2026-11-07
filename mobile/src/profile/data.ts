import type { User } from '../api'

export const studyLevels = [
  ['graduacao','Graduação'],['pos-graduacao','Pós-graduação'],['mestrado','Mestrado'],
  ['doutorado','Doutorado'],['intercambio','Intercâmbio'],['idiomas','Curso de idiomas'],
  ['curso-curto','Curso curto'],['pesquisa','Pesquisa'],['outro','Outro'],
] as const
export const areas = ['Engenharia e tecnologia','Saúde','Negócios','Humanas e Direito','Artes e design','Ciências','Educação']
export const languages = ['Português','Inglês','Espanhol','Alemão','Francês','Japonês','Coreano','Mandarim','Outro']
export const exams = ['TOEFL','IELTS','Duolingo English Test','SAT','GRE','GMAT','JLPT','TOPIK','HSK','Outro']
export const targetYears = [['2027','Em 2027'],['2028','Em 2028'],['2029-plus','2029 ou depois'],['undecided','Ainda não sei']] as const

export type ProfileDraft = {
  displayName:string; fullName:string; schoolName:string; schoolYear:string; city:string; stateCode:string
  studyLevel:string; interestArea:string; destinationSlug:string; destinationSlugs:string[]; targetYear:string
  gpa:string; satScore:string; toeflScore:string; ieltsScore:string; languages:string[]; plannedExams:string[]
}

export function draftFromUser(user:User):ProfileDraft {
  return {
    displayName:user.displayName, fullName:user.fullName||'',schoolName:user.schoolName||'',
    schoolYear:user.schoolYear||'',city:user.city||'',stateCode:user.stateCode||'',
    studyLevel:user.studyLevel||'',interestArea:user.interestArea||'',
    destinationSlug:user.destinationSlugs?.[0]||user.destinationSlug||'',
    destinationSlugs:user.destinationSlugs||[],targetYear:user.targetYear||'',
    gpa:user.gpa==null?'':String(user.gpa),satScore:user.satScore==null?'':String(user.satScore),
    toeflScore:user.toeflScore==null?'':String(user.toeflScore),ieltsScore:user.ieltsScore==null?'':String(user.ieltsScore),
    languages:user.languages||[],plannedExams:user.plannedExams||[],
  }
}

export const levelName=(level:string)=>studyLevels.find(([key])=>key===level)?.[1]||'Ainda não escolhido'

export function validateDraft(draft:ProfileDraft):string {
  const name=draft.displayName.trim().replace(/\s+/g,' ')
  if(name.length<2||name.length>80)return 'Informe um nome de 2 a 80 caracteres.'
  if(draft.stateCode && !/^[A-Za-z]{2}$/.test(draft.stateCode.trim()))return 'Informe a sigla do estado com duas letras.'
  if(draft.destinationSlugs.length>3)return 'Escolha até três destinos.'
  const scores:[keyof ProfileDraft,string,number,number,number][]=[
    ['gpa','GPA',0,4,.01],['satScore','SAT',400,1600,1],
    ['toeflScore','TOEFL',0,120,1],['ieltsScore','IELTS',0,9,.5],
  ]
  for(const [key,label,min,max,step] of scores){
    const raw=draft[key] as string
    if(!raw.trim())continue
    if(!/^\d+(?:[,.]\d+)?$/.test(raw.trim()))return `Informe ${label} como número válido.`
    const value=Number(raw.replace(',','.'))
    if(value<min||value>max||Math.abs(value/step-Math.round(value/step))>1e-8)
      return `${label} deve estar entre ${min} e ${max}${step===1?', sem casas decimais':` (passos de ${step})`}.`
  }
  return ''
}
