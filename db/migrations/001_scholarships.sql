CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE countries (
  slug text PRIMARY KEY,
  name text NOT NULL UNIQUE
);

INSERT INTO countries (slug, name) VALUES
  ('estados-unidos','Estados Unidos'),('reino-unido','Reino Unido'),('canada','Canadá'),
  ('australia','Austrália'),('alemanha','Alemanha'),('franca','França'),
  ('japao','Japão'),('china','China'),('coreia-do-sul','Coreia do Sul'),
  ('espanha','Espanha'),('paises-baixos','Países Baixos'),('italia','Itália'),
  ('portugal','Portugal'),('irlanda','Irlanda'),('suica','Suíça'),
  ('suecia','Suécia'),('finlandia','Finlândia'),('dinamarca','Dinamarca'),
  ('belgica','Bélgica'),('noruega','Noruega'),('taiwan','Taiwan'),
  ('hong-kong','Hong Kong'),('singapura','Singapura'),('malasia','Malásia'),
  ('nova-zelandia','Nova Zelândia')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE scholarships (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 3 AND 200),
  organization text NOT NULL CHECK (length(trim(organization)) BETWEEN 2 AND 200),
  edition text,
  summary text NOT NULL DEFAULT '',
  eligibility text NOT NULL DEFAULT '',
  funding_details text NOT NULL DEFAULT '',
  study_level text NOT NULL CHECK (study_level IN ('graduacao','pos-graduacao','mestrado','doutorado','intercambio','idiomas','curso-curto','pesquisa','outro')),
  deadline_type text NOT NULL CHECK (deadline_type IN ('fixed','rolling','unknown')),
  deadline_date date,
  deadline_timezone text,
  application_url text,
  source_label text NOT NULL,
  source_url text NOT NULL CHECK (source_url ~ '^https://'),
  source_verified_at date NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT fixed_deadline_fields CHECK (
    (deadline_type = 'fixed' AND deadline_date IS NOT NULL AND nullif(trim(deadline_timezone),'') IS NOT NULL)
    OR (deadline_type <> 'fixed' AND deadline_date IS NULL AND deadline_timezone IS NULL)
  ),
  CONSTRAINT publish_complete CHECK (
    status <> 'published' OR (
      length(trim(summary)) > 0 AND length(trim(eligibility)) > 0 AND
      length(trim(funding_details)) > 0 AND application_url ~ '^https://'
    )
  )
);

CREATE TABLE scholarship_countries (
  scholarship_id bigint NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  country_slug text NOT NULL REFERENCES countries(slug),
  PRIMARY KEY (scholarship_id, country_slug)
);

CREATE INDEX scholarships_public_idx ON scholarships (status, deadline_date) WHERE deleted_at IS NULL;
CREATE INDEX scholarships_updated_idx ON scholarships (updated_at DESC);
CREATE INDEX scholarship_countries_country_idx ON scholarship_countries (country_slug);
