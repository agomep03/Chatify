import { Box, Container } from "@mui/material";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import config from "../config";

const Register: React.FC = () => {
  const navigate = useNavigate();

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

  const handleRegister = async (formData: Record<string, string>) => {
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const payload = {
      username: formData.name,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Intenta extraer mensaje desde errorData.detail[0].msg
        const errorMsg =
          Array.isArray(errorData.detail) && errorData.detail.length > 0
            ? errorData.detail[0].msg
            : "Registro fallido";

        alert(`Error: ${errorMsg}`);
        return;
      }

      // Redirige al usuario a /login
      navigate("/login");

      const data = await response.json();
      alert("Usuario registrado exitosamente");
      console.log(data);

      // TODO: Redirigir al login u otra vista
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
      <Form
        title="Registrarse"
        fields={registerFields}
        onSubmit={handleRegister}
        buttonText="Sign In"
        logoUrl="../src/assets/Logo.png"
      />
    </Box>
  );
};

export default Register;
