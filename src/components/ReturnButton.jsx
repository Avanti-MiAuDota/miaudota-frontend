import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; 

export const ReturnButton = () => {
  const navigate = useNavigate();

 
  const handleReturn = () => {
    navigate(-1); 
  };

  return (
    <button
      onClick={handleReturn}
      className="inline-flex items-center gap-2 bg-laranja text-white font-bold py-2 px-4 rounded-md hover:bg-azul focus:outline-none focus:ring-2 focus:ring-light focus:ring-opacity-75 transition-colors cursor-pointer"
    >
      <IoArrowBack size={20} />
      <span>Voltar</span>
    </button>
  );
};
