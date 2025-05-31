import { ReactNode, useState } from 'react';
import CustomDialogDefault from './CustomDialogs/CustomDialogDefault';
import CustomDialogDarkBackground from './CustomDialogs/CustomDialogDarkBackground';

/**
 * Componente genérico para mostrar diálogos de confirmación o acciones importantes.
 * @component
 * @param {boolean} open - Si el diálogo está abierto.
 * @param {() => void} onClose - Función para cerrar el diálogo.
 * @param {() => void} onConfirm - Función que se ejecuta al confirmar la acción principal.
 * @param {ReactNode} children - Contenido del diálogo.
 * @param {Array} [buttons] - Configuración de los botones a mostrar (label, color, action).
 * @param {"default"|"darkBackground"} [dialogStyle="default"] - Estilo visual del diálogo.
 * @param {string} [title] - Título del diálogo (solo para darkBackground).
 * @param {boolean} [showCloseIcon=false] - Si se muestra el icono de cerrar (solo para darkBackground).
 * @returns {JSX.Element} Diálogo estilizado con botones personalizados.
 * @description
 * Este componente centraliza la lógica para mostrar diálogos de confirmación.
 * Permite elegir entre un estilo por defecto o uno con fondo oscuro.
 * Los botones pueden ser personalizados o usar los predeterminados.
 * Se integra con un proveedor para mostrar diálogos desde cualquier parte de la app.
 */

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

  // Botones por defecto si no se especifican
  const defaultButtons: ButtonConfig[] = [
    { label: 'Cancelar', color: 'secondary' },
    { label: 'Aceptar', color: 'primary' }
  ];
  // Si el usuario los especifica usa máximo 2 botones, sino usa los por defecto
  const resolvedButtons = buttons === undefined
    ? defaultButtons
    : buttons.slice(0, 2);

  // Asigna las acciones a los botones: el primero cierra, el segundo confirma
  const buttonsWithActions = resolvedButtons.map((btn, i) => ({
    ...btn,
    action: i === 0 ? onClose : onConfirm,
  }));

  // Renderiza el diálogo con fondo oscuro si se indica
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

  // Renderiza el diálogo por defecto
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

// Función global para activar el diálogo de confirmación desde cualquier parte de la app
let triggerConfirm: (options: {
  content: ReactNode;
  onConfirm: () => void;
  name_button1?: string;
  name_button2?: string | null;
  button1Color?: ButtonConfig['color'];
  button2Color?: ButtonConfig['color'];
}) => void = () => {};

// Hook para acceder a la función de mostrar diálogos
export const useConfirm = () => triggerConfirm;

// Proveedor de diálogos: envuelve la app y permite mostrar diálogos desde cualquier sitio
export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

  // Función que activa el diálogo con los parámetros recibidos
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