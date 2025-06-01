import { Dialog, DialogContent, Box, Button } from '@mui/material';
import { ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getDialogButtonStyles } from '../styles/buttonStyles';

/**
 * Diálogo personalizado por defecto para confirmaciones o acciones generales.
 * @component
 * @param {boolean} open - Si el diálogo está abierto.
 * @param {() => void} onClose - Función para cerrar el diálogo.
 * @param {() => void} onConfirm - Función que se ejecuta al confirmar la acción principal.
 * @param {ReactNode} children - Contenido del diálogo.
 * @param {Array} buttons - Configuración de los botones a mostrar (label, color, action).
 * @returns {JSX.Element} Diálogo estilizado con botones personalizados.
 * @description
 * Este componente muestra un diálogo centrado con fondo claro y botones de acción.
 * Es responsivo: ocupa todo el ancho en móvil y tiene bordes redondeados en escritorio.
 * Permite mostrar cualquier contenido como children y botones personalizados.
 */

type ButtonConfig = {
  label: string;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  action?: () => void;
};

type CustomDialogDefaultProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
  buttons: ButtonConfig[];
};

const CustomDialogDefault = ({
  open,
  onClose,
  children,
  buttons,
}: CustomDialogDefaultProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      hideBackdrop
      disableEscapeKeyDown
      fullWidth={isMobile}
      maxWidth={isMobile ? false : "sm"}
      slotProps={{
        paper: {
          sx: {
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: theme.palette.background.default,
            borderRadius: isMobile ? 0 : 2,
            boxShadow: 3,
            color: theme.palette.text.primary,
            width: 'auto',
            minHeight: 'auto',
            padding: 0,
            m: 0,
          }
        }
      }}
    >
      <DialogContent>
        {/* Contenido principal del diálogo */}
        <Box sx={{ padding: 0, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', overflowX: 'hidden', width: '100%'}}>
          {children}
        </Box>
        {/* Botones de acción */}
        <Box mt={3} display="flex" justifyContent="center" gap={1} sx={{flexWrap: 'wrap', overflowX: 'hidden'}}>
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              onClick={btn.action}
              color={btn.color}
              variant={idx === buttons.length - 1 ? 'contained' : 'outlined'}
              sx={getDialogButtonStyles(theme)}
            >
              {btn.label}
            </Button>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialogDefault;
