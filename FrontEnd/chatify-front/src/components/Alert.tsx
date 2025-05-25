import { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useTheme } from "@mui/material/styles";

// Posibles tipos de altertas
type AlertType = 'success' | 'error' | 'info';

// Contexto para manejar las alertas
interface AlertContextType {
  customAlert: (type: AlertType, message: string) => void;
}
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Función para acceder a poner alertas
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};

// Provedor de alertas
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AlertType>('info');
  const [message, setMessage] = useState('');
  const theme = useTheme();

  // Función para personalizar la alerta
  const customAlert = (alertType: AlertType, msg: string) => {
    setType(alertType);
    setMessage(msg);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <AlertContext.Provider value={{ customAlert }}>
      {children}
      <Snackbar open={open} autoHideDuration={30000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          onClose={handleClose}
          severity={type}
          sx={{
            width: '100%',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            '& .MuiAlert-icon': { color: theme.palette.text.primary },
            '& .MuiIconButton-root': {
              outline: 'none',
              border: 'none',
              boxShadow: 'none',
            },
            '& .MuiIconButton-root:focus': {
              outline: 'none',
              border: 'none',
              boxShadow: 'none',
            },
            '& .MuiIconButton-root:focus-visible': {
              outline: 'none',
              border: 'none',
              boxShadow: 'none',
            },
            '& .MuiIconButton-root:active': {
              outline: 'none',
              border: 'none',
              boxShadow: 'none',
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
