import { useCallback, useRef, useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { Alert, Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { api } from '../api'
import { AppIcon } from '../components/AppIcon'
import { Action, Field, Notice, Panel, Pill } from '../components/Controls'
import { Screen } from '../components/Screen'
import { GPA_METHODS, calculateGpa, GpaInputError, type CourseInput, type GpaInput, type GpaResult } from '../gpa'
import { useSession } from '../session'
import { theme } from '../theme'

type CourseRow = CourseInput & { id:number }
type Calculated = { input:GpaInput; results:GpaResult[] }
type SavedEstimate = {
  bands:number; proportional:number; letters:number; sourceAverage:number
  inputMode:'average'|'courses'; weighted:boolean; passingGrade:number|null
  includeFailed:boolean|null; savedAt:string
}
const freshCourse = (id:number):CourseRow => ({ id,name:'',grade:'',credits:'' })
const format = (value:number) => value.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})

function Choice({ label, selected, onPress }: { label:string; selected:boolean; onPress:()=>void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{selected}} onPress={onPress}
    style={({pressed})=>[styles.choice,selected && styles.choiceSelected,pressed && {opacity:.75}]}>
    <Text style={[styles.choiceText,selected && styles.choiceTextSelected]}>{label}</Text>
  </Pressable>
}

export default function GpaCalculator() {
  const { token } = useSession()
  const [mode,setMode] = useState<'average'|'courses'>('average')
  const [average,setAverage] = useState('')
  const [courses,setCourses] = useState<CourseRow[]>([freshCourse(1)])
  const nextId = useRef(2)
  const gradeRefs = useRef(new Map<number,TextInput>())
  const [passingPreset,setPassingPreset] = useState('6')
  const [customPassing,setCustomPassing] = useState('')
  const [includeFailed,setIncludeFailed] = useState(true)
  const [methodId,setMethodId] = useState(GPA_METHODS[0].id)
  const [calculated,setCalculated] = useState<Calculated|null>(null)
  const [error,setError] = useState('')
  const [saved,setSaved] = useState<SavedEstimate|null>(null)
  const [savedLoading,setSavedLoading] = useState(false)
  const [saveBusy,setSaveBusy] = useState(false)
  const [saveMessage,setSaveMessage] = useState('')
  const [savedError,setSavedError] = useState('')

  const loadSaved = useCallback(async () => {
    if (!token) {setSaved(null);setSavedError('');return}
    setSavedLoading(true);setSavedError('')
    try {setSaved((await api<{estimate:SavedEstimate|null}>('/api/account/gpa-estimates',{token})).estimate)}
    catch (cause) {setSavedError(cause instanceof Error ? cause.message : 'Não foi possível carregar as estimativas salvas.')}
    finally {setSavedLoading(false)}
  },[token])
  useFocusEffect(useCallback(() => {void loadSaved()},[loadSaved]))

  const invalidate = () => {setCalculated(null);setError('');setSaveMessage('')}
  const updateCourse = (id:number,field:keyof CourseInput,value:string) => {
    setCourses(previous => previous.map(course => course.id === id ? {...course,[field]:value} : course))
    invalidate()
  }
  const addCourse = () => {
    const id = nextId.current++
    setCourses(previous => [...previous,freshCourse(id)])
    invalidate()
    setTimeout(() => gradeRefs.current.get(id)?.focus(), 50)
  }
  const removeCourse = (index:number) => {
    const target = courses[index + 1]?.id ?? courses[index - 1]?.id ?? courses[index].id
    if (courses.length === 1) setCourses([freshCourse(courses[0].id)])
    else setCourses(previous => previous.filter((_,position) => position !== index))
    invalidate()
    setTimeout(() => gradeRefs.current.get(target)?.focus(), 50)
  }
  const calculate = () => {
    const input:GpaInput = mode === 'average'
      ? {mode,average}
      : {mode,courses,passingGrade:passingPreset === 'custom' ? customPassing : passingPreset,includeFailed}
    try {
      const results = GPA_METHODS.map(method => calculateGpa(input,method))
      setCalculated({input,results});setError('');setSaveMessage('')
      if (token && results.every(result => result.gpa !== null)) {
        const weighted = mode === 'courses' && results[0].weighted
        void Promise.allSettled([
          api('/api/account/achievements/events',{method:'POST',token,body:{kind:'gpa-calculate',target:mode + ':' + (weighted ? 'weighted' : 'simple'),details:{mode,weighted}}}),
          api('/api/account/achievements/events',{method:'POST',token,body:{kind:'gpa-compare',target:'three-methods',details:{}}}),
        ])
      }
    } catch (cause) {
      setCalculated(null)
      setError(cause instanceof GpaInputError ? cause.message : 'Não foi possível calcular. Revise os valores.')
    }
  }
  const clear = () => {
    setMode('average');setAverage('');setCourses([freshCourse(nextId.current++)])
    setPassingPreset('6');setCustomPassing('');setIncludeFailed(true)
    setMethodId('bands');setCalculated(null);setError('');setSaveMessage('')
  }
  const save = async () => {
    if (!token || !calculated || calculated.results.some(result => result.gpa === null)) return
    const input = calculated.input
    setSaveBusy(true);setSaveMessage('')
    try {
      const result = await api<{estimate:SavedEstimate}>('/api/account/gpa-estimates',{
        method:'PUT',token,body:{
          bands:calculated.results[0].gpa,proportional:calculated.results[1].gpa,letters:calculated.results[2].gpa,
          sourceAverage:calculated.results[0].sourceAverage,inputMode:input.mode,weighted:calculated.results[0].weighted,
          passingGrade:input.mode === 'courses' ? Number(input.passingGrade.replace(',','.')) : null,
          includeFailed:input.mode === 'courses' ? input.includeFailed : null,
        },
      })
      setSaved(result.estimate);setSaveMessage('As três estimativas foram salvas na sua conta.')
    } catch (cause) {setSaveMessage(cause instanceof Error ? cause.message : 'Não foi possível salvar as estimativas.')}
    finally {setSaveBusy(false)}
  }
  const removeSaved = () => Alert.alert('Remover estimativas?','As três estimativas salvas serão excluídas da sua conta.',[
    {text:'Cancelar',style:'cancel'},
    {text:'Remover',style:'destructive',onPress:() => {
      if (!token) return
      setSaveBusy(true);setSavedError('')
      void api('/api/account/gpa-estimates',{method:'DELETE',token})
        .then(() => {setSaved(null);setSaveMessage('Estimativas removidas da sua conta.')})
        .catch(cause => setSavedError(cause instanceof Error ? cause.message : 'Não foi possível remover.'))
        .finally(() => setSaveBusy(false))
    }},
  ])
  const selectedIndex = GPA_METHODS.findIndex(method => method.id === methodId)
  const selectedMethod = GPA_METHODS[selectedIndex]
  const selectedResult = calculated?.results[selectedIndex]

  return <Screen navTitle="Calculadora GPA" hideHeading title="Calculadora de GPA" description="Converta suas notas brasileiras em uma estimativa na escala americana de 0 a 4,0.">
    <View style={styles.hero}>
      <Image source={require('../../assets/images/gpa-calculator.png')} style={styles.heroImage} resizeMode="contain" accessibilityLabel="Calculadora azul com capelo de formatura" />
      <Text style={styles.heroTitle}>Converta suas notas para o padrão internacional</Text>
      <Text style={styles.heroText}>Compare três métodos de estimativa antes de informar um GPA em sua candidatura.</Text>
    </View>
    <Panel>
      <Text style={styles.heading}>Como quer informar suas notas?</Text>
      <View style={styles.choices}>
        <Choice label="Só a média geral (CR)" selected={mode === 'average'} onPress={() => {setMode('average');invalidate()}} />
        <Choice label="Disciplina por disciplina" selected={mode === 'courses'} onPress={() => {setMode('courses');invalidate()}} />
      </View>
      {mode === 'average' ? <>
        <Field label="Média geral, de 0 a 10" value={average} onChangeText={value => {setAverage(value);invalidate()}} placeholder="Ex.: 8,5" keyboardType="decimal-pad" />
        <Text style={styles.help}>Sem as disciplinas, não podemos identificar reprovações nem ponderar por créditos.</Text>
      </> : <>
        <Text style={styles.subheading}>Disciplinas</Text>
        {courses.map((course,index) => <View key={course.id} style={styles.course}>
          <View style={styles.courseHeading}><Text style={styles.courseTitle}>Disciplina {index + 1}</Text><Pressable accessibilityRole="button" accessibilityLabel={'Remover disciplina ' + (index + 1)} onPress={() => removeCourse(index)}><Text style={styles.remove}>Remover</Text></Pressable></View>
          <Field label="Nome (opcional)" value={course.name} onChangeText={value => updateCourse(course.id,'name',value)} placeholder="Ex.: Matemática" />
          <Field label="Nota (0 a 10)" value={course.grade} onChangeText={value => updateCourse(course.id,'grade',value)} placeholder="Ex.: 8,5" keyboardType="decimal-pad" inputRef={instance => {if(instance) gradeRefs.current.set(course.id,instance);else gradeRefs.current.delete(course.id)}} />
          <Field label="Créditos ou horas (opcional)" value={course.credits} onChangeText={value => updateCourse(course.id,'credits',value)} placeholder="Ex.: 60" keyboardType="decimal-pad" />
        </View>)}
        <Action label="+ Adicionar disciplina" secondary onPress={addCourse} />
        <Text style={styles.help}>Sem créditos, usamos média simples. Se informar créditos em uma disciplina, preencha todas.</Text>
        <Text style={styles.subheading}>Nota mínima de aprovação</Text>
        <View style={styles.choices}>{['5','6','7','custom'].map(value => <Choice key={value} label={value === 'custom' ? 'Outra' : value + ',0'} selected={passingPreset === value} onPress={() => {setPassingPreset(value);invalidate()}} />)}</View>
        {passingPreset === 'custom' && <Field label="Nota mínima, de 0 a 10" value={customPassing} onChangeText={value => {setCustomPassing(value);invalidate()}} keyboardType="decimal-pad" />}
        <Text style={styles.subheading}>Disciplinas reprovadas</Text>
        <View style={styles.choices}><Choice label="Incluir" selected={includeFailed} onPress={() => {setIncludeFailed(true);invalidate()}} /><Choice label="Ignorar" selected={!includeFailed} onPress={() => {setIncludeFailed(false);invalidate()}} /></View>
        <Text style={styles.help}>Abaixo da nota mínima, a disciplina vale 0,0 ponto quando incluída. A universidade pode exigir o histórico completo.</Text>
      </>}
    </Panel>
    <Panel>
      <Text style={styles.heading}>Método de conversão</Text>
      {GPA_METHODS.map(method => <Pressable key={method.id} accessibilityRole="button" accessibilityState={{selected:methodId === method.id}} onPress={() => setMethodId(method.id)} style={[styles.method,methodId === method.id && styles.methodActive]}>
        <Text style={styles.methodName}>{method.name}</Text><Text style={styles.methodDescription}>{method.explanation}</Text>
      </Pressable>)}
      {!!error && <Notice error>{error}</Notice>}
      <Action label="Calcular GPA" onPress={calculate} />
      <Action label="Limpar tudo" secondary onPress={clear} />
    </Panel>
    {calculated && selectedResult && <View accessibilityLiveRegion="polite">
      <Panel>
        <View style={styles.resultHeading}><Text style={styles.heading}>Seu resultado</Text><Pill tone="yellow">Estimativa</Pill></View>
        {selectedResult.emptyAfterExclusions ? <Notice>Sem disciplinas para calcular. Inclua as reprovadas ou adicione uma disciplina aprovada.</Notice> : <>
          <Text style={styles.score}>{format(selectedResult.gpa!)} <Text style={styles.scoreScale}>/ 4,0</Text></Text>
          <Text style={styles.resultText}>Conceito aproximado: {selectedResult.letter}</Text>
          <Text style={styles.resultText}>Média brasileira: {format(selectedResult.sourceAverage!)} / 10</Text>
        </>}
        <Text style={styles.source}>Método: {selectedMethod.name}. Fonte verificada em 19/10/2026.</Text>
        <Action label={'Abrir fonte: ' + selectedMethod.source.label} secondary onPress={() => {void Linking.openURL(selectedMethod.source.url)}} />
        {methodId === 'bands' && <Text style={styles.help}>Para notas de 5,0 a 5,9, mantivemos o valor da fonte: C- com 1,5 ponto.</Text>}
        {calculated.input.mode === 'courses' && <>
          {!selectedResult.weighted && <Notice>Sem créditos: calculamos a média simples.</Notice>}
          <Text style={styles.subheading}>Disciplina por disciplina</Text>
          {selectedResult.courses.map((course,index) => <View key={index} style={styles.courseResult}>
            <Text style={styles.courseTitle}>{course.name}</Text>
            <Text style={styles.resultText}>Nota {format(course.grade)} · Pontos {format(course.points)} · Créditos {course.credits === null ? '—' : format(course.credits)}</Text>
            <Text style={styles.help}>{course.excluded ? 'Ignorada no cálculo' : course.letter === 'Reprovação' ? 'Reprovação incluída' : 'Incluída'}</Text>
          </View>)}
        </>}
      </Panel>
      <Text style={styles.sectionTitle}>Compare os três métodos</Text>
      <Text style={styles.help}>As mesmas notas podem produzir resultados diferentes.</Text>
      {GPA_METHODS.map((method,index) => <Pressable key={method.id} accessibilityRole="button" accessibilityState={{selected:methodId === method.id}} onPress={() => setMethodId(method.id)} style={[styles.compare,methodId === method.id && styles.compareActive]}>
        <View style={{flex:1}}><Text style={styles.compareTitle}>{method.name}</Text><Text style={styles.help}>{calculated.results[index].letter ?? '—'}</Text></View>
        <Text style={styles.compareScore}>{calculated.results[index].gpa === null ? '—' : format(calculated.results[index].gpa!)} / 4,0</Text>
      </Pressable>)}
      {calculated.results.every(result => result.gpa !== null) && <Panel>
        <Text style={styles.heading}>Guardar no perfil</Text>
        <Text style={styles.help}>Salve os três resultados juntos. Um novo salvamento substitui as estimativas anteriores.</Text>
        {token ? <Action label={saveBusy ? 'Salvando…' : 'Salvar três estimativas'} disabled={saveBusy} onPress={() => {void save()}} />
          : <Action label="Entrar para salvar" onPress={() => router.push('/conta')} />}
        {!!saveMessage && <Notice>{saveMessage}</Notice>}
      </Panel>}
    </View>}
    {token && <Panel>
      <Text style={styles.heading}>Estimativas já salvas</Text>
      {savedLoading && <Notice>Carregando…</Notice>}
      {!!savedError && <Notice error>{savedError}</Notice>}
      {!savedLoading && !savedError && !saved && <Notice>Você ainda não salvou resultados.</Notice>}
      {saved && <>
        {GPA_METHODS.map(method => <View key={method.id} style={styles.savedRow}><Text style={styles.resultText}>{method.name}</Text><Text style={styles.compareScore}>{format(saved[method.id])} / 4,0</Text></View>)}
        <Text style={styles.help}>Média de origem: {format(saved.sourceAverage)} / 10 · Salvo em {new Date(saved.savedAt).toLocaleDateString('pt-BR')}</Text>
        <Action label={saveBusy ? 'Aguarde…' : 'Remover estimativas salvas'} secondary disabled={saveBusy} onPress={removeSaved} />
      </>}
    </Panel>}
    <View style={styles.disclaimer}><AppIcon name="shield" color={theme.blue} size={23} /><Text style={styles.disclaimerText}>Não existe conversão oficial única. WES, ECE e universidades podem usar métodos próprios. Confira as exigências da instituição de destino. O cálculo é feito no aparelho. Se você estiver conectado, o modo usado e o uso de créditos são registrados para conquistas; as notas por disciplina não são enviadas. Ao salvar, as três estimativas e os parâmetros são enviados para sua conta.</Text></View>
  </Screen>
}

const styles = StyleSheet.create({
  hero:{backgroundColor:'#eaf2ff',borderRadius:20,padding:15,alignItems:'center',marginBottom:14},
  heroImage:{width:160,height:150},
  heroTitle:{color:theme.navy,fontWeight:'800',fontSize:17,textAlign:'center',lineHeight:22,maxWidth:260},
  heroText:{color:theme.muted,fontSize:12,lineHeight:18,textAlign:'center',marginTop:5,maxWidth:275},
  heading:{color:theme.navy,fontSize:17,fontWeight:'800'},subheading:{color:theme.navy,fontSize:14,fontWeight:'800',marginTop:7},
  help:{color:theme.muted,fontSize:12,lineHeight:18},choices:{flexDirection:'row',flexWrap:'wrap',gap:8},
  choice:{paddingHorizontal:12,paddingVertical:9,borderRadius:18,borderWidth:1.5,borderColor:theme.border,backgroundColor:theme.white},
  choiceSelected:{backgroundColor:theme.pale,borderColor:theme.blue},choiceText:{color:theme.muted,fontSize:13,fontWeight:'700'},
  choiceTextSelected:{color:theme.blue},
  course:{backgroundColor:theme.background,borderRadius:17,padding:13,gap:2},
  courseHeading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8},
  courseTitle:{color:theme.navy,fontWeight:'800',fontSize:14},remove:{color:'#b43d4b',fontWeight:'700',fontSize:13},
  method:{borderWidth:1.5,borderColor:theme.border,borderRadius:15,padding:13,gap:5},
  methodActive:{borderColor:theme.blue,backgroundColor:theme.pale},
  methodName:{color:theme.navy,fontWeight:'800',fontSize:14},methodDescription:{color:theme.muted,fontSize:12,lineHeight:18},
  resultHeading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  score:{color:theme.blue,fontSize:34,fontWeight:'800'},scoreScale:{fontSize:20,color:theme.muted},
  resultText:{color:theme.muted,fontSize:13,lineHeight:20},source:{color:theme.navy,fontSize:12,lineHeight:19},
  courseResult:{borderTopWidth:1,borderTopColor:theme.border,paddingTop:10,gap:3},
  sectionTitle:{color:theme.navy,fontSize:19,fontWeight:'800',marginTop:13,marginBottom:5},
  compare:{backgroundColor:theme.white,borderColor:theme.border,borderWidth:1.5,borderRadius:16,padding:14,flexDirection:'row',alignItems:'center',gap:10,marginTop:9},
  compareActive:{borderColor:theme.blue,backgroundColor:theme.pale},
  compareTitle:{color:theme.navy,fontSize:14,fontWeight:'800'},compareScore:{color:theme.blue,fontSize:14,fontWeight:'800'},
  savedRow:{flexDirection:'row',justifyContent:'space-between',gap:10,borderBottomWidth:1,borderBottomColor:theme.border,paddingVertical:8},
  disclaimer:{backgroundColor:theme.pale,borderRadius:17,padding:15,flexDirection:'row',gap:10,marginTop:5},
  disclaimerText:{flex:1,color:theme.muted,fontSize:12,lineHeight:19},
})
