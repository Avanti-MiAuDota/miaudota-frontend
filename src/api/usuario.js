import api from "../services/api.js";

export const createUsuario = async (usuarioData) => {
  const { data } = await api.post("/usuarios/", usuarioData);
  return data;
};
