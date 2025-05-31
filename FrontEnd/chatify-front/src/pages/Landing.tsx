import { Box, Typography, useTheme } from "@mui/material";
import TopBarLanding from "../components/TopBar/TopBarLanding";
import LogoLarge from "../components/Logo/LogoLarge";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../api/authService";
import InfoCard from "../layouts/InfoCardLanding";
import AppButton from "../components/Buttons/AppButton/AppButton";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();


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
          position: "absolute",
          top: "64px", // Altura exacta del TopBar
          left: 0,
          width: "100%",
          height: "calc(100% - 64px)", // Resto de la pantalla
          overflowY: "auto",
          alignItems: "center",
          justifyContent: "center",
          ...getScrollbarStyles(theme),
        }}
      >
        {/* Sección principal ocupa toda la altura de la ventana */}
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: { xs: "flex-start", md: "center" },
            px: { xs: 1, md: 2 },
            py: { xs: 2, md: 0 },
            mt: { xs: 2, md: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: 900,
              gap: { xs: 2, md: 8 },
              mx: "auto",
            }}
          >
            {/* Logo arriba en móvil, derecha en escritorio */}
            <Box
              sx={{
                order: { xs: 0, md: 1 }, // Primero en móvil, segundo en escritorio
                mb: { xs: 2, md: 0 },    // Margen abajo solo en móvil
                display: "flex",
                justifyContent: "center",
                width: { xs: "100%", md: "auto" },
              }}
            >
              <LogoLarge logoUrl={logoImg} />
            </Box>
            {/* Texto a la izquierda en escritorio, abajo en móvil */}
            <Box
              sx={{
                flex: 1,
                order: { xs: 1, md: 0 }, // Segundo en móvil, primero en escritorio
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
                background: theme.palette.mode === "light" ? "rgba(254, 250, 247, 0.7)" : "none",
                borderRadius: 2,
                px: { xs: 1, md: 0 },
                py: { xs: 1, md: 0 },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2.2rem", sm: "2.8rem", md: "5rem", lg: "8rem" },
                  color: "primary.main",
                  letterSpacing: 2,
                  mb: { xs: 1, md: 2 },
                  textShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                Chatify
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: { xs: 2, md: 4 },
                  maxWidth: 500,
                  color: theme.palette.mode === "light" ? "#222" : "text.secondary",
                  borderRadius: 2,
                  px: theme.palette.mode === "light" ? 1 : 0,
                  py: theme.palette.mode === "light" ? 0.5 : 0,
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                }}
              >
                {description}
              </Typography>
              {/* Botones de acción */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  width: { xs: "100%", sm: "auto" },
                  alignItems: "center",
                }}
              >
                {!loggedIn ? (
                  <>
                    <AppButton
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/login")}
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      Iniciar sesión
                    </AppButton>
                    <AppButton
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate("/register")}
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      Registrarse
                    </AppButton>
                  </>
                ) : (
                  <AppButton
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/home")}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    Ir a mi cuenta
                  </AppButton>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        {/* InfoCards solo visibles al hacer scroll */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: { xs: 2, md: 4 },
            px: { xs: 1, md: 2 },
            py: { xs: 1, md: 4 },
            width: { xs: "90%", md: "90%" },
            maxWidth: 900,
            mx: "auto",
          }}
        >
          {infoCardsData.map((card, index) => (
            <InfoCard
              key={index}
              title={card.title}
              description={card.description}
              image={card.image}
            />
          ))}
        </Box>
        {/* Footer */}
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "#ffffff",
            padding: 3,
            textAlign: "center",
            mt: 4,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            © {new Date().getFullYear()} Chatify. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2">
            ¿Dudas o problemas? Escríbenos a:{" "}
            <a
              href="mailto:chatify25@gmail.com"
              style={{ color: "#ffffff", textDecoration: "underline" }}
            >
              chatify25@gmail.com
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;