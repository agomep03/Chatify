import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ConfirmProvider} from './components/Dialog.tsx'
import { AlertProvider } from './components/Alert.tsx'
import { ThemeProvider } from '@mui/material/styles';
import {darkTheme} from './theme/DarkTheme'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={darkTheme}>
    <StrictMode>
      <AlertProvider>
        <ConfirmProvider>
          <App />
        </ConfirmProvider>
      </AlertProvider>
    </StrictMode>
  </ThemeProvider>
)
