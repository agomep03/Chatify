import { useState, forwardRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Container,
} from "@mui/material";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles"; // <-- Añadido

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
const Form = forwardRef<HTMLFormElement, FormProps>(({
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
  showHomeButton = false, // <-- Añadido
}, ref) => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] =
    useState<Record<string, string>>(initialValues);
  const navigate = useNavigate();
  const theme = useTheme(); // <-- Añadido

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
    }}>
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
          bgcolor: noBackground ? "transparent" : theme.palette.background.default,
          position: "relative",
        }}
      >
        {/* Overlay de carga */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: theme.palette.background.default,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
              zIndex: 10,
            }}
          >
            <CircularProgress sx={{ color: theme.palette.text.primary }} />
          </Box>
        )}
        {/* Logo y título */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 2, 
            width: "100%", 
            justifyContent: "center", // Siempre centrado
            gap: showHomeButton ? 2 : 0
          }}
        >
          {showHomeButton && (
            <Button
              variant="contained"
              size="small"
              disableRipple
              disableFocusRipple
              disableElevation
              sx={{
                boxShadow: "none",
                minWidth: 0,
                p: "6px",
                border: "none",
                backgroundColor: theme.palette.background.default,
                "&:hover": { backgroundColor: theme.palette.background.default, boxShadow: "none" },
                "&:active": { border: "none", outline: "none", boxShadow: "none" },
                "&:focus-visible": { border: "none", outline: "none", boxShadow: "none" },
                "&:focus": { border: "none", outline: "none", boxShadow: "none" },
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => navigate("/home")}
            >
              <ArrowBackIcon sx={{ color: theme.palette.text.primary }} />
            </Button>
          )}
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              flexGrow: 0, 
              justifyContent: "center" // Siempre centrado
            }}
          >
            {logoUrl && <Logo logoUrl={logoUrl} />}
            <Typography variant="h5" sx={{ color: theme.palette.text.primary, ml: logoUrl ? 1 : 0 }}>
              {title}
            </Typography>
          </Box>
        </Box>
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
          {fields.map((field) => (
            <TextField
              key={field.name}
              fullWidth
              label={field.label}
              type={field.type}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              sx={{
                "& .MuiInputBase-input": { color: theme.palette.text.primary },
                "& .MuiInputLabel-root": { color: theme.palette.custom.outlinedBorder },
                "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.text.primary },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: theme.palette.custom.outlinedBorder },
                  "&:hover fieldset": { borderColor: theme.palette.text.primary },
                  "&.Mui-focused fieldset": { borderColor: theme.palette.text.primary },
                },
              }}
            />
          ))}
          {showButton&& (
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: "2rem",
                width: "50%",
                justifySelf: "center",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "var(--encore-button-corner-radius, 9999px);",
                textTransform: "none",
                "&:hover": { backgroundColor: theme.palette.custom.primaryHover },
                "&:focus": { outline: "none", border: "none", boxShadow: "none" },
                "&:focus-visible": { outline: "none", border: "none", boxShadow: "none" },
                "&:active": { outline: "none", border: "none", boxShadow: "none" },
              }}
              fullWidth
            >
              {buttonText}
            </Button>
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
});

export default Form;
