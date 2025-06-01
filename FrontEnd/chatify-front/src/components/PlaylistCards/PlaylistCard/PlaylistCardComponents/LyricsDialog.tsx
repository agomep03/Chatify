import { Typography, CircularProgress, Box } from "@mui/material";
import CustomDialogDarkBackground from "../../../Dialog/CustomDialogs/CustomDialogDarkBackground";

/**
 * Diálogo para mostrar la letra de una canción.
 * @component
 * @param {boolean} open - Si el diálogo está abierto.
 * @param {() => void} onClose - Callback para cerrar el diálogo.
 * @param {string} lyrics - Letra de la canción a mostrar.
 * @param {boolean} loading - Si está en true, muestra un spinner de carga.
 * @param {{ artist: string; name: string } | null} song - Objeto con el nombre y artista de la canción (opcional).
 * @returns {JSX.Element} Diálogo estilizado con la letra de la canción o un spinner si está cargando.
 * @description
 * Muestra un diálogo con fondo oscuro que contiene la letra de una canción.
 * Si loading es true, muestra un spinner de carga.
 * El título del diálogo incluye el nombre de la canción si está disponible.
 */
const LyricsDialog = ({
  open,
  onClose,
  lyrics,
  loading,
  song,
}: {
  open: boolean;
  onClose: () => void;
  lyrics: string;
  loading: boolean;
  song: { artist: string; name: string } | null;
}) => (
  <CustomDialogDarkBackground
    open={open}
    onClose={onClose}
    buttons={[
      {
        label: "Cerrar",
        color: "primary",
        action: onClose,
      },
    ]}
    title={song ? `Letra de "${song.name}"` : "Letra"}
    showCloseIcon
  >
    {loading ? (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 120 }}>
        <CircularProgress />
      </Box>
    ) : (
      <Typography
        variant="body2"
        sx={{
          whiteSpace: "pre-line",
          fontFamily: "monospace",
          maxHeight: 350,
          overflowY: "auto",
        }}
      >
        {lyrics}
      </Typography>
    )}
  </CustomDialogDarkBackground>
);

export default LyricsDialog;
