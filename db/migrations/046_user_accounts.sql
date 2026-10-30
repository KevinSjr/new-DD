CREATE TABLE user_accounts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL CHECK (length(email) BETWEEN 3 AND 254),
  password_hash text NOT NULL,
  display_name text NOT NULL CHECK (length(trim(display_name)) BETWEEN 2 AND 80),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX user_accounts_email_unique ON user_accounts (lower(email));

CREATE TABLE user_profiles (
  user_id bigint PRIMARY KEY REFERENCES user_accounts(id) ON DELETE CASCADE,
  study_level text CHECK (study_level IN (
    'graduacao', 'pos-graduacao', 'mestrado', 'doutorado',
    'intercambio', 'idiomas', 'curso-curto', 'pesquisa', 'outro'
  )),
  interest_area text CHECK (interest_area IS NULL OR length(interest_area) <= 100),
  destination_slug text REFERENCES countries(slug) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_sessions (
  token_hash char(64) PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  CONSTRAINT user_sessions_expiry CHECK (expires_at > created_at)
);

CREATE INDEX user_sessions_user_idx ON user_sessions (user_id);
CREATE INDEX user_sessions_expiry_idx ON user_sessions (expires_at);
