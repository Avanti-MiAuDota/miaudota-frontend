import logo from "../assets/img/miaulogo.png";
import { useAuth } from "../contexts/AuthContext";
import { MenuDesktop } from "./MenuDesktop";
import { MenuMobile } from "./MenuMobile";
import { useNavigate, Link } from "react-router-dom";
import { MdOutlineAdminPanelSettings, MdOutlineLogout } from "react-icons/md";


export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Função para pegar apenas o primeiro nome
  const getPrimeiroNome = (nomeCompleto) => {
    if (!nomeCompleto) return null;
    return nomeCompleto.split(' ')[0];
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <header className="bg-white shadow-md mb-4">
      <div className="flex justify-between items-center p-4">
        <div className="w-[80px] sm:w-[120px]">
          <Link to="/">
            <img className="w-full" src={logo} alt="Logo da MiAuDota" />
          </Link>
        </div>

        <div className={`flex items-center ${
            !user ? "gap-10 sm:gap-4" : "gap-5"
          }`}>
          {user && (
            <div className="flex items-center gap-2">
              {user.role === "ADMIN" ? (
                <div className="flex items-center gap-2">
                  <MdOutlineAdminPanelSettings className="text-verde-escuro text-xl sm:text-2xl" />
                </div>
              ) : (
                <p className="text-verde-escuro text-sm font-medium mr-[-12px] sm:mr-0">
                  Olá, {getPrimeiroNome(user.nome || user.nomeCompleto)}!
                </p>
              )}
            </div>
          )}

          {user && (
            <>
              {user.role === "ADMIN" ? (
                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center cursor-pointer text-verde-escuro hover:text-verde-claro"
                  title="Painel do Admin"
                >
                  <MdOutlineSettings className="text-2xl sm:text-xl" />
                </Link>
              ) : (
                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center cursor-pointer text-verde-escuro hover:text-verde-claro"
                  title="Meu perfil"
                >
                  <MdPersonOutline className="text-2xl sm:text-xl" />
                </Link>
              )}
            </>
          )}

          {/* Passe a prop user para MenuDesktop */}
          <div className="hidden sm:block">
            <MenuDesktop user={user} />
          </div>

          {user ? (
            <button
              className="bg-transparent sm:bg-laranja py-2 px-3 text-light font-bold uppercase rounded-md sm:hover:bg-azul focus:outline-none focus:ring-2 focus:ring-light focus:ring-opacity-75 transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
              onClick={handleLogout}
            >
              <p className="hidden sm:inline">Sair</p>
              <MdOutlineLogout className="text-laranja sm:text-light text-xl hover:text-azul" />
            </button>
          ) : (
            <Link
                className="bg-laranja py-2 px-3 text-light font-bold uppercase rounded-md hover:bg-azul focus:outline-none focus:ring-2 focus:ring-light focus:ring-opacity-75 transition-transform hover:scale-105  "
              to="/login"
            >
              Entrar
            </Link>
          )}

         
          <div className="sm:hidden">
            <MenuMobile user={user} />
          </div>
        </div>
      </div>
    </header>
  );
};