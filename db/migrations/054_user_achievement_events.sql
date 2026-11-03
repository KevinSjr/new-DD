CREATE TABLE user_achievement_events (
  user_id bigint NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (length(kind) BETWEEN 2 AND 50),
  target text NOT NULL CHECK (length(target) BETWEEN 1 AND 240),
  details jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(details) = 'object'),
  day date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, kind, target, day)
);

CREATE INDEX user_achievement_events_kind_idx ON user_achievement_events (user_id, kind, day);

ALTER TABLE user_journey_deadlines
  ADD COLUMN saved_source text,
  ADD COLUMN saved_source_id text,
  ADD CONSTRAINT user_journey_deadline_saved_pair CHECK ((saved_source IS NULL) = (saved_source_id IS NULL)),
  ADD CONSTRAINT user_journey_deadline_saved_fk FOREIGN KEY (user_id, saved_source, saved_source_id)
    REFERENCES user_saved_scholarships (user_id, source, source_id) ON DELETE SET NULL (saved_source, saved_source_id);
