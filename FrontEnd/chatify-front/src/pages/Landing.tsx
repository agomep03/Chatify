import { Box, Typography, useTheme } from "@mui/material";
import TopBarLanding from "../components/TopBar/TopBarLanding";
import LogoLarge from "../components/Logo/LogoLarge";
import logoImg from "../assets/Logo.png";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../api/authService";

type LandingProps = {
  toggleTheme: () => void;
};

const isAuthenticated = () => !!localStorage.getItem("token");

const Landing: React.FC<LandingProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const loggedIn = isAuthenticated();
  const [username, setUsername] = useState<string | null>(null);

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
        display: "flex",
        flexDirection: "column",
        background: "#f5f5f5",
        position: "relative",
      }}
    >
      <TopBarLanding toggleTheme={toggleTheme} />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          backgroundColor: theme.palette.background.default
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
          </Box>
          {/* Logo a la derecha */}
          <LogoLarge logoUrl={logoImg} />
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;