CREATE TABLE user_league_memberships (
  user_id bigint NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('sat','mext')),
  alias text NOT NULL CHECK (alias ~ '^Explorador [A-F0-9]{6}$'),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, source),
  UNIQUE (source, alias)
);

CREATE TABLE user_league_activity (
  user_id bigint NOT NULL,
  source text NOT NULL,
  day date NOT NULL,
  points smallint NOT NULL CHECK (points BETWEEN 20 AND 70),
  correct smallint NOT NULL CHECK (correct BETWEEN 0 AND 5),
  answered smallint NOT NULL CHECK (answered BETWEEN 1 AND 5),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, source, day),
  FOREIGN KEY (user_id, source) REFERENCES user_league_memberships(user_id, source) ON DELETE CASCADE
);

CREATE INDEX user_league_activity_week_idx ON user_league_activity (source, day, user_id);
