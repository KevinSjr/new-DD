CREATE TABLE scholarshipsads_norway_imports (
  source_id text PRIMARY KEY CHECK (source_id <> ''),
  title text NOT NULL,
  source_url text NOT NULL CHECK (source_url ~ '^https://www[.]scholarshipsads[.]com/'),
  summary text,
  amount_listing text,
  institution_listing text,
  study_level text,
  field_of_study text,
  nationality_listing text,
  destinations text NOT NULL CHECK (destinations LIKE '%Norway%'),
  status_listing text,
  deadline_date_listing date,
  listing_page integer NOT NULL CHECK (listing_page > 0),
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX scholarshipsads_norway_catalog_idx
  ON scholarshipsads_norway_imports (catalog_status, fetched_at DESC);
