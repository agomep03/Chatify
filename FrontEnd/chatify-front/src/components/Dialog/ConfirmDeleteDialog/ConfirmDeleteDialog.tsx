import CustomDialog from "../Dialog";
import { Typography, CircularProgress, Box } from "@mui/material";

/**
 * Diálogo de confirmación para borrar un elemento.
 * @component
 * @param {boolean} open - Si el diálogo está abierto.
 * @param {() => void} onClose - Función para cerrar el diálogo.
 * @param {() => void} onConfirm - Función que se ejecuta al confirmar el borrado.
 * @param {string} [itemName] - Nombre del elemento a borrar (opcional, para mostrar en el mensaje).
 * @param {boolean} [loading=false] - Si se está procesando el borrado (muestra un spinner).
 * @returns {JSX.Element} Diálogo de confirmación con botones Cancelar y Eliminar.
 * @description
 * Muestra un diálogo para confirmar el borrado de un elemento.
 * Si loading es true, muestra un spinner de carga.
 * Usa el estilo "darkBackground" y permite cerrar con un icono.
 */
interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  loading?: boolean;
}

const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  itemName,
  loading = false,
}: ConfirmDeleteDialogProps) => (
  <CustomDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    buttons={[
      { label: "Cancelar", color: "secondary" },
      { label: "Eliminar", color: "error" },
    ]}
    dialogStyle="darkBackground"
    title="Confirmar borrado"
    showCloseIcon
  >
    {loading ? (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 60,
        }}
      >
        <CircularProgress size={28} />
      </Box>
    ) : (
      <Typography variant="body1" sx={{ p: 1 }}>
        ¿Estás seguro de que quieres borrar{" "}
        {itemName ? `"${itemName}"` : "este elemento"}?
      </Typography>
    )}
  </CustomDialog>
);

export default ConfirmDeleteDialog;
