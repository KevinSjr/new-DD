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

  UNION ALL

  SELECT 'swiss_excellence', s.source_id, s.title, left(s.summary, 420),
    'Swiss SERI / FCS', s.source_url, s.application_url, s.fetched_at::text,
    to_char(s.deadline_date, 'DD/MM/YYYY') || ' · ' || s.deadline_timezone,
    'CHF ' || s.amount_monthly_chf::text || ' per month; ' || s.duration,
    CASE WHEN s.deadline_date < CURRENT_DATE THEN 'Prazo da edição ' || s.edition || ' encerrado'
      WHEN s.opening_date <= CURRENT_DATE THEN 'Inscrições abertas segundo o calendário oficial; confirme no portal'
      ELSE 'Abertura prevista para ' || to_char(s.opening_date, 'DD/MM/YYYY') || '; confirme na fonte' END,
    CASE WHEN s.brazil_listed THEN 'Modalidade listada para o Brasil; requisitos individuais ainda se aplicam'
      ELSE 'Modalidade não listada para o Brasil' END,
    s.field_of_study, CASE WHEN s.brazil_listed THEN 'Brazil' ELSE NULL END,
    'Switzerland', s.study_level,
    'Bolsa federal suíça; prazo e tipos disponíveis específicos para candidatos do Brasil'
  FROM swiss_excellence_imports s
  WHERE s.catalog_status = 'listed' AND ($2 = '' OR $2 = 'suica')

  UNION ALL

  SELECT 'study_in_sweden', s.source_id::text, s.title,
    left(trim(concat_ws(' · ', s.category, nullif(s.university, ''),
      CASE WHEN s.regions_listing <> '' THEN 'Listed audience: ' || s.regions_listing END)), 420),
    'Study in Sweden · catalog listing', 'https://studyinsweden.se/scholarships/',
    s.provider_url, s.fetched_at::text, NULL, NULL,
    'Listada no catálogo; abertura e prazo não verificados',
    CASE WHEN s.regions_listing ILIKE '%Brazil%' THEN 'Brasil listado na origem; edição e demais critérios não verificados'
      WHEN s.regions_listing ILIKE '%Not in European Union%' THEN 'Grupo fora da UE listado; Brasil não especificado individualmente'
      ELSE 'Brasil não listado individualmente; elegibilidade não verificada' END,
    NULL, nullif(s.regions_listing, ''),
    CASE WHEN s.category = 'Other scholarships' THEN NULL ELSE 'Sweden' END,
    NULL,
    CASE WHEN s.category = 'Other scholarships' THEN
      'Catálogo Study in Sweden; destino deste programa externo não confirmado individualmente'
      ELSE 'Catálogo Study in Sweden; condições da instituição ou do Swedish Institute devem ser confirmadas' END
  FROM study_in_sweden_imports s
  WHERE s.catalog_status = 'listed' AND ($2 = '' OR $2 = 'suecia')

  UNION ALL

  SELECT 'efg_finland', e.source_id::text, e.title, left(e.summary, 420),
    'European Funding Guide · Finland', e.source_url, e.provider_url, e.fetched_at::text,
    CASE WHEN e.deadline_date IS NOT NULL THEN to_char(e.deadline_date, 'DD/MM/YYYY') ELSE NULL END,
    left(e.amount_detail, 500),
    CASE WHEN e.deadline_date < CURRENT_DATE THEN 'Prazo da edição informada encerrado; próxima edição não verificada'
      ELSE 'Abertura e prazo atual não verificados' END,
    e.brazil_criteria, e.field_of_study, e.nationality_listing, e.destinations,
    e.study_level, e.country_basis
  FROM efg_finland_imports e
  WHERE e.catalog_status = 'listed' AND ($2 = '' OR $2 = 'finlandia')

  UNION ALL

  SELECT 'efg_denmark', e.source_id, e.title, left(e.summary, 420),
    'European Funding Guide · Denmark', e.source_url, e.provider_url, e.fetched_at::text,
    CASE WHEN e.deadline_date IS NOT NULL THEN to_char(e.deadline_date, 'DD/MM/YYYY') ELSE NULL END,
    left(e.amount_detail, 500),
    CASE WHEN e.deadline_date < CURRENT_DATE THEN 'Prazo da edição informada encerrado; próxima edição não verificada'
      WHEN e.deadline_date IS NOT NULL THEN 'Prazo divulgado para a edição 2026; abertura não verificada'
      ELSE 'Abertura e prazo atual não verificados' END,
    e.brazil_criteria, e.field_of_study, e.nationality_listing, e.destinations,
    e.study_level, e.country_basis
  FROM efg_denmark_imports e
  WHERE e.catalog_status = 'listed' AND ($2 = '' OR $2 = 'dinamarca')

  UNION ALL

  SELECT 'global_admissions_belgium', g.source_id, g.title,
    CASE WHEN g.title ILIKE 'Erasmus Mundus%' THEN
      'Mestrado conjunto Erasmus Mundus; confira em quais países ocorrerão as etapas.'
      ELSE 'Oportunidade listada para estudantes brasileiros pela Global Admissions.' END,
    'Global Admissions · Brasil → Bélgica', g.source_url, g.provider_url, g.fetched_at::text,
    CASE WHEN g.deadline_detail IS NOT NULL THEN left(g.deadline_detail, 220) || ' · confira a edição atual'
      WHEN g.deadline_listing = 'Rolling' THEN 'Janela variável na listagem; confira o edital'
      ELSE 'Mês indicado: ' || g.deadline_listing || ' (ano não confirmado)' END,
    g.coverage_listing,
    'Listada pela plataforma; abertura e benefícios devem ser confirmados no edital',
    CASE WHEN g.nationality_detail ILIKE '%Global South%' THEN
      'Página para brasileiros; confira a lista de países aprovada pelo programa'
      WHEN g.open_to_all_listing THEN
      'Página para brasileiros e sem restrição de nacionalidade na listagem; demais critérios não verificados'
      ELSE 'Página para brasileiros; elegibilidade individual não confirmada' END,
    NULL, g.nationality_detail, g.destination_listing, g.study_level,
    CASE WHEN g.title ILIKE 'Erasmus Mundus%' THEN
      'Bélgica listada pela Global Admissions; mestrados conjuntos podem incluir estudo em outros países'
      ELSE 'Bélgica listada pela Global Admissions; confira instituição, curso e edital oficiais' END
  FROM global_admissions_belgium_imports g
  WHERE g.catalog_status = 'listed' AND ($2 = '' OR $2 = 'belgica')

  UNION ALL

  SELECT 'scholarshipsads_norway', n.source_id, n.title,
    left(coalesce(n.summary, ''), 420),
    'ScholarshipsAds · Norway', n.source_url, NULL::text, n.fetched_at::text,
    CASE WHEN n.deadline_date_listing IS NOT NULL THEN
      to_char(n.deadline_date_listing, 'DD/MM/YYYY') || ' (edição listada)'
      ELSE NULL END,
    n.amount_listing,
    CASE WHEN n.deadline_date_listing < CURRENT_DATE THEN
      'Prazo da edição listada encerrado; reabertura não confirmada'
      WHEN n.deadline_date_listing IS NOT NULL THEN
      'Prazo listado pela plataforma; abertura não verificada'
      ELSE 'Prazo e abertura não confirmados' END,
    CASE WHEN n.nationality_listing ILIKE '%International Students%' THEN
      'Estudantes internacionais na listagem; Brasil não confirmado individualmente'
      ELSE 'Brasil não confirmado nos critérios listados' END,
    n.field_of_study, n.nationality_listing, n.destinations, n.study_level,
    'Noruega listada pela plataforma; confira edital oficial e destino específico'
  FROM scholarshipsads_norway_imports n
  WHERE n.catalog_status = 'listed' AND ($2 = '' OR $2 = 'noruega')

  UNION ALL

  SELECT 'study_taiwan', t.source_id, t.title,
    'Entrada do catálogo Study in Taiwan vinculada a ' || t.institution || '.',
    'Study in Taiwan · catálogo', t.source_url, t.provider_url, t.fetched_at::text,
    NULL::text, NULL::text,
    'Listada no catálogo; abertura e edital vigente não verificados',
    'Brasil não informado na listagem; confira os critérios do programa',
    NULL::text, NULL::text, t.destination, NULL::text,
    'Taiwan indicado no catálogo; confira instituição, benefícios e regras na fonte responsável'
  FROM study_taiwan_imports t
  WHERE t.catalog_status = 'listed' AND ($2 = '' OR $2 = 'taiwan')

  UNION ALL

  SELECT 'study_hong_kong', h.source_id, h.title, left(h.description, 420),
    'Study in Hong Kong · Education Bureau', h.source_url, h.provider_url, h.fetched_at::text,
    NULL::text,
    CASE WHEN h.amount_reference_year IS NOT NULL THEN h.amount_reference_year || ': ' || h.amount_listing
      ELSE h.amount_listing END,
    'Descrita na fonte governamental; inscrição e prazo atuais não confirmados',
    CASE WHEN h.nationality_listing ~ '^Students from (Indonesia|Malaysia|Thailand|Myanmar|Mongolia|Kazakhstan)$'
      THEN 'Não: modalidade destinada a estudantes de ' || replace(h.nationality_listing, 'Students from ', '') || ' segundo a fonte'
      WHEN h.nationality_listing = 'Students from Belt and Road countries'
      THEN 'Brasil não confirmado entre os países elegíveis desta modalidade'
      ELSE 'Brasil não citado nominalmente; confira os requisitos individuais' END,
    NULL::text, h.nationality_listing, h.destination, h.study_level,
    'Hong Kong indicado pelo Education Bureau; benefícios e candidatura devem ser confirmados no programa'
  FROM study_hong_kong_imports h
  WHERE h.catalog_status = 'listed' AND ($2 = '' OR $2 = 'hong-kong')

  UNION ALL

  SELECT 'scholarship_guide_singapore', s.source_id, s.title,
    left(coalesce(s.description_listing, ''), 420),
    'Scholarship Guide · Other Citizen', s.source_url, NULL::text, s.fetched_at::text,
    CASE WHEN s.deadline_date IS NOT NULL THEN to_char(s.deadline_date, 'DD/MM/YYYY') || ' (fonte consultada)'
      ELSE NULL END,
    CASE WHEN length(s.award_value) > 700 THEN left(s.award_value, 700) || '… Consulte a ficha completa.'
      ELSE s.award_value END,
    CASE WHEN s.deadline_date < CURRENT_DATE THEN 'Prazo da edição listada encerrado; próxima edição não verificada'
      WHEN s.deadline_date IS NOT NULL THEN 'Prazo futuro na fonte coletada; abertura atual não verificada'
      WHEN s.status_listing = 'Application Cycle Closed' THEN 'Ciclo fechado segundo a fonte'
      ELSE 'Prazo e abertura não informados pela fonte' END,
    CASE WHEN s.title ILIKE 'ASEAN Undergraduate Scholarship%' OR
      s.requirements ~* 'Only Malaysian citizens|citizens? of (an? )?ASEAN|citizens from ASEAN|Singapore Citizen or ASEAN Citizen|Singaporean / ASEAN|Singapore Citizens and citizens of ASEAN'
      THEN 'Não: a ficha exige cidadania de país da ASEAN ou da Malásia'
      WHEN s.requirements ILIKE '%Non-Singaporeans are required to have obtained Singapore citizenship%'
      THEN 'Exige cidadania de Singapura antes do início; confira a ficha'
      WHEN s.requirements ILIKE '%Open to all nationalities%' OR s.requirements ILIKE '%All nationalities%'
      THEN 'Todas as nacionalidades mencionadas na ficha; demais requisitos não verificados'
      ELSE 'Other Citizen na listagem; elegibilidade brasileira individual não confirmada' END,
    CASE WHEN s.course_of_study = 'All Courses' THEN 'Todas as áreas'
      ELSE s.course_of_study END,
    s.nationality_listing, s.locations, s.student_level,
    'Singapura indicada em Locations; outras exigências e possíveis destinos devem ser conferidos na ficha'
  FROM scholarship_guide_singapore_imports s
  WHERE s.catalog_status = 'listed' AND ($2 = '' OR $2 = 'singapura')

  UNION ALL

  SELECT 'education_malaysia', e.source_id, e.course,
    'Curso listado com bolsa por ' || e.provider || '. Consulte a ficha para critérios e detalhes de inscrição.',
    'Education Malaysia · catálogo', e.source_url, NULL::text, e.fetched_at::text,
    NULL::text, e.award_listing,
    'Listada no catálogo; abertura e prazo não informados',
    CASE WHEN e.provider ILIKE '%Republic of Maldives%'
      THEN 'Parceria com órgão das Maldivas; elegibilidade brasileira não confirmada'
      ELSE 'Brasil não citado nominalmente; confira os critérios da ficha' END,
    e.course,
    CASE WHEN e.provider ILIKE '%Republic of Maldives%' THEN 'Parceiro das Maldivas citado; nacionalidades elegíveis não confirmadas'
      ELSE NULL::text END,
    'Malaysia', e.study_level,
    'Listagem do portal Education Malaysia; confirme o campus e os critérios na ficha individual'
  FROM education_malaysia_imports e
  WHERE e.catalog_status = 'listed' AND ($2 = '' OR $2 = 'malasia')

  UNION ALL

  SELECT 'studyspy_nz', n.source_id, n.title,
    left(coalesce(n.description, '') || CASE WHEN n.provider_name IS NOT NULL
      THEN ' · ' || n.provider_name ELSE '' END, 420),
    'StudySpy · catálogo da Nova Zelândia', n.source_url,
    coalesce(n.provider_url, n.application_form_url), n.fetched_at::text,
    CASE WHEN n.is_always_open THEN 'Inscrições contínuas segundo a fonte; confirme vigência'
      WHEN n.close_date IS NOT NULL THEN to_char(n.close_date, 'DD/MM/YYYY') || ' (fuso não informado)'
      ELSE NULL::text END,
    n.value_description,
    CASE WHEN n.is_always_open THEN 'Inscrições contínuas na fonte coletada; confirme vigência'
      WHEN n.close_date < CURRENT_DATE THEN 'Prazo da edição listada encerrado; próxima edição não verificada'
      WHEN n.is_open_listing = true THEN 'Aberta segundo a fonte na coleta; confirme vigência'
      WHEN n.is_open_listing = false THEN 'Fechada segundo a fonte na coleta'
      ELSE 'Abertura não informada pela fonte' END,
    CASE WHEN n.eligible_countries ? 'Brazil' OR n.eligible_countries ? 'br'
      THEN 'Brasil listado entre os países; demais requisitos não verificados'
      WHEN jsonb_array_length(n.eligible_countries) > 0
      THEN 'Brasil não aparece na lista de países da fonte; confira a ficha'
      ELSE 'Categoria internacional; elegibilidade brasileira não confirmada' END,
    n.subject_or_faculty,
    CASE WHEN jsonb_array_length(n.eligible_countries) > 12
      THEN CASE WHEN n.eligible_countries ? 'Brazil' THEN 'Brazil está na lista. ' ELSE '' END ||
        array_to_string(ARRAY(SELECT value FROM jsonb_array_elements_text(n.eligible_countries) AS value LIMIT 12), ', ') ||
        ' e mais países (consulte a ficha)'
      WHEN jsonb_array_length(n.eligible_countries) > 0
      THEN array_to_string(ARRAY(SELECT value FROM jsonb_array_elements_text(n.eligible_countries) AS value), ', ')
      ELSE n.nationality_category END,
    'New Zealand',
    array_to_string(ARRAY(SELECT value FROM jsonb_array_elements_text(n.study_levels) AS value), ', '),
    'StudySpy reúne bolsas de instituições neozelandesas; confirme local de estudo e requisitos no provedor'
  FROM studyspy_nz_imports n
  WHERE n.catalog_status = 'listed' AND ($2 = '' OR $2 = 'nova-zelandia')

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
