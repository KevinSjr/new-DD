CREATE TABLE italy_maeci_imports (
  source_id text PRIMARY KEY,
  title text NOT NULL,
  summary text NOT NULL,
  source_url text NOT NULL UNIQUE CHECK (source_url LIKE 'https://www.esteri.it/%'),
  program_url text NOT NULL CHECK (program_url LIKE 'https://www.esteri.it/%'),
  application_url text NOT NULL CHECK (application_url LIKE 'https://studyinitaly.esteri.it/%'),
  eligible_countries_url text NOT NULL CHECK (eligible_countries_url LIKE 'https://www.esteri.it/%'),
  deadline_date date NOT NULL,
  deadline_timezone text NOT NULL,
  amount_regular_eur integer NOT NULL CHECK (amount_regular_eur > 0),
  amount_language_eur integer NOT NULL CHECK (amount_language_eur > 0),
  study_levels text NOT NULL,
  brazil_listed boolean NOT NULL,
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX italy_maeci_imports_catalog_idx ON italy_maeci_imports (catalog_status, fetched_at DESC);
