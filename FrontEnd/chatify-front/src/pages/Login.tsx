import { Box, Link, Typography } from "@mui/material";
import Form from "../components/Form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { useEffect, useState } from "react";
import config from "../config";
import {useAlert} from "../components/Alert";
import logo from '../assets/Logo.png';

/**
 * Pagina de inicio de sesión.
 * @returns {JSX.Element} Componente de inicio de sesión.
 * @description Este componente permite a los usuarios iniciar sesión en la aplicación.
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { customAlert } = useAlert();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/home");
    }
  }, [navigate]);

  // Campos del formulario
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
    // Cambiar a estado de carga
    setLoading(true);

    // Datas de inicio de sesión
    const payload = {
      email: formData.email,
      password: formData.password,
    };

    // Hacer petion de inicio de sesión a la API
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Manejar la respuesta
      if (!response.ok) {
        const errorText = await response.text();
        customAlert("error",`Error: ${errorText || "Inicio de sesión fallido"}`);
        return;
      }

      // FIXME. La respuesta debería ser un JSON, ahora devuelve un string.
      // De momento, se comprobará si la respuesta es un JSON o un string.
      const contentType = response.headers.get("content-type");
      let token: string | undefined;

      // Si la respuesta es JSON, extraer el token
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        token = data.token || data.access_token;
      } else {
        // Si no es JSON, se asume que es un string
        token = await response.text();
      }

      // Comprobar si se recibió un token
      if (!token) {
        customAlert("error","No se recibió un token válido.");
        return;
      }

      // Guardar el token en localStorage y redirigir al usuario
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (error) {
      console.error("Error de red:", error);
      customAlert("error","No se pudo conectar con el servidor.");
    } finally {
      // Cambiar de nuevo a estado normal
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
