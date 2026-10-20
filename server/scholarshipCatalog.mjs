const hostNames = Object.freeze({
  'estados-unidos': 'United States', 'reino-unido': 'United Kingdom', canada: 'Canada',
  australia: 'Australia', alemanha: 'Germany', franca: 'France', japao: 'Japan',
  china: 'China', 'coreia-do-sul': 'Korea, South', espanha: 'Spain',
  'paises-baixos': 'Netherlands', italia: 'Italy', portugal: 'Portugal',
  irlanda: 'Ireland', suica: 'Switzerland', suecia: 'Sweden', finlandia: 'Finland',
  dinamarca: 'Denmark', belgica: 'Belgium', noruega: 'Norway', taiwan: 'Taiwan',
  'hong-kong': 'Hong Kong', singapura: 'Singapore', malasia: 'Malaysia',
  'nova-zelandia': 'New Zealand',
})

export const countryHostName = slug => hostNames[slug] || null

const catalog = `WITH catalog AS (
  SELECT 'verified'::text AS source, s.id::text AS source_id, s.title,
    s.summary AS description, s.source_label, s.source_url, s.application_url,
    s.source_verified_at::text AS observed_at,
    CASE WHEN s.deadline_type = 'fixed' THEN to_char(s.deadline_date, 'DD/MM/YYYY') || ' · ' || s.deadline_timezone
      WHEN s.deadline_type = 'rolling' THEN 'Inscrições contínuas; confirme na fonte' ELSE NULL END AS deadline,
    nullif(s.funding_details, '') AS amount,
    'Publicada após revisão; abertura não confirmada'::text AS source_status,
    'Não avaliado'::text AS brazil_criteria, NULL::text AS field_of_study,
    NULL::text AS nationality,
    string_agg(DISTINCT c.name, ', ' ORDER BY c.name) AS destinations,
    s.study_level,
    'Destino revisado'::text AS country_basis
  FROM scholarships s
  LEFT JOIN scholarship_countries sc ON sc.scholarship_id = s.id
  LEFT JOIN countries c ON c.slug = sc.country_slug
  WHERE s.status = 'published' AND s.deleted_at IS NULL
    AND ($2 = '' OR EXISTS (SELECT 1 FROM scholarship_countries chosen WHERE chosen.scholarship_id = s.id AND chosen.country_slug = $2))
  GROUP BY s.id

  UNION ALL

  SELECT 'iefa', i.source_id, i.title, i.description_excerpt, 'IEFA', i.source_url, NULL,
    i.fetched_at::text, NULL, NULL, 'Abertura não verificada',
    CASE WHEN i.nationality_listing ILIKE '%Brazil%' THEN 'Brasil listado; demais critérios não verificados'
      WHEN i.nationality_listing = 'Unrestricted' THEN 'Sem restrição indicada na listagem; critérios não verificados'
      ELSE 'Não verificado' END,
    nullif(i.field_of_study, ''), nullif(i.nationality_listing, ''),
    nullif(i.host_countries_listing, ''), NULL, 'Destino informado na listagem'
  FROM scholarship_imports i
  WHERE i.catalog_status = 'listed'
    AND ($2 = '' OR i.host_countries_listing ILIKE '%' || $3 || '%')

  UNION ALL

  SELECT 'scholarship_america', a.source_id::text, a.title, a.description_excerpt,
    'Scholarship America', a.source_url, NULL, a.fetched_at::text,
    CASE WHEN a.close_date IS NOT NULL THEN a.close_date || COALESCE(' · ' || a.date_timezone, '') ELSE NULL END,
    nullif(a.award_amount, ''),
    CASE a.listing_status WHEN 'open' THEN 'Marcada como aberta na coleta'
      WHEN 'closed' THEN 'Marcada como fechada na coleta' ELSE 'Status não informado' END,
    CASE WHEN a.brazil_mentioned THEN 'Brasil mencionado; demais critérios não verificados'
      ELSE 'Brasil não mencionado; elegibilidade não verificada' END,
    NULL, NULL, NULL, nullif(a.study_levels, ''),
    'Catálogo sediado nos EUA; destino de estudo não confirmado'
  FROM scholarship_america_imports a
  WHERE a.catalog_status = 'listed' AND ($2 = '' OR $2 = 'estados-unidos')

  UNION ALL

  SELECT 'study_australia', a.source_id, a.title, left(a.description_excerpt, 420),
    'Study Australia', a.source_url, a.provider_url, a.fetched_at::text,
    nullif(a.deadline_text, ''),
    COALESCE(nullif(a.amount_comment, ''),
      CASE WHEN a.amount_annual IS NOT NULL THEN 'AUD $' || a.amount_annual::text || ' por ano'
        WHEN a.amount_max IS NOT NULL THEN 'Até AUD $' || a.amount_max::text ELSE NULL END),
    'Abertura não verificada; confira o prazo na fonte',
    CASE WHEN a.nationality_listing ILIKE '%Brazil%' THEN 'Brasil listado; demais critérios não verificados'
      WHEN a.nationality_listing <> '' AND a.nationality_listing NOT ILIKE '%All Countries%' THEN 'Outra nacionalidade listada; Brasil não confirmado'
      WHEN a.international_students IS TRUE THEN 'Estudantes internacionais indicados; Brasil não confirmado'
      ELSE 'Não verificado' END,
    nullif(a.fields_of_study, ''),
    CASE WHEN a.nationality_listing ILIKE '%All Countries%' THEN 'Todos os países (listagem)'
      ELSE nullif(a.nationality_listing, '') END,
    CASE WHEN a.tenable_overseas IS TRUE THEN NULL ELSE 'Australia' END,
    nullif(a.study_levels, ''),
    CASE WHEN a.tenable_overseas IS TRUE THEN 'A fonte informa possibilidade de estudo fora da Austrália; destino específico a confirmar'
      ELSE 'Catálogo australiano; destino específico e elegibilidade sujeitos a confirmação' END
  FROM study_australia_imports a
  WHERE a.catalog_status = 'listed' AND ($2 = '' OR ($2 = 'australia' AND a.tenable_overseas IS NOT TRUE))

  UNION ALL

  SELECT 'daad', d.source_id::text, d.title, left(d.description_excerpt, 420),
    CASE WHEN d.is_daad THEN 'DAAD' ELSE 'Base DAAD · outra organização' END,
    d.source_url, NULL, d.fetched_at::text,
    left(COALESCE(nullif(d.deadline_brazil, ''), nullif(d.deadline_detail, ''),
      nullif(d.deadline_general, '')), 500),
    left(nullif(d.amount_detail, ''), 500),
    'Abertura não verificada; confirme o prazo para seu país',
    CASE WHEN d.brazil_listed THEN 'Brasil listado como país de candidatura; demais critérios não verificados'
      ELSE 'Brasil não listado como país de candidatura; consulte o DAAD' END,
    nullif(d.fields_of_study, ''),
    CASE WHEN d.brazil_listed THEN 'Brasil no filtro de país de candidatura (não nacionalidade)'
      ELSE 'Brasil não consta no filtro de país de candidatura' END,
    NULL, nullif(d.study_levels, ''),
    'Base DAAD; país de estudo deste programa não confirmado pela listagem'
  FROM daad_imports d
  WHERE d.catalog_status = 'listed' AND ($2 = '' OR $2 = 'alemanha')

)`

export async function scholarshipCatalog(pool, params) {
  const q = (params.get('q') || '').trim().slice(0, 100)
  const country = (params.get('country') || '').trim()
  const page = Math.min(10000, Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1))
  if (country && !countryHostName(country)) {
    throw Object.assign(new Error('País inválido.'), { status: 400 })
  }
  const values = [q, country, countryHostName(country) || '']
  const filter = `WHERE ($1 = '' OR title ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%')`
  const count = await pool.query(`${catalog} SELECT count(*)::integer AS total FROM catalog ${filter}`, values)
  const result = await pool.query(`${catalog} SELECT * FROM catalog ${filter}
    ORDER BY lower(title), source, source_id LIMIT 12 OFFSET $4`, [...values, (page - 1) * 12])
  return { items: result.rows, total: count.rows[0].total, page, pageSize: 12 }
}
