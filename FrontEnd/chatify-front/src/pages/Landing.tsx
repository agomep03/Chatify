import { Box, useTheme } from "@mui/material";
import TopBarLanding from "../components/TopBar/TopBarLanding";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../api/authService";
import LandingHero from "../components/Landing/LandingHero";
import LandingInfoCards from "../components/Landing/LandingInfoCards";
import LandingFooter from "../components/Landing/LandingFooter";
import { getScrollbarStyles } from "../styles/scrollbarStyles";
import logoImg from "../assets/Logo.png";
import logoSpotify from "../assets/Spotify.png";
import logoPlaylist from "../assets/Playlist.png";
import logoIA from "../assets/IA.png";
import logoChat from "../assets/Bot.png";
import logoLyrics from "../assets/Lyrics.png";
import imageBackgroundLight from "../assets/background_music.jpeg";
import imageBackgroundDark from "../assets/background_music_dark.jpeg";

type LandingProps = {
  toggleTheme: () => void;
};

const isAuthenticated = () => !!localStorage.getItem("token");

const Landing: React.FC<LandingProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const loggedIn = isAuthenticated();
  const [username, setUsername] = useState<string | null>(null);


  const backgroundImage =
    theme.palette.mode === "dark"
      ? `url(${imageBackgroundDark})`
      : `url(${imageBackgroundLight})`;

    
  const infoCardsData = [
    {
      title: "Conecta tu cuenta de Spotify",
      description: "Inicia sesión y vincula tu cuenta de Spotify para desbloquear todas las funcionalidades de Chatify.",
      image: logoSpotify,
    },
    {
      title: "Explora tus playlists",
      description: "Accede rápidamente a tus playlists de Spotify. Administra tus listas, consulta sus detalles y descubre nueva música sin salir de la app.",
      image: logoPlaylist,
    },
    {
      title: "Crea con inteligencia artificial",
      description: "Escribe una idea, un estado de ánimo o un tema, y deja que nuestra IA genere una playlist hecha a medida para ti. Rápido, fácil e inteligente.",
      image: logoIA,
    },
    {
      title: "Habla sobre música",
      description: "Conversa con nuestra IA sobre géneros, artistas, recomendaciones y mucho más. Una experiencia interactiva para amantes de la música.",
      image: logoChat,
    },
    {
      title: "Ver letras de canciones",
      description: "Accede a la letra de las canciones de tus playlists. Perfecto para cantar, entender mejor la música o simplemente disfrutarla más.",
      image: logoLyrics,
    },
  ];

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
      <TopBarLanding toggleTheme={toggleTheme} />
      {/* Contenido con scroll, empieza justo debajo de la TopBar */}
      <Box
        sx={{
          flex:1,
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
        {/* Sección principal ocupa toda la altura de la ventana */}
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
        <LandingInfoCards infoCardsData={infoCardsData} />
        <LandingFooter />
      </Box>
    </Box>
  );
};

export default Landing;