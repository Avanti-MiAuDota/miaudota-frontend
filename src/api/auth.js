import axios from "../services/api.js";

export async function loginUser(data) {
  try {
    const response = await axios.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Erro na API de login:", error.response?.data);
    const customError = new Error("Falha no login");
    customError.original = error;
    throw customError;
  }
}
