import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (err) {
        console.error("Token inválido:", err);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        let dadosUsuario = null;
        if (usuarioSalvo) {
          try {
            dadosUsuario = JSON.parse(usuarioSalvo);
          } catch (e) {
            console.error("Erro ao parsear dados do usuário:", e);
          }
        }

        const userCompleto = {
          ...decoded,
          nome: dadosUsuario?.nomeCompleto || dadosUsuario?.nome,
          email: dadosUsuario?.email,
          dadosCompletos: dadosUsuario
        };

        setUser(userCompleto);

      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUser(null);
      }
    }
  }, []);

  const login = (userData) => {
    const token = userData.token;
    const usuario = userData.usuario;

    if (!token || typeof token !== 'string') {
      console.error('Token inválido ou não encontrado:', token);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      localStorage.setItem('token', token);

      if (usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
      }

      const userFinal = {
        ...decoded,
        nome: usuario?.nomeCompleto || usuario?.nome,
        email: usuario?.email,
        dadosCompletos: usuario
      };

      setUser(userFinal);

      setTimeout(() => navigate("/"), 100);

    } catch (error) {
      console.error('Token inválido:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
