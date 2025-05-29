import { Box, Container, CircularProgress, Typography } from "@mui/material";
import Form from "../components/Form/Form";
import { useEffect, useState } from "react";
import logo from '../assets/Logo.png';
import { useAlert } from "../components/Alert/Alert";
import { fetchUserProfile, updateUserProfile } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

/**
 * Página de perfil de usuario.
 * @returns {JSX.Element} Componente de perfil.
 * @description Este componente permite a los usuarios editar su perfil.
 */
const Profile: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { customAlert } = useAlert();
  const navigate = useNavigate();
  const theme = useTheme();

  // Campos del formulario
  const profileFields = [
    { name: "username", label: "Nombre Completo", type: "text" },
    { name: "email", label: "Correo Electrónico", type: "email" },
    // Puedes agregar más campos si el backend lo soporta
  ];

  useEffect(() => {
    /**
     * Función para obtener los datos del perfil del usuario.
     */
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const data = await fetchUserProfile();
        setFormData({
          username: data.username || "",
          email: data.email || "",
        });
      } catch (error) {
        // Mostrar alerta si viene de forcedLogoutMsg (token expirado/no autorizado)
        const forcedLogoutMsg = localStorage.getItem("forcedLogoutMsg");
        if (forcedLogoutMsg) {
          customAlert("error", forcedLogoutMsg);
          localStorage.removeItem("forcedLogoutMsg");
        } else {
          customAlert("error", "Error al obtener datos del perfil.");
        }
        setFormData({});
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Maneja la actualización del perfil del usuario.
   * @param data - Datos del formulario.
   */
  const handleProfileUpdate = async (data: Record<string, string>) => {
    setSubmitting(true);
    try {
      const prevEmail = formData.email;
      const updated = await updateUserProfile(data);
      setFormData({
        username: updated.user.username,
        email: updated.user.email,
      });
      // Si el email fue cambiado, forzar logout y redirigir
      if (data.email && data.email !== prevEmail) {
        localStorage.removeItem("token");
        localStorage.setItem("showEmailChangedAlert", "1");
        navigate("/login");
        return;
      }
      customAlert("success", "Perfil actualizado correctamente.");
    } catch (error: any) {
      customAlert("error", error.message || "Error al actualizar el perfil.");
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
        backgroundColor: theme.palette.background.paper,
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
            <CircularProgress sx={{ color: theme.palette.text.primary }} />
          </Box>
        ) : (
          <>
            <Form
              title="Editar Perfil"
              fields={profileFields}
              onSubmit={handleProfileUpdate}
              buttonText="Guardar Cambios"
              logoUrl={logo}
              loading={submitting}
              initialValues={formData}
              showHomeButton={true}
            >
              <Box mt={2} textAlign="center">
                <Typography variant="body2" color="text.secondary">
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
