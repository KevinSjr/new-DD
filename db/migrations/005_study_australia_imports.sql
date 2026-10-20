CREATE TABLE study_australia_imports (
  source_id text PRIMARY KEY CHECK (source_id ~ '^[a-f0-9]{32}$'),
  source_url text NOT NULL UNIQUE CHECK (source_url ~ '^https://search\.studyaustralia\.gov\.au/scholarship/'),
  title text NOT NULL,
  description_excerpt text NOT NULL DEFAULT '',
  eligibility_text text NOT NULL DEFAULT '',
  providers text NOT NULL DEFAULT '',
  deadline_text text NOT NULL DEFAULT '',
  amount_annual numeric(14,2),
  amount_max numeric(14,2),
  amount_comment text NOT NULL DEFAULT '',
  nationality_listing text NOT NULL DEFAULT '',
  international_students boolean,
  australian_students boolean,
  tenable_overseas boolean,
  study_levels text NOT NULL DEFAULT '',
  fields_of_study text NOT NULL DEFAULT '',
  provider_url text,
  fetched_at timestamptz NOT NULL,
  review_status text NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','reviewed','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX study_australia_imports_review_idx ON study_australia_imports (review_status, tenable_overseas, fetched_at DESC);
