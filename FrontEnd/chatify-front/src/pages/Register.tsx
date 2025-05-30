import { Box, Link, Typography } from "@mui/material";
import Form from "../components/Form/Form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAlert } from "../components/Alert/Alert";
import logo from '../assets/Logo.png';
import { registerUser } from "../api/authService";
import { useTheme } from "@mui/material/styles";
import { isAuthenticated } from "../utils/auth";
import LoginRegisterLayout from "../layouts/LoginRegisterLayout";

type RegisterProps = {
  toggleTheme: () => void;
};

/**
 * Pagina de registro.
 * @returns {JSX.Element} Componente de registro.
 * @description Este componente permite a los usuarios registrarse en la aplicación.
 * @param {() => void} props.toggleTheme - Función para cambiar el tema de colores de la aplicación.
 */
const Register: React.FC<RegisterProps> = ({ toggleTheme }) => {

  const [loading, setLoading] = useState(false);
  const { customAlert } = useAlert();
  const theme = useTheme();
  const navigate = useNavigate();

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

  useEffect(() => {
      if (isAuthenticated()) {
        navigate("/home");
      }
    }, [navigate]);

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
    <LoginRegisterLayout toggleTheme={toggleTheme}>
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
                    color: theme.palette.custom.primaryHover,
                  },
                }}
              >
                Inicia sesión aquí
              </Link>
            </Typography>
          </Box>
        </Form>
    </LoginRegisterLayout>
  );
};

export default Register;
