import test from 'node:test'
import assert from 'node:assert/strict'
import { validateScholarship } from '../server/validation.mjs'

const valid = { title:'Bolsa oficial',organization:'Universidade',study_level:'mestrado',deadline_type:'unknown',
  source_label:'Edital',source_url:'https://example.org/edital',source_verified_at:'2026-10-19',status:'draft',countries:['alemanha'] }
const check = value => validateScholarship(value, ['alemanha','franca'])
test('aceita rascunho com fonte e país', () => assert.ok(check(valid).data))
test('bloqueia fonte sem HTTPS', () => assert.match(check({ ...valid,source_url:'http://example.org' }).error,/HTTPS/))
test('bloqueia país desconhecido', () => assert.match(check({ ...valid,countries:['xxx'] }).error,/país/))
test('bloqueia publicação incompleta', () => assert.match(check({ ...valid,status:'published' }).error,/publicar/))
test('aceita publicação completa', () => assert.ok(check({ ...valid,status:'published',summary:'Resumo',eligibility:'Requisitos',funding_details:'Cobertura',application_url:'https://example.org/apply' }).data))
test('prazo fixo exige data e fuso', () => assert.match(check({ ...valid,deadline_type:'fixed' }).error,/prazo/))
test('rejeita data inexistente', () => assert.match(check({ ...valid,source_verified_at:'2026-02-31' }).error,/verificação/))
