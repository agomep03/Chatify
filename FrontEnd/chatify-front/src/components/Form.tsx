import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Container,
} from "@mui/material";
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
  logoUrl?: string;
  loading?: boolean; // Nueva prop
  initialValues?: Record<string, string>;
  children?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({
  title,
  fields,
  onSubmit,
  buttonText,
  logoUrl,
  loading = false,
  initialValues = {},
  children,
}) => {
  const [formData, setFormData] =
    useState<Record<string, string>>(initialValues);

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
    <Container maxWidth="xs">
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
              bgcolor: "#1f1f1f",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
              zIndex: 10,
            }}
          >
            <CircularProgress sx={{ color: "#ffffff" }} />
          </Box>
        )}

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
                "& .MuiInputBase-input": { color: "#ffffff" },
                "& .MuiInputLabel-root": { color: "#7c7c7c" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#7c7c7c" },
                  "&:hover fieldset": { borderColor: "#ffffff" },
                  "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                },
              }}
            />
          ))}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: "2rem",
              width: "50%",
              justifySelf: "center",
              backgroundColor: "#3be477",
              color: "#000000",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "var(--encore-button-corner-radius, 9999px);",
              textTransform: "none",
              "&:hover": { backgroundColor: "#1abc54" },
            }}
            fullWidth
          >
            {buttonText}
          </Button>
        </Box>
        {children && (
          <Box mt={2} textAlign="center" width="100%">
            {children}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Form;
