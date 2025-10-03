import { Link } from "react-router-dom"

export const PetCard = ({ pet }) => {
  const statusClasses = {
    "DISPONIVEL": "bg-verde-claro text-dark font-bold",
    "EM_ANALISE": "bg-azul text-light font-bold",
    "ADOTADO": "bg-laranja text-dark font-bold",
  };

  const statusLabels = {
    "DISPONIVEL": "Disponível",
    "EM_ANALISE": "Em análise",
    "ADOTADO": "Adotado",
  };

  const badgeClass = statusClasses[pet.status] || "bg-transparent";
  return (
    <div className="bg-white shadow rounded-md p-3">
      <Link to={`/pets/${pet.id}`}>
        <h2 className={`text-lg font-bold uppercase mb-2 ${pet.especie === "CAO" ? "text-verde-escuro" : "text-azul"}`}>
          <span>{pet.especie === "CAO" ? "🐶 " : "🐱 "}</span>
          {pet.nome}
        </h2>
        <div className="relative">
          <div
            className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${badgeClass}`}
          >
            {statusLabels[pet.status] || pet.status}
          </div>
          <div>
            <img src={pet.foto} alt={pet.nome} className="w-full h-48 object-cover rounded-md" />
          </div>
          <div>
            <p className="text-dark mt-2">{pet.descricao}</p>
          </div>
        </div>
      </Link>

      <div>
        {/* Painel de admin */}
      </div>
    </div>
  )
}
