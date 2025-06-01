import { Dialog, DialogContent, Box, Button, DialogTitle, IconButton } from '@mui/material';
import { ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import { getDialogButtonStyles } from '../styles/buttonStyles';

/**
 * Diálogo personalizado con fondo oscuro para confirmaciones o acciones importantes.
 * @component
 * @param {boolean} open - Si el diálogo está abierto.
 * @param {() => void} onClose - Función para cerrar el diálogo.
 * @param {ReactNode} children - Contenido del diálogo.
 * @param {Array} buttons - Configuración de los botones a mostrar (label, color, action).
 * @param {string} [title] - Título del diálogo.
 * @param {boolean} [showCloseIcon=false] - Si se muestra el icono de cerrar en la esquina.
 * @returns {JSX.Element} Diálogo estilizado con fondo oscuro y botones personalizados.
 * @description
 * Este componente muestra un diálogo centrado con fondo oscuro y botones de acción.
 * Es responsivo: ocupa todo el ancho en móvil y tiene bordes redondeados en escritorio.
 * Permite mostrar un título, un icono de cerrar y cualquier contenido como children.
 */
type ButtonConfig = {
  label: string;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  action?: () => void;
};

type CustomDialogDarkBackgroundProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  buttons: ButtonConfig[];
  title?: string;
  showCloseIcon?: boolean;
};

const CustomDialogDarkBackground = ({
  open,
  onClose,
  children,
  buttons,
  title,
  showCloseIcon = false,
}: CustomDialogDarkBackgroundProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? false : "sm"}
      fullWidth={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          width: 'auto',
          m: 0,
        }
      }}
    >
      {/* Título y botón de cerrar */}
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {title}
        {showCloseIcon && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              outline: "none",
              border: "none",
              boxShadow: "none",
              "&:focus": { outline: "none", border: "none", boxShadow: "none" },
              "&:focus-visible": { outline: "none", border: "none", boxShadow: "none" },
              "&:active": { outline: "none", border: "none", boxShadow: "none" },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      {/* Contenido principal y botones */}
      <DialogContent dividers>
        {children}
        <Box mt={3} display="flex" justifyContent="center" gap={1} sx={{ flexWrap: 'nowrap', overflowX: 'hidden' }}>
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

export default CustomDialogDarkBackground;
