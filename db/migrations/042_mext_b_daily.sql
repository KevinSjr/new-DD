ALTER TABLE mext_questions DROP CONSTRAINT mext_questions_answer_type_check;
ALTER TABLE mext_questions ADD CONSTRAINT mext_questions_answer_type_check
  CHECK (answer_type IN ('choice', 'numeric', 'true-false', 'text'));

ALTER TABLE mext_daily_runs DROP CONSTRAINT mext_daily_runs_pkey;
ALTER TABLE mext_daily_runs DROP CONSTRAINT mext_daily_runs_subject_check;
ALTER TABLE mext_daily_runs ADD COLUMN track text NOT NULL DEFAULT 'A'
  CHECK (track IN ('A', 'B'));
ALTER TABLE mext_daily_runs ADD CONSTRAINT mext_daily_runs_subject_check
  CHECK (subject IN ('english', 'math', 'japanese', 'physics', 'chemistry', 'biology'));
ALTER TABLE mext_daily_runs ADD PRIMARY KEY (token_hash, day, track, subject);
