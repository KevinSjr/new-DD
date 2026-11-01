CREATE TABLE user_gpa_estimates (
  user_id bigint PRIMARY KEY REFERENCES user_accounts(id) ON DELETE CASCADE,
  bands_gpa numeric(12,8) NOT NULL CHECK (bands_gpa BETWEEN 0 AND 4),
  proportional_gpa numeric(12,8) NOT NULL CHECK (proportional_gpa BETWEEN 0 AND 4),
  letters_gpa numeric(12,8) NOT NULL CHECK (letters_gpa BETWEEN 0 AND 4),
  source_average numeric(12,8) NOT NULL CHECK (source_average BETWEEN 0 AND 10),
  input_mode text NOT NULL CHECK (input_mode IN ('average','courses')),
  weighted boolean NOT NULL,
  passing_grade numeric(4,2) CHECK (passing_grade BETWEEN 0 AND 10),
  include_failed boolean,
  saved_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gpa_options_by_mode CHECK (
    (input_mode='average' AND weighted=false AND passing_grade IS NULL AND include_failed IS NULL)
    OR (input_mode='courses' AND passing_grade IS NOT NULL AND include_failed IS NOT NULL)
  )
);
