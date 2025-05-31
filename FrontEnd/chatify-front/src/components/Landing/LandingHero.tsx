import { Box, Typography } from "@mui/material";
import LogoLarge from "../Logo/LogoLarge";
import AppButton from "../Buttons/AppButton/AppButton";
import { useNavigate } from "react-router-dom";

interface LandingHeroProps {
  logoImg: string;
  description: string;
  loggedIn: boolean;
}

const LandingHero = ({ logoImg, description, loggedIn }: LandingHeroProps) => {
  const navigate = useNavigate();

  return (
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
      <Box
        sx={{
          order: { xs: 0, md: 1 },
          mb: { xs: 2, md: 0 },
          display: "flex",
          justifyContent: "center",
          width: { xs: "100%", md: "auto" },
        }}
      >
        <LogoLarge logoUrl={logoImg} />
      </Box>
      <Box
        sx={{
          flex: 1,
          order: { xs: 1, md: 0 },
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
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
            color: "text.secondary",
            borderRadius: 2,
            px: 1,
            py: 0.5,
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
          }}
        >
          {description}
        </Typography>
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
  );
};

export default LandingHero;