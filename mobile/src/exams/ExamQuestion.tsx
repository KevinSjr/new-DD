import { useState } from 'react'
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { Action, Field, Notice } from '../components/Controls'
import { theme } from '../theme'
import { examAssetUrl } from './client'
import type { MextQuestion, SatQuestion } from './types'

function ExamAsset({path,label}:{path:string;label:string}) {
  const [failed,setFailed]=useState(false)
  const url=examAssetUrl(path)
  return <View style={styles.asset}>
    {failed?<Notice error>Não foi possível carregar a imagem. Abra o arquivo original para conferir.</Notice>
      :<Image source={{uri:url}} resizeMode="contain" style={styles.image} accessibilityLabel={label} onError={()=>setFailed(true)} />}
    <Action label="Ampliar imagem original  ↗" secondary onPress={()=>{void Linking.openURL(url)}} />
  </View>
}

function Choices({values,answer,onAnswer}:{values:{key:string;text:string}[];answer:string;onAnswer:(value:string)=>void}) {
  return <View accessibilityRole="radiogroup" accessibilityLabel="Alternativas">
    {values.map(item=><Pressable key={item.key} accessibilityRole="radio" accessibilityState={{checked:answer===item.key}}
      onPress={()=>onAnswer(item.key)} style={[styles.choice,answer===item.key&&styles.choiceSelected]}>
      <Text style={[styles.choiceKey,answer===item.key&&styles.choiceKeySelected]}>{item.key}</Text>
      <Text style={styles.choiceText}>{item.text}</Text>
    </Pressable>)}
  </View>
}

export function SatQuestionView({question,answer,onAnswer}:{question:SatQuestion;answer:string;onAnswer:(value:string)=>void}) {
  const [transcript,setTranscript]=useState(false)
  return <View key={question.id}>
    <Text style={styles.eyebrow}>TESTE {question.form_code.split('-')[1]} · {question.section==='math'?'MATEMÁTICA':'LEITURA E ESCRITA'} · MÓDULO {question.module_number}</Text>
    {question.image_path?<>
      <ExamAsset path={question.image_path} label={'Enunciado original da questão '+question.question_number} />
      {!!question.passage&&<><Action label={transcript?'Ocultar transcrição':'Ver transcrição automática'} secondary onPress={()=>setTranscript(!transcript)} />
        {transcript&&<Text selectable style={styles.transcript}>A transcrição pode não reproduzir fórmulas ou gráficos com precisão. Confira a imagem original.{'\n\n'}{question.passage}</Text>}</>}
    </>:!!question.passage&&<Text selectable style={styles.passage}>{question.passage}</Text>}
    <Text style={styles.prompt}>{question.prompt}</Text>
    {question.answer_type==='multiple-choice'
      ?<Choices values={question.choices.map(item=>({key:item.key,text:question.image_path?'Alternativa '+item.key:item.text}))} answer={answer} onAnswer={onAnswer} />
      :<Field label="Sua resposta" value={answer} onChangeText={onAnswer} keyboardType="decimal-pad" placeholder="Digite sua resposta" />}
  </View>
}

export function MextQuestionView({question,answer,onAnswer}:{question:MextQuestion;answer:string;onAnswer:(value:string)=>void}) {
  const [transcript,setTranscript]=useState(false)
  return <View key={question.id}>
    <Text style={styles.eyebrow}>SEÇÃO {question.section} · ITEM {question.item_code} · {question.points} {question.points===1?'PONTO':'PONTOS'}</Text>
    <Text style={styles.prompt}>{question.prompt}</Text>
    <Text style={styles.help}>Leia o enunciado original nas imagens. Toque em ampliar se precisar ver detalhes.</Text>
    {question.asset_paths.map((path,index)=><ExamAsset key={path} path={path} label={'Página '+(index+1)+' do item '+question.item_code} />)}
    {!!question.transcript&&<><Action label={transcript?'Ocultar transcrição':'Ver transcrição automática'} secondary onPress={()=>setTranscript(!transcript)} />
      {transcript&&<Text selectable style={styles.transcript}>Fórmulas, furigana e a ordem do texto podem diferir do PDF. A imagem original é a referência.{'\n\n'}{question.transcript}</Text>}</>}
    {question.answer_type==='numeric'||question.answer_type==='text'
      ?<Field label={'Resposta para '+question.item_code} value={answer} onChangeText={onAnswer}
        keyboardType={question.answer_type==='numeric'?'decimal-pad':'default'} placeholder={question.answer_type==='numeric'?'Ex.: 5/16 ou 0,3125':'Use a notação do gabarito'} />
      :<Choices values={question.choices.map(value=>({key:value,text:'Alternativa '+value}))} answer={answer} onAnswer={onAnswer} />}
    <Pressable accessibilityRole="link" onPress={()=>{void Linking.openURL(question.source_url)}}>
      <Text style={styles.source}>PDF oficial da disciplina · página {question.source_page}  ↗</Text></Pressable>
  </View>
}

const styles=StyleSheet.create({
  eyebrow:{color:theme.blue,fontSize:10,fontWeight:'800',letterSpacing:.4,marginBottom:8},
  prompt:{color:theme.navy,fontSize:16,fontWeight:'800',lineHeight:23,marginBottom:10},
  passage:{color:theme.navy,fontSize:13,lineHeight:21,backgroundColor:theme.pale,borderRadius:12,padding:12,marginBottom:11},
  transcript:{color:theme.muted,fontSize:12,lineHeight:19,backgroundColor:theme.pale,borderRadius:12,padding:12,marginVertical:9},
  help:{color:theme.muted,fontSize:12,lineHeight:18,marginBottom:8},
  asset:{marginBottom:10,gap:7},image:{width:'100%',height:300,backgroundColor:'#eef3ff',borderRadius:12},
  choice:{minHeight:49,flexDirection:'row',alignItems:'center',gap:10,borderColor:theme.border,borderWidth:1.5,borderRadius:13,
    backgroundColor:theme.white,padding:8,marginBottom:7},choiceSelected:{borderColor:theme.blue,backgroundColor:theme.pale},
  choiceKey:{width:28,height:28,borderRadius:14,backgroundColor:theme.pale,color:theme.navy,textAlign:'center',textAlignVertical:'center',fontWeight:'800'},
  choiceKeySelected:{backgroundColor:theme.blue,color:theme.white},choiceText:{flex:1,color:theme.navy,fontSize:13,lineHeight:18},
  source:{color:theme.blue,fontSize:12,fontWeight:'800',marginTop:8},
})
