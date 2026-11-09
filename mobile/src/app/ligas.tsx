import { useCallback, useState } from 'react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { Image, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native'
import { api } from '../api'
import { AppIcon } from '../components/AppIcon'
import { Action, Notice, Panel } from '../components/Controls'
import { Screen } from '../components/Screen'
import { useSession } from '../session'
import { theme } from '../theme'

type Source='sat-reading-writing'|'sat-math'|'mext'
type Tier='bronze'|'silver'|'gold'
type Entry={alias:string;points:number;correct:number;livesLost:number;days:number;rank:number|null;you:boolean}
type League={source:Source;joined:boolean;weekStart:string;weekEnd:string;daysRemaining:number;
  rules:{completion:number;perCorrect:number;dailyLimit:string;silverAt:number;goldAt:number};
  tier?:Tier;participants?:number;nextTier?:Tier|null;promotionAt?:number|null;
  previousPoints?:number;previousRewardXp?:number;you?:Entry;leaders?:Entry[]}
const tiers:Record<Tier,{name:string;ink:string;hero:string;accent:string}>={
  bronze:{name:'Liga Bronze',ink:'#794827',hero:'#ffe6d1',accent:'#ce854a'},
  silver:{name:'Liga Prata',ink:'#345371',hero:'#dfeeff',accent:'#7297c6'},
  gold:{name:'Liga Ouro',ink:'#663909',hero:'#ffdf86',accent:'#f4b919'},
}
const trophy=require('../../assets/images/leagues/trophy.png')
const shield=require('../../assets/images/leagues/shield.png')
const rocket=require('../../assets/images/leagues/rocket.png')
const dateLabel=(day:string)=>day.split('-').reverse().join('/')
const sourceLabel=(source:Source)=>source==='sat-math'?'Matemática · SAT':source==='sat-reading-writing'?'Leitura e escrita · SAT':'MEXT'

function Switch({items,selected,onSelect}:{items:{id:string;label:string}[];selected:string;onSelect:(id:string)=>void}){
  return <View style={styles.switch}>{items.map(item=><Pressable key={item.id} accessibilityRole="tab"
    accessibilityState={{selected:selected===item.id}} onPress={()=>onSelect(item.id)}
    style={[styles.switchItem,selected===item.id&&styles.switchActive]}>
    <Text style={[styles.switchText,selected===item.id&&styles.switchTextActive]}>{item.label}</Text>
  </Pressable>)}</View>
}

function ScoreTrack({points,target}:{points:number;target:number}){
  const percent=Math.min(100,Math.round(points/target*100))
  return <View accessibilityLabel={`${points} de ${target} pontos`} style={styles.scoreTrack}>
    <View style={[styles.scoreFill,{width:(percent+'%') as DimensionValue}]} />
  </View>
}

export default function WeeklyLeagues(){
  const params=useLocalSearchParams<{source?:string}>()
  const {token}=useSession()
  const [source,setSource]=useState<Source>(params.source==='mext'?'mext':params.source==='sat-math'?'sat-math':'sat-reading-writing')
  const [view,setView]=useState<'overview'|'ranking'>('overview')
  const [section,setSection]=useState<'ranking'|'rules'>('ranking')
  const [league,setLeague]=useState<League|null>(null)
  const [loading,setLoading]=useState(false)
  const [busy,setBusy]=useState(false)
  const [confirmLeave,setConfirmLeave]=useState(false)
  const [error,setError]=useState('')
  const load=useCallback(async()=>{
    if(!token){setLeague(null);return}
    setLoading(true);setError('')
    try{setLeague(await api<League>(`/api/account/leagues/${source}`,{token}))}
    catch(cause){setLeague(null);setError(cause instanceof Error?cause.message:'Não foi possível carregar a liga.')}
    finally{setLoading(false)}
  },[token,source])
  useFocusEffect(useCallback(()=>{void load()},[load]))
  async function changeMembership(method:'POST'|'DELETE'){
    if(!token||busy)return
    setBusy(true);setError('')
    try{
      if(method==='DELETE')await api(`/api/account/leagues/${source}`,{method,token})
      else setLeague(await api<League>(`/api/account/leagues/${source}`,{method,token}))
      if(method==='DELETE'){await load();setView('overview')}
      setConfirmLeave(false)
    }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível atualizar sua participação.')}
    finally{setBusy(false)}
  }
  const tier=tiers[league?.tier||'bronze']
  const points=league?.you?.points||0
  const target=league?.promotionAt||league?.rules.goldAt||280
  const remaining=Math.max(0,target-points)
  const practice=()=>router.push(source==='mext'?'/mext':'/sat')
  const dayCount=league?.daysRemaining||0
  const dayText=`${dayCount} ${dayCount===1?'dia':'dias'}`

  return <Screen brandHeader={view==='overview'} navTitle="Liga semanal" hideHeading title="Ligas semanais"
    description="" onBack={view==='ranking'?()=>setView('overview'):undefined}>
    {view==='overview'?<>
      <View style={styles.intro}>
        <View style={styles.introCopy}><Text style={styles.introTitle} accessibilityRole="header">Ligas Semanais</Text>
          <Text style={styles.introSubtitle}>Pratique SAT ou MEXT, avance de liga e acompanhe suas conquistas.</Text></View>
        <Image source={trophy} style={styles.introTrophy} resizeMode="contain" />
      </View>
      <Switch items={[{id:'sat',label:'SAT'},{id:'mext',label:'MEXT'}]} selected={source==='mext'?'mext':'sat'}
        onSelect={id=>{setSource(id==='mext'?'mext':'sat-reading-writing');setConfirmLeave(false)}} />
      {source!=='mext'&&<Switch items={[{id:'sat-reading-writing',label:'Leitura e escrita'},{id:'sat-math',label:'Matemática'}]} selected={source}
        onSelect={id=>{setSource(id as Source);setConfirmLeave(false)}} />}
      <Switch items={[{id:'overview',label:'♛  Minha liga'},{id:'ranking',label:'▥  Ranking'}]} selected="overview"
        onSelect={id=>{if(id==='ranking')setView('ranking')}} />
    </>:<>
      <View style={[styles.rankingHero,{backgroundColor:tier.hero}]}>
        <Image source={trophy} style={styles.rankingTrophy} resizeMode="contain" />
        <View style={styles.rankingHeroCopy}><Text style={[styles.rankingTitle,{color:tier.ink}]}>{tier.name}</Text>
          <Text style={styles.rankingSubtitle}>Sua semana de prática em {sourceLabel(source)}.</Text></View>
      </View>
      <Switch items={[{id:'sat',label:'SAT'},{id:'mext',label:'MEXT'}]} selected={source==='mext'?'mext':'sat'}
        onSelect={id=>{setSource(id==='mext'?'mext':'sat-reading-writing');setSection('ranking')}} />
      {source!=='mext'&&<Switch items={[{id:'sat-reading-writing',label:'Leitura e escrita'},{id:'sat-math',label:'Matemática'}]} selected={source}
        onSelect={id=>{setSource(id as Source);setSection('ranking')}} />}
    </>}

    {!token?<Panel><Text style={styles.body}>Entre na sua conta para participar. No ranking, seus resultados aparecem somente com um apelido.</Text>
      <Action label="Entrar na conta" onPress={()=>router.push('/conta')} /></Panel>:<>
      {loading&&<Notice>Carregando sua liga…</Notice>}
      {!!error&&<><Notice error>{error}</Notice><Action label="Tentar novamente" secondary onPress={()=>{void load()}} /></>}
      {league&&!loading&&<>
        {view==='overview'?<>
          <View style={styles.leagueCard}>
            <Image source={shield} style={styles.shield} resizeMode="contain" />
            <View style={styles.leagueCopy}><Text style={styles.leagueTitle}>{league.joined?tier.name:'Liga Bronze'}</Text>
              <Text style={styles.leagueSubtitle}>{league.joined?'Seu progresso nesta semana':'Sua primeira liga está pronta'}</Text>
              <ScoreTrack points={points} target={target} />
              <Text style={styles.leaguePoints}>{points} / {target} pontos</Text></View>
            <View style={styles.daysBadge}><AppIcon name="calendar" color={theme.navy} size={17} />
              <Text style={styles.daysStrong}>{dayText}</Text><Text style={styles.daysSmall}>para o fim</Text></View>
          </View>
          {!league.joined?<Panel><Text style={styles.heading}>Entre na liga {sourceLabel(source)}</Text>
            <Text style={styles.body}>Ao participar, desafios de hoje já registrados na sua conta entram na pontuação. Cada área do SAT tem seu próprio ranking, separado do MEXT, e você aparece com um apelido.</Text>
            <Action label={busy?'Entrando…':'Entrar na liga'} disabled={busy} onPress={()=>{void changeMembership('POST')}} /></Panel>:<>
            <Text style={styles.sectionHeading}>Sua posição</Text>
            <View style={styles.positionCard}><View style={styles.positionMain}>
              <Text style={styles.positionRank}>{league.you?.rank?'#'+league.you.rank:'—'}</Text>
              <Text style={styles.positionDetail}>{league.you?.rank?`de ${league.participants} com pontos`:'Acerte uma questão para entrar no ranking'}</Text></View>
              <View style={styles.positionDivider} />
              <View style={styles.positionSide}><Text style={styles.positionSideValue}>{league.you?.days||0}</Text>
                <Text style={styles.positionSideLabel}>{league.you?.days===1?'dia de prática':'dias de prática'}</Text></View>
              <Image source={rocket} style={styles.rocket} resizeMode="contain" />
            </View>
            <Text style={styles.sectionHeading}>Recompensas da liga</Text>
            <View style={styles.rewardTiles}>
              <View style={[styles.rewardTile,{backgroundColor:'#e8efff'}]}><AppIcon name="star" color={theme.blue} size={28} />
                <Text style={styles.rewardValue}>+20 XP</Text><Text style={styles.rewardLabel}>Liga Prata</Text></View>
              <View style={[styles.rewardTile,{backgroundColor:'#fff2d8'}]}><AppIcon name="trophy" color="#d99a00" size={28} />
                <Text style={styles.rewardValue}>+40 XP</Text><Text style={styles.rewardLabel}>Liga Ouro</Text></View>
              <View style={[styles.rewardTile,{backgroundColor:'#f1eaff'}]}><AppIcon name="shield" color="#794bdd" size={28} />
                <Text style={styles.rewardValue}>{league.previousRewardXp||0} XP</Text><Text style={styles.rewardLabel}>Bônus anterior</Text></View>
            </View>
            <Text style={styles.rewardNote}>Prata: {league.rules.silverAt} pontos. Ouro: {league.rules.goldAt}. O bônus entra uma vez após a semana terminar; os valores não se somam.</Text>
            <Action label="Ver ranking completo  →" onPress={()=>{setView('ranking');setSection('ranking')}} />
            <Action label={`Praticar ${sourceLabel(source)}  →`} secondary onPress={practice} />
          </>}
        </>:<>
          <View style={styles.weekBar}><AppIcon name="calendar" color="#6265bb" size={17} />
            <Text style={styles.weekLabel}>Termina em: <Text style={styles.weekStrong}>{dayText}</Text></Text>
            <View style={styles.weekDivider} /><AppIcon name="star" color="#efa900" size={18} />
            <Text style={styles.weekPoints}>{points} pts</Text></View>
          <Text style={styles.weekDates}>{dateLabel(league.weekStart)} a {dateLabel(league.weekEnd)} · horário de Brasília</Text>
          {!league.joined?<Panel><Text style={styles.heading}>Entre para ver sua liga</Text>
            <Text style={styles.body}>O ranking usa apenas participantes reais. Entre na liga e conclua um desafio diário.</Text>
            <Action label="Entrar na liga" disabled={busy} onPress={()=>{void changeMembership('POST')}} /></Panel>:<>
            <Switch items={[{id:'ranking',label:'▥  Ranking'},{id:'rules',label:'ⓘ  Regras'}]} selected={section}
              onSelect={id=>setSection(id as 'ranking'|'rules')} />
            {section==='ranking'?<>
              <Text style={styles.rankingHeading}>Ranking da {tier.name}</Text>
              {!league.leaders?.length&&<Panel><Text style={styles.body}>Ninguém pontuou nesta liga ainda. Acerte uma questão de um desafio diário para aparecer aqui.</Text></Panel>}
              {league.leaders?.map(entry=><View key={entry.alias} style={[styles.rankRow,entry.rank===1&&styles.rankFirst,entry.you&&styles.rankYou]}>
                <View style={[styles.rankMedal,entry.rank===1&&styles.medalGold,entry.rank===2&&styles.medalSilver,entry.rank===3&&styles.medalBronze]}>
                  <Text style={styles.rankMedalText}>{entry.rank}</Text></View>
                <View style={styles.rankAvatar}><AppIcon name="person" color={entry.you?theme.blue:'#6477a1'} size={20} /></View>
                <View style={styles.rankCopy}><Text style={styles.rankName}>{entry.you?'Você · ':''}{entry.alias}</Text>
                  <Text style={styles.rankDetail}>{entry.days} {entry.days===1?'dia':'dias'} · {entry.correct} acertos · {entry.livesLost} {entry.livesLost===1?'vida perdida':'vidas perdidas'}</Text></View>
                <Text style={styles.rankPoints}>{entry.points} pts</Text>
              </View>)}
              {league.you&&league.you.rank!==null&&league.you.rank>10&&<View style={[styles.rankRow,styles.rankYou]}>
                <View style={styles.rankMedal}><Text style={styles.rankMedalText}>{league.you.rank}</Text></View>
                <View style={styles.rankAvatar}><AppIcon name="person" color={theme.blue} size={20} /></View>
                <Text style={[styles.rankName,{flex:1}]}>Você · {league.you.alias}</Text><Text style={styles.rankPoints}>{league.you.points} pts</Text>
              </View>}
              <View style={styles.tip}><AppIcon name="star" color="#e8a900" size={25} />
                <Text style={styles.tipText}>Conclua desafios diários para subir na liga. Conta o melhor desafio do dia por exame.</Text></View>
            </>:<Panel><Text style={styles.heading}>Como funciona</Text>
              <Text style={styles.body}>• A semana vai de segunda a domingo no horário de Brasília.</Text>
              <Text style={styles.body}>• Cada acerto rende {league.rules.perCorrect} pontos. Concluir o desafio sem acertar não rende pontos na liga. {league.rules.dailyLimit}.</Text>
              <Text style={styles.body}>• A classificação da semana seguinte usa os pontos desta semana: Prata a partir de {league.rules.silverAt}, Ouro a partir de {league.rules.goldAt}.</Text>
              <Text style={styles.body}>• Em caso de empate nos pontos, fica à frente quem perdeu menos vidas nos desafios contabilizados. Se ainda houver empate, valem mais dias de prática e depois o apelido. A posição pode mudar até o encerramento.</Text>
              <Text style={styles.body}>• Prata concede 20 XP; Ouro concede 40 XP no total. O bônus é automático e não se repete para a mesma semana.</Text></Panel>}
            <Action label={`Praticar ${sourceLabel(source)}  →`} onPress={practice} />
          </>}
        </>}
        {league.joined&&<View style={styles.leaveArea}>{!confirmLeave?<Pressable accessibilityRole="button" onPress={()=>setConfirmLeave(true)}>
          <Text style={styles.leaveText}>Sair desta liga</Text></Pressable>:<Panel>
          <Text style={styles.body}>Ao sair, você deixa de aparecer no ranking. Pode entrar novamente depois.</Text>
          <Action label="Confirmar saída" disabled={busy} onPress={()=>{void changeMembership('DELETE')}} />
          <Action label="Cancelar" secondary onPress={()=>setConfirmLeave(false)} /></Panel>}</View>}
      </>}
    </>}
  </Screen>
}

const styles=StyleSheet.create({
  body:{color:theme.muted,fontSize:12,lineHeight:19},heading:{color:theme.navy,fontSize:16,fontWeight:'800',marginBottom:5},
  intro:{height:178,backgroundColor:'#e9f1ff',borderRadius:26,overflow:'hidden',flexDirection:'row',alignItems:'center',paddingLeft:17,marginBottom:13},
  introCopy:{flex:1,zIndex:1},introTitle:{color:theme.navy,fontSize:25,fontWeight:'900',lineHeight:31},
  introSubtitle:{color:theme.ink,fontSize:12,lineHeight:19,marginTop:8,maxWidth:210},
  introTrophy:{width:151,height:151,marginRight:-9,alignSelf:'flex-end'},
  switch:{flexDirection:'row',backgroundColor:'#e5eaff',borderRadius:99,padding:4,marginBottom:13,gap:4},
  switchItem:{flex:1,minHeight:42,borderRadius:99,alignItems:'center',justifyContent:'center',paddingHorizontal:5},
  switchActive:{backgroundColor:theme.blue,shadowColor:theme.shadow,shadowOpacity:.15,shadowRadius:5,elevation:2},
  switchText:{color:'#5c64aa',fontSize:12,fontWeight:'800',textAlign:'center'},switchTextActive:{color:theme.white},
  leagueCard:{minHeight:155,backgroundColor:'#9d72f3',borderRadius:25,flexDirection:'row',alignItems:'center',padding:12,
    overflow:'hidden',marginBottom:19},shield:{width:92,height:115,marginLeft:-10,marginRight:1},leagueCopy:{flex:1,minWidth:0},
  leagueTitle:{color:theme.white,fontSize:21,fontWeight:'900'},leagueSubtitle:{color:theme.white,fontSize:11,marginTop:3,marginBottom:10},
  scoreTrack:{height:12,borderRadius:8,backgroundColor:'#efe2ff',overflow:'hidden'},
  scoreFill:{height:12,borderRadius:8,backgroundColor:theme.yellow},leaguePoints:{color:theme.navy,fontWeight:'800',fontSize:12,marginTop:6},
  daysBadge:{width:67,alignItems:'center',justifyContent:'center',padding:5,backgroundColor:'#ffffffbb',borderRadius:16,marginLeft:7},
  daysStrong:{fontSize:11,fontWeight:'900',color:theme.navy,marginTop:3},daysSmall:{fontSize:10,color:theme.navy},
  sectionHeading:{color:theme.navy,fontSize:17,fontWeight:'900',marginBottom:10},
  positionCard:{height:115,borderRadius:22,backgroundColor:theme.white,borderWidth:1.5,borderColor:theme.border,
    flexDirection:'row',alignItems:'center',paddingLeft:17,marginBottom:20,overflow:'hidden'},
  positionMain:{flex:1,zIndex:1},positionRank:{color:theme.navy,fontSize:29,fontWeight:'900'},
  positionDetail:{color:theme.muted,fontSize:11,lineHeight:16,maxWidth:145},
  positionDivider:{height:60,width:1.5,backgroundColor:'#cbd6f7',marginHorizontal:10},
  positionSide:{width:74,zIndex:1},positionSideValue:{color:'#1bb780',fontSize:22,fontWeight:'900'},
  positionSideLabel:{color:theme.muted,fontSize:10,lineHeight:13},rocket:{position:'absolute',right:-11,bottom:-13,width:90,height:100},
  rewardTiles:{flexDirection:'row',gap:8,marginBottom:9},rewardTile:{flex:1,minHeight:108,borderRadius:17,
    borderWidth:1,borderColor:theme.border,alignItems:'center',justifyContent:'center',padding:7},
  rewardValue:{color:theme.navy,fontSize:14,fontWeight:'900',marginTop:5},rewardLabel:{color:theme.ink,fontSize:10,textAlign:'center'},
  rewardNote:{color:theme.muted,fontSize:10,lineHeight:15,marginBottom:13},
  rankingHero:{height:150,borderRadius:24,flexDirection:'row',alignItems:'center',overflow:'hidden',marginBottom:12},
  rankingTrophy:{width:130,height:140,marginLeft:-8},rankingHeroCopy:{flex:1,paddingRight:10},
  rankingTitle:{fontSize:24,fontWeight:'900'},rankingSubtitle:{color:theme.ink,fontSize:12,lineHeight:18,marginTop:5},
  weekBar:{minHeight:48,borderRadius:99,backgroundColor:'#e6eaff',flexDirection:'row',alignItems:'center',
    paddingHorizontal:11,gap:5,marginBottom:5},weekLabel:{color:theme.navy,fontSize:11,flex:1},
  weekStrong:{fontWeight:'900'},weekDivider:{height:25,width:1,backgroundColor:'#a8b5e9',marginHorizontal:4},
  weekPoints:{fontSize:11,fontWeight:'900',color:theme.navy},weekDates:{color:theme.muted,fontSize:10,textAlign:'center',marginBottom:15},
  rankingHeading:{color:theme.navy,fontSize:16,fontWeight:'900',marginBottom:10},
  rankRow:{minHeight:69,flexDirection:'row',alignItems:'center',gap:9,backgroundColor:theme.white,borderWidth:1.5,
    borderColor:theme.border,borderRadius:18,paddingHorizontal:9,marginBottom:6},
  rankFirst:{backgroundColor:'#fff4dc',borderColor:'#ffd168'},rankYou:{backgroundColor:'#e8f0ff',borderColor:'#83acff'},
  rankMedal:{width:35,height:35,borderRadius:18,backgroundColor:theme.pale,alignItems:'center',justifyContent:'center'},
  medalGold:{backgroundColor:'#ffc439'},medalSilver:{backgroundColor:'#cbd4e7'},medalBronze:{backgroundColor:'#d79a64'},
  rankMedalText:{color:theme.navy,fontSize:16,fontWeight:'900'},
  rankAvatar:{width:37,height:37,borderRadius:19,backgroundColor:'#e8efff',alignItems:'center',justifyContent:'center'},
  rankCopy:{flex:1,minWidth:0},rankName:{color:theme.navy,fontSize:11,fontWeight:'900'},
  rankDetail:{color:theme.muted,fontSize:10,marginTop:3},rankPoints:{color:theme.navy,fontSize:11,fontWeight:'900'},
  tip:{flexDirection:'row',alignItems:'center',gap:9,backgroundColor:'#e6efff',borderRadius:17,padding:12,marginTop:7,marginBottom:14},
  tipText:{color:theme.navy,fontSize:11,fontWeight:'700',lineHeight:16,flex:1},
  leaveArea:{alignItems:'center',marginTop:14},leaveText:{color:theme.muted,fontSize:12,textDecorationLine:'underline',padding:8},
})
