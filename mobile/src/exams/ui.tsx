import { Pressable, StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'

export function ChoiceRow<T extends string>({items,value,onChange}:{items:{value:T;label:string}[];value:T;onChange:(value:T)=>void}) {
  return <View style={styles.choices}>{items.map(item=><Pressable key={item.value} accessibilityRole="radio" accessibilityState={{checked:value===item.value}}
    onPress={()=>onChange(item.value)} style={[styles.choice,value===item.value&&styles.active]}>
    <Text style={[styles.choiceText,value===item.value&&styles.activeText]}>{item.label}</Text>
  </Pressable>)}</View>
}
export function ExamProgress({label,detail}:{label:string;detail:string}) { return <View style={styles.progress}><Text style={styles.progressTitle}>{label}</Text><Text style={styles.progressDetail}>{detail}</Text></View> }
export function formatTime(seconds:number) { const safe=Math.max(0,seconds);return `${String(Math.floor(safe/60)).padStart(2,'0')}:${String(safe%60).padStart(2,'0')}` }
export function errorMessage(error:unknown) { return error instanceof Error?error.message:'Não foi possível concluir. Tente novamente.' }
const styles=StyleSheet.create({choices:{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:8},choice:{borderWidth:1.5,borderColor:theme.border,borderRadius:99,paddingHorizontal:13,paddingVertical:9,backgroundColor:theme.white},active:{backgroundColor:theme.blue,borderColor:theme.blue},choiceText:{color:theme.navy,fontSize:12,fontWeight:'800'},activeText:{color:theme.white},progress:{backgroundColor:theme.pale,borderRadius:13,padding:11,gap:3,marginBottom:12},progressTitle:{color:theme.navy,fontWeight:'800',fontSize:14},progressDetail:{color:theme.muted,fontSize:12}})
