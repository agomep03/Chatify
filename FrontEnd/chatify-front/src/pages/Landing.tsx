import { Box, Typography, useTheme } from "@mui/material";
import TopBarLanding from "../components/TopBar/TopBarLanding";
import LogoLarge from "../components/Logo/LogoLarge";
import logoImg from "../assets/Logo.png";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../api/authService";
import InfoCard from "../layouts/InfoCardLanding";
import AppButton from "../components/Buttons/AppButton/AppButton";
import { useNavigate } from "react-router-dom";
import { getScrollbarStyles } from "../styles/scrollbarStyles";

type LandingProps = {
  toggleTheme: () => void;
};

const isAuthenticated = () => !!localStorage.getItem("token");

const Landing: React.FC<LandingProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const loggedIn = isAuthenticated();
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      fetchUserProfile()
        .then(profile => setUsername(profile?.username || null))
        .catch(() => setUsername(null));
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
      }}
    >
      <TopBarLanding toggleTheme={toggleTheme} />
      {/* Contenido con scroll, empieza justo debajo de la TopBar */}
      <Box
        sx={{
          position: "absolute",
          top: "64px", // Altura exacta de tu TopBar
          left: 0,
          width: "100%",
          height: "calc(100% - 64px)", // Resto de la pantalla
          backgroundColor: theme.palette.background.default,
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
            alignItems: "center",
            justifyContent: "center",
            px: 2,
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
              gap: { xs: 4, md: 8 },
              mx: "auto",
            }}
          >
            {/* Texto a la izquierda */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "3rem", md: "7rem", lg: "8rem" },
                  color: "primary.main",
                  letterSpacing: 2,
                  mb: 2,
                  textShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                Chatify
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 500 }}
              >
                {description}
              </Typography>
              {/* Botones de acción */}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {!loggedIn ? (
                  <>
                    <AppButton
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/login")}
                    >
                      Iniciar sesión
                    </AppButton>
                    <AppButton
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate("/register")}
                    >
                      Registrarse
                    </AppButton>
                  </>
                ) : (
                  <AppButton
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/home")}
                  >
                    Ir a mi cuenta
                  </AppButton>
                )}
              </Box>
            </Box>
            {/* Logo a la derecha */}
            <LogoLarge logoUrl={logoImg} />
          </Box>
        </Box>
        {/* InfoCards solo visibles al hacer scroll */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            px: 2,
            py: 4,
            width: "90%",
            mx: "auto", 
          }}
        >
          <InfoCard
            title="Descubre Chatify"
            description="Chatify es tu asistente musical inteligente. Crea playlists personalizadas, descubre letras de canciones y conversa sobre música con nuestra IA avanzada."
            image={logoImg}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;