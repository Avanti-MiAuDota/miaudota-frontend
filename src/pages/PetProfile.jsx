import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReturnButton } from "../components/ReturnButton";
import toast from "react-hot-toast";
import { CustomLoader } from "../components/CustomLoader";
import "../index.css";

const formato_data = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Função para calcular a idade baseada na data de nascimento
const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return "Desconhecida";
  
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  
  let anos = hoje.getFullYear() - nascimento.getFullYear();
  let meses = hoje.getMonth() - nascimento.getMonth();
  
  if (meses < 0) {
    anos--;
    meses += 12;
  }
  
  if (anos === 0) {
    return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  } else if (anos === 1 && meses === 0) {
    return "1 ano";
  } else if (anos === 1 && meses > 0) {
    return `1 ano e ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  } else {
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  }
};

const specieLabel = (s) => (s === "CAO" ? "Cachorro" : s === "GATO" ? "Gato" : s);
const sexoLabel = (s) => (s === "MACHO" ? "Macho" : s === "FEMEA" ? "Fêmea" : s);
const statusLabel = (s) => {
  switch (s) {
    case "DISPONIVEL":
      return "Disponível";
    case "EM_ANALISE":
      return "Em Análise";
    case "ADOTADO":
      return "Adotado";
    default:
      return s;
  }
};

// Função para obter as cores baseadas na espécie
const getThemeColors = (especie) => {
  if (especie === "GATO") {
    return {
      primary: "var(--color-azul)", 
      secondary: "var(--color-azul-marinho)",
      light: "var(--color-azul-fraco)",
      dark: "var(--color-azul-escuro)",
      border: "var(--color-azul-marinho)",
      disponivel: "var(--color-verde-claro)",
      emAnalise: "var(--color-laranja)",
      adotado: "var(--color-cinza-claro)",
    };
  }
  // Default para Cachorro (verde)
  return {
    primary: "var(--color-verde-claro)",
    secondary: "var(--color-verde-escuro)",
    light: "var(--color-verde-fraco)",
    dark: "var(--color-verde-escuro)",
    border: "var(--color-verde-claro)",
    disponivel: "var(--color-verde-claro)",
    emAnalise: "var(--color-laranja)",
    adotado: "var(--color-cinza-claro)",
  };
};

// Função para obter a cor do status
const getStatusColor = (status, themeColors) => {
  switch (status) {
    case "DISPONIVEL":
      return themeColors.disponivel;
    case "EM_ANALISE":
      return themeColors.emAnalise;
    case "ADOTADO":
      return themeColors.adotado;
    default:
      return themeColors.primary;
  }
};

export const PetProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false); // ✅ Adicione este estado

  useEffect(() => {
    if (!id) return;
    const ac = new AbortController();

    const fetchPet = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/pets/${id}`, { signal: ac.signal });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setPet(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Erro ao buscar pet:", err);
          setError("Não foi possível carregar os dados do pet.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
    return () => ac.abort();
  }, [id]);

  // Função para lidar com o clique no botão Adotar
  const handleAdotarClick = (e) => {
    if (!user) {
      e.preventDefault(); // Previne a navegação
      
      // Toast personalizado
      toast.error("Você precisa fazer login para adotar um pet!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: 'var(--color-laranja)',
          color: 'white',
          fontSize: '16px',
          padding: '16px',
        },
        icon: '🔒',
      });
      
      // ✅ Mostra o loader e redireciona para login após um breve delay
      setRedirecting(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }
    // Se chegou aqui, o usuário está logado e pode prosseguir com a adoção
  };

  // ✅ Condição para mostrar o loader durante o redirecionamento
  if (redirecting) {
    return <CustomLoader />;
  }

  const themeColors = pet ? getThemeColors(pet.especie) : getThemeColors("CAO");

  if (loading) {
    return <CustomLoader />;
  }

  if (error) {
    return (
      <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4 pt-17">
        <div className="absolute top-2 left-6">
          <ReturnButton />
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4 pt-17">
        <div className="absolute top-2 left-6">
          <ReturnButton />
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p>Pet não encontrado.</p>
          </div>
        </div>
      </div>
    );
  }

  const fotoUrl = pet.foto ? pet.foto : "/images/pet-placeholder.png";

  // Condição para mostrar o botão Adotar:
  // - Pet não pode estar ADOTADO
  // - Usuário não pode ser ADMIN
  const mostrarBotaoAdotar = pet.status !== "ADOTADO" && user?.role !== "ADMIN";

  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4 pt-17">
      <div className="absolute top-2 left-6">
        <ReturnButton />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center items-start">
                <img
                  src={fotoUrl}
                  alt={`Foto de ${pet.nome}`}
                  className="w-full md:w-64 h-64 object-cover rounded-xl border-2"
                  style={{ borderColor: themeColors.border }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1
                      className="text-2xl md:text-3xl font-bold"
                      style={{ color: themeColors.dark }}
                    >
                      {pet.nome}
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--color-cinza-claro)" }}>
                      Cadastrado em {formato_data(pet.criadoEm)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        background: getStatusColor(pet.status, themeColors),
                        color: pet.status === "ADOTADO" ? "white" : "var(--color-dark)",
                      }}
                    >
                      {statusLabel(pet.status)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Espécie</h3>
                    <p className="text-base">{specieLabel(pet.especie)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Sexo</h3>
                    <p className="text-base">{sexoLabel(pet.sexo)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Nascimento</h3>
                    <p className="text-base">
                      {pet.dataNascimento ? formato_data(pet.dataNascimento) : "Desconhecido"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Idade</h3>
                    <p className="text-base">{calcularIdade(pet.dataNascimento)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700">Descrição</h3>
                  <p className="mt-2 text-gray-800 whitespace-pre-line">{pet.descricao}</p>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    {mostrarBotaoAdotar && (
                      <Link
                        to={user ? `/pets/adopt/${pet.id}` : "#"}
                        onClick={handleAdotarClick}
                        className="inline-block w-full sm:w-auto text-center font-semibold px-5 py-2 rounded-2xl shadow-sm transition-transform active:scale-95"
                        style={{
                          background: themeColors.dark,
                          color: "white",
                        }}
                        aria-label={`Adotar ${pet.nome}`}
                      >
                        Adotar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="block md:hidden mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};