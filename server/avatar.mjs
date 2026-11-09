import { database } from './db.mjs'

const outfits = new Set(['hoodie', 'shirt', 'jacket'])
const accessories = new Set(['none', 'glasses', 'cap'])
const styles = new Set(['brasil','alemanha','australia','belgica','canada','china','coreia-do-sul','dinamarca',
  'espanha','estados-unidos','finlandia','franca','paises-baixos','irlanda','italia','japao','malasia',
  'noruega','portugal','reino-unido','singapura','suica','suecia','taiwan','hong-kong','nova-zelandia'])
const invalid = () => { throw Object.assign(new Error('Escolha opções válidas para o avatar.'), { status:400 }) }

export function validateAvatar(input) {
  if (!input || !Number.isInteger(input.character) || input.character < 1 || input.character > 8 ||
      !outfits.has(input.outfit) || !accessories.has(input.accessory) || !styles.has(input.style)) invalid()
  return { character:input.character, outfit:input.outfit, accessory:input.accessory, style:input.style }
}

export function avatarFromRow(row) {
  if (!row || row.avatar_character == null) return null
  return { character:row.avatar_character, outfit:row.avatar_outfit,
    accessory:row.avatar_accessory, style:styles.has(row.avatar_style)?row.avatar_style:'brasil' }
}

export async function saveAvatar(userId, input) {
  const avatar = validateAvatar(input)
  const client = await database().connect()
  try {
    await client.query('BEGIN')
    await client.query(`UPDATE user_profiles SET avatar_character=$2,avatar_outfit=$3,
      avatar_accessory=$4,avatar_style=$5,avatar_customized_at=coalesce(avatar_customized_at,now()),updated_at=now()
      WHERE user_id=$1`, [userId,avatar.character,avatar.outfit,avatar.accessory,avatar.style])
    const award = await client.query(`INSERT INTO user_mission_awards (user_id,mission_key,period_key,xp)
      VALUES ($1,'avatar-first','once',50) ON CONFLICT DO NOTHING RETURNING xp`, [userId])
    await client.query('COMMIT')
    return { avatar, earnedXp:award.rows[0]?.xp || 0 }
  } catch (cause) { await client.query('ROLLBACK'); throw cause } finally { client.release() }
}
