import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from '../pages/scene.tsx'
import {RecoilRoot} from 'recoil'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <App/>
    </RecoilRoot>
  </StrictMode>,
)
