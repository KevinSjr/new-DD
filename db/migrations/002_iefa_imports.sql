CREATE TABLE scholarship_imports (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source text NOT NULL CHECK (source = 'iefa'),
  source_id text NOT NULL,
  source_url text NOT NULL CHECK (source_url ~ '^https://www\.iefa\.org/scholarships/'),
  title text NOT NULL,
  field_of_study text NOT NULL DEFAULT '',
  description_excerpt text NOT NULL DEFAULT '',
  nationality_listing text NOT NULL DEFAULT '',
  host_countries_listing text NOT NULL DEFAULT '',
  source_filter text NOT NULL,
  fetched_at timestamptz NOT NULL,
  review_status text NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','reviewed','rejected')),
  scholarship_id bigint REFERENCES scholarships(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source, source_id),
  UNIQUE (source_url)
);
CREATE INDEX scholarship_imports_review_idx ON scholarship_imports (review_status, fetched_at DESC);
