import config from '../config';
import { handleUnauthorized } from '../utils/auth';

// Observamos si spotify está conectado correctamente
// Llamada al endpoint /spotify/auth/spotify/connected
export const fetchVerifySpotifyConnection = async (): Promise<boolean> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${config.apiBaseUrl}/spotify/auth/spotify/connected`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (handleUnauthorized(res)) return false;
    const data = await res.json();
    console.log(data);
    return data.connected; //Devuelve true si está bien conectado y false si no lo está
  };
