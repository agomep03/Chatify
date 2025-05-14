import { Dialog, DialogContent, Box, Button } from '@mui/material';
import { ReactNode, useState } from 'react';

// Configuración de los botones
type ButtonConfig = {
  label: string;
  action: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
};

// Propiedades del diálogo de confirmación
type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
  buttons?: ButtonConfig[];
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

// Componente para mostrar el diálogo de confirmación
const ConfirmDialog = (props: ConfirmDialogProps) => {
  const {
    open,
    onClose,
    onConfirm,
    children,
    buttons,
    maxWidth = 'sm'
  } = props;

  const defaultButtons: ButtonConfig[] = [
    { label: 'Cancelar', action: onClose, color: 'secondary' },
    { label: 'Aceptar', action: onConfirm, color: 'primary' }
  ];
  //Usa 1 o 2 botones si el usuarios los especifica, sino usa los por defecto
  const resolvedButtons = buttons?.length ? buttons.slice(0, 2) : defaultButtons;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 1,
          bgcolor: "#1f1f1f",
          boxShadow: 3,
          color: "#ffffff"
        }
      }}
    >
      <DialogContent>
        <Box sx={{ padding: 2 }}>
          {children}
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
        {resolvedButtons.map((btn, idx) => (
            <Button
              key={idx}
              onClick={btn.action}
              color={btn.color}
              variant={idx === resolvedButtons.length - 1 ? 'contained' : 'outlined'}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '9999px',
                px: 3,
                py: 1,
                '&.MuiButton-contained': {
                  backgroundColor: '#3be477',
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: '#1abc54'
                  }
                },
                '&.MuiButton-outlined': {
                  borderColor: '#7c7c7c',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#ffffff'
                  }
                }
              }}
            >
              {btn.label}
            </Button>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Función para activar el diálogo de confirmación
let triggerConfirm: (options: {
  content: ReactNode;
  onConfirm: () => void;
  name_button1?: string;
  name_button2?: string | null;
  button1Color?: ButtonConfig['color'];
  button2Color?: ButtonConfig['color'];
}) => void = () => {};

// Función para acceder a poner dialogos
export const useConfirm = () => triggerConfirm;

// Provedor de dialogos
export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

  triggerConfirm = ({ 
    content, 
    onConfirm, 
    name_button1 = 'Aceptar', 
    name_button2 = null,
    button1Color = 'primary',
    button2Color = 'secondary'
  }) => {
    setContent(content);
    setOnConfirm(() => onConfirm);
    
    const newButtons = name_button2
      ? [
          { label: name_button1, action: () => setOpen(false), color: button1Color },
          { label: name_button2, action: () => { onConfirm(); setOpen(false); }, color: button2Color },
        ]
      : [
          { label: name_button1, action: () => { onConfirm(); setOpen(false); }, color: button1Color },
        ];
    
    setButtons(newButtons);
    setOpen(true); //Abrir dialogo
  };

  const handleClose = () => setOpen(false); //Cerrar dialogo

  return (
    <>
      {children}
      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onConfirm={onConfirm}
        buttons={buttons}
      >
        {content}
      </ConfirmDialog>
    </>
  );
};

export default ConfirmDialog;