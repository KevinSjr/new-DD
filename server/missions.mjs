import { database } from './db.mjs'
import { streakFromDays } from './streak.mjs'
import { reconcileAchievements } from './achievements.mjs'

const fail = (status, message) => { throw Object.assign(new Error(message), { status }) }

export const MISSION_DEFINITIONS = [
  { key:'sat-daily', frequency:'daily', title:'Desafio diário SAT', detail:'Conclua uma das duas áreas do desafio, com qualquer número de acertos.', xp:15, href:'/exames/sat/desafio-diario', target:1 },
  { key:'mext-daily', frequency:'daily', title:'Desafio diário MEXT', detail:'Conclua uma disciplina da modalidade A ou B.', xp:15, href:'/exames/mext/desafio-diario', target:1 },
  { key:'practice-two-days', frequency:'weekly', title:'Pratique em dois dias', detail:'Conclua um desafio SAT ou MEXT em dois dias diferentes da semana.', xp:30, href:'/exames', target:2 },
  { key:'practice-four-days', frequency:'monthly', title:'Quatro dias de prática', detail:'Conclua desafios em quatro dias diferentes do mês, no seu ritmo.', xp:50, href:'/exames', target:4 },
  { key:'study-goal', frequency:'once', title:'Defina seu objetivo de estudo', detail:'Salve um destino, um nível e uma área no perfil.', xp:25, href:'/conta?tab=metas', target:1 },
  { key:'gpa-estimates', frequency:'once', title:'Guarde suas estimativas de GPA', detail:'Salve os três resultados da calculadora no perfil.', xp:20, href:'/calculadora-gpa', target:1 },
  { key:'first-deadline', frequency:'once', title:'Organize seu primeiro prazo', detail:'Cadastre um prazo na Minha jornada.', xp:20, href:'/conta?tab=jornada', target:1 },
  { key:'first-challenge', frequency:'once', title:'Seu primeiro desafio', detail:'Conclua um desafio diário SAT ou MEXT.', xp:20, href:'/exames', target:1 },
]

const missionByKey = new Map(MISSION_DEFINITIONS.map(mission => [mission.key, mission]))
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone:'America/Sao_Paulo', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date())

function weekStart(day) {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7)
  return date.toISOString().slice(0, 10)
}

function nextWeek(start) {
  const date = new Date(`${start}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + 7)
  return date.toISOString().slice(0, 10)
}

async function award(client, userId, key, periodKey) {
  const mission = missionByKey.get(key)
  if (!mission) throw new Error(`Missão desconhecida: ${key}`)
  const result = await client.query(`INSERT INTO user_mission_awards (user_id,mission_key,period_key,xp)
    VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING xp`, [userId,key,periodKey,mission.xp])
  return result.rows[0]?.xp || 0
}

export async function reconcileUniqueMissions(userId, client = database()) {
  const result = await client.query(`SELECT
    (p.study_level IS NOT NULL AND p.interest_area IS NOT NULL AND EXISTS
      (SELECT 1 FROM user_profile_destinations d WHERE d.user_id=p.user_id)) AS goal,
    EXISTS (SELECT 1 FROM user_gpa_estimates g WHERE g.user_id=p.user_id) AS gpa,
    EXISTS (SELECT 1 FROM user_journey_deadlines d WHERE d.user_id=p.user_id) AS deadline,
    EXISTS (SELECT 1 FROM user_mission_challenge_claims c WHERE c.user_id=p.user_id) AS challenge
    FROM user_profiles p WHERE p.user_id=$1`, [userId])
  const state = result.rows[0]
  if (!state) return 0
  let gained = 0
  if (state.goal) gained += await award(client,userId,'study-goal','once')
  if (state.gpa) gained += await award(client,userId,'gpa-estimates','once')
  if (state.deadline) gained += await award(client,userId,'first-deadline','once')
  if (state.challenge) gained += await award(client,userId,'first-challenge','once')
  return gained
}

async function practiceCounts(client, userId, day) {
  const start = weekStart(day)
  const week = await client.query('SELECT count(DISTINCT day)::int AS total FROM user_mission_challenge_claims WHERE user_id=$1 AND day >= $2::date AND day < $3::date', [userId,start,nextWeek(start)])
  const month = await client.query('SELECT count(DISTINCT day)::int AS total FROM user_mission_challenge_claims WHERE user_id=$1 AND to_char(day, \'YYYY-MM\')=$2', [userId,day.slice(0,7)])
  const days = await client.query("SELECT DISTINCT to_char(day, 'YYYY-MM-DD') AS day FROM user_mission_challenge_claims WHERE user_id=$1 ORDER BY day DESC", [userId])
  const practiceDays = days.rows.map(row => row.day)
  return { week:week.rows[0].total, month:month.rows[0].total, total:practiceDays.length, streak:streakFromDays(practiceDays, day), weekKey:start, monthKey:day.slice(0,7) }
}

async function reconcilePracticeMissions(client, userId, day) {
  const counts = await practiceCounts(client,userId,day)
  let gained = 0
  if (counts.week >= 2) gained += await award(client,userId,'practice-two-days',counts.weekKey)
  if (counts.month >= 4) gained += await award(client,userId,'practice-four-days',counts.monthKey)
  return { counts, gained }
}

export async function getMissions(userId) {
  const client = await database().connect()
  try {
    const day = today()
    await reconcileUniqueMissions(userId,client)
    const { counts } = await reconcilePracticeMissions(client,userId,day)
    const achievementState = await reconcileAchievements(userId,client)
    const awards = await client.query('SELECT mission_key,period_key,xp,awarded_at FROM user_mission_awards WHERE user_id=$1 ORDER BY awarded_at DESC', [userId])
    const earned = new Set(awards.rows.map(row => `${row.mission_key}:${row.period_key}`))
    const xp = awards.rows.reduce((sum,row) => sum + row.xp, 0)
    const missions = MISSION_DEFINITIONS.map(mission => {
      const periodKey = mission.frequency === 'daily' ? day : mission.frequency === 'weekly' ? counts.weekKey : mission.frequency === 'monthly' ? counts.monthKey : 'once'
      const progress = mission.key === 'practice-two-days' ? counts.week : mission.key === 'practice-four-days' ? counts.month : earned.has(`${mission.key}:${periodKey}`) ? 1 : 0
      return { ...mission, periodKey, progress:Math.min(progress,mission.target), completed:earned.has(`${mission.key}:${periodKey}`) }
    })
    return { xp, level:Math.floor(xp / 100) + 1, nextLevelXp:100 - xp % 100, practiceDays:counts.total, streak:achievementState.streak,
      completedCurrent:missions.filter(mission => mission.completed).length, missions,
      achievements:achievementState.achievements.map(({ progress, ...item }) => ({ ...item, progress, completed:earned.has(`achievement-${item.key}:once`) })),
      recentAwards:awards.rows.slice(0,5).map(row => ({ key:row.mission_key, xp:row.xp, awardedAt:row.awarded_at })) }
  } finally { client.release() }
}

export async function claimChallenge(userId, input) {
  const source = input?.source
  const proof = input?.proof
  const section = input?.section
  const track = input?.track
  const subject = input?.subject
  if (!['sat','mext'].includes(source) || typeof proof !== 'string' || !/^[a-f0-9]{64}$/.test(proof)) fail(400,'Comprovante do desafio inválido.')
  if (source === 'sat' && !['reading-writing','math'].includes(section)) fail(400,'Área do SAT inválida.')
  if (source === 'mext' && (!['A','B'].includes(track) || !(track === 'A' ? ['japanese','english','math'] : ['japanese','english','math','chemistry','physics','biology']).includes(subject))) fail(400,'Modalidade ou disciplina MEXT inválida.')
  const day = today()
  const variant = source === 'sat' ? section : `${track}:${subject}`
  const client = await database().connect()
  try {
    await client.query('BEGIN')
    const run = source === 'sat'
      ? await client.query('SELECT question_ids,answers,lives FROM sat_daily_runs WHERE token_hash=$1 AND day=$2 AND section=$3', [proof,day,section])
      : await client.query('SELECT question_ids,answers,lives FROM mext_daily_runs WHERE token_hash=$1 AND day=$2 AND track=$3 AND subject=$4', [proof,day,track,subject])
    const state = run.rows[0]
    if (!state || !Array.isArray(state.answers) || state.answers.length === 0 || (state.answers.length < state.question_ids.length && state.lives > 0)) fail(409,'Conclua o desafio de hoje antes de receber XP.')
    const inserted = await client.query(`INSERT INTO user_mission_challenge_claims (source,day,variant,token_hash,user_id)
      VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING RETURNING user_id`, [source,day,variant,proof,userId])
    if (!inserted.rowCount) {
      const owner = await client.query('SELECT user_id FROM user_mission_challenge_claims WHERE source=$1 AND day=$2 AND variant=$3 AND token_hash=$4', [source,day,variant,proof])
      if (String(owner.rows[0]?.user_id) !== String(userId)) fail(409,'Este desafio já foi associado a outra conta.')
    }
    let earnedXp = 0
    if (inserted.rowCount) earnedXp += await award(client,userId,source === 'sat' ? 'sat-daily' : 'mext-daily',day)
    earnedXp += await reconcileUniqueMissions(userId,client)
    earnedXp += (await reconcilePracticeMissions(client,userId,day)).gained
    await client.query('COMMIT')
    return { earnedXp, missions:await getMissions(userId) }
  } catch (cause) { await client.query('ROLLBACK'); throw cause } finally { client.release() }
}
