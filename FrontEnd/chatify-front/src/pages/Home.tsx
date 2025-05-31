import { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchVerifySpotifyConnection } from "../api/spotifyService";
import { useAlert } from "../components/Alert/Alert";
import { useNavigate } from "react-router";

/**
 * Página principal tras el login.
 * @component
 * @param {() => void} toggleTheme - Función para alternar entre modo claro y oscuro.
 * @returns {JSX.Element} Layout principal de la app (zona privada).
 * @description
 * Al montar, verifica si la cuenta de Spotify está conectada correctamente.
 * Si no lo está, muestra una alerta, elimina el token y redirige al login.
 * Si todo está bien, muestra el layout principal de la aplicación.
 */

type HomeProps = {
  toggleTheme: () => void;
};

const Home: React.FC<HomeProps> = ({ toggleTheme }) => {
  const { customAlert } = useAlert();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verifica la conexión con Spotify al montar el componente
    const checkSpotify = async () => {
      const spotifyConnected = await fetchVerifySpotifyConnection();
      if (!spotifyConnected) {
        customAlert("error", "Tu cuenta de spotify no está sincronizada correctamente");
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    checkSpotify();
  }, []);

  // Renderiza el layout principal de la app
  return <MainLayout toggleTheme={toggleTheme} />;
};

export default Home;
