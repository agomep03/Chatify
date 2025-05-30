import { Box, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThemeButton from "../Buttons/ThemeButton/ThemeButton";
import AppButton from "../Buttons/AppButton/AppButton";

const isAuthenticated = () => !!localStorage.getItem("token");

type TopBarLandingProps = {
  toggleTheme: () => void;
};

const TopBarLanding: React.FC<TopBarLandingProps> = ({ toggleTheme }) => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 1.5,
        zIndex: 10,
        backgroundColor: theme.palette.background.paper,
        padding: '8px 40px 8px 24px', // más padding a la derecha
        boxShadow: theme.shadows[4],
        borderRadius: 0,
      }}
    >
      <ThemeButton
        toggleTheme={toggleTheme}
        sx={{ color: theme.palette.primary.main, "&:hover": { backgroundColor: theme.palette.action.hover } }}
      />
      <Box sx={{ marginRight: 5 }} >
        {loggedIn ? (
            <AppButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/home")}
            >
            Ir a mi cuenta
            </AppButton>
        ) : (
            <>
            <AppButton
                variant="contained"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{ marginRight: 1.5 }}
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
        )}
      </Box>
    </Box>
  );
};

export default TopBarLanding;