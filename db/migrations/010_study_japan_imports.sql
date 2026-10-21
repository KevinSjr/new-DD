CREATE TABLE study_japan_imports (
  source_id text PRIMARY KEY CHECK (source_id ~ '^[0-9-]+$'),
  source_url text NOT NULL UNIQUE CHECK (source_url ~ '^https://www\.studyinjapan\.go\.jp/en/search-for-scholarships/detail\.php\?lang=en&mid=[0-9-]+$'),
  title text NOT NULL,
  organization text NOT NULL DEFAULT '',
  description_excerpt text NOT NULL DEFAULT '',
  support_types text NOT NULL DEFAULT '',
  amount_detail text NOT NULL DEFAULT '',
  deadline_text text NOT NULL DEFAULT '',
  fields_of_study text NOT NULL DEFAULT '',
  nationality_listing text NOT NULL DEFAULT '',
  designated_regions text NOT NULL DEFAULT '',
  study_levels text NOT NULL DEFAULT '',
  application_url text,
  brazil_mentioned boolean NOT NULL DEFAULT false,
  source_updated_at date,
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX study_japan_imports_catalog_idx ON study_japan_imports (catalog_status, fetched_at DESC);
