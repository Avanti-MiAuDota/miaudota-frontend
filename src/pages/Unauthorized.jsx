import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import imgUnauthorized from "../assets/img/cao_unauthorized.png";

export const Unauthorized = () => {
  const { user, logoutForbidden } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  if (user) {
    logoutForbidden();
    toast.error("Por segurança sua sessão foi encerrada", { id: "unauthorized-toast" });
  }
}, [user, logoutForbidden]);

  const handleReturn = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center p-4 font-sans text-gray-700">
      <img src={imgUnauthorized} alt="Acesso Negado" className="mb-5 w-52" />
      <h2 className="mb-4 text-4xl font-bold text-laranja"> 
        Acesso Negado
      </h2>
      <p className="mb-8 max-w-md text-center text-lg">
        Ai, que pena! O PoliciAU está de plantão. Ele não deixa entrar sem as credenciais corretas.
      </p>
      
      <div className="flex flex-col items-center gap-4"> 
        <button
          onClick={handleReturn}
          className="transform rounded-lg bg-laranja px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-azul focus:outline-none focus:ring-2 focus:ring-light focus:ring-opacity-75 cursor-pointer" 
        >
          Retorne para uma área segura
        </button>
      </div>
    </div>
  );
};
