import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { test } from 'node:test'

if(process.env.AVATAR_API_URL)test('avatar persiste no perfil e concede bônus apenas no primeiro salvamento',async()=>{
  const base=process.env.AVATAR_API_URL
  const password='senha longa para teste de avatar'
  let token=''
  const call=async(path,method='GET',data)=>{
    const response=await fetch(base+path,{method,headers:{'X-Daydreaming-Client':'mobile',
      ...(token?{Authorization:`Bearer ${token}`}:{}),...(data?{'Content-Type':'application/json'}:{})},
      body:data?JSON.stringify(data):undefined})
    return {status:response.status,data:await response.json()}
  }
  try{
    assert.equal((await call('/api/account/avatar','PUT',{character:1})).status,401)
    const registered=await call('/api/account/register','POST',{
      displayName:'Teste Avatar',email:`avatar-${randomUUID()}@example.test`,password})
    assert.equal(registered.status,201)
    token=registered.data.sessionToken
    assert.equal(registered.data.user.avatar,null)
    const selection={character:4,outfit:'hoodie',accessory:'none',style:'brasil'}
    assert.equal((await call('/api/account/avatar','PUT',{...selection,character:10})).status,400)
    const first=await call('/api/account/avatar','PUT',selection)
    assert.equal(first.status,200)
    assert.deepEqual(first.data.avatar,selection)
    assert.equal(first.data.earnedXp,50)
    assert.deepEqual((await call('/api/account/me')).data.user.avatar,selection)
    const updated={...selection,character:2,outfit:'jacket',accessory:'glasses',style:'japao'}
    const second=await call('/api/account/avatar','PUT',updated)
    assert.equal(second.status,200)
    assert.equal(second.data.earnedXp,0)
    assert.deepEqual((await call('/api/account/me')).data.user.avatar,updated)
    const profile=await call('/api/account/profile','PUT',{displayName:'Teste Avatar'})
    assert.equal(profile.status,200)
    assert.deepEqual(profile.data.user.avatar,updated)
    assert.ok((await call('/api/account/missions')).data.xp>=50)
  }finally{if(token)await call('/api/account/me','DELETE',{password}).catch(()=>{})}
})
