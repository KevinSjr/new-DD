ALTER TABLE user_league_memberships DROP CONSTRAINT user_league_memberships_source_check;
ALTER TABLE user_league_memberships ADD CONSTRAINT user_league_memberships_source_check
  CHECK (source IN ('sat','sat-reading-writing','sat-math','mext'));

-- Keep the legacy SAT records for history, and enroll existing members in both new areas.
INSERT INTO user_league_memberships (user_id,source,alias,joined_at)
SELECT user_id,'sat-reading-writing',alias,joined_at FROM user_league_memberships WHERE source='sat'
UNION ALL
SELECT user_id,'sat-math',alias,joined_at FROM user_league_memberships WHERE source='sat'
ON CONFLICT (user_id,source) DO NOTHING;

-- Recover area-specific results while the original daily runs still exist.
WITH candidates AS (
  SELECT c.user_id, 'sat-' || c.variant AS source, c.day,
    (score.correct * 10)::smallint AS points, score.correct, score.answered
  FROM user_mission_challenge_claims c
  JOIN sat_daily_runs r ON r.token_hash=c.token_hash AND r.day=c.day AND r.section=c.variant
  JOIN user_league_memberships m ON m.user_id=c.user_id AND m.source='sat-' || c.variant
  CROSS JOIN LATERAL (
    SELECT count(*) FILTER (WHERE item->>'correct'='true')::smallint AS correct,
      count(*)::smallint AS answered
    FROM jsonb_array_elements(r.answers) item
  ) score
  WHERE c.source='sat' AND c.variant IN ('reading-writing','math') AND score.answered>0
), best AS (
  SELECT DISTINCT ON (user_id,source,day) * FROM candidates
  ORDER BY user_id,source,day,points DESC,(answered-correct) ASC
)
INSERT INTO user_league_activity (user_id,source,day,points,correct,answered)
SELECT user_id,source,day,points,correct,answered FROM best
ON CONFLICT (user_id,source,day) DO NOTHING;
