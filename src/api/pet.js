import api from "../services/api.js";

export const getPets = async () => {
  const { data } = await api.get("/pets");

  // Normaliza formatos possíveis da API e garante que seja um array
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.pets)) return data.pets
  if (Array.isArray(data?.items)) return data.items
  // handle nested wrappers like { data: { items: [...] } }
  if (Array.isArray(data?.data?.items)) return data.data.items
  if (Array.isArray(data?.data?.pets)) return data.data.pets

  // fallback: se veio vazio ou formato inesperado, retorna array vazio
  return []
};

export const getPet = async (id) => {
  const { data } = await api.get(`/pets/${id}`);
  return data;
};

export const addPet = async (formData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/pets", formData, {
    headers: {
      //"Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updatePet = async (id, pet) => {
  const token = localStorage.getItem("token");
  console.log("Token enviado no updatePet:", token);
  await api.put(`/pets/${id}`, pet, {
    headers: {
      //"Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePet = async (id) => {
  const token = localStorage.getItem("token");
  await api.delete(`/pets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
