import { Box, useTheme } from "@mui/material";
import TopBarLanding from "../components/TopBar/TopBarLanding";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../api/authService";
import LandingHero from "../components/Landing/LandingHero";
import LandingInfoCards from "../components/Landing/LandingInfoCards";
import LandingFooter from "../components/Landing/LandingFooter";
import { getScrollbarStyles } from "../styles/scrollbarStyles";
import logoImg from "../assets/Logo.png";
import imageBackgroundLight from "../assets/background_music.jpeg";
import imageBackgroundDark from "../assets/background_music_dark.jpeg";

// Props que recibe el componente Landing
type LandingProps = {
  toggleTheme: () => void;
};

// Función para saber si el usuario está autenticado (token en localStorage)
const isAuthenticated = () => !!localStorage.getItem("token");

/**
 * Página principal de la landing de Chatify.
 * @component
 * @param {() => void} props.toggleTheme - Función para cambiar el tema de colores de la aplicación.
 * @returns {JSX.Element} Landing page con hero, tarjetas informativas y footer.
 * @description
 * Muestra la página de bienvenida de la app con:
 * - Barra superior (TopBarLanding) con cambio de tema y acceso/login.
 * - Hero con logo, título, descripción y botones principales.
 * - Tarjetas informativas sobre las funcionalidades de la app.
 * - Footer con información de derechos y contacto.
 * El diseño es responsivo y se adapta a móvil y escritorio.
 */

const Landing: React.FC<LandingProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const loggedIn = isAuthenticated();
  const [username, setUsername] = useState<string | null>(null);

  // Selecciona la imagen de fondo según el tema
  const backgroundImage =
    theme.palette.mode === "dark"
      ? `url(${imageBackgroundDark})`
      : `url(${imageBackgroundLight})`;

  // Si el usuario está logueado, intenta obtener su nombre de usuario
  useEffect(() => {
    if (loggedIn) {
      fetchUserProfile()
        .then(profile => setUsername(profile?.username || null))
        .catch(() => {
          // Si hay un error al obtener el perfil, se asume que se ha expirado la sesión
          setUsername(null);
          localStorage.removeItem("token");
          window.location.reload();
        });
    }
  }, [loggedIn]);

  // Descripción personalizada según si el usuario está logueado
  const description = loggedIn
    ? `¡Hola de nuevo${username ? ` ${username}` : ""}! Continúa explorando tus playlists, descubriendo letras y conversando sobre música con IA. ¡La experiencia sigue!`
    : "¿Estás listo para transformar tu experiencia musical? Crea playlists con IA, descubre letras y conversa sobre música.";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: theme.palette.background.default,
        backgroundImage: backgroundImage,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Barra superior con cambio de tema y login/registro */}
      <TopBarLanding toggleTheme={toggleTheme} />
      {/* Contenido principal con scroll, empieza debajo de la TopBar */}
      <Box
        sx={{
          flex: 1,
          position: "absolute",
          mt: "60px", // Altura exacta del TopBar
          left: 0,
          width: "100%",
          height: "100%",
          overflowY: "auto",
          alignItems: "center",
          justifyContent: "center",
          ...getScrollbarStyles(theme),
          "&::-webkit-scrollbar-track": {
            background: theme.palette.background.default,
            borderRadius: "4px",
          },
        }}
      >
        {/* Hero principal: logo, título, descripción y botones */}
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: { xs: "flex-start", md: "center" },
            backgroundColor: `${theme.palette.background.default}BF`, // 75% opaco (hex alpha)
            px: { xs: 1, md: 2 },
            py: { xs: 2, md: 0 },
            mt: { xs: 2, md: 0 },
          }}
        >
          <LandingHero
            logoImg={logoImg}
            description={description}
            loggedIn={loggedIn}
          />
        </Box>
        {/* Tarjetas informativas */}
        <LandingInfoCards />
        {/* Footer */}
        <LandingFooter />
      </Box>
    </Box>
  );
};

export default Landing;