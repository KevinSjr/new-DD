CREATE TABLE user_journey_tasks (
  user_id bigint NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  task_key text NOT NULL CHECK (length(task_key) BETWEEN 1 AND 60),
  status text NOT NULL CHECK (status IN ('done', 'skipped')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, task_key)
);

CREATE TABLE user_journey_deadlines (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 2 AND 120),
  due_date date NOT NULL,
  note text CHECK (note IS NULL OR length(note) <= 500),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX user_journey_deadlines_user_date_idx ON user_journey_deadlines (user_id, due_date);
