import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ConfirmProvider} from './components/Dialog.tsx'
import { AlertProvider } from './components/Alert.tsx'
import { ThemeProvider } from '@mui/material/styles'
import {darkTheme} from './theme/DarkTheme'
import { lightTheme } from './theme/LightTheme'

const getInitialMode = (): 'light' | 'dark' => {
  const saved = localStorage.getItem('themeMode');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const Root = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode);
  const theme = mode === 'light' ? lightTheme : darkTheme;
  
  const toggleTheme = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <AlertProvider>
          <ConfirmProvider>
            <App toggleTheme={toggleTheme} />
          </ConfirmProvider>
        </AlertProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Root />);