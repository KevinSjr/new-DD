// Simulados autorais baseados nas contagens e tempos publicados para HSK 1–6.
// Esta matriz é a versão anterior ao lançamento anunciado do HSK 3.0.
// https://www.chinesetest.cn/userfiles/upload/1418809036299.pdf
export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HskSkill = 'listening' | 'reading' | 'writing'
export type HskQuestion = { id: string; skill: HskSkill; prompt: string; options?: string[]; answer?: number; audio?: string; passage?: string; guide?: string }
export type HskSection = { id: HskSkill; name: string; minutes: number; questions: HskQuestion[] }
export type HskExam = { level: HskLevel; sections: HskSection[]; questions: HskQuestion[]; duration: number }
type Situation = { person: string; action: string; when: string; where: string; reason: string }
const rows = (value: string): Situation[] => value.trim().split('\n').map(line => {
  const [person, action, when, where, reason] = line.split('|')
  if (![person, action, when, where, reason].every(Boolean)) throw new Error('Situação HSK incompleta')
  return { person, action, when, where, reason }
})

// Os primeiros cenários de cada conjunto são usados em 听力; os demais em 阅读.
// O texto é original e deliberadamente mais breve que documentos reais da prova.
const beginner = rows(`小明|买了一本书|星期一上午|学校书店|想学习汉语
小红|做了早饭|星期二早上|家里的厨房|妈妈今天很忙
王老师|教学生写字|星期三下午|二号教室|学生要练习汉字
李医生|给孩子看病|星期四上午|儿童医院|孩子有一点儿发烧
小丽|和朋友打篮球|星期五下午|学校操场|大家喜欢运动
张先生|坐火车去北京|星期六早上|中心火车站|要看望他的哥哥
小美|买了三个苹果|星期天中午|家附近的市场|想做水果沙拉
陈阿姨|给大家做面条|星期一晚上|家里的餐厅|今天是爷爷的生日
刘同学|借了一本词典|星期二下午|大学图书馆|明天有汉语考试
赵小姐|给妹妹写信|星期三晚上|自己房间|妹妹住在别的城市
学校|开了一家新食堂|星期四中午|教学楼旁边|学生想吃热饭
孙爷爷|去公园散步|星期五早上|家对面的公园|天气很好
林同学|在网上买了一张票|星期六晚上|家里的电脑前|想看一场电影
周妈妈|带孩子去游泳|星期天上午|市里的游泳馆|孩子正在学游泳
新书店|卖很多儿童故事书|星期一下午|地铁站旁边|附近有一所小学
社区中心|开了免费画画课|星期二晚上|中心三楼|很多孩子喜欢画画
公交公司|增加了两辆早班车|星期三早上|大学门口|上学的人越来越多
市图书馆|延长了周末开放时间|星期六下午|图书馆一楼|读书的市民很多`)

const intermediate = rows(`大学中文系|举办了一场诗歌朗读会|本周一下午|教学楼报告厅|让学生感受诗歌的节奏
市民服务中心|开设了求职咨询窗口|下周二上午|中心一楼大厅|帮助刚毕业的年轻人
张研究员|介绍了新的节水方法|本周三下午|社区会议室|居民想减少家庭用水
公共图书馆|举办了旧书交换活动|本周四晚上|图书馆门前广场|让闲置的书再次被阅读
青年志愿者协会|组织了河边清洁活动|本周五上午|城市北边的河岸|保护附近居民的生活环境
交通管理部门|公布了新的公交线路|下周六早上|市政府网站|旧线路不能覆盖新区
学校营养师|讲解了健康早餐的选择|本周日早上|学校食堂|学生经常不吃早饭
社区医生|举办了冬季健康讲座|下周一晚上|社区卫生站|老人想了解防寒知识
林记者|采访了当地的手工艺人|本周二下午|老街工作室|记录传统手艺的变化
文化馆|安排了周末电影放映|本周三晚上|文化馆小礼堂|让邻居有更多交流机会
大学社团|开展了语言交换活动|本周四下午|国际交流中心|中外学生想互相学习
环保小组|安装了垃圾分类提示牌|下周五上午|学校各栋宿舍楼|一些学生不了解分类规则
市博物馆|推出了夜间参观活动|本周六晚上|博物馆主展厅|白天工作的人也能看展览
医院服务台|增加了网上预约帮助|下周日上午|医院门诊大厅|有些病人不会使用手机预约
体育中心|举办了家庭跑步日|本周一早上|城南体育公园|鼓励家长和孩子一起运动
城市书店|邀请作家分享新书|本周二晚上|书店二楼|读者想了解写作过程
学校食堂|公布了每周菜谱|本周三中午|食堂入口|学生希望提前知道午餐内容
科技馆|组织了机器人体验课|下周四下午|科技馆实验室|孩子想亲手操作机器人
公共广播站|播出了防诈骗节目|本周五晚上|城市广播频道|最近网络诈骗电话增多
大学图书馆|设置了安静学习区|下周六上午|图书馆四楼|准备考试的学生需要安静空间
社区花园|开展了种植活动|本周日早上|居民楼后面的空地|让邻居共同照顾绿色植物
旅游服务处|发布了山区徒步提醒|下周一上午|景区入口|最近的天气变化比较快`)

const advanced = rows(`城市规划委员会|公布了步行街改造方案|下周一下午|市政厅会议室|减少车辆噪声并改善行人安全
大学环境研究组|展示了河流水质的长期数据|本周二上午|大学科学馆|评估过去五年的治理效果
地方创业中心|举办了小企业融资说明会|下周三晚上|创业中心报告厅|新企业难以找到合适的资金
公共卫生部门|发布了青少年睡眠调查报告|本周四下午|卫生部门网站|学校希望调整早晨的课程安排
城市交通研究院|分析了地铁客流的新变化|下周五上午|交通研究院大厅|居民的通勤路线发生了改变
文化遗产保护协会|讨论了老建筑的修复计划|本周六下午|历史街区展览馆|传统建筑正面临严重损坏
农业技术中心|介绍了节水灌溉实验成果|下周日早上|农业技术中心农场|干旱季节的用水成本不断上升
大学国际办公室|说明了交换项目的申请标准|本周一晚上|大学国际交流楼|部分申请者不清楚选拔条件
消费者权益组织|公布了网络购物投诉统计|下周二下午|组织的官方网站|提醒消费者保存交易记录
市立医院研究团队|报告了远程诊疗的使用情况|本周三上午|医院学术中心|找出偏远地区看病的困难
青年艺术基金会|介绍了独立电影支持项目|下周四晚上|基金会放映室|年轻导演缺少作品展示机会
海洋调查小组|说明了海岸垃圾的移动路线|本周五下午|港口研究站|确定清理工作的重点区域
教育政策研究所|讨论了职业教育课程改革|下周六上午|研究所会议中心|让课堂技能更加符合实际工作
区域合作委员会|审议了跨城市铁路建设建议|本周日晚上|委员会视频会议|不同城市的通勤需求持续增加
科技伦理小组|发布了人工智能应用指南|下周一上午|科技园公共大厅|保护使用者的个人信息
地方新闻编辑部|调查了社区公共空间的变化|本周二下午|城市东部的居民区|居民对新广场有不同看法
城市档案馆|展出了百年前的生活照片|下周三晚上|档案馆临时展厅|帮助年轻人理解地方历史
社会服务机构|评估了独居老人送餐项目|本周四上午|社区服务办公室|确定哪些家庭仍需上门帮助
大学语言中心|开发了面向成人的阅读教材|下周五下午|语言中心线上平台|现有材料忽略了成年学习者
森林研究站|比较了不同树种的降温效果|本周六早上|城市北面的森林公园|寻找缓解夏季高温的办法
公共图书馆联盟|建立了馆际借书系统|下周日下午|联盟服务网站|小型图书馆的藏书数量有限
体育科学团队|公布了运动与专注力实验数据|本周一下午|体育学院实验室|检验短时间运动是否有助学习
气象服务中心|改进了暴雨预警的发布方式|下周二晚上|气象中心工作室|居民需要更早收到风险提示
社区法律服务站|举办了租房合同阅读讲座|本周三下午|街道办事处教室|初次租房的人容易忽略条款
农业合作社|推广了新的土壤检测服务|下周四上午|合作社服务大厅|农户希望减少不必要的施肥
大学出版社|推出了开放获取的研究丛书|本周五晚上|出版社数字平台|让更多读者免费阅读学术成果`)

const matrices = {
  1: { listening: 20, reading: 20, writing: 0, times: [18, 17, 0], administration: 5, bank: beginner },
  2: { listening: 35, reading: 25, writing: 0, times: [28, 22, 0], administration: 5, bank: beginner },
  3: { listening: 40, reading: 30, writing: 10, times: [40, 30, 15], administration: 5, bank: intermediate },
  4: { listening: 45, reading: 40, writing: 15, times: [35, 40, 25], administration: 5, bank: intermediate },
  5: { listening: 45, reading: 45, writing: 10, times: [35, 45, 40], administration: 5, bank: advanced },
  6: { listening: 50, reading: 50, writing: 1, times: [40, 50, 45], administration: 5, bank: advanced },
} as const
export const HSK_LEVELS: HskLevel[] = [1, 2, 3, 4, 5, 6]

function choices(correct: string, pool: Situation[], key: keyof Situation, rowIndex: number, shift: number) {
  const wrong: string[] = []
  for (let offset = 1; wrong.length < 3 && offset < pool.length; offset++) {
    const option = pool[(rowIndex + offset) % pool.length][key]
    if (option !== correct && !wrong.includes(option)) wrong.push(option)
  }
  if (wrong.length !== 3) throw new Error('Alternativas HSK insuficientes')
  const answer = shift % 4
  wrong.splice(answer, 0, correct)
  return { options: wrong, answer }
}

function objective(level: HskLevel, skill: 'listening' | 'reading', count: number, bank: Situation[]): HskQuestion[] {
  const split = level <= 2 ? 9 : level <= 4 ? 12 : 13
  const listeningPool = bank.slice(0, split)
  const readingPool = bank.slice(split)
  const pool = skill === 'listening' ? listeningPool : readingPool
  return Array.from({ length: count }, (_, index) => {
    const rowIndex = Math.floor(index / 4)
    const kind = index % 4
    const row = pool[rowIndex]
    if (!row) throw new Error(`Banco HSK ${level} ${skill} insuficiente`)
    const field: keyof Situation = kind === 0 ? 'action' : kind === 1 ? 'when' : kind === 2 ? 'where' : 'reason'
    const prompt = kind === 0 ? '这段话主要说什么？' : kind === 1 ? '这件事什么时候发生？' : kind === 2 ? '这件事在哪里发生？' : '为什么要做这件事？'
    const context = `${row.person}：${row.action}。时间：${row.when}。地点：${row.where}。原因：${row.reason}。`
    return { id: `${level}-${skill}-${index + 1}`, skill, prompt, ...(skill === 'listening' ? { audio: context } : { passage: context }), ...choices(row[field], pool, field, rowIndex, index) }
  })
}

const reorder = [
  ['我 / 今天 / 去 / 图书馆', '我今天去图书馆。'], ['她 / 喜欢 / 喝 / 茶', '她喜欢喝茶。'],
  ['我们 / 明天 / 学习 / 汉语', '我们明天学习汉语。'], ['这 / 本 / 书 / 很 / 有意思', '这本书很有意思。'],
  ['爸爸 / 在 / 厨房 / 做饭', '爸爸在厨房做饭。'], ['他们 / 坐 / 地铁 / 去 / 学校', '他们坐地铁去学校。'],
  ['今天 / 的 / 天气 / 非常 / 好', '今天的天气非常好。'], ['你 / 能 / 帮 / 我 / 吗', '你能帮我吗？'],
  ['老师 / 给 / 学生 / 讲 / 故事', '老师给学生讲故事。'], ['我 / 昨天 / 买 / 了 / 水果', '我昨天买了水果。'],
  ['虽然 / 下雨 / 但是 / 他 / 还是 / 出门 / 了', '虽然下雨，但是他还是出门了。'],
  ['如果 / 有时间 / 我们 / 就 / 去 / 博物馆', '如果有时间，我们就去博物馆。'],
  ['这个 / 活动 / 不仅 / 有趣 / 而且 / 有意义', '这个活动不仅有趣，而且有意义。'],
  ['为了 / 减少 / 浪费 / 学校 / 改变 / 了 / 菜单', '为了减少浪费，学校改变了菜单。'],
  ['随着 / 城市 / 发展 / 公共交通 / 也 / 在 / 改善', '随着城市发展，公共交通也在改善。'],
]
const shortPrompts = [
  '请用“计划”和“周末”写一句话。', '请用“帮助”和“朋友”写一句话。', '请描述一个人在图书馆借书的情景。',
  '请描述一家人在公园散步的情景。', '请用“虽然”和“但是”写一句话。', '请写一句话说明为什么要节约用水。',
  '请描述学生在教室里讨论问题的情景。', '请用“因为”和“所以”写一句话。',
  '请写一句话介绍你喜欢的交通工具。', '请描述两个人在商店买东西的情景。',
]
const essays = [
  '请写一段话：介绍一次你参加过的活动，并说明你学到了什么。',
  '请写一段话：你认为学校应该怎样帮助学生养成阅读习惯？',
]
function writing(level: HskLevel): HskQuestion[] {
  if (level <= 2) return []
  if (level === 6) return [{ id: '6-writing-1', skill: 'writing', prompt: '请在规定时间内阅读下面的短文，然后根据主要内容写一篇摘要。\n一座城市决定把一块空地改造成公共花园。起初，部分居民担心施工会带来噪声，也有人希望把这里用作停车场。市政府邀请居民、学校和商店参加讨论，并公布了不同方案的费用。经过几次会议，大家决定保留一部分停车位，同时建设步道、种植树木，还安排志愿者轮流照顾花园。花园开放后，附近的孩子可以观察植物，老人也有了散步的地方。政府在一年后收集意见，发现使用人数增加，但维护费用也比预计的高。居民因此提出让学校参与植物记录，并由商店支持日常工具。这个项目表明，公共空间的规划需要持续协商和评估，而不是在开工时就结束。', guide: '这是一篇缩短的原创材料。请概括主要内容，不要加入个人观点；不进行自动评分。' }]
  const count = matrices[level].writing
  const items = level === 3 || level === 4 ? reorder.slice(0, 10) : reorder.slice(2, 10)
  const questions: HskQuestion[] = items.map(([words, expected], index) => ({ id: `${level}-writing-${index + 1}`, skill: 'writing', prompt: `请用下面的词语组成一个通顺的句子：\n${words}`, guide: `参考句：${expected}。也可能有其他正确的表达；请自行核对。` }))
  if (level === 4) questions.push(...shortPrompts.slice(0, 5).map((prompt, index) => ({ id: `${level}-writing-${questions.length + index + 1}`, skill: 'writing' as const, prompt, guide: '原创文字情景题，代替正式试卷中的图片题；请自行检查词语和语法。' })))
  if (level === 5) questions.push(...essays.map((prompt, index) => ({ id: `${level}-writing-${questions.length + index + 1}`, skill: 'writing' as const, prompt, guide: '请写一段连贯的文字；本平台不进行自动评分。' })))
  if (questions.length !== count) throw new Error(`Escrita HSK ${level} incompleta`)
  return questions
}

export function makeHskExam(level: HskLevel): HskExam {
  const matrix = matrices[level]
  const sections: HskSection[] = [
    { id: 'listening', name: '听力 · Compreensão auditiva', minutes: matrix.times[0], questions: objective(level, 'listening', matrix.listening, matrix.bank) },
    { id: 'reading', name: '阅读 · Leitura', minutes: matrix.times[1], questions: objective(level, 'reading', matrix.reading, matrix.bank) },
  ]
  if (level >= 3) sections.push({ id: 'writing', name: '书写 · Escrita', minutes: matrix.times[2], questions: writing(level) })
  return { level, sections, questions: sections.flatMap(section => section.questions), duration: sections.reduce((sum, section) => sum + section.minutes, Number(matrix.administration)) }
}
export const hskExams = HSK_LEVELS.map(makeHskExam)
