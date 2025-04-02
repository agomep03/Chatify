import { Box, Container } from "@mui/material";
import Form from "../components/Form";

const Register: React.FC = () => {
  // Campos para el registro
  const registerFields = [
    { name: "name", label: "Nombre Completo", type: "text" },
    { name: "email", label: "Correo Electrónico", type: "email" },
    { name: "password", label: "Contraseña", type: "password" },
    {
      name: "confirmPassword",
      label: "Confirmar Contraseña",
      type: "password",
    },
  ];

  // Función que maneja el registro
  const handleRegister = (formData: Record<string, string>) => {
    console.log("Registrando usuario con:", formData);
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
      <Form
        title="Registrarse"
        fields={registerFields}
        onSubmit={handleRegister}
        buttonText="Sign In"
        logoUrl="../src/assets/react.svg"
      />
    </Box>
  );
};

export default Register;
