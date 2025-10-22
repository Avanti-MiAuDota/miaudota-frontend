import { useEffect, useState } from 'react';
import { getAdoptions } from '../api/adocao';
import { CustomLoader } from '../components/CustomLoader';
import { ReturnButton } from '../components/ReturnButton';
import { FaDog, FaCat, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const Adoptions = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const data = await getAdoptions();
        setAdoptions(data);
      } catch (error) {
        console.error('Erro ao buscar adoções:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptions();
  }, []);

  const getPetIcon = (species) => {
    switch (species) {
      case 'CAO':
        return <FaDog className="text-primary text-4xl border-2 border-verde-escuro rounded-full p-1 bg-verde-fraco" />;
      case 'GATO':
        return <FaCat className="text-primary text-4xl border-2 border-azul-escuro rounded-full p-1 bg-azul-fraco" />;
      default:
        return null;
    }
  };

  if (loading) return <CustomLoader />;

  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4 pt-17">
      <div className="absolute top-2 left-6">
        <ReturnButton />
      </div>

      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Lista de Adoções</h1>

        {adoptions.length === 0 ? (
          <p className="text-center text-gray-600">Nenhuma adoção encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adoptions.map((adoption) => (
              <div
                key={adoption.id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getPetIcon(adoption.pet.especie)}
                    <h2 className="text-xl font-semibold text-secondary">{adoption.pet.nome}</h2>
                  </div>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Adotante:</span> {adoption.usuario.nomeCompleto}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Data:</span> {adoption.dataAdocao ? new Date(adoption.dataAdocao).toLocaleDateString('pt-BR') : 'Data inválida'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Status:</span> {adoption.status}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/adoptions/${adoption.id}`)}
                  className="text-primary hover:text-secondary transition-colors duration-300 border-2 border-laranja rounded-full p-2 cursor-pointer hover:bg-laranja hover:text-white"
                >
                  <FaArrowRight className="text-lg" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
