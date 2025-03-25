import { Container } from "@mui/material";
import Form from "../components/Form";

const Register: React.FC = () => {
  // Campos para el registro
  const registerFields = [
    { name: "name", label: "Nombre Completo", type: "text" },
    { name: "email", label: "Correo Electrónico", type: "email" },
    { name: "password", label: "Contraseña", type: "password" },
    { name: "confirmPassword", label: "Confirmar Contraseña", type: "password" },
  ];

  // Función que maneja el registro
  const handleRegister = (formData: Record<string, string>) => {
    console.log("Registrando usuario con:", formData);
  };

  return (
    <Form title="Registrarse" fields={registerFields} onSubmit={handleRegister} buttonText="Crear Cuenta" />
  );
};

export default Register;
