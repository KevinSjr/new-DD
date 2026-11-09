import Constants from 'expo-constants'
import { Platform } from 'react-native'
import type { AvatarChoice } from './components/AvatarPortrait'

export type Country = { slug:string; name:string }
export type User = {
  id:number; email:string; displayName:string; fullName:string|null; schoolName:string|null; schoolYear:string|null
  city:string|null; stateCode:string|null; studyLevel:string|null; interestArea:string|null
  destinationSlug:string|null; destinationSlugs:string[]; targetYear:string|null
  gpa:number|null; satScore:number|null; toeflScore:number|null; ieltsScore:number|null
  languages:string[]; plannedExams:string[]
  avatar:AvatarChoice|null
}
export type Scholarship = { source:string; source_id:string; title:string; description:string | null; source_label:string; source_url:string; application_url:string | null; observed_at:string | null; deadline:string | null; amount:string | null; source_status:string; brazil_criteria:string; field_of_study:string | null; nationality:string | null; destinations:string | null; study_level:string | null; country_basis:string }
export type SavedScholarship = Pick<Scholarship,'source'|'source_id'|'title'|'source_label'|'source_url'> & { saved_at:string; available:boolean }
export type Deadline = { id:string; title:string; dueDate:string; note:string | null; savedSource:string | null; savedSourceId:string | null }
export type Journey = { tasks:{ key:string; status:string }[]; deadlines:Deadline[] }

export function baseUrl() {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/$/, '')
  if (configured) return configured
  const metroHost = Constants.expoConfig?.hostUri?.split(':')[0]
  if (metroHost && Platform.OS !== 'web') return `http://${metroHost}:3001`
  return 'http://127.0.0.1:3001'
}

export async function api<T>(path:string, options:{ method?:string; token?:string | null; body?:unknown } = {}):Promise<T> {
  const response = await fetch(`${baseUrl()}${path}`, {
    method:options.method || 'GET',
    headers:{ 'X-Daydreaming-Client':'mobile', ...(options.token ? { Authorization:`Bearer ${options.token}` } : {}),
      ...(options.body === undefined ? {} : { 'Content-Type':'application/json' }) },
    ...(options.body === undefined ? {} : { body:JSON.stringify(options.body) }),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) throw new Error(result?.error || `Não foi possível concluir (${response.status}).`)
  return result as T
}

export const catalog = (country:string, page:number) => api<{ items:Scholarship[]; total:number; page:number; pageSize:number }>(
  `/api/scholarship-catalog?${new URLSearchParams({ country, page:String(page) })}`)
