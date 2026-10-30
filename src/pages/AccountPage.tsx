import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from '../router/Link'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Icon } from '../components/ui/Icon'
import './AccountPage.css'

type AccountUser = {
  id: string
  email: string
  displayName: string
  studyLevel: string | null
  interestArea: string | null
  destinationSlug: string | null
  createdAt: string
}
type Destination = { slug: string; name: string }
type ProfileForm = { displayName: string; studyLevel: string; interestArea: string; destinationSlug: string }
type Mode = 'login' | 'register'
type Status = 'loading' | 'error' | 'guest' | 'signed-in'

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
    studyLevel: user.studyLevel || '',
    interestArea: user.interestArea || '',
    destinationSlug: user.destinationSlug || '',
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
  const [profile, setProfile] = useState<ProfileForm>({ displayName: '', studyLevel: '', interestArea: '', destinationSlug: '' })
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const profileNameRef = useRef<HTMLInputElement>(null)
  const passwordCurrentRef = useRef<HTMLInputElement>(null)
  const deletePasswordRef = useRef<HTMLInputElement>(null)
  const profileToggleRef = useRef<HTMLButtonElement>(null)
  const passwordToggleRef = useRef<HTMLButtonElement>(null)

  function reveal(section: 'profile' | 'password' | 'delete') {
    if (section === 'profile') setProfileOpen(true)
    if (section === 'password') setPasswordOpen(true)
    if (section === 'delete') setDeleteOpen(true)
    requestAnimationFrame(() => {
      if (section === 'profile') profileNameRef.current?.focus()
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
      setProfileOpen(false); setPasswordOpen(false); setDeleteOpen(false)
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
      setUser(result.user)
      setProfile(formFromUser(result.user))
      setMessage('Perfil salvo no seu cadastro.')
      setMessageIsError(false)
      setProfileOpen(false)
      requestAnimationFrame(() => profileToggleRef.current?.focus())
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
      setUser(null); setStatus('guest'); setProfileOpen(false); setPasswordOpen(false); setDeleteOpen(false); setMessage('Você saiu da sua conta.')
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
      setDeletePassword(''); setUser(null); setStatus('guest'); setProfileOpen(false); setPasswordOpen(false); setDeleteOpen(false)
      setMessage('Conta e perfil excluídos.')
      setMessageIsError(false)
      announceAuthChange()
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Não foi possível excluir a conta.'); setMessageIsError(true) }
    finally { setBusy(false) }
  }

  const destinationName = destinations.find((item) => item.slug === user?.destinationSlug)?.name
  const firstName = user?.displayName.split(' ')[0]

  return <div className="account-page">
    <div className="container account-page__breadcrumb"><Link to="/">Início</Link><span aria-hidden="true">/</span><span>Minha conta</span></div>
    <div className="container"><header className="account-page__hero">
      <div className="account-page__hero-copy"><p className="account-page__eyebrow">Seu espaço no Daydreaming</p><h1>{firstName ? `Olá, ${firstName}!` : 'Seu caminho começa aqui.'}</h1>
        <p>Seu caminho para estudar fora começa pelas suas escolhas.</p><span className="account-page__hero-swoosh" aria-hidden="true" /></div>
      <HeroArt />
    </header></div>
    <div className="container account-page__content">
      {message && <p className={messageIsError ? 'account-page__message account-page__message--error' : 'account-page__message'} role={messageIsError ? 'alert' : 'status'}>{message}</p>}
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
            <section className="account-page__panel account-page__plan" aria-labelledby="account-plan-title">
              <div className="account-page__section-head"><div><h2 id="account-plan-title">Seu plano de estudos</h2><p>Suas preferências organizam sua pesquisa por oportunidades.</p></div><button ref={profileToggleRef} type="button" className="account-page__primary account-page__edit-button" aria-expanded={profileOpen} aria-controls="account-profile-form" onClick={() => profileOpen ? setProfileOpen(false) : reveal('profile')}><Icon name="clipboard" size={18} />{profileOpen ? 'Fechar edição' : 'Editar preferências'}</button></div>
              <dl className="account-page__preferences">
                <div><span className="account-page__preference-icon"><Icon name="globe" /></span><dt>Destino</dt><dd>{destinationName || 'Ainda não escolhido'}</dd></div>
                <div><span className="account-page__preference-icon"><Icon name="compass" /></span><dt>Nível</dt><dd>{levelName(user.studyLevel)}</dd></div>
                <div><span className="account-page__preference-icon"><Icon name="sparkles" /></span><dt>Área</dt><dd>{user.interestArea || 'Ainda não escolhida'}</dd></div>
              </dl>
              {profileOpen && <form id="account-profile-form" className="account-page__form account-page__profile-form" onSubmit={saveProfile}>
                <h3>Editar seu perfil</h3><p>Esses campos não determinam elegibilidade para bolsas.</p>
                <label>Nome<input ref={profileNameRef} required minLength={2} maxLength={80} value={profile.displayName} onChange={(event) => setProfile({ ...profile, displayName: event.target.value })} /></label>
                <label>Nível de estudo<select value={profile.studyLevel} onChange={(event) => setProfile({ ...profile, studyLevel: event.target.value })}><option value="">Ainda não sei</option>{studyLevels.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label>Área de interesse<input maxLength={100} placeholder="Ex.: Engenharia, artes, saúde" value={profile.interestArea} onChange={(event) => setProfile({ ...profile, interestArea: event.target.value })} /></label>
                <label>Destino que quer explorar<select value={profile.destinationSlug} onChange={(event) => setProfile({ ...profile, destinationSlug: event.target.value })}><option value="">Ainda não escolhi</option>{destinations.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
                <button className="account-page__primary" type="submit" disabled={busy}>{busy ? 'Salvando…' : 'Salvar preferências'}</button>
              </form>}
            </section>
            <section className="account-page__panel account-page__next" aria-labelledby="account-next-title"><h2 id="account-next-title">Próximos passos</h2><p>Explore as ferramentas no seu ritmo. As buscas ainda não usam automaticamente suas preferências.</p>
              <ol className="account-page__steps">
                <li><span className="account-page__step-number">01</span><span className="account-page__step-icon"><Icon name="search" /></span><div><Link to="/bolsas">Explorar bolsas <span aria-hidden="true">→</span></Link><p>Pesquise oportunidades e confira os requisitos na fonte.</p></div></li>
                <li><span className="account-page__step-number">02</span><span className="account-page__step-icon"><Icon name="globe" /></span><div><Link to="/descobridor-de-destinos">Comparar destinos <span aria-hidden="true">→</span></Link><p>Conheça países e compare suas possibilidades.</p></div></li>
                <li><span className="account-page__step-number">03</span><span className="account-page__step-icon"><Icon name="clipboard" /></span><div><Link to="/exames">Praticar para exames <span aria-hidden="true">→</span></Link><p>Explore os simulados disponíveis na plataforma.</p></div></li>
              </ol>
            </section>
          </div>
          <aside className="account-page__side" aria-label="Perfil e segurança">
            <section className="account-page__panel account-page__identity"><h2>Seu perfil</h2><div className="account-page__person"><span className="account-page__avatar" aria-hidden="true">{firstName?.charAt(0).toUpperCase()}</span><div><strong>{user.displayName}</strong><span>{user.email}</span></div></div><button type="button" className="account-page__row-action" onClick={() => reveal('profile')}><Icon name="clipboard" size={19} />Editar perfil <span aria-hidden="true">›</span></button><a className="account-page__row-action" href="#account-plan-title"><Icon name="compass" size={19} />Ver preferências <span aria-hidden="true">›</span></a></section>
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
