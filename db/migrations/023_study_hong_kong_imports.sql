CREATE TABLE study_hong_kong_imports (
  source_id text PRIMARY KEY CHECK (source_id ~ '^[0-9a-f]{24}$'),
  title text NOT NULL,
  source_url text NOT NULL CHECK (source_url ~ '^https://www[.]studyinhongkong[.]edu[.]hk/en/hong-kong-education/scholarships[.]php'),
  provider_url text NOT NULL CHECK (provider_url ~ '^https://'),
  fund_title text NOT NULL,
  description text NOT NULL,
  amount_listing text NOT NULL,
  amount_reference_year text,
  nationality_listing text NOT NULL,
  study_level text NOT NULL,
  destination text NOT NULL CHECK (destination = 'Hong Kong'),
  scheme_group text NOT NULL CHECK (scheme_group IN ('non_local', 'belt_and_road')),
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX study_hong_kong_catalog_idx ON study_hong_kong_imports (catalog_status, fetched_at DESC);
