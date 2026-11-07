import { useCallback, useState } from 'react'
import { useFocusEffect, router } from 'expo-router'
import { ScrollView, StyleSheet, Text, View, type DimensionValue } from 'react-native'
import { api, type Journey, type SavedScholarship } from '../../api'
import { AppIcon } from '../../components/AppIcon'
import { Action, Field, Notice, Panel, Pill } from '../../components/Controls'
import { ProgressBadge } from '../../components/ProgressBadge'
import { Screen } from '../../components/Screen'
import { useSession } from '../../session'
import { theme } from '../../theme'

type Progress={xp:number;level:number;nextLevelXp:number;achievements:{key:string;category:string;title:string;completed:boolean}[]}
const keyOf=(item:SavedScholarship)=>item.source+':'+item.source_id

export default function JourneyScreen(){
  const {token}=useSession()
  const [journey,setJourney]=useState<Journey|null>(null)
  const [saved,setSaved]=useState<SavedScholarship[]>([])
  const [progress,setProgress]=useState<Progress|null>(null)
  const [title,setTitle]=useState('')
  const [dueDate,setDueDate]=useState('')
  const [note,setNote]=useState('')
  const [selected,setSelected]=useState('')
  const [showChoices,setShowChoices]=useState(false)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [notice,setNotice]=useState('')
  const load=useCallback(async()=>{
    if(!token){setJourney(null);setSaved([]);setProgress(null);return}
    setError('')
    try{
      const [data,choices]=await Promise.all([
        api<Journey>('/api/account/journey',{token}),
        api<{items:SavedScholarship[]}>('/api/account/saved-scholarships',{token}),
      ])
      setJourney(data);setSaved(choices.items)
    }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível carregar sua jornada.')}
    void api<Progress>('/api/account/missions',{token}).then(setProgress).catch(()=>setProgress(null))
  },[token])
  useFocusEffect(useCallback(()=>{void load()},[load]))
  const save=async()=>{
    if(!token)return
    setBusy(true);setError('');setNotice('')
    try{
      const chosen=saved.find(item=>keyOf(item)===selected)
      await api('/api/account/journey/deadlines',{method:'POST',token,
        body:{title,dueDate,note,savedSource:chosen?.source||null,savedSourceId:chosen?.source_id||null}})
      setTitle('');setDueDate('');setNote('');setSelected('');setShowChoices(false);setNotice('Prazo salvo na sua conta.')
      await load()
    }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível salvar o prazo.')}
    finally{setBusy(false)}
  }
  const remove=async(id:string)=>{
    if(!token)return
    setBusy(true);setError('')
    try{await api('/api/account/journey/deadlines/'+id,{method:'DELETE',token});await load()}
    catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível remover o prazo.')}
    finally{setBusy(false)}
  }
  const achievements=progress?.achievements.filter(item=>item.completed).slice(0,3)||[]
  return <Screen navTitle="Meu plano" title="Meu plano de estudos"
    description="Organize suas etapas, documentos e prazos no seu ritmo.">
    {!token?<Panel><Text style={styles.body}>Entre na sua conta para guardar prazos e documentos e acessá-los também no site.</Text>
      <Action label="Entrar na conta" onPress={()=>router.push('/conta')} /></Panel>:<>
      {!!error&&<Notice error>{error}</Notice>}{!!notice&&<Notice>{notice}</Notice>}
      <View style={styles.levelCard}><View style={styles.levelTop}><View style={styles.levelStar}><AppIcon name="star" color={theme.yellow} size={31} /></View>
        <View style={{flex:1}}><Text style={styles.levelName}>{progress?'Nível '+progress.level+' · Explorador':'Seu progresso'}</Text>
          <Text style={styles.levelSub}>{progress?progress.xp+' XP no total':'Acompanhe sua jornada'}</Text></View></View>
        {progress&&<><View style={styles.track}><View style={[styles.trackFill,{width:(progress.xp%100+'%') as DimensionValue}]} /></View>
          <Text style={styles.levelSub}>{progress.nextLevelXp} XP para o próximo nível</Text></>}
      </View>
      <View style={styles.sectionRow}><Text style={styles.sectionTitle}>Suas conquistas</Text>
        <Text style={styles.link} onPress={()=>router.push('/progresso')}>Ver todas  →</Text></View>
      <View style={styles.badgeRow}>{achievements.length?achievements.map(item=><View key={item.key} style={styles.badge}>
        <ProgressBadge itemKey={item.key} category={item.category} completed size={48} />
        <Text style={styles.badgeText} numberOfLines={2}>{item.title}</Text></View>)
        :<Text style={styles.body}>Suas primeiras conquistas aparecerão aqui conforme você explorar o app.</Text>}</View>
      <Text style={styles.sectionTitle}>Seu plano de estudos</Text>
      <Panel><View style={styles.step}><AppIcon name="globe" color={theme.blue} size={20} />
        <View style={{flex:1}}><Text style={styles.stepTitle}>Explorar destinos</Text><Text style={styles.body}>Conheça os países disponíveis.</Text></View></View>
        <Action label="Ver países  →" secondary onPress={()=>router.push('/paises')} /></Panel>
      <Panel><View style={styles.step}><AppIcon name="search" color={theme.blue} size={20} />
        <View style={{flex:1}}><Text style={styles.stepTitle}>Pesquisar bolsas</Text><Text style={styles.body}>{saved.length? saved.length+' bolsa(s) salva(s) na sua conta.':'Encontre oportunidades com fonte original.'}</Text></View></View>
        <Action label="Buscar bolsas  →" secondary onPress={()=>router.push('/bolsas')} /></Panel>
      <Panel><View style={styles.step}><AppIcon name="document" color={theme.blue} size={20} />
        <View style={{flex:1}}><Text style={styles.stepTitle}>Revisar documentos</Text><Text style={styles.body}>Guarde seus arquivos de candidatura.</Text></View></View>
        <Action label="Abrir documentos  →" secondary onPress={()=>router.push('/documentos')} /></Panel>
      <Text style={styles.sectionTitle}>Prazos da candidatura</Text>
      <View style={styles.deadlineSummary}><AppIcon name="calendar" color={theme.blue} size={22} />
        <Text style={styles.deadlineSummaryText}>{journey?.deadlines.length??'—'} prazos cadastrados</Text></View>
      <Panel><Text style={styles.cardTitle}>Adicionar prazo</Text>
        <Field label="Bolsa ou candidatura" value={title} onChangeText={setTitle} placeholder="Ex.: candidatura à universidade" />
        <Field label="Data (AAAA-MM-DD)" value={dueDate} onChangeText={setDueDate} placeholder="2027-03-15" />
        <Field label="Observação (opcional)" value={note} onChangeText={setNote} />
        {saved.length>0&&<><Text style={styles.fieldLabel}>Associar a uma bolsa salva (opcional)</Text>
          <Action label={selected?saved.find(item=>keyOf(item)===selected)?.title||'Bolsa selecionada':'Selecionar bolsa'} secondary onPress={()=>setShowChoices(!showChoices)} />
          {showChoices&&<ScrollView style={styles.choices} nestedScrollEnabled><Action label="Sem bolsa associada" secondary onPress={()=>{setSelected('');setShowChoices(false)}} />
            {saved.map(item=><Action key={keyOf(item)} label={item.title} secondary={selected!==keyOf(item)}
              onPress={()=>{setSelected(keyOf(item));setShowChoices(false)}} />)}</ScrollView>}</>}
        <Action label={busy?'Salvando…':'Salvar prazo'} disabled={busy} onPress={()=>{void save()}} />
      </Panel>
      <View style={styles.sectionRow}><Text style={styles.sectionTitle}>Prazos cadastrados</Text>{journey&&<Pill>{journey.deadlines.length}</Pill>}</View>
      {!journey&&!error&&<Notice>Carregando jornada…</Notice>}
      {journey&&journey.deadlines.length===0&&<Notice>Você ainda não cadastrou prazos.</Notice>}
      {journey?.deadlines.map(item=><Panel key={item.id}><View style={styles.step}><View style={styles.dateBox}><AppIcon name="calendar" color={theme.blue} size={21} /></View>
        <View style={{flex:1}}><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.body}>Até {item.dueDate.split('-').reverse().join('/')}</Text></View></View>
        {!!item.note&&<Text style={styles.body}>{item.note}</Text>}
        {!!item.savedSource&&<Pill tone="green">Associado a uma bolsa salva</Pill>}
        <Action label="Remover prazo" secondary disabled={busy} onPress={()=>{void remove(item.id)}} /></Panel>)}
    </>}
  </Screen>
}

const styles=StyleSheet.create({
  body:{color:theme.muted,fontSize:12,lineHeight:18},
  levelCard:{backgroundColor:'#e4edff',borderColor:'#c7dafd',borderWidth:1.5,borderRadius:18,padding:15,marginBottom:15,gap:8},
  levelTop:{flexDirection:'row',alignItems:'center',gap:10},levelStar:{width:43,height:43,borderRadius:14,backgroundColor:'#fff2c9',alignItems:'center',justifyContent:'center'},
  levelName:{color:theme.navy,fontSize:14,fontWeight:'800'},levelSub:{color:theme.muted,fontSize:11},
  track:{height:8,backgroundColor:'#cbdcf8',borderRadius:5,overflow:'hidden'},trackFill:{height:8,backgroundColor:theme.green,borderRadius:5},
  sectionRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},sectionTitle:{color:theme.navy,fontSize:16,fontWeight:'800',marginTop:11,marginBottom:9},
  link:{color:theme.blue,fontSize:11,fontWeight:'800'},
  badgeRow:{flexDirection:'row',gap:7,marginBottom:12},badge:{flex:1,minHeight:91,backgroundColor:theme.white,borderColor:theme.border,borderWidth:1.5,borderRadius:14,padding:7,alignItems:'center',justifyContent:'center'},
  badgeText:{color:theme.navy,fontSize:10,fontWeight:'800',textAlign:'center',marginTop:5},
  step:{flexDirection:'row',alignItems:'center',gap:10},stepTitle:{color:theme.navy,fontSize:13,fontWeight:'800'},
  deadlineSummary:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:theme.pale,borderRadius:14,padding:11,marginBottom:11},
  deadlineSummaryText:{color:theme.navy,fontSize:12,fontWeight:'800'},cardTitle:{color:theme.navy,fontSize:15,fontWeight:'800'},
  fieldLabel:{color:theme.navy,fontSize:12,fontWeight:'800'},choices:{maxHeight:220},dateBox:{width:39,height:39,borderRadius:12,backgroundColor:theme.pale,alignItems:'center',justifyContent:'center'},
})
