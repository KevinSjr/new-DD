import * as SecureStore from 'expo-secure-store'
import { baseUrl } from '../api'

type DailyKind = 'sat'|'mext'
const memoryTokens:Record<DailyKind,string|null> = {sat:null,mext:null}
const storageKey = (kind:DailyKind) => `daydreaming_${kind}_daily_token`

export async function dailyRequest<T>(kind:DailyKind,path:string,body?:object):Promise<T> {
  let token=memoryTokens[kind]
  if (!token) try { token=await SecureStore.getItemAsync(storageKey(kind)) } catch { /* memória desta sessão */ }
  const response=await fetch(baseUrl()+path,{
    method:body?'POST':'GET',
    headers:{'X-Daydreaming-Client':'mobile',...(token?{'X-Daydreaming-Daily-Token':token}:{}),
      ...(body?{'Content-Type':'application/json'}:{})},
    ...(body?{body:JSON.stringify(body)}:{}),
  })
  const result=await response.json().catch(()=>null)
  if (!response.ok) throw new Error(result?.error||`Não foi possível carregar o desafio (${response.status}).`)
  if (typeof result?.dailyToken==='string') {
    memoryTokens[kind]=result.dailyToken
    try { await SecureStore.setItemAsync(storageKey(kind),result.dailyToken) } catch { /* memória desta sessão */ }
  }
  return result as T
}

export const examAssetUrl=(assetPath:string)=>baseUrl()+assetPath
