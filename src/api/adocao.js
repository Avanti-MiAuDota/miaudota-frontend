import axios from "../services/api.js";

export async function fetchPetById(petId) {
  try {
    const response = await axios.get(`/pets/${petId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pet:", error);
    throw error;
  }
}

export async function postAdoption(adoptionData) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`/adocoes`, adoptionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar adoção:", error);
    throw error;
  }
}

export async function updateAdoption(adoptionId, adoptionData) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`/adocoes/${adoptionId}`, adoptionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar adoção ${adoptionId}:`, error);
    throw error;
  }
}

export async function getAdoptions() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`/adocoes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar adoções:", error);
    throw error;
  }
}

export async function getAdoptionById(adoptionId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`/adocoes/${adoptionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar adoção:", error);
    throw error;
  }
}

export async function getAdoptionsByPetId(petId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`/adoptions?petId=${petId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar adoções por pet:", error);
    throw error;
  }
}

export async function deleteAdoption(adoptionId) {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`/adocoes/${adoptionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Erro ao deletar adoção:", error);
    throw error;
  }
}
