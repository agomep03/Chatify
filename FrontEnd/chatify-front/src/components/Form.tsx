import { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";

// Definimos la estructura de cada campo
interface Field {
  name: string;
  label: string;
  type: string;
}

// Definimos las props que el formulario recibirá
interface FormProps {
  title: string;
  fields: Field[];
  onSubmit: (formData: Record<string, string>) => void;
  buttonText: string;
}

const Form: React.FC<FormProps> = ({ title, fields, onSubmit, buttonText }) => {
  // Estado dinámico basado en los campos
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Maneja cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Container maxWidth="sm"
        sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Centra verticalmente
        }}
    >
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
        }}
        >
        <Typography variant="h5">{title}</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
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
            />
            ))}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {buttonText}
            </Button>
        </Box>
        </Box>
    </Container>
  );
};

export default Form;
