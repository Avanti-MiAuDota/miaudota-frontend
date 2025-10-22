import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReturnButton } from "../components/ReturnButton";
import toast from "react-hot-toast";
import { CustomLoader } from "../components/CustomLoader";
import { NotFound } from "./NotFound";
import { getPet } from "../api/pet";
import "../index.css";

// --- Funções Auxiliares ---

// Função para formatar datas no formato "dd de mmm de aaaa"
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
    return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  } else if (anos === 1 && meses === 0) {
    return "1 ano";
  } else if (anos === 1 && meses > 0) {
    return `1 ano e ${meses} ${meses === 1 ? "mês" : "meses"}`;
  } else {
    return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  }
};

// Funções para mapear códigos para labels (nomes amigáveis)
const especieLabel = (s) =>
  s === "CAO" ? "Cachorro" : s === "GATO" ? "Gato" : s;
const sexoLabel = (s) =>
  s === "MACHO" ? "Macho" : s === "FEMEA" ? "Fêmea" : s;
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

// Função para obter o tema de cores baseado na espécie
const temas_cor = (especie) => {
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
  // Padrão para Cachorro (verde) ou se a espécie for indefinida
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

// Função para obter a cor específica do status
const status_cor = (status, cores) => {
  switch (status) {
    case "DISPONIVEL":
      return cores.disponivel;
    case "EM_ANALISE":
      return cores.emAnalise;
    case "ADOTADO":
      return cores.adotado;
    default:
      return cores.primary;
  }
};

// Componente auxiliar para gerir o delay antes de mostrar a página NotFound
const DelayedNotFoundView = () => {
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaiting(false);
    }, 4000); // Delay de 4 segundos

    return () => clearTimeout(timer);
  }, []);

  if (isWaiting) {
    return <CustomLoader />;
  }

  return <NotFound />;
};

// --- Componente Principal: PetProfile ---
export const PetProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  // Efeito para buscar os dados do pet na API
  useEffect(() => {
    if (!id) return;
    const ac = new AbortController();

    const fetchPet = async () => {
      setLoading(true);
      setError(null);
      try {
        // Garante que o loader fique visível por pelo menos 1 segundo
        const delay = new Promise((resolve) => setTimeout(resolve, 1000));
        const fetchPromise = getPet(id);

        const [data] = await Promise.all([fetchPromise, delay]);
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

  // Função para lidar com o clique no botão "Adotar"
  const handleAdotarClick = (e) => {
    if (!user) {
      e.preventDefault();

      // Dispara a notificação (toast) a avisar que o login é necessário
      toast.error("Você precisa fazer login para adotar um pet!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "var(--color-laranja)",
          color: "white",
          fontSize: "16px",
          padding: "16px",
        },
        icon: "🔒",
      });

      // Ativa o loader e redireciona para o login após 2 segundos
      setRedirecting(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Delay de 2 segundos
      return;
    }
    if (pet.status === "EM_ANALISE" || pet.status === "ADOTADO") {
      e.preventDefault();
      toast(
        `Pet não está disponível para adoção. Status atual: ${statusLabel(
          pet.status
        )}`,
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#266D99",
            color: "white",
            fontSize: "16px",
            padding: "16px",
          },
        }
      );
      return;
    }
  };

  // Renderiza o loader durante o redirecionamento para login
  if (redirecting) {
    return <CustomLoader />;
  }

  // Renderiza o loader principal enquanto os dados são buscados
  if (loading) {
    return <CustomLoader />;
  }

  // Se houver erro ou o pet não for encontrado, mostra o loader por 4s e depois a página NotFound
  if (error || !pet) {
    return <DelayedNotFoundView />;
  }

  // Define as constantes após garantir que `pet` existe
  const cores = temas_cor(pet.especie);
  const fotoUrl =
    pet.foto || "https://placehold.co/256x256/E2E8F0/718096?text=Pet";
  const mostrarBotaoAdotar = pet.status !== "ADOTADO" && user?.role !== "ADMIN";

  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4 pt-17">
      <div className="absolute top-2 left-6">
        <ReturnButton />
      </div>

      {/* Conteúdo do Perfil do Pet */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Secção da Foto */}
              <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center items-start">
                <img
                  src={fotoUrl}
                  alt={`Foto de ${pet.nome}`}
                  className="w-full md:w-64 h-64 object-cover rounded-xl border-2"
                  style={{ borderColor: cores.border }}
                />
              </div>
              {/* Secção de Informações */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1
                      className="text-2xl md:text-3xl font-bold"
                      style={{ color: cores.dark }}
                    >
                      {pet.nome}
                    </h1>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--color-cinza-claro)" }}
                    >
                      Cadastrado em {formato_data(pet.criadoEm)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        background: status_cor(pet.status, cores),
                        color:
                          pet.status === "ADOTADO"
                            ? "white"
                            : "var(--color-dark)",
                      }}
                    >
                      {statusLabel(pet.status)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: cores.dark }}
                    >
                      Espécie
                    </h3>
                    <p className="text-base text-gray-800">
                      {especieLabel(pet.especie)}
                    </p>
                  </div>
                  <div>
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: cores.dark }}
                    >
                      Sexo
                    </h3>
                    <p className="text-base text-gray-800">
                      {sexoLabel(pet.sexo)}
                    </p>
                  </div>
                  <div>
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: cores.dark }}
                    >
                      Nascimento
                    </h3>
                    <p className="text-base text-gray-800">
                      {pet.dataNascimento
                        ? formato_data(pet.dataNascimento)
                        : "Desconhecido"}
                    </p>
                  </div>
                  <div>
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: cores.dark }}
                    >
                      Idade
                    </h3>
                    <p className="text-base text-gray-800">
                      {calcularIdade(pet.dataNascimento)}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: cores.dark }}
                  >
                    Descrição
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-gray-800">
                    {pet.descricao}
                  </p>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    {mostrarBotaoAdotar && (
                      <Link
                        to={user ? `/pets/adopt/${pet.id}` : "#"}
                        onClick={handleAdotarClick}
                        className="inline-block w-full sm:w-auto text-center font-semibold px-5 py-2 rounded-2xl shadow-sm transition-transform active:scale-95"
                        style={{
                          background: cores.dark,
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
