import { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { api } from '../../api'
import { AppIcon } from '../../components/AppIcon'
import { Action, Notice, Panel, Pill } from '../../components/Controls'
import { Screen } from '../../components/Screen'
import { guideFor, type GuideSource } from '../../guides'
import { useSession } from '../../session'
import { theme } from '../../theme'

const dateLabel=(iso:string)=>iso.split('-').reverse().join('/')
const topicEvent:Record<string,string>={custos:'costs',cultura:'culture',vida:'culture',comunidade:'culture',universidades:'student',
  candidatura:'student',calendario:'calendar',residencia:'visa',visto:'visa',trabalho:'work'}

export default function GuidePage(){
  const params=useLocalSearchParams<{slug?:string}>()
  const slug=typeof params.slug==='string'?params.slug:''
  const guide=guideFor(slug)
  const {token}=useSession()
  const [activeId,setActiveId]=useState('')
  const [visited,setVisited]=useState<string[]>([])
  const [linkError,setLinkError]=useState('')
  const sections=guide?.sections||[]
  const activeIndex=Math.max(0,sections.findIndex(item=>item.id===activeId))
  const active=sections[activeIndex]
  const dates=sections.flatMap(section=>section.blocks.flatMap(block=>block.source?[block.source.verifiedAt]:[])).sort()
  const lastDate=dates.at(-1)
  const stale=!!lastDate&&Date.now()-new Date(lastDate+'T00:00:00Z').getTime()>180*86400000
  const event=(kind:string,target:string,details:object={})=>{if(token)void api('/api/account/achievements/events',{method:'POST',token,body:{kind,target,details}}).catch(()=>{})}

  useEffect(()=>{setActiveId(sections[0]?.id||'');setVisited(sections[0]?[sections[0].id]:[]);if(guide)event('guide-view',guide.slug)},[slug,token])
  function selectSection(id:string){
    setActiveId(id);setVisited(current=>current.includes(id)?current:[...current,id])
    const mapped=topicEvent[id];if(mapped&&guide)event('guide-section',`${guide.slug}:${mapped}`)
  }
  function openSource(url:string,source=false){
    if(!/^https:\/\//i.test(url)){setLinkError('Este endereço não pôde ser aberto com segurança.');return}
    if(source&&guide)event('guide-source',guide.slug)
    void Linking.openURL(url).catch(()=>setLinkError('Não foi possível abrir a fonte. Tente novamente.'))
  }
  function showScholarships(){
    if(!guide)return
    event('guide-bolsas',guide.slug)
    router.push({pathname:'/bolsas',params:{country:guide.slug}})
  }
  if(!guide||!active)return <Screen navTitle="Guia de país" title="Guia indisponível" description="Este guia ainda não está disponível no aplicativo.">
    <Action label="Ver países com guia" onPress={()=>router.push('/paises')} /></Screen>
  return <Screen key={`${slug}-${active.id}`} navTitle="Guia de país" eyebrow={`DESTINO · ${guide.region.toUpperCase()}`} title={guide.name} description={guide.lead}>
    <Image source={guide.image} style={styles.hero} resizeMode="cover" accessibilityLabel={`Ilustração de ${guide.name}`} />
    <View style={styles.meta}><Pill>{guide.flag} Guia de destino</Pill><Text style={styles.metaText}>{lastDate?`Última conferência no site: ${dateLabel(lastDate)}`:'Consulte as fontes em cada tema'}</Text></View>
    <Notice>Regras de visto, trabalho, custos e prazos podem mudar. Cada informação abaixo indica sua fonte e a data da conferência quando disponível.{stale?' As fontes têm mais de seis meses; confira as regras atuais.':''}</Notice>
    <View style={styles.progress}><AppIcon name="globe" color={theme.blue} size={19} /><Text style={styles.progressText}>Você abriu {visited.length} de {sections.length} temas nesta visita.</Text></View>
    <Text style={styles.heading}>Escolha um tema</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs} accessibilityRole="tablist">
      {sections.map((section,index)=><Pressable key={section.id} accessibilityRole="tab" accessibilityState={{selected:active.id===section.id}}
        onPress={()=>selectSection(section.id)} style={[styles.tab,active.id===section.id&&styles.tabActive]}>
        <Text style={[styles.tabText,active.id===section.id&&styles.tabTextActive]}>{String(index+1).padStart(2,'0')} · {section.tab}</Text></Pressable>)}
    </ScrollView>
    <Panel><Text style={styles.kicker}>{active.kicker}</Text><Text style={styles.sectionTitle}>{active.title}</Text><Text style={styles.body}>{active.intro}</Text></Panel>
    {active.blocks.map((block,index)=><Panel key={`${active.id}-${index}`}>
      <Text style={styles.blockTitle}>{block.title}</Text><Text style={styles.body}>{block.text}</Text>
      {block.items?.map((item,itemIndex)=><Text key={itemIndex} style={styles.item}>• {item}</Text>)}
      {!!block.note&&<View style={styles.note}><Text style={styles.noteText}>{block.note}</Text></View>}
      {block.link&&<Pressable accessibilityRole="link" onPress={()=>openSource(block.link!.url,true)}><Text style={styles.link}>{block.link.label}  ↗</Text></Pressable>}
      {block.source?<SourceLine source={block.source} onOpen={()=>openSource(block.source!.url,true)} />:<Pill>Orientação geral</Pill>}
    </Panel>)}
    {!!linkError&&<Notice error>{linkError}</Notice>}
    <Notice>Requisitos finais e decisões cabem à instituição ou ao órgão responsável.</Notice>
    {activeIndex<sections.length-1&&<Action label={`Próximo tema: ${sections[activeIndex+1].tab}  →`} secondary onPress={()=>selectSection(sections[activeIndex+1].id)} />}
    <View style={styles.next}><Text style={styles.nextTitle}>Seu próximo passo</Text>
      <Text style={styles.body}>Escolha um curso, confira os requisitos oficiais e compare o orçamento com as opções de financiamento.</Text>
      <Action label={`Explorar bolsas associadas a ${guide.name}`} onPress={showScholarships} />
      <Text style={styles.disclaimer}>Estar na listagem do país não confirma o destino da bolsa nem sua elegibilidade. Consulte a fonte original.</Text>
    </View>
  </Screen>
}

function SourceLine({source,onOpen}:{source:GuideSource;onOpen:()=>void}){
  return <View style={styles.source}><Pill tone="green">Fonte</Pill><Pressable accessibilityRole="link" onPress={onOpen}>
    <Text style={styles.link}>{source.label}  ↗</Text></Pressable><Text style={styles.sourceDate}>Conferido em {dateLabel(source.verifiedAt)}</Text></View>
}
const styles=StyleSheet.create({hero:{height:190,width:'100%',borderRadius:18,marginBottom:10},
  meta:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:9,marginBottom:6},metaText:{color:theme.muted,fontSize:11},
  progress:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:theme.pale,borderRadius:13,padding:11,marginTop:10},progressText:{color:theme.navy,fontSize:12,fontWeight:'700',flex:1},
  heading:{color:theme.navy,fontSize:17,fontWeight:'800',marginTop:16,marginBottom:8},tabs:{gap:7,paddingBottom:10},tab:{paddingHorizontal:12,paddingVertical:9,borderRadius:99,backgroundColor:theme.white,borderWidth:1.5,borderColor:theme.border},
  tabActive:{backgroundColor:theme.blue,borderColor:theme.blue},tabText:{color:theme.navy,fontSize:12,fontWeight:'800'},tabTextActive:{color:theme.white},
  kicker:{color:theme.blue,fontSize:11,fontWeight:'800'},sectionTitle:{color:theme.navy,fontSize:20,fontWeight:'800'},body:{color:theme.muted,fontSize:13,lineHeight:20},blockTitle:{color:theme.navy,fontSize:15,fontWeight:'800'},
  item:{color:theme.ink,fontSize:12,lineHeight:19},note:{backgroundColor:'#fff4d9',padding:10,borderRadius:11},noteText:{color:'#695426',fontSize:12,lineHeight:18},
  source:{borderTopWidth:1,borderTopColor:theme.border,paddingTop:9,gap:4},sourceDate:{color:theme.muted,fontSize:11},link:{color:theme.blue,fontSize:12,fontWeight:'800',lineHeight:18},
  next:{marginTop:16,padding:15,backgroundColor:theme.pale,borderRadius:18,gap:9},nextTitle:{color:theme.navy,fontSize:17,fontWeight:'800'},disclaimer:{color:theme.muted,fontSize:11,lineHeight:17}})
