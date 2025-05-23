import { Box, Link, Typography } from "@mui/material";
import Form from "../components/Form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { useEffect, useState } from "react";
import { useAlert } from "../components/Alert";
import logo from '../assets/Logo.png';
import { loginUser } from "../api/authService";

/**
 * Pagina de inicio de sesión.
 * @returns {JSX.Element} Componente de inicio de sesión.
 * @description Este componente permite a los usuarios iniciar sesión en la aplicación.
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { customAlert } = useAlert();

  // Mostrar alerta si el usuario cambió su correo
  useEffect(() => {
    if (localStorage.getItem("showEmailChangedAlert")) {
      customAlert(
        "info",
        "Has cambiado tu correo electrónico. Por seguridad, debes volver a iniciar sesión."
      );
      localStorage.removeItem("showEmailChangedAlert");
    }
    if (isAuthenticated()) {
      navigate("/home");
    }
  }, [navigate, customAlert]);

  // Campos del formulariobb
  const loginFields = [
    { name: "email", label: "Correo Electrónico", type: "email" },
    { name: "password", label: "Contraseña", type: "password" },
  ];

  /**
   * Maneja el inicio de sesión del usuario.
   * @param formData - Datos del formulario.
   * @returns {Promise<void>}
   */
  const handleLogin = async (formData: Record<string, string>) => {
    setLoading(true);
    try {
      const token = await loginUser(formData.email, formData.password);
      if (!token) {
        customAlert("error", "No se recibió un token válido.");
        return;
      }
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (error: any) {
      customAlert("error", `Error: ${error.message || "Inicio de sesión fallido"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor principal
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#191919",
      }}
    >
      {/* Contenedor del formulario */}
      <Form
        title="Iniciar Sesión"
        fields={loginFields}
        onSubmit={handleLogin}
        buttonText="Log In"
        logoUrl={logo}
        loading={loading}
      >
        {/* Link para ir al registro */}
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="white">
            ¿No tienes una cuenta?{" "}
            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
              color="primary"
            >
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Form>
    </Box>
  );
};

export default Login;
