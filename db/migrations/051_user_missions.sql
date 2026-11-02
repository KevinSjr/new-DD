CREATE TABLE user_mission_awards (
  user_id bigint NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  mission_key text NOT NULL CHECK (length(mission_key) BETWEEN 2 AND 60),
  period_key text NOT NULL CHECK (length(period_key) BETWEEN 4 AND 12),
  xp integer NOT NULL CHECK (xp BETWEEN 1 AND 100),
  awarded_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, mission_key, period_key)
);

CREATE INDEX user_mission_awards_recent_idx ON user_mission_awards (user_id, awarded_at DESC);

CREATE TABLE user_mission_challenge_claims (
  source text NOT NULL CHECK (source IN ('sat','mext')),
  day date NOT NULL,
  variant text NOT NULL CHECK (length(variant) BETWEEN 2 AND 40),
  token_hash char(64) NOT NULL CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  user_id bigint NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  claimed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (source, day, variant, token_hash)
);

CREATE INDEX user_mission_challenge_days_idx ON user_mission_challenge_claims (user_id, day);
