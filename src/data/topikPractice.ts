// Simulado autoral inspirado no TOPIK em papel (PBT). Quantidades e tempos:
// https://www.niied.go.kr/web/NIIED/contents/niiedEng/eng_topikOverview
export type TopikLevel = 'I' | 'II'
export type TopikSkill = 'listening' | 'writing' | 'reading'
export type TopikQuestion = {
  id: string
  skill: TopikSkill
  prompt: string
  options?: string[]
  answer?: number
  passage?: string
  audio?: string
  guide?: string
}
export type TopikSection = { id: TopikSkill; name: string; minutes: number; questions: TopikQuestion[] }
export type TopikExam = { level: TopikLevel; sections: TopikSection[]; questions: TopikQuestion[] }

type Scenario = { actor: string; action: string; when: string; where: string; why: string }
const parse = (value: string): Scenario[] => value.trim().split('\n').map(line => {
  const [actor, action, when, where, why] = line.split('|')
  if (![actor, action, when, where, why].every(Boolean)) throw new Error('Cenário TOPIK incompleto')
  return { actor, action, when, where, why }
})

// Textos curtos originais. Cada cenário gera questões de ideia principal, tempo,
// lugar e motivo; as alternativas incorretas vêm de outros cenários da mesma seção.
const beginnerListening = parse(`민수 씨|친구와 영화를 봅니다|토요일 오후 두 시에|시내 영화관에서|함께 시간을 보내고 싶어서
지영 씨|한국어 책을 빌립니다|월요일 오전 열 시에|학교 도서관에서|한국어를 공부하려고
수아 씨|어머니와 점심을 먹습니다|일요일 낮 열두 시에|집 근처 식당에서|어머니 생신을 축하하려고
준호 씨|새 운동화를 삽니다|금요일 저녁 여섯 시에|백화점에서|다음 주에 달리기를 시작하려고
유나 씨|기차표를 예약합니다|수요일 오후 네 시에|역 매표소에서|부산에 있는 친구를 만나려고
현우 씨|의사에게 진료를 받습니다|화요일 오전 아홉 시에|동네 병원에서|감기가 낫지 않아서
하늘 씨|동생과 수영을 합니다|토요일 오전 열한 시에|체육관 수영장에서|건강을 위해 운동하려고
다은 씨|선생님께 질문을 합니다|목요일 오후 세 시에|학교 교실에서|숙제를 이해하지 못해서`)
const beginnerReading = parse(`시립 도서관|어린이 독서 모임을 엽니다|매주 토요일 오전 열 시에|도서관 이층에서|아이들이 책을 즐겁게 읽도록
학교 식당|새로운 채식 메뉴를 제공합니다|다음 주 월요일부터|학교 식당에서|학생들의 의견을 반영해서
동네 약국|무료 건강 상담을 합니다|이번 달 십오일 오후 두 시에|약국 상담실에서|주민들이 건강을 확인하도록
공원 관리소|봄꽃 사진 전시회를 엽니다|이번 주 일요일에|중앙 공원 입구에서|지역 사진을 함께 나누려고
시민 문화센터|초급 한국어 수업을 시작합니다|다음 달 첫째 주에|문화센터 삼층에서|새로 온 주민들을 도우려고
버스 회사|아침 버스를 더 운행합니다|다음 주 화요일부터|중앙역 앞에서|출근하는 승객이 많아서
동물 보호소|주말 자원봉사자를 모집합니다|금요일까지|보호소 사무실에서|동물을 돌볼 사람이 필요해서
시장 상인회|친환경 장바구니를 나눠 줍니다|토요일 오전 아홉 시에|전통시장 입구에서|일회용 봉투를 줄이려고
대학교 박물관|역사 사진전을 개최합니다|이번 달 마지막 금요일에|박물관 일층에서|학생들에게 옛 생활을 소개하려고
주민센터|우산 대여 서비스를 시작합니다|장마가 시작되는 다음 달에|주민센터 안내 데스크에서|갑작스러운 비에 대비하도록`)
const advancedListening = parse(`대학 연구팀|도시 열섬 현상에 관한 조사 결과를 발표합니다|다음 주 수요일 오후 두 시에|대학 강당에서|녹지 확충 정책의 근거를 제시하려고
지역 협동조합|청년 창업자를 위한 상담회를 엽니다|이번 달 마지막 토요일에|시민회관에서|초기 자금 마련의 어려움을 덜어 주려고
환경 단체|하천 수질 변화 자료를 공개합니다|목요일 오전 열 시에|온라인 설명회에서|주민들이 오염 문제를 정확히 이해하도록
시립 미술관|장애인 관람객을 위한 해설 프로그램을 시작합니다|다음 달 첫째 주부터|미술관 전시실에서|문화 시설 이용의 장벽을 낮추려고
교통 연구소|버스 노선 개편안을 설명합니다|금요일 오후 세 시에|구청 회의실에서|승객 의견을 최종 계획에 반영하려고
역사학회|미공개 지역 기록을 소개합니다|다음 주 월요일 오후 네 시에|시립 기록관에서|지역사의 빈 부분을 새롭게 살펴보려고
보건소|청소년 수면 습관 조사 결과를 발표합니다|이번 달 이십일일에|보건소 교육실에서|학교의 건강 교육을 개선하려고
기술 지원센터|소상공인 온라인 판매 교육을 진행합니다|화요일 저녁 일곱 시에|지원센터 강의실에서|작은 가게의 판로를 넓히려고
대학 도서관|연구 데이터 관리 강좌를 엽니다|다음 주 목요일 오전 열한 시에|도서관 세미나실에서|자료를 안전하게 보관하는 방법을 알려 주려고
주택 연구원|고령자 주거 실태 보고서를 배포합니다|이번 주 금요일에|연구원 홈페이지에서|돌봄 정책 수립에 참고 자료를 제공하려고
문화재단|독립 영화 제작 지원 사업을 안내합니다|다음 달 둘째 주에|문화재단 소극장에서|신인 감독의 제작 기회를 늘리려고
기상 연구소|집중호우 예측 기술을 시연합니다|수요일 오전 아홉 시에|연구소 실험실에서|재난 경보의 정확도를 높이려고
교육청|다문화 가정 학부모 간담회를 마련합니다|다음 주 토요일 오후 한 시에|교육청 대회의실에서|학교 안내의 언어적 어려움을 줄이려고`)
const advancedReading = parse(`도시 계획 위원회|보행자 중심 거리 시범 사업을 검토합니다|다음 달 정기 회의에서|시청 회의실에서|교통량 감소와 상권 변화를 함께 평가하려고
공공 연구 기관|지역별 물 사용량 분석 보고서를 발간합니다|올해 하반기에|기관 홈페이지에서|가뭄 대비 정책을 더 정교하게 설계하려고
대학 국제처|교환학생 선발 기준 설명회를 개최합니다|이번 학기 중간고사 이후에|대학 국제관에서|지원자가 평가 기준을 정확히 이해하도록
지역 신문사|청년층의 대중교통 이용 실태를 조사합니다|다음 주부터 한 달 동안|시내 주요 환승역에서|이동 환경에 관한 기획 기사를 준비하려고
산림 연구소|도심 나무의 온도 조절 효과를 측정합니다|여름철 낮 시간에|도심 공원 여러 곳에서|폭염 대응 방안을 검증하려고
고용 지원 센터|경력 전환 교육 과정을 모집합니다|다음 달 십일까지|센터 접수 창구에서|새로운 직업을 찾는 시민을 지원하려고
시립 극단|지역 주민의 이야기를 바탕으로 연극을 제작합니다|올해 가을 공연을 목표로|시민 문화회관에서|서로 다른 세대의 경험을 공유하려고
소비자 단체|재사용 용기 이용에 관한 설문을 실시합니다|이번 달 말까지|온라인 설문 페이지에서|생활 속 쓰레기 감축 가능성을 알아보려고
대학병원 연구진|원격 진료 만족도 조사 결과를 발표합니다|다음 주 화요일에|병원 세미나실에서|의료 접근성 개선점을 찾으려고
해양 조사단|연안 쓰레기의 이동 경로를 추적합니다|장마가 끝난 뒤부터|남쪽 해안에서|효과적인 수거 지점을 결정하려고
언어 교육 연구회|성인 학습자를 위한 읽기 자료를 개발합니다|이번 학기 말까지|연구회 온라인 작업실에서|수준에 맞는 학습 자료가 부족해서
구립 도서관|전자책 이용 안내 시간을 확대합니다|다음 주 월요일부터|도서관 정보실에서|기기 사용이 익숙하지 않은 이용자를 돕기 위해
농업 기술원|기후 변화에 적응한 작물 재배법을 소개합니다|올해 수확기 이후에|농업 기술원 교육장에서|농가의 생산 불확실성을 줄이려고`)

function options(correct: string, pool: Scenario[], key: keyof Scenario, index: number, offset: number) {
  const wrong: string[] = []
  for (let step = 1; wrong.length < 3; step++) {
    const value = pool[(index + step) % pool.length][key]
    if (value !== correct && !wrong.includes(value)) wrong.push(value)
  }
  const answer = (index + offset) % 4
  wrong.splice(answer, 0, correct)
  return { options: wrong, answer }
}

function comprehension(level: TopikLevel, skill: 'listening' | 'reading', pool: Scenario[], count: number): TopikQuestion[] {
  return Array.from({ length: count }, (_, n) => {
    const index = Math.floor(n / 4)
    const kind = n % 4
    const row = pool[index]
    const key: keyof Scenario = kind === 0 ? 'action' : kind === 1 ? 'when' : kind === 2 ? 'where' : 'why'
    // O formato de aviso mantém cada informação separada, sem alterar a
    // flexão dos trechos coreanos usados também nas alternativas.
    const text = `안내: ${row.actor}. ${row.action}\n시간: ${row.when}\n장소: ${row.where}\n이유: ${row.why}`
    const prompt = kind === 0 ? '무엇에 관한 내용입니까?' : kind === 1 ? '언제 진행됩니까?' : kind === 2 ? '어디에서 진행됩니까?' : '이 일을 하는 이유는 무엇입니까?'
    return {
      id: `${level}-${skill}-${n + 1}`, skill, prompt,
      ...(skill === 'listening' ? { audio: text } : { passage: text }),
      ...options(row[key], pool, key, index, kind),
    }
  })
}

const writing: TopikQuestion[] = [
  { id: 'II-writing-51', skill: 'writing', prompt: '51. 알맞은 말을 쓰십시오.\n친구에게: "내일 약속 장소가 바뀌었습니다. 학교 앞이 아니라 도서관 앞에서 (        )."', guide: '상황에 맞는 짧은 문장을 완성하세요. 의미와 문법을 직접 검토하세요.' },
  { id: 'II-writing-52', skill: 'writing', prompt: '52. 알맞은 말을 쓰십시오.\n"요즘 일회용 컵을 쓰는 사람이 많습니다. 쓰레기를 줄이기 위해서는 개인 컵을 (        )."', guide: '문맥에 자연스럽게 이어지는 표현을 작성하세요.' },
  { id: 'II-writing-53', skill: 'writing', prompt: '53. 다음 자료를 보고 200~300자로 쓰십시오.\n가상 설문: 학생 100명 중 도서관 이용 목적은 공부 55명, 책 대출 30명, 모임 15명입니다. 가장 많이 선택한 목적과 가장 적게 선택한 목적을 비교하고, 결과를 설명하십시오.', guide: '자료는 이 연습을 위해 만든 가상 수치입니다. 수치를 비교하고 객관적인 문체로 요약하세요.' },
  { id: 'II-writing-54', skill: 'writing', prompt: '54. 다음 주제에 대해 600~700자로 자신의 생각을 쓰십시오.\n"대학 수업에서 온라인 학습과 대면 학습을 어떻게 조합하는 것이 좋습니까?" 장단점과 자신의 의견을 근거와 함께 제시하십시오.', guide: '서론, 근거가 있는 본론, 결론을 구성해 보세요. 이 답안은 자동 채점하지 않습니다.' },
]

const examDefinitions: TopikExam[] = [
  { level: 'I', sections: [
    { id: 'listening', name: '듣기 · Compreensão auditiva', minutes: 40, questions: comprehension('I', 'listening', beginnerListening, 30) },
    { id: 'reading', name: '읽기 · Leitura', minutes: 60, questions: comprehension('I', 'reading', beginnerReading, 40) },
  ], questions: [] },
  { level: 'II', sections: [
    { id: 'listening', name: '듣기 · Compreensão auditiva', minutes: 60, questions: comprehension('II', 'listening', advancedListening, 50) },
    { id: 'writing', name: '쓰기 · Escrita', minutes: 50, questions: writing },
    { id: 'reading', name: '읽기 · Leitura', minutes: 70, questions: comprehension('II', 'reading', advancedReading, 50) },
  ], questions: [] },
]
export const topikExams: TopikExam[] = examDefinitions.map(exam => ({ ...exam, questions: exam.sections.flatMap(section => section.questions) }))
