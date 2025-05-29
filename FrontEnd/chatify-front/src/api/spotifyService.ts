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

// Llamada al endpoint /spotify/playlists para obtener las playlists del usuario
export const fetchUserPlaylists = async (): Promise<any[]> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${config.apiBaseUrl}/spotify/playlists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (handleUnauthorized(res)) throw new Error("Sesión expirada");
  if (!res.ok) throw new Error("Error al cargar las playlists.");
  const data = await res.json();
  return data;
};

// Actualiza una playlist (título y/o imagen)
export const updateUserPlaylist = async (
  playlistId: string,
  data: { title?: string; image_base64?: string }
): Promise<any> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${config.apiBaseUrl}/spotify/playlists/${playlistId}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (handleUnauthorized(res)) throw new Error("Sesión expirada");
  if (!res.ok) throw new Error("Error al actualizar la playlist.");
  return await res.json();
};

// Genera una playlist automáticamente usando un prompt
export const autoGeneratePlaylist = async (prompt: string): Promise<any> => {
  const token = localStorage.getItem("token");
  // Enviar el prompt como parámetro de query string (por compatibilidad con backend actual)
  const url = `${config.apiBaseUrl}/spotify/playlists/auto-generate?prompt=${encodeURIComponent(prompt)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (handleUnauthorized(res)) throw new Error("Sesión expirada");
  if (!res.ok) throw new Error("Error al generar la playlist.");
  return await res.json();
};
