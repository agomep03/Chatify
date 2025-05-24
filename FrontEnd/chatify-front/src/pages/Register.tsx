import { Box } from "@mui/material";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAlert } from "../components/Alert";
import logo from '../assets/Logo.png';
import { registerUser } from "../api/authService";

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
    setLoading(true);
    try {
      const data = await registerUser(formData.name, formData.email, formData.password);
      // Guardar el token si está presente en la respuesta
      const token = data?.token || data?.access_token;
      if (token) {
        localStorage.setItem("token", token);
        customAlert("info", "Usuario registrado exitosamente");
        navigate("/home");
      } else {
        customAlert("info", "Usuario registrado exitosamente. Inicia sesión.");
        navigate("/login");
      }
    } catch (error: any) {
      // Manejo de error personalizado
      if (
        error?.response?.data?.detail &&
        error.response.data.detail.success === false &&
        typeof error.response.data.detail.error === "string"
      ) {
        customAlert("error", error.response.data.detail.error);
      } else {
        customAlert("error", `Error: ${error.message || "Registro fallido"}`);
      }
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
