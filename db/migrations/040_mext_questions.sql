CREATE TABLE mext_questions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  edition smallint NOT NULL CHECK (edition BETWEEN 2000 AND 2100),
  track text NOT NULL CHECK (track IN ('A', 'B')),
  subject text NOT NULL CHECK (subject IN ('english', 'math', 'japanese', 'physics', 'chemistry', 'biology')),
  section text NOT NULL,
  item_code text NOT NULL,
  position smallint NOT NULL CHECK (position > 0),
  prompt text NOT NULL,
  transcript text NOT NULL DEFAULT '',
  asset_paths text[] NOT NULL DEFAULT '{}',
  answer_type text NOT NULL CHECK (answer_type IN ('choice', 'numeric', 'true-false')),
  choices jsonb NOT NULL CHECK (jsonb_typeof(choices) = 'array'),
  accepted_answers text[] NOT NULL CHECK (cardinality(accepted_answers) > 0),
  points smallint NOT NULL CHECK (points > 0),
  source_url text NOT NULL CHECK (source_url LIKE 'https://%'),
  source_page smallint NOT NULL CHECK (source_page > 0),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (edition, track, subject, section, item_code)
);

CREATE INDEX mext_questions_public_idx ON mext_questions (edition, track, subject, position)
  WHERE status = 'published';

CREATE TABLE mext_daily_runs (
  token_hash text NOT NULL,
  day date NOT NULL,
  subject text NOT NULL CHECK (subject IN ('english', 'math', 'japanese')),
  question_ids bigint[] NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  lives smallint NOT NULL DEFAULT 3 CHECK (lives BETWEEN 0 AND 3),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (token_hash, day, subject)
);
CREATE INDEX mext_daily_runs_day_idx ON mext_daily_runs (day);
