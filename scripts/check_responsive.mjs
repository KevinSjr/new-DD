import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { extname, join, resolve, sep } from 'node:path'

const root = resolve('dist')
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const apiOrigin = process.env.RESPONSIVE_API_ORIGIN || ''
if (apiOrigin && !/^http:\/\/127\.0\.0\.1:300[12]$/.test(apiOrigin)) throw new Error('A auditoria só aceita a API local nas portas 3001 ou 3002')
const routes = process.env.RESPONSIVE_ONLY_ROUTE ? [process.env.RESPONSIVE_ONLY_ROUTE] : [
  '/', '/exames', '/exames/sat', '/exames/sat/desafio-diario', '/exames/sat/simulado', '/admin/sat', '/rankings', '/ranking', '/rankings/artes-humanidades',
  '/rankings/engenharia-tecnologia', '/rankings/ciencias-da-vida-medicina',
  '/rankings/ciencias-naturais', '/rankings/ciencias-sociais-administracao',
  '/teste-vocacional', '/calculadora-gpa', '/descobridor-de-destinos',
  '/bolsas', '/admin/bolsas', '/paises/alemanha', '/paises/estados-unidos', '/paises/finlandia', '/paises/franca', '/paises/paises-baixos', '/paises/irlanda', '/paises/italia', '/paises/japao', '/paises/malasia', '/paises/noruega', '/paises/portugal', '/paises/reino-unido', '/paises/outro',
]
const widths = [320, 375, 768, 1024, 1280]
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2' }

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    if (pathname.startsWith('/api/')) {
      if (apiOrigin) {
        const upstream = await fetch(`${apiOrigin}${request.url}`)
        response.writeHead(upstream.status, { 'Content-Type': upstream.headers.get('content-type') || 'application/json' })
        response.end(Buffer.from(await upstream.arrayBuffer()))
      } else {
        response.writeHead(503, { 'Content-Type': 'application/json' })
        response.end('{"error":"API indisponível no teste estático"}')
      }
      return
    }
    const path = resolve(root, `.${pathname}`)
    if (path !== root && !path.startsWith(root + sep)) throw new Error('Invalid path')
    let file = path
    try {
      if (!(await stat(file)).isFile()) file = join(root, 'index.html')
    } catch {
      file = join(root, 'index.html')
    }
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' })
    response.end(await readFile(file))
  } catch {
    response.writeHead(404)
    response.end()
  }
})

const delay = ms => new Promise(resolveDelay => setTimeout(resolveDelay, ms))
let browser
let socket
let profile
try {
  await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen))
  const port = server.address().port
  profile = await mkdtemp(join(tmpdir(), 'daydreaming-responsive-'))
  browser = spawn(chromePath, [
    '--headless=new', '--no-first-run', '--no-default-browser-check',
    '--disable-background-networking', '--disable-extensions',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    'about:blank',
  ], { stdio: 'ignore' })

  let debugPort
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      debugPort = Number((await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0])
      break
    } catch { await delay(100) }
  }
  if (!debugPort) throw new Error('Chrome DevTools não iniciou')
  console.log('Chrome pronto', debugPort)
  const tabs = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json()
  const tab = tabs.find(item => item.type === 'page')
  if (!tab) throw new Error('Chrome não retornou uma aba')
  socket = new WebSocket(tab.webSocketDebuggerUrl)
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener('open', resolveOpen, { once: true })
    socket.addEventListener('error', rejectOpen, { once: true })
  })
  let nextId = 1
  const pending = new Map()
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (!message.id || !pending.has(message.id)) return
    const { resolveResult, rejectResult } = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) rejectResult(new Error(message.error.message))
    else resolveResult(message.result)
  })
  const command = (method, params = {}) => new Promise((resolveResult, rejectResult) => {
    const id = nextId++
    pending.set(id, { resolveResult, rejectResult })
    socket.send(JSON.stringify({ id, method, params }))
  })
  await command('Page.enable')
  await command('Runtime.enable')
  console.log('DevTools conectado')
  const evaluateJson = async (expression, route) => {
    for (let attempt = 0; attempt < 100; attempt++) {
      const result = await command('Runtime.evaluate', {
        expression: `location.pathname === ${JSON.stringify(route)} && document.querySelector('main h1') ? (${expression}) : null`,
        returnByValue: true,
      })
      if (typeof result.result?.value === 'string') return JSON.parse(result.result.value)
      await delay(100)
    }
    throw new Error(`Página não ficou pronta: ${route}`)
  }
  let failures = 0
  for (const width of widths) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: width < 768 })
    for (const route of routes) {
      await command('Page.navigate', { url: `http://127.0.0.1:${port}${route}` })
      const data = await evaluateJson(`JSON.stringify({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth, heading: document.querySelector('main h1')?.textContent?.trim() || '', menu: getComputedStyle(document.querySelector('.site-header__toggle')).display })`, route)
      if (data.document > data.viewport + 1 || data.body > data.viewport + 1 || !data.heading) {
        failures++
        console.log('FAIL', width, route, data)
      } else console.log('OK', width, route, `${data.document}/${data.viewport}`, data.heading.slice(0, 45))
    }
  }
  if (!process.env.RESPONSIVE_ONLY_ROUTE) {
    await command('Emulation.setDeviceMetricsOverride', { width: 320, height: 640, deviceScaleFactor: 1, mobile: true })
    await command('Page.navigate', { url: `http://127.0.0.1:${port}/` })
    await evaluateJson(`(() => { document.querySelector('.site-header__toggle').click(); return JSON.stringify({ clicked: true }) })()`, '/')
    await delay(100)
    const menu = await evaluateJson(`(() => { const menu = document.querySelector('.site-nav'); return JSON.stringify({ visible: getComputedStyle(menu).display !== 'none', bottom: menu.getBoundingClientRect().bottom, viewportHeight: innerHeight, documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth }) })()`, '/')
    if (!menu.visible || menu.bottom > menu.viewportHeight + 1 || menu.documentWidth > menu.viewportWidth + 1) {
      failures++
      console.log('FAIL menu móvel', menu)
    } else console.log('OK menu móvel aberto', menu)

    await command('Page.navigate', { url: `http://127.0.0.1:${port}/ranking` })
    await delay(1000)
    const ranking = await evaluateJson(`(() => { const container = document.querySelector('.ranking-results__scroll'); return JSON.stringify({ exists: !!container, scrollWidth: container?.scrollWidth, clientWidth: container?.clientWidth, documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, rows: document.querySelectorAll('.ranking-results tbody tr').length }) })()`, '/ranking')
    if (!ranking.exists || ranking.rows === 0 || ranking.scrollWidth <= ranking.clientWidth || ranking.documentWidth > ranking.viewportWidth + 1) {
      failures++
      console.log('FAIL tabela móvel de ranking', ranking)
    } else console.log('OK tabela móvel de ranking', ranking)
  }

  if (process.env.RESPONSIVE_SCREENSHOTS_DIR) {
    const screenshotsDir = resolve(process.env.RESPONSIVE_SCREENSHOTS_DIR)
    await mkdir(screenshotsDir, { recursive: true })
    for (const route of ['/', '/exames/sat', '/exames/sat/desafio-diario', '/ranking', '/calculadora-gpa', '/bolsas', '/paises/alemanha']) {
      await command('Page.navigate', { url: `http://127.0.0.1:${port}${route}` })
      await evaluateJson(`JSON.stringify({ ready: true })`, route)
      await delay(250)
      const screenshot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')
      await writeFile(join(screenshotsDir, `${name}-320.png`), Buffer.from(screenshot.data, 'base64'))
      console.log('Captura', name)
    }
  }

  if (apiOrigin) {
    for (const width of widths) {
      await command('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: width < 768 })
      await command('Page.navigate', { url: `http://127.0.0.1:${port}/bolsas` })
      let cards
      for (let attempt = 0; attempt < 100; attempt++) {
        cards = await evaluateJson(`(() => { const items = [...document.querySelectorAll('.sch-search__card')]; return JSON.stringify({ count: items.length, overflow: items.filter(item => item.scrollWidth > item.clientWidth + 1).length, documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, error: !!document.querySelector('.sch-search__state[role="alert"]') }) })()`, '/bolsas')
        if (cards.count || cards.error) break
        await delay(100)
      }
      if (cards.count !== 12 || cards.overflow || cards.documentWidth > cards.viewportWidth + 1) {
        failures++
        console.log('FAIL cartões de bolsas', width, cards)
      } else console.log('OK cartões de bolsas', width, cards)
      if (width === 320 && process.env.RESPONSIVE_SCREENSHOTS_DIR && cards.count) {
        await command('Runtime.evaluate', { expression: `document.querySelector('.sch-search__card').scrollIntoView()` })
        await delay(200)
        const screenshot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
        await writeFile(join(resolve(process.env.RESPONSIVE_SCREENSHOTS_DIR), 'bolsas-card-320.png'), Buffer.from(screenshot.data, 'base64'))
      }
    }
    await command('Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 1, mobile: true })
    await command('Page.navigate', { url: `http://127.0.0.1:${port}/bolsas` })
    for (const country of ['estados-unidos', 'reino-unido', 'alemanha', 'japao', 'nova-zelandia']) {
      const expectedPage = await (await fetch(`${apiOrigin}/api/scholarship-catalog?country=${country}&page=1`)).json()
      await evaluateJson(`(() => { const select = document.querySelector('#scholarship-country'); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(select, ${JSON.stringify(country)}); select.dispatchEvent(new Event('change', { bubbles: true })); return JSON.stringify({ selected: select.value }) })()`, '/bolsas')
      let sample
      for (let attempt = 0; attempt < 100; attempt++) {
        sample = await evaluateJson(`(() => { const items = [...document.querySelectorAll('.sch-search__card')]; return JSON.stringify({ first: items[0]?.querySelector('h3')?.textContent || '', count: items.length, overflow: items.filter(item => item.scrollWidth > item.clientWidth + 1).length, documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth }) })()`, '/bolsas')
        if (sample.first === expectedPage.items[0]?.title) break
        await delay(100)
      }
      if (sample.first !== expectedPage.items[0]?.title || sample.count !== 12 || sample.overflow || sample.documentWidth > sample.viewportWidth + 1) {
        failures++
        console.log('FAIL cartões filtrados', country, sample)
      } else console.log('OK cartões filtrados', country, sample.count, 'cartões')
    }
  }

  if (failures) process.exitCode = 1
  const checks = widths.length * routes.length + (process.env.RESPONSIVE_ONLY_ROUTE ? 0 : 2) + (apiOrigin ? widths.length + 5 : 0)
  console.log(`${checks - failures}/${checks} verificações responsivas passaram`)
} finally {
  socket?.close()
  browser?.kill()
  await new Promise(resolveClose => server.close(resolveClose))
  if (profile) {
    for (let attempt = 0; attempt < 10; attempt++) {
      try { await rm(profile, { recursive: true, force: true }); break }
      catch (error) {
        if (error.code !== 'EBUSY' || attempt === 9) {
          console.warn('Perfil temporário não removido:', error.message)
          break
        }
        await delay(300)
      }
    }
  }
}
