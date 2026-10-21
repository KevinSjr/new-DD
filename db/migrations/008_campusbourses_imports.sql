CREATE TABLE campusbourses_imports (
  source_id integer PRIMARY KEY CHECK (source_id > 0),
  source_url text NOT NULL UNIQUE CHECK (source_url ~ '^https://campusbourses\.campusfrance\.org/#/program/[0-9]+\?lang=en$'),
  title text NOT NULL,
  description_excerpt text NOT NULL DEFAULT '',
  amount_detail text NOT NULL DEFAULT '',
  deadline_date date,
  study_levels text NOT NULL DEFAULT '',
  fields_of_study text NOT NULL DEFAULT '',
  nationality_listing text NOT NULL DEFAULT '',
  brazil_listed boolean NOT NULL DEFAULT false,
  translation_method text NOT NULL CHECK (translation_method IN ('source_en', 'machine')),
  source_updated_at date,
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX campusbourses_imports_catalog_idx ON campusbourses_imports (catalog_status, brazil_listed, fetched_at DESC);
