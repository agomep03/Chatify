import config from '../config';
import { handleUnauthorized } from '../utils/auth';

// Login de usuario
export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; redirect_url: string }> => {
  const urlEncoded = new URLSearchParams();
  urlEncoded.append("username", email);
  urlEncoded.append("password", password);

  const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlEncoded.toString(),
  });

  if (!response.ok) {
    let errorMsg = "Inicio de sesión fallido";
    try {
      const errorData = await response.json();
      errorMsg = errorData?.detail?.error ?? errorData?.error ?? errorMsg;
    } catch {
      const errorText = await response.text();
      if (errorText) errorMsg = errorText;
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const token = data.token ?? data.access_token;
  const redirect_url = data.redirect_url;

  if (!token || !redirect_url) {
    throw new Error("Respuesta incompleta del servidor.");
  }

  return { token, redirect_url };
};


// Registro de usuario
export const registerUser = async (name: string, email: string, password: string) => {
  const payload = {
    username: name,
    email,
    password,
  };

  const response = await fetch(`${config.apiBaseUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMsg =
      Array.isArray(errorData.detail) && errorData.detail.length > 0
        ? errorData.detail[0].msg
        : "Registro fallido";
    throw new Error(errorMsg);
  }

  // La respuesta debería ser un JSON, pero puede ser un string
  try {
    return await response.json();
  } catch {
    return await response.text();
  }
};

// Obtener perfil de usuario
export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${config.apiBaseUrl}/auth/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (handleUnauthorized(response)) return;
  if (!response.ok) {
    throw new Error("No se pudo obtener el perfil");
  }
  return await response.json();
};

// Actualizar perfil de usuario
export const updateUserProfile = async (data: Record<string, string>) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${config.apiBaseUrl}/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (handleUnauthorized(response)) return;
  if (!response.ok) {
    const errorData = await response.json();
    const errorMsg =
      errorData?.detail?.error ??
      errorData?.error ??
      "No se pudo actualizar el perfil";
    throw new Error(errorMsg);
  }
  return await response.json();
};
