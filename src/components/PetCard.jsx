import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { deletePet } from "../api/pet";

export const PetCard = ({ pet }) => {
  const { user } = useAuth();

  const statusClasses = {
    DISPONIVEL: "bg-verde-claro text-dark font-bold",
    EM_ANALISE: "bg-azul text-light font-bold",
    ADOTADO: "bg-laranja text-dark font-bold",
  };

  const statusLabels = {
    DISPONIVEL: "Disponível",
    EM_ANALISE: "Em análise",
    ADOTADO: "Adotado",
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);

  const badgeClass = statusClasses[pet.status] || "bg-transparent";

  const confirmDeletePet = (petId) => {
    setSelectedPetId(petId);
    setShowDeleteModal(true);
  };

  const handleDeletePet = async () => {
    if (!selectedPetId) return;

    try {
      await deletePet(selectedPetId);
      toast.success("Pet deletado com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
      toast.error("Erro ao deletar pet.");
    } finally {
      setShowDeleteModal(false);
      setSelectedPetId(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-md p-3 h-full flex flex-col relative">
      <Link to={`/pets/${pet.id}`} className="flex-1 flex flex-col">
        <h2
          className={`text-lg font-bold uppercase mb-2 ${
            pet.especie === "CAO" ? "text-verde-escuro" : "text-azul"
          }`}
        >
          <span>{pet.especie === "CAO" ? "🐶 " : "🐱 "}</span>
          {pet.nome}
        </h2>
        <div className="relative flex-1 flex flex-col">
          <div
            className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full z-10 ${badgeClass}`}
          >
            {statusLabels[pet.status] || pet.status}
          </div>
          <div className="flex-shrink-0">
            <img
              src={pet.foto}
              alt={pet.nome}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
          <div className="flex-1 flex items-start">
            <p
              className="text-dark mt-2 text-sm leading-5 overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {pet.descricao}
            </p>
          </div>
        </div>
      </Link>

      {user?.role === "ADMIN" && (
        <div className="flex justify-end mt-2 items-center gap-4 flex-shrink-0">
          <Link to={`/pets/edit/${pet.id}`}>
            <FaRegEdit className="text-azul text-xl cursor-pointer hover:scale-110 transition-transform duration-200" />
          </Link>
          <button onClick={() => confirmDeletePet(pet.id)}>
            <FaRegTrashAlt className="text-laranja text-xl cursor-pointer hover:scale-110 transition-transform duration-200" />
          </button>
          {pet.status !== "DISPONIVEL" && (
            <Link to={`/pets/${pet.id}/adoptions`}>
              <IoDocumentTextOutline className="text-verde-escuro text-xl cursor-pointer hover:scale-110 transition-transform duration-200" />
            </Link>
          )}
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-start justify-center z-50 pt-20 pointer-events-none">
          <div className="bg-white border-2 border-green-600 rounded-xl shadow-md p-6 w-full max-w-sm pointer-events-auto">
            <p className="text-center text-sm text-black-500 mb-3 font-medium">
              ⚠️ Área de Risco: Esta ação é permanente e não pode ser desfeita.
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-center text-red-600 font-medium">
                Tem certeza que deseja deletar este pet?
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleDeletePet}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition"
                >
                  Sim, deletar
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
