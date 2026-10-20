import { randomBytes, scryptSync } from 'node:crypto'
import { createInterface } from 'node:readline'
const rl = createInterface({ input: process.stdin, output: process.stdout })
const password = await new Promise(resolve => rl.question('Senha administrativa (não será gravada): ', resolve))
rl.close()
if (password.length < 12) throw new Error('Use pelo menos 12 caracteres.')
const salt = randomBytes(16).toString('hex')
console.log(`ADMIN_PASSWORD_HASH=${salt}:${scryptSync(password, salt, 64).toString('hex')}`)
