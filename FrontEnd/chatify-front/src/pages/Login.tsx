import { Container } from "@mui/material";
import Form from "../components/Form";

const Login: React.FC = () => {
  // Campos para el login
  const loginFields = [
    { name: "email", label: "Correo Electrónico", type: "email" },
    { name: "password", label: "Contraseña", type: "password" },
  ];

  // Función que maneja el login
  const handleLogin = (formData: Record<string, string>) => {
    console.log("Iniciando sesión con:", formData);
  };

  return (
    <Container maxWidth="sm">
      <Form title="Iniciar Sesión" fields={loginFields} onSubmit={handleLogin} buttonText="Ingresar" />
    </Container>
  );
};

export default Login;
