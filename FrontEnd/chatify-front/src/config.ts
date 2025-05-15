// src/config.ts

const isDevelopment = import.meta.env.MODE === "development";

// Obtenemos y procesamos las URLs de producción
const prodUrls: string[] = import.meta.env.VITE_API_PROD_URLS
  ? import.meta.env.VITE_API_PROD_URLS.split(",").map((url: string) => url.trim())
  : [];

const config = {
  apiBaseUrl: isDevelopment
    ? import.meta.env.VITE_API_BASE_URL
    : prodUrls.length > 0
    ? prodUrls[0] // Selecciona la primera por defecto, o podrías implementar lógica para elegir otra
    : "", // Fallback si no hay URL definida
};
console.log(`API base URL configurada: ${config.apiBaseUrl || "No definida"}`);

export default config;