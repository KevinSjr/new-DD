import { router, type Href } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { AppIcon } from '../components/AppIcon'
import { QuickToolIcon } from '../components/QuickToolIcon'
import { Notice } from '../components/Controls'
import { Screen } from '../components/Screen'
import { EXAMS, type Exam } from '../data/exams'
import { theme } from '../theme'

const active=new Set(['sat','mext'])
const preparations=EXAMS.filter(exam=>!active.has(exam.id))

function ReadyCard({exam}:{exam:Exam}){
  const sat=exam.id==='sat'
  return <Pressable accessibilityRole="button" accessibilityLabel={`Abrir ${exam.name}, desafio diário e modo exame`}
    onPress={()=>router.push((sat?'/sat':'/mext') as Href)} style={({pressed})=>[styles.readyCard,sat?styles.satCard:styles.mextCard,pressed&&styles.pressed]}>
    <View style={styles.cardTop}><Text style={[styles.available,sat?styles.availableBlue:styles.availableWarm]}>●  PRÁTICA DISPONÍVEL</Text>
      <View style={[styles.cardArt,sat?styles.cardArtBlue:styles.cardArtWarm]}>
        {sat?<QuickToolIcon kind="exames" />:<Text style={styles.mextArt}>🇯🇵</Text>}
      </View></View>
    <Text style={styles.cardTitle}>{exam.name}</Text>
    <Text style={styles.cardContext}>{sat?'Admissão universitária':'Seleção para bolsa no Japão'}</Text>
    <Text style={styles.cardDescription}>{sat?'Pratique leitura, escrita e matemática com questões dos testes 4 a 11.':'Pratique japonês, inglês, matemática e ciências das provas de 2025.'}</Text>
    <View style={styles.modeRow}><View style={styles.modeChip}><Text style={styles.modeText}>Desafio diário</Text></View>
      <View style={styles.modeChip}><Text style={styles.modeText}>Modo exame</Text></View></View>
    <View style={[styles.cardAction,sat?styles.cardActionBlue:styles.cardActionWarm]}>
      <Text style={styles.cardActionText}>{sat?'Praticar SAT':'Praticar MEXT'}</Text><AppIcon name="chevron" color={theme.white} size={18} /></View>
  </Pressable>
}

function ComingRow({exam}:{exam:Exam}){
  return <View accessibilityLabel={`${exam.name}, em preparação no aplicativo`} style={styles.comingRow}>
    <View style={styles.comingIcon}><Text style={styles.comingInitial}>{exam.name.slice(0,2).toUpperCase()}</Text></View>
    <View style={{flex:1}}><Text style={styles.comingName}>{exam.name}</Text><Text style={styles.comingContext}>{exam.context}</Text></View>
    <Text style={styles.comingStatus}>Em preparação</Text>
  </View>
}

export default function ExamCatalog(){return <Screen navTitle="Exames" title="Exames" description="" hideHeading>
  <View style={styles.hero}>
    <View style={styles.heroStar}><AppIcon name="star" color={theme.yellow} size={18} /></View>
    <Text style={styles.heroEyebrow}>PREPARE SUA CANDIDATURA</Text>
    <Text style={styles.heroTitle}>Pratique um passo de cada vez</Text>
    <Text style={styles.heroText}>Escolha uma prova, estude no seu ritmo e acompanhe seus resultados.</Text>
    <View style={styles.heroArt}><View style={styles.heroArtInner}><QuickToolIcon kind="exames" /></View>
      <View style={styles.heroArtAccent}><AppIcon name="star" color={theme.yellow} size={18} /></View></View>
  </View>

  <View style={styles.headingRow}><View><Text style={styles.sectionEyebrow}>COMECE AGORA</Text><Text style={styles.sectionTitle}>Provas disponíveis</Text></View>
    <View style={styles.count}><Text style={styles.countText}>2 provas</Text></View></View>
  <Text style={styles.sectionLead}>Escolha o desafio diário ou faça um exame completo.</Text>
  {EXAMS.filter(exam=>active.has(exam.id)).map(exam=><ReadyCard key={exam.id} exam={exam} />)}

  <View style={styles.comingHeader}><Text style={styles.sectionEyebrow}>PRÓXIMOS EXAMES</Text>
    <Text style={styles.sectionTitle}>No catálogo</Text><Text style={styles.sectionLead}>Estas provas ainda não têm questões no aplicativo.</Text></View>
  <Text style={styles.groupTitle}>Admissão e seleção</Text>
  {preparations.filter(exam=>exam.category==='admission').map(exam=><ComingRow key={exam.id} exam={exam} />)}
  <Text style={styles.groupTitle}>Proficiência em idiomas</Text>
  {preparations.filter(exam=>exam.category==='language').map(exam=><ComingRow key={exam.id} exam={exam} />)}
  <Notice>Confira no edital da instituição qual exame, versão e nível são exigidos. Os resultados dos simulados não substituem uma avaliação oficial.</Notice>
</Screen>}

const styles=StyleSheet.create({
  hero:{backgroundColor:'#123472',borderRadius:22,padding:20,minHeight:186,overflow:'hidden',marginBottom:22},
  heroStar:{position:'absolute',right:14,top:13},heroEyebrow:{color:'#8fd3ff',fontSize:10,fontWeight:'800',letterSpacing:1.1,marginBottom:8},
  heroTitle:{color:theme.white,fontSize:24,lineHeight:29,fontWeight:'800',maxWidth:'72%'},
  heroText:{color:'#dbeaff',fontSize:12,lineHeight:18,marginTop:8,maxWidth:'72%'},
  heroArt:{position:'absolute',right:13,bottom:24,width:85,height:85,borderRadius:26,backgroundColor:'#4a91f3',alignItems:'center',justifyContent:'center',transform:[{rotate:'8deg'}]},
  heroArtInner:{width:68,height:68,borderRadius:20,backgroundColor:'#eaf5ff',alignItems:'center',justifyContent:'center'},
  heroArtAccent:{position:'absolute',right:-5,top:-12},
  headingRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8},sectionEyebrow:{color:theme.blue,fontSize:10,fontWeight:'800',letterSpacing:.9,marginBottom:3},
  sectionTitle:{color:theme.navy,fontSize:19,fontWeight:'800'},sectionLead:{color:theme.muted,fontSize:12,lineHeight:18,marginTop:4,marginBottom:12},
  count:{backgroundColor:theme.pale,borderRadius:99,paddingHorizontal:10,paddingVertical:6},countText:{color:theme.blue,fontSize:11,fontWeight:'800'},
  readyCard:{borderRadius:20,borderWidth:1.5,padding:16,marginBottom:11,overflow:'hidden',shadowColor:theme.shadow,shadowOffset:{width:0,height:4},shadowOpacity:.08,shadowRadius:10,elevation:2},
  satCard:{backgroundColor:'#e8f2ff',borderColor:'#b8d4ff'},mextCard:{backgroundColor:'#fff4e7',borderColor:'#ffe0b2'},pressed:{opacity:.75},
  cardTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',height:49},available:{fontSize:10,fontWeight:'800',letterSpacing:.45,paddingHorizontal:10,paddingVertical:6,borderRadius:99,overflow:'hidden'},
  availableBlue:{color:'#0c68a8',backgroundColor:'#d1eafe'},availableWarm:{color:'#985421',backgroundColor:'#ffe2bf'},
  cardArt:{width:62,height:62,borderRadius:18,alignItems:'center',justifyContent:'center',marginTop:-7},cardArtBlue:{backgroundColor:'#d3e8ff'},cardArtWarm:{backgroundColor:'#ffe4c4'},mextArt:{fontSize:39},
  cardTitle:{color:theme.navy,fontSize:25,fontWeight:'800'},cardContext:{color:theme.blue,fontSize:12,fontWeight:'800',marginTop:2},
  cardDescription:{color:theme.ink,fontSize:12,lineHeight:18,marginTop:8,maxWidth:'92%'},modeRow:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:12},
  modeChip:{backgroundColor:'#ffffffaa',paddingHorizontal:10,paddingVertical:6,borderRadius:99,borderWidth:1,borderColor:'#ffffff'},modeText:{color:theme.ink,fontSize:11,fontWeight:'700'},
  cardAction:{marginTop:14,borderRadius:13,paddingHorizontal:13,paddingVertical:11,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  cardActionBlue:{backgroundColor:theme.blue},cardActionWarm:{backgroundColor:'#d76d42'},cardActionText:{color:theme.white,fontSize:13,fontWeight:'800'},
  comingHeader:{marginTop:17},groupTitle:{color:theme.navy,fontSize:13,fontWeight:'800',marginTop:10,marginBottom:7},
  comingRow:{backgroundColor:theme.white,borderColor:theme.border,borderWidth:1,borderRadius:14,padding:10,marginBottom:7,flexDirection:'row',alignItems:'center',gap:9},
  comingIcon:{width:35,height:35,borderRadius:11,backgroundColor:'#edf2fb',alignItems:'center',justifyContent:'center'},comingInitial:{color:theme.muted,fontSize:11,fontWeight:'800'},
  comingName:{color:theme.navy,fontSize:13,fontWeight:'800'},comingContext:{color:theme.muted,fontSize:10,marginTop:2},comingStatus:{color:theme.muted,fontSize:9,fontWeight:'800'},
})
