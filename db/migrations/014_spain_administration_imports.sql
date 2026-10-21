CREATE TABLE spain_administration_imports (
  source_id text PRIMARY KEY CHECK (source_id ~ '^[0-9]+$'),
  source_url text NOT NULL UNIQUE CHECK (source_url LIKE 'https://administracion.gob.es/ayudas/buscador-becas-avanzado/detalle-de-ayuda--subvencion--beca-o-premio?%'),
  title text NOT NULL,
  organization text NOT NULL DEFAULT '',
  geographic_scope text NOT NULL DEFAULT '',
  beneficiaries text NOT NULL DEFAULT '',
  application_details text NOT NULL DEFAULT '',
  amount_detail text NOT NULL DEFAULT '',
  deadline_start date,
  deadline_end date,
  deadline_invalid boolean NOT NULL DEFAULT false,
  publication_date date,
  official_notice_url text,
  translation_method text NOT NULL CHECK (translation_method IN ('machine', 'source_en')),
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX spain_administration_imports_catalog_idx ON spain_administration_imports (catalog_status, fetched_at DESC);
