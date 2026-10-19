/** Datas de verificação são guardadas como "AAAA-MM-DD" e mostradas como "DD/MM/AAAA". */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Aceita só datas reais (rejeita "2026-02-31", que o JavaScript "corrigiria" para março)
 * e datas que não estejam no futuro (uma verificação não pode ter acontecido amanhã).
 */
export function isValidIsoDate(value: string, now: number = Date.now()): boolean {
  if (!ISO_DATE.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false
  return date.getTime() <= now + 86_400_000 // 1 dia de folga por causa dos fusos horários
}

/** Formata em UTC para a data não "voltar um dia" em fusos como o do Brasil. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${iso}T00:00:00Z`))
}

export function daysSince(iso: string, now: number = Date.now()): number {
  return Math.floor((now - new Date(`${iso}T00:00:00Z`).getTime()) / 86_400_000)
}

/** Só aceita endereços https (evita "javascript:" e links sem criptografia em dados editados à mão). */
export function isSafeHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}
