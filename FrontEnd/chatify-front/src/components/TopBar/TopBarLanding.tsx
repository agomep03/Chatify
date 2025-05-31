import { Box, useTheme, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThemeButton from "../Buttons/ThemeButton/ThemeButton";
import AppButton from "../Buttons/AppButton/AppButton";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import useMediaQuery from "@mui/material/useMediaQuery";

const isAuthenticated = () => !!localStorage.getItem("token");

type TopBarLandingProps = {
  toggleTheme: () => void;
};

const TopBarLanding: React.FC<TopBarLandingProps> = ({ toggleTheme }) => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        position: 'static',
        top: 0,
        left: 0,
        width: '100vw',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 1.5,
        zIndex: 10,
        backgroundColor: theme.palette.background.paper,
        padding: { xs: '8px 8px', sm: '8px 40px 8px 24px' },
        boxShadow: theme.shadows[4],
        borderRadius: 0,
      }}
    >
      <ThemeButton
        toggleTheme={toggleTheme}
        sx={{ color: theme.palette.primary.main, "&:hover": { backgroundColor: theme.palette.action.hover } }}
      />
      <Box sx={{ marginRight: 5, display: "flex", alignItems: "center", gap: 1 }}>
        {loggedIn ? (
          isMobile ? (
            <Tooltip title="Ir a mi cuenta">
              <IconButton color="primary" onClick={() => navigate("/home")}>
                <LoginIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <AppButton
              size="small"
              variant="contained"
              color="primary"
              onClick={() => navigate("/home")}
            >
              Ir a mi cuenta
            </AppButton>
          )
        ) : (
          isMobile ? (
            <>
              <Tooltip title="Iniciar sesión">
                <IconButton color="primary" onClick={() => navigate("/login")}>
                  <LoginIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Registrarse">
                <IconButton color="primary" onClick={() => navigate("/register")}>
                  <PersonAddAltIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <AppButton
                size="small"
                variant="contained"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{ marginRight: 1.5 }}
              >
                Iniciar sesión
              </AppButton>
              <AppButton
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => navigate("/register")}
              >
                Registrarse
              </AppButton>
            </>
          )
        )}
      </Box>
    </Box>
  );
};

export default TopBarLanding;