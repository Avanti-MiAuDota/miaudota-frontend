import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { CustomLoader } from "../components/CustomLoader";
import { getPet } from "../api/pet";
import "../index.css";
import dogImg from "../assets/img/dog_miaudota.png";
import catImg from "../assets/img/cat_miaudota.png";
import audio from "../assets/audio/miau_au.mp3";

// =============================================
// COMPONENTE: MatchAnimation
// Propósito: Exibe animação comemorativa quando ocorre um match
// =============================================
const MatchAnimation = ({ petType, onFinish }) => {
  // Refs e estados para controle de áudio
  const audioRef = useRef(null);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const navigate = useNavigate();

  // =============================================
  // CONFIGURAÇÕES DINÂMICAS BASEADAS NO TIPO DE PET
  // =============================================
  
  // Determina se é um gato ou cachorro para personalizar a experiência
  const isCat = petType === "GATO";
  
  // Gradiente de fundo personalizado por espécie
  const bgGradient = isCat
    ? "linear-gradient(135deg, var(--color-azul-marinho), var(--color-azul-fraco))"
    : "linear-gradient(135deg, var(--color-verde-claro), var(--color-verde-fraco))";

  // =============================================
  // EMOJIS DINÂMICOS: Cria array de emojis com propriedades aleatórias
  // useMemo otimiza performance recriando apenas quando isCat muda
  // =============================================
  const emojis = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i, // Identificador único para cada emoji
      char: isCat
        ? ["💙", "🐟", "😺"][Math.floor(Math.random() * 4)] // Emojis para gatos
        : ["💚", "🦴", "🐾"][Math.floor(Math.random() * 4)], // Emojis para cachorros
      left: Math.random() * 100, // Posição horizontal aleatória (0-100%)
      duration: 4 + Math.random() * 6, // Duração aleatória da animação (4-10s)
      direction: Math.random() > 0.5 ? 1 : -1, // Direção lateral aleatória
    }));
  }, [isCat]); // Recria apenas quando isCat muda

  // =============================================
  // EFEITO PRINCIPAL: Controla temporizador e reprodução de áudio
  // =============================================
  useEffect(() => {
    // Temporizador para finalizar animação após 5 segundos
    const timer = setTimeout(() => {
      onFinish(); // Chama callback para finalizar animação
    }, 5000);

    // Função para tentar reproduzir áudio
    const tryPlay = async () => {
      try {
        audioRef.current.muted = false;
        audioRef.current.volume = 0.3; // Volume reduzido para melhor UX
        await audioRef.current.play();
        setSoundPlaying(true); // Marca áudio como reproduzindo
      } catch {
        // Fallback silencioso se áudio falhar
        setSoundPlaying(false);
      }
    };
    
    tryPlay(); // Tenta reproduzir áudio automaticamente
    
    // Cleanup: remove temporizador se componente desmontar
    return () => clearTimeout(timer);
  }, [onFinish]); // Executa apenas quando onFinish muda

  // =============================================
  // FUNÇÃO PARA PULAR ANIMAÇÃO
  // =============================================
  const skipAnimation = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Para o áudio
      audioRef.current.currentTime = 0; // Reinicia o áudio
    }
    onFinish(); // Chama callback para finalizar animação imediatamente
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: bgGradient,
        backgroundSize: "200% 200%", // Permite animação de movimento do gradiente
        animation: "backgroundFlow 6s ease-in-out infinite", // Animação contínua
        zIndex: 9999, // Garante que fique acima de tudo
      }}
    >
      {/* =============================================
          BOTÃO DE PULAR ANIMAÇÃO: Sempre visível no canto superior direito
          ============================================= */}
      <motion.button
        onClick={skipAnimation}
        className="absolute top-5 right-5 z-[99999] p-3 bg-black/40 rounded-full bg-opacity-10 text-white font-semibold hover:scale-110 transition backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }} // Aparece após 1 segundo
        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.6)" }}
        whileTap={{ scale: 0.95 }}
      >
        Pular Animação
      </motion.button>

      {/* =============================================
          BOTÃO DE FALLBACK DE ÁUDIO: Aparece apenas se áudio não tocar automaticamente
          ============================================= */}
      {!soundPlaying && (
        <button
          onClick={async () => {
            try {
              audioRef.current.muted = false;
              audioRef.current.volume = 0.3;
              await audioRef.current.play();
              setSoundPlaying(true);
            } catch {
              console.warn("Falha ao tocar som");
            }
          }}
          className="absolute top-5 left-5 z-[99999] p-3 bg-black/40 rounded-full bg-opacity-10 text-2xl hover:scale-110 transition backdrop-blur-sm"
        >
          🎼
        </button>
      )}

      {/* =============================================
          IMAGEM DO ANIMAL: Animação de entrada com Framer Motion
          ============================================= */}
      <motion.img
        src={isCat ? catImg : dogImg}
        alt={isCat ? "Gato feliz" : "Cachorro feliz"}
        className="w-72 md:w-[34rem] h-auto object-contain drop-shadow-xl match-animal-img relative z-10"
        initial={{ scale: 0.8, opacity: 0 }} // Estado inicial (antes da animação)
        animate={{ scale: 1, opacity: 1 }} // Estado final da animação
        transition={{ duration: 0.6 }} // Duração da transição
      />

      {/* =============================================
          TEXTO PRINCIPAL: "Você deu match"
          ============================================= */}
      <motion.h2
        initial={{ opacity: 0, y: -20}} // Começa invisível e 20px acima
        animate={{ opacity: 1, y: 0 }} // Termina visível na posição normal
        transition={{ duration: 0.6, delay: 0.3 }} // Delay para sequenciar com imagem
        className="font-serif text-4xl md:text-5xl text-white font-bold drop-shadow-lg relative z-10"
      >
        Você deu MATCH!
      </motion.h2>

      {/* =============================================
          ELEMENTO DE ÁUDIO: Controlado via ref
          ============================================= */}
      <audio ref={audioRef} src={audio} loop muted />

      {/* =============================================
          EMOJIS FLUTUANTES: Criam efeito de chuva de emojis
          ============================================= */}
      {emojis.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-white opacity-90 z-0"
          style={{
            left: `${item.left}vw`, // Posição horizontal em % da viewport width
            fontSize: `${18 + Math.random() * 22}px`, // Tamanho aleatório
          }}
          initial={{ y: "110vh", x: 0, opacity: 0 }} // Começa abaixo da tela
          animate={{
            y: "-10vh", // Termina acima da tela
            x: [0, item.direction * 60], // Movimento lateral aleatório
            opacity: [0.8, 0.9, 0], // Fade-out gradual
          }}
          transition={{
            duration: item.duration, // Duração única por emoji
            repeat: Infinity, // Loop infinito
            ease: "linear", // Movimento linear constante
          }}
        >
          {item.char}
        </motion.div>
      ))}

      {/* =============================================
          ANIMAÇÃO CSS PERSONALIZADA: Movimento do gradiente de fundo
          ============================================= */}
      <style>
        {`
          @keyframes backgroundFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

// =============================================
// COMPONENTE: PetCardAfterMatch
// Propósito: Exibe informações finais após a animação
// =============================================
const PetCardAfterMatch = ({ pet, user }) => {
  const navigate = useNavigate();
  const isCat = pet?.especie === "GATO";

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{
        background: isCat
          ? "linear-gradient(180deg, var(--color-azul-fraco), var(--color-azul-marinho))"
          : "linear-gradient(180deg, var(--color-verde-fraco), var(--color-verde-escuro))",
      }}
      initial={{ opacity: 0 }} // Fade in suave
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* =============================================
          FOTO DO PET: Usa foto real ou fallback
          ============================================= */}
      <motion.img
        src={pet?.foto || (isCat ? catImg : dogImg)}
        alt={pet?.nome}
        className="w-48 h-48 object-cover rounded-full shadow-lg border-4 border-white mb-6 match-final-img"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      />
      
      {/* =============================================
          MENSAGEM DE PARABÉNS PERSONALIZADA
          ============================================= */}
      <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
        🎉 Parabéns, {user?.nome || "amigo"}!
      </h1>
      <p className="text-white/90 mb-4 text-lg">
        Seu formulário de adoção foi recebido com sucesso!
      </p>
      
      {/* =============================================
          INFORMAÇÕES DO PET COM ANIMAÇÃO ESCALONADA
          ============================================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Entrada com delay
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl text-white font-semibold">{pet?.nome}</h2>
        <p className="text-white/80 mt-2 max-w-md">{pet?.descricao}</p>
      </motion.div>
      
      {/* =============================================
          BOTÕES DE AÇÃO: Navegação pós-match
          ============================================= */}
      <button
        onClick={() => navigate(`/pets/${pet.id}`)}
        className="mt-6 px-8 py-3 bg-white text-gray-800 rounded-full font-semibold hover:bg-gray-100 transition"
      >
        Ver perfil completo
      </button>
      <button 
        onClick={() => navigate('/')} 
        className="mt-4 px-8 py-3 bg-white text-gray-800 rounded-full font-semibold hover:bg-gray-100 transition"
      >
        Voltar à página inicial
      </button>
    </motion.div>
  );
};

// =============================================
// COMPONENTE PRINCIPAL: Match
// Propósito: Orquestra todo o fluxo de match
// =============================================
export const Match = () => {
  // =============================================
  // HOOKS E ESTADOS
  // =============================================
  const { user } = useAuth(); // Dados do usuário logado
  const navigate = useNavigate();
  const location = useLocation(); // Para acessar state da navegação
  const { petId } = location.state || {}; // ID do pet vindo da navegação

  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false); // Controla exibição da animação

  // =============================================
  // EFEITO: Busca dados do pet quando componente monta
  // =============================================
  useEffect(() => {
    const fetchPet = async () => {
      try {
        if (petId) {
          const data = await getPet(petId);
          setPet(data);
          setShowAnimation(true); // Ativa animação após carregar dados
        } else {
          setError("ID do pet não encontrado");
        }
      } catch {
        setError("Erro ao carregar dados do pet");
      } finally {
        setLoading(false); // Finaliza loading independente do resultado
      }
    };
    fetchPet();
  }, [petId]); // Executa apenas quando petId muda

  // =============================================
  // RENDERIZAÇÃO CONDICIONAL
  // =============================================
  
  // Estado de carregamento
  if (loading) return <CustomLoader />;
  
  // Estado de erro
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-500">
        {error}
      </div>
    );

  // Animação de match
  if (showAnimation)
    return (
      <MatchAnimation
        petType={pet?.especie}
        onFinish={() => setShowAnimation(false)} // Callback para finalizar animação
      />
    );

  // Tela final com informações
  return <PetCardAfterMatch pet={pet} user={user} />;
};