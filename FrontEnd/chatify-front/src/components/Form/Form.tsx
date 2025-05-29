import { useState, forwardRef } from "react";
import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FormHeader from "./FormHeader";
import FormFields from "./FormFields";
import FormLoadingOverlay from "./FormLoadingOverlay";
import AppButton from "../Buttons/AppButton/AppButton"; // Importa el nuevo botón

/**
 * Componente de formulario reutilizable.
 */

/**
 * Interfaz para definir la estructura de los campos del formulario.
 * @property {string} name - Nombre del campo.
 * @property {string} label - Etiqueta del campo.
 * @property {string} type - Tipo de campo (text, email, password, etc.).
 */
interface Field {
  name: string;
  label: string;
  type: string;
}

/**
 * Propiedades del componente Form.
 * @property {string} title - Título del formulario.
 * @property {Field[]} fields - Campos del formulario.
 * @property {(formData: Record<string, string>) => void} onSubmit - Función a ejecutar al enviar el formulario.
 * @property {string} buttonText - Texto del botón de envío.
 * @property {string} [logoUrl] - URL del logo (opcional).
 * @property {boolean} [loading] - Estado de carga (opcional).
 * @property {Record<string, string>} [initialValues] - Valores iniciales del formulario (opcional).
 * @property {React.ReactNode} [children] - Elementos hijos opcionales.
 * @property {boolean} [noBackground] - Si se muestra sin fondo.
 * @property {boolean} [showButton] - Controla la visibilidad del botón.
 * @property {boolean} [showHomeButton] - <-- Añadido
 */
interface FormProps {
  title: string;
  fields: Field[];
  onSubmit: (formData: Record<string, string>) => void;
  buttonText: string;
  logoUrl?: string;
  loading?: boolean; // Nueva prop
  initialValues?: Record<string, string>;
  children?: React.ReactNode;
  noBackground?: boolean;
  showButton?: boolean;
  showHomeButton?: boolean; // <-- Añadido
}

/**
 * Componente de formulario reutilizable.
 * @param {FormProps} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      title,
      fields,
      onSubmit,
      buttonText,
      logoUrl,
      loading = false,
      initialValues = {},
      children,
      noBackground = false,
      showButton = true,
      showHomeButton = false,
    },
    ref
  ) => {
    // Estado para manejar los datos del formulario
    const [formData, setFormData] =
      useState<Record<string, string>>(initialValues);
    const theme = useTheme();

    /**
     * Manejador de cambios en los campos del formulario.
     * @param e - Evento de cambio.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    /**
     * Manejador de envío del formulario.
     * @param e - Evento de envío.
     */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      // Contenedor principal del formulario
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            p: 4,
            boxShadow: noBackground ? 0 : 3,
            borderRadius: 2,
            bgcolor: noBackground
              ? "transparent"
              : theme.palette.background.default,
            position: "relative",
          }}
        >
          {/* Overlay de carga */}
          <FormLoadingOverlay loading={loading} noBackground={noBackground} />
          {/* Logo y título */}
          <FormHeader
            title={title}
            logoUrl={logoUrl}
            showHomeButton={showHomeButton}
          />
          {/* Campos del formulario */}
          <Box
            component="form"
            ref={ref}
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormFields
              fields={fields}
              formData={formData}
              onChange={handleChange}
              loading={loading}
            />
            {showButton && (
              <AppButton
                type="submit"
                disabled={loading}
                sx={{ mt: "2rem", width: "50%", justifySelf: "center" }}
                fullWidth
              >
                {buttonText}
              </AppButton>
            )}
          </Box>
          {/* Elementos hijos opcionales */}
          {children && (
            <Box mt={2} textAlign="center" width="100%">
              {children}
            </Box>
          )}
        </Box>
      </Container>
    );
  }
);

export default Form;
