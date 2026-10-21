CREATE TABLE study_in_sweden_imports (
  source_id integer PRIMARY KEY CHECK (source_id > 0),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('University scholarships', 'Other scholarships', 'Swedish Institute scholarships')),
  university text NOT NULL DEFAULT '',
  regions_listing text NOT NULL DEFAULT '',
  original_provider_url text NOT NULL CHECK (original_provider_url ~ '^https?://'),
  provider_url text CHECK (provider_url ~ '^https://'),
  source_modified_at timestamptz,
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX study_in_sweden_imports_catalog_idx ON study_in_sweden_imports (catalog_status, fetched_at DESC);
