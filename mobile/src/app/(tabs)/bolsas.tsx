import { useCallback, useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { api, type Country, type SavedScholarship, type Scholarship } from '../../api'
import { AppIcon } from '../../components/AppIcon'
import { Action, Field, Notice, Panel, Pill } from '../../components/Controls'
import { Screen } from '../../components/Screen'
import { useSession } from '../../session'
import { theme } from '../../theme'

type Filters={country:string;level:string;area:string;deadline:string;criteria:string}
const empty:Filters={country:'',level:'',area:'',deadline:'',criteria:''}
const levels=[['','Todos'],['undergraduate','Graduação'],['postgraduate','Pós-graduação'],['doctoral','Doutorado'],['other','Outros'],['unknown','Não informado']]
const areas=[['','Todas'],['engineering','Engenharia e tecnologia'],['arts','Artes e humanas'],['health','Saúde e vida'],['natural','Ciências naturais'],['social','Sociais e gestão'],['unknown','Não informada']]
const deadlines=[['','Todos'],['upcoming','Prazo futuro'],['past','Prazo passado'],['undated','Sem data confirmada']]
const criteria=[['','Todos'],['mentioned','Brasil mencionado'],['broad','Internacional amplo'],['not-listed','Brasil não listado'],['unknown','Não confirmado']]
const keyOf=(item:{source:string;source_id:string})=>item.source+':'+item.source_id
type FilterFocus=keyof Filters|'all'
const filterNames:Record<keyof Filters,string>={country:'País',level:'Nível',area:'Área',deadline:'Prazo',criteria:'Critérios'}
const filterOptions:Partial<Record<keyof Filters,string[][]>>={level:levels,area:areas,deadline:deadlines,criteria}

function Chips({options,value,onChange}:{options:string[][];value:string;onChange:(value:string)=>void}) {
  return <View style={styles.chips}>{options.map(([key,label])=><Pressable key={key} accessibilityRole="button"
    accessibilityState={{selected:value===key}} onPress={()=>onChange(key)}
    style={[styles.chip,value===key&&styles.chipActive]}><Text style={[styles.chipText,value===key&&styles.chipTextActive]}>{label}</Text></Pressable>)}</View>
}

export default function Scholarships() {
  const params=useLocalSearchParams<{country?:string;view?:string}>()
  const countryParam=typeof params.country==='string'?params.country:''
  const {token}=useSession()
  const [items,setItems]=useState<Scholarship[]>([])
  const [saved,setSaved]=useState<SavedScholarship[]>([])
  const [countries,setCountries]=useState<Country[]>([])
  const [total,setTotal]=useState(0)
  const [page,setPage]=useState(1)
  const [query,setQuery]=useState('')
  const [search,setSearch]=useState('')
  const [filters,setFilters]=useState<Filters>({...empty,country:countryParam})
  const [applied,setApplied]=useState<Filters>({...empty,country:countryParam})
  const [showFilters,setShowFilters]=useState(false)
  const [filterFocus,setFilterFocus]=useState<FilterFocus>('all')
  const [showCountries,setShowCountries]=useState(false)
  const [showSaved,setShowSaved]=useState(params.view==='saved')
  const [expanded,setExpanded]=useState<string[]>([])
  const [loading,setLoading]=useState(true)
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')
  const [savedError,setSavedError]=useState('')
  const requestId=useRef(0)
  useEffect(()=>{setFilters(previous=>({...previous,country:countryParam}));setApplied(previous=>({...previous,country:countryParam}));setPage(1)},[countryParam])
  useEffect(()=>{if(params.view==='saved')setShowSaved(true)},[params.view])
  useEffect(()=>{void api<Country[]>('/api/countries').then(setCountries).catch(()=>{})},[])
  const load=useCallback(async()=>{
    const current=++requestId.current
    setLoading(true);setError('');setItems([]);setTotal(0)
    try{
      const q=new URLSearchParams({page:String(page)})
      if(search)q.set('q',search)
      for(const [key,value] of Object.entries(applied))if(value)q.set(key,value)
      const result=await api<{items:Scholarship[];total:number}>('/api/scholarship-catalog?'+q)
      if(current===requestId.current){setItems(result.items);setTotal(result.total)
        if(token)void api('/api/account/achievements/events',{method:'POST',token,body:{kind:'sch-search',
          target:[applied.country,applied.level,applied.area,applied.deadline,applied.criteria,search?'query':''].join('|')||'all',
          details:{...applied,query:Boolean(search)}}}).catch(()=>{})}
    }catch(cause){if(current===requestId.current)setError(cause instanceof Error?cause.message:'Não foi possível carregar as bolsas.')}
    finally{if(current===requestId.current)setLoading(false)}
  },[page,search,applied,token])
  const loadSaved=useCallback(async()=>{
    if(!token){setSaved([]);setSavedError('');return}
    setSavedError('')
    try{setSaved((await api<{items:SavedScholarship[]}>('/api/account/saved-scholarships',{token})).items)}
    catch{setSavedError('Não foi possível carregar suas bolsas salvas.')}
  },[token])
  useEffect(()=>{void load()},[load])
  useEffect(()=>{void loadSaved()},[loadSaved])
  const apply=()=>{setPage(1);setSearch(query.trim());setApplied({...filters});setShowFilters(false);setShowSaved(false)}
  const clear=()=>{setFilters({...empty});setApplied({...empty});setQuery('');setSearch('');setPage(1);setShowSaved(false);router.setParams({country:''})}
  const openFilter=(focus:FilterFocus)=>{setShowFilters(current=>focus===filterFocus?!current:true);setFilterFocus(focus);setShowSaved(false)}
  const toggleSave=async(item:{source:string;source_id:string})=>{
    if(!token){router.push('/conta');return}
    setBusy(keyOf(item));setError('');setSavedError('')
    try{
      const exists=saved.some(row=>keyOf(row)===keyOf(item))
      if(exists)await api('/api/account/saved-scholarships?'+new URLSearchParams({source:item.source,sourceId:item.source_id}),{method:'DELETE',token})
      else await api('/api/account/saved-scholarships',{method:'POST',token,body:{source:item.source,sourceId:item.source_id}})
      await loadSaved()
    }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível salvar a bolsa.')}
    finally{setBusy('')}
  }
  const openSource=(item:Scholarship)=>{
    if(token)void api('/api/account/achievements/events',{method:'POST',token,body:{kind:'sch-source',
      target:`${keyOf(item)}|${applied.criteria}|${applied.deadline}`,details:{scholarship:keyOf(item),criteria:applied.criteria,
        deadlineFilter:applied.deadline,hasDate:Boolean(item.deadline&&/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/.test(item.deadline))}}}).catch(()=>{})
    void Linking.openURL(item.source_url).catch(()=>setError('Não foi possível abrir a fonte.'))
  }
  const visible=showSaved?saved:items
  const activeCount=Object.values(applied).filter(Boolean).length+(search?1:0)
  return <Screen navTitle="Buscar oportunidades" title="Encontre sua oportunidade"
    description="Pesquise bolsas e confira os critérios na fonte original.">
    <View style={styles.searchPanel}><Field label="Nome da bolsa ou palavra-chave" value={query} onChangeText={setQuery}
      placeholder="Nome da bolsa ou área" /><Action label="Buscar oportunidades  →" onPress={apply} /></View>
    <View style={styles.quickFilters}>
      {(['country','level','area','deadline','criteria'] as (keyof Filters)[]).map(key=><Pressable key={key}
        style={[styles.filterChip,!!applied[key]&&styles.filterChipActive]} onPress={()=>openFilter(key)} accessibilityRole="button"
        accessibilityState={{expanded:showFilters&&filterFocus===key,selected:!!applied[key]}}>
        <Text style={[styles.filterChipText,!!applied[key]&&styles.filterChipTextActive]}>{filterNames[key]}{applied[key]?' ✓':''}  ▾</Text></Pressable>)}
      <Pressable style={styles.filterChip} onPress={()=>openFilter('all')} accessibilityRole="button" accessibilityState={{expanded:showFilters&&filterFocus==='all'}}>
        <Text style={styles.filterChipText}>{activeCount?'Todos ('+activeCount+')':'Todos os filtros'}  ▾</Text></Pressable>
    </View>
    {showFilters&&<Panel>
      <Text style={styles.filterTitle}>Filtrar resultados</Text>
      {(filterFocus==='all'||filterFocus==='country')&&<><Text style={styles.filterLabel}>País associado à listagem</Text>
      <Action label={filters.country?countries.find(item=>item.slug===filters.country)?.name||filters.country:'Todos os países'}
        secondary onPress={()=>setShowCountries(!showCountries)} />
      {showCountries&&<ScrollView style={styles.countryChoices} nestedScrollEnabled>
        <Action label="Todos os países" secondary onPress={()=>{setFilters({...filters,country:''});setShowCountries(false)}} />
        {countries.map(item=><Action key={item.slug} label={item.name} secondary onPress={()=>{setFilters({...filters,country:item.slug});setShowCountries(false)}} />)}
      </ScrollView>}</>}
      {(['level','area','deadline','criteria'] as (keyof Filters)[]).filter(key=>filterFocus==='all'||filterFocus===key).map(key=><View key={key}>
        <Text style={styles.filterLabel}>{key==='level'?'Nível de estudo':key==='criteria'?'Situação dos critérios':filterNames[key]}</Text>
        <Chips options={filterOptions[key]||[]} value={filters[key]} onChange={value=>setFilters(current=>({...current,[key]:value}))} />
      </View>)}
      {filterFocus==='deadline'&&<Notice>“Prazo futuro” usa apenas datas registradas como data no banco. Isso não confirma inscrições abertas.</Notice>}
      {filterFocus==='criteria'&&<Notice>Menção ao Brasil não confirma que você atende aos demais requisitos.</Notice>}
      <Action label="Aplicar filtros" onPress={apply} /><Action label="Limpar filtros" secondary onPress={clear} />
    </Panel>}
    {activeCount>0&&<View style={styles.activeCountry}><AppIcon name="search" color={theme.blue} size={16} />
      <Text style={styles.activeCountryText}>{[search&&`Busca: ${search}`,...(Object.keys(applied) as (keyof Filters)[]).map(key=>applied[key]&&`${filterNames[key]}: ${key==='country'?countries.find(item=>item.slug===applied[key])?.name||applied[key]:filterOptions[key]?.find(([value])=>value===applied[key])?.[1]||applied[key]}`)].filter(Boolean).join(' · ')}</Text>
      <Pressable onPress={clear} accessibilityRole="button" accessibilityLabel="Limpar filtros"><Text style={styles.clearText}>Limpar</Text></Pressable></View>}
    <View style={styles.segment}><View style={{flex:1}}><Action label="Resultados" secondary={showSaved} onPress={()=>setShowSaved(false)} /></View>
      <View style={{flex:1}}><Action label="Bolsas salvas" secondary={!showSaved} onPress={()=>{setShowSaved(true);void loadSaved()}} /></View></View>
    <View style={styles.resultsHeading}><Text style={styles.resultsTitle}>{showSaved?'Minhas bolsas':'Resultados'}</Text>
      {!showSaved&&!loading&&<Text style={styles.total}>({total})</Text>}</View>
    {!!error&&!showSaved&&<><Notice error>{error}</Notice><Action label="Tentar novamente" secondary onPress={()=>{void load()}} /></>}
    {!!savedError&&showSaved&&<><Notice error>{savedError}</Notice><Action label="Tentar novamente" secondary onPress={()=>{void loadSaved()}} /></>}
    {loading&&!showSaved&&<Notice>Carregando bolsas…</Notice>}
    {!loading&&!(showSaved?savedError:error)&&visible.length===0&&<Notice>{showSaved?'Você ainda não salvou bolsas.':'Nenhuma bolsa encontrada para esta busca.'}</Notice>}
    {visible.map(item=><Panel key={keyOf(item)}>
      <View style={styles.cardTop}><View style={styles.cardIcon}><AppIcon name="school" color={theme.blue} size={22} /></View>
        <View style={{flex:1}}><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.source}>{item.source_label}</Text></View>
        <AppIcon name="chevron" color={theme.blue} size={18} /></View>
      {'description' in item&&!!item.description&&<Text style={styles.description} numberOfLines={2}>{item.description}</Text>}
      {'destinations' in item&&!!item.destinations&&<Text style={styles.detail}>📍 {item.destinations}</Text>}
      {'study_level' in item&&!!item.study_level&&<Text style={styles.detail}>🎓 {item.study_level}</Text>}
      {'amount' in item&&!!item.amount&&<Text style={styles.detail}>Valor ou benefício divulgado: {item.amount}</Text>}
      {'deadline' in item&&<Text style={styles.detail}>Prazo: {item.deadline||'Não informado'}</Text>}
      {'brazil_criteria' in item&&<Text style={styles.criteria}>Critérios: {item.brazil_criteria}</Text>}
      {'source_status' in item&&<Text style={styles.detail}>{item.source_status}</Text>}
      {'field_of_study' in item&&<Action label={expanded.includes(keyOf(item))?'Ocultar detalhes':'Ver todos os detalhes'} secondary
        onPress={()=>setExpanded(current=>current.includes(keyOf(item))?current.filter(key=>key!==keyOf(item)):[...current,keyOf(item)])} />}
      {'field_of_study' in item&&expanded.includes(keyOf(item))&&<View style={styles.details}>
        <Text style={styles.detail}>Área listada: {item.field_of_study||'Não informada'}</Text>
        <Text style={styles.detail}>Nacionalidade listada: {item.nationality||'Não informada'}</Text>
        <Text style={styles.detail}>Destino listado: {item.destinations||'Não informado'}</Text>
        <Text style={styles.detail}>Nível de estudo: {item.study_level||'Não informado'}</Text>
        <Text style={styles.detail}>{item.country_basis}</Text>
        <Text style={styles.detail}>Fonte: {item.source_label}{item.observed_at?' · coletada em '+item.observed_at.slice(0,10).split('-').reverse().join('/') :''}</Text>
        <Notice>O valor divulgado pode não ser o valor total da bolsa. Confira prazo, requisitos e financiamento na fonte original.</Notice>
        {!!item.application_url&&<Action label="Consultar inscrição ou provedor  ↗" secondary onPress={()=>{void Linking.openURL(item.application_url!).catch(()=>setError('Não foi possível abrir a página.'))}} />}
      </View>}
      {'available' in item&&!item.available&&<Notice>Esta bolsa saiu do catálogo. Confira a fonte original.</Notice>}
      <View style={styles.cardActions}><View style={{flex:1}}><Action label="Ver fonte" secondary onPress={()=>{'field_of_study' in item?openSource(item):void Linking.openURL(item.source_url).catch(()=>setError('Não foi possível abrir a fonte.'))}} /></View>
        <View style={{flex:1}}><Action label={!token?'Entrar para salvar':saved.some(row=>keyOf(row)===keyOf(item))?'Remover salva':'Salvar bolsa'}
          disabled={busy===keyOf(item)} onPress={()=>{void toggleSave(item)}} /></View></View>
    </Panel>)}
    {!showSaved&&!loading&&total>12&&<View style={styles.pagination}>
      <View style={{flex:1}}><Action label="Anterior" secondary disabled={page===1} onPress={()=>setPage(page-1)} /></View>
      <Pill>{page} / {Math.ceil(total/12)}</Pill>
      <View style={{flex:1}}><Action label="Próxima" secondary disabled={page*12>=total} onPress={()=>setPage(page+1)} /></View>
    </View>}
    <View style={styles.info}><AppIcon name="shield" color={theme.blue} size={19} />
      <Text style={styles.infoText}>Listada no catálogo não significa inscrições abertas nem elegibilidade confirmada. Confira o edital na fonte.</Text></View>
  </Screen>
}

const styles=StyleSheet.create({
  searchPanel:{backgroundColor:theme.white,borderRadius:18,borderColor:theme.border,borderWidth:1.5,padding:13,marginBottom:10,gap:4},
  quickFilters:{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:13},
  filterChip:{borderRadius:99,backgroundColor:theme.white,borderWidth:1,borderColor:theme.border,paddingHorizontal:10,paddingVertical:7},
  filterChipActive:{backgroundColor:theme.blue,borderColor:theme.blue},filterChipTextActive:{color:theme.white},
  filterChipText:{color:theme.navy,fontSize:10,fontWeight:'800'},
  filterTitle:{color:theme.navy,fontSize:17,fontWeight:'800'},filterLabel:{color:theme.navy,fontSize:12,fontWeight:'800',marginTop:5},
  chips:{flexDirection:'row',flexWrap:'wrap',gap:6},chip:{paddingHorizontal:10,paddingVertical:7,borderRadius:99,borderWidth:1,borderColor:theme.border,backgroundColor:theme.white},
  chipActive:{backgroundColor:theme.blue,borderColor:theme.blue},chipText:{color:theme.navy,fontSize:11,fontWeight:'700'},
  chipTextActive:{color:theme.white},countryChoices:{maxHeight:175},
  activeCountry:{flexDirection:'row',alignItems:'center',gap:7,backgroundColor:theme.pale,borderRadius:13,padding:10,marginBottom:12},
  activeCountryText:{flex:1,color:theme.navy,fontSize:11,fontWeight:'700'},clearText:{color:theme.blue,fontSize:11,fontWeight:'800'},
  segment:{flexDirection:'row',gap:7,marginBottom:17},resultsHeading:{flexDirection:'row',alignItems:'center',gap:5,marginBottom:10},
  resultsTitle:{fontSize:18,color:theme.navy,fontWeight:'800'},total:{color:theme.blue,fontSize:13,fontWeight:'800'},
  cardTop:{flexDirection:'row',alignItems:'flex-start',gap:10},cardIcon:{width:37,height:37,borderRadius:12,backgroundColor:theme.pale,alignItems:'center',justifyContent:'center'},
  cardTitle:{color:theme.navy,fontSize:14,fontWeight:'800',lineHeight:19},
  source:{color:theme.muted,fontSize:11,marginTop:3},description:{color:theme.muted,fontSize:12,lineHeight:18},
  detail:{color:theme.muted,fontSize:11,lineHeight:17},criteria:{color:theme.navy,fontSize:11,lineHeight:17},details:{gap:5,backgroundColor:theme.pale,borderRadius:12,padding:10},
  cardActions:{flexDirection:'row',gap:8,marginTop:5},pagination:{flexDirection:'row',alignItems:'center',gap:8,marginTop:5,marginBottom:17},
  info:{flexDirection:'row',gap:9,backgroundColor:'#fff3d9',borderRadius:16,padding:13,marginTop:10},
  infoText:{flex:1,color:'#6c572e',fontSize:11,lineHeight:17},
})
