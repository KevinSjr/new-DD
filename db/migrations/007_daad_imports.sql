CREATE TABLE daad_imports (
  source_id bigint PRIMARY KEY CHECK (source_id > 0),
  source_url text NOT NULL UNIQUE CHECK (source_url ~ '^https://www2\.daad\.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/\?detail='),
  title text NOT NULL,
  description_excerpt text NOT NULL DEFAULT '',
  is_daad boolean NOT NULL,
  brazil_listed boolean NOT NULL,
  origin_count integer NOT NULL CHECK (origin_count >= 0),
  study_levels text NOT NULL DEFAULT '',
  fields_of_study text NOT NULL DEFAULT '',
  purposes text NOT NULL DEFAULT '',
  deadline_brazil text NOT NULL DEFAULT '',
  deadline_general text NOT NULL DEFAULT '',
  deadline_detail text NOT NULL DEFAULT '',
  amount_detail text NOT NULL DEFAULT '',
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX daad_imports_catalog_idx ON daad_imports (catalog_status, brazil_listed, fetched_at DESC);
