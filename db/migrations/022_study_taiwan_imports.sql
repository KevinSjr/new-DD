CREATE TABLE study_taiwan_imports (
  source_id text PRIMARY KEY CHECK (source_id ~ '^[0-9a-f]{24}$'),
  title text NOT NULL,
  source_title text NOT NULL,
  institution text NOT NULL,
  institution_type text,
  funding_category text,
  sponsor_tag text,
  destination text NOT NULL CHECK (destination = 'Taiwan'),
  source_url text NOT NULL CHECK (source_url ~ '^https://www[.]studyintaiwan[.]org/how-to-apply/scholarship'),
  provider_url text CHECK (provider_url ~ '^https?://'),
  listing_page integer NOT NULL CHECK (listing_page > 0),
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX study_taiwan_catalog_idx ON study_taiwan_imports (catalog_status, fetched_at DESC);
