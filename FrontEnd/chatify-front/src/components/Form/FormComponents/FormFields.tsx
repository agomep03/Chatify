import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ImageField from "./ImageField";

/**
 * Renderiza los campos de un formulario de forma dinámica según la configuración recibida.
 * @component
 * @param {Array} fields - Lista de objetos que definen los campos del formulario (nombre, etiqueta, tipo, requerido).
 * @param {Record<string, string>} formData - Objeto con los valores actuales de los campos.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange - Función para manejar los cambios en los campos.
 * @param {boolean} [loading=false] - Si está en true, deshabilita los campos.
 * @returns {JSX.Element} Lista de campos de formulario (TextField o ImageField).
 * @description
 * Este componente recorre la lista de campos y renderiza un TextField para cada uno,
 * excepto si el tipo es "file", en cuyo caso renderiza un ImageField.
 * Aplica estilos personalizados según el tema y permite deshabilitar los campos si loading es true.
 */

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface FormFieldsProps {
  fields: Field[];
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
}

const FormFields = ({
  fields,
  formData,
  onChange,
  loading = false,
}: FormFieldsProps) => {
  const theme = useTheme();

  return (
    <>
      {fields.map((field) =>
        field.type === "file" ? (
          // Si el campo es de tipo "file", renderiza un ImageField personalizado
          <ImageField
            key={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={onChange}
            disabled={loading}
            required={field.required}
          />
        ) : (
          // Para el resto de tipos, renderiza un TextField de MUI
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type={field.type}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={onChange}
            margin="normal"
            required={field.required}
            disabled={loading}
            sx={{
              "& .MuiInputBase-input": {
                color: theme.palette.text.primary,
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.custom.outlinedBorder,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.text.primary,
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.custom.outlinedBorder,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.text.primary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.text.primary,
                },
              },
              "& input:-webkit-autofill": {
                WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset`,
                WebkitTextFillColor: theme.palette.text.primary,
              },
            }}
          />
        )
      )}
    </>
  );
};

export default FormFields;
