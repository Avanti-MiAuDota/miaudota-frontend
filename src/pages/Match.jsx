import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CustomLoader } from "../components/CustomLoader";
import { getPet } from "../api/pet";
import "../index.css"; // garante que as variáveis de cor estão disponíveis

// --- Componente da animação do cachorro ---
const DogMatchAnimation = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 4000); // 4 segundos de animação

    // som do "au"
    const audio = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_966a83b1b3.mp3");
    audio.volume = 0.3;
    audio.play();

    return () => clearTimeout(timer);
  }, [onFinish]);

  // cria ossinhos flutuantes
  const bones = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        backgroundColor: "var(--color-verde-claro)",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <img
        src="/dog_miaudota.png"
        alt="Cachorro"
        className="w-40 md:w-56 animate-bounce"
      />

      {/* coração pulsante */}
      <div
        className="absolute"
        style={{
          top: "45%",
          left: "54%",
          width: "25px",
          height: "25px",
          backgroundColor: "red",
          transform: "rotate(45deg)",
          animation: "pulse 1s infinite",
        }}
      >
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1) rotate(45deg); opacity: 0.8; }
              50% { transform: scale(1.3) rotate(45deg); opacity: 1; }
              100% { transform: scale(1) rotate(45deg); opacity: 0.8; }
            }
          `}
        </style>
      </div>

      {/* ossinhos animados */}
      {bones.map((i) => (
        <div
          key={i}
          className="absolute bg-yellow-100 rounded-full"
          style={{
            width: "40px",
            height: "15px",
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            borderRadius: "10px",
            animation: `float${i} ${6 + Math.random() * 4}s linear infinite`,
          }}
        >
          <style>
            {`
              @keyframes float${i} {
                0% { transform: translateY(0) translateX(100vw) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-100vh) translateX(-100vw) rotate(360deg); opacity: 0; }
              }
            `}
          </style>
        </div>
      ))}

      {/* Música leve (xilofone/piano) */}
      <audio autoPlay loop volume="0.2">
        <source src="https://cdn.pixabay.com/download/audio/2022/02/10/audio_6b6a1bfa74.mp3?filename=soft-happy-piano-music-13384.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
};

// --- Componente Principal: Match ---
export const Match = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { petId } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(true);

  // Mostra animação primeiro
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 4000); // tempo da animação
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        if (petId) {
          const petData = await getPet(petId);
          setPet(petData);
        } else {
          setError("ID do pet não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar pet:", error);
        setError("Erro ao carregar dados do pet");
      } finally {
        setLoading(false);
      }
    };
    fetchPetData();
  }, [petId]);

  if (showAnimation) return <DogMatchAnimation onFinish={() => setShowAnimation(false)} />;
  if (loading) return <CustomLoader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-500">
        {error}
      </div>
    );

  // --- Conteúdo original do Match ---
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* todo o seu conteúdo aqui */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-verde-escuro mb-6 text-center">
          🎉 Parabéns, {user?.nome || "amigo"}!
        </h1>
        <p className="text-center text-lg text-cinza-claro mb-8">
          Seu formulário de adoção foi recebido com sucesso!
        </p>
        {/* ... resto do conteúdo (igual ao seu) */}
      </div>
    </div>
  );
};
