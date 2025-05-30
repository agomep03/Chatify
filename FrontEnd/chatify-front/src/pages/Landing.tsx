import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TopBarLanding from "../components/TopBar/TopBarLanding";

type LandingProps = {
  toggleTheme: () => void;
};

const Landing: React.FC<LandingProps> = ({ toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        gap: 3,
        position: "relative",
      }}
    >
      <TopBarLanding toggleTheme={toggleTheme}/>
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        ¡Bienvenido a Chatify!
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Tu plataforma para chatear y compartir música.
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
          Iniciar sesión
        </Button>
        <Button variant="outlined" color="primary" onClick={() => navigate("/register")}>
          Registrarse
        </Button>
      </Box>
    </Box>
  );
};

export default Landing;