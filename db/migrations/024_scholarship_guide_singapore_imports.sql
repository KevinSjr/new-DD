CREATE TABLE scholarship_guide_singapore_imports (
  source_id text PRIMARY KEY CHECK (source_id ~ '^[0-9]+$'),
  title text NOT NULL,
  source_url text NOT NULL CHECK (source_url ~ '^https://www[.]scholarshipguide[.]com[.]sg/scholarship/'),
  description_listing text,
  status_listing text NOT NULL,
  student_level text NOT NULL,
  nationality_listing text NOT NULL CHECK (nationality_listing LIKE '%Other Citizen%'),
  institutions text,
  term text,
  locations text NOT NULL CHECK (locations LIKE '%Singapore%'),
  listing_page integer NOT NULL CHECK (listing_page > 0),
  deadline_detail text,
  deadline_date date,
  course_of_study text,
  award_value text,
  requirements text,
  fetched_at timestamptz NOT NULL,
  catalog_status text NOT NULL DEFAULT 'listed' CHECK (catalog_status IN ('listed', 'reviewed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX scholarship_guide_singapore_catalog_idx
  ON scholarship_guide_singapore_imports (catalog_status, fetched_at DESC);
