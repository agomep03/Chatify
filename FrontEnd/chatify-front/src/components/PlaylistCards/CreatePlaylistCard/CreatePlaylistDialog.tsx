import { useRef } from "react";
import CustomDialog from "../../Dialog/Dialog";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * Diálogo para crear una nueva playlist a partir de un prompt.
 * @component
 * @param {boolean} open - Si el diálogo está abierto.
 * @param {string} prompt - Texto actual del prompt ingresado por el usuario.
 * @param {boolean} loading - Si está en true, muestra un spinner de carga y deshabilita el textarea.
 * @param {string|null} error - Mensaje de error a mostrar (si existe).
 * @param {(value: string) => void} onPromptChange - Callback para actualizar el valor del prompt.
 * @param {() => void} onClose - Callback para cerrar el diálogo.
 * @param {() => void} onGenerate - Callback para generar la playlist (al enviar el formulario).
 * @returns {JSX.Element} Diálogo con textarea para el prompt, botones y feedback de carga/error.
 * @description
 * Muestra un diálogo con un textarea para que el usuario escriba un prompt para la playlist.
 * Permite cancelar o crear la playlist. Si loading es true, muestra un spinner y deshabilita la edición.
 * Muestra mensajes de error si existen.
 */
const CreatePlaylistDialog = ({
  open,
  prompt,
  loading,
  error,
  onPromptChange,
  onClose,
  onGenerate,
}: {
  open: boolean;
  prompt: string;
  loading: boolean;
  error: string | null;
  onPromptChange: (value: string) => void;
  onClose: () => void;
  onGenerate: () => void;
}) => {
  const theme = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      onConfirm={onGenerate}
      buttons={[
        { label: "Cancelar", color: "secondary" },
        { label: loading ? "Generando..." : "Crear", color: "primary" },
      ]}
    >
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate();
        }}
        sx={{
          width: "600px",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
          Ingresa un prompt para tu playlist
        </Typography>
        {/* Textarea para el prompt, deshabilitado si está cargando */}
        {!loading && (
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            rows={5}
            style={{
              width: "100%",
              minHeight: "100px",
              maxHeight: "180px",
              resize: "none",
              padding: "12px",
              borderRadius: "0px",
              border: "none",
              outline: "none",
              fontSize: "1rem",
              color: theme.palette.text.primary,
              background: theme.palette.background.paper,
              fontFamily: "inherit",
              boxSizing: "border-box",
              overflowY: "auto",
              overflowX: "hidden",
              boxShadow: "none", // <-- agrega esto para quitar la línea negra
            }}
            disabled={loading}
            placeholder="Ejemplo: Playlist para una tarde de lluvia y café"
            onFocus={e => e.currentTarget.style.boxShadow = "none"} // <-- asegura que no aparezca al enfocar
          />
        )}
        {/* Mensaje de error */}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        {/* Spinner de carga si está cargando */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100px",
              width: "100%",
            }}
          >
            <CircularProgress size={28} />
          </Box>
        )}
      </Box>
    </CustomDialog>
  );
};

export default CreatePlaylistDialog;
