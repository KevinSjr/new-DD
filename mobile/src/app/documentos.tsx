import { useCallback, useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'
import { File } from 'expo-file-system'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { api, baseUrl } from '../api'
import { Action, Notice, Panel } from '../components/Controls'
import { AppIcon } from '../components/AppIcon'
import { Screen } from '../components/Screen'
import { useSession } from '../session'
import { theme } from '../theme'

type Document = { id:string; fileName:string; category:string; mimeType:string; sizeBytes:number; uploadedAt:string }
const mimeByExtension:Record<string,string> = {
  pdf:'application/pdf', docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg',
}
const categories = [
  { key:'historico',label:'Histórico escolar' },{ key:'diploma',label:'Diploma' },
  { key:'traducao',label:'Tradução' },{ key:'recomendacao',label:'Recomendação' },
  { key:'certificado',label:'Certificado' },{ key:'curriculo',label:'Currículo' },{ key:'outro',label:'Outro' },
]

export default function Documents() {
  const { token } = useSession()
  const [documents,setDocuments] = useState<Document[]>([])
  const [category,setCategory] = useState('outro')
  const [error,setError] = useState('')
  const [notice,setNotice] = useState('')
  const [busy,setBusy] = useState(false)
  const load = useCallback(async () => {
    if (!token) return
    try { setDocuments((await api<{ documents:Document[] }>('/api/account/documents',{ token })).documents) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os documentos.') }
  },[token])
  useFocusEffect(useCallback(() => { void load() },[load]))
  const upload = async () => {
    if (!token) return
    setError('');setNotice('')
    try {
      const picked = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory:true, multiple:false })
      if (picked.canceled) return
      const asset = picked.assets[0]
      const extension = asset.name.split('.').pop()?.toLowerCase() || ''
      const mime = mimeByExtension[extension]
      if (!mime) throw new Error('Escolha um arquivo PDF, DOCX, PNG ou JPG.')
      if (asset.size && asset.size > 5 * 1024 * 1024) throw new Error('O arquivo deve ter no máximo 5 MB.')
      setBusy(true)
      const file = new File(asset.uri)
      const response = await fetch(`${baseUrl()}/api/account/documents`, {
        method:'POST',headers:{ 'X-Daydreaming-Client':'mobile', Authorization:`Bearer ${token}`,
          'X-Document-Name':encodeURIComponent(asset.name), 'X-Document-Category':category, 'Content-Type':mime },
        body:file as unknown as BodyInit,
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Não foi possível enviar o documento.')
      setNotice('Documento guardado na sua conta.');await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível enviar o documento.') }
    finally { setBusy(false) }
  }
  const download = async (item:Document) => {
    if (!token) return
    setBusy(true);setError('')
    try {
      const uri = `${FileSystem.cacheDirectory}daydreaming-${item.id}-${item.fileName}`
      const result = await FileSystem.downloadAsync(`${baseUrl()}/api/account/documents/${item.id}/download`,uri,
        { headers:{ 'X-Daydreaming-Client':'mobile',Authorization:`Bearer ${token}` } })
      if (result.status !== 200) throw new Error('Não foi possível baixar o documento.')
      await Sharing.shareAsync(result.uri,{ mimeType:item.mimeType,dialogTitle:item.fileName })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível abrir o documento.') }
    finally { setBusy(false) }
  }
  const remove = async (id:string) => {
    if (!token) return
    setBusy(true);setError('')
    try { await api(`/api/account/documents/${id}`,{ method:'DELETE',token });await load() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível remover o documento.') }
    finally { setBusy(false) }
  }
  return <Screen navTitle="Meus documentos" title="Meus documentos" description="Organize arquivos para suas candidaturas em um só lugar.">
    {!token ? <Panel><Text style={styles.body}>Entre na conta para guardar e acessar seus documentos.</Text>
      <Action label="Entrar na conta" onPress={() => router.push('/conta')} /></Panel> : <>
      {!!error && <Notice error>{error}</Notice>}{!!notice && <Notice>{notice}</Notice>}
      <View style={styles.hero}><View style={styles.heroIcon}><AppIcon name="document" color={theme.blue} size={28} /></View>
        <View style={{flex:1}}><Text style={styles.heroTitle}>{documents.length} {documents.length === 1 ? 'documento guardado' : 'documentos guardados'}</Text>
          <Text style={styles.body}>Escolha uma categoria antes de enviar seu arquivo.</Text></View></View>
      <Panel>
        <Text style={styles.heading}>Adicionar documento</Text>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categories}>{categories.map(item => <Pressable key={item.key} accessibilityRole="button" accessibilityState={{selected:category === item.key}}
          onPress={() => setCategory(item.key)} style={[styles.category,category === item.key && styles.categorySelected]}>
          <Text style={[styles.categoryText,category === item.key && styles.categoryTextSelected]}>{item.label}</Text></Pressable>)}</View>
        <Action label={busy ? 'Aguarde…' : 'Escolher arquivo e enviar'} disabled={busy} onPress={() => { void upload() }} />
        <Text style={styles.hint}>PDF, DOCX, PNG ou JPG · até 5 MB · máximo de 20 arquivos.</Text>
      </Panel>
      <Text style={styles.sectionTitle}>Seus arquivos</Text>
      {documents.length === 0 && <Notice>Você ainda não guardou documentos.</Notice>}
      {documents.map(item => <Panel key={item.id}>
        <View style={styles.fileHead}><View style={styles.fileIcon}><AppIcon name="document" color={theme.blue} size={20} /></View>
          <View style={{flex:1}}><Text style={styles.fileName}>{item.fileName}</Text>
            <Text style={styles.body}>{categories.find(choice => choice.key === item.category)?.label || item.category} · {Math.round(item.sizeBytes / 1024)} KB</Text></View></View>
        <Action label="Abrir ou compartilhar" secondary disabled={busy} onPress={() => { void download(item) }} />
        <Action label="Excluir documento" secondary disabled={busy} onPress={() => { void remove(item.id) }} />
      </Panel>)}
    </>}
  </Screen>
}

const styles = StyleSheet.create({
  body:{color:theme.muted,fontSize:12,lineHeight:18},
  hero:{backgroundColor:theme.pale,borderRadius:18,padding:15,flexDirection:'row',alignItems:'center',gap:11,marginBottom:13},
  heroIcon:{width:48,height:48,borderRadius:15,backgroundColor:theme.white,alignItems:'center',justifyContent:'center'},
  heroTitle:{color:theme.navy,fontSize:16,fontWeight:'800'},
  heading:{color:theme.navy,fontSize:17,fontWeight:'800',marginBottom:8},
  label:{color:theme.navy,fontSize:13,fontWeight:'700',marginBottom:6},
  categories:{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:13},
  category:{borderWidth:1.5,borderColor:theme.border,backgroundColor:theme.white,borderRadius:19,paddingHorizontal:11,paddingVertical:8},
  categorySelected:{backgroundColor:theme.blue,borderColor:theme.blue},
  categoryText:{color:theme.navy,fontSize:12,fontWeight:'700'},
  categoryTextSelected:{color:theme.white},
  hint:{color:theme.muted,fontSize:11,lineHeight:16,marginTop:7},
  sectionTitle:{color:theme.navy,fontSize:17,fontWeight:'800',marginTop:8,marginBottom:8},
  fileHead:{flexDirection:'row',alignItems:'center',gap:9,marginBottom:8},
  fileIcon:{width:39,height:39,borderRadius:12,backgroundColor:theme.pale,alignItems:'center',justifyContent:'center'},
  fileName:{color:theme.navy,fontSize:14,fontWeight:'800'},
})
