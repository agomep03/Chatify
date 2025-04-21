import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import Logo from "./Logo";

interface Field {
  name: string;
  label: string;
  type: string;
}

interface FormProps {
  title: string;
  fields: Field[];
  onSubmit: (formData: Record<string, string>) => void;
  buttonText: string;
  logoUrl?: string; // Prop opcional para la URL del logo
}

const Form: React.FC<FormProps> = ({
  title,
  fields,
  onSubmit,
  buttonText,
  logoUrl,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: Manejar formulario

    onSubmit(formData);
  };

  return (
    <Box
      sx={{
        width: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "#1f1f1f",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {logoUrl && <Logo logoUrl={logoUrl} />}
        <Typography variant="h5" sx={{ color: "#ffffff" }}>
          {title}
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {fields.map((field) => {
          return (
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
              sx={{
                // Cambia el color del texto del input
                "& .MuiInputBase-input": {
                  color: "#ffffff",
                },
                // Cambia el color del label
                "& .MuiInputLabel-root": {
                  color: "#7c7c7c",
                },
                // Cambia el color del label al estar enfocado
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#ffffff",
                },
                // Cambia el color del borde por defecto y en hover/foco (para variant="outlined")
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#7c7c7c", // color por defecto del borde
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffffff", // color del borde al hacer hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffffff", // color del borde al estar enfocado
                  },
                },
              }}
            />
          );
        })}
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: "2rem",
            width: "50%",
            justifySelf: "center",
            backgroundColor: "#3be477", // Color verde personalizado
            color: "#000000",
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "var(--encore-button-corner-radius, 9999px);",
            textTransform: "none",
            "&:hover": { backgroundColor: "#1abc54" }, // Color al hacer hover
          }}
          fullWidth
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
};

export default Form;
