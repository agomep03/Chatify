// src/utils/auth.ts
import {jwtDecode} from "jwt-decode";

declare global {
  interface Window {
    customAlert?: (msg: string, type: string) => void;
  }
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const isValid = decoded.exp * 1000 > Date.now();
    if (!isValid) {
      localStorage.removeItem("token");
    }
    return isValid;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
}

export function handleUnauthorized(response: Response): boolean {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    const msg =
      response.status === 401
        ? "Tu sesión ha expirado o el token no es válido. Por favor, inicia sesión de nuevo."
        : "No tienes permisos para acceder a este recurso. Por favor, inicia sesión.";
    // Si no estamos en /login, guarda el mensaje para mostrarlo después del redirect
    if (!window.location.pathname.startsWith("/login")) {
      localStorage.setItem("forcedLogoutMsg", msg);
      // Elimina el redirect inmediato para que el mensaje se muestre correctamente
      window.location.href = "/login";
    } else if (typeof window !== "undefined" && typeof window.customAlert === "function") {
      // Si ya estamos en /login, muestra la alerta directamente
      window.customAlert(msg, "error");
    }
    return true;
  }
  return false;
}
