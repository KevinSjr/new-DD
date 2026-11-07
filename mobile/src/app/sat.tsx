import { useEffect, useState } from 'react'
import { Linking, StyleSheet, Text, View } from 'react-native'
import { api } from '../api'
import { Action, Notice, Panel, Pill } from '../components/Controls'
import { Screen } from '../components/Screen'
import { SatQuestionView } from '../exams/ExamQuestion'
import { dailyRequest } from '../exams/client'
import { ChoiceRow, ExamProgress, errorMessage, formatTime } from '../exams/ui'
import type { SatDaily, SatExam, SatForm, SatGrade, SatSection } from '../exams/types'
import { useSession } from '../session'
import { theme } from '../theme'

const forms=[4,5,6,7,8,9,10,11] as const
const sectionName=(section:SatSection)=>section==='math'?'Matemática':'Leitura e escrita'
const score=(range:{lower:number;upper:number})=>range.lower===range.upper?String(range.lower):`${range.lower}–${range.upper}`

export default function SatPage() {
  const {token}=useSession()
  const [mode,setMode]=useState<'home'|'daily'|'exam'>('home')
  const [section,setSection]=useState<SatSection>('reading-writing')
  const [form,setForm]=useState<SatForm>('practice-4-paper')
  const [daily,setDaily]=useState<SatDaily|null>(null)
  const [dailyAnswer,setDailyAnswer]=useState('')
  const [feedback,setFeedback]=useState<SatDaily['feedback']>(undefined)
  const [exam,setExam]=useState<SatExam|null>(null)
  const [examStage,setExamStage]=useState<'setup'|'running'|'break'|'grading'|'grade-error'|'result'>('setup')
  const [moduleIndex,setModuleIndex]=useState(0)
  const [questionIndex,setQuestionIndex]=useState(0)
  const [answers,setAnswers]=useState<Record<number,string>>({})
  const [deadline,setDeadline]=useState(0)
  const [seconds,setSeconds]=useState(0)
  const [grade,setGrade]=useState<SatGrade|null>(null)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [claimMessage,setClaimMessage]=useState('')
  const [claimedProof,setClaimedProof]=useState('')

  useEffect(()=>{
    if (mode!=='exam'||(examStage!=='running'&&examStage!=='break')) return
    const tick=()=>setSeconds(Math.max(0,Math.ceil((deadline-Date.now())/1000)))
    tick();const timer=setInterval(tick,1000);return ()=>clearInterval(timer)
  },[deadline,examStage,mode])
  useEffect(()=>{
    if (mode!=='exam'||seconds!==0||!deadline||Date.now()<deadline||!exam) return
    if (examStage==='break') {setModuleIndex(2);setQuestionIndex(0);setDeadline(Date.now()+exam.modules[2].minutes*60000);setExamStage('running')}
    else if (examStage==='running') advanceModule()
  },[seconds,deadline,examStage,mode])

  async function loadDaily() {
    setMode('daily');setDaily(null);setFeedback(undefined);setError('');setBusy(true)
    try {setDaily(await dailyRequest<SatDaily>('sat',`/api/sat/daily?section=${section}`));setDailyAnswer('')}
    catch(e){setError(errorMessage(e))}finally{setBusy(false)}
  }
  async function submitDaily() {
    if (!daily?.question||!dailyAnswer.trim()) return
    setBusy(true);setError('')
    try {const next=await dailyRequest<SatDaily>('sat','/api/sat/daily/answer',{section,questionId:daily.question.id,answer:dailyAnswer.trim()});setDaily(next);setFeedback(next.feedback)}
    catch(e){setError(errorMessage(e))}finally{setBusy(false)}
  }
  async function claimDaily() {
    if (!token||!daily?.completionProof||claimedProof===daily.completionProof) return
    setBusy(true);setError('')
    try {const result=await api<{earnedXp:number}>('/api/account/missions/claim',{method:'POST',token,body:{source:'sat',proof:daily.completionProof,section}})
      setClaimMessage(result.earnedXp?`+${result.earnedXp} XP na sua conta.`:'Desafio registrado na sua conta.');setClaimedProof(daily.completionProof)}
    catch(e){setError(errorMessage(e))}finally{setBusy(false)}
  }
  async function loadExam() {
    setMode('exam');setExam(null);setGrade(null);setExamStage('setup');setError('');setBusy(true)
    try {setExam(await api<SatExam>(`/api/sat/exam?form=${form}`))}
    catch(e){setError(errorMessage(e))}finally{setBusy(false)}
  }
  function startExam() {
    if (!exam?.ready) return
    setAnswers({});setModuleIndex(0);setQuestionIndex(0);setDeadline(Date.now()+exam.modules[0].minutes*60000);setExamStage('running')
  }
  function advanceModule() {
    if (!exam) return
    if (moduleIndex===3) {void finishExam();return}
    if (moduleIndex===1) {setDeadline(Date.now()+10*60000);setExamStage('break');return}
    const next=moduleIndex+1;setModuleIndex(next);setQuestionIndex(0);setDeadline(Date.now()+exam.modules[next].minutes*60000)
  }
  async function finishExam() {
    if (!exam) return
    setExamStage('grading');setBusy(true);setError('')
    try {const report=await api<SatGrade>('/api/sat/exam/grade',{method:'POST',body:{formCode:exam.formCode,answers:Object.entries(answers).filter(([,answer])=>answer.trim()).map(([questionId,answer])=>({questionId:Number(questionId),answer:answer.trim()}))}})
      setGrade(report);setExamStage('result')
      if (token) void api('/api/account/achievements/events',{method:'POST',token,body:{kind:'sat-report',target:exam.formCode,details:{reading:report.sections['reading-writing'].scoreRange,math:report.sections.math.scoreRange}}}).catch(()=>{})
    }catch(e){setError(errorMessage(e));setExamStage('grade-error')}finally{setBusy(false)}
  }
  const module=exam?.modules[moduleIndex]
  const questions=exam?.questions.filter(item=>item.section===module?.section&&item.module_number===module.module_number)||[]
  const question=questions[questionIndex]
  const title=mode==='home'?'SAT':mode==='daily'?'Desafio diário SAT':'Simulado SAT'
  return <Screen key={`${mode}-${examStage}-${daily?.question?.id||0}-${question?.id||0}`} title={title} description={mode==='home'?'Pratique com questões dos testes 4 a 11. Escolha como deseja estudar.':mode==='daily'?'Cinco questões por área, com três vidas por dia.':'Faça um teste completo e receba a faixa estimada de pontuação.'} navTitle="SAT">
    {mode==='home'&&<><Panel><Pill>PRÁTICA</Pill><Text style={styles.heading}>Desafio diário</Text><Text style={styles.body}>Escolha leitura e escrita ou matemática. Um erro consome uma vida.</Text>
      <ChoiceRow items={[{value:'reading-writing',label:'Leitura e escrita'},{value:'math',label:'Matemática'}]} value={section} onChange={setSection} />
      <Action label="Começar desafio" onPress={()=>{void loadDaily()}} /></Panel>
      <Panel><Pill tone="yellow">TESTE COMPLETO</Pill><Text style={styles.heading}>Modo exame</Text>
        <Text style={styles.body}>120 questões, quatro módulos cronometrados e intervalo de 10 minutos. O resultado é uma estimativa do teste prático em papel.</Text>
        <ChoiceRow items={forms.map(n=>({value:`practice-${n}-paper` as SatForm,label:`Teste ${n}`}))} value={form} onChange={setForm} />
        <Action label="Abrir simulado" onPress={()=>{void loadExam()}} /></Panel></>}
    {mode==='daily'&&<><Action label="Voltar aos modos" secondary onPress={()=>setMode('home')} />
      {daily&&!daily.available?<Notice error>Esta área ainda tem {daily.published||0} de {daily.needed||5} questões necessárias para o desafio.</Notice>:null}
      {daily?.available&&<Panel><ExamProgress label={`${daily.answered} de ${daily.total} respondidas`} detail={`${daily.lives} de ${daily.maxLives} vidas · ${daily.correct} acertos`} />
        {feedback&&<Notice>{feedback.correct?'Resposta correta!':'Resposta incorreta. Resposta aceita: '+feedback.acceptedAnswers.join(', ')}{feedback.explanation?' '+feedback.explanation:''}</Notice>}
        {daily.finished?<><Text style={styles.heading}>Desafio concluído</Text><Text style={styles.body}>{daily.correct} acertos em {daily.answered} questões.</Text>
          {token?<Action label={claimedProof===daily.completionProof?'Progresso registrado':'Registrar XP no perfil'} disabled={!daily.completionProof||claimedProof===daily.completionProof||busy} onPress={()=>{void claimDaily()}} />:<Notice>Entre na sua conta para registrar XP. O desafio pode ser retomado hoje neste aparelho.</Notice>}
          {!!claimMessage&&<Notice>{claimMessage}</Notice>}</>
        :feedback?<Action label="Próxima questão" onPress={()=>{setFeedback(undefined);setDailyAnswer('')}} />
        :daily.question?<><SatQuestionView key={daily.question.id} question={daily.question} answer={dailyAnswer} onAnswer={setDailyAnswer} />
          <Action label={busy?'Enviando…':'Responder'} disabled={busy||!dailyAnswer.trim()} onPress={()=>{void submitDaily()}} /></>:null}</Panel>}
      {!daily&&!busy&&<Action label="Tentar novamente" onPress={()=>{void loadDaily()}} />}</>}
    {mode==='exam'&&<><Action label="Voltar aos modos" secondary onPress={()=>setMode('home')} />
      {examStage==='setup'&&exam&&<Panel><Text style={styles.heading}>Teste {form.split('-')[1]}</Text>
        {exam.ready?<><Text style={styles.body}>Leitura e escrita: 2 módulos de 39 min. Matemática: 2 módulos de 43 min. Intervalo de 10 min após leitura e escrita.</Text>
          <Notice>Suas respostas ficam nesta tela durante o simulado. Sair do app reinicia a tentativa.</Notice><Action label="Iniciar teste" onPress={startExam} /></>
        :<Notice error>Este teste ainda não tem todas as 120 questões publicadas.</Notice>}</Panel>}
      {examStage==='break'&&<Panel><Text style={styles.heading}>Intervalo</Text><Text style={styles.body}>Você terminou leitura e escrita. A matemática começa em {formatTime(seconds)}.</Text>
        <Action label="Começar matemática agora" onPress={()=>{setModuleIndex(2);setQuestionIndex(0);setDeadline(Date.now()+exam!.modules[2].minutes*60000);setExamStage('running')}} /></Panel>}
      {examStage==='running'&&module&&question&&<Panel><ExamProgress label={`${sectionName(module.section)} · módulo ${module.module_number}`} detail={`Questão ${questionIndex+1} de ${questions.length} · ${formatTime(seconds)} restantes`} />
        <SatQuestionView key={question.id} question={question} answer={answers[question.id]||''} onAnswer={value=>setAnswers(current=>({...current,[question.id]:value}))} />
        <View style={styles.row}><View style={styles.flex}><Action label="Anterior" secondary disabled={questionIndex===0||busy} onPress={()=>setQuestionIndex(i=>i-1)} /></View>
          <View style={styles.flex}><Action label={questionIndex===questions.length-1?'Encerrar módulo':'Próxima'} disabled={busy}
            onPress={()=>questionIndex===questions.length-1?advanceModule():setQuestionIndex(i=>i+1)} /></View></View>
        {moduleIndex===3&&<Notice>Ao encerrar o último módulo, o simulado será corrigido.</Notice>}</Panel>}
      {examStage==='grading'&&<Notice>Corrigindo seu simulado…</Notice>}
      {examStage==='grade-error'&&<Panel><Notice error>{error}</Notice><Action label="Tentar corrigir novamente" onPress={()=>{void finishExam()}} /></Panel>}
      {examStage==='result'&&grade&&<Panel><Pill tone="green">RESULTADO ESTIMADO</Pill><Text style={styles.score}>{score(grade.scoreRange)} / 1600</Text>
        <Text style={styles.body}>{grade.correct} de {grade.total} questões corretas</Text>
        <ExamProgress label="Leitura e escrita" detail={`${score(grade.sections['reading-writing'].scoreRange)} pontos · ${grade.sections['reading-writing'].correct}/66 acertos`} />
        <ExamProgress label="Matemática" detail={`${score(grade.sections.math.scoreRange)} pontos · ${grade.sections.math.correct}/54 acertos`} />
        {grade.modules.map(item=><Text key={`${item.section}-${item.moduleNumber}`} style={styles.body}>{sectionName(item.section)}, módulo {item.moduleNumber}: {item.correct}/{item.total}</Text>)}
        <Notice>{grade.note}</Notice><Action label="Ver fonte da tabela de pontuação  ↗" secondary onPress={()=>{void Linking.openURL(grade.scoringSource)}} />
        <Action label="Escolher outro teste" onPress={()=>setMode('home')} /></Panel>}</>}
    {busy&&mode!=='exam'&&<Notice>Carregando…</Notice>}{!!error&&<Notice error>{error}</Notice>}
  </Screen>
}
const styles=StyleSheet.create({heading:{color:theme.navy,fontSize:18,fontWeight:'800'},body:{color:theme.muted,fontSize:13,lineHeight:19},row:{flexDirection:'row',gap:8},flex:{flex:1},score:{color:theme.blue,fontSize:32,fontWeight:'800'}})
