import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReturnButton } from "../components/ReturnButton";
import { patchAdoptionStatus, getAdoptionById } from "../api/adocao";
import {
  FaHeart,
  FaCalendarAlt,
  FaCheckCircle,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPaw
} from "react-icons/fa";
import { CustomLoader } from "../components/CustomLoader";

export const Adoption = () => {
  const { adoptionId } = useParams();

  const [adoption, setAdoption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdoption = async () => {
      try {
        const data = await getAdoptionById(adoptionId);
        setAdoption(data);
      } catch {
        setError("Falha ao carregar os detalhes da adoção.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdoption();
  }, [adoptionId]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setError("");
    try {
      await patchAdoptionStatus(adoptionId, { status: newStatus });
      setAdoption((prev) => ({ ...prev, status: newStatus }));
    } catch {
      setError("Falha ao atualizar o status. Tente novamente.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APROVADA":
        return "bg-[var(--color-verde-fraco)] text-[var(--color-verde-escuro)] border-[var(--color-verde-claro)]";
      case "REJEITADA":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-[var(--color-azul-fraco)] text-[var(--color-azul)] border-[var(--color-azul)]";
    }
  };

  const formatSpecies = (species) => {
    switch (species) {
      case "CACHORRO":
      case "CAO":
        return "Cachorro";
      case "GATO":
        return "Gato";
      default:
        return species;
    }
  };

  const formatGender = (gender) => {
    switch (gender) {
      case "MACHO":
        return "Macho";
      case "FEMEA":
        return "Fêmea";
      default:
        return gender;
    }
  };

  if (loading) {
    return (
      <CustomLoader />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <ReturnButton />
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header com status */}
          <div className="bg-gradient-to-r from-[var(--color-verde-escuro)] to-[var(--color-azul)] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <FaPaw className="w-48 h-48 transform rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <FaHeart className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Detalhes da Adoção</h1>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getStatusColor(adoption.status)} font-semibold`}>
                <FaCheckCircle className="w-5 h-5" />
                {adoption.status}
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Informações da Adoção */}
            <section className="bg-gradient-to-br from-[var(--color-verde-fraco)] to-white rounded-2xl p-6 border-2 border-[var(--color-verde-claro)]">
              <h2 className="text-2xl font-bold text-[var(--color-verde-escuro)] mb-4 flex items-center gap-2">
                <FaHeart className="w-6 h-6" />
                Informações da Adoção
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-white rounded-full p-2">
                    <FaCalendarAlt className="w-5 h-5 text-[var(--color-azul)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-cinza-claro)]">Data da Adoção</p>
                    <p className="font-semibold text-[var(--color-dark)]">
                      {new Date(adoption.dataAdocao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white rounded-full p-2">
                    <FaCheckCircle className="w-5 h-5 text-[var(--color-verde-escuro)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-cinza-claro)]">Termos Aceitos</p>
                    <p className="font-semibold text-[var(--color-dark)]">
                      {adoption.aceitouTermo ? "Sim" : "Não"}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 mt-3">
                  <p className="text-sm text-[var(--color-cinza-claro)] mb-1">Motivo da Adoção</p>
                  <p className="text-[var(--color-dark)]">{adoption.motivo}</p>
                </div>
              </div>
            </section>

            {/* Informações do Pet */}
            <section className="bg-gradient-to-br from-[var(--color-azul-fraco)] to-white rounded-2xl p-6 border-2 border-[var(--color-azul)]">
              <h2 className="text-2xl font-bold text-[var(--color-azul)] mb-4 flex items-center gap-2">
                <FaPaw className="w-6 h-6" />
                Informações do Pet
              </h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <img
                      src={adoption.pet.foto}
                      alt={adoption.pet.nome}
                      className="w-64 h-64 object-cover rounded-2xl border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-3 -right-3 bg-[var(--color-laranja)] rounded-full p-3 shadow-lg">
                      <FaPaw className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex-grow space-y-3">
                  <div>
                    <p className="text-sm text-[var(--color-cinza-claro)]">Nome</p>
                    <p className="text-2xl font-bold text-[var(--color-dark)]">{adoption.pet.nome}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-sm text-[var(--color-cinza-claro)]">Espécie</p>
                      <p className="font-semibold text-[var(--color-dark)]">{formatSpecies(adoption.pet.especie)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-sm text-[var(--color-cinza-claro)]">Gênero</p>
                      <p className="font-semibold text-[var(--color-dark)]">{formatGender(adoption.pet.sexo)}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm text-[var(--color-cinza-claro)] mb-1">Descrição</p>
                    <p className="text-[var(--color-dark)]">{adoption.pet.descricao}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Informações do Adotante */}
            <section className="bg-gradient-to-br from-[var(--color-verde-fraco)] to-white rounded-2xl p-6 border-2 border-[var(--color-verde-claro)]">
              <h2 className="text-2xl font-bold text-[var(--color-verde-escuro)] mb-4 flex items-center gap-2">
                <FaUser className="w-6 h-6" />
                Informações do Adotante
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-2">
                    <FaUser className="w-5 h-5 text-[var(--color-azul)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-cinza-claro)]">Nome Completo</p>
                    <p className="font-semibold text-[var(--color-dark)]">{adoption.usuario.nomeCompleto}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-2">
                    <FaEnvelope className="w-5 h-5 text-[var(--color-laranja)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-cinza-claro)]">Email</p>
                    <p className="font-semibold text-[var(--color-dark)]">{adoption.usuario.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-2">
                    <FaPhone className="w-5 h-5 text-[var(--color-verde-escuro)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-cinza-claro)]">Telefone</p>
                    <p className="font-semibold text-[var(--color-dark)]">{adoption.endereco.telefone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white rounded-full p-2">
                    <FaMapMarkerAlt className="w-5 h-5 text-[var(--color-azul)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-cinza-claro)]">Endereço</p>
                    <p className="font-semibold text-[var(--color-dark)]">
                      {`${adoption.endereco.logradouro}, ${adoption.endereco.numero}`}
                    </p>
                    <p className="text-[var(--color-cinza-claro)] text-sm">
                      {`${adoption.endereco.bairro}, ${adoption.endereco.cidade} - ${adoption.endereco.estado}`}
                    </p>
                    <p className="text-[var(--color-cinza-claro)] text-sm">{adoption.endereco.pais}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Atualizar Status */}
            <section className="bg-gradient-to-br from-[var(--color-azul-fraco)] to-white rounded-2xl p-6 border-2 border-[var(--color-azul)]">
              <h2 className="text-2xl font-bold text-[var(--color-azul)] mb-4 flex items-center gap-2">
                <FaCheckCircle className="w-6 h-6" />
                Atualizar Status
              </h2>
              <select
                className="w-full p-4 border-2 border-[var(--color-azul)] rounded-xl bg-white text-[var(--color-dark)] font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--color-azul-fraco)] transition-all cursor-pointer hover:border-[var(--color-azul)]"
                value={adoption.status}
                onChange={handleStatusChange}
              >
                <option value="PENDENTE">Pendente</option>
                <option value="APROVADA">Aprovada</option>
                <option value="REJEITADA">Rejeitada</option>
              </select>
              {error && (
                <p className="text-red-500 mt-3 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
