import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import AppButton from "../../Buttons/AppButton/AppButton";

/**
 * Campo personalizado para seleccionar y previsualizar imágenes en formularios.
 * @component
 * @param {string} name - Nombre del campo (clave en el formData).
 * @param {string} [value] - Valor actual del campo (base64 o URL).
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange - Función para manejar el cambio de imagen.
 * @param {boolean} [disabled=false] - Si es true, deshabilita el campo.
 * @param {boolean} [required=false] - Si es true, el campo es obligatorio.
 * @returns {JSX.Element} Campo de imagen con botón y previsualización.
 * @description
 * Permite al usuario seleccionar una imagen, la convierte a base64 y la muestra como vista previa.
 * El valor se propaga al formData como base64 usando un evento sintético.
 * El botón abre el selector de archivos y el campo puede ser deshabilitado u obligatorio.
 */

interface ImageFieldProps {
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}

const ImageField = ({
  name,
  value,
  onChange,
  disabled = false,
  required = false,
}: ImageFieldProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(value ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImagePreview(value ?? null);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
        // Propaga el valor base64 al formData
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            name: e.target.name,
            value: ev.target?.result as string,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      };
      reader.readAsDataURL(file);
    }
  };

  // Abre el selector de archivos al pulsar el botón
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 2, mb: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* El label ya no se muestra */}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        disabled={disabled}
        onChange={handleFileChange}
        required={required} // Añadido
        style={{ display: "none" }}
      />
      {/* Botón para seleccionar imagen */}
      <AppButton
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        sx={{ mb: 1, width: "100%" }}
      >
        Seleccionar imagen
      </AppButton>
      {/* Vista previa de la imagen seleccionada */}
      {imagePreview && (
        <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
          <img
            src={imagePreview}
            alt="Vista previa"
            style={{
              maxWidth: "120px",
              maxHeight: "120px",
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ImageField;
