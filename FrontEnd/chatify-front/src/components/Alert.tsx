import { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

type AlertType = 'success' | 'error' | 'info';

interface AlertContextType {
  customAlert: (type: AlertType, message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AlertType>('info');
  const [message, setMessage] = useState('');

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
        <Alert onClose={handleClose} severity={type}
        sx={{
            width: '100%',
            backgroundColor: '#1f1f1f',
            color: '#fff',
            '& .MuiAlert-icon': { color: '#fff' },
          }}>
          {message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
