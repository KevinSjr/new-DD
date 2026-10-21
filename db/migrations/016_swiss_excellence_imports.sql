CREATE TABLE swiss_excellence_imports (
  source_id text PRIMARY KEY,
  title text NOT NULL,
  summary text NOT NULL,
  edition text NOT NULL,
  source_url text NOT NULL CHECK (source_url LIKE 'https://www.sbfi.admin.ch/%'),
  country_details_url text NOT NULL CHECK (country_details_url LIKE 'https://www.sbfi.admin.ch/%'),
  application_url text NOT NULL CHECK (application_url LIKE 'https://www.go.eskas.ch/%'),
  opening_date date NOT NULL,
  deadline_date date NOT NULL,
  deadline_timezone text NOT NULL,
  amount_monthly_chf integer NOT NULL CHECK (amount_monthly_chf > 0),
  duration text NOT NULL,
  study_level text NOT NULL,
  field_of_study text NOT NULL,
  brazil_listed boolean NOT NULL,
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (opening_date <= deadline_date)
);
CREATE INDEX swiss_excellence_imports_catalog_idx ON swiss_excellence_imports (catalog_status, deadline_date);
