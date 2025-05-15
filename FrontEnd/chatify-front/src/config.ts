const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://chatifyback.onrender.com",
};

console.log("API URL:", config.apiBaseUrl, "| Env vars:", import.meta.env);

export default config;
