import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TopBar from "../components/TopBar/TopBarLoginRegister";
import imageBackgroundLight from "../assets/background_music.jpeg";
import imageBackgroundDark from "../assets/background_music_dark.jpeg";

/**
 * Layout para las páginas de login y registro.
 * @component
 * @param {React.ReactNode} children - Contenido a renderizar dentro del layout (formularios de login/registro).
 * @param {() => void} toggleTheme - Función para alternar entre modo claro y oscuro.
 * @returns {JSX.Element} Layout con fondo personalizado, barra superior y contenido centrado.
 * @description
 * Proporciona un fondo con imagen (diferente para modo claro/oscuro), centra el contenido y muestra la barra superior flotante.
 * El layout es responsivo y cubre toda la pantalla.
 */

type LoginRegisterLayoutProps = {
  children: React.ReactNode;
  toggleTheme: () => void;
};

const LoginRegisterLayout: React.FC<LoginRegisterLayoutProps> = ({ children, toggleTheme }) => {
  const theme = useTheme();
  // Selecciona la imagen de fondo según el modo de tema
  const backgroundImage =
    theme.palette.mode === "dark"
      ? `url(${imageBackgroundDark})`
      : `url(${imageBackgroundLight})`;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.palette.background.paper,
        backgroundImage: backgroundImage,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflow: "hidden",
        zIndex: 0,
        position: "relative",
      }}
    >
      {/* Barra superior flotante con botón de tema e inicio */}
      <TopBar toggleTheme={toggleTheme} />
      {/* Contenido principal (formularios) */}
      {children}
    </Box>
  );
};

export default LoginRegisterLayout;