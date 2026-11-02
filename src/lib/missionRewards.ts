type MissionClaim = { source:'sat'; proof:string; section:'reading-writing' | 'math' }
  | { source:'mext'; proof:string; track:'A' | 'B'; subject:string }

export type MissionClaimStatus = { kind:'awarded' | 'already' | 'guest'; earnedXp:number }

export async function claimDailyMission(claim: MissionClaim): Promise<MissionClaimStatus> {
  const response = await fetch('/api/account/missions/claim', {
    method:'POST', credentials:'same-origin', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(claim),
  })
  if (response.status === 401) return { kind:'guest', earnedXp:0 }
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('A API de missões não respondeu corretamente. Reinicie npm run dev.')
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Não foi possível registrar a missão. Abra o desafio novamente para tentar de novo.')
  window.dispatchEvent(new Event('daydreaming:missions-changed'))
  return { kind:data.earnedXp > 0 ? 'awarded' : 'already', earnedXp:data.earnedXp }
}
