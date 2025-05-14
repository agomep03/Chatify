import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ConfirmProvider} from './components/Dialog.tsx'
import { AlertProvider } from './components/Alert.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlertProvider>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </AlertProvider>
  </StrictMode>,
)
