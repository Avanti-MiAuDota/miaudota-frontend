import api from "../services/api.js";

export const createUsuario = async (usuarioData) => {
  const { data } = await api.post("/usuarios/", usuarioData);
  return data;
};

export const getUsuarioById = async (id) => {
  const { data } = await api.get(`/usuarios/${id}`);
  console.info('data retornada ', data);
  return data;
};

export const updateUsuario = async (id, usuarioData) => {
  const token = localStorage.getItem("token");
  const { data } = await api.put(`/usuarios/${id}`, usuarioData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const deleteUsuario = async (id) => {
  const token = localStorage.getItem("token");
  const { data } = await api.delete(`/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};