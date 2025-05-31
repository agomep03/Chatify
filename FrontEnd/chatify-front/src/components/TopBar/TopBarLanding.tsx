import { Box, useTheme, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThemeButton from "../Buttons/ThemeButton/ThemeButton";
import AppButton from "../Buttons/AppButton/AppButton";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import useMediaQuery from "@mui/material/useMediaQuery";

/**
 * Barra superior para la página de inicio (landing).
 * @component
 * @param {() => void} toggleTheme - Función para alternar entre modo claro y oscuro.
 * @returns {JSX.Element} Barra superior con botones de login, registro, acceso a cuenta y cambio de tema.
 * @description
 * Muestra la barra superior en la landing page. Si el usuario está autenticado, muestra botón para ir a su cuenta.
 * Si no está autenticado, muestra botones para iniciar sesión y registrarse.
 * El diseño es responsivo: en móvil muestra iconos, en escritorio muestra botones con texto.
 */

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
        height: '64px',
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
      {/* Botón para alternar el tema */}
      <ThemeButton
        toggleTheme={toggleTheme}
        sx={{ color: theme.palette.primary.main, "&:hover": { backgroundColor: theme.palette.action.hover } }}
      />
      {/* Botones de login, registro o acceso a cuenta según autenticación y tamaño de pantalla */}
      <Box sx={{ marginRight: 5, display: "flex", alignItems: "center", gap: 1 }}>
        {loggedIn ? (
          isMobile ? (
            // Si está autenticado y es móvil, muestra icono para ir a la cuenta
            <Tooltip title="Ir a mi cuenta">
              <IconButton color="primary" onClick={() => navigate("/home")}>
                <LoginIcon />
              </IconButton>
            </Tooltip>
          ) : (
            // Si está autenticado y es escritorio, muestra botón para ir a la cuenta
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
            // Si no está autenticado y es móvil, muestra iconos para login y registro
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
            // Si no está autenticado y es escritorio, muestra botones para login y registro
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