import { Box, Container, CircularProgress, Typography } from "@mui/material";
import Form from "../components/Form";
import { useEffect, useState } from "react";

/**
 * Página de perfil de usuario.
 * @returns {JSX.Element} Componente de perfil.
 * @description Este componente permite a los usuarios editar su perfil.
 */
const Profile: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Campos del formulario
  const profileFields = [
    { name: "name", label: "Nombre Completo", type: "text" },
    { name: "email", label: "Correo Electrónico", type: "email" },
    { name: "bio", label: "Biografía", type: "text" },
  ];

  useEffect(() => {
    /**
     * Función para obtener los datos del perfil del usuario.
     */
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // TODO: Aquí irá el fetch real
        // const response = await fetch(`${config.apiBaseUrl}/user/profile`);
        // const data = await response.json();

        // Mock temporal
        const data = {
          name: "Juan Pérez",
          email: "juan@example.com",
          bio: "Desarrollador apasionado por la tecnología.",
        };

        setFormData(data);
      } catch (error) {
        console.error("Error al obtener datos del perfil:", error);
      } finally {
        // Cambiar el estado de carga
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  /**
   * Maneja la actualización del perfil del usuario.
   * @param data - Datos del formulario.
   */
  const handleProfileUpdate = async (data: Record<string, string>) => {
    setSubmitting(true);
    try {
      console.log("Datos enviados (handler vacío):", data);
      // Aquí irá la llamada a la API
    } finally {
      setSubmitting(false);
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
      <Container maxWidth="sm">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress sx={{ color: "#ffffff" }} />
          </Box>
        ) : (
          <>
            <Form
              title="Editar Perfil"
              fields={profileFields}
              onSubmit={handleProfileUpdate}
              buttonText="Guardar Cambios"
              logoUrl="../src/assets/Logo.png"
              loading={submitting}
              initialValues={formData}
            >
              <Box mt={2} textAlign="center">
                <Typography variant="body2" color="white">
                  Actualiza tu información personal.
                </Typography>
              </Box>
            </Form>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Profile;
