import assert from 'node:assert/strict'
import { test } from 'node:test'
import { avatarFromRow, validateAvatar } from '../server/avatar.mjs'

test('avatar aceita somente as opções disponíveis e não confia no cliente',()=>{
  const selected={character:8,outfit:'jacket',accessory:'glasses',style:'brasil'}
  assert.deepEqual(validateAvatar(selected),selected)
  assert.throws(()=>validateAvatar({...selected,character:9}),{status:400})
  assert.throws(()=>validateAvatar({...selected,outfit:'premium'}),{status:400})
  assert.throws(()=>validateAvatar({...selected,accessory:'crown'}),{status:400})
  assert.throws(()=>validateAvatar({...selected,style:'other'}),{status:400})
  assert.equal(avatarFromRow({avatar_character:null}),null)
  assert.deepEqual(avatarFromRow({avatar_character:8,avatar_outfit:'jacket',
    avatar_accessory:'glasses',avatar_style:'brasil'}),selected)
  assert.equal(avatarFromRow({...selected,avatar_character:8,avatar_outfit:'jacket',
    avatar_accessory:'glasses',avatar_style:'sky'}).style,'brasil')
})
