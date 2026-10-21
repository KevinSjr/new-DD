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

  UNION ALL

  SELECT 'campusbourses', c.source_id::text, c.title, left(c.description_excerpt, 420),
    CASE WHEN c.translation_method = 'machine' THEN 'CampusBourses · tradução automática'
      ELSE 'CampusBourses' END,
    c.source_url, NULL, c.fetched_at::text,
    CASE WHEN c.deadline_date IS NOT NULL THEN to_char(c.deadline_date, 'DD/MM/YYYY') ELSE NULL END,
    left(nullif(c.amount_detail, ''), 500),
    CASE WHEN c.deadline_date < CURRENT_DATE THEN 'Prazo informado pela fonte já passou; edição atual não verificada'
      ELSE 'Abertura não verificada; confira o prazo na fonte' END,
    CASE WHEN c.brazil_listed THEN 'Brasil listado; demais critérios não verificados'
      ELSE 'Brasil não listado; elegibilidade não verificada' END,
    nullif(c.fields_of_study, ''), nullif(c.nationality_listing, ''), NULL,
    nullif(c.study_levels, ''),
    'Catálogo CampusBourses; destino de estudo não confirmado individualmente'
  FROM campusbourses_imports c
  WHERE c.catalog_status = 'listed' AND ($2 = '' OR $2 = 'franca')

  UNION ALL

  SELECT 'study_japan', j.source_id, j.title, left(j.description_excerpt, 420),
    CASE WHEN j.translated_note THEN 'Study in Japan · trecho traduzido'
      ELSE 'Study in Japan · JASSO' END,
    j.source_url, j.application_url, j.fetched_at::text,
    left(nullif(j.deadline_text, ''), 500), left(nullif(j.amount_detail, ''), 500),
    CASE WHEN j.source_updated_at IS NOT NULL THEN
      'Ficha atualizada em ' || to_char(j.source_updated_at, 'DD/MM/YYYY') || '; abertura não verificada'
      ELSE 'Abertura não verificada; período divulgado pode ser de edição anterior' END,
    CASE WHEN j.brazil_mentioned THEN 'Brasil mencionado na ficha; demais critérios não verificados'
      ELSE 'Brasil não mencionado individualmente; confira as regiões e critérios na fonte' END,
    nullif(j.fields_of_study, ''),
    COALESCE(nullif(j.nationality_listing, ''), nullif(j.designated_regions, '')),
    NULL, nullif(j.study_levels, ''),
    'Catálogo Study in Japan; instituição e local de estudo sujeitos a confirmação'
  FROM study_japan_imports j
  WHERE j.catalog_status = 'listed' AND ($2 = '' OR $2 = 'japao')

  UNION ALL

  SELECT 'scholarship_china', c.source_id, c.title,
    left(trim(concat_ws(' · ', nullif(c.institution, ''),
      CASE WHEN c.city <> '' THEN c.city || COALESCE(', ' || nullif(c.province, ''), '') END,
      CASE WHEN c.intake_year IS NOT NULL THEN c.intake_year::text || ' ' || c.intake_season END,
      CASE WHEN c.teaching_language <> '' THEN 'Teaching language: ' || c.teaching_language END)), 420),
    CASE WHEN c.english_excerpt THEN 'ScholarshipChina · título em inglês da fonte'
      ELSE 'ScholarshipChina · catálogo de programas' END,
    c.source_url, NULL, c.fetched_at::text,
    nullif(c.deadline_text, ''),
    left(nullif(concat_ws('; ',
      CASE WHEN c.tuition_after_scholarship <> '' THEN 'Tuition after scholarship: ' || c.tuition_after_scholarship ||
        COALESCE(NULLIF(' ' || c.tuition_after_unit, ' '), '') END,
      CASE WHEN c.regular_tuition <> '' THEN 'Regular tuition listed: ' || c.regular_tuition ||
        COALESCE(NULLIF(' ' || c.regular_tuition_unit, ' '), '') END,
      CASE WHEN c.accommodation_after_scholarship <> '' THEN 'Accommodation after scholarship: ' || c.accommodation_after_scholarship END), ''), 500),
    CASE WHEN c.deadline_date < CURRENT_DATE THEN 'Prazo informado pela fonte já passou; edição atual não verificada'
      ELSE 'Abertura não verificada; confira taxas e condições na fonte' END,
    'Nacionalidade e elegibilidade brasileira não verificadas na listagem',
    nullif(c.field_of_study, ''), NULL, 'China', nullif(c.study_level, ''),
    'Programa em instituição chinesa; benefício e taxas sujeitos à confirmação na ficha'
  FROM scholarship_china_imports c
  WHERE c.catalog_status = 'listed' AND ($2 = '' OR $2 = 'china')

  UNION ALL

  SELECT 'study_korea', k.source_id, k.title,
    left(trim(concat_ws(' · ', k.institution, nullif(k.location, ''),
      nullif(k.listing_eligibility, ''), nullif(k.qualifications, ''))), 420),
    CASE WHEN k.translation_method = 'machine' THEN 'Study in Korea · tradução automática'
      ELSE 'Study in Korea' END,
    k.source_url, NULL, k.fetched_at::text, NULL,
    left(nullif(concat_ws('; ', nullif(k.benefits, ''), nullif(k.personal_support, '')), ''), 500),
    CASE WHEN k.source_updated_at IS NOT NULL THEN
      'Ficha atualizada em ' || to_char(k.source_updated_at, 'DD/MM/YYYY') || '; abertura não verificada'
      ELSE 'Abertura não verificada; confirme na universidade' END,
    'Elegibilidade brasileira não confirmada; confira os critérios da instituição',
    NULL, NULL, 'Korea, South', NULL,
    'Bolsa vinculada à universidade sul-coreana; condições sujeitas à confirmação'
  FROM study_korea_imports k
  WHERE k.catalog_status = 'listed' AND ($2 = '' OR $2 = 'coreia-do-sul')

  UNION ALL

  SELECT 'spain_administration', s.source_id, s.title,
    left(trim(concat_ws(' · ', nullif(s.organization, ''), nullif(s.geographic_scope, ''),
      nullif(s.beneficiaries, ''))), 420),
    'Administración.gob.es · tradução automática',
    s.source_url, s.official_notice_url, s.fetched_at::text,
    CASE WHEN s.deadline_end IS NOT NULL THEN to_char(s.deadline_end, 'DD/MM/YYYY') ELSE NULL END,
    left(nullif(s.amount_detail, ''), 500),
    CASE WHEN s.deadline_invalid THEN 'Prazo inválido na fonte; confira o edital'
      WHEN s.deadline_end < CURRENT_DATE THEN 'Prazo divulgado já passou; nova edição não confirmada'
      ELSE 'Abertura não verificada; confira o edital' END,
    'Elegibilidade brasileira não confirmada; confira os beneficiários e o edital',
    NULL, NULL, NULL, NULL,
    'Portal público espanhol; âmbito geográfico não comprova destino do estudo'
  FROM spain_administration_imports s
  WHERE s.catalog_status = 'listed' AND ($2 = '' OR $2 = 'espanha')

  UNION ALL

  SELECT 'universitaly_maeci', m.source_id, m.title, left(m.summary, 420),
    'MAECI · linked by Universitaly', m.source_url, m.application_url, m.fetched_at::text,
    to_char(m.deadline_date, 'DD/MM/YYYY') || ' · ' || m.deadline_timezone,
    'EUR ' || m.amount_regular_eur::text || ' total for most categories; EUR ' ||
      m.amount_language_eur::text || ' total for Italian language/culture courses',
    CASE WHEN m.deadline_date < CURRENT_DATE THEN 'Inscrições encerradas para a edição 2026–2027'
      ELSE 'Abertura não verificada; confira o edital' END,
    CASE WHEN m.brazil_listed THEN 'Brasil listado entre os países elegíveis; demais critérios devem ser conferidos'
      ELSE 'Brasil não listado; confira o edital' END,
    NULL, CASE WHEN m.brazil_listed THEN 'Brazil (among eligible countries)' ELSE NULL END,
    'Italy', m.study_levels,
    'Chamada oficial MAECI vinculada pelo Universitaly; edição e prazo específicos'
  FROM italy_maeci_imports m
  WHERE m.catalog_status = 'listed' AND ($2 = '' OR $2 = 'italia')

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
