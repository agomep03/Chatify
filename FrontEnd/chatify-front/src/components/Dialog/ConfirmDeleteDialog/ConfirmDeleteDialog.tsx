import CustomDialog from "../Dialog";
import { Typography, CircularProgress, Box } from "@mui/material";

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
