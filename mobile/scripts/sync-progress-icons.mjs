import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const mobileRoot = fileURLToPath(new URL('../', import.meta.url))
const repoRoot = resolve(mobileRoot, '..')
const check = process.argv.includes('--check')
const iconSource = await readFile(resolve(repoRoot, 'src/components/ui/Icon.tsx'), 'utf8')
const paths = iconSource.slice(iconSource.indexOf('const PATHS = {'), iconSource.indexOf('} as const') + 10)
  .replace(/<(\/?)(circle|rect|path)\b/g, (_, slash, tag) => '<' + slash + tag[0].toUpperCase() + tag.slice(1))
const glyphs = `import { Circle, G, Path, Rect } from 'react-native-svg'\n\n${paths}\n\nexport type GlyphName = keyof typeof PATHS\n\nexport function BadgeGlyph({name,color}:{name:GlyphName;color:string}) {\n  return <G transform="translate(23 19)" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" fill="none">{PATHS[name]}</G>\n}\n`
const iconMap = (await readFile(resolve(repoRoot, 'src/components/account/progressIcons.ts'), 'utf8'))
  .replace("import type { IconName } from '../ui/Icon'", "import type { GlyphName } from '../components/BadgeGlyph'")
  .replaceAll('IconName', 'GlyphName')

for (const [relative, expected] of [
  ['src/components/BadgeGlyph.tsx', glyphs],
  ['src/data/progressIcons.ts', iconMap],
]) {
  const target = resolve(mobileRoot, relative)
  if ((await readFile(target, 'utf8').catch(() => null)) === expected) continue
  if (check) throw new Error(relative + ' difere dos ícones do site. Execute npm run sync:progress-icons em mobile.')
  await writeFile(target, expected, 'utf8')
  console.log('Ícones de progresso sincronizados: ' + relative)
}
