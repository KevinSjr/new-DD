CREATE TABLE global_admissions_belgium_imports (
  source_id text PRIMARY KEY CHECK (source_id <> ''),
  title text NOT NULL,
  source_url text NOT NULL CHECK (source_url ~ '^https://'),
  provider_url text CHECK (provider_url ~ '^https://'),
  coverage_listing text NOT NULL,
  study_level text NOT NULL,
  funder_type text NOT NULL,
  deadline_listing text NOT NULL,
  deadline_detail text,
  destination_listing text NOT NULL CHECK (destination_listing = 'Belgium'),
  open_to_all_listing boolean NOT NULL,
  nationality_detail text,
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX global_admissions_belgium_catalog_idx
  ON global_admissions_belgium_imports (catalog_status, fetched_at DESC);
