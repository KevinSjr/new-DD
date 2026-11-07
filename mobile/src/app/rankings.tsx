import { router, type Href } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { AppIcon } from '../components/AppIcon'
import { Notice, Pill } from '../components/Controls'
import { Screen } from '../components/Screen'
import { SUBJECT_AREAS } from '../data/subjectAreas'
import { RANKING_AREAS, type RankingKey } from '../rankings/data'
import { theme } from '../theme'

function RankingChoice({area,title,description,year}:{area:RankingKey;title:string;description:string;year:string}){
  return <Pressable accessibilityRole="button" accessibilityLabel={`Abrir ranking de ${title}`}
    onPress={()=>router.push((`/ranking?area=${area}`) as Href)} style={({pressed})=>[styles.choice,pressed&&{opacity:.75}]}>
    <View style={styles.icon}><AppIcon name={area==='general'?'globe':'school'} color={theme.blue} size={24} /></View>
    <View style={{flex:1}}><View style={styles.choiceTop}><Text style={styles.choiceTitle}>{title}</Text><Pill>{year}</Pill></View>
      <Text style={styles.description}>{description}</Text></View><AppIcon name="chevron" color={theme.blue} size={18} />
  </Pressable>
}
export default function RankingsHub(){return <Screen navTitle="Rankings" title="Explore universidades" eyebrow="RANKINGS QS"
  description="Compare instituições no ranking mundial ou escolha uma área de estudo. Cada lista informa a edição e a fonte.">
  <Text style={styles.heading}>Ranking geral</Text>
  <RankingChoice area="general" title="Universidades no mundo" description="Primeiras 1.000 instituições da edição 2027." year="2027" />
  <Text style={styles.heading}>Por área de estudo</Text>
  <Text style={styles.intro}>As áreas amplas são diferentes dos rankings de disciplinas individuais.</Text>
  {RANKING_AREAS.map(key=><RankingChoice key={key} area={key} title={SUBJECT_AREAS[key].title}
    description={`${SUBJECT_AREAS[key].count} instituições · ${SUBJECT_AREAS[key].subjects.length} disciplinas listadas`} year="2026" />)}
  <Notice>Ranking é uma referência de comparação. Confira curso, custos, requisitos e critérios de admissão diretamente com a universidade.</Notice>
</Screen>}
const styles=StyleSheet.create({heading:{color:theme.navy,fontSize:18,fontWeight:'800',marginTop:15,marginBottom:7},intro:{color:theme.muted,fontSize:12,lineHeight:18,marginBottom:4},
  choice:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:theme.white,borderWidth:1.5,borderColor:theme.border,borderRadius:17,padding:12,marginBottom:8},
  icon:{width:42,height:42,borderRadius:13,backgroundColor:theme.pale,alignItems:'center',justifyContent:'center'},choiceTop:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:5},
  choiceTitle:{color:theme.navy,fontSize:14,fontWeight:'800',flexShrink:1},description:{color:theme.muted,fontSize:11,lineHeight:17,marginTop:4}})
