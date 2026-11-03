export function recordAchievement(kind:string, target:string, details:Record<string, unknown> = {}) {
  return fetch('/api/account/achievements/events', {
    method:'POST', credentials:'same-origin', headers:{ 'Content-Type':'application/json' },
    body:JSON.stringify({ kind, target, details }),
  }).then(response => {
    if (response.ok) window.dispatchEvent(new Event('daydreaming:missions-changed'))
  }).catch(() => {})
}
