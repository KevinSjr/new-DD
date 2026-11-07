import { useState } from 'react'
import { router } from 'expo-router'
import { Image, Linking, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native'
import { api } from '../api'
import { AppIcon } from '../components/AppIcon'
import { Action, Notice, Panel, Pill } from '../components/Controls'
import { Screen } from '../components/Screen'
import { regionOptions, questionSteps, stepKeys, stepTitles, type RadioKey } from '../data/destinationQuestions'
import { DESTINATION_PROFILES, DESTINATION_SOURCES, type Region } from '../data/destinationProfiles'
import { matchDestinations, type DestinationAnswers, type DestinationMatch } from '../lib/destinationMatcher'
import { useSession } from '../session'
import { theme } from '../theme'

const makeRunId = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
  const value = Math.floor(Math.random() * 16)
  return (char === 'x' ? value : (value & 3 | 8)).toString(16)
})
const signatureOf = (answers:DestinationAnswers) =>
  ([...JSON.stringify(answers)].reduce((hash,char) => Math.imul(hash ^ char.charCodeAt(0),16777619),2166136261) >>> 0).toString(16)
const levelLabel:Record<DestinationAnswers['level'],string> = {
  undergraduate:'graduação',graduate:'mestrado ou pós-graduação',research:'doutorado ou pesquisa',
  exchange:'intercâmbio',language:'idiomas',short:'curta duração',undecided:'um nível de estudo a definir',
}

function Option({label,selected,onPress,multiple=false}:{label:string;selected:boolean;onPress:()=>void;multiple?:boolean}) {
  return <Pressable accessibilityRole={multiple?'checkbox':'radio'} accessibilityState={{checked:selected}} onPress={onPress}
    style={({pressed})=>[styles.option,selected&&styles.optionSelected,pressed&&{opacity:.7}]}>
    <View style={[styles.marker,multiple&&styles.markerSquare,selected&&styles.markerSelected]}>
      {selected&&<View style={styles.markerDot} />}</View>
    <Text style={[styles.optionLabel,selected&&styles.optionLabelSelected]}>{label}</Text>
  </Pressable>
}

function ResearchChecklist({answers}:{answers:DestinationAnswers}) {
  const items = [
    'Um programa de '+levelLabel[answers.level]+(answers.field==='undecided'?'':' na sua área de interesse')+' e seu idioma de ensino.',
    'Mensalidade, moradia e despesas na cidade específica. Seu orçamento declarado não foi usado para classificar países.',
    ...(answers.learningTime==='none'?[]:['A proficiência exigida e o tempo necessário para aprender o idioma.']),
    ...(answers.tuition==='scholarship'?['Uma bolsa real que cubra os custos necessários; nenhum destino aqui tem bolsa garantida.']:[]),
    ...(answers.tuition==='low'?['O preço do curso para estudantes brasileiros; mensalidade baixa não foi presumida.']:[]),
    ...(answers.work==='no'?[]:['As regras atuais de trabalho para seu visto e curso. Não conte com renda ainda não confirmada.']),
    ...(answers.after==='return'?[]:['As regras atuais para permanecer após o curso; isso não é garantido.']),
    'Cidades e campi que ofereçam o ambiente que você procura.',
  ]
  return <Panel><Text style={styles.sectionTitle}>Antes de escolher, confirme</Text>
    {items.map(item=><View key={item} style={styles.checkRow}><AppIcon name="check" color={theme.green} size={17} />
      <Text style={styles.bodyFlex}>{item}</Text></View>)}
  </Panel>
}

function MatchCard({match,index,previousScore}:{match:DestinationMatch;index:number;previousScore?:number}) {
  const slug=match.profile.slug
  const reason=match.reasons.slice(1).join(' ') || 'Está em uma região escolhida; clima e idioma não diferenciam este destino.'
  return <Panel><View style={styles.matchHead}><View style={styles.number}><Text style={styles.numberText}>{String(index+1).padStart(2,'0')}</Text></View>
    <View style={{flex:1}}><Text style={styles.matchName}>{match.profile.name}</Text>
      {previousScore===match.score&&<Text style={styles.tie}>Mesmo alinhamento do destino anterior</Text>}</View></View>
    <Text style={styles.body}><Text style={styles.bold}>Por que apareceu: </Text>{reason}</Text>
    {match.cautions.length>0&&<Text style={styles.body}><Text style={styles.bold}>Confira: </Text>{match.cautions[0]}</Text>}
    <Action label={'Pesquisar bolsas para '+match.profile.name+'  →'} secondary
      onPress={()=>router.push({pathname:'/bolsas',params:{country:slug}})} />
  </Panel>
}

export default function DestinationFinder() {
  const {token}=useSession()
  const [step,setStep]=useState(-1)
  const [answers,setAnswers]=useState<Partial<DestinationAnswers>>({regions:[],priorities:[]})
  const [error,setError]=useState('')
  const [showAll,setShowAll]=useState(false)
  const complete=step===3
  const matches=complete?matchDestinations(answers as DestinationAnswers,DESTINATION_PROFILES):[]
  const regionMatches=matches.filter(item=>answers.regions?.includes(item.profile.region))
  const preferred=regionMatches.slice(0,5)
  const tiedAtCutoff=regionMatches.length>5&&regionMatches[4].score===regionMatches[5].score
  const bothComparable=answers.climate!=='any'&&(answers.language!=='learn'||answers.learningTime==='none')

  const setRadio=(key:RadioKey,value:string)=>{
    setAnswers(previous=>({...previous,[key]:value,
      ...(key==='climate'||key==='language'||key==='learningTime'?{priorities:[]}:{}),
    }))
    setError('')
  }
  const toggleRegion=(value:Region)=>{
    setAnswers(previous=>({...previous,regions:previous.regions?.includes(value)
      ? previous.regions.filter(region=>region!==value) : [...(previous.regions||[]),value]}))
    setError('')
  }
  const setPriority=(value:'balanced'|'climate'|'language')=>{
    setAnswers(previous=>({...previous,priorities:value==='balanced'?[]:[value]}))
    setError('')
  }
  const next=()=>{
    const missing=stepKeys[step].find(key=>key==='regions'?!answers.regions?.length:!answers[key])
    if(missing){setError('Responda todas as perguntas desta etapa para continuar.');return}
    setError('')
    if(step===2&&token){
      const full=answers as DestinationAnswers
      const top=matchDestinations(full,DESTINATION_PROFILES).filter(item=>full.regions.includes(item.profile.region)).slice(0,5).map(item=>item.profile.slug)
      void api('/api/account/achievements/events',{method:'POST',token,
        body:{kind:'destination-complete',target:makeRunId(),details:{signature:signatureOf(full),top}}}).catch(()=>{})
    }
    setStep(step+1)
  }
  const restart=()=>{setAnswers({regions:[],priorities:[]});setError('');setShowAll(false);setStep(-1)}

  return <Screen key={step} navTitle="Descobridor de Mundos" hideHeading title="Descobridor de Mundos"
    description="Explore destinos de acordo com suas preferências.">
    {step===-1&&<>
      <View style={styles.hero}><Image source={require('../../assets/images/journey-globe.png')} resizeMode="contain"
        style={styles.heroImage} accessibilityLabel="Globo com avião, nuvens e estrelas" /></View>
      <Text style={styles.introTitle} accessibilityRole="header">Qual país combina com você?</Text>
      <Text style={styles.introText}>Responda sobre região, clima, idioma e seus planos de estudo para encontrar destinos que vale investigar.</Text>
      <Action label="Começar teste  →" onPress={()=>setStep(0)} />
      <Panel><Text style={styles.sectionTitle}>Sua busca começa com você</Text>
        <View style={styles.facts}><Pill>25 destinos</Pill><Pill>3 etapas</Pill><Pill>Sem cadastro</Pill></View>
        <Text style={styles.body}>Comparamos preferências de região, clima e idioma. Orçamento, bolsa, trabalho e permanência viram pontos para verificar depois.</Text>
        <Text style={styles.body}>O resultado não prevê aprovação, bolsa ou visto.</Text></Panel>
      <Text style={styles.note}>As respostas ficam nesta tela. Se você estiver conectado, a conclusão e os destinos apresentados são registrados para conquistas.</Text>
    </>}
    {step>=0&&step<3&&<>
      <Text style={styles.eyebrow}>ETAPA {step+1} DE 3</Text>
      <Text style={styles.pageTitle} accessibilityRole="header">{stepTitles[step]}</Text>
      <View style={styles.track}><View style={[styles.trackFill,{width:(((step+1)/3*100)+'%') as DimensionValue}]} /></View>
      {!!error&&<Notice error>{error}</Notice>}
      {step===0&&<Panel><Text style={styles.questionTitle}>Em qual parte do mundo você se imagina?</Text>
        <Text style={styles.body}>Escolha uma ou mais regiões.</Text>
        <View accessibilityLabel="Regiões do mundo">
          {regionOptions.map(option=><Option key={option.value} label={option.label} multiple
            selected={!!answers.regions?.includes(option.value)} onPress={()=>toggleRegion(option.value)} />)}</View></Panel>}
      {questionSteps[step].map(question=><Panel key={question.key}>
        <Text style={styles.questionTitle}>{question.title}</Text>
        <View accessibilityRole="radiogroup" accessibilityLabel={question.title}>
          {question.options.map(option=><Option key={option.value} label={option.label}
            selected={answers[question.key]===option.value} onPress={()=>setRadio(question.key,option.value)} />)}</View>
      </Panel>)}
      {step===2&&bothComparable&&<Panel><Text style={styles.questionTitle}>O que pesa mais para você?</Text>
        <Text style={styles.body}>A região define quais países aparecem. Clima ou idioma podem mudar a ordem da lista.</Text>
        <View accessibilityRole="radiogroup" accessibilityLabel="Prioridade entre clima e idioma">
          <Option label="Clima e idioma têm o mesmo peso" selected={!answers.priorities?.length} onPress={()=>setPriority('balanced')} />
          <Option label="Clima pesa mais" selected={!!answers.priorities?.includes('climate')} onPress={()=>setPriority('climate')} />
          <Option label="Idioma pesa mais" selected={!!answers.priorities?.includes('language')} onPress={()=>setPriority('language')} />
        </View></Panel>}
      <View style={styles.actions}>{step>0&&<View style={{flex:1}}><Action label="Voltar" secondary onPress={()=>{setError('');setStep(step-1)}} /></View>}
        <View style={{flex:1}}><Action label={step===2?'Ver destinos  →':'Continuar  →'} onPress={next} /></View></View>
    </>}
    {complete&&<>
      <View style={styles.resultHero}><AppIcon name="globe" color={theme.blue} size={35} />
        <View style={{flex:1}}><Text style={styles.pageTitle}>Destinos para investigar</Text><Text style={styles.body}>Sua rota começa aqui.</Text></View></View>
      <Pill tone="yellow">Estimativa exploratória</Pill>
      <Text style={styles.resultIntro}>Comparamos clima e idioma nas regiões escolhidas. Empates aparecem em ordem alfabética. A lista não prevê bolsa, visto ou aprovação.</Text>
      {tiedAtCutoff&&<Notice>Há outros destinos com o mesmo alinhamento do quinto. Veja a lista completa abaixo.</Notice>}
      {preferred.map((match,index)=><MatchCard key={match.profile.slug} match={match} index={index}
        previousScore={index>0?preferred[index-1].score:undefined} />)}
      <ResearchChecklist answers={answers as DestinationAnswers} />
      <Action label={showAll?'Ocultar lista completa':'Ver os 25 destinos  →'} secondary onPress={()=>setShowAll(!showAll)} />
      {showAll&&<Panel>{matches.map((match,index)=><Pressable key={match.profile.slug} accessibilityRole="button"
        onPress={()=>router.push({pathname:'/bolsas',params:{country:match.profile.slug}})} style={styles.allRow}>
        <Text style={styles.allName}>{index+1}. {match.profile.name}</Text><AppIcon name="chevron" color={theme.blue} size={17} /></Pressable>)}</Panel>}
      <Panel><Text style={styles.sectionTitle}>Como chegamos a esta lista</Text>
        <Text style={styles.body}>Primeiro mostramos os países das regiões escolhidas. Dentro delas, clima e idioma do cotidiano definem a ordem. Quando você marca “tanto faz” para clima, ele não diferencia os países. Aceitar aprender o idioma local também não diferencia quando há tempo para isso.</Text>
        <Text style={styles.body}>Custo, mensalidade, bolsas, trabalho e regras após o curso não entram na classificação sem dados atuais para sua situação. O clima varia por cidade e o idioma de ensino depende da instituição.</Text>
        <Text style={styles.note}>Categorias amplas e editoriais. Referências gerais verificadas em 19/10/2026:</Text>
        <Pressable accessibilityRole="link" onPress={()=>{void Linking.openURL(DESTINATION_SOURCES.region)}}><Text style={styles.source}>Regiões da ONU  ↗</Text></Pressable>
        <Pressable accessibilityRole="link" onPress={()=>{void Linking.openURL(DESTINATION_SOURCES.climate)}}><Text style={styles.source}>Portal climático do Banco Mundial  ↗</Text></Pressable>
      </Panel>
      <Action label="Explorar todos os países  →" onPress={()=>router.push('/paises')} />
      <Action label="Refazer o teste" secondary onPress={restart} />
    </>}
  </Screen>
}

const styles=StyleSheet.create({
  hero:{height:205,backgroundColor:'#e9f0ff',borderRadius:24,alignItems:'center',justifyContent:'center',overflow:'hidden',marginBottom:15},
  heroImage:{width:'100%',height:210},introTitle:{color:theme.navy,fontSize:24,fontWeight:'800',textAlign:'center',marginBottom:8},
  introText:{color:theme.muted,fontSize:13,lineHeight:20,textAlign:'center',marginBottom:15},
  sectionTitle:{color:theme.navy,fontSize:16,fontWeight:'800'},facts:{flexDirection:'row',flexWrap:'wrap',gap:6},
  body:{color:theme.muted,fontSize:12,lineHeight:18},bodyFlex:{flex:1,color:theme.muted,fontSize:12,lineHeight:18},
  note:{color:theme.muted,fontSize:11,lineHeight:17,marginBottom:12},eyebrow:{color:theme.blue,fontSize:11,fontWeight:'800',letterSpacing:1},
  pageTitle:{color:theme.navy,fontSize:20,fontWeight:'800',lineHeight:26,marginTop:4},
  track:{height:8,backgroundColor:theme.border,borderRadius:8,overflow:'hidden',marginVertical:14},
  trackFill:{height:8,backgroundColor:theme.green,borderRadius:8},questionTitle:{color:theme.navy,fontSize:15,fontWeight:'800',lineHeight:21},
  option:{minHeight:45,borderWidth:1.5,borderColor:theme.border,borderRadius:14,backgroundColor:theme.white,
    flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12,paddingVertical:9,marginTop:7},
  optionSelected:{borderColor:theme.blue,backgroundColor:theme.pale},optionLabel:{flex:1,color:theme.navy,fontSize:13,lineHeight:18},
  optionLabelSelected:{color:theme.blue,fontWeight:'800'},marker:{width:19,height:19,borderRadius:10,borderWidth:2,borderColor:'#94a8ce',alignItems:'center',justifyContent:'center'},
  markerSquare:{borderRadius:5},markerSelected:{borderColor:theme.blue},markerDot:{width:9,height:9,borderRadius:5,backgroundColor:theme.blue},
  actions:{flexDirection:'row',gap:9,marginBottom:12},resultHero:{flexDirection:'row',alignItems:'center',gap:12,
    backgroundColor:theme.pale,borderRadius:18,padding:14,marginBottom:12},resultIntro:{color:theme.muted,fontSize:12,lineHeight:19,marginVertical:12},
  matchHead:{flexDirection:'row',gap:10,alignItems:'center'},number:{width:36,height:36,borderRadius:12,backgroundColor:theme.blue,alignItems:'center',justifyContent:'center'},
  numberText:{color:theme.white,fontWeight:'800',fontSize:13},matchName:{color:theme.navy,fontSize:16,fontWeight:'800'},
  tie:{color:theme.blue,fontSize:11,marginTop:2},bold:{color:theme.navy,fontWeight:'800'},checkRow:{flexDirection:'row',gap:7,alignItems:'flex-start'},
  allRow:{minHeight:39,flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,borderBottomColor:theme.border},
  allName:{color:theme.navy,fontSize:12,fontWeight:'700'},source:{color:theme.blue,fontSize:12,fontWeight:'800',paddingVertical:4},
})
