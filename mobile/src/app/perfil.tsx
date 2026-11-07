import { useCallback, useState, type ReactNode } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { api, type User } from '../api'
import { AppIcon } from '../components/AppIcon'
import { Action, Field, Notice, Panel } from '../components/Controls'
import { Screen } from '../components/Screen'
import { COUNTRY_GUIDES } from '../data/countries'
import { areas, draftFromUser, exams, languages, levelName, studyLevels, targetYears, validateDraft, type ProfileDraft } from '../profile/data'
import { useSession } from '../session'
import { theme } from '../theme'

type Tab='personal'|'academic'|'goals'
const tabs:{id:Tab;label:string}[]=[
  {id:'personal',label:'Pessoais'},{id:'academic',label:'Acadêmicos'},{id:'goals',label:'Metas'},
]

function Choice({label,selected,onPress,disabled=false}:{label:string;selected:boolean;onPress:()=>void;disabled?:boolean}){
  return <Pressable accessibilityRole="button" accessibilityState={{selected,disabled}} disabled={disabled} onPress={onPress}
    style={({pressed})=>[styles.choice,selected&&styles.choiceSelected,disabled&&styles.choiceDisabled,pressed&&{opacity:.7}]}>
    <Text style={[styles.choiceText,selected&&styles.choiceTextSelected]}>{label}</Text>
  </Pressable>
}
function ChoiceGroup({title,children,hint}:{title:string;children:ReactNode;hint?:string}){
  return <View style={styles.group}><Text style={styles.groupTitle}>{title}</Text>
    {!!hint&&<Text style={styles.help}>{hint}</Text>}<View style={styles.choices}>{children}</View></View>
}

export default function ProfileScreen(){
  const {token,user,updateUser}=useSession()
  const [tab,setTab]=useState<Tab>('personal')
  const [draft,setDraft]=useState<ProfileDraft|null>(null)
  const [loading,setLoading]=useState(false)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [message,setMessage]=useState('')
  const [reload,setReload]=useState(0)

  useFocusEffect(useCallback(()=>{
    if(!token){setDraft(null);return}
    let active=true
    setLoading(true);setError('');setMessage('')
    void api<{user:User|null}>('/api/account/me',{token}).then(result=>{
      if(!active)return
      if(!result.user)throw new Error('Sua sessão expirou. Entre novamente.')
      updateUser(result.user);setDraft(draftFromUser(result.user))
    }).catch(cause=>{if(active)setError(cause instanceof Error?cause.message:'Não foi possível carregar o perfil.')})
      .finally(()=>{if(active)setLoading(false)})
    return ()=>{active=false}
  },[token,reload]))

  function change<K extends keyof ProfileDraft>(key:K,value:ProfileDraft[K]){
    setDraft(current=>current?{...current,[key]:value}:current);setMessage('')
  }
  function toggleList(key:'languages'|'plannedExams',value:string){
    if(!draft)return
    change(key,draft[key].includes(value)?draft[key].filter(item=>item!==value):[...draft[key],value])
  }
  function toggleDestination(slug:string){
    if(!draft)return
    const selected=draft.destinationSlugs.includes(slug)
    if(!selected&&draft.destinationSlugs.length>=3)return
    const next=selected?draft.destinationSlugs.filter(item=>item!==slug):[...draft.destinationSlugs,slug]
    setDraft({...draft,destinationSlugs:next,destinationSlug:next[0]||''});setMessage('')
  }
  async function save(){
    if(!token||!draft||busy)return
    const validation=validateDraft(draft)
    if(validation){setError(validation);setMessage('');return}
    setBusy(true);setError('');setMessage('')
    try{
      const payload={...draft,displayName:draft.displayName.trim(),stateCode:draft.stateCode.trim().toUpperCase(),
        destinationSlug:draft.destinationSlugs[0]||''}
      const result=await api<{user:User}>('/api/account/profile',{method:'PUT',token,body:payload})
      if(!Array.isArray(result.user.destinationSlugs)||!Array.isArray(result.user.languages)||!Array.isArray(result.user.plannedExams))
        throw new Error('A API está desatualizada. Reinicie o servidor e tente novamente.')
      updateUser(result.user);setDraft(draftFromUser(result.user));setMessage('Perfil salvo. Os dados também estão disponíveis no site.')
    }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível salvar o perfil.')}
    finally{setBusy(false)}
  }
  const destinationName=COUNTRY_GUIDES.find(item=>item.slug===draft?.destinationSlugs[0])?.name||'A escolher'
  const dirty=!!draft&&!!user&&JSON.stringify(draft)!==JSON.stringify(draftFromUser(user))

  return <Screen navTitle="Editar perfil" title="Seu perfil" description="Organize seus dados acadêmicos e planos. Você pode alterar tudo depois.">
    {!token?<Panel><Text style={styles.body}>Entre na sua conta para editar e sincronizar seu perfil com o site.</Text>
      <Action label="Entrar na conta" onPress={()=>router.push('/conta')} /></Panel>:<>
      <View style={styles.summary}><View style={styles.summaryIcon}><AppIcon name="person" color={theme.blue} size={27} /></View>
        <View style={{flex:1}}><Text style={styles.summaryName}>{draft?.displayName||user?.displayName||'Seu perfil'}</Text>
          <Text style={styles.summaryLine}>{user?.email}</Text>
          <Text style={styles.summaryLine}>{destinationName} · {levelName(draft?.studyLevel||'')}</Text></View></View>
      <View style={styles.tabs}>{tabs.map(item=><Pressable key={item.id} accessibilityRole="tab" accessibilityState={{selected:tab===item.id}}
        onPress={()=>{setTab(item.id);setError('');setMessage('')}} style={[styles.tab,tab===item.id&&styles.tabActive]}>
        <Text style={[styles.tabText,tab===item.id&&styles.tabTextActive]}>{item.label}</Text></Pressable>)}</View>
      {loading&&<Notice>Carregando perfil…</Notice>}
      {!!error&&<Notice error>{error}</Notice>}
      {!!error&&!draft&&<Action label="Tentar novamente" secondary onPress={()=>setReload(value=>value+1)} />}
      {!!message&&<Notice>{message}</Notice>}
      {!!draft&&<>
        {tab==='personal'&&<>
          <Panel><Text style={styles.heading}>Informações pessoais</Text>
            <Field label="Como quer ser chamado(a)" value={draft.displayName} onChangeText={value=>change('displayName',value)} maxLength={80} />
            <Field label="Nome completo (opcional)" value={draft.fullName} onChangeText={value=>change('fullName',value)} maxLength={120} />
            <Text style={styles.help}>Seu nome de exibição aparece na saudação. O e-mail da conta é {user?.email}.</Text></Panel>
          <Panel><Text style={styles.heading}>Escola e localização</Text>
            <Field label="Escola (opcional)" value={draft.schoolName} onChangeText={value=>change('schoolName',value)} maxLength={120} />
            <Field label="Série ou ano (opcional)" value={draft.schoolYear} onChangeText={value=>change('schoolYear',value)} placeholder="Ex.: 3º ano do ensino médio" maxLength={80} />
            <Field label="Cidade (opcional)" value={draft.city} onChangeText={value=>change('city',value)} maxLength={100} />
            <Field label="Estado (sigla, opcional)" value={draft.stateCode} onChangeText={value=>change('stateCode',value.toUpperCase())} placeholder="SP" maxLength={2} autoCapitalize="characters" /></Panel>
          <Panel><View style={styles.row}><Text style={styles.heading}>Resumo acadêmico</Text>
            <Pressable accessibilityRole="button" onPress={()=>setTab('academic')}><Text style={styles.link}>Editar  →</Text></Pressable></View>
            <Text style={styles.body}>GPA informado: {draft.gpa||'Não informado'}</Text>
            <Text style={styles.body}>Idiomas: {draft.languages.join(', ')||'Não informados'}</Text>
            <Text style={styles.body}>Exames: {draft.plannedExams.join(', ')||'Não informados'}</Text>
            {dirty&&<Text style={styles.help}>Resumo das alterações ainda não salvas.</Text>}</Panel>
        </>}
        {tab==='academic'&&<>
          <Panel><Text style={styles.heading}>Dados acadêmicos</Text>
            <Text style={styles.body}>Escola, série e cidade também aparecem nas informações pessoais.</Text>
            <Field label="Escola" value={draft.schoolName} onChangeText={value=>change('schoolName',value)} maxLength={120} />
            <Field label="Série ou ano" value={draft.schoolYear} onChangeText={value=>change('schoolYear',value)} maxLength={80} />
            <Field label="Cidade" value={draft.city} onChangeText={value=>change('city',value)} maxLength={100} />
            <Field label="Estado (sigla)" value={draft.stateCode} onChangeText={value=>change('stateCode',value.toUpperCase())} maxLength={2} autoCapitalize="characters" /></Panel>
          <Panel><ChoiceGroup title="Idiomas que você fala">{languages.map(value=><Choice key={value} label={value}
            selected={draft.languages.includes(value)} onPress={()=>toggleList('languages',value)} />)}</ChoiceGroup></Panel>
          <Panel><Text style={styles.heading}>Notas informadas por você</Text>
            <Field label="GPA (escala de 0 a 4)" value={draft.gpa} onChangeText={value=>change('gpa',value)} keyboardType="decimal-pad" placeholder="Ex.: 3,5" />
            <Field label="SAT (400 a 1600)" value={draft.satScore} onChangeText={value=>change('satScore',value)} keyboardType="numeric" />
            <Field label="TOEFL iBT (0 a 120)" value={draft.toeflScore} onChangeText={value=>change('toeflScore',value)} keyboardType="numeric" />
            <Field label="IELTS (0 a 9, passos de 0,5)" value={draft.ieltsScore} onChangeText={value=>change('ieltsScore',value)} keyboardType="decimal-pad" />
            <Text style={styles.help}>O GPA informado aqui é diferente das três estimativas que você pode guardar na calculadora.</Text>
            <Action label="Abrir calculadora de GPA" secondary onPress={()=>router.push('/gpa')} /></Panel>
          <Panel><ChoiceGroup title="Exames feitos ou planejados" hint="Confira quais provas cada curso aceita.">
            {exams.map(value=><Choice key={value} label={value} selected={draft.plannedExams.includes(value)}
              onPress={()=>toggleList('plannedExams',value)} />)}</ChoiceGroup></Panel>
        </>}
        {tab==='goals'&&<>
          <Panel><Text style={styles.heading}>Metas de intercâmbio</Text>
            <Text style={styles.body}>Destino: {destinationName} · Nível: {levelName(draft.studyLevel)} · Área: {draft.interestArea||'A escolher'}</Text></Panel>
          <Panel><ChoiceGroup title={`Destinos de interesse (${draft.destinationSlugs.length} de 3)`} hint="Escolha até três. O primeiro será seu destino principal.">
            {COUNTRY_GUIDES.map(country=><Choice key={country.slug} label={country.name}
              selected={draft.destinationSlugs.includes(country.slug)}
              disabled={draft.destinationSlugs.length>=3&&!draft.destinationSlugs.includes(country.slug)}
              onPress={()=>toggleDestination(country.slug)} />)}</ChoiceGroup></Panel>
          <Panel><ChoiceGroup title="O que você quer fazer?">{studyLevels.map(([value,label])=><Choice key={value} label={label}
            selected={draft.studyLevel===value} onPress={()=>change('studyLevel',draft.studyLevel===value?'':value)} />)}</ChoiceGroup></Panel>
          <Panel><ChoiceGroup title="Área de interesse">{areas.map(value=><Choice key={value} label={value}
            selected={draft.interestArea===value} onPress={()=>change('interestArea',draft.interestArea===value?'':value)} />)}</ChoiceGroup>
            <Field label="Outra área ou especialidade" value={areas.includes(draft.interestArea)?'':draft.interestArea}
              onChangeText={value=>change('interestArea',value)} placeholder="Ex.: Ciência de dados" maxLength={100} /></Panel>
          <Panel><ChoiceGroup title="Quando pretende ir?">{targetYears.map(([value,label])=><Choice key={value} label={label}
            selected={draft.targetYear===value} onPress={()=>change('targetYear',draft.targetYear===value?'':value)} />)}</ChoiceGroup></Panel>
        </>}
        <View style={styles.saveArea}><Action label={busy?'Salvando…':'Salvar perfil'} disabled={busy||!dirty} onPress={()=>{void save()}} />
          <Text style={styles.help}>Os dados são salvos na sua conta e aparecem também no site.</Text></View>
      </>}
    </>}
  </Screen>
}

const styles=StyleSheet.create({
  body:{color:theme.muted,fontSize:12,lineHeight:19},heading:{color:theme.navy,fontSize:17,fontWeight:'800'},
  summary:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:theme.white,borderColor:theme.border,borderWidth:1.5,borderRadius:18,padding:14,marginBottom:13},
  summaryIcon:{width:50,height:50,borderRadius:25,backgroundColor:theme.pale,alignItems:'center',justifyContent:'center'},
  summaryName:{color:theme.navy,fontSize:16,fontWeight:'800'},summaryLine:{color:theme.muted,fontSize:11,marginTop:3},
  tabs:{flexDirection:'row',gap:6,marginBottom:12},tab:{flex:1,paddingVertical:11,borderRadius:13,backgroundColor:theme.white,borderColor:theme.border,borderWidth:1,alignItems:'center'},
  tabActive:{backgroundColor:theme.blue,borderColor:theme.blue},tabText:{color:theme.navy,fontSize:11,fontWeight:'800'},tabTextActive:{color:theme.white},
  group:{gap:8},groupTitle:{color:theme.navy,fontSize:13,fontWeight:'800'},help:{color:theme.muted,fontSize:11,lineHeight:17},
  choices:{flexDirection:'row',flexWrap:'wrap',gap:7},choice:{borderRadius:99,paddingHorizontal:12,paddingVertical:8,backgroundColor:theme.white,borderColor:theme.border,borderWidth:1.5},
  choiceSelected:{backgroundColor:theme.blue,borderColor:theme.blue},choiceDisabled:{opacity:.4},choiceText:{color:theme.navy,fontSize:11,fontWeight:'700'},choiceTextSelected:{color:theme.white},
  row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},link:{color:theme.blue,fontSize:12,fontWeight:'800'},
  saveArea:{gap:8,marginTop:2,marginBottom:20},
})
