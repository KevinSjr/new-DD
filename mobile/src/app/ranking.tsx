import { useEffect, useMemo, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { api } from '../api'
import { Action, Field, Notice, Panel, Pill } from '../components/Controls'
import { Screen } from '../components/Screen'
import { SUBJECT_AREAS } from '../data/subjectAreas'
import { isRankingKey, rankingDataset, rankingScore, rankingTitle, type RankingEntry, type RankingKey } from '../rankings/data'
import { useSession } from '../session'
import { theme } from '../theme'

const PAGE_SIZE=20
const regionNames:Record<string,string>={Africa:'África',Americas:'Américas',Asia:'Ásia',Europe:'Europa',Oceania:'Oceania'}
const weightNames:Record<string,string>={academic:'Reputação acadêmica',employer:'Reputação entre empregadores',citations_per_paper:'Citações por artigo',h_index:'Índice H',international_research_network:'Rede internacional de pesquisa'}
const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim()
const scoreText=(value:number|null|undefined)=>value==null?'Não exibida':new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(value)
type Sort='rank'|'name'|'score'

export default function RankingPage(){
  const params=useLocalSearchParams<{area?:string}>()
  const key:RankingKey=isRankingKey(String(params.area||''))?params.area as RankingKey:'general'
  const {token}=useSession()
  const [search,setSearch]=useState('')
  const [country,setCountry]=useState('')
  const [region,setRegion]=useState('')
  const [sort,setSort]=useState<Sort>('rank')
  const [reverse,setReverse]=useState(false)
  const [page,setPage]=useState(1)
  const [showCountries,setShowCountries]=useState(false)
  const [showSubjects,setShowSubjects]=useState(false)
  const result=useMemo(()=>{try{return {data:rankingDataset(key),error:''}}catch(cause){return {data:null,error:cause instanceof Error?cause.message:'Ranking indisponível.'}}},[key])
  const data=result.data
  const countries=useMemo(()=>[...new Set(data?.universities.map(item=>item.location)||[])].sort((a,b)=>a.localeCompare(b,'pt-BR')),[data])
  const regions=useMemo(()=>[...new Set(data?.universities.map(item=>item.region).filter((item):item is string=>!!item)||[])],[data])
  const filtered=useMemo(()=>{
    const term=normalize(search)
    const entries=(data?.universities||[]).filter(item=>(!country||item.location===country)&&(!region||item.region===region)&&(!term||normalize(item.university).includes(term)))
    entries.sort((a,b)=>{
      if(sort==='name')return (reverse?-1:1)*(a.university.localeCompare(b.university,'pt-BR')||a.index-b.index)
      if(sort==='score'){
        const av=rankingScore(key,a),bv=rankingScore(key,b)
        if(av==null)return bv==null?a.index-b.index:1
        if(bv==null)return -1
        return (reverse?1:-1)*(av-bv)||a.index-b.index
      }
      return (reverse?-1:1)*(a.index-b.index)
    })
    return entries
  },[data,key,search,country,region,sort,reverse])
  const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE))
  const visible=filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE)
  const clear=()=>{setSearch('');setCountry('');setRegion('');setSort('rank');setReverse(false);setPage(1)}
  const event=(kind:string,target:string,details:object)=>{if(token)void api('/api/account/achievements/events',{method:'POST',token,body:{kind,target,details}}).catch(()=>{})}
  useEffect(()=>{if(data)event('rank-view',key,{scope:key})},[data,key,token])
  useEffect(()=>{if(data)event('rank-page',`${key}:${page}`,{scope:key})},[data,key,page,token])
  useEffect(()=>{if(!data||(!country&&!region&&search.trim().length<2))return
    const timer=setTimeout(()=>event('rank-filter',[key,country,region,search.trim().length>=2?'query':''].join('|'),
      {scope:key,country,filterCount:Number(!!country)+Number(!!region)+Number(search.trim().length>=2)}),500)
    return()=>clearTimeout(timer)
  },[data,key,country,region,search,token])
  const title=rankingTitle(key)
  return <Screen key={`${key}-${page}`} navTitle="Rankings" eyebrow={`QS · EDIÇÃO ${key==='general'?'2027':'2026'}`} title={title}
    description={key==='general'?'Explore as primeiras 1.000 universidades da planilha QS.':'Compare instituições no ranking desta área ampla de estudo.'}>
    {result.error?<Notice error>{result.error}</Notice>:<>
      <Panel><Text style={styles.heading}>Filtrar resultados</Text>
        <Field label="Buscar universidade" value={search} onChangeText={value=>{setSearch(value);setPage(1)}} placeholder="Nome da instituição" />
        <Text style={styles.label}>País ou território</Text>
        <Action label={country||'Todos os países'} secondary onPress={()=>setShowCountries(!showCountries)} />
        {showCountries&&<ScrollView nestedScrollEnabled style={styles.countries}>
          <Action label="Todos os países" secondary onPress={()=>{setCountry('');setPage(1);setShowCountries(false)}} />
          {countries.map(name=><Action key={name} label={name} secondary onPress={()=>{setCountry(name);setPage(1);setShowCountries(false)}} />)}
        </ScrollView>}
        {key==='general'&&<><Text style={styles.label}>Região</Text><View style={styles.chips}>
          {[{value:'',label:'Todas'},...regions.map(value=>({value,label:regionNames[value]||value}))].map(item=><Pressable key={item.value}
            accessibilityRole="button" accessibilityState={{selected:region===item.value}} onPress={()=>{setRegion(item.value);setPage(1)}}
            style={[styles.chip,region===item.value&&styles.active]}><Text style={[styles.chipText,region===item.value&&styles.activeText]}>{item.label}</Text></Pressable>)}
        </View></>}
        <Text style={styles.label}>Ordenar por</Text><View style={styles.chips}>{([{value:'rank',label:'Posição'},{value:'name',label:'Nome'},{value:'score',label:'Pontuação'}] as {value:Sort;label:string}[]).map(item=><Pressable key={item.value}
          accessibilityRole="button" accessibilityState={{selected:sort===item.value}} onPress={()=>{setSort(item.value);setPage(1)}}
          style={[styles.chip,sort===item.value&&styles.active]}><Text style={[styles.chipText,sort===item.value&&styles.activeText]}>{item.label}</Text></Pressable>)}</View>
        <View style={styles.row}><View style={styles.flex}><Action label={reverse?'Ordem inversa ✓':'Inverter ordem'} secondary onPress={()=>{setReverse(!reverse);setPage(1)}} /></View>
          <View style={styles.flex}><Action label="Limpar filtros" secondary onPress={clear} /></View></View>
      </Panel>
      <Text style={styles.heading}>{filtered.length} {filtered.length===1?'instituição':'instituições'}</Text>
      {filtered.length===0?<Panel><Notice>Nenhuma universidade encontrada. Tente outro nome ou país.</Notice><Action label="Ver todas" onPress={clear} /></Panel>:visible.map((item:RankingEntry)=><Panel key={item.index}>
        <View style={styles.cardTop}><View style={styles.rank}><Text style={styles.rankText}>{item.rank}</Text></View>
          <View style={styles.flex}><Text style={styles.university}>{item.university}</Text><Text style={styles.location}>{item.location}{item.region?' · '+(regionNames[item.region]||item.region):''}</Text></View></View>
        <Text style={styles.score}>{key==='general'?'Pontuação geral':'Pontuação da área'}: {scoreText(rankingScore(key,item))}</Text>
      </Panel>)}
      {filtered.length>PAGE_SIZE&&<View style={styles.row}><View style={styles.flex}><Action label="Anterior" secondary disabled={page===1} onPress={()=>setPage(page-1)} /></View>
        <View style={styles.page}><Text style={styles.pageText}>{page}/{pages}</Text></View>
        <View style={styles.flex}><Action label="Próxima" secondary disabled={page===pages} onPress={()=>setPage(page+1)} /></View></View>}
      {key!=='general'&&<Panel><Text style={styles.heading}>Disciplinas desta área</Text>
        <Text style={styles.body}>Esta lista classifica a área ampla. Os links abaixo levam aos rankings específicos publicados pela QS.</Text>
        <Action label={showSubjects?'Ocultar disciplinas':`Ver ${SUBJECT_AREAS[key].subjects.length} disciplinas`} secondary onPress={()=>setShowSubjects(!showSubjects)} />
        {showSubjects&&SUBJECT_AREAS[key].subjects.map(item=><Pressable key={item.name} accessibilityRole="link" onPress={()=>{void Linking.openURL(item.url)}}>
          <Text style={styles.link}>{item.name}  ↗</Text></Pressable>)}
      </Panel>}
      <Panel><Text style={styles.heading}>Fonte e metodologia</Text>
        <Text style={styles.body}>Fonte: {data?.source_file}. Edição {data?.edition}. Empates e faixas de posição foram preservados; pontuações não exibidas aparecem como tal.</Text>
        <Text style={styles.body}>{key==='general'?'Esta seleção reúne 1.000 instituições. A fonte não informa a cidade.':`${SUBJECT_AREAS[key].missingScores} instituições nesta área não têm pontuação exibida.`}</Text>
        {key!=='general'&&data?.methodology_weights&&Object.entries(data.methodology_weights).map(([name,weight])=><Text key={name} style={styles.body}>{weightNames[name]||name}: {new Intl.NumberFormat('pt-BR',{style:'percent',maximumFractionDigits:1}).format(weight)}</Text>)}
        <Notice>O ranking não indica elegibilidade, qualidade de um curso específico ou chance de admissão.</Notice>
        <Text style={styles.credit}>{data?.attribution||'Source: QS Quacquarelli Symonds (www.topuniversities.com). Copyright © 2026 QS Quacquarelli Symonds Ltd.'}</Text>
        <Action label="Ver ranking na QS  ↗" secondary onPress={()=>{void Linking.openURL(data!.source_url)}} />
        <Action label="Direitos sobre os dados  ↗" secondary onPress={()=>{void Linking.openURL('https://www.topuniversities.com/data-copyright')}} />
      </Panel>
    </>}
  </Screen>
}
const styles=StyleSheet.create({heading:{color:theme.navy,fontSize:17,fontWeight:'800',marginBottom:5},label:{color:theme.navy,fontSize:12,fontWeight:'800',marginTop:5},
  chips:{flexDirection:'row',flexWrap:'wrap',gap:6},chip:{borderRadius:99,borderWidth:1.5,borderColor:theme.border,backgroundColor:theme.white,paddingHorizontal:11,paddingVertical:8},active:{backgroundColor:theme.blue,borderColor:theme.blue},
  chipText:{color:theme.navy,fontSize:11,fontWeight:'700'},activeText:{color:theme.white},countries:{maxHeight:190},row:{flexDirection:'row',alignItems:'center',gap:7},flex:{flex:1},
  cardTop:{flexDirection:'row',alignItems:'flex-start',gap:11},rank:{minWidth:47,minHeight:38,paddingHorizontal:5,borderRadius:12,backgroundColor:theme.pale,alignItems:'center',justifyContent:'center'},rankText:{color:theme.blue,fontSize:13,fontWeight:'800'},
  university:{color:theme.navy,fontSize:14,fontWeight:'800'},location:{color:theme.muted,fontSize:11,marginTop:4},score:{color:theme.blue,fontSize:12,fontWeight:'700'},page:{minWidth:40,alignItems:'center'},pageText:{color:theme.navy,fontSize:12,fontWeight:'800'},
  body:{color:theme.muted,fontSize:12,lineHeight:18},link:{color:theme.blue,fontSize:12,fontWeight:'800',paddingVertical:6},credit:{color:theme.muted,fontSize:10,lineHeight:16}})
