import assert from 'node:assert/strict'

const base=process.env.EXAM_API_URL||'http://127.0.0.1:3002'
async function query(filters){
  const url=`${base}/api/scholarship-catalog?${new URLSearchParams({page:'1',...filters})}`
  const response=await fetch(url)
  assert.equal(response.status,200,`${url}: HTTP ${response.status}`)
  const result=await response.json()
  assert.ok(Number.isInteger(result.total)&&result.total>=0)
  assert.ok(Array.isArray(result.items)&&result.items.length<=result.pageSize)
  return result
}
const all=await query({})
assert.ok(all.total>0,'Catálogo vazio')
for(const filters of [
  {country:'estados-unidos'},{level:'undergraduate'},{area:'engineering'},
  {deadline:'upcoming'},{criteria:'mentioned'},
  {country:'canada',level:'postgraduate',area:'health',deadline:'undated',criteria:'unknown'},
]){
  const result=await query(filters)
  assert.ok(result.total<=all.total,`Filtro aumentou total: ${JSON.stringify(filters)}`)
}
console.log('Filtros de país, nível, área, prazo e critérios: OK')
