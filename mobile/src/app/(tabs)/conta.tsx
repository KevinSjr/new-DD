import { useCallback, useState } from 'react'
import { router, useFocusEffect, type Href } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { api } from '../../api'
import { AppIcon } from '../../components/AppIcon'
import { AvatarPortrait } from '../../components/AvatarPortrait'
import { Action, Field, Notice, Panel } from '../../components/Controls'
import { Screen } from '../../components/Screen'
import { useSession } from '../../session'
import { theme } from '../../theme'

type Progress={xp:number;level:number;streak:{current:number};achievements:{completed:boolean}[]}
type SavedGpa={bands:number;proportional:number;letters:number}
function MenuItem({icon,title,detail,onPress}:{icon:'trophy'|'bookmark'|'journey'|'document'|'school'|'person';title:string;detail?:string;onPress:()=>void}){
  return <Pressable accessibilityRole="button" onPress={onPress} style={({pressed})=>[styles.menuItem,pressed&&{opacity:.7}]}>
    <View style={styles.menuIcon}><AppIcon name={icon} color={theme.blue} size={20} /></View>
    <View style={{flex:1}}><Text style={styles.menuTitle}>{title}</Text>{detail&&<Text style={styles.menuDetail}>{detail}</Text>}</View>
    <AppIcon name="chevron" color={theme.blue} size={16} />
  </Pressable>
}
export default function Account(){
  const {user,token,loading,error:sessionError,refresh,signIn,register,signOut}=useSession()
  const [mode,setMode]=useState<'login'|'register'>('login')
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [progress,setProgress]=useState<Progress|null>(null)
  const [savedGpa,setSavedGpa]=useState<SavedGpa|null>(null)
  useFocusEffect(useCallback(()=>{
    if(!token){setProgress(null);setSavedGpa(null);return}
    let active=true
    api<Progress>('/api/account/missions',{token}).then(data=>{if(active)setProgress(data)}).catch(()=>{if(active)setProgress(null)})
    api<{estimate:SavedGpa|null}>('/api/account/gpa-estimates',{token}).then(data=>{if(active)setSavedGpa(data.estimate)}).catch(()=>{if(active)setSavedGpa(null)})
    return ()=>{active=false}
  },[token]))
  const submit=async()=>{
    setBusy(true);setError('')
    try{if(mode==='login')await signIn(email,password);else await register(name,email,password);setPassword('')}
    catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível entrar.')}
    finally{setBusy(false)}
  }
  const achievements=progress?.achievements.filter(item=>item.completed).length||0
  const initials=user?.displayName.trim().split(/\s+/).slice(0,2).map(part=>part[0]?.toUpperCase()).join('')||'?'
  return <Screen navTitle="Perfil" title={user?'Meu perfil':'Minha conta'}
    description={user?'Seu plano, seus favoritos e suas conquistas em um só lugar.':'Entre para guardar bolsas, prazos e documentos na sua conta.'}>
    {loading?<Notice>Carregando sua conta…</Notice>:sessionError?<Panel><Notice error>{sessionError}</Notice>
      <Action label="Tentar novamente" onPress={()=>{void refresh()}} /></Panel>:user?<View>
      <View style={styles.identity}><Pressable accessibilityRole="button" accessibilityLabel="Personalizar meu avatar" onPress={()=>router.push('/avatar' as Href)}
        style={styles.avatar}>{user.avatar?<AvatarPortrait avatar={user.avatar} size={72} />:<Text style={styles.initials}>{initials}</Text>}
        <View style={styles.editAvatar}><AppIcon name="edit" color={theme.white} size={13} /></View></Pressable>
        <Text style={styles.name}>{user.displayName}</Text><Text style={styles.email}>{user.email}</Text></View>
      <Pressable accessibilityRole="button" onPress={()=>router.push('/progresso')} style={styles.progress}>
        <View style={styles.progressIcon}><AppIcon name="star" color={theme.yellow} size={26} /></View>
        <View style={{flex:1}}><Text style={styles.progressTitle}>{progress?'Nível '+progress.level+' · Explorador':'Meu progresso'}</Text>
          <Text style={styles.progressDetail}>{progress?progress.xp+' XP · '+achievements+' conquistas · '+progress.streak.current+' dias seguidos':'Veja seu nível e conquistas'}</Text></View>
        <AppIcon name="chevron" color={theme.blue} size={18} />
      </Pressable>
      <Text style={styles.sectionTitle}>Minha jornada</Text>
      <View style={styles.menu}>
        <MenuItem icon="person" title="Meu avatar" detail="Personalize seu personagem" onPress={()=>router.push('/avatar' as Href)} />
        <MenuItem icon="person" title="Editar meu perfil" detail="Dados pessoais, acadêmicos e metas" onPress={()=>router.push('/perfil' as Href)} />
        <MenuItem icon="journey" title="Meu plano" detail="Prazos e próximos passos" onPress={()=>router.push('/jornada')} />
        <MenuItem icon="bookmark" title="Bolsas salvas" detail="Oportunidades que você guardou" onPress={()=>router.push({pathname:'/bolsas',params:{view:'saved'}})} />
        <MenuItem icon="document" title="Meus documentos" detail="Arquivos de candidatura" onPress={()=>router.push('/documentos')} />
        <MenuItem icon="school" title="Minhas notas de GPA" detail={savedGpa?'Três estimativas salvas':'Calcule e guarde suas estimativas'} onPress={()=>router.push('/gpa')} />
        <MenuItem icon="trophy" title="Conquistas e missões" detail="Acompanhe seu progresso" onPress={()=>router.push('/progresso')} />
      </View>
      <Action label="Sair da conta" secondary onPress={()=>{void signOut().catch(()=>setError('Não foi possível concluir a saída.'))}} />
    </View>:<Panel>
      <View style={styles.loginHeading}><View style={styles.loginIcon}><AppIcon name="person" color={theme.blue} size={26} /></View>
        <Text style={styles.loginTitle}>{mode==='login'?'Bem-vindo de volta':'Crie sua conta'}</Text></View>
      {mode==='register'&&<Field label="Nome" value={name} onChangeText={setName} placeholder="Como podemos chamar você?" />}
      <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="voce@exemplo.com" />
      <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <Action label={busy?'Aguarde…':mode==='login'?'Entrar':'Criar conta'} disabled={busy} onPress={()=>{void submit()}} />
      <Action label={mode==='login'?'Criar uma conta':'Já tenho uma conta'} secondary onPress={()=>{setError('');setMode(mode==='login'?'register':'login')}} />
    </Panel>}
    {!!error&&<Notice error>{error}</Notice>}
  </Screen>
}

const styles=StyleSheet.create({
  identity:{alignItems:'center',paddingVertical:9,marginBottom:16},
  avatar:{width:75,height:75,borderRadius:38,backgroundColor:'#d7ecff',borderWidth:3,borderColor:theme.white,
    shadowColor:theme.shadow,shadowOpacity:.12,shadowRadius:8,elevation:3,alignItems:'center',justifyContent:'center'},
  editAvatar:{position:'absolute',right:-5,bottom:0,width:25,height:25,borderRadius:13,backgroundColor:theme.blue,
    borderWidth:2,borderColor:theme.white,alignItems:'center',justifyContent:'center'},
  initials:{color:theme.blue,fontWeight:'800',fontSize:27},name:{color:theme.navy,fontSize:17,fontWeight:'800',marginTop:8},
  email:{color:theme.muted,fontSize:11,marginTop:3},
  progress:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:'#e4edff',borderColor:'#c9dbfc',borderWidth:1.5,
    borderRadius:17,padding:13,marginBottom:15},
  progressIcon:{width:39,height:39,borderRadius:13,backgroundColor:'#fff1c9',alignItems:'center',justifyContent:'center'},
  progressTitle:{color:theme.navy,fontSize:13,fontWeight:'800'},progressDetail:{color:theme.muted,fontSize:11,lineHeight:16,marginTop:2},
  sectionTitle:{color:theme.navy,fontSize:15,fontWeight:'800',marginBottom:9},
  menu:{backgroundColor:theme.white,borderColor:theme.border,borderWidth:1.5,borderRadius:18,overflow:'hidden',marginBottom:17},
  menuItem:{minHeight:61,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:13,paddingVertical:8,borderBottomWidth:1,borderBottomColor:theme.border},
  menuIcon:{width:34,height:34,borderRadius:10,backgroundColor:theme.pale,alignItems:'center',justifyContent:'center'},
  menuTitle:{color:theme.navy,fontSize:12,fontWeight:'800'},menuDetail:{color:theme.muted,fontSize:10,marginTop:2},
  loginHeading:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:8},
  loginIcon:{width:43,height:43,borderRadius:14,backgroundColor:theme.pale,alignItems:'center',justifyContent:'center'},
  loginTitle:{color:theme.navy,fontSize:17,fontWeight:'800'},
})
