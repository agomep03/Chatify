import config from '../config';
import { handleUnauthorized } from '../utils/auth';

// Utilidad para convertir File/Blob a base64
const toBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // El resultado será un string en formato data URL base64
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

// Actualiza una playlist (título, descripción y/o imagen)
export const updateUserPlaylist = async (
  playlistId: string,
  data: { title?: string; description?: string; image_base64?: string | File }
): Promise<any> => {
  const token = localStorage.getItem("token");

  let payload: { title?: string; description?: string; image_base64?: string } = {
    title: data.title,
    description: data.description,
  };

  if (
    typeof data.image_base64 === "object" &&
    data.image_base64 !== null &&
    ((typeof File !== "undefined" && data.image_base64 instanceof File) ||
      (typeof Blob !== "undefined" && data.image_base64 instanceof Blob))
  ) {
    // Convertir File/Blob a base64 correctamente
    payload.image_base64 = await toBase64(data.image_base64);
  } else if (typeof data.image_base64 === "string") {
    payload.image_base64 = data.image_base64;
  }

  const res = await fetch(`${config.apiBaseUrl}/spotify/playlists/${playlistId}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
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

// Elimina una playlist del usuario
export const deleteUserPlaylist = async (playlistId: string): Promise<any> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${config.apiBaseUrl}/spotify/playlists/${playlistId}/unfollow`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (handleUnauthorized(res)) throw new Error("Sesión expirada");
  if (!res.ok) throw new Error("Error al eliminar la playlist.");
  return await res.json();
};
