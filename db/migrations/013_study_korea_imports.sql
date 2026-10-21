CREATE TABLE study_korea_imports (
  source_id text PRIMARY KEY CHECK (source_id ~ '^(SCL_)?[0-9]+$'),
  source_url text NOT NULL UNIQUE CHECK (source_url LIKE 'https://www.studyinkorea.go.kr/ko/search/universityInfo.do?%'),
  university_id text NOT NULL CHECK (university_id ~ '^[0-9]+$'),
  title text NOT NULL,
  institution text NOT NULL,
  location text NOT NULL DEFAULT '',
  listing_eligibility text NOT NULL DEFAULT '',
  qualifications text NOT NULL DEFAULT '',
  benefits text NOT NULL DEFAULT '',
  personal_support text NOT NULL DEFAULT '',
  source_updated_at date,
  translation_method text NOT NULL CHECK (translation_method IN ('source_en', 'machine')),
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX study_korea_imports_catalog_idx ON study_korea_imports (catalog_status, fetched_at DESC);
