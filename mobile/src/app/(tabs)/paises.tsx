import { useMemo, useState } from 'react'
import { router, type Href } from 'expo-router'
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { COUNTRY_GUIDES } from '../../data/countries'
import type { CountryGuide } from '../../types/country'
import { guideFor, MOBILE_GUIDES } from '../../guides'
import { AppIcon } from '../../components/AppIcon'
import { Notice } from '../../components/Controls'
import { Screen } from '../../components/Screen'
import { theme } from '../../theme'

const americas=new Set(['canada','estados-unidos'])
const oceania=new Set(['australia','nova-zelandia'])
const asia=new Set(['china','coreia-do-sul','hong-kong','japao','malasia','singapura','taiwan'])
const regionOf=(slug:string)=>americas.has(slug)?'América':oceania.has(slug)?'Oceania':asia.has(slug)?'Ásia':'Europa'
const regions=['Todos','América','Europa','Ásia','Oceania']
const featured=['estados-unidos','canada','reino-unido','alemanha','franca']
const go=(slug:string)=>router.push(`/guia/${slug}` as Href)

function CountryCard({country}:{country:CountryGuide}) {
  const image=guideFor(country.slug)?.image
  return <Pressable accessibilityRole="button" accessibilityLabel={'Abrir guia de '+country.name}
    onPress={()=>go(country.slug)}
    style={({pressed})=>[styles.card,pressed && {opacity:.75}]}>
    {image&&<Image source={image} style={styles.cardImage} resizeMode="cover" accessibilityLabel={`Ilustração de ${country.name}`} />}
    <View style={styles.cardBody}><Text style={styles.cardName} numberOfLines={2}>{country.name}</Text>
      <Text style={styles.cardAction}>Abrir guia  →</Text></View>
  </Pressable>
}

export default function Countries() {
  const countries=COUNTRY_GUIDES
  const [query,setQuery]=useState('')
  const [region,setRegion]=useState('Todos')
  const filtered=useMemo(()=>countries.filter(country=>
    (region==='Todos'||regionOf(country.slug)===region) &&
    country.name.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR'))
  ),[countries,query,region])
  const featuredCountries=filtered.filter(country=>featured.includes(country.slug)).sort((a,b)=>featured.indexOf(a.slug)-featured.indexOf(b.slug))
  const moreGuides=filtered.filter(country=>!featured.includes(country.slug))
  const reveal=!!query.trim()||region!=='Todos'
  return <Screen navTitle="Países" title="Explore o mundo" description="Conheça os destinos e leia os guias disponíveis no aplicativo.">
    <View style={styles.finder}><View style={{flex:1}}><Text style={styles.finderTitle}>Ainda não sabe para onde ir?</Text>
      <Text style={styles.finderText}>Responda ao Descobridor de Mundos e compare destinos.</Text></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Abrir Descobridor de Mundos" onPress={()=>router.push('/descobridor')}
        style={styles.finderButton}><AppIcon name="chevron" color={theme.white} size={18} /></Pressable></View>
    <View style={styles.search}><AppIcon name="search" color={theme.blue} size={20} />
      <TextInput value={query} onChangeText={setQuery} placeholder="Buscar por país..." placeholderTextColor="#8a9ab8"
        accessibilityLabel="Buscar por país" style={styles.searchInput} /></View>
    <View style={styles.filters}>{regions.map(value=><Pressable key={value} accessibilityRole="button"
      accessibilityState={{selected:region===value}} onPress={()=>setRegion(value)}
      style={[styles.chip,region===value && styles.chipActive]}>
      <Text style={[styles.chipText,region===value && styles.chipTextActive]}>{value}</Text></Pressable>)}</View>
    {filtered.length===0&&<Notice>Nenhum país encontrado. Tente outro nome ou região.</Notice>}
    {filtered.length>0&&<>
      {featuredCountries.length>0&&<><Text style={styles.sectionTitle}>{reveal?'Destinos encontrados':'Guias para começar'}</Text>
        <View style={styles.grid}>{featuredCountries.map(country=><CountryCard key={country.slug} country={country} />)}</View></>}
      {moreGuides.length>0&&<>
        <Text style={styles.sectionTitle}>Mais guias disponíveis</Text>
        <View style={styles.grid}>{moreGuides.map(country=><CountryCard key={country.slug} country={country} />)}</View>
      </>}
      <Text style={styles.count}>{MOBILE_GUIDES.length} guias disponíveis no app · {countries.length} destinos na plataforma</Text>
    </>}
    <View style={styles.note}><AppIcon name="shield" color={theme.blue} size={18} /><Text style={styles.noteText}>Confira as fontes e datas de cada tema antes de tomar decisões sobre estudos e candidatura.</Text></View>
  </Screen>
}

const styles=StyleSheet.create({
  finder:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:theme.pale,borderRadius:17,padding:13,marginBottom:13},
  finderTitle:{color:theme.navy,fontSize:13,fontWeight:'800'},finderText:{color:theme.muted,fontSize:11,lineHeight:16,marginTop:3},
  finderButton:{width:31,height:31,borderRadius:16,backgroundColor:theme.blue,alignItems:'center',justifyContent:'center'},
  search:{height:47,backgroundColor:theme.white,borderRadius:23,borderWidth:1.5,borderColor:theme.border,flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:14},
  searchInput:{flex:1,color:theme.navy,fontSize:13,height:'100%'},
  filters:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:11},
  chip:{paddingHorizontal:12,paddingVertical:7,borderRadius:99,borderWidth:1,borderColor:theme.border,backgroundColor:theme.white},
  chipActive:{backgroundColor:theme.blue,borderColor:theme.blue},chipText:{color:theme.navy,fontSize:11,fontWeight:'800'},
  chipTextActive:{color:theme.white},sectionTitle:{color:theme.navy,fontSize:17,fontWeight:'800',marginTop:18,marginBottom:10},
  grid:{flexDirection:'row',flexWrap:'wrap',gap:9,marginBottom:10},
  card:{width:'48.5%',backgroundColor:theme.white,borderRadius:16,borderWidth:1.5,borderColor:theme.border,overflow:'hidden',shadowColor:theme.shadow,shadowOpacity:.06,shadowRadius:7,elevation:2},
  cardImage:{width:'100%',height:105},cardBody:{paddingHorizontal:9,paddingVertical:8,minHeight:55},
  cardName:{color:theme.navy,fontSize:12,fontWeight:'800'},cardAction:{color:theme.blue,fontSize:10,fontWeight:'800',marginTop:4},
  count:{color:theme.muted,fontSize:11,textAlign:'center',marginTop:7},
  note:{flexDirection:'row',gap:9,backgroundColor:theme.pale,borderRadius:16,padding:13,marginTop:19},
  noteText:{flex:1,color:theme.muted,fontSize:11,lineHeight:17},
})
