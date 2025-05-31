import { ReactNode, useState } from 'react';
import CustomDialogDefault from './CustomDialogs/CustomDialogDefault';
import CustomDialogDarkBackground from './CustomDialogs/CustomDialogDarkBackground';

// Configuración de los botones
type ButtonConfig = {
  label: string;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  action?: () => void;
};

// Propiedades del diálogo de confirmación
type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
  buttons?: ButtonConfig[];
  dialogStyle?: "default" | "darkBackground";
  title?: string; // Para modo darkBackground
  showCloseIcon?: boolean; // Para modo darkBackground
};

// Componente para mostrar el diálogo de confirmación
const CustomDialog = (props: ConfirmDialogProps) => {
  const {
    open,
    onClose,
    onConfirm,
    children,
    buttons,
    dialogStyle = "default",
    title,
    showCloseIcon = false,
  } = props;

  const defaultButtons: ButtonConfig[] = [
    { label: 'Cancelar', color: 'secondary' },
    { label: 'Aceptar', color: 'primary' }
  ];
  //Si el usuarios los especifica usa maximo 2 botones, sino usa los por defecto
  const resolvedButtons = buttons === undefined
    ? defaultButtons
    : buttons.slice(0, 2);

  const buttonsWithActions = resolvedButtons.map((btn, i) => ({
    ...btn,
    action: i === 0 ? onClose : onConfirm,
  }));

  if (dialogStyle === "darkBackground") {
    return (
      <CustomDialogDarkBackground
        open={open}
        onClose={onClose}
        onConfirm={onConfirm}
        children={children}
        buttons={buttonsWithActions}
        title={title}
        showCloseIcon={showCloseIcon}
      />
    );
  }

  return (
    <CustomDialogDefault
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      children={children}
      buttons={buttonsWithActions}
    />
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
      <CustomDialog
        open={open}
        onClose={handleClose}
        onConfirm={onConfirm}
        buttons={buttons}
      >
        {content}
      </CustomDialog>
    </>
  );
};

export default CustomDialog;