import { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import {fetchVerifySpotifyConnection} from "../api/spotifyService";
import { useAlert } from "../components/Alert";
import { useNavigate } from "react-router";

type HomeProps = {
  toggleTheme: () => void;
};

const Home: React.FC<HomeProps> = ({ toggleTheme }) => {
  const { customAlert } = useAlert();
  const navigate = useNavigate();
  
  useEffect(() => {
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


  return <MainLayout toggleTheme={toggleTheme}/>;
};

export default Home;
