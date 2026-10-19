import { readFile } from 'node:fs/promises'

const datasets = [
  { file: 'qs-world-university-rankings-2027-top1000.json', edition: 2027, count: 1000 },
  { file: 'qs-subject-rankings-2026-arts-humanities.json', edition: 2026, area: 'Arts & Humanities', count: 553 },
  { file: 'qs-subject-rankings-2026-engineering-technology.json', edition: 2026, area: 'Engineering & Technology', count: 556 },
  { file: 'qs-subject-rankings-2026-life-sciences-medicine.json', edition: 2026, area: 'Life Sciences & Medicine', count: 550 },
  { file: 'qs-subject-rankings-2026-natural-sciences.json', edition: 2026, area: 'Natural Sciences', count: 554 },
  { file: 'qs-subject-rankings-2026-social-sciences-management.json', edition: 2026, area: 'Social Sciences & Management', count: 550 },
]

await readFile(new URL('../dist/index.html', import.meta.url))

for (const expected of datasets) {
  const source = await readFile(new URL(`../public/data/${expected.file}`, import.meta.url))
  const published = await readFile(new URL(`../dist/data/${expected.file}`, import.meta.url))
  if (!source.equals(published)) {
    throw new Error(`O build não contém a versão atual de ${expected.file}`)
  }

  const data = JSON.parse(published.toString('utf8'))
  if (data.edition !== expected.edition || data.count !== expected.count ||
      (expected.area && data.area !== expected.area) ||
      !Array.isArray(data.universities) || data.universities.length !== expected.count) {
    throw new Error(`Dados incompletos ou inesperados em ${expected.file}`)
  }
}

console.log(`Build pronto: ${datasets.length} rankings com dados completos em dist/data.`)
