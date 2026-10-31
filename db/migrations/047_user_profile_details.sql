ALTER TABLE user_profiles
  ADD COLUMN full_name text CHECK (full_name IS NULL OR length(full_name) <= 120),
  ADD COLUMN school_name text CHECK (school_name IS NULL OR length(school_name) <= 120),
  ADD COLUMN school_year text CHECK (school_year IS NULL OR length(school_year) <= 80),
  ADD COLUMN city text CHECK (city IS NULL OR length(city) <= 100),
  ADD COLUMN state_code text CHECK (state_code IS NULL OR state_code ~ '^[A-Z]{2}$'),
  ADD COLUMN gpa numeric(3,2) CHECK (gpa BETWEEN 0 AND 4),
  ADD COLUMN sat_score integer CHECK (sat_score BETWEEN 400 AND 1600),
  ADD COLUMN toefl_score integer CHECK (toefl_score BETWEEN 0 AND 120),
  ADD COLUMN ielts_score numeric(2,1) CHECK (ielts_score BETWEEN 0 AND 9),
  ADD COLUMN languages text[] NOT NULL DEFAULT '{}',
  ADD COLUMN planned_exams text[] NOT NULL DEFAULT '{}',
  ADD COLUMN target_year text CHECK (target_year IN ('2027','2028','2029-plus','undecided'));

CREATE TABLE user_profile_destinations (
  user_id bigint NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  country_slug text NOT NULL REFERENCES countries(slug) ON DELETE CASCADE,
  position smallint NOT NULL CHECK (position BETWEEN 1 AND 3),
  PRIMARY KEY (user_id, country_slug),
  UNIQUE (user_id, position)
);

INSERT INTO user_profile_destinations (user_id, country_slug, position)
SELECT user_id, destination_slug, 1 FROM user_profiles WHERE destination_slug IS NOT NULL;
