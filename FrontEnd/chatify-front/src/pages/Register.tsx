import { Box, Container } from "@mui/material";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import config from "../config";
import {useAlert} from "../components/Alert";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { customAlert } = useAlert();

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
      customAlert("error","Las contraseñas no coinciden.");
      return;
    }

    const payload = {
      username: formData.name,
      email: formData.email,
      password: formData.password,
    };

    setLoading(true);
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

        const errorMsg =
          Array.isArray(errorData.detail) && errorData.detail.length > 0
            ? errorData.detail[0].msg
            : "Registro fallido";

            customAlert("error",`Error: ${errorMsg}`);
        return;
      }

      const data = await response.json();
      customAlert("info","Usuario registrado exitosamente");
      console.log(data);
      navigate("/login");
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
          title="Registrarse"
          fields={registerFields}
          onSubmit={handleRegister}
          buttonText="Sign In"
          logoUrl="../src/assets/Logo.png"
          loading={loading}
        />
      </Container>
    </Box>
  );
};

export default Register;
