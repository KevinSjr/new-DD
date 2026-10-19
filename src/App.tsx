import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { CountryGuidePage } from './pages/CountryGuidePage'
import { GermanyGuidePage } from './pages/GermanyGuidePage'
import { RankingPage } from './pages/RankingPage'
import { RankingsHubPage } from './pages/RankingsHubPage'
import { SubjectAreaRankingPage } from './pages/SubjectAreaRankingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { VocationalTestPage } from './pages/VocationalTestPage'
import { GpaCalculatorPage } from './pages/GpaCalculatorPage'
import { useLocation } from './router/navigation'

/*
 * Rotas do site:
 *   /                  página inicial
 *   /paises/<slug>     guia de um país (slug definido em data/countries.ts)
 *   /rankings          escolha de ranking
 *   /ranking           ranking de universidades QS 2027
 *   /teste-vocacional   questionário exploratório de interesses
 *   /rankings/artes-humanidades     ranking da área QS 2026
 *   /rankings/engenharia-tecnologia ranking da área QS 2026
 *   /rankings/ciencias-da-vida-medicina ranking da área QS 2026
 *   /rankings/ciencias-naturais ranking da área QS 2026
 *   /rankings/ciencias-sociais-administracao ranking da área QS 2026
 *   qualquer outra     página não encontrada
 */
function Routes() {
  const { pathname } = useLocation()
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  if (path === '/') return <HomePage />
  if (path === '/rankings') return <RankingsHubPage />
  if (path === '/ranking') return <RankingPage />
  if (path === '/teste-vocacional') return <VocationalTestPage />
  if (path === '/calculadora-gpa') return <GpaCalculatorPage />
  if (path === '/rankings/artes-humanidades') return <SubjectAreaRankingPage key="arts-humanities" areaKey="arts-humanities" />
  if (path === '/rankings/engenharia-tecnologia') return <SubjectAreaRankingPage key="engineering-technology" areaKey="engineering-technology" />
  if (path === '/rankings/ciencias-da-vida-medicina') return <SubjectAreaRankingPage key="life-sciences-medicine" areaKey="life-sciences-medicine" />
  if (path === '/rankings/ciencias-naturais') return <SubjectAreaRankingPage key="natural-sciences" areaKey="natural-sciences" />
  if (path === '/rankings/ciencias-sociais-administracao') return <SubjectAreaRankingPage key="social-sciences-management" areaKey="social-sciences-management" />
  if (path === '/paises/alemanha') return <GermanyGuidePage />

  const guide = path.match(/^\/paises\/([a-z0-9-]+)$/)
  if (guide) return <CountryGuidePage slug={guide[1]} />

  return <NotFoundPage />
}

function App() {
  return (
    <Layout>
      <Routes />
    </Layout>
  )
}

export default App
