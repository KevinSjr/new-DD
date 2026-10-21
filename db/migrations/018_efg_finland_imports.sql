CREATE TABLE efg_finland_imports (
  source_id integer PRIMARY KEY CHECK (source_id > 0),
  title text NOT NULL,
  summary text NOT NULL,
  source_url text NOT NULL CHECK (source_url ~ '^https://'),
  provider_url text CHECK (provider_url ~ '^https://'),
  amount_detail text,
  deadline_date date,
  field_of_study text,
  nationality_listing text,
  study_level text,
  brazil_criteria text NOT NULL,
  destinations text,
  country_basis text NOT NULL,
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX efg_finland_imports_catalog_idx ON efg_finland_imports (catalog_status, fetched_at DESC);
