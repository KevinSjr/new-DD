import { useCallback, useState } from 'react'
import { router, useFocusEffect, type Href } from 'expo-router'
import { Image, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native'
import { api } from '../../api'
import { AppIcon } from '../../components/AppIcon'
import { Action, Notice } from '../../components/Controls'
import { QuickToolIcon } from '../../components/QuickToolIcon'
import { Screen } from '../../components/Screen'
import { useSession } from '../../session'
import { theme } from '../../theme'

type Progress = {xp:number;level:number;nextLevelXp:number;streak:{current:number}}
const tools = [
  {href:'/gpa' as const,title:'Calculadora de GPA',art:'gpa' as const,color:'#e3efff'},
  {href:'/vocacional' as const,title:'Teste vocacional',art:'vocacional' as const,color:'#eee7ff'},
  {href:'/descobridor' as const,title:'Descobridor de Mundos',art:'mundos' as const,color:'#e1f6ff'},
  {href:'/jornada' as const,title:'Meu plano',art:'plano' as const,color:'#ffe9df'},
  {href:'/rankings' as const,title:'Rankings',art:'ranking' as const,color:'#e8efff'},
  {href:'/exames' as const,title:'Catálogo de exames',art:'exames' as const,color:'#fff0db'},
]
const countries = [
  {name:'Estados Unidos',flag:'🇺🇸',slug:'estados-unidos',image:require('../../../assets/images/country-us.png')},
  {name:'Canadá',flag:'🇨🇦',slug:'canada',image:require('../../../assets/images/country-canada.png')},
  {name:'Reino Unido',flag:'🇬🇧',slug:'reino-unido',image:require('../../../assets/images/country-uk.png')},
  {name:'Alemanha',flag:'🇩🇪',slug:'alemanha',image:require('../../../assets/images/country-germany.png')},
]

export default function Home() {
  const {user,token} = useSession()
  const [progress,setProgress] = useState<Progress|null>(null)
  const [progressError,setProgressError] = useState(false)
  useFocusEffect(useCallback(() => {
    if (!token) {setProgress(null);setProgressError(false);return}
    let active=true
    api<Progress>('/api/account/missions',{token})
      .then(data=>{if(active){setProgress(data);setProgressError(false)}})
      .catch(()=>{if(active){setProgress(null);setProgressError(true)}})
    return ()=>{active=false}
  },[token]))
  const levelPercent = progress ? progress.xp % 100 : 0

  return <Screen brandHeader title={user ? 'Olá, ' + user.displayName + '!' : 'Olá, estudante!'}
    description="Pronto para descobrir novas possibilidades pelo mundo?">
    <View style={styles.art}><Image source={require('../../../assets/images/journey-globe.png')} resizeMode="contain"
      style={styles.artImage} accessibilityLabel="Globo colorido com avião e nuvens" /></View>
    <Pressable accessibilityRole="button" accessibilityLabel="Ver meu progresso" onPress={() => router.push('/progresso')}
      style={({pressed})=>[styles.progress,pressed && {opacity:.85}]}>
      <View style={styles.progressTop}><AppIcon name="star" color={theme.yellow} size={27} />
        <View style={{flex:1}}><Text style={styles.progressEyebrow}>SEU PROGRESSO</Text>
          <Text style={styles.progressTitle}>{progress ? 'Nível ' + progress.level + ' · Explorador' : token ? 'Seu progresso' : 'Comece sua jornada'}</Text></View>
        <View style={styles.arrow}><AppIcon name="chevron" color={theme.blue} size={19} /></View></View>
      {progress ? <><View style={styles.progressTrack}><View style={[styles.progressFill,{width:(levelPercent+'%') as DimensionValue}]} /></View>
        <Text style={styles.progressFoot}>{progress.xp} XP no total · {progress.nextLevelXp} XP para o próximo nível</Text></>
        : <Text style={styles.progressFoot}>{token ? 'Acompanhe suas conquistas e próximos passos.' : 'Entre para guardar conquistas e acompanhar seu plano.'}</Text>}
    </Pressable>
    {progressError && <Notice error>Não foi possível carregar o progresso. Confira a conexão com a API.</Notice>}
    {progress?.streak.current ? <View style={styles.streak}><AppIcon name="star" color="#b67a0b" size={16} />
      <Text style={styles.streakText}>{progress.streak.current} {progress.streak.current === 1 ? 'dia seguido' : 'dias seguidos'}</Text></View> : null}

    <Pressable accessibilityRole="button" accessibilityLabel="Abrir ligas semanais SAT e MEXT" onPress={()=>router.push('/ligas' as Href)}
      style={({pressed})=>[styles.leagues,pressed&&{opacity:.85}]}>
      <View style={styles.leagueCopy}>
        <View style={styles.leagueEyebrow}><AppIcon name="star" color="#c88600" size={15} />
          <Text style={styles.leagueEyebrowText}>DESAFIO DA SEMANA</Text></View>
        <Text style={styles.leagueTitle}>Entre na sua liga</Text>
        <Text style={styles.leagueText}>Pratique SAT ou MEXT e avance no ranking.</Text>
        <View style={styles.leagueAction}><Text style={styles.leagueActionText}>Ver ligas</Text>
          <AppIcon name="chevron" color={theme.white} size={17} /></View>
      </View>
      <Image source={require('../../../assets/images/leagues/trophy.png')} resizeMode="contain"
        style={styles.leagueTrophy} accessibilityElementsHidden />
    </Pressable>

    <Text style={styles.sectionTitle}>Comece sua jornada</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Explorar oportunidades" onPress={() => router.push('/bolsas')}
      style={({pressed})=>[styles.explore,pressed && {opacity:.75}]}>
      <View style={styles.exploreIcon}><AppIcon name="search" color={theme.blue} size={28} /></View>
      <View style={{flex:1}}><Text style={styles.exploreTitle}>Explorar oportunidades</Text><Text style={styles.exploreText}>Encontre bolsas para estudar fora.</Text></View>
      <AppIcon name="chevron" color={theme.blue} size={20} />
    </Pressable>

    <Text style={styles.smallTitle}>Ferramentas rápidas</Text>
    <View style={styles.tools}>{tools.map(item=><Pressable key={item.href} accessibilityRole="button" accessibilityLabel={'Abrir '+item.title} onPress={() => router.push(item.href as Href)}
      style={({pressed})=>[styles.tool,pressed && {opacity:.7}]}>
      <View style={[styles.toolIcon,{backgroundColor:item.color}]}><QuickToolIcon kind={item.art} /></View>
      <Text style={styles.toolTitle}>{item.title}</Text>
    </Pressable>)}</View>

    <View style={styles.sectionRow}><Text style={styles.smallTitle}>Destinos para explorar</Text>
      <Pressable accessibilityRole="link" onPress={() => router.push('/paises')}><Text style={styles.seeAll}>Ver todos  →</Text></Pressable></View>
    <View style={styles.countryGrid}>{countries.map(item=><Pressable key={item.slug} accessibilityRole="button"
      accessibilityLabel={'Abrir guia de '+item.name} onPress={() => router.push(`/guia/${item.slug}` as Href)}
      style={({pressed})=>[styles.country,pressed && {opacity:.75}]}>
      <Image source={item.image} style={styles.countryImage} resizeMode="cover" />
      <Text style={styles.countryName}>{item.flag}  {item.name}</Text>
      <Text style={styles.countryAction}>Abrir guia  →</Text>
    </Pressable>)}</View>
  </Screen>
}

const styles=StyleSheet.create({
  art:{height:176,backgroundColor:'#eaf2ff',borderRadius:21,overflow:'hidden',alignItems:'center',justifyContent:'center',marginBottom:10},
  artImage:{width:'100%',height:182},
  progress:{backgroundColor:theme.blue,borderRadius:19,padding:16,borderBottomWidth:4,borderBottomColor:'#174cb5',marginBottom:13,shadowColor:theme.shadow,shadowOpacity:.15,shadowRadius:10,elevation:3},
  progressTop:{flexDirection:'row',alignItems:'center',gap:10},
  progressEyebrow:{color:'#dceaff',fontSize:10,fontWeight:'800',letterSpacing:.8},
  progressTitle:{color:theme.white,fontSize:16,fontWeight:'800',marginTop:2},
  arrow:{width:26,height:26,borderRadius:13,backgroundColor:theme.white,alignItems:'center',justifyContent:'center'},
  progressTrack:{height:8,backgroundColor:'#82aaf0',borderRadius:5,overflow:'hidden',marginTop:12},
  progressFill:{height:8,backgroundColor:theme.yellow,borderRadius:5},
  progressFoot:{color:'#eef4ff',fontSize:11,marginTop:7,fontWeight:'700'},
  streak:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#fff0c8',borderRadius:99,paddingHorizontal:12,paddingVertical:6,marginBottom:8},
  streakText:{color:'#76500a',fontSize:11,fontWeight:'800'},
  leagues:{minHeight:176,flexDirection:'row',alignItems:'center',backgroundColor:'#e9e8ff',borderColor:'#d5d6ff',borderWidth:1.5,
    borderRadius:22,padding:16,marginBottom:13,overflow:'hidden',shadowColor:theme.shadow,shadowOpacity:.1,shadowRadius:10,elevation:2},
  leagueCopy:{width:'61%',zIndex:1},
  leagueEyebrow:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:4,backgroundColor:'#fff0ba',
    borderRadius:99,paddingHorizontal:9,paddingVertical:5,marginBottom:9},
  leagueEyebrowText:{color:theme.navy,fontSize:9,fontWeight:'900',letterSpacing:.2},
  leagueTitle:{color:theme.navy,fontSize:20,lineHeight:24,fontWeight:'900'},
  leagueText:{color:theme.ink,fontSize:11,lineHeight:16,marginTop:4,marginBottom:12},
  leagueAction:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:7,backgroundColor:theme.blue,
    borderRadius:99,paddingHorizontal:16,minHeight:35},
  leagueActionText:{color:theme.white,fontSize:12,fontWeight:'800'},
  leagueTrophy:{position:'absolute',right:-14,bottom:-14,width:'47%',height:169},
  sectionTitle:{color:theme.navy,fontSize:18,fontWeight:'800',marginTop:6,marginBottom:10},
  smallTitle:{color:theme.navy,fontSize:15,fontWeight:'800',marginTop:15,marginBottom:9},
  explore:{backgroundColor:theme.white,borderColor:theme.border,borderWidth:1.5,borderRadius:17,padding:11,flexDirection:'row',alignItems:'center',gap:10,shadowColor:theme.shadow,shadowOpacity:.06,shadowRadius:8,elevation:2},
  exploreIcon:{width:45,height:45,borderRadius:14,backgroundColor:theme.pale,alignItems:'center',justifyContent:'center'},
  exploreTitle:{color:theme.navy,fontWeight:'800',fontSize:13},exploreText:{color:theme.muted,fontSize:11,marginTop:3},
  tools:{flexDirection:'row',flexWrap:'wrap',gap:8},
  tool:{width:'48.5%',minHeight:121,backgroundColor:theme.white,borderColor:theme.border,borderWidth:1.5,
    borderBottomWidth:4,borderBottomColor:'#d5e1f8',borderRadius:17,padding:9,alignItems:'center',justifyContent:'center',gap:9,
    shadowColor:theme.shadow,shadowOpacity:.06,shadowRadius:7,elevation:2},
  toolIcon:{width:58,height:58,borderRadius:16,alignItems:'center',justifyContent:'center'},
  toolTitle:{color:theme.navy,fontSize:11,fontWeight:'800',textAlign:'center',lineHeight:14},
  sectionRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:8},
  seeAll:{color:theme.blue,fontSize:11,fontWeight:'800'},
  countryGrid:{flexDirection:'row',flexWrap:'wrap',gap:9,marginBottom:9},
  country:{width:'48.5%',backgroundColor:theme.white,borderRadius:16,borderWidth:1.5,borderColor:theme.border,overflow:'hidden',paddingBottom:9},
  countryImage:{width:'100%',height:95},countryName:{color:theme.navy,fontSize:12,fontWeight:'800',marginHorizontal:9,marginTop:7},
  countryAction:{color:theme.blue,fontSize:10,fontWeight:'800',marginHorizontal:9,marginTop:3},
})
