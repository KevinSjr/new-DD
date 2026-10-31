import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Icon, type IconName } from '../components/ui/Icon'
import { COUNTRY_GUIDES } from '../data/countries'
import './AccountPage.css'
import './AccountPageV4.css'

type AccountUser = {
  id: string
  email: string
  displayName: string
  studyLevel: string | null
  interestArea: string | null
  destinationSlug: string | null
  destinationSlugs: string[]
  fullName: string | null
  schoolName: string | null
  schoolYear: string | null
  city: string | null
  stateCode: string | null
  gpa: number | null
  satScore: number | null
  toeflScore: number | null
  ieltsScore: number | null
  languages: string[]
  plannedExams: string[]
  targetYear: string | null
  createdAt: string
}
type Destination = { slug: string; name: string }
type ProfileForm = {
  displayName: string; fullName: string; schoolName: string; schoolYear: string; city: string; stateCode: string
  studyLevel: string; interestArea: string; destinationSlug: string; destinationSlugs: string[]; targetYear: string
  gpa: string; satScore: string; toeflScore: string; ieltsScore: string; languages: string[]; plannedExams: string[]
}
type Mode = 'login' | 'register'
type Status = 'loading' | 'error' | 'guest' | 'signed-in'
type AccountTab = 'pessoal' | 'academicos' | 'metas' | 'progresso' | 'privacidade'

const accountTabs: { id: AccountTab; label: string }[] = [
  { id: 'pessoal', label: 'Informações pessoais' },
  { id: 'academicos', label: 'Dados acadêmicos' },
  { id: 'metas', label: 'Metas de intercâmbio' },
  { id: 'progresso', label: 'Progresso e gamificação' },
  { id: 'privacidade', label: 'Privacidade e dados' },
]

const areaOptions = ['Engenharia e tecnologia', 'Saúde', 'Negócios', 'Humanas e Direito', 'Artes e design', 'Ciências', 'Educação']
const languageOptions = ['Português', 'Inglês', 'Espanhol', 'Alemão', 'Francês', 'Japonês', 'Coreano', 'Mandarim', 'Outro']
const examOptions = ['TOEFL', 'IELTS', 'Duolingo English Test', 'SAT', 'GRE', 'GMAT', 'JLPT', 'TOPIK', 'HSK', 'Outro']
const targetYears = [['2027', 'Em 2027'], ['2028', 'Em 2028'], ['2029-plus', '2029 ou depois'], ['undecided', 'Ainda não sei']] as const
const demoMissions = [
  { id: 'destinos', title: 'Escolher destinos', detail: 'Compare até três países de interesse.', xp: 20 },
  { id: 'guia', title: 'Ler um guia de país', detail: 'Confira fontes e datas das informações.', xp: 30 },
  { id: 'bolsas', title: 'Pesquisar bolsas', detail: 'Leia os critérios na fonte de cada bolsa.', xp: 30 },
  { id: 'prova', title: 'Escolher uma prova', detail: 'Veja qual exame seu curso exige.', xp: 20 },
  { id: 'documentos', title: 'Organizar documentos', detail: 'Faça sua lista conforme o edital.', xp: 40 },
  { id: 'perfil', title: 'Preencher dados acadêmicos', detail: 'Adicione apenas as informações que quiser.', xp: 20 },
] as const

const studyLevels = [
  ['graduacao', 'Graduação'], ['pos-graduacao', 'Pós-graduação'], ['mestrado', 'Mestrado'],
  ['doutorado', 'Doutorado'], ['intercambio', 'Intercâmbio'], ['idiomas', 'Curso de idiomas'],
  ['curso-curto', 'Curso curto'], ['pesquisa', 'Pesquisa'], ['outro', 'Outro'],
] as const

function levelName(value: string | null) {
  return studyLevels.find(([id]) => id === value)?.[1] || 'Ainda não escolhido'
}

function HeroArt() {
  return <svg className="account-page__hero-art" viewBox="0 0 610 220" aria-hidden="true" focusable="false">
    <g fill="#294b78" opacity=".58"><ellipse cx="95" cy="187" rx="98" ry="50" /><ellipse cx="540" cy="178" rx="92" ry="45" /></g>
    <g fill="#59b9df"><circle cx="260" cy="138" r="77" /><circle cx="365" cy="98" r="95" /><circle cx="470" cy="148" r="74" /><rect x="190" y="142" width="345" height="78" rx="39" /></g>
    <path d="M260 174c38-43 89-66 138-72" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
    <path d="m411 54 8 24 25 1-20 15 7 24-20-14-20 14 7-24-20-15 25-1Z" fill="#ffce4a" />
    <path d="m503 54 4 12 13 1-10 8 3 12-10-7-10 7 3-12-10-8 13-1Z" fill="#ffce4a" />
    <path d="m537 99 3 8 8 1-6 5 2 8-7-5-7 5 3-8-7-5 8-1Z" fill="#ffce4a" />
  </svg>
}

function formFromUser(user: AccountUser): ProfileForm {
  return {
    displayName: user.displayName,
    fullName: user.fullName || '', schoolName: user.schoolName || '', schoolYear: user.schoolYear || '',
    city: user.city || '', stateCode: user.stateCode || '',
    studyLevel: user.studyLevel || '',
    interestArea: user.interestArea || '',
    destinationSlug: user.destinationSlug || '',
    destinationSlugs: user.destinationSlugs || (user.destinationSlug ? [user.destinationSlug] : []),
    targetYear: user.targetYear || '',
    gpa: user.gpa == null ? '' : String(user.gpa), satScore: user.satScore == null ? '' : String(user.satScore),
    toeflScore: user.toeflScore == null ? '' : String(user.toeflScore), ieltsScore: user.ieltsScore == null ? '' : String(user.ieltsScore),
    languages: user.languages || [], plannedExams: user.plannedExams || [],
  }
}

async function accountRequest<T>(path: string, method = 'GET', data?: unknown): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: data === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: data === undefined ? undefined : JSON.stringify(data),
    })
  } catch {
    throw new Error('Não foi possível acessar a API. Confira se o servidor e o PostgreSQL estão em execução.')
  }
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('A API não respondeu corretamente. Reinicie o desenvolvimento com npm run dev.')
  }
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Não foi possível concluir. Tente novamente.')
  return payload as T
}

function announceAuthChange() {
  window.dispatchEvent(new Event('daydreaming:auth-changed'))
}

export function AccountPage() {
  useDocumentTitle('Minha conta | Daydreaming')
  const [status, setStatus] = useState<Status>('loading')
  const [user, setUser] = useState<AccountUser | null>(null)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [mode, setMode] = useState<Mode>('login')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [messageIsError, setMessageIsError] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profile, setProfile] = useState<ProfileForm>({ displayName: '', fullName: '', schoolName: '', schoolYear: '', city: '', stateCode: '', studyLevel: '', interestArea: '', destinationSlug: '', destinationSlugs: [], targetYear: '', gpa: '', satScore: '', toeflScore: '', ieltsScore: '', languages: [], plannedExams: [] })
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<AccountTab>('pessoal')
  const [checkedMissions, setCheckedMissions] = useState<string[]>(['destinos'])
  const [showAllDestinations, setShowAllDestinations] = useState(false)
  const passwordCurrentRef = useRef<HTMLInputElement>(null)
  const deletePasswordRef = useRef<HTMLInputElement>(null)
  const passwordToggleRef = useRef<HTMLButtonElement>(null)

  function toggleChoice(field: 'languages' | 'plannedExams', value: string) {
    setProfile((previous) => ({ ...previous, [field]: previous[field].includes(value) ? previous[field].filter((item) => item !== value) : [...previous[field], value] }))
  }

  function toggleDestination(slug: string) {
    setProfile((previous) => {
      const selected = previous.destinationSlugs.includes(slug)
        ? previous.destinationSlugs.filter((item) => item !== slug)
        : previous.destinationSlugs.length < 3 ? [...previous.destinationSlugs, slug] : previous.destinationSlugs
      return { ...previous, destinationSlugs: selected, destinationSlug: selected[0] || '' }
    })
  }

  function selectTab(tab: AccountTab) {
    setActiveTab(tab)
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    if (event.key === 'ArrowRight') next = (index + 1) % accountTabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + accountTabs.length) % accountTabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = accountTabs.length - 1
    else return
    event.preventDefault()
    selectTab(accountTabs[next].id)
    document.getElementById(`account-tab-${accountTabs[next].id}`)?.focus()
  }

  function reveal(section: 'password' | 'delete') {
    if (section === 'password') setPasswordOpen(true)
    if (section === 'delete') setDeleteOpen(true)
    requestAnimationFrame(() => {
      if (section === 'password') passwordCurrentRef.current?.focus()
      if (section === 'delete') deletePasswordRef.current?.focus()
    })
  }

  async function loadAccount() {
    setStatus('loading')
    try {
      const [account, choices] = await Promise.all([
        accountRequest<{ user: AccountUser | null }>('/api/account/me'),
        accountRequest<Destination[]>('/api/account/destinations'),
      ])
      setDestinations(choices)
      setUser(account.user)
      if (account.user) setProfile(formFromUser(account.user))
      setStatus(account.user ? 'signed-in' : 'guest')
      setMessage('')
      setMessageIsError(false)
    } catch (cause) {
      setStatus('error')
      setMessage(cause instanceof Error ? cause.message : 'Não foi possível carregar a conta.')
      setMessageIsError(true)
    }
  }

  useEffect(() => {
    let active = true
    Promise.all([
      accountRequest<{ user: AccountUser | null }>('/api/account/me'),
      accountRequest<Destination[]>('/api/account/destinations'),
    ]).then(([account, choices]) => {
      if (!active) return
      setDestinations(choices)
      setUser(account.user)
      if (account.user) setProfile(formFromUser(account.user))
      setStatus(account.user ? 'signed-in' : 'guest')
    }).catch((cause) => {
      if (!active) return
      setStatus('error')
      setMessage(cause instanceof Error ? cause.message : 'Não foi possível carregar a conta.')
      setMessageIsError(true)
    })
    return () => { active = false }
  }, [])

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mode === 'register' && authPassword !== confirmPassword) { setMessage('As senhas não coincidem.'); setMessageIsError(true); return }
    setBusy(true); setMessage('')
    try {
      const path = mode === 'register' ? '/api/account/register' : '/api/account/login'
      const data = mode === 'register'
        ? { displayName: authName, email: authEmail, password: authPassword }
        : { email: authEmail, password: authPassword }
      const result = await accountRequest<{ user: AccountUser }>(path, 'POST', data)
      setUser(result.user)
      setProfile(formFromUser(result.user))
      setStatus('signed-in')
      setPasswordOpen(false); setDeleteOpen(false)
      setAuthPassword(''); setConfirmPassword('')
      setMessage(mode === 'register' ? 'Conta criada. Complete seu perfil quando quiser.' : 'Você entrou na sua conta.')
      setMessageIsError(false)
      announceAuthChange()
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Não foi possível entrar.'); setMessageIsError(true) }
    finally { setBusy(false) }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      const result = await accountRequest<{ user: AccountUser }>('/api/account/profile', 'PUT', profile)
      if (!Array.isArray(result.user.destinationSlugs) || !Array.isArray(result.user.languages) || !Array.isArray(result.user.plannedExams)) {
        throw new Error('A API ainda está na versão anterior. Reinicie npm run dev e salve novamente.')
      }
      setUser(result.user)
      setProfile(formFromUser(result.user))
      setMessage('Perfil salvo no seu cadastro.')
      setMessageIsError(false)
      announceAuthChange()
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Não foi possível salvar o perfil.'); setMessageIsError(true) }
    finally { setBusy(false) }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      await accountRequest('/api/account/password', 'POST', { currentPassword, newPassword })
      setCurrentPassword(''); setNewPassword('')
      setMessage('Senha alterada. As sessões anteriores foram encerradas.')
      setMessageIsError(false)
      setPasswordOpen(false)
      requestAnimationFrame(() => passwordToggleRef.current?.focus())
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Não foi possível alterar a senha.'); setMessageIsError(true) }
    finally { setBusy(false) }
  }

  async function logout() {
    setBusy(true); setMessage('')
    try {
      await accountRequest('/api/account/logout', 'POST')
      setUser(null); setStatus('guest'); setPasswordOpen(false); setDeleteOpen(false); setMessage('Você saiu da sua conta.')
      setMessageIsError(false)
      announceAuthChange()
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Não foi possível sair.'); setMessageIsError(true) }
    finally { setBusy(false) }
  }

  async function deleteAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!window.confirm('Excluir sua conta e seu perfil permanentemente? Essa ação não pode ser desfeita.')) return
    setBusy(true); setMessage('')
    try {
      await accountRequest('/api/account/me', 'DELETE', { password: deletePassword })
      setDeletePassword(''); setUser(null); setStatus('guest'); setPasswordOpen(false); setDeleteOpen(false)
      setMessage('Conta e perfil excluídos.')
      setMessageIsError(false)
      announceAuthChange()
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Não foi possível excluir a conta.'); setMessageIsError(true) }
    finally { setBusy(false) }
  }

  const destinationName = destinations.find((item) => item.slug === profile.destinationSlugs[0])?.name
  const firstName = profile.displayName.split(' ')[0]
  const destinationGuide = COUNTRY_GUIDES.find((item) => item.slug === profile.destinationSlugs[0] && item.status === 'available')
  const unsavedProfile = user !== null && JSON.stringify(profile) !== JSON.stringify(formFromUser(user))
  const outdatedProfileApi = user !== null && (!Array.isArray(user.destinationSlugs) || !Array.isArray(user.languages) || !Array.isArray(user.plannedExams))
  const demoXp = demoMissions.reduce((total, mission) => total + (checkedMissions.includes(mission.id) ? mission.xp : 0), 0)
  const demoLevel = Math.min(5, Math.floor(demoXp / 40) + 1)
  const demoLevelNames = ['Sonhador', 'Explorador', 'Planejador', 'Candidato', 'Viajante']
  const demoProgress = demoLevel === 5 ? 100 : Math.round((demoXp % 40) / 40 * 100)
  const demoBadges: { title: string; how: string; icon: IconName; earned: boolean }[] = [
    { title: 'Primeiro passo', how: 'Marque uma missão.', icon: 'sparkles', earned: checkedMissions.length >= 1 },
    { title: 'Explorador de países', how: 'Marque a leitura de um guia.', icon: 'globe', earned: checkedMissions.includes('guia') },
    { title: 'Caçador de bolsas', how: 'Marque a pesquisa de bolsas.', icon: 'search', earned: checkedMissions.includes('bolsas') },
    { title: 'Pronto para a prova', how: 'Marque a escolha de uma prova.', icon: 'clipboard', earned: checkedMissions.includes('prova') },
    { title: 'Documentos em dia', how: 'Marque a organização de documentos.', icon: 'check', earned: checkedMissions.includes('documentos') },
    { title: 'Perfil completo', how: 'Salve nome, escola, série e cidade.', icon: 'target', earned: Boolean(user?.displayName && user?.schoolName && user?.schoolYear && user?.city) },
    { title: 'Meio caminho', how: 'Marque metade das missões.', icon: 'route', earned: checkedMissions.length >= 3 },
    { title: 'Missão cumprida', how: 'Marque todas as missões.', icon: 'trophy', earned: checkedMissions.length === demoMissions.length },
  ]
  const demoBadgeCount = demoBadges.filter((badge) => badge.earned).length

  return <div className="account-page">
    <div className="container account-page__breadcrumb"><Link to="/">Início</Link><span aria-hidden="true">/</span><span>Minha conta</span></div>
    <div className="container"><header className="account-page__hero">
      <div className="account-page__hero-copy"><p className="account-page__eyebrow">Seu espaço no Daydreaming</p><h1>{firstName ? `Olá, ${firstName}!` : 'Seu caminho começa aqui.'}</h1>
        <p>Seu caminho para estudar fora começa pelas suas escolhas.</p>{status === 'signed-in' && user && <ul className="account-v4__hero-summary" aria-label="Resumo do seu plano"><li>Destino: <strong>{destinationName || 'A escolher'}</strong></li><li>Objetivo: <strong>{levelName(profile.studyLevel)}</strong></li><li>Área: <strong>{profile.interestArea || 'A escolher'}</strong></li></ul>}</div>
      <HeroArt />
    </header></div>
    <div className="container account-page__content">
      {message && <p className={messageIsError ? 'account-page__message account-page__message--error' : 'account-page__message'} role={messageIsError ? 'alert' : 'status'}>{message}</p>}
      {status === 'signed-in' && outdatedProfileApi && <p className="account-page__message account-page__message--error" role="alert">A API está na versão anterior e não consegue salvar os novos campos. Reinicie <code>npm run dev</code> antes de editar o perfil.</p>}
      {status === 'signed-in' && unsavedProfile && !outdatedProfileApi && <p className="account-v4__unsaved" role="status">Alterações ainda não salvas. Use o botão Salvar em uma das abas de edição para mantê-las após recarregar.</p>}
      {status === 'loading' && <p className="account-page__state" role="status">Carregando sua conta…</p>}
      {status === 'error' && <div className="account-page__state"><h2>Não foi possível carregar a conta</h2><p>Confira se a API e o PostgreSQL estão em execução.</p><button type="button" onClick={() => void loadAccount()}>Tentar novamente</button></div>}
      {status === 'guest' && <div className="account-page__guest">
        <section className="account-page__intro"><p className="account-page__eyebrow">Uma conta, suas escolhas</p><h2>Organize seu plano de estudos.</h2><p>Guarde destino, nível e área de interesse em um só lugar. Você pode mudar essas preferências quando quiser.</p><ul><li>Encontre caminhos para explorar.</li><li>Retome suas preferências no próximo acesso.</li><li>Continue pesquisando mesmo sem criar conta.</li></ul><p><Link to="/bolsas">Explorar bolsas sem criar conta <span aria-hidden="true">→</span></Link></p><p className="account-page__hint">Suas respostas anteriores nos simulados e desafios anônimos não são vinculadas à conta.</p></section>
        <section className="account-page__panel" aria-labelledby="account-form-title">
          <div className="account-page__switch"><button type="button" aria-pressed={mode === 'login'} onClick={() => { setMode('login'); setMessage(''); setMessageIsError(false) }}>Entrar</button><button type="button" aria-pressed={mode === 'register'} onClick={() => { setMode('register'); setMessage(''); setMessageIsError(false) }}>Criar conta</button></div>
          <h2 id="account-form-title">{mode === 'login' ? 'Boas-vindas de volta' : 'Crie sua conta'}</h2>
          <form onSubmit={submitAuth} className="account-page__form">
            {mode === 'register' && <label>Como podemos chamar você?<input autoComplete="name" required minLength={2} maxLength={80} value={authName} onChange={(event) => setAuthName(event.target.value)} /></label>}
            <label>E-mail<input type="email" autoComplete="email" required maxLength={254} value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} /></label>
            <label>Senha<input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required minLength={mode === 'register' ? 12 : undefined} maxLength={128} value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} /></label>
            {mode === 'register' && <><label>Confirme a senha<input type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label><p className="account-page__hint">Use pelo menos 12 caracteres. Ainda não há recuperação de senha por e-mail; guarde sua senha em um gerenciador.</p></>}
            <button className="account-page__primary" disabled={busy} type="submit">{busy ? 'Aguarde…' : mode === 'login' ? 'Entrar na conta' : 'Criar minha conta'}</button>
          </form>
        </section>
      </div>}
      {status === 'signed-in' && user && <>
        <div className="account-page__dashboard">
          <div className="account-page__main">
            <section className="account-page__panel account-v4__workspace" aria-label="Seus dados e seu plano">
              <div className="account-v4__tabs" role="tablist" aria-label="Seções da conta">
                {accountTabs.map((tab, index) => <button key={tab.id} id={`account-tab-${tab.id}`} type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls="account-tab-panel" tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => selectTab(tab.id)} onKeyDown={(event) => handleTabKey(event, index)}>{tab.label}</button>)}
              </div>
              <div id="account-tab-panel" className="account-v4__panel" role="tabpanel" aria-labelledby={`account-tab-${activeTab}`} tabIndex={0}>
                {activeTab === 'pessoal' && <div className="account-v4__section">
                  <div><p className="account-page__eyebrow">Sua conta</p><h2>Informações pessoais</h2><p>O nome de exibição é obrigatório. Escola e localização são opcionais e ajudam você a organizar sua ficha.</p></div>
                  <div className="account-v4__profile"><span className="account-v4__avatar" aria-hidden="true">{firstName?.charAt(0).toUpperCase()}</span><div><strong>{profile.displayName}</strong><span>{user.email}</span></div></div>
                  <form id="account-profile-form" className="account-page__form account-v4__personal-form" onSubmit={saveProfile}>
                    <label>Nome completo <span className="account-v4__optional">Opcional</span><input autoComplete="name" maxLength={120} value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} /></label>
                    <label>Como quer ser chamado(a)<input required minLength={2} maxLength={80} value={profile.displayName} onChange={(event) => setProfile({ ...profile, displayName: event.target.value })} /><small>Aparece na saudação. Pode ser um apelido.</small></label>
                    <label>E-mail da conta<input type="email" value={user.email} readOnly /><small>Usado para entrar. A alteração de e-mail ainda não está disponível.</small></label>
                    <label>Escola <span className="account-v4__optional">Opcional</span><input maxLength={120} value={profile.schoolName} onChange={(event) => setProfile({ ...profile, schoolName: event.target.value })} /></label>
                    <label>Série ou ano <span className="account-v4__optional">Opcional</span><input maxLength={80} placeholder="Ex.: 3º ano do ensino médio" value={profile.schoolYear} onChange={(event) => setProfile({ ...profile, schoolYear: event.target.value })} /></label>
                    <div className="account-v4__location"><label>Cidade <span className="account-v4__optional">Opcional</span><input autoComplete="address-level2" maxLength={100} value={profile.city} onChange={(event) => setProfile({ ...profile, city: event.target.value })} /></label><label>Estado <span className="account-v4__optional">Opcional</span><input autoComplete="address-level1" maxLength={2} pattern="[A-Za-z]{2}" placeholder="SP" value={profile.stateCode} onChange={(event) => setProfile({ ...profile, stateCode: event.target.value.toUpperCase() })} /></label></div>
                    <div className="account-v4__academic-summary"><div><h3>Resumo dos dados acadêmicos</h3><button type="button" onClick={() => selectTab('academicos')}>Editar dados acadêmicos</button></div><dl><dt>GPA</dt><dd>{profile.gpa.trim() === '' || !Number.isFinite(Number(profile.gpa.replace(',', '.'))) ? 'Não informado' : `${Number(profile.gpa.replace(',', '.')).toFixed(2)} / 4,0`}</dd><dt>Idiomas</dt><dd>{profile.languages.length ? profile.languages.join(', ') : 'Não informado'}</dd><dt>Exames</dt><dd>{profile.plannedExams.length ? profile.plannedExams.join(', ') : 'Não informado'}</dd></dl>{unsavedProfile && <p className="account-v4__draft-note">Prévia das alterações ainda não salvas.</p>}</div>
                    <button className="account-page__primary" type="submit" disabled={busy}>{busy ? 'Salvando…' : 'Salvar informações'}</button>
                  </form>
                </div>}
                {activeTab === 'academicos' && <div className="account-v4__section">
                  <div><p className="account-page__eyebrow">Dados opcionais</p><h2>Dados acadêmicos</h2><p>Registre informações que você já conhece. Elas ficam no seu perfil, mas ainda não alimentam automaticamente o buscador de bolsas ou os simulados.</p></div>
                  <form className="account-page__form account-v4__academic-form" onSubmit={saveProfile}>
                    <div className="account-v4__subcard"><h3>Escola e localização</h3><div className="account-v4__field-grid"><label>Escola<input maxLength={120} value={profile.schoolName} onChange={(event) => setProfile({ ...profile, schoolName: event.target.value })} /></label><label>Série ou ano<input maxLength={80} placeholder="Ex.: 3º ano do ensino médio" value={profile.schoolYear} onChange={(event) => setProfile({ ...profile, schoolYear: event.target.value })} /></label><label>Cidade<input maxLength={100} value={profile.city} onChange={(event) => setProfile({ ...profile, city: event.target.value })} /></label><label>Estado<input maxLength={2} pattern="[A-Za-z]{2}" placeholder="SP" value={profile.stateCode} onChange={(event) => setProfile({ ...profile, stateCode: event.target.value.toUpperCase() })} /></label></div></div>
                    <fieldset className="account-v4__subcard"><legend>Idiomas que você fala</legend><div className="account-v4__chips">{languageOptions.map((language) => <button key={language} type="button" className={profile.languages.includes(language) ? 'is-selected' : ''} aria-pressed={profile.languages.includes(language)} onClick={() => toggleChoice('languages', language)}>{language}</button>)}</div></fieldset>
                    <div className="account-v4__subcard"><h3>Notas informadas por você</h3><div className="account-v4__field-grid"><label>GPA (escala de 4,0)<input type="number" inputMode="decimal" min="0" max="4" step="0.01" value={profile.gpa} onChange={(event) => setProfile({ ...profile, gpa: event.target.value })} /><small>Se ainda não sabe, use a calculadora de GPA. O resultado é uma estimativa.</small></label><label>SAT (pontuação total)<input type="number" inputMode="numeric" min="400" max="1600" step="1" value={profile.satScore} onChange={(event) => setProfile({ ...profile, satScore: event.target.value })} /></label><label>TOEFL iBT<input type="number" inputMode="numeric" min="0" max="120" step="1" value={profile.toeflScore} onChange={(event) => setProfile({ ...profile, toeflScore: event.target.value })} /></label><label>IELTS (banda geral)<input type="number" inputMode="decimal" min="0" max="9" step="0.5" value={profile.ieltsScore} onChange={(event) => setProfile({ ...profile, ieltsScore: event.target.value })} /></label></div></div>
                    <fieldset className="account-v4__subcard"><legend>Exames que você fez ou pretende fazer</legend><div className="account-v4__chips">{examOptions.map((exam) => <button key={exam} type="button" className={profile.plannedExams.includes(exam) ? 'is-selected' : ''} aria-pressed={profile.plannedExams.includes(exam)} onClick={() => toggleChoice('plannedExams', exam)}>{exam}</button>)}</div><p>Cada curso define a prova aceita e a nota mínima. Confira no site do programa.</p></fieldset>
                    <button className="account-page__primary" type="submit" disabled={busy}>{busy ? 'Salvando…' : 'Salvar dados acadêmicos'}</button>
                  </form>
                </div>}
                {activeTab === 'metas' && <div className="account-v4__section">
                  <div><p className="account-page__eyebrow">Seu plano</p><h2>Metas de intercâmbio</h2><p>Escolha até três destinos e indique o tipo de estudo, a área e quando pretende começar. São preferências para organizar seu plano.</p></div>
                  <dl className="account-page__preferences"><div><span className="account-page__preference-icon"><Icon name="globe" /></span><dt>Destino</dt><dd>{destinationName || 'Ainda não escolhido'}</dd></div><div><span className="account-page__preference-icon"><Icon name="compass" /></span><dt>Nível</dt><dd>{levelName(profile.studyLevel)}</dd></div><div><span className="account-page__preference-icon"><Icon name="sparkles" /></span><dt>Área</dt><dd>{profile.interestArea || 'Ainda não escolhida'}</dd></div></dl>
                  <form className="account-page__form account-v4__form account-v4__goals-form" onSubmit={saveProfile}>
                    <fieldset><legend>Destinos de interesse (até 3)</legend><div className="account-v4__chips account-v4__destination-chips">{destinations.filter((item, index) => showAllDestinations || index < 8 || profile.destinationSlugs.includes(item.slug)).map((item) => <button key={item.slug} type="button" className={profile.destinationSlugs.includes(item.slug) ? 'is-selected' : ''} aria-pressed={profile.destinationSlugs.includes(item.slug)} disabled={profile.destinationSlugs.length >= 3 && !profile.destinationSlugs.includes(item.slug)} onClick={() => toggleDestination(item.slug)}>{item.name}</button>)}</div><div className="account-v4__choice-help"><span>{profile.destinationSlugs.length} de 3 selecionados. {profile.destinationSlugs.length === 3 ? 'Desmarque um para trocar.' : ''}</span><button type="button" onClick={() => setShowAllDestinations((value) => !value)}>{showAllDestinations ? 'Mostrar menos' : 'Ver todos os destinos'}</button></div></fieldset>
                    <fieldset><legend>O que você quer fazer?</legend><div className="account-v4__chips">{studyLevels.map(([value, label]) => <button key={value} type="button" className={profile.studyLevel === value ? 'is-selected' : ''} aria-pressed={profile.studyLevel === value} onClick={() => setProfile({ ...profile, studyLevel: profile.studyLevel === value ? '' : value })}>{label}</button>)}</div></fieldset>
                    <fieldset><legend>Área de interesse</legend><div className="account-v4__chips">{areaOptions.map((area) => <button key={area} type="button" className={profile.interestArea === area ? 'is-selected' : ''} aria-pressed={profile.interestArea === area} onClick={() => setProfile({ ...profile, interestArea: profile.interestArea === area ? '' : area })}>{area}</button>)}</div><label className="account-v4__other-area">Outra área ou especialidade<input maxLength={100} placeholder="Ex.: Ciência de dados" value={areaOptions.includes(profile.interestArea) ? '' : profile.interestArea} onChange={(event) => setProfile({ ...profile, interestArea: event.target.value })} /></label></fieldset>
                    <fieldset><legend>Quando pretende ir?</legend><div className="account-v4__chips">{targetYears.map(([value, label]) => <button key={value} type="button" className={profile.targetYear === value ? 'is-selected' : ''} aria-pressed={profile.targetYear === value} onClick={() => setProfile({ ...profile, targetYear: profile.targetYear === value ? '' : value })}>{label}</button>)}</div></fieldset>
                    <p className="account-page__hint">Essas escolhas não confirmam elegibilidade para bolsas. A busca ainda não as aplica automaticamente.</p>
                    <button className="account-page__primary" type="submit" disabled={busy}>{busy ? 'Salvando…' : 'Salvar escolhas'}</button>
                  </form>
                </div>}
                {activeTab === 'progresso' && <div className="account-v4__section">
                  <div><p className="account-page__eyebrow">Prévia interativa</p><h2>Progresso e gamificação</h2><p>Marque as missões para experimentar como XP, níveis e conquistas poderão funcionar. A primeira missão já vem marcada como exemplo; as marcações e o XP não são salvos.</p></div>
                  <div className="account-v4__progress-stats">
                    <div className="account-v4__level-card"><span className="account-v4__stat-label">Seu nível</span><div className="account-v4__level-identity"><span className="account-v4__level-number" aria-label={`Nível ${demoLevel}`}>{demoLevel}</span><div><strong>{demoLevelNames[demoLevel - 1]}</strong><small>{demoXp} XP no total da prévia</small></div></div><div className="account-v4__progress-track" role="progressbar" aria-label="Progresso de XP até o próximo nível na prévia" aria-valuemin={0} aria-valuemax={100} aria-valuenow={demoProgress}><span style={{ width: `${demoProgress}%` }} /></div><small>{demoLevel === 5 ? 'Nível máximo da prévia.' : `${40 - demoXp % 40} XP para o nível ${demoLevel + 1}.`}</small></div>
                    <div><span className="account-v4__stat-label">Missões concluídas</span><strong className="account-v4__stat-value">{checkedMissions.length} de {demoMissions.length}</strong><small>{checkedMissions.length === 0 ? 'Você está começando.' : checkedMissions.length === demoMissions.length ? 'Todas as missões marcadas.' : checkedMissions.length >= 3 ? 'Você já passou da metade.' : 'Bom começo.'}</small></div>
                    <div><span className="account-v4__stat-label">Conquistas</span><strong className="account-v4__stat-value">{demoBadgeCount} de {demoBadges.length}</strong><small>Veja abaixo como liberar cada uma.</small></div>
                  </div>
                  <div><h3>Missões</h3><ul className="account-v4__missions">{demoMissions.map((mission) => <li key={mission.id}><label><input type="checkbox" checked={checkedMissions.includes(mission.id)} onChange={() => setCheckedMissions((previous) => previous.includes(mission.id) ? previous.filter((item) => item !== mission.id) : [...previous, mission.id])} /><span><strong>{mission.title}</strong><small>{mission.detail}</small></span><b>+{mission.xp} XP</b></label></li>)}</ul></div>
                  <div><h3>Conquistas da prévia</h3><div className="account-v4__badges">{demoBadges.map((badge) => <div key={badge.title} className={badge.earned ? 'is-earned' : ''}><span className="account-v4__badge-icon"><Icon name={badge.icon} size={26} /></span><strong>{badge.title}</strong><span>{badge.how}</span><small>{badge.earned ? 'Conquistada na prévia' : 'Ainda não conquistada'}</small></div>)}</div></div>
                </div>}
                {activeTab === 'privacidade' && <div className="account-v4__section">
                  <div><p className="account-page__eyebrow">Seus dados</p><h2>Privacidade e dados</h2><p>Você escolhe o que informar além do nome de exibição e do e-mail necessários para a conta.</p></div>
                  <dl className="account-v4__data"><div><dt>Nome e e-mail</dt><dd>Identificam sua conta e permitem o acesso.</dd></div><div><dt>Escola, cidade e dados acadêmicos</dt><dd>São opcionais e ficam no seu perfil. Ainda não alimentam automaticamente as ferramentas.</dd></div><div><dt>Preferências de estudo</dt><dd>Guardam seus destinos, nível, área e ano pretendido; ainda não filtram a busca automaticamente.</dd></div><div><dt>Progresso e gamificação</dt><dd>A aba é uma prévia interativa; missões e XP não são salvos.</dd></div><div><dt>Simulados</dt><dd>Suas respostas anônimas não são vinculadas à conta.</dd></div></dl>
                  <p className="account-v4__privacy-note"><Icon name="lock" size={20} />Você pode alterar a senha ou excluir a conta na seção de segurança ao lado.</p>
                </div>}
              </div>
            </section>
          </div>
          <aside className="account-page__side" aria-label="Perfil e segurança">
            <section className="account-page__panel account-v4__identity" aria-labelledby="account-sidebar-profile"><div className="account-v4__sidebar-person"><span className="account-v4__avatar" aria-hidden="true">{firstName?.charAt(0).toUpperCase()}</span><div><h2 id="account-sidebar-profile">{profile.displayName}</h2><span>Meu perfil</span></div></div><div className="account-v4__shortcuts">{accountTabs.map((tab) => <button key={tab.id} type="button" onClick={() => { selectTab(tab.id); document.getElementById('account-tab-panel')?.scrollIntoView({ block: 'start' }) }}>{tab.label}<span aria-hidden="true">›</span></button>)}</div></section>
            <section className="account-page__panel account-v4__next" aria-labelledby="account-next-title"><span className="account-v4__pill">Próximo passo</span><h2 id="account-next-title">{destinationGuide ? 'Conhecer o destino escolhido' : 'Descobrir um destino'}</h2><p>{destinationGuide ? 'Confira custos, requisitos e prazos no guia do país que você selecionou.' : 'Explore os guias de países para comparar idioma, custos, bolsas e vida estudantil.'}</p><Link className="account-page__primary" to={destinationGuide?.href || '/descobridor-de-destinos'}>{destinationGuide ? 'Abrir guia do país' : 'Comparar destinos'} <span aria-hidden="true">→</span></Link></section>
            <section className="account-page__panel account-page__security"><div className="account-page__security-title"><Icon name="lock" /><div><h2>Segurança da conta</h2><p>Você controla seus dados e sua senha.</p></div></div>
              <button ref={passwordToggleRef} type="button" className="account-page__row-action" aria-expanded={passwordOpen} aria-controls="account-password-form" onClick={() => passwordOpen ? setPasswordOpen(false) : reveal('password')}><Icon name="lock" size={19} />Alterar senha <span aria-hidden="true">›</span></button>
              {passwordOpen && <form id="account-password-form" className="account-page__form account-page__inline-form" onSubmit={changePassword}><p>Alterar a senha encerra as outras sessões.</p><label>Senha atual<input ref={passwordCurrentRef} type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label><label>Nova senha<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label><button type="submit" disabled={busy}>Salvar nova senha</button></form>}
              <button type="button" className="account-page__row-action account-page__row-action--logout" onClick={() => void logout()} disabled={busy}><Icon name="route" size={19} />Sair da conta <span aria-hidden="true">›</span></button>
              <div className="account-page__privacy"><Icon name="lock" size={22} /><p><strong>Seus dados, suas escolhas.</strong><br />Você pode atualizar ou excluir seu perfil.</p></div>
              <button type="button" className="account-page__delete-toggle" aria-expanded={deleteOpen} aria-controls="account-delete-form" onClick={() => deleteOpen ? setDeleteOpen(false) : reveal('delete')}>Excluir conta</button>
              {deleteOpen && <form id="account-delete-form" className="account-page__form account-page__inline-form account-page__delete-form" onSubmit={deleteAccount}><p>Exclui permanentemente cadastro, perfil e sessões. Informe sua senha para confirmar.</p><label>Senha atual<input ref={deletePasswordRef} type="password" autoComplete="current-password" required value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} /></label><button type="submit" disabled={busy}>Excluir minha conta</button></form>}
            </section>
          </aside>
        </div>
      </>}
    </div>
  </div>
}
