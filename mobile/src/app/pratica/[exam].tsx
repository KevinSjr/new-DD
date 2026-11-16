import { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import * as Speech from 'expo-speech'
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioPlayer, useAudioRecorder } from 'expo-audio'
import { Action, Notice, Panel, Pill } from '../../components/Controls'
import { Screen } from '../../components/Screen'
import { ChoiceRow, ExamProgress, formatTime } from '../../exams/ui'
import { findPracticeExam, type PracticeItem, type PracticeVariant } from '../../exams/practiceCatalog'
import { theme } from '../../theme'

function normalized(value:string){return value.trim().toLocaleLowerCase().replace(/\s+/g,' ')}
function isCorrect(item:PracticeItem,value:string){return !!value.trim()&&item.answer!==undefined&&normalized(value)===normalized(item.answer)}
function chunks(text:string){
  const max=Math.max(400,Math.min(1500,Speech.maxSpeechInputLength||1500))
  const words=text.split(/\s+/);const parts:string[]=[];let current=''
  for(const word of words){if(current&&current.length+word.length+1>max){parts.push(current);current=''}current+=(current?' ':'')+word}
  if(current)parts.push(current)
  return parts
}

export default function PracticeExamPage(){
  const params=useLocalSearchParams<{exam:string}>()
  const exam=findPracticeExam(Array.isArray(params.exam)?params.exam[0]:params.exam||'')
  const [variantId,setVariantId]=useState('')
  const [stage,setStage]=useState<'intro'|'preparation'|'running'|'result'>('intro')
  const [sectionIndex,setSectionIndex]=useState(0)
  const [itemIndex,setItemIndex]=useState(0)
  const [answers,setAnswers]=useState<Record<string,string>>({})
  const [deadline,setDeadline]=useState(0)
  const [seconds,setSeconds]=useState(0)
  const [transcript,setTranscript]=useState(false)
  const [review,setReview]=useState(false)
  const [error,setError]=useState('')
  const [recording,setRecording]=useState(false)
  const [recordings,setRecordings]=useState<Record<string,string>>({})
  const recorder=useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const player=useAudioPlayer(null)
  const variant=exam?.variants.find(entry=>entry.id===variantId)||exam?.variants[0]
  const section=variant?.sections[sectionIndex]
  const item=section?.items[itemIndex]

  useEffect(()=>{if(stage!=='running'&&stage!=='preparation')return
    const tick=()=>setSeconds(Math.max(0,Math.ceil((deadline-Date.now())/1000)))
    tick();const timer=setInterval(tick,1000);return()=>clearInterval(timer)
  },[stage,deadline])
  useEffect(()=>{if((stage!=='running'&&stage!=='preparation')||seconds!==0||!deadline||Date.now()<deadline||!variant)return
    if(stage==='preparation'){setStage('running');setDeadline(Date.now()+variant.sections[sectionIndex].minutes*60000);return}
    if(sectionIndex===variant.sections.length-1){setStage('result');return}
    const next=variant.sections[sectionIndex+1]
    setSectionIndex(sectionIndex+1);setItemIndex(0);setTranscript(false)
    setStage(next.preparationMinutes?'preparation':'running')
    setDeadline(Date.now()+(next.preparationMinutes||next.minutes)*60000)
  },[seconds,stage,deadline,sectionIndex,variant])
  useEffect(()=>()=>{void Speech.stop();player.pause();if(recorder.isRecording)void recorder.stop()},[player,recorder])

  if(!exam||!variant||!section||!item)return <Screen navTitle="Exames" title="Simulado não encontrado" description="Volte ao catálogo para escolher uma prova."><Action label="Abrir catálogo" onPress={()=>router.replace('/exames')} /></Screen>

  const answer=answers[item.id]||''
  const total=section.items.length
  const done=section.items.filter(entry=>!!answers[entry.id]?.trim()).length

  function changeVariant(id:string){void Speech.stop();player.pause();setVariantId(id);setStage('intro');setSectionIndex(0);setItemIndex(0);setAnswers({});setRecordings({});setReview(false);setError('')}
  function start(){void Speech.stop();player.pause();setAnswers({});setRecordings({});setReview(false);setError('');setSectionIndex(0);setItemIndex(0)
    setStage('running');setDeadline(Date.now()+variant!.sections[0].minutes*60000)
  }
  function goTo(index:number){void Speech.stop();player.pause();setTranscript(false);setError('');setItemIndex(index)}
  function nextSection(){if(recording)return
    void Speech.stop();player.pause();setTranscript(false);setError('')
    if(sectionIndex===variant!.sections.length-1){setStage('result');return}
    const next=variant!.sections[sectionIndex+1];setSectionIndex(sectionIndex+1);setItemIndex(0)
    setStage(next.preparationMinutes?'preparation':'running');setDeadline(Date.now()+(next.preparationMinutes||next.minutes)*60000)
  }
  async function speak(){if(!item?.audio)return
    setError('')
    try{await Speech.stop();for(const part of chunks(item.audio))Speech.speak(part,{language:exam!.language,rate:exam!.id==='hsk'||exam!.id==='jlpt'?.85:1})}
    catch{setError('Não foi possível reproduzir a voz neste aparelho. Use a transcrição.')}
  }
  async function beginRecording(){
    try{const permission=await requestRecordingPermissionsAsync();if(!permission.granted){setError('Permissão do microfone negada. Você pode praticar em voz alta sem gravar.');return}
      await setAudioModeAsync({allowsRecording:true,playsInSilentMode:true});await recorder.prepareToRecordAsync();recorder.record();setRecording(true);setError('')
    }catch{setError('Não foi possível iniciar a gravação. Pratique em voz alta sem gravar.')}
  }
  async function endRecording(){try{await recorder.stop();setRecording(false);if(recorder.uri){setRecordings(current=>({...current,[item!.id]:recorder.uri!}));setAnswers(current=>({...current,[item!.id]:'Praticado com gravação'}))}
      await setAudioModeAsync({allowsRecording:false})
    }catch{setRecording(false);setError('Não foi possível concluir a gravação.')}
  }
  function playRecording(id:string){const uri=recordings[id];if(!uri)return
    try{player.replace(uri);player.play()}catch{setError('Não foi possível reproduzir a gravação.')}
  }
  const title=exam.name+' · '+variant.title
  return <Screen navTitle={exam.name} title={stage==='intro'?exam.name:stage==='result'?'Relatório de prática':section.title}
    description={stage==='intro'?'Escolha uma versão para começar.':stage==='result'?'Confira seus acertos objetivos e revise as tarefas abertas.':variant.title}
    onBack={()=>router.replace('/exames')}>
    {stage==='intro'&&<>
      <Panel><Pill>PRÁTICA NO APLICATIVO</Pill><Text style={styles.title}>Simulados disponíveis</Text>
        <ChoiceRow items={exam.variants.map(entry=>({value:entry.id,label:entry.title}))} value={variant.id} onChange={changeVariant}/>
        <Text style={styles.body}>Este é um simulado autoral inspirado no formato do {exam.name}. Não é um exame oficial e não emite certificado ou pontuação oficial.</Text>
        <Notice>As respostas ficam nesta tela durante a tentativa. Se o app for fechado, o progresso pode ser perdido. Áudios usam voz sintética; a fala não tem examinador.</Notice>
      </Panel>
      <Panel><Text style={styles.title}>{variant.title}</Text>{variant.sections.map((part,index)=><View style={styles.sectionLine} key={part.id+'-'+index}>
        <Text style={styles.sectionNumber}>{String(index+1).padStart(2,'0')}</Text><View style={styles.flex}><Text style={styles.sectionTitle}>{part.title}</Text>
          <Text style={styles.body}>{part.items.length} {part.items.length===1?'item':'itens'} · {part.minutes} min{part.preparationMinutes?' + '+part.preparationMinutes+' min de preparação':''}</Text></View></View>)}
        <Action label="Iniciar simulado" onPress={start}/>
        <Action label="Consultar formato oficial ↗" secondary onPress={()=>{void Linking.openURL(variant.sourceUrl)}}/>
      </Panel>
    </>}

    {stage==='preparation'&&<Panel><Pill tone="lilac">PREPARAÇÃO ORAL</Pill><Text style={styles.title}>{section.title}</Text>
      <Text style={styles.timer}>{formatTime(seconds)}</Text><Text style={styles.body}>Leia os temas abaixo e organize sua resposta. Ao terminar o tempo, a prova oral começa automaticamente.</Text>
      {section.items.map((entry,index)=><Text style={styles.context} key={entry.id}>{index+1}. {entry.prompt}</Text>)}
      <Action label="Começar prova oral" onPress={()=>{setStage('running');setDeadline(Date.now()+section.minutes*60000)}}/></Panel>}

    {stage==='running'&&<>
      <Panel><Pill tone="lilac">{variant.title}</Pill><ExamProgress label={section.title} detail={'Item '+(itemIndex+1)+' de '+total+' · '+done+' respondidos'}/>
        <Text style={styles.timer} accessibilityLabel={'Tempo restante: '+formatTime(seconds)}>{formatTime(seconds)}</Text>
        {item.task&&<Text style={styles.eyebrow}>{item.task}</Text>}
        {item.audio?<View style={styles.audioActions}><Action label="Ouvir voz sintética" secondary onPress={()=>{void speak()}}/>
          <Action label={transcript?'Ocultar transcrição':'Ler transcrição'} secondary onPress={()=>setTranscript(value=>!value)}/>
          {transcript&&<Text style={styles.context}>{item.audio}</Text>}</View>:null}
        {item.context&&!item.audio&&<Text style={styles.context}>{item.context}</Text>}
        <Text style={styles.question}>{item.prompt}</Text>
        {item.kind==='choice'&&<View accessibilityRole="radiogroup" style={styles.options}>{(item.options||[]).map((option,index)=><Pressable key={index}
          accessibilityRole="radio" accessibilityState={{checked:answer===String(index)}} onPress={()=>setAnswers(current=>({...current,[item.id]:String(index)}))}
          style={[styles.option,answer===String(index)&&styles.optionActive]}><Text style={styles.optionLetter}>{String.fromCharCode(65+index)}</Text>
          <Text style={styles.optionText}>{option}</Text></Pressable>)}</View>}
        {item.kind==='short'&&<TextInput accessibilityLabel="Sua resposta" value={answer} onChangeText={value=>setAnswers(current=>({...current,[item.id]:value}))}
          placeholder="Digite a resposta" placeholderTextColor="#8293ae" style={styles.input}/>}
        {item.kind==='sentence'&&<><Text style={styles.body}>Organize as palavras em uma frase:</Text><Text style={styles.context}>{item.words?.join(' · ')}</Text>
          <TextInput accessibilityLabel="Frase completa" value={answer} onChangeText={value=>setAnswers(current=>({...current,[item.id]:value}))}
            placeholder="Escreva a frase" placeholderTextColor="#8293ae" style={styles.input}/></>}
        {item.kind==='writing'&&<TextInput accessibilityLabel="Sua resposta escrita" value={answer} multiline textAlignVertical="top"
          onChangeText={value=>setAnswers(current=>({...current,[item.id]:value}))} placeholder="Escreva sua resposta aqui…" placeholderTextColor="#8293ae" style={styles.writingInput}/>}
        {item.kind==='speaking'&&<><Text style={styles.body}>Responda em voz alta. A gravação fica somente neste aparelho durante a tentativa.</Text>
          {!recording?<Action label="Gravar resposta" secondary onPress={()=>{void beginRecording()}}/>:<Action label="Parar gravação" onPress={()=>{void endRecording()}}/>}
          {recordings[item.id]&&<Action label="Ouvir minha gravação" secondary onPress={()=>playRecording(item.id)}/>}
          <Action label="Pratiquei sem gravar" secondary disabled={recording} onPress={()=>setAnswers(current=>({...current,[item.id]:'Praticado em voz alta'}))}/>
          {answer&&<Notice>Prática registrada nesta tentativa.</Notice>}</>}
        {item.guidance&&<Notice>{item.guidance}</Notice>}
        {!!error&&<Notice error>{error}</Notice>}
      </Panel>
      <View style={styles.navigation}><View style={styles.flex}><Action label="Anterior" secondary disabled={itemIndex===0||recording} onPress={()=>goTo(itemIndex-1)}/></View>
        <View style={styles.flex}><Action label={itemIndex===total-1?(sectionIndex===variant.sections.length-1?'Ver relatório':'Próxima prova'):'Próximo item'}
          disabled={recording} onPress={()=>itemIndex===total-1?nextSection():goTo(itemIndex+1)}/></View></View>
      <Notice>O relatório corrige apenas itens objetivos. Escrita e fala exigem avaliação humana.</Notice>
    </>}

    {stage==='result'&&<>
      <Notice>Prática inspirada no {exam.name}. Este relatório não fornece nota oficial nem declara aprovação.</Notice>
      {variant.sections.map((part,index)=>{const objective=part.items.filter(entry=>entry.answer!==undefined)
        const correct=objective.filter(entry=>isCorrect(entry,answers[entry.id]||'')).length
        const practiced=part.items.filter(entry=>!!answers[entry.id]?.trim()).length
        return <Panel key={part.id+'-'+index}><Text style={styles.sectionTitle}>{part.title}</Text>
          <Text style={styles.resultNumber}>{objective.length?correct+' / '+objective.length:practiced+' / '+part.items.length}</Text>
          <Text style={styles.body}>{objective.length?'acertos objetivos · '+practiced+' respostas registradas':'tarefas abertas praticadas; sem correção automática'}</Text></Panel>})}
      <Action label={review?'Ocultar revisão':'Revisar respostas'} secondary onPress={()=>setReview(value=>!value)}/>
      {review&&variant.sections.flatMap(part=>part.items.map(entry=>({part,entry}))).map(({part,entry})=><Panel key={entry.id}>
        <Text style={styles.eyebrow}>{part.title}</Text><Text style={styles.question}>{entry.prompt}</Text>
        <Text style={styles.body}>Sua resposta: {answers[entry.id]?entry.kind==='choice'?entry.options?.[Number(answers[entry.id])]||'—':answers[entry.id]:'Não respondida'}</Text>
        {entry.answer!==undefined&&<Text style={styles.body}>Gabarito: {entry.kind==='choice'?entry.options?.[Number(entry.answer)]:entry.answer}</Text>}
        {entry.explanation&&<Text style={styles.body}>{entry.explanation}</Text>}
        {entry.guidance&&<Text style={styles.body}>{entry.guidance}</Text>}
        {recordings[entry.id]&&<Action label="Ouvir minha gravação" secondary onPress={()=>playRecording(entry.id)}/>}
      </Panel>)}
      <Action label="Refazer este simulado" onPress={start}/><Action label="Escolher outra versão" secondary onPress={()=>setStage('intro')}/>
    </>}
  </Screen>
}

const styles=StyleSheet.create({
  title:{color:theme.navy,fontSize:19,fontWeight:'800'},body:{color:theme.muted,fontSize:12,lineHeight:19},
  sectionLine:{flexDirection:'row',alignItems:'center',gap:11,borderBottomWidth:1,borderColor:theme.border,paddingVertical:8},
  sectionNumber:{color:theme.blue,fontSize:17,fontWeight:'800'},sectionTitle:{color:theme.navy,fontSize:15,fontWeight:'800'},
  flex:{flex:1},timer:{color:theme.blue,fontSize:23,fontWeight:'800',fontVariant:['tabular-nums']},
  eyebrow:{color:theme.blue,fontSize:11,fontWeight:'800',letterSpacing:.3},question:{color:theme.navy,fontSize:17,lineHeight:24,fontWeight:'700'},
  context:{color:theme.ink,fontSize:13,lineHeight:21,backgroundColor:theme.pale,borderRadius:13,padding:12},
  audioActions:{gap:8},input:{borderWidth:1.5,borderColor:theme.border,borderRadius:13,padding:12,color:theme.navy,backgroundColor:theme.white,fontSize:14},
  writingInput:{borderWidth:1.5,borderColor:theme.border,borderRadius:13,padding:12,minHeight:180,color:theme.navy,backgroundColor:theme.white,fontSize:14},
  navigation:{flexDirection:'row',gap:9,marginBottom:11},resultNumber:{color:theme.blue,fontSize:28,fontWeight:'800'},
  options:{gap:8},option:{borderWidth:1.5,borderColor:theme.border,borderRadius:13,padding:12,flexDirection:'row',alignItems:'center',gap:10},
  optionActive:{borderColor:theme.blue,backgroundColor:theme.pale},optionLetter:{color:theme.blue,fontSize:13,fontWeight:'800'},optionText:{color:theme.navy,fontSize:13,lineHeight:20,flex:1},
})
