import { Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * Overlay de carga para formularios.
 * @component
 * @param {boolean} [loading=false] - Si es true, muestra el overlay de carga.
 * @param {boolean} [noBackground=false] - Si es true, el overlay es transparente; si es false, usa el fondo del tema.
 * @returns {JSX.Element|null} Overlay con spinner de carga, o null si loading es false.
 * @description
 * Muestra un overlay con un spinner centrado sobre el formulario mientras loading es true.
 * Puede usarse con fondo opaco o transparente según la prop noBackground.
 * Cubre todo el formulario y evita la interacción mientras se muestra.
 */

interface FormLoadingOverlayProps {
  loading?: boolean;
  noBackground?: boolean;
}

const FormLoadingOverlay = ({
  loading = false,
  noBackground = false,
}: FormLoadingOverlayProps) => {
  const theme = useTheme();

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bgcolor: noBackground
          ? "transparent"
          : theme.palette.background.default,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2,
        zIndex: 10,
      }}
    >
      <CircularProgress sx={{ color: theme.palette.text.primary }} />
    </Box>
  );
};

export default FormLoadingOverlay;
