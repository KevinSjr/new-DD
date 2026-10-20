CREATE TABLE scholarship_america_imports (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source_id bigint NOT NULL UNIQUE,
  source_url text NOT NULL UNIQUE CHECK (source_url ~ '^https://scholarshipamerica\.org/scholarship/'),
  title text NOT NULL,
  description_excerpt text NOT NULL DEFAULT '',
  eligibility_text text NOT NULL DEFAULT '',
  award_amount text NOT NULL DEFAULT '',
  listing_status text NOT NULL CHECK (listing_status IN ('open','closed','unknown')),
  open_date text,
  close_date text,
  date_timezone text,
  brazil_mentioned boolean NOT NULL DEFAULT false,
  fetched_at timestamptz NOT NULL,
  review_status text NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','reviewed','rejected')),
  scholarship_id bigint REFERENCES scholarships(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX scholarship_america_imports_review_idx ON scholarship_america_imports (review_status, brazil_mentioned, listing_status);
