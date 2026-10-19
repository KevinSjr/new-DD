import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonte Poppins hospedada junto com o site (pacote @fontsource/poppins).
// Nada é carregado de servidores externos, então o aviso de privacidade continua verdadeiro.
// Só os pesos usados (500 e 700) e só o alfabeto latino (cobre o português).
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-700.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
