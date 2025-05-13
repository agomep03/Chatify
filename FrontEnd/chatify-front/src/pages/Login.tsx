import { Box, Container, Link, Typography } from "@mui/material";
import Form from "../components/Form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { useEffect, useState } from "react";
import config from "../config";
import {useAlert} from "../components/Alert";

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

  // Manejar el envío del formulario
  const handleLogin = async (formData: Record<string, string>) => {
    setLoading(true);
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
        customAlert("error",`Error: ${errorText || "Inicio de sesión fallido"}`);
        return;
      }

      const contentType = response.headers.get("content-type");
      let token: string | undefined;

      if (contentType?.includes("application/json")) {
        const data = await response.json();
        token = data.token || data.access_token;
      } else {
        token = await response.text();
      }

      if (!token) {
        customAlert("error","No se recibió un token válido.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/home");
    } catch (error) {
      console.error("Error de red:", error);
      customAlert("error","No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <Container maxWidth="xs">
        <Form
          title="Iniciar Sesión"
          fields={loginFields}
          onSubmit={handleLogin}
          buttonText="Log In"
          logoUrl="../src/assets/Logo.png"
          loading={loading}
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
