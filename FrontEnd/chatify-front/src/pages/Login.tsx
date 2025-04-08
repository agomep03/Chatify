import { Box, Container, Link, Typography } from "@mui/material";
import Form from "../components/Form";
import { Link as RouterLink } from "react-router-dom";

const Login: React.FC = () => {
  // Campos para el login
  const loginFields = [
    { name: "email", label: "Correo Electrónico", type: "email" },
    { name: "password", label: "Contraseña", type: "password" },
  ];

  // Función que maneja el login
  const handleLogin = (formData: Record<string, string>) => {
    console.log("Iniciando sesión con:", formData);
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
<<<<<<< HEAD
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        <Form
          title="Iniciar Sesión"
          fields={loginFields}
          onSubmit={handleLogin}
          buttonText="Log In"
          logoUrl="../src/assets/Logo.png"
        />

        {/* Enlace al formulario de registro */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography color="#ffffff">
            ¿No tienes una cuenta?{" "}
            <Link
              component={RouterLink}
              to="/register" // Ruta hacia la página de registro
              sx={{ textDecoration: "none", color: "#1976d2" }}
            >
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Box>
=======
      <Form
        title="Iniciar Sesión"
        fields={loginFields}
        onSubmit={handleLogin}
        buttonText="Log In"
        logoUrl="../src/assets/Logo.png"
      />
>>>>>>> d04619d (Poner logo de chatify en login y register)
    </Box>
  );
};

export default Login;
