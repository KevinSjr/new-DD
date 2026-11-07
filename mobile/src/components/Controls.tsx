import type { ReactNode, Ref } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { theme } from '../theme'

export function Action({ label, onPress, disabled = false, secondary = false }: { label:string; onPress:()=>void; disabled?:boolean; secondary?:boolean }) {
  return <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityState={{disabled}}
    style={({pressed})=>[styles.button,secondary && styles.secondary,pressed && styles.pressed,disabled && styles.disabled]}>
    <Text style={[styles.buttonText,secondary && styles.secondaryText]}>{label}</Text>
  </Pressable>
}
export function Field({ label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = 'default', inputRef, maxLength, autoCapitalize }: { label:string; value:string; onChangeText:(value:string)=>void; placeholder?:string; secureTextEntry?:boolean; keyboardType?:'default'|'email-address'|'numeric'|'decimal-pad'; inputRef?:Ref<TextInput>; maxLength?:number; autoCapitalize?:'none'|'sentences'|'words'|'characters' }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput ref={inputRef} value={value} onChangeText={onChangeText}
    placeholder={placeholder} placeholderTextColor="#8b9abb" secureTextEntry={secureTextEntry} keyboardType={keyboardType}
    maxLength={maxLength} autoCapitalize={autoCapitalize || (keyboardType === 'email-address' ? 'none' : 'sentences')} style={styles.input} accessibilityLabel={label} /></View>
}
export function Panel({ children }: { children:ReactNode }) { return <View style={styles.panel}>{children}</View> }
export function Pill({ children, tone = 'blue' }: { children:ReactNode; tone?:'blue'|'green'|'yellow'|'lilac' }) {
  return <View style={[styles.pill,tone === 'green' && styles.pillGreen,tone === 'yellow' && styles.pillYellow,tone === 'lilac' && styles.pillLilac]}>
    <Text style={[styles.pillText,tone === 'green' && styles.pillTextGreen]}>{children}</Text>
  </View>
}
export function Notice({ children, error = false }: { children:ReactNode; error?:boolean }) {
  return <Text accessibilityRole={error ? 'alert' : undefined} style={[styles.notice,error && styles.error]}>{children}</Text>
}

const styles = StyleSheet.create({
  button:{alignItems:'center',justifyContent:'center',minHeight:48,borderRadius:24,backgroundColor:theme.blue,paddingHorizontal:16,paddingVertical:10,borderBottomWidth:3,borderBottomColor:'#1a51c0',shadowColor:theme.shadow,shadowOffset:{width:0,height:4},shadowOpacity:.13,shadowRadius:7,elevation:2},
  buttonText:{color:theme.white,fontWeight:'800',fontSize:14,textAlign:'center'},
  secondary:{backgroundColor:theme.pale,borderWidth:1,borderColor:theme.border,borderBottomWidth:1,shadowOpacity:0,elevation:0},
  secondaryText:{color:theme.blue},
  pressed:{opacity:.78},disabled:{opacity:.45},
  field:{gap:6,marginBottom:8},label:{color:theme.navy,fontSize:12,fontWeight:'800'},
  input:{minHeight:46,borderRadius:22,borderWidth:1.5,borderColor:theme.border,backgroundColor:theme.white,paddingHorizontal:15,color:theme.navy,fontSize:14},
  panel:{backgroundColor:theme.white,borderWidth:1.5,borderColor:theme.border,borderRadius:19,padding:16,gap:10,marginBottom:13,shadowColor:theme.shadow,shadowOffset:{width:0,height:4},shadowOpacity:.06,shadowRadius:10,elevation:2},
  pill:{alignSelf:'flex-start',borderRadius:99,backgroundColor:theme.pale,paddingHorizontal:11,paddingVertical:5},
  pillGreen:{backgroundColor:theme.greenPale},pillYellow:{backgroundColor:'#fff1c9'},pillLilac:{backgroundColor:theme.lilac},
  pillText:{color:theme.blue,fontWeight:'800',fontSize:11},pillTextGreen:{color:'#0a7a56'},
  notice:{color:theme.muted,fontSize:13,lineHeight:19,marginVertical:6},error:{color:'#a12d3b'},
})
