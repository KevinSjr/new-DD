import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as SecureStore from 'expo-secure-store'
import { api, type User } from './api'

const key = 'daydreaming_session'
type Session = {
  token:string | null; user:User | null; loading:boolean; error:string
  refresh:()=>Promise<void>
  signIn:(email:string,password:string)=>Promise<void>
  register:(displayName:string,email:string,password:string)=>Promise<void>
  signOut:()=>Promise<void>
  updateUser:(user:User)=>void
}
const Context = createContext<Session | null>(null)

export function SessionProvider({ children }: { children:ReactNode }) {
  const [token,setToken] = useState<string | null>(null)
  const [user,setUser] = useState<User | null>(null)
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')

  const refresh = async () => {
    setLoading(true);setError('')
    try {
      const saved = await SecureStore.getItemAsync(key)
      if (!saved) { setToken(null);setUser(null);return }
      const result = await api<{ user:User | null }>('/api/account/me',{ token:saved })
      if (result.user) { setToken(saved);setUser(result.user) }
      else { await SecureStore.deleteItemAsync(key);setToken(null);setUser(null) }
    } catch {
      setError('Não foi possível verificar sua conta. Confira a conexão com a API e tente novamente.')
    } finally { setLoading(false) }
  }
  useEffect(() => { void refresh() }, [])

  const authenticate = async (path:string, data:object) => {
    const result = await api<{ user:User; sessionToken:string }>(path,{ method:'POST',body:data })
    await SecureStore.setItemAsync(key,result.sessionToken)
    setToken(result.sessionToken);setUser(result.user);setError('')
  }
  const signIn = (email:string,password:string) => authenticate('/api/account/login',{ email,password })
  const register = (displayName:string,email:string,password:string) => authenticate('/api/account/register',{ displayName,email,password })
  const signOut = async () => {
    try { if (token) await api('/api/account/logout',{ method:'POST',token }) }
    finally { await SecureStore.deleteItemAsync(key);setToken(null);setUser(null);setError('') }
  }
  return <Context.Provider value={{ token,user,loading,error,refresh,signIn,register,signOut,updateUser:setUser }}>{children}</Context.Provider>
}

export function useSession() {
  const value = useContext(Context)
  if (!value) throw new Error('Sessão não inicializada.')
  return value
}
