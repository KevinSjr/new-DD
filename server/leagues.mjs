import { randomBytes } from 'node:crypto'
import { database } from './db.mjs'

const sources = new Set(['sat-reading-writing','sat-math','mext'])
const fail = (status, message) => { throw Object.assign(new Error(message), { status }) }
export const leagueDay = (now = new Date()) => new Intl.DateTimeFormat('en-CA', {
  timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit',
}).format(now)
export function leagueWeekStart(day) {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7)
  return date.toISOString().slice(0,10)
}
const offsetDay = (day, count) => {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + count)
  return date.toISOString().slice(0,10)
}
export const leagueTier = points => points >= 280 ? 'gold' : points >= 140 ? 'silver' : 'bronze'
export const leagueRewardXp = points => points >= 280 ? 40 : points >= 140 ? 20 : 0
export const leaguePoints = answers => 10 * answers.filter(item => item.correct === true).length
export function leagueSource(value) {
  if (!sources.has(value)) fail(404,'Liga não encontrada.')
  return value
}

export async function joinLeague(userId, source) {
  leagueSource(source)
  for (let attempt=0;attempt<4;attempt++) {
    try {
      const alias=`Explorador ${randomBytes(3).toString('hex').toUpperCase()}`
      await database().query(`INSERT INTO user_league_memberships (user_id,source,alias)
        VALUES ($1,$2,$3) ON CONFLICT (user_id,source) DO NOTHING`, [userId,source,alias])
      const day=leagueDay()
      const isSat=source.startsWith('sat-')
      const completed=await database().query(isSat
        ? `SELECT r.answers FROM user_mission_challenge_claims c JOIN sat_daily_runs r
            ON r.token_hash=c.token_hash AND r.day=c.day AND r.section=c.variant
            WHERE c.user_id=$1 AND c.source='sat' AND c.variant=$2 AND c.day=$3::date`
        : `SELECT r.answers FROM user_mission_challenge_claims c JOIN mext_daily_runs r
            ON r.token_hash=c.token_hash AND r.day=c.day AND c.variant=r.track || ':' || r.subject
            WHERE c.user_id=$1 AND c.source='mext' AND c.day=$2::date`, isSat?[userId,source.slice(4),day]:[userId,day])
      for (const row of completed.rows) await recordLeagueActivity(database(),userId,source,day,row.answers)
      return getLeague(userId,source)
    } catch (cause) { if (cause.code !== '23505' || attempt === 3) throw cause }
  }
}

export async function leaveLeague(userId, source) {
  leagueSource(source)
  await database().query('DELETE FROM user_league_memberships WHERE user_id=$1 AND source=$2', [userId,source])
  return { left:true }
}

export async function recordLeagueActivity(client, userId, source, day, answers) {
  const member = await client.query('SELECT 1 FROM user_league_memberships WHERE user_id=$1 AND source=$2 FOR KEY SHARE', [userId,source])
  if (!member.rowCount) return
  const correct = answers.filter(item => item.correct === true).length
  const points = leaguePoints(answers)
  await client.query(`INSERT INTO user_league_activity (user_id,source,day,points,correct,answered)
    VALUES ($1,$2,$3,$4,$5,$6)
    ON CONFLICT (user_id,source,day) DO UPDATE SET
      points=EXCLUDED.points,correct=EXCLUDED.correct,answered=EXCLUDED.answered,updated_at=now()
    WHERE EXCLUDED.points > user_league_activity.points
       OR (EXCLUDED.points = user_league_activity.points
         AND EXCLUDED.answered - EXCLUDED.correct < user_league_activity.answered - user_league_activity.correct)`, [userId,source,day,points,correct,answers.length])
}

export async function reconcileLeagueRewards(userId, client = database(), now = new Date()) {
  const weekStart=leagueWeekStart(leagueDay(now))
  const scores=await client.query(`SELECT source,to_char(date_trunc('week',day::timestamp),'YYYY-MM-DD') AS week_start,
      sum(points)::int AS points FROM user_league_activity
    WHERE user_id=$1 AND source <> 'sat' AND day < $2::date
    GROUP BY source,date_trunc('week',day::timestamp)`, [userId,weekStart])
  for (const row of scores.rows) {
    const xp=leagueRewardXp(row.points)
    if (!xp) continue
    await client.query(`INSERT INTO user_mission_awards (user_id,mission_key,period_key,xp)
      VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`, [userId,`league-${row.source}-weekly`,row.week_start,xp])
  }
}

export async function getLeague(userId, source, now = new Date()) {
  leagueSource(source)
  const day=leagueDay(now)
  const weekStart=leagueWeekStart(day)
  const nextWeek=offsetDay(weekStart,7)
  const previousWeek=offsetDay(weekStart,-7)
  const daysRemaining=Math.round((Date.parse(`${nextWeek}T00:00:00Z`)-Date.parse(`${day}T00:00:00Z`))/86400000)
  const base={ source, weekStart, weekEnd:offsetDay(weekStart,6), daysRemaining,
    rules:{ completion:0, perCorrect:10, dailyLimit:source==='mext'?'Melhor desafio MEXT do dia':'Uma tentativa por área do SAT e por dia', silverAt:140, goldAt:280 } }
  const member=await database().query('SELECT alias FROM user_league_memberships WHERE user_id=$1 AND source=$2', [userId,source])
  if (!member.rowCount) return { ...base, joined:false }
  await reconcileLeagueRewards(userId)
  const result=await database().query(`WITH current_scores AS (
      SELECT user_id,sum(points)::int AS points,sum(correct)::int AS correct,
        sum(answered-correct)::int AS lives_lost,count(*)::int AS days
      FROM user_league_activity WHERE source=$1 AND day >= $2::date AND day < $3::date GROUP BY user_id
    ), previous_scores AS (
      SELECT user_id,sum(points)::int AS points FROM user_league_activity
      WHERE source=$1 AND day >= $4::date AND day < $2::date GROUP BY user_id
    ), entries AS (
      SELECT m.user_id,m.alias,coalesce(c.points,0) AS points,coalesce(c.correct,0) AS correct,
        coalesce(c.lives_lost,0) AS lives_lost,coalesce(c.days,0) AS days,coalesce(p.points,0) AS previous_points,
        CASE WHEN coalesce(p.points,0)>=280 THEN 'gold'
             WHEN coalesce(p.points,0)>=140 THEN 'silver' ELSE 'bronze' END AS tier
      FROM user_league_memberships m
      LEFT JOIN current_scores c ON c.user_id=m.user_id
      LEFT JOIN previous_scores p ON p.user_id=m.user_id
      WHERE m.source=$1
    ), ranked AS (
      SELECT user_id,alias,points,correct,lives_lost,days,previous_points,
        row_number() OVER (ORDER BY points DESC,lives_lost ASC,days DESC,alias) AS rank,
        count(*) FILTER (WHERE points>0) OVER ()::int AS participants
      FROM entries WHERE tier=(SELECT tier FROM entries WHERE user_id=$5)
    ) SELECT * FROM ranked WHERE rank<=10 OR user_id=$5 ORDER BY rank`,
    [source,weekStart,nextWeek,previousWeek,userId])
  const own=result.rows.find(row=>String(row.user_id)===String(userId))
  const tier=leagueTier(own?.previous_points||0)
  const entry=row=>({alias:row.alias,points:Number(row.points),correct:Number(row.correct),livesLost:Number(row.lives_lost),days:Number(row.days),rank:Number(row.points)>0?Number(row.rank):null,you:String(row.user_id)===String(userId)})
  return { ...base,joined:true,tier,participants:own?.participants||0,
    previousPoints:Number(own?.previous_points||0),previousRewardXp:leagueRewardXp(Number(own?.previous_points||0)),
    nextTier:tier==='bronze'?'silver':tier==='silver'?'gold':null,
    promotionAt:tier==='bronze'?140:tier==='silver'?280:null,
    you:own?entry(own):{alias:member.rows[0].alias,points:0,correct:0,livesLost:0,days:0,rank:null,you:true},
    leaders:result.rows.filter(row=>Number(row.rank)<=10&&Number(row.points)>0).map(entry) }
}
