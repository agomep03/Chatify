import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Logo from "../../Logo/Logo";

/**
 * Cabecera reutilizable para formularios.
 * @component
 * @param {string} title - Título que se muestra en la cabecera.
 * @param {string} [logoUrl] - URL del logo a mostrar (opcional).
 * @param {boolean} [showHomeButton=false] - Si es true, muestra un botón para volver a /home.
 * @returns {JSX.Element} Cabecera con título, logo y botón de volver opcional.
 * @description
 * Muestra una cabecera centrada con el título del formulario, un logo opcional y un botón para volver a la página principal si se indica.
 * El botón de volver usa un icono de flecha y estilos personalizados según el tema.
 */

interface FormHeaderProps {
  title: string;
  logoUrl?: string;
  showHomeButton?: boolean;
}

const FormHeader = ({ title, logoUrl, showHomeButton = false }: FormHeaderProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        width: "100%",
        justifyContent: "center",
        gap: showHomeButton ? 2 : 0,
      }}
    >
      {/* Botón para volver a la página principal, solo si showHomeButton es true */}
      {showHomeButton && (
        <Button
          variant="contained"
          size="small"
          disableRipple
          disableFocusRipple
          disableElevation
          sx={{
            boxShadow: "none",
            minWidth: 0,
            p: "6px",
            border: "none",
            backgroundColor: theme.palette.background.default,
            "&:hover": {
              backgroundColor: theme.palette.background.default,
              boxShadow: "none",
            },
            "&:active": {
              border: "none",
              outline: "none",
              boxShadow: "none",
            },
            "&:focus-visible": {
              border: "none",
              outline: "none",
              boxShadow: "none",
            },
            "&:focus": {
              border: "none",
              outline: "none",
              boxShadow: "none",
            },
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => navigate("/home")}
        >
          <ArrowBackIcon sx={{ color: theme.palette.text.primary }} />
        </Button>
      )}
      {/* Logo y título del formulario */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 0,
          justifyContent: "center",
        }}
      >
        {logoUrl && <Logo logoUrl={logoUrl} />}
        <Typography
          variant="h5"
          sx={{ color: theme.palette.text.primary, ml: logoUrl ? 1 : 0 }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default FormHeader;
