import { Box, Container, Link, Typography } from "@mui/material";
import Form from "../components/Form";
import { NavigateFunction, Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { useEffect } from "react";
import config from "../config";

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/chat");
    }
  }, [navigate]);

  // Campos para el login
  const loginFields = [
    { name: "email", label: "Correo Electrónico", type: "email" },
    { name: "password", label: "Contraseña", type: "password" },
  ];

  // Función que maneja el login
  const handleLogin = async (formData: Record<string, string>) => {
    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error: ${errorText || "Inicio de sesión fallido"}`);
        return;
      }

      // Intenta primero como texto
      const contentType = response.headers.get("content-type");
      let token: string | undefined;

      if (contentType?.includes("application/json")) {
        const data = await response.json();
        token = data.token || data.access_token;
      } else {
        token = await response.text();
      }

      if (!token) {
        alert("No se recibió un token válido.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/chat");
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Centrado horizontal
        alignItems: "center", // Centrado vertical
        width: "100vw", // Ancho de la ventana
        height: "100vh", // Alto de la ventana
        backgroundColor: "#191919", // Opcional: color de fondo
      }}
    >
      <Container maxWidth="xs">
        <Form
          title="Iniciar Sesión"
          fields={loginFields}
          onSubmit={handleLogin}
          buttonText="Log In"
          logoUrl="../src/assets/Logo.png"
        />
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
      </Container>
    </Box>
  );
};

export default Login;
