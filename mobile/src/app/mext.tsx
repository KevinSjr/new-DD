import { useEffect, useState } from 'react'
import { router, type Href } from 'expo-router'
import { Linking, StyleSheet, Text, View } from 'react-native'
import { api } from '../api'
import { Action, Notice, Panel, Pill } from '../components/Controls'
import { Screen } from '../components/Screen'
import { MextQuestionView } from '../exams/ExamQuestion'
import { dailyRequest } from '../exams/client'
import { ChoiceRow, ExamProgress, errorMessage, formatTime } from '../exams/ui'
import type { MextDaily, MextExam, MextGrade, MextScience, MextSubject, MextTrack } from '../exams/types'
import { useSession } from '../session'
import { theme } from '../theme'

const names:Record<MextSubject,string>={japanese:'Japonês',english:'Inglês',math:'Matemática',chemistry:'Química',physics:'Física',biology:'Biologia'}
const subjectOptions=(track:MextTrack)=> (track==='A'?['japanese','english','math']:['japanese','english','math','chemistry','physics','biology'] as MextSubject[]).map(value=>({value:value as MextSubject,label:names[value as MextSubject]}))

export default function MextPage() {
  const {token}=useSession()
  const [mode,setMode]=useState<'home'|'daily'|'exam'>('home')
  const [track,setTrack]=useState<MextTrack>('A')
  const [science,setScience]=useState<MextScience>('physics')
  const [subject,setSubject]=useState<MextSubject>('japanese')
  const [daily,setDaily]=useState<MextDaily|null>(null)
  const [dailyAnswer,setDailyAnswer]=useState('')
  const [feedback,setFeedback]=useState<MextDaily['feedback']>(undefined)
  const [exam,setExam]=useState<MextExam|null>(null)
  const [stage,setStage]=useState<'setup'|'running'|'grading'|'grade-error'|'result'>('setup')
  const [subjectIndex,setSubjectIndex]=useState(0)
  const [questionIndex,setQuestionIndex]=useState(0)
  const [answers,setAnswers]=useState<Record<number,string>>({})
  const [deadline,setDeadline]=useState(0)
  const [seconds,setSeconds]=useState(0)
  const [grade,setGrade]=useState<MextGrade|null>(null)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [claimedProof,setClaimedProof]=useState('')
  const [claimMessage,setClaimMessage]=useState('')

  useEffect(()=>{if(mode!=='exam'||stage!=='running')return;const tick=()=>setSeconds(Math.max(0,Math.ceil((deadline-Date.now())/1000)));tick();const timer=setInterval(tick,1000);return()=>clearInterval(timer)},[deadline,stage,mode])
  useEffect(()=>{if(mode==='exam'&&stage==='running'&&deadline&&Date.now()>=deadline&&seconds===0) advanceSubject()},[seconds,deadline,stage,mode])

  function changeTrack(value:MextTrack) {setTrack(value);setSubject('japanese')}
  async function loadDaily() {
    setMode('daily');setDaily(null);setFeedback(undefined);setError('');setBusy(true)
    try {setDaily(await dailyRequest<MextDaily>('mext',`/api/mext/daily?track=${track}&subject=${subject}`));setDailyAnswer('')}
    catch(e){setError(errorMessage(e))}finally{setBusy(false)}
  }
  async function submitDaily() {
    if (!daily?.question||!dailyAnswer.trim())return
    setBusy(true);setError('')
    try {const next=await dailyRequest<MextDaily>('mext','/api/mext/daily/answer',{track,subject,questionId:daily.question.id,answer:dailyAnswer.trim()});setDaily(next);setFeedback(next.feedback)}
    catch(e){setError(errorMessage(e))}finally{setBusy(false)}
  }
  async function claimDaily() {
    if (!token||!daily?.completionProof||claimedProof===daily.completionProof)return
    setBusy(true);setError('')
    try {const result=await api<{earnedXp:number}>('/api/account/missions/claim',{method:'POST',token,body:{source:'mext',proof:daily.completionProof,track,subject}})
      setClaimMessage(result.earnedXp?`+${result.earnedXp} XP na sua conta.`:'Desafio registrado na sua conta.');setClaimedProof(daily.completionProof)}
    catch(e){setError(errorMessage(e))}finally{setBusy(false)}
  }
  async function loadExam() {
    setMode('exam');setExam(null);setGrade(null);setStage('setup');setError('');setBusy(true)
    try {setExam(await api<MextExam>(`/api/mext/exam?track=${track}&science=${science}`))}
    catch(e){setError(errorMessage(e))}finally{setBusy(false)}
  }
  function startExam() {if(!exam?.ready)return;setAnswers({});setSubjectIndex(0);setQuestionIndex(0);setDeadline(Date.now()+exam.subjects[0].minutes*60000);setStage('running')}
  function advanceSubject() {
    if(!exam)return
    if(subjectIndex===exam.subjects.length-1){void finishExam();return}
    const next=subjectIndex+1;setSubjectIndex(next);setQuestionIndex(0);setDeadline(Date.now()+exam.subjects[next].minutes*60000)
  }
  async function finishExam() {
    if(!exam)return
    setStage('grading');setBusy(true);setError('')
    try {const report=await api<MextGrade>('/api/mext/exam/grade',{method:'POST',body:{track:exam.track,science:exam.science||science,
      answers:Object.entries(answers).filter(([,answer])=>answer.trim()).map(([questionId,answer])=>({questionId:Number(questionId),answer:answer.trim()}))}})
      setGrade(report);setStage('result')
      if(token)void api('/api/account/achievements/events',{method:'POST',token,body:{kind:'mext-report',target:exam.track,details:{}}}).catch(()=>{})
    }catch(e){setError(errorMessage(e));setStage('grade-error')}finally{setBusy(false)}
  }
  const currentSubject=exam?.subjects[subjectIndex]
  const questions=exam?.questions.filter(item=>item.subject===currentSubject?.subject)||[]
  const question=questions[questionIndex]
  return <Screen key={`${mode}-${stage}-${daily?.question?.id||0}-${question?.id||0}`} title={mode==='home'?'MEXT 2025':mode==='daily'?'Desafio diário MEXT':'Exame MEXT 2025'} navTitle="MEXT"
    description={mode==='home'?'Pratique as provas de graduação de 2025, modalidade A ou B.':mode==='daily'?'Cinco itens por disciplina, com três vidas por dia.':'Responda às disciplinas da modalidade escolhida e veja seus pontos de prática.'}>
    {mode==='home'&&<><Panel><Text style={styles.heading}>Escolha a modalidade</Text>
      <ChoiceRow items={[{value:'A',label:'A · Humanidades'},{value:'B',label:'B · Exatas'}]} value={track} onChange={changeTrack} />
      <Text style={styles.body}>A modalidade A inclui japonês, inglês e matemática. A B inclui essas disciplinas, química e física ou biologia.</Text></Panel>
      <Panel><Pill>PRÁTICA</Pill><Text style={styles.heading}>Desafio diário</Text><Text style={styles.body}>Escolha uma disciplina. Cada erro custa uma vida.</Text>
        <ChoiceRow items={subjectOptions(track)} value={subject} onChange={setSubject} /><Action label="Começar desafio" onPress={()=>{void loadDaily()}} /></Panel>
      <Panel><Pill tone="yellow">PROVA COMPLETA</Pill><Text style={styles.heading}>Modo exame</Text>
        {track==='B'&&<><Text style={styles.body}>Escolha a segunda ciência da modalidade B:</Text><ChoiceRow items={[{value:'physics',label:'Física'},{value:'biology',label:'Biologia'}]} value={science} onChange={setScience} /></>}
        <Action label="Abrir exame" onPress={()=>{void loadExam()}} /></Panel></>}
    {mode==='daily'&&<><Action label="Voltar aos modos" secondary onPress={()=>setMode('home')} />
      {daily&&!daily.available?<Notice error>Esta disciplina ainda tem {daily.published||0} de {daily.needed||5} itens necessários para o desafio.</Notice>:null}
      {daily?.available&&<Panel><ExamProgress label={`${daily.answered} de ${daily.total} respondidos`} detail={`${daily.lives} de ${daily.maxLives} vidas · ${daily.correct} acertos`} />
        {feedback&&<Notice>{feedback.correct?'Resposta correta!':'Resposta incorreta. Resposta aceita: '+feedback.acceptedAnswers.join(', ')}</Notice>}
        {daily.finished?<><Text style={styles.heading}>Desafio concluído</Text><Text style={styles.body}>{daily.correct} acertos em {daily.answered} itens.</Text>
          {token?<Action label={claimedProof===daily.completionProof?'Progresso registrado':'Registrar XP no perfil'} disabled={!daily.completionProof||claimedProof===daily.completionProof||busy} onPress={()=>{void claimDaily()}} />:<Notice>Entre na sua conta para registrar XP. O desafio pode ser retomado hoje neste aparelho.</Notice>}
          {!!claimMessage&&<Notice>{claimMessage}</Notice>}
          <Action label="Ver liga semanal MEXT" secondary onPress={()=>router.push('/ligas?source=mext' as Href)} /></>
        :feedback?<Action label="Próximo item" onPress={()=>{setFeedback(undefined);setDailyAnswer('')}} />
        :daily.question?<><MextQuestionView key={daily.question.id} question={daily.question} answer={dailyAnswer} onAnswer={setDailyAnswer} />
          <Action label={busy?'Enviando…':'Responder'} disabled={busy||!dailyAnswer.trim()} onPress={()=>{void submitDaily()}} /></>:null}</Panel>}
      {!daily&&!busy&&<Action label="Tentar novamente" onPress={()=>{void loadDaily()}} />}</>}
    {mode==='exam'&&<><Action label="Voltar aos modos" secondary onPress={()=>setMode('home')} />
      {stage==='setup'&&exam&&<Panel><Text style={styles.heading}>Modalidade {exam.track}</Text>
        {exam.ready?<><Text style={styles.body}>{exam.subjects.map(item=>`${names[item.subject]} (${item.minutes} min)`).join(' · ')}</Text>
          <Notice>Use as imagens originais para ler questões com fórmulas e diagramas. Suas respostas ficam nesta tela durante a prova; sair do app reinicia a tentativa.</Notice>
          <Action label="Iniciar exame" onPress={startExam} /></>:<Notice error>Esta modalidade ainda não tem todos os itens publicados.</Notice>}</Panel>}
      {stage==='running'&&currentSubject&&question&&<Panel><ExamProgress label={names[currentSubject.subject]} detail={`Item ${questionIndex+1} de ${questions.length} · ${formatTime(seconds)} restantes`} />
        <MextQuestionView key={question.id} question={question} answer={answers[question.id]||''} onAnswer={value=>setAnswers(current=>({...current,[question.id]:value}))} />
        <View style={styles.row}><View style={styles.flex}><Action label="Anterior" secondary disabled={questionIndex===0||busy} onPress={()=>setQuestionIndex(i=>i-1)} /></View>
          <View style={styles.flex}><Action label={questionIndex===questions.length-1?'Encerrar disciplina':'Próximo'} disabled={busy}
            onPress={()=>questionIndex===questions.length-1?advanceSubject():setQuestionIndex(i=>i+1)} /></View></View>
        {subjectIndex===exam!.subjects.length-1&&<Notice>Ao encerrar a última disciplina, o exame será corrigido.</Notice>}</Panel>}
      {stage==='grading'&&<Notice>Corrigindo seu exame…</Notice>}
      {stage==='grade-error'&&<Panel><Notice error>{error}</Notice><Action label="Tentar corrigir novamente" onPress={()=>{void finishExam()}} /></Panel>}
      {stage==='result'&&grade&&<Panel><Pill tone="green">PONTOS DE PRÁTICA</Pill><Text style={styles.score}>{grade.earned} / {grade.maximum}</Text>
        {Object.entries(grade.sections).map(([key,item])=><ExamProgress key={key} label={names[key as MextSubject]} detail={`${item.earned}/${item.maximum} pontos · ${item.correct}/${item.total} acertos`} />)}
        <Notice>{grade.note}</Notice><Action label="Ver fonte das provas  ↗" secondary onPress={()=>{void Linking.openURL(grade.source)}} />
        <Action label="Escolher outra modalidade" onPress={()=>setMode('home')} /></Panel>}</>}
    {busy&&mode!=='exam'&&<Notice>Carregando…</Notice>}{!!error&&<Notice error>{error}</Notice>}
  </Screen>
}
const styles=StyleSheet.create({heading:{color:theme.navy,fontSize:18,fontWeight:'800'},body:{color:theme.muted,fontSize:13,lineHeight:19},row:{flexDirection:'row',gap:8},flex:{flex:1},score:{color:theme.blue,fontSize:32,fontWeight:'800'}})
