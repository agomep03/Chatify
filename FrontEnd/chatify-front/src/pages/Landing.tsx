import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type LandingProps = {
  toggleTheme: () => void;
};

const Landing: React.FC<LandingProps> = ({ toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        gap: 3,
      }}
    >
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