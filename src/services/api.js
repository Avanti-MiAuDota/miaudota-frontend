import axios from "axios";

// Quando em desenvolvimento e acessado via rede (não localhost), usar proxy do Vite
const isNetworkAccess =
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";
const baseURL = isNetworkAccess
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: baseURL,
});

export default api;
