import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ConfirmProvider} from './components/Dialog.tsx'
import { AlertProvider } from './components/Alert.tsx'
import { ThemeProvider } from '@mui/material/styles'
import {darkTheme} from './theme/DarkTheme'
import { lightTheme } from './theme/LightTheme'

const Root = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <AlertProvider>
          <ConfirmProvider>
            <App toggleTheme={() => setMode(m => m === 'light' ? 'dark' : 'light')} />
          </ConfirmProvider>
        </AlertProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Root />);