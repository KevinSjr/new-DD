import { useRef, useState } from 'react'
import { router } from 'expo-router'
import { Image, Linking, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native'
import { api } from '../api'
import { AppIcon } from '../components/AppIcon'
import { Action, Notice, Panel, Pill } from '../components/Controls'
import { Screen } from '../components/Screen'
import { CAREERS_BY_AREA } from '../data/vocationalCareers'
import { INTEREST_AREAS, QUESTION_STEPS, VALUES, type InterestArea } from '../data/vocationalQuestions'
import { calculateVocationalScores, type VocationalAnswer, type VocationalScore } from '../lib/vocational'
import { useSession } from '../session'
import { theme } from '../theme'

type Phase = 'intro' | 'questions' | 'values' | 'result'
const SCALE: { value:VocationalAnswer; label:string }[] = [
  {value:1,label:'Não gostaria'},
  {value:2,label:'Gostaria pouco'},
  {value:3,label:'Não sei / indiferente'},
  {value:4,label:'Gostaria'},
  {value:5,label:'Gostaria muito'},
]
const format = (value:number) => value.toFixed(1).replace('.',',')

function CareerGroup({ score, onExplore }: { score:VocationalScore; onExplore:(area:InterestArea)=>void }) {
  const [expanded,setExpanded] = useState(false)
  const careers = CAREERS_BY_AREA[score.area]
  return <Panel>
    <View style={styles.careerHead}><View style={styles.careerIcon}><AppIcon name="compass" color={theme.blue} size={22} /></View>
      <View style={{flex:1}}><Text style={styles.careerArea}>{INTEREST_AREAS[score.area].label}</Text><Text style={styles.muted}>{INTEREST_AREAS[score.area].short}</Text></View></View>
    <Text style={styles.muted}>{INTEREST_AREAS[score.area].description}</Text>
    {careers.slice(0,expanded ? careers.length : 3).map(career => <View key={career.title} style={styles.careerRow}>
      <Text style={styles.careerTitle}>{career.title}</Text><Text style={styles.muted}>Formações para pesquisar: {career.courses}</Text>
    </View>)}
    <Action label={expanded ? 'Ver menos opções' : 'Ver mais opções'} secondary onPress={() => {
      if (!expanded) onExplore(score.area)
      setExpanded(!expanded)
    }} />
  </Panel>
}

export default function VocationalTest() {
  const {token} = useSession()
  const [phase,setPhase] = useState<Phase>('intro')
  const [step,setStep] = useState(0)
  const [answers,setAnswers] = useState<Record<string,VocationalAnswer>>({})
  const [priorities,setPriorities] = useState<string[]>([])
  const [error,setError] = useState('')
  const completionRef = useRef<Promise<void>>(Promise.resolve())
  const runIdRef = useRef('')
  const current = QUESTION_STEPS[step]
  const answered = Object.keys(answers).length
  const scores = phase === 'result' ? calculateVocationalScores(answers) : []
  const leaders = scores.slice(0,2)
  const closeScores = leaders.length === 2 && leaders[0].mean - leaders[1].mean <= 0.3

  const next = () => {
    const missing = current.find(question => answers[question.id] === undefined)
    if (missing) {
      setError('Responda às seis atividades desta etapa. Você pode imaginar como seria experimentar uma atividade nova.')
      return
    }
    setError('')
    if (step < QUESTION_STEPS.length - 1) setStep(step+1)
    else setPhase('values')
  }
  const finish = () => {
    const firstIncomplete = QUESTION_STEPS.findIndex(questions => questions.some(question => answers[question.id] === undefined))
    if (firstIncomplete !== -1) {
      setStep(firstIncomplete)
      setError('Responda às atividades que faltam para ver o resultado.')
      setPhase('questions')
      return
    }
    const top = calculateVocationalScores(answers).slice(0,2).map(item => item.area)
    runIdRef.current = Date.now().toString(36) + Math.random().toString(36).slice(2)
    if (token) {
      const run = runIdRef.current
      completionRef.current = api('/api/account/achievements/events',{method:'POST',token,
        body:{kind:'voc-complete',target:run,details:{leaders:top}}})
        .then(() => api('/api/account/achievements/events',{method:'POST',token,
          body:{kind:'voc-chart',target:run,details:{}}})).then(() => {}).catch(() => {})
    }
    setError('')
    setPhase('result')
  }
  const restart = () => {
    setAnswers({});setPriorities([]);setStep(0);setError('');setPhase('intro')
  }
  const togglePriority = (value:string) => {
    setPriorities(previous => previous.includes(value) ? previous.filter(item => item !== value)
      : previous.length < 3 ? [...previous,value] : previous)
  }
  const explore = (area:InterestArea) => {
    if (!token || !runIdRef.current) return
    const run = runIdRef.current
    void completionRef.current.then(() => api('/api/account/achievements/events',{method:'POST',token,
      body:{kind:'voc-profile',target:run + ':' + area,details:{run,profile:area}}})).catch(() => {})
  }

  const title = phase === 'result' ? 'Seu panorama de interesses' : 'Teste vocacional'
  const description = phase === 'result' ? 'Conheça padrões para investigar cursos e profissões.' : 'Descubra quais atividades despertam seu interesse.'
  return <Screen key={phase + '-' + step} navTitle="Teste vocacional" hideHeading={phase === 'intro'} title={title} description={description} eyebrow="EXPLORE SEU CAMINHO">
    {phase === 'intro' && <>
      <View style={styles.hero}>
        <View style={styles.heroSparkLeft}><AppIcon name="star" color={theme.yellow} size={22} /></View>
        <Image source={require('../../assets/images/vocational-compass.png')} style={styles.compassImage} resizeMode="contain" accessibilityLabel="Bússola azul com estrela amarela" />
        <View style={styles.heroSparkRight}><AppIcon name="star" color={theme.sky} size={18} /></View>
      </View>
      <Panel>
        <Text style={styles.heading}>Descubra sua vocação</Text>
        <Text style={styles.body}>Responda a 60 atividades em 10 etapas e explore áreas que combinam com seus interesses.</Text>
        <View style={styles.facts}><Pill>60 atividades</Pill><Pill>10 etapas</Pill><Pill>Sem cadastro</Pill></View>
        <Action label="Começar teste  →" onPress={() => setPhase('questions')} />
      </Panel>
      <Panel>
        <Text style={styles.subheading}>Como responder</Text>
        <Text style={styles.body}>Pense no interesse pela atividade, mesmo que ainda não saiba fazê-la. Imagine que pode aprender o necessário.</Text>
        <Text style={styles.muted}>O resultado orienta a exploração. Não mede competência, aptidão nem chance de aprovação.</Text>
      </Panel>
      <Text style={styles.privacy}>Suas respostas ficam somente no app enquanto esta tela estiver aberta. Elas não são salvas.</Text>
    </>}
    {phase === 'questions' && <>
      <View style={styles.progressHead}><Text style={styles.step}>Etapa {step+1} de 10</Text><Text style={styles.counter}>{answered} de 60 respondidas</Text></View>
      <View style={styles.track}><View style={[styles.trackFill,{width:(((step+1)*10)+'%') as DimensionValue}]} /></View>
      <Text style={styles.body}>Quanto você gostaria de fazer cada atividade?</Text>
      {!!error && <Notice error>{error}</Notice>}
      {current.map((question,index) => <Panel key={question.id}>
        <View style={styles.questionHead}><Text style={styles.questionNumber}>{String(step*6+index+1).padStart(2,'0')}</Text>
          <Text style={styles.questionText}>{question.text}</Text></View>
        <View accessibilityRole="radiogroup" accessibilityLabel={'Atividade ' + (step*6+index+1)}>
          {SCALE.map(option => {
            const selected = answers[question.id] === option.value
            return <Pressable key={option.value} accessibilityRole="radio" accessibilityState={{checked:selected}}
              accessibilityLabel={option.label} onPress={() => {setAnswers(previous => ({...previous,[question.id]:option.value}));setError('')}}
              style={({pressed})=>[styles.option,selected && styles.optionSelected,pressed && {opacity:.75}]}>
              <View style={[styles.radio,selected && styles.radioSelected]}>{selected && <View style={styles.radioDot} />}</View>
              <Text style={[styles.optionText,selected && styles.optionTextSelected]}>{option.label}</Text>
            </Pressable>
          })}
        </View>
      </Panel>)}
      <View style={styles.actions}>
        <View style={{flex:1}}><Action label="Voltar" secondary onPress={() => {
          setError('')
          if (step === 0) setPhase('intro'); else setStep(step-1)
        }} /></View>
        <View style={{flex:1}}><Action label={step === 9 ? 'Prioridades  →' : 'Próxima etapa  →'} onPress={next} /></View>
      </View>
    </>}
    {phase === 'values' && <>
      <View style={styles.heroCompact}><AppIcon name="star" color={theme.yellow} size={42} /><Text style={styles.heroCompactText}>Última etapa</Text></View>
      <Panel>
        <Text style={styles.heading}>O que importa para você?</Text>
        <Text style={styles.body}>Escolha até três prioridades. Elas ajudam a interpretar o resultado, mas não alteram sua pontuação.</Text>
        {VALUES.map(value => {
          const selected = priorities.includes(value)
          const disabled = !selected && priorities.length >= 3
          return <Pressable key={value} accessibilityRole="checkbox" accessibilityState={{checked:selected,disabled}}
            disabled={disabled} onPress={() => togglePriority(value)}
            style={[styles.option,selected && styles.optionSelected,disabled && {opacity:.45}]}>
            <View style={[styles.radio,selected && styles.radioSelected]}>{selected && <Text style={styles.check}>✓</Text>}</View>
            <Text style={[styles.optionText,selected && styles.optionTextSelected]}>{value}</Text>
          </Pressable>
        })}
        <Text style={styles.muted}>{priorities.length} de 3 prioridades selecionadas</Text>
        <Action label="Ver meu panorama  →" onPress={finish} />
        <Action label="Rever respostas" secondary onPress={() => {setStep(9);setPhase('questions')}} />
      </Panel>
    </>}
    {phase === 'result' && <>
      <View style={styles.resultHero}><AppIcon name="compass" color={theme.blue} size={45} />
        <View style={{flex:1}}><Text style={styles.resultHeroTitle}>Seu mapa de seis interesses</Text>
          <Text style={styles.muted}>{closeScores ? 'As duas maiores médias ficaram próximas. Explore ambas.' : 'As duas maiores áreas orientam as sugestões abaixo.'}</Text></View></View>
      <Panel>
        <Text style={styles.heading}>As seis áreas</Text>
        <Text style={styles.muted}>Médias de interesse de 1 a 5. Este gráfico não mede competência ou aptidão.</Text>
        {scores.map((score,index) => <View key={score.area} style={styles.scoreRow}
          accessibilityLabel={INTEREST_AREAS[score.area].label + ': ' + format(score.mean) + ' de 5'}>
          <View style={styles.scoreHead}><Text style={[styles.scoreLabel,index < 2 && styles.leader]}>{INTEREST_AREAS[score.area].label}</Text>
            <Text style={styles.scoreValue}>{format(score.mean)} / 5</Text></View>
          <View style={styles.scoreTrack}><View style={[styles.scoreFill,{width:((score.mean/5*100)+'%') as DimensionValue,backgroundColor:index < 2 ? theme.blue : theme.sky}]} /></View>
        </View>)}
      </Panel>
      <Text style={styles.sectionTitle}>Caminhos para explorar</Text>
      <Text style={styles.body}>Exemplos ligados aos seus dois maiores interesses. A ordem das profissões não é um ranking pessoal.</Text>
      {leaders.map(score => <CareerGroup key={score.area} score={score} onExplore={explore} />)}
      {priorities.length > 0 && <Panel><Text style={styles.subheading}>Suas prioridades</Text>
        {priorities.map(value => <Text key={value} style={styles.priority}>• {value}</Text>)}
        <Text style={styles.muted}>Elas não alteram as notas do gráfico.</Text>
      </Panel>}
      <Panel><Text style={styles.subheading}>Próximo passo</Text>
        <Text style={styles.body}>Compare a grade curricular e a rotina de cursos das duas áreas antes de decidir.</Text>
        <Action label="Explorar países  →" onPress={() => router.push('/paises')} />
      </Panel>
      <Text style={styles.privacy}>Este questionário original usa seis dimensões inspiradas no modelo RIASEC. Ainda não foi validado com estudantes brasileiros e não substitui orientação profissional individual ou avaliação psicológica. As respostas não são armazenadas; reiniciar o app apaga o resultado. Se você estiver conectado, a conclusão, as duas áreas mais altas e as áreas exploradas são registradas para conquistas.</Text>
      <Action label="Conhecer a referência O*NET" secondary onPress={() => {void Linking.openURL('https://www.onetcenter.org/IP.html')}} />
      <Action label="Refazer o teste" secondary onPress={restart} />
    </>}
  </Screen>
}

const styles = StyleSheet.create({
  hero:{height:190,backgroundColor:'#e8efff',borderRadius:24,marginBottom:16,alignItems:'center',justifyContent:'center',overflow:'hidden'},
  compassImage:{width:162,height:162},
  heroSparkLeft:{position:'absolute',left:31,top:37},heroSparkRight:{position:'absolute',right:36,bottom:29},
  heading:{color:theme.navy,fontSize:19,fontWeight:'800',lineHeight:25},subheading:{color:theme.navy,fontSize:16,fontWeight:'800'},
  body:{color:theme.muted,fontSize:14,lineHeight:21},muted:{color:theme.muted,fontSize:12,lineHeight:18},
  facts:{flexDirection:'row',flexWrap:'wrap',gap:6,marginVertical:5},privacy:{color:theme.muted,fontSize:12,lineHeight:19,marginBottom:17},
  progressHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},step:{color:theme.blue,fontSize:14,fontWeight:'800'},
  counter:{color:theme.muted,fontSize:12},track:{height:9,backgroundColor:'#dce7fa',borderRadius:6,overflow:'hidden',marginVertical:12},
  trackFill:{height:'100%',backgroundColor:theme.green,borderRadius:6},
  questionHead:{flexDirection:'row',gap:11,alignItems:'flex-start',marginBottom:5},
  questionNumber:{width:34,height:34,textAlign:'center',textAlignVertical:'center',borderRadius:11,overflow:'hidden',backgroundColor:theme.pale,color:theme.blue,fontWeight:'800',fontSize:14},
  questionText:{flex:1,color:theme.navy,fontSize:15,fontWeight:'800',lineHeight:22},
  option:{minHeight:46,borderWidth:1.5,borderColor:theme.border,borderRadius:13,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12,paddingVertical:7,marginTop:7,backgroundColor:theme.white},
  optionSelected:{borderColor:theme.blue,backgroundColor:theme.pale},optionText:{color:theme.navy,fontSize:13,flex:1},
  optionTextSelected:{color:theme.blue,fontWeight:'800'},radio:{width:19,height:19,borderWidth:2,borderColor:'#9ab0d1',borderRadius:10,alignItems:'center',justifyContent:'center'},
  radioSelected:{borderColor:theme.blue},radioDot:{width:9,height:9,borderRadius:5,backgroundColor:theme.blue},check:{fontSize:13,color:theme.blue,fontWeight:'800'},
  actions:{flexDirection:'row',gap:9,marginBottom:12},heroCompact:{height:100,borderRadius:20,backgroundColor:'#e1edff',alignItems:'center',justifyContent:'center',marginBottom:15},
  heroCompactText:{color:theme.navy,fontWeight:'800',marginTop:3},resultHero:{backgroundColor:'#e1edff',borderRadius:19,padding:16,flexDirection:'row',gap:14,alignItems:'center',marginBottom:15},
  resultHeroTitle:{color:theme.navy,fontSize:17,fontWeight:'800',marginBottom:3},scoreRow:{gap:6,marginTop:9},
  scoreHead:{flexDirection:'row',justifyContent:'space-between',gap:8},scoreLabel:{color:theme.muted,fontSize:13,fontWeight:'700'},
  leader:{color:theme.blue},scoreValue:{color:theme.navy,fontSize:13,fontWeight:'800'},
  scoreTrack:{height:10,backgroundColor:'#e7effc',borderRadius:6,overflow:'hidden'},scoreFill:{height:'100%',borderRadius:6},
  sectionTitle:{color:theme.navy,fontSize:19,fontWeight:'800',marginTop:7,marginBottom:5},
  careerHead:{flexDirection:'row',alignItems:'center',gap:10},careerIcon:{width:40,height:40,borderRadius:13,backgroundColor:theme.pale,alignItems:'center',justifyContent:'center'},
  careerArea:{color:theme.navy,fontSize:16,fontWeight:'800'},careerRow:{borderTopColor:theme.border,borderTopWidth:1,paddingTop:8,gap:3},
  careerTitle:{color:theme.navy,fontSize:13,fontWeight:'800'},priority:{color:theme.navy,fontSize:13,lineHeight:20},
})
