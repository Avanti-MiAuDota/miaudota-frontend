import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import logo from "../assets/img/miaulogo.png";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-verde-escuro text-light py-6 shadow-inner mt-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Logo */}
        <div className="w-[80px] sm:w-[120px] flex-shrink-0">
          <Link to="/" aria-label="Página inicial - MiAuDota">
            <img src={logo} alt="Logo da MiAuDota" className="w-full" />
          </Link>
        </div>

        {/* Navegação */}
        <nav aria-label="Navegação do rodapé" className="text-center">
          <ul className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center text-sm uppercase font-medium">
            <li>
              <Link to="/sobre" className="link-nav hover:text-laranja">
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/pets" className="link-nav hover:text-laranja">
                Pets
              </Link>
            </li>
            <li>
              <Link to="/contato" className="link-nav hover:text-laranja">
                Contato
              </Link>
            </li>
           
          </ul>
        </nav>

        {/* Redes sociais + Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
          <div className="flex gap-4 text-xl">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram MiAuDota"
              className="hover:text-laranja transition-colors"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook MiAuDota"
              className="hover:text-laranja transition-colors"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter MiAuDota"
              className="hover:text-laranja transition-colors"
            >
              <FaTwitter />
            </a>
          </div>

          <div className="text-xs text-light text-center sm:text-right">
            © {year} MiAuDota. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};
