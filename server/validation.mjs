export const STUDY_LEVELS = ['graduacao','pos-graduacao','mestrado','doutorado','intercambio','idiomas','curso-curto','pesquisa','outro']
export const STATUSES = ['draft','published','archived']

const string = (value, max = 2000) => typeof value === 'string' ? value.trim().slice(0, max) : ''
const httpsUrl = value => {
  try { return new URL(value).protocol === 'https:' } catch { return false }
}
const date = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T12:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function validateScholarship(input, validCountries) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Envie os dados da bolsa.' }
  const data = {
    title: string(input.title, 200), organization: string(input.organization, 200),
    edition: string(input.edition, 100) || null, summary: string(input.summary, 3000),
    eligibility: string(input.eligibility, 5000), funding_details: string(input.funding_details, 3000),
    study_level: input.study_level, deadline_type: input.deadline_type,
    deadline_date: input.deadline_type === 'fixed' ? string(input.deadline_date, 10) : null,
    deadline_timezone: input.deadline_type === 'fixed' ? string(input.deadline_timezone, 80) : null,
    application_url: string(input.application_url, 2048) || null,
    source_label: string(input.source_label, 200), source_url: string(input.source_url, 2048),
    source_verified_at: string(input.source_verified_at, 10), status: input.status,
    countries: Array.isArray(input.countries) ? [...new Set(input.countries)] : [],
  }
  if (data.title.length < 3 || data.organization.length < 2) return { error: 'Informe título e organização responsável.' }
  if (!STUDY_LEVELS.includes(data.study_level)) return { error: 'Selecione um nível de estudo válido.' }
  if (!['fixed','rolling','unknown'].includes(data.deadline_type)) return { error: 'Selecione um tipo de prazo válido.' }
  if (data.deadline_type === 'fixed' && (!date(data.deadline_date) || !data.deadline_timezone)) return { error: 'Informe data e fuso do prazo.' }
  if (!data.source_label || !httpsUrl(data.source_url) || !date(data.source_verified_at)) return { error: 'Informe fonte HTTPS e data de verificação válidas.' }
  if (!STATUSES.includes(data.status)) return { error: 'Selecione um status válido.' }
  if (data.application_url && !httpsUrl(data.application_url)) return { error: 'O link de inscrição deve usar HTTPS.' }
  if (!data.countries.length || data.countries.some(slug => typeof slug !== 'string' || !validCountries.includes(slug))) return { error: 'Selecione pelo menos um país válido.' }
  if (data.status === 'published' && (!data.summary || !data.eligibility || !data.funding_details || !data.application_url)) return { error: 'Para publicar, preencha resumo, elegibilidade, financiamento e link de inscrição.' }
  return { data }
}
