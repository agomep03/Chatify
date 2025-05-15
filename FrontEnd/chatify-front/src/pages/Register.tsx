import { Box } from "@mui/material";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import config from "../config";
import { useAlert } from "../components/Alert";
import logo from "../assets/Logo.png";

/**
 * Pagina de registro.
 * @returns {JSX.Element} Componente de registro.
 * @description Este componente permite a los usuarios registrarse en la aplicación.
 */
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { customAlert } = useAlert();

  // Campos del formulario
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

  /**
   * Registra un nuevo usuario.
   * @param formData - Datos del formulario.
   * @returns {Promise<void>}
   */
  const handleRegister = async (formData: Record<string, string>) => {
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      customAlert("error", "Las contraseñas no coinciden.");
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

        customAlert("error", `Error: ${errorMsg}`);
        return;
      }

      const data = await response.json();
      customAlert("info", "Usuario registrado exitosamente");

      // Redirigir al usuario a la URL de Spotify para vinculación
      window.location.href = data.redirect_url;

      // Esperar a que el usuario complete la vinculación
      const checkLinking = setInterval(async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
          clearInterval(checkLinking);
          customAlert("success", "Vinculación con Spotify completada.");
          navigate("/home");
        }
      }, 2000);
    } catch (error) {
      console.error("Error de red:", error);
      customAlert("error", "No se pudo conectar con el servidor.");
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
      <Form
        title="Registrarse"
        fields={registerFields}
        onSubmit={handleRegister}
        buttonText="Sign In"
        logoUrl={logo}
        loading={loading}
      />
    </Box>
  );
};

export default Register;
