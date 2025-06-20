import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/index.scss'
import App from './pages/scene.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
