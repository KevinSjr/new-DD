import type { ReactNode } from 'react'
import { router } from 'expo-router'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppIcon } from './AppIcon'
import { theme } from '../theme'

type Props = {
  title:string; description:string; children?:ReactNode; eyebrow?:string
  navTitle?:string; brandHeader?:boolean; hideHeading?:boolean
}

export function Screen({ title, description, children, eyebrow, navTitle, brandHeader = false, hideHeading = false }: Props) {
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {brandHeader ? <View style={styles.brandRow}>
        <Image source={require('../../assets/images/daydreaming-horizontal.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="Daydreaming" />
        <View style={styles.brandStar} accessibilityElementsHidden><AppIcon name="star" color={theme.yellow} size={19} /></View>
      </View> : <View style={styles.navRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => router.canGoBack() ? router.back() : router.push('/')}
          style={({pressed})=>[styles.back,pressed && {opacity:.65}]}><AppIcon name="back" color={theme.navy} size={22} /></Pressable>
        <Text style={styles.navTitle} numberOfLines={1}>{navTitle || title}</Text>
        <View style={styles.navSpacer} />
      </View>}
      {!hideHeading && <>{eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        <Text style={styles.title} accessibilityRole="header">{title}</Text>
        <Text style={styles.description}>{description}</Text></>}
      {children}
    </ScrollView>
  </SafeAreaView>
}

export function Preparation({ message }: { message:string }) {
  return <View style={styles.notice}>
    <Text style={styles.noticeTitle}>Em preparação</Text>
    <Text style={styles.noticeText}>{message}</Text>
  </View>
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:theme.background},
  content:{width:'100%',maxWidth:680,alignSelf:'center',paddingHorizontal:16,paddingTop:6,paddingBottom:40},
  brandRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14,minHeight:49},
  logo:{width:183,height:46},
  brandStar:{width:36,height:36,borderRadius:18,backgroundColor:theme.white,borderWidth:1,borderColor:theme.border,alignItems:'center',justifyContent:'center'},
  navRow:{height:45,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14},
  back:{width:40,height:40,alignItems:'center',justifyContent:'center',borderRadius:20},
  navTitle:{flex:1,color:theme.navy,fontSize:15,fontWeight:'800',textAlign:'center'},
  navSpacer:{width:40},
  eyebrow:{color:theme.blue,fontWeight:'800',fontSize:10,letterSpacing:1.2,marginBottom:7},
  title:{color:theme.navy,fontSize:25,fontWeight:'800',lineHeight:31,marginBottom:4},
  description:{color:theme.muted,fontSize:13,lineHeight:19,marginBottom:16},
  notice:{backgroundColor:theme.white,borderColor:theme.border,borderWidth:1.5,borderRadius:18,padding:20},
  noticeTitle:{color:theme.navy,fontSize:17,fontWeight:'800',marginBottom:7},
  noticeText:{color:theme.muted,fontSize:13,lineHeight:20},
})
