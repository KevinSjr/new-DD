ALTER TABLE user_league_activity DROP CONSTRAINT user_league_activity_points_check;

UPDATE user_league_activity SET points = correct * 10;

ALTER TABLE user_league_activity
  ADD CONSTRAINT user_league_activity_points_check CHECK (points = correct * 10),
  ADD CONSTRAINT user_league_activity_answers_check CHECK (answered >= correct);
