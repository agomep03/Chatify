import { Box } from "@mui/material";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import config from "../config";
import {useAlert} from "../components/Alert";
import logo from '../assets/Logo.png';

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
      customAlert("error","Las contraseñas no coinciden.");
      return;
    }

    // Crear el payload para la API
    const payload = {
      username: formData.name,
      email: formData.email,
      password: formData.password,
    };

    // Cambiar a estado de carga
    setLoading(true);

    // Hacer petición de registro a la API
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Manejar la respuesta
      if (!response.ok) {
        // Obtener los datos de error
        const errorData = await response.json();

        // Manejar errores específicos
        const errorMsg =
          Array.isArray(errorData.detail) && errorData.detail.length > 0
            ? errorData.detail[0].msg
            : "Registro fallido";

            customAlert("error",`Error: ${errorMsg}`);
        return;
      }
      // Si la respuesta es exitosa, redirigir al usuario a la página de inicio de sesión
      // FIXME. La respuesta debería ser un JSON, ahora devuelve un string.
      const data = await response.json();
      customAlert("info","Usuario registrado exitosamente");
      navigate("/login");
    } catch (error) {
      console.error("Error de red:", error);
      customAlert("error","No se pudo conectar con el servidor.");
    } finally {
      // Cambiar de nuevo a estado normal
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
