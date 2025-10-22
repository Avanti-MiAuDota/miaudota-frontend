import { FaPaw } from "react-icons/fa";

export const CustomLoader = () => {
  return (
    <div className="h-screen w-screen absolute top-0 left-0 bg-gradient-to-br from-[var(--color-verde-fraco)] to-[var(--color-azul-fraco)] flex items-center justify-center">
      <div className="text-center">
        <FaPaw className="w-16 h-16 text-[var(--color-verde-escuro)] animate-bounce mx-auto mb-4" />
        <p className="text-[var(--color-verde-escuro)] text-lg font-medium">Carregando...</p>
      </div>
    </div>
  );
};
