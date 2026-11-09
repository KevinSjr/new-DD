import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { api } from '../api'
import { AVATAR_FLAGS, AvatarPortrait, avatarForCharacter, defaultAvatar, type AvatarChoice } from '../components/AvatarPortrait'
import { AppIcon } from '../components/AppIcon'
import { Action, Field, Notice, Panel } from '../components/Controls'
import { Screen } from '../components/Screen'
import { useSession } from '../session'
import { theme } from '../theme'

type Tab='character'|'outfit'|'accessory'|'flag'
const tabs:{id:Tab;label:string}[]=[
  {id:'character',label:'Personagem'},{id:'outfit',label:'Roupas'},
  {id:'accessory',label:'Acessórios'},{id:'flag',label:'Bandeiras'},
]
const outfits:{id:AvatarChoice['outfit'];label:string;detail:string}[]=[
  {id:'hoodie',label:'Moletom',detail:'Azul Daydreaming'},
  {id:'shirt',label:'Camiseta',detail:'Rosa coral'},
  {id:'jacket',label:'Jaqueta',detail:'Verde oceano'},
]
const accessories:{id:AvatarChoice['accessory'];label:string}[]=[
  {id:'none',label:'Sem acessório'},{id:'glasses',label:'Óculos'},{id:'cap',label:'Boné'},
]
export default function AvatarScreen(){
  const {user,token,updateUser}=useSession()
  const {width}=useWindowDimensions()
  const thumbSize=Math.min(75,Math.floor((Math.min(width,680)-72)*.22))
  const [draft,setDraft]=useState<AvatarChoice>(user?.avatar||defaultAvatar)
  const [flagQuery,setFlagQuery]=useState('')
  const [tab,setTab]=useState<Tab>('character')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [savedXp,setSavedXp]=useState<number|null>(null)
  useEffect(()=>{if(user?.avatar)setDraft(user.avatar)},[user?.avatar])
  const change=<K extends keyof AvatarChoice>(key:K,value:AvatarChoice[K])=>{
    setDraft(current=>({...current,[key]:value}));setError('')
  }
  const visibleFlags=AVATAR_FLAGS.filter(item=>item.name.toLocaleLowerCase('pt-BR').includes(flagQuery.trim().toLocaleLowerCase('pt-BR')))
  async function save(){
    if(!token||busy)return
    setBusy(true);setError('')
    try{
      const result=await api<{avatar:AvatarChoice;earnedXp:number}>('/api/account/avatar',{method:'PUT',token,body:draft})
      if(user)updateUser({...user,avatar:result.avatar})
      setSavedXp(result.earnedXp)
    }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível salvar o avatar.')}
    finally{setBusy(false)}
  }
  if(savedXp!==null)return <Screen navTitle="Meu avatar" title="Avatar atualizado!" description="Seu personagem já aparece no seu perfil.">
    <View style={styles.success}><View style={styles.successPortrait}><AvatarPortrait avatar={draft} size={176} /></View>
      <Text style={styles.successTitle}>Seu perfil ficou com a sua cara.</Text>
      {savedXp>0?<View style={styles.reward}><AppIcon name="star" color={theme.yellow} size={28} />
        <Text style={styles.rewardText}>+{savedXp} XP pela primeira personalização</Text></View>
        :<Text style={styles.help}>Suas alterações foram salvas. O bônus de primeira personalização já havia sido recebido.</Text>}
      <Action label="Continuar" onPress={()=>router.replace('/conta')} /></View>
  </Screen>
  return <Screen navTitle="Meu avatar" title="Crie seu avatar" description="Escolha um personagem e personalize os detalhes. Você pode mudar depois.">
    {!token?<Panel><Text style={styles.help}>Entre na sua conta para guardar seu avatar.</Text>
      <Action label="Entrar na conta" onPress={()=>router.push('/conta')} /></Panel>:<>
      <View style={styles.preview}><AvatarPortrait avatar={draft} size={186} />
        <Text style={styles.previewName}>{user?.displayName}</Text>
        <Text style={styles.previewDetail}>Prévia do seu avatar</Text></View>
      <View style={styles.tabs}>{tabs.map(item=><Pressable key={item.id} accessibilityRole="tab"
        accessibilityState={{selected:tab===item.id}} onPress={()=>setTab(item.id)}
        style={[styles.tab,tab===item.id&&styles.tabActive]}>
        <Text style={[styles.tabText,tab===item.id&&styles.tabTextActive]}>{item.label}</Text></Pressable>)}</View>
      {tab==='character'&&<Panel><Text style={styles.heading}>Escolha seu personagem</Text>
        <View style={styles.characterGrid}>{Array.from({length:8},(_,index)=><Pressable key={index}
          accessibilityRole="radio" accessibilityLabel={`Personagem ${index+1}`}
          accessibilityState={{checked:draft.character===index+1}} onPress={()=>setDraft(avatarForCharacter(index+1,draft.style))}
          style={[styles.character,draft.character===index+1&&styles.selected]}>
          <AvatarPortrait avatar={avatarForCharacter(index+1,draft.style)} size={thumbSize} />
          {draft.character===index+1&&<View style={styles.check}><AppIcon name="check" color={theme.white} size={17} /></View>}
        </Pressable>)}</View>
      </Panel>}
      {tab==='outfit'&&<Panel><Text style={styles.heading}>Escolha uma roupa</Text>
        {outfits.map(item=><Pressable key={item.id} accessibilityRole="radio"
          accessibilityState={{checked:draft.outfit===item.id}} onPress={()=>change('outfit',item.id)}
          style={[styles.option,draft.outfit===item.id&&styles.optionSelected]}>
          <AvatarPortrait avatar={{...draft,outfit:item.id}} size={59} />
          <View style={{flex:1}}><Text style={styles.optionTitle}>{item.label}</Text><Text style={styles.help}>{item.detail}</Text></View>
          {draft.outfit===item.id&&<AppIcon name="check" color={theme.blue} size={21} />}</Pressable>)}
      </Panel>}
      {tab==='accessory'&&<Panel><Text style={styles.heading}>Escolha um acessório</Text>
        {accessories.map(item=><Pressable key={item.id} accessibilityRole="radio"
          accessibilityState={{checked:draft.accessory===item.id}} onPress={()=>change('accessory',item.id)}
          style={[styles.option,draft.accessory===item.id&&styles.optionSelected]}>
          <AvatarPortrait avatar={{...draft,accessory:item.id}} size={59} />
          <Text style={[styles.optionTitle,{flex:1}]}>{item.label}</Text>
          {draft.accessory===item.id&&<AppIcon name="check" color={theme.blue} size={21} />}</Pressable>)}
      </Panel>}
      {tab==='flag'&&<Panel><Text style={styles.heading}>Bandeira de fundo</Text>
        <Field label="Buscar país" value={flagQuery} onChangeText={setFlagQuery} placeholder="Ex.: Canadá" />
        {visibleFlags.length===0?<Text style={styles.help}>Nenhum país encontrado.</Text>:<View style={styles.flagGrid}>
          {visibleFlags.map(item=><Pressable key={item.id} accessibilityRole="radio"
            accessibilityLabel={`Bandeira de ${item.name}`} accessibilityState={{checked:draft.style===item.id}}
            onPress={()=>change('style',item.id)} style={[styles.flagChoice,draft.style===item.id&&styles.flagSelected]}>
            <Text style={styles.flagEmoji}>{item.flag}</Text><Text style={styles.flagName}>{item.name}</Text>
          </Pressable>)}</View>}
      </Panel>}
      {!!error&&<Notice error>{error}</Notice>}
      <Action label={busy?'Salvando…':'Salvar alterações'} disabled={busy} onPress={()=>{void save()}} />
      <Text style={styles.footerNote}>A primeira personalização concede 50 XP. Mudanças futuras não repetem o bônus.</Text>
    </>}
  </Screen>
}

const styles=StyleSheet.create({
  preview:{alignItems:'center',backgroundColor:'#eaf1ff',borderRadius:24,padding:17,marginBottom:13},
  previewName:{color:theme.navy,fontSize:17,fontWeight:'800',marginTop:7},previewDetail:{color:theme.muted,fontSize:11,marginTop:2},
  tabs:{flexDirection:'row',gap:5,marginBottom:13},tab:{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:10,
    paddingHorizontal:2,borderRadius:13,backgroundColor:theme.pale,minHeight:40},
  tabActive:{backgroundColor:theme.blue},tabText:{color:theme.navy,fontSize:10,fontWeight:'800',textAlign:'center'},tabTextActive:{color:theme.white},
  heading:{color:theme.navy,fontSize:15,fontWeight:'800',marginBottom:11},help:{color:theme.muted,fontSize:11,lineHeight:16},
  characterGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:8,marginBottom:20},
  character:{width:'23%',aspectRatio:1,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:theme.border,
    borderRadius:17,backgroundColor:theme.pale},selected:{borderColor:theme.blue,backgroundColor:theme.white},
  check:{position:'absolute',right:1,top:1,backgroundColor:theme.blue,borderRadius:13,width:22,height:22,alignItems:'center',justifyContent:'center'},
  option:{flexDirection:'row',alignItems:'center',gap:12,borderRadius:15,borderWidth:1.5,borderColor:theme.border,
    padding:8,marginBottom:8,backgroundColor:theme.white},optionSelected:{borderColor:theme.blue,backgroundColor:theme.pale},
  optionTitle:{color:theme.navy,fontSize:13,fontWeight:'800'},
  flagGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:8,marginTop:4},
  flagChoice:{width:'31%',minHeight:72,borderRadius:13,borderWidth:1.5,borderColor:theme.border,
    backgroundColor:theme.white,alignItems:'center',justifyContent:'center',padding:5},
  flagSelected:{borderColor:theme.blue,backgroundColor:theme.pale},
  flagEmoji:{fontSize:29,lineHeight:37},flagName:{color:theme.navy,fontSize:10,fontWeight:'800',textAlign:'center'},
  footerNote:{color:theme.muted,fontSize:11,textAlign:'center',lineHeight:16,marginTop:6},
  success:{alignItems:'center',gap:17,paddingTop:14},successPortrait:{padding:15,backgroundColor:theme.pale,borderRadius:120},
  successTitle:{color:theme.navy,fontSize:21,fontWeight:'800',textAlign:'center'},
  reward:{flexDirection:'row',alignItems:'center',gap:9,backgroundColor:theme.pale,padding:15,borderRadius:18},
  rewardText:{color:theme.navy,fontSize:14,fontWeight:'800',flexShrink:1},
})
