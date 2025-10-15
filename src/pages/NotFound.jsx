import img1 from "../assets/img/gato_not_found.png"
import { useNavigate } from 'react-router-dom';


export const NotFound = () => {
  const navigate = useNavigate();
    return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 font-sans text-gray-700">
      
      <img src={img1} alt="Página não encontrada" className="mb-5 w-52" />
      <h2 className="mb-4 text-4xl font-bold text-gray-800 text-center">
        Oh, não! A página sumiu...
      </h2>
      <p className="mb-8 max-w-md text-center text-lg">
        O gatinho está triste porque não conseguiu encontrar esta página.
        Que tal voltarmos a um lugar mais familiar?
      </p>
      <button
        onClick={() => navigate('/')}
        className="transform rounded-lg bg-laranja px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-azul focus:outline-none focus:ring-2 focus:ring-light focus:ring-opacity-75 cursor-pointer"
      >
        Leve-me de volta ao início
      </button>
      
    </div>
  );
};
