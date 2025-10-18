import api from "../services/api.js";

export const getPets = async () => {
  const { data } = await api.get("/pets");
  return data;
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
