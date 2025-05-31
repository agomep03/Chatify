import { Box, Link, Typography } from "@mui/material";
import Form from "../components/Form/Form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { useEffect, useState } from "react";
import { useAlert } from "../components/Alert/Alert";
import logo_light from '../assets/Logo.png';
import logo_dark from '../assets/Logo_dark.png';
import { loginUser } from "../api/authService";
import { useTheme } from "@mui/material/styles";
import { fetchVerifySpotifyConnection } from "../api/spotifyService";
import LoginRegisterLayout from "../layouts/LoginRegisterLayout";

type LoginProps = {
  toggleTheme: () => void;
};

/**
 * Pagina de inicio de sesión.
 * @returns {JSX.Element} Componente de inicio de sesión.
 * @description Este componente permite a los usuarios iniciar sesión en la aplicación.
 * @param {() => void} props.toggleTheme - Función para cambiar el tema de colores de la aplicación.
 */
const Login: React.FC<LoginProps> = ({ toggleTheme }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { customAlert } = useAlert();
  const theme = useTheme();

  // Selecciona el logo opuesto al tema actual
  const logo = theme.palette.mode === "light" ? logo_dark : logo_light;

  // Mostrar alerta si el usuario cambió su correo
  useEffect(() => {
    if (localStorage.getItem("showEmailChangedAlert")) {
      customAlert(
        "info",
        "Has cambiado tu correo electrónico. Por seguridad, debes volver a iniciar sesión."
      );
      localStorage.removeItem("showEmailChangedAlert");
    }
    // Mostrar alerta si viene de un redirect por token inválido
    const forcedLogoutMsg = localStorage.getItem("forcedLogoutMsg");
    if (forcedLogoutMsg) {
      customAlert("error", forcedLogoutMsg);
      localStorage.removeItem("forcedLogoutMsg");
    }
    if (isAuthenticated()) {
      navigate("/home");
    }
  }, [navigate, customAlert]);

  // Campos del formulariobb
  const loginFields = [
    { name: "email", label: "Correo Electrónico", type: "email", required: true },
    { name: "password", label: "Contraseña", type: "password", required: true },
  ];

  /**
   * Maneja el inicio de sesión del usuario.
   * @param formData - Datos del formulario.
   * @returns {Promise<void>}
   */
  const handleLogin = async (formData: Record<string, string>) => {
    setLoading(true);
    try {
      const { token, redirect_url } = await loginUser(formData.email, formData.password);
      if (!token) {
        customAlert("error", "No se recibió un token válido.");
        return;
      }
      localStorage.setItem("token", token);
      const spotifyConnected = await fetchVerifySpotifyConnection();
      if(spotifyConnected){
        navigate("/home");
      }else{
        customAlert("info","Debes volver a conectar tu cuenta de Spotify");
        window.location.href = redirect_url;
      }
    } catch (error: any) {
      customAlert("error", `Error: ${error.message || "Inicio de sesión fallido"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginRegisterLayout toggleTheme={toggleTheme}>
      <Form
        title="Iniciar Sesión"
        fields={loginFields}
        onSubmit={handleLogin}
        buttonText="Iniciar Sesión"
        logoUrl={logo}
        loading={loading}
      >
        {/* Link para ir al registro */}
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            ¿No tienes una cuenta?{" "}
            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
              color="primary"
              sx={{
                "&:hover": {
                  color: theme.palette.custom.primaryHover,
                },
              }}
            >
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Form>
    </LoginRegisterLayout>
  );
};

export default Login;
