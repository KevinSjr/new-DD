import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { CountryGuidePage } from './pages/CountryGuidePage'
import { GermanyGuidePage } from './pages/GermanyGuidePage'
import { AustraliaGuidePage } from './pages/AustraliaGuidePage'
import { BelgiumGuidePage } from './pages/BelgiumGuidePage'
import { CanadaGuidePage } from './pages/CanadaGuidePage'
import { ChinaGuidePage } from './pages/ChinaGuidePage'
import { SouthKoreaGuidePage } from './pages/SouthKoreaGuidePage'
import { DenmarkGuidePage } from './pages/DenmarkGuidePage'
import { SpainGuidePage } from './pages/SpainGuidePage'
import { UnitedStatesGuidePage } from './pages/UnitedStatesGuidePage'
import { FinlandGuidePage } from './pages/FinlandGuidePage'
import { FranceGuidePage } from './pages/FranceGuidePage'
import { NetherlandsGuidePage } from './pages/NetherlandsGuidePage'
import { IrelandGuidePage } from './pages/IrelandGuidePage'
import { ItalyGuidePage } from './pages/ItalyGuidePage'
import { JapanGuidePage } from './pages/JapanGuidePage'
import { MalaysiaGuidePage } from './pages/MalaysiaGuidePage'
import { NorwayGuidePage } from './pages/NorwayGuidePage'
import { PortugalGuidePage } from './pages/PortugalGuidePage'
import { UnitedKingdomGuidePage } from './pages/UnitedKingdomGuidePage'
import { SingaporeGuidePage } from './pages/SingaporeGuidePage'
import { SwitzerlandGuidePage } from './pages/SwitzerlandGuidePage'
import { SwedenGuidePage } from './pages/SwedenGuidePage'
import { TaiwanGuidePage } from './pages/TaiwanGuidePage'
import { RankingPage } from './pages/RankingPage'
import { RankingsHubPage } from './pages/RankingsHubPage'
import { SubjectAreaRankingPage } from './pages/SubjectAreaRankingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { VocationalTestPage } from './pages/VocationalTestPage'
import { GpaCalculatorPage } from './pages/GpaCalculatorPage'
import { DestinationFinderPage } from './pages/DestinationFinderPage'
import { AdminScholarshipsPage } from './pages/AdminScholarshipsPage'
import { ScholarshipSearchPage } from './pages/ScholarshipSearchPage'
import { ExamCatalogPage } from './pages/ExamCatalogPage'
import { SatHomePage, SatDailyPage, SatExamPage } from './pages/SatPage'
import { MextHomePage, MextDailyPage, MextExamPage } from './pages/MextPage'
import { AdminSatPage } from './pages/AdminSatPage'
import { useLocation } from './router/navigation'

/*
 * Rotas do site:
 *   /                  página inicial
 *   /paises/<slug>     guia de um país (slug definido em data/countries.ts)
 *   /rankings          escolha de ranking
 *   /ranking           ranking de universidades QS 2027
 *   /teste-vocacional   questionário exploratório de interesses
 *   /exames             catálogo das provas da plataforma
 *   /exames/sat         escolha entre desafio diário e simulado em papel
 *   /admin/sat          CRUD protegido do banco de questões SAT
 *   /rankings/artes-humanidades     ranking da área QS 2026
 *   /rankings/engenharia-tecnologia ranking da área QS 2026
 *   /rankings/ciencias-da-vida-medicina ranking da área QS 2026
 *   /rankings/ciencias-naturais ranking da área QS 2026
 *   /rankings/ciencias-sociais-administracao ranking da área QS 2026
 *   qualquer outra     página não encontrada
 */
function Routes() {
  const { pathname, search } = useLocation()
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  if (path === '/') return <HomePage />
  if (path === '/rankings') return <RankingsHubPage />
  if (path === '/ranking') return <RankingPage />
  if (path === '/teste-vocacional') return <VocationalTestPage />
  if (path === '/calculadora-gpa') return <GpaCalculatorPage />
  if (path === '/descobridor-de-destinos') return <DestinationFinderPage />
  if (path === '/bolsas') return <ScholarshipSearchPage />
  if (path === '/exames') return <ExamCatalogPage />
  if (path === '/exames/sat') return <SatHomePage />
  if (path === '/exames/sat/desafio-diario') return <SatDailyPage />
  if (path === '/exames/sat/simulado') return <SatExamPage />
  if (path === '/exames/mext') return <MextHomePage />
  if (path === '/exames/mext/desafio-diario') return <MextDailyPage />
  if (path === '/exames/mext/exame') return <MextExamPage key={search} />
  if (path === '/admin/sat') return <AdminSatPage />
  if (path === '/admin/bolsas') return <AdminScholarshipsPage />
  if (path === '/rankings/artes-humanidades') return <SubjectAreaRankingPage key="arts-humanities" areaKey="arts-humanities" />
  if (path === '/rankings/engenharia-tecnologia') return <SubjectAreaRankingPage key="engineering-technology" areaKey="engineering-technology" />
  if (path === '/rankings/ciencias-da-vida-medicina') return <SubjectAreaRankingPage key="life-sciences-medicine" areaKey="life-sciences-medicine" />
  if (path === '/rankings/ciencias-naturais') return <SubjectAreaRankingPage key="natural-sciences" areaKey="natural-sciences" />
  if (path === '/rankings/ciencias-sociais-administracao') return <SubjectAreaRankingPage key="social-sciences-management" areaKey="social-sciences-management" />
  if (path === '/paises/alemanha') return <GermanyGuidePage />
  if (path === '/paises/australia') return <AustraliaGuidePage />
  if (path === '/paises/belgica') return <BelgiumGuidePage />
  if (path === '/paises/canada') return <CanadaGuidePage />
  if (path === '/paises/china') return <ChinaGuidePage />
  if (path === '/paises/coreia-do-sul') return <SouthKoreaGuidePage />
  if (path === '/paises/dinamarca') return <DenmarkGuidePage />
  if (path === '/paises/espanha') return <SpainGuidePage />
  if (path === '/paises/estados-unidos') return <UnitedStatesGuidePage />
  if (path === '/paises/finlandia') return <FinlandGuidePage />
  if (path === '/paises/franca') return <FranceGuidePage />
  if (path === '/paises/paises-baixos') return <NetherlandsGuidePage />
  if (path === '/paises/irlanda') return <IrelandGuidePage />
  if (path === '/paises/italia') return <ItalyGuidePage />
  if (path === '/paises/japao') return <JapanGuidePage />
  if (path === '/paises/malasia') return <MalaysiaGuidePage />
  if (path === '/paises/noruega') return <NorwayGuidePage />
  if (path === '/paises/portugal') return <PortugalGuidePage />
  if (path === '/paises/reino-unido') return <UnitedKingdomGuidePage />
  if (path === '/paises/singapura') return <SingaporeGuidePage />
  if (path === '/paises/suica') return <SwitzerlandGuidePage />
  if (path === '/paises/suecia') return <SwedenGuidePage />
  if (path === '/paises/taiwan') return <TaiwanGuidePage />

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
