import { Box, Container } from "@mui/material";
import Form from "../components/Form";

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
      alignItems: "center",     // Centrado vertical
      width: "100vw",           // Ancho de la ventana
      height: "100vh",          // Alto de la ventana
      backgroundColor: "background.default", // Opcional: color de fondo
    }}
    >
      <Form title="Iniciar Sesión" fields={loginFields} onSubmit={handleLogin} buttonText="Ingresar" logoUrl="../src/assets/react.svg" />
    </Box>
  );
};

export default Login;
