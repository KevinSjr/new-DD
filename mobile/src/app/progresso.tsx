import { useCallback, useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native'
import { api } from '../api'
import { AppIcon } from '../components/AppIcon'
import { Action, Notice, Panel } from '../components/Controls'
import { ProgressBadge } from '../components/ProgressBadge'
import { Screen } from '../components/Screen'
import { useSession } from '../session'
import { theme } from '../theme'

type Achievement={key:string;category:string;title:string;detail:string;completed:boolean;available:boolean;progress:number;target:number;xp:number}
type Mission={key:string;frequency:'daily'|'weekly'|'monthly'|'once';title:string;detail:string;completed:boolean;progress:number;target:number;xp:number}
type Progress={xp:number;level:number;nextLevelXp:number;streak:{current:number;best:number};completedCurrent:number;achievements:Achievement[];missions:Mission[]}

export default function ProgressScreen(){
  const {token}=useSession()
  const [data,setData]=useState<Progress|null>(null)
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(true)
  const [openCategory,setOpenCategory]=useState<string|null>('Perfil e plano')
  const load=useCallback(async()=>{
    if(!token){setData(null);setLoading(false);return}
    setLoading(true);setError('')
    try{setData(await api<Progress>('/api/account/missions',{token}))}
    catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível carregar seu progresso.')}
    finally{setLoading(false)}
  },[token])
  useFocusEffect(useCallback(()=>{void load()},[load]))
  const percent=data?data.xp%100:0
  const earned=data?.achievements.filter(item=>item.completed)||[]
  const categories=[...new Set(data?.achievements.map(item=>item.category)||[])]
  const available=(data?.achievements.filter(item=>item.available).length||0)
  const missions=data?.missions.filter(item=>['study-goal','gpa-estimates','first-deadline'].includes(item.key))||[]
  return <Screen navTitle="Meu progresso" title="Meu progresso" description="Veja suas conquistas e avance no seu ritmo.">
    {!token?<Panel><Text style={styles.body}>Entre para acompanhar XP, missões e conquistas da sua conta.</Text>
      <Action label="Entrar na conta" onPress={()=>router.push('/conta')} /></Panel>:<>
      {loading&&<Notice>Carregando progresso…</Notice>}
      {!!error&&<><Notice error>{error}</Notice><Action label="Tentar novamente" secondary onPress={()=>{void load()}} /></>}
      {data&&<><View style={styles.hero}><View style={styles.circle}><Text style={styles.percent}>{percent}%</Text></View>
        <Text style={styles.heroTitle}>Seu progresso no nível atual</Text><Text style={styles.body}>Continue explorando para desbloquear novas conquistas.</Text></View>
        <Panel><Text style={styles.heading}>Resumo</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>Nível atual</Text><Text style={styles.rowValue}>{data.level} · Explorador</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>XP acumulados</Text><Text style={styles.rowValue}>{data.xp} XP</Text></View>
          <View style={styles.track}><View style={[styles.fill,{width:(percent+'%') as DimensionValue}]} /></View>
          <Text style={styles.note}>{data.nextLevelXp} XP para o próximo nível</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>Dias seguidos</Text><Text style={styles.rowValue}>{data.streak.current}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Conquistas</Text><Text style={styles.rowValue}>{earned.length} de {available}</Text></View>
        </Panel>
        <Text style={styles.sectionTitle}>Suas conquistas</Text>
        {categories.length===0?<Notice>Explore as ferramentas para desbloquear suas primeiras conquistas.</Notice>
          :categories.map(category=>{
            const group=data.achievements.filter(item=>item.category===category)
            const expanded=openCategory===category
            return <View key={category} style={styles.category}>
              <Pressable accessibilityRole="button" accessibilityState={{expanded}} onPress={()=>setOpenCategory(expanded?null:category)}
                style={styles.categoryHead}><Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.categoryCount}>{group.filter(item=>item.completed).length} de {group.filter(item=>item.available).length}</Text>
                <View style={expanded&&styles.chevronOpen}><AppIcon name="chevron" color={theme.blue} size={17} /></View></Pressable>
              {expanded&&<View style={styles.categoryItems}>{group.map(item=><View key={item.key}
                style={[styles.achievement,item.completed&&styles.achievementEarned,!item.available&&styles.achievementUnavailable]}>
                <ProgressBadge itemKey={item.key} category={item.category} completed={item.completed} available={item.available} size={60} />
                <View style={{flex:1}}><Text style={styles.achievementTitle}>{item.title}</Text>
                  <Text style={styles.achievementDetail}>{item.detail}</Text>
                  <Text style={styles.achievementState}>{item.completed?'Conquistada':item.available?item.progress+' de '+item.target:'Ainda indisponível nesta versão'}</Text></View>
                <Text style={styles.achievementXp}>{item.available?'+'+item.xp+' XP':'—'}</Text>
              </View>)}</View>}
            </View>
          })}
        {missions.length>0&&<><Text style={styles.sectionTitle}>Missões da sua jornada</Text>
          {missions.map(item=><Panel key={item.key}><View style={styles.missionRow}>
            <ProgressBadge itemKey={item.key} category={item.frequency} completed={item.completed} mission size={55} />
            <View style={{flex:1}}><Text style={styles.missionTitle}>{item.title}</Text><Text style={styles.note}>{item.detail}</Text></View>
            <Text style={styles.missionXp}>+{item.xp} XP</Text></View></Panel>)}</>}
        <Action label="Continuar meu plano  →" onPress={()=>router.push('/jornada')} />
      </>}
    </>}
  </Screen>
}

const styles=StyleSheet.create({
  body:{color:theme.muted,fontSize:12,lineHeight:18,textAlign:'center'},
  hero:{alignItems:'center',backgroundColor:'#e8f0ff',borderRadius:20,padding:19,marginBottom:13,gap:9},
  circle:{width:126,height:126,borderRadius:63,borderWidth:10,borderColor:theme.border,backgroundColor:theme.white,alignItems:'center',justifyContent:'center'},
  percent:{color:theme.navy,fontSize:27,fontWeight:'800'},heroTitle:{color:theme.navy,fontSize:16,fontWeight:'800',textAlign:'center'},
  heading:{color:theme.navy,fontSize:16,fontWeight:'800'},row:{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:theme.border,paddingVertical:7,gap:8},
  rowLabel:{color:theme.muted,fontSize:12},rowValue:{color:theme.navy,fontSize:12,fontWeight:'800',textAlign:'right'},
  track:{height:8,backgroundColor:theme.pale,borderRadius:5,overflow:'hidden'},fill:{height:8,backgroundColor:theme.green},
  note:{color:theme.muted,fontSize:11,lineHeight:16},sectionTitle:{color:theme.navy,fontSize:17,fontWeight:'800',marginTop:11,marginBottom:8},
  category:{borderWidth:1.5,borderColor:theme.border,borderRadius:16,backgroundColor:theme.white,overflow:'hidden',marginBottom:9},
  categoryHead:{minHeight:52,flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:13,paddingVertical:8},
  categoryTitle:{flex:1,color:theme.navy,fontSize:13,fontWeight:'800'},categoryCount:{color:theme.blue,fontSize:11,fontWeight:'800'},
  chevronOpen:{transform:[{rotate:'90deg'}]},categoryItems:{padding:9,paddingTop:0,gap:8},
  achievement:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:theme.pale,borderRadius:13,padding:9},
  achievementEarned:{backgroundColor:theme.greenPale},achievementUnavailable:{opacity:.65},
  achievementTitle:{color:theme.navy,fontSize:12,fontWeight:'800'},achievementDetail:{color:theme.muted,fontSize:10,lineHeight:15,marginTop:2},
  achievementState:{color:theme.blue,fontSize:10,fontWeight:'700',marginTop:4},achievementXp:{color:'#1b785b',fontSize:10,fontWeight:'800'},
  missionRow:{flexDirection:'row',alignItems:'center',gap:9},
  missionTitle:{color:theme.navy,fontSize:12,fontWeight:'800'},missionXp:{color:'#9a6a06',fontSize:11,fontWeight:'800'},
})
