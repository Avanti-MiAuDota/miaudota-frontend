import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { ReturnButton } from './ReturnButton';

export const MenuMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-azul focus:outline-none cursor-pointer mt-1"
        aria-label="Abrir menu"
      >
        {isOpen ? <HiX size={34} /> : <HiMenu size={34} />}
      </button>

      <nav
        className={`
          absolute top-[80px] right-0 w-full h-screen bg-white shadow-lg p-6 rounded-bl-md z-50 flex flex-col gap-4 text-dark
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}
        `}
      >
        <Link onClick={() => setIsOpen(false)} to="/" className="link-nav font-semibold">Home</Link>
        <Link onClick={() => setIsOpen(false)} to="/about" className="link-nav font-semibold">Sobre</Link>
        <Link onClick={() => setIsOpen(false)} to="/register" className="link-nav font-semibold">Cadastro</Link>
      </nav>
      
    </div>
    
  );
};
