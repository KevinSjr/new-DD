import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DESTINATION_PROFILES } from '../src/data/destinationProfiles.ts'
import { matchDestinations } from '../src/lib/destinationMatcher.ts'

const base = {
  regions: ['europe'], climate: 'mild', language: 'english', learningTime: 'none',
  budget: 'medium', tuition: 'low', place: 'medium', work: 'nice', after: 'maybe',
  level: 'undergraduate', field: 'undecided', priorities: ['language'],
}

test('the profile set matches all and only the 25 home passports', () => {
  const home = readFileSync(new URL('../src/components/home/Passports.tsx', import.meta.url), 'utf8')
  const homeSlugs = [...home.matchAll(/slug: '([a-z-]+)'/g)].map(match => match[1])
  const profileSlugs = DESTINATION_PROFILES.map(profile => profile.slug)
  assert.equal(profileSlugs.length, 25)
  assert.equal(new Set(profileSlugs).size, 25)
  assert.deepEqual(profileSlugs, homeSlugs)
})

test('matching responds to region, language and climate preferences', () => {
  const matches = matchDestinations(base, DESTINATION_PROFILES)
  assert.equal(matches.length, 25)
  assert.equal(matches[0].profile.slug, 'reino-unido')
  assert.equal(matches[1].profile.slug, 'irlanda')
  const asia = matchDestinations({ ...base, regions: ['asia'], climate: 'warm', language: 'english' }, DESTINATION_PROFILES)
  assert.equal(asia[0].profile.slug, 'hong-kong')
  assert.equal(asia[1].profile.slug, 'singapura')
})

test('priorities change score and finance answers do not invent eligibility', () => {
  const unprioritized = matchDestinations({ ...base, priorities: [] }, DESTINATION_PROFILES)
  const prioritized = matchDestinations({ ...base, priorities: ['region'] }, DESTINATION_PROFILES)
  const germanyA = unprioritized.find(match => match.profile.slug === 'alemanha')
  const germanyB = prioritized.find(match => match.profile.slug === 'alemanha')
  assert.ok(germanyB.score > germanyA.score)
  const expensive = matchDestinations({ ...base, budget: 'high', tuition: 'can-pay' }, DESTINATION_PROFILES)
  const original = matchDestinations(base, DESTINATION_PROFILES)
  assert.deepEqual(expensive.map(match => match.profile.slug), original.map(match => match.profile.slug))
})
