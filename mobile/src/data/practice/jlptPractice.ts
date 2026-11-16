import { GRAMMAR, JLPT_BLUEPRINT, SCENARIOS, WORDS, type JlptLevel, type JlptSkill } from './jlptBlueprint.ts'

export type { JlptLevel, JlptSkill }
export type JlptQuestion = {
  id: string
  skill: JlptSkill
  type: string
  prompt: string
  options: string[]
  answer: number
  context?: string
  audio?: string
}
export type JlptSection = { id: string; title: string; minutes: number; questions: JlptQuestion[] }
export type JlptExam = { level: JlptLevel; sections: JlptSection[]; questions: JlptQuestion[] }

const skills: JlptSkill[] = ['vocabulary', 'grammar', 'reading', 'listening']
const names: Record<JlptSkill, string> = { vocabulary: 'Vocabulário', grammar: 'Gramática', reading: 'Leitura', listening: 'Compreensão auditiva' }
const parse = (value: string) => value.split(/[\n,]/).map(row => row.trim()).filter(Boolean)

function choices(correct: string, wrong: string[], shift: number) {
  const options = wrong.slice(0, 3)
  const answer = shift % 4
  options.splice(answer, 0, correct)
  return { options, answer }
}

function vocabulary(level: JlptLevel): JlptQuestion[] {
  const rows = parse(WORDS[level]).map(row => row.split('|'))
  const count = JLPT_BLUEPRINT[level].items[0]
  return Array.from({ length: count }, (_, i) => {
    const [word, reading] = rows[i]
    const orthography = i % 3 === 1
    const correct = orthography ? word : reading
    const wrong = [1, 2, 3].map(offset => orthography ? rows[(i + offset) % rows.length][0] : rows[(i + offset) % rows.length][1])
    return {
      id: `${level}-v-${i + 1}`, skill: 'vocabulary',
      type: orthography ? 'Grafia' : 'Leitura de palavras',
      prompt: orthography ? `「${reading}」の正しい漢字はどれですか。` : `「${word}」の読み方はどれですか。`,
      ...choices(correct, wrong, i),
    }
  })
}

function grammar(level: JlptLevel): JlptQuestion[] {
  const rows = parse(GRAMMAR[level])
  const count = JLPT_BLUEPRINT[level].items[1]
  return rows.slice(0, count).map((row, i) => {
    const [before, correct, after, alternatives] = row.split('|')
    return {
      id: `${level}-g-${i + 1}`, skill: 'grammar', type: 'Escolha da forma gramatical',
      prompt: `（...）に入る最もよいものを選んでください。\n${before}（...）${after}`,
      ...choices(correct, alternatives.split('/'), i + 1),
    }
  })
}

type Scenario = { actor: string; action: string; when: string; place: string; reason: string }
const scenarios = (level: JlptLevel): Scenario[] => SCENARIOS[level].trim().split('\n').map(line => {
  const [actor, action, when, place, reason] = line.split('|')
  return { actor, action, when, place, reason }
})

function comprehension(level: JlptLevel, skill: 'reading' | 'listening'): JlptQuestion[] {
  const pool = scenarios(level)
  const rows = skill === 'reading' ? pool.slice(0, 7) : pool.slice(7)
  const count = JLPT_BLUEPRINT[level].items[skill === 'reading' ? 2 : 3]
  const questions: JlptQuestion[] = []
  rows.forEach((row, rowIndex) => {
    const context = `${row.actor}は${row.action}。${row.when}${row.place}で行います。これは${row.reason}`
    const facts: { type: string; prompt: string; key: keyof Scenario }[] = [
      { type: 'Ideia principal', prompt: `${row.actor}は何をしますか。`, key: 'action' },
      { type: 'Informação específica', prompt: `${row.actor}の予定はいつですか。`, key: 'when' },
      { type: 'Localização', prompt: `${row.actor}はどこで行いますか。`, key: 'place' },
      { type: 'Motivo', prompt: `${row.actor}はなぜそうしますか。`, key: 'reason' },
    ]
    facts.forEach((fact, factIndex) => {
      const wrong = [1, 2, 3].map(offset => rows[(rowIndex + offset) % rows.length][fact.key])
      questions.push({
        id: `${level}-${skill === 'reading' ? 'r' : 'l'}-${questions.length + 1}`,
        skill, type: fact.type, prompt: fact.prompt,
        ...(skill === 'reading' ? { context } : { audio: context }),
        ...choices(row[fact.key], wrong, rowIndex + factIndex),
      })
    })
  })
  return questions.slice(0, count)
}

export function makeJlptExam(level: JlptLevel): JlptExam {
  const bySkill = Object.fromEntries(skills.map(skill => [skill, skill === 'vocabulary' ? vocabulary(level)
    : skill === 'grammar' ? grammar(level) : comprehension(level, skill)])) as Record<JlptSkill, JlptQuestion[]>
  const minutes = JLPT_BLUEPRINT[level].minutes
  const sections: JlptSection[] = level === 'N1' || level === 'N2'
    ? [
      { id: 'language-reading', title: 'Vocabulário, gramática e leitura', minutes: minutes[0], questions: [...bySkill.vocabulary, ...bySkill.grammar, ...bySkill.reading] },
      { id: 'listening', title: 'Compreensão auditiva', minutes: minutes[1], questions: bySkill.listening },
    ]
    : [
      { id: 'vocabulary', title: 'Vocabulário', minutes: minutes[0], questions: bySkill.vocabulary },
      { id: 'grammar-reading', title: 'Gramática e leitura', minutes: minutes[1], questions: [...bySkill.grammar, ...bySkill.reading] },
      { id: 'listening', title: 'Compreensão auditiva', minutes: minutes[2]!, questions: bySkill.listening },
    ]
  return { level, sections, questions: sections.flatMap(section => section.questions) }
}

export const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']
export const jlptExams = JLPT_LEVELS.map(makeJlptExam)
export { names as jlptSkillNames }
