import { Box, Link, Typography } from "@mui/material";
import Form from "../components/Form";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useAlert } from "../components/Alert";
import logo from '../assets/Logo.png';
import { registerUser } from "../api/authService";
import { useTheme } from "@mui/material/styles";

/**
 * Pagina de registro.
 * @returns {JSX.Element} Componente de registro.
 * @description Este componente permite a los usuarios registrarse en la aplicación.
 */
const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { customAlert } = useAlert();
  const theme = useTheme();

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
      localStorage.setItem("token", data.access_token);
      customAlert("info", "Datos guardados exitosamente");
      window.location.href = data.redirect_url;
      
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
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Form
        title="Registrarse"
        fields={registerFields}
        onSubmit={handleRegister}
        buttonText="Registrarse"
        logoUrl={logo}
        loading={loading}
      >
        <Box mt={2} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Ya tienes cuenta?{" "}
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                color="primary"
                sx={{
                  "&:hover": {
                    color: theme => theme.palette.custom.primaryHover,
                  },
                }}
              >
                Inicia sesión aquí
              </Link>
            </Typography>
          </Box>
        </Form>
    </Box>
  );
};

export default Register;
