import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { test } from 'node:test'

if (process.env.LEAGUE_API_URL) test('ligas SAT e MEXT usam somente desafios concluídos e preservam apelidos', async () => {
  const base=process.env.LEAGUE_API_URL
  const password='senha longa para teste de ligas'
  let token=''
  const call=async (path,method='GET',data,headers={})=>{
    const response=await fetch(base+path,{method,headers:{'X-Daydreaming-Client':'mobile',
      ...(token?{Authorization:`Bearer ${token}`}:{ }),...(data?{'Content-Type':'application/json'}:{}),...headers},
      body:data?JSON.stringify(data):undefined})
    return {status:response.status,data:await response.json()}
  }
  async function complete(source,variant,query){
    let dailyToken=''
    let state
    do {
      const headers=dailyToken?{'X-Daydreaming-Daily-Token':dailyToken}:{}
      state=await call(`/api/${source}/daily${state?'/answer':'?'+query}`,state?'POST':'GET',
        state?{...variant,questionId:state.data.question.id,answer:'Z'}:undefined,headers)
      assert.equal(state.status,200)
      dailyToken=state.data.dailyToken||dailyToken
    } while(!state.data.finished)
    assert.match(state.data.completionProof,/^[a-f0-9]{64}$/)
    return {source,proof:state.data.completionProof,livesLost:state.data.maxLives-state.data.lives,...variant}
  }
  try{
    assert.equal((await call('/api/account/leagues/sat-reading-writing')).status,401)
    const registration=await call('/api/account/register','POST',{
      displayName:'Pessoa Liga',email:`league-${randomUUID()}@example.test`,password})
    assert.equal(registration.status,201)
    token=registration.data.sessionToken
    const empty=await call('/api/account/leagues/sat-reading-writing')
    assert.equal(empty.data.joined,false)
    const joined=await call('/api/account/leagues/sat-reading-writing','POST')
    assert.equal(joined.data.joined,true)
    assert.equal(joined.data.tier,'bronze')
    assert.match(joined.data.you.alias,/^Explorador [A-F0-9]{6}$/)
    assert.equal(joined.data.you.points,0)
    assert.equal(joined.data.you.rank,null)
    assert.equal(joined.data.participants,0)
    const satClaim=await complete('sat',{section:'reading-writing'},'section=reading-writing')
    assert.equal((await call('/api/account/missions/claim','POST',{source:satClaim.source,proof:satClaim.proof,section:satClaim.section})).status,200)
    const afterSat=(await call('/api/account/leagues/sat-reading-writing')).data
    assert.equal(afterSat.you.points,afterSat.you.correct*10)
    assert.equal(afterSat.you.livesLost,satClaim.livesLost)
    assert.equal(afterSat.you.days,1)
    assert.equal(afterSat.leaders.some(row=>row.you&&row.alias===afterSat.you.alias),afterSat.you.points>0)
    assert.equal(afterSat.leaders.some(row=>'email' in row||'displayName' in row),false)
    await call('/api/account/missions/claim','POST',{source:satClaim.source,proof:satClaim.proof,section:satClaim.section})
    assert.equal((await call('/api/account/leagues/sat-reading-writing')).data.you.points,afterSat.you.points)
    assert.equal((await call('/api/account/leagues/sat-math')).data.joined,false)
    assert.equal((await call('/api/account/leagues/sat-math','POST')).data.joined,true)
    const mathClaim=await complete('sat',{section:'math'},'section=math')
    assert.equal((await call('/api/account/missions/claim','POST',{source:'sat',proof:mathClaim.proof,section:'math'})).status,200)
    const afterMath=(await call('/api/account/leagues/sat-math')).data
    assert.equal(afterMath.you.points,afterMath.you.correct*10)
    assert.equal(afterMath.you.livesLost,mathClaim.livesLost)
    assert.equal(afterMath.you.days,1)
    assert.equal((await call('/api/account/leagues/sat-reading-writing')).data.you.points,afterSat.you.points)
    assert.equal((await call('/api/account/leagues/mext','POST')).data.joined,true)
    const mextClaim=await complete('mext',{track:'A',subject:'english'},'track=A&subject=english')
    assert.equal((await call('/api/account/missions/claim','POST',{source:mextClaim.source,proof:mextClaim.proof,track:mextClaim.track,subject:mextClaim.subject})).status,200)
    const afterMext=(await call('/api/account/leagues/mext')).data
    assert.equal(afterMext.you.points,afterMext.you.correct*10)
    assert.equal(afterMext.you.livesLost,mextClaim.livesLost)
    assert.equal((await call('/api/account/leagues/sat-reading-writing')).data.you.points,afterSat.you.points)
    assert.equal((await call('/api/account/leagues/sat-reading-writing','DELETE')).data.left,true)
    assert.equal((await call('/api/account/leagues/sat-reading-writing')).data.joined,false)
    assert.equal((await call('/api/account/leagues/sat-math')).data.joined,true)
  } finally {
    if(token) await call('/api/account/me','DELETE',{password}).catch(()=>{})
  }
})
