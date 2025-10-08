import React from 'react';
import imgUnauthorized from "../assets/img/cao_unauthorized.png";
import { useNavigate } from 'react-router-dom';


export const Unauthorized = () => {
  const navigate = useNavigate();
  const GoLogin = () => {
  window.location.href = '/login'; 
};
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 font-sans text-gray-700">

      <img src={imgUnauthorized} alt="Acesso Negado" className="mb-5 w-52" />

      <h2 className="mb-4 text-4xl font-bold text-laranja"> 
       Acesso Negado
      </h2>
      <p className="mb-8 max-w-md text-center text-lg">
        Ai, que pena! O PoliciAU está de plantão. Ele não deixa entrar sem as credenciais corretas.
        
      </p>
        

      <div className="flex flex-col items-center gap-4"> 
        <button
          onClick={GoLogin}
          className="transform rounded-lg bg-laranja px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-azul focus:outline-none focus:ring-2 focus:ring-light focus:ring-opacity-75" 
        >
          Tentar login novamente
        </button>
  
      </div>
      
    </div>
  );
};

