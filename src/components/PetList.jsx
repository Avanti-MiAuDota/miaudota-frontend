import { useEffect, useState } from "react"
import { PetCard } from "./PetCard"
import { getPets } from "../api/pet.js"
import { CustomLoader } from "../components/CustomLoader.jsx"
import { useResponsiveLimit } from "../hooks/useResponsiveLimit"
import { FcNext, FcPrevious } from "react-icons/fc"

export const PetList = () => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const limit = useResponsiveLimit()

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const result = await getPets()
        setPets(result)
        setError(null)
      } catch (error) {
        console.error("Erro ao carregar pets:", error)
        setError(error.message || "Erro ao carregar pets")
      } finally {
        setLoading(false)
      }
    }
    fetchPets()
  }, [])

  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-center text-red-500">Erro: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-azul text-white px-4 py-2 rounded mx-auto block"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  // calcular início e fim do slice
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedPets = pets.slice(start, end)

  const totalPages = Math.ceil(pets.length / limit)

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedPets.length === 0 ? (
          <p className="col-span-4 text-center">Nenhum pet cadastrado!</p>
        ) : (
          paginatedPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="text-azul cursor-pointer"
          >
            <FcPrevious />
          </button>
          <span className="px-3 py-1">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="text-azul cursor-pointer"
          >
            <FcNext />
          </button>
        </div>
      )}
    </div>
  )
}
