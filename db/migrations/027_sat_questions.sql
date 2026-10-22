CREATE TABLE sat_questions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  form_code text NOT NULL DEFAULT 'practice-4',
  section text NOT NULL CHECK (section IN ('reading-writing', 'math')),
  module_number smallint NOT NULL CHECK (module_number IN (1, 2)),
  question_number smallint NOT NULL CHECK (question_number BETWEEN 1 AND 33),
  passage text NOT NULL DEFAULT '',
  prompt text NOT NULL,
  choices jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(choices) = 'array'),
  answer_type text NOT NULL CHECK (answer_type IN ('multiple-choice', 'numeric')),
  accepted_answers text[] NOT NULL,
  explanation text NOT NULL DEFAULT '',
  image_path text,
  source_url text NOT NULL,
  source_page smallint,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT sat_questions_answer_present CHECK (cardinality(accepted_answers) > 0),
  CONSTRAINT sat_questions_publish_complete CHECK (
    status <> 'published' OR (deleted_at IS NULL AND length(trim(prompt)) > 0 AND length(trim(explanation)) > 0)
  )
);

CREATE INDEX sat_questions_public_idx ON sat_questions (form_code, section, module_number, question_number)
  WHERE status = 'published' AND deleted_at IS NULL;
CREATE UNIQUE INDEX sat_questions_active_position_idx ON sat_questions (form_code, section, module_number, question_number)
  WHERE deleted_at IS NULL;

CREATE TABLE sat_daily_runs (
  token_hash text NOT NULL,
  day date NOT NULL,
  question_ids bigint[] NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  lives smallint NOT NULL DEFAULT 3 CHECK (lives BETWEEN 0 AND 3),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (token_hash, day)
);

CREATE INDEX sat_daily_runs_day_idx ON sat_daily_runs (day);
