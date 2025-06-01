import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useTheme } from "@mui/material/styles";

/**
 * Contexto y proveedor para mostrar alertas personalizadas en la aplicación.
 * @module Alert
 * @typedef {'success' | 'error' | 'info'} AlertType - Tipos de alerta permitidos.
 * @component
 * @returns {JSX.Element} Proveedor de alertas que muestra un Snackbar con mensaje.
 * @description
 * Permite mostrar alertas (éxito, error, info) desde cualquier parte de la app usando el hook useAlert().
 * El mensaje aparece en la esquina superior derecha y se cierra automáticamente o al pulsar el botón de cerrar.
 */

// Posibles tipos de alertas
type AlertType = 'success' | 'error' | 'info';

// Interfaz del contexto de alertas
interface AlertContextType {
  customAlert: (type: AlertType, message: string) => void;
}

// Contexto para manejar las alertas
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Hook para acceder a la función de mostrar alertas
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};

// Proveedor de alertas: envuelve la app y permite mostrar alertas desde cualquier sitio
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AlertType>('info');
  const [message, setMessage] = useState('');
  const theme = useTheme();

  // Función para mostrar una alerta personalizada
  const customAlert = (alertType: AlertType, msg: string) => {
    setType(alertType);
    setMessage(msg);
    setOpen(true);
  };

  // Cierra la alerta
  const handleClose = () => setOpen(false);

  // Memoiza el objeto para evitar renders innecesarios
  const contextValue = useMemo(() => ({ customAlert }), []);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {/* Snackbar que muestra la alerta en la esquina superior derecha */}
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
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
