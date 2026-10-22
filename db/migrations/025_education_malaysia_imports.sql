CREATE TABLE education_malaysia_imports (
  source_id text PRIMARY KEY CHECK (source_id ~ '^[0-9]+$'),
  provider text NOT NULL,
  course text NOT NULL,
  source_url text NOT NULL CHECK (source_url LIKE 'https://educationmalaysia.gov.my/%'),
  study_level text NOT NULL,
  award_listing text,
  listing_page integer NOT NULL CHECK (listing_page > 0),
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX education_malaysia_catalog_idx
  ON education_malaysia_imports (catalog_status, fetched_at DESC);
