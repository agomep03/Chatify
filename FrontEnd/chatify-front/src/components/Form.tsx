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
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {logoUrl && <Logo logoUrl={logoUrl} />}
        <Typography variant="h5" sx={{ color: "green" }}>
          {title}
        </Typography>
      </Box>
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
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#4CAF50", // Color verde personalizado
            "&:hover": { backgroundColor: "#0F6B30" }, // Color al hacer hover
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
