import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ACHIEVEMENT_DEFINITIONS } from '../server/achievements.mjs'
import { MISSION_DEFINITIONS } from '../server/missions.mjs'
import { achievementIcons, missionIcons } from '../src/components/account/progressIcons.ts'

test('cada missão e conquista tem um ícone definido', () => {
  assert.deepEqual(
    ACHIEVEMENT_DEFINITIONS.map(({ key }) => key).filter(key => !achievementIcons[key]),
    [],
  )
  assert.deepEqual(
    MISSION_DEFINITIONS.map(({ key }) => key).filter(key => !missionIcons[key]),
    [],
  )
})
