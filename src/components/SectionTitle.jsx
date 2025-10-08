import { MdPets } from "react-icons/md"

export const SectionTitle = ({ title }) => {
  return (
    <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-verde-escuro text-center justify-center">
      <MdPets className="text-2xl sm:text-3xl text-laranja" />
      <h2>{title}</h2>
    </div>
  )
}
