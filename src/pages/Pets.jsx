import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPets } from "../api/pet.js";
import { Filter } from "../components/Filter";
import { PetList } from "../components/PetList";
import { SectionTitle } from "../components/SectionTitle";
import { useAuth } from "../contexts/AuthContext";

export const Pets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [displayPets, setDisplayPets] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPets();
        setPets(data);
        setDisplayPets(data);
      } catch (err) {
        console.error("Erro ao carregar pets:", err);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <Filter items={pets} onFiltered={setDisplayPets} />
      <div className="flex flex-row justify-between items-center px-4">
        <div className="hidden sm:block">
          <SectionTitle title="Galeria dos peludinhos" />
        </div>
        <div className="sm:hidden">
          <SectionTitle title="Galeria" />
        </div>
          {user?.role === 'ADMIN' &&
            <Link to="/pets/add" className="bg-transparent sm:bg-laranja py-2 px-3 text-light font-bold rounded-md sm:hover:bg-azul focus:outline-none focus:ring-2 focus:ring-light focus:ring-opacity-75 transition-transform hover:scale-105 cursor-pointer flex items-center gap-2">
              <span className="hidden sm:inline">Novo Pet</span>
              <span className="sm:hidden">Novo</span>
            </Link>
          }
      </div>
      <PetList items={displayPets} />
    </div>
  )
}
