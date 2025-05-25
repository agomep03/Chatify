// src/utils/auth.ts
import {jwtDecode} from "jwt-decode";

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
