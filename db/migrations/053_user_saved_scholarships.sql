CREATE TABLE user_saved_scholarships (
  user_id bigint NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  source text NOT NULL CHECK (length(source) BETWEEN 1 AND 80),
  source_id text NOT NULL CHECK (length(source_id) BETWEEN 1 AND 200),
  title text NOT NULL,
  source_label text NOT NULL,
  source_url text NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, source, source_id)
);

CREATE INDEX user_saved_scholarships_recent_idx ON user_saved_scholarships (user_id, saved_at DESC);
