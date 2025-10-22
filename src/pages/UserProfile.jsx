import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from "../api/usuario";
import { getPet } from "../api/pet";
import toast from "react-hot-toast";
import { CustomLoader } from "../components/CustomLoader";

export const UserProfile = () => {
  const { id } = useParams();
  const { token, user: authUser } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    senha: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await getUsuarioById(id, token);

        let adocoesComPet = [];
        if (authUser?.role !== "ADMIN") {

          adocoesComPet = await Promise.all(
            (data.adocoes || []).map(async (adocao) => {
              const pet = await getPet(adocao.petId);
              return {
                ...adocao,
                petNome: pet.nome
              };
            })
          );
        }

        const usuarioData = {
          ...data,
          adocoes: adocoesComPet,
          nomeCompleto: data.nomeCompleto || data.nome || `Usuário ${id}`,
        };

        setUsuario(usuarioData);
        setFormData({
          nomeCompleto: usuarioData.nomeCompleto,
          email: usuarioData.email || "",
          senha: "",
        });

        if (authUser?.role === "ADMIN") {
          const allUsers = await getAllUsuarios(token);
          setTodosUsuarios(allUsers);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error.response?.data || error);
        toast.error("Erro ao buscar usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id, token, authUser]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const payload = {};
      if (formData.nomeCompleto.trim())
        payload.nomeCompleto = formData.nomeCompleto;
      if (formData.email.trim()) payload.email = formData.email;
      if (formData.senha.trim()) payload.senha = formData.senha;

      await updateUsuario(id, payload, token);
      setUsuario({ ...usuario, ...payload });
      setEditMode(false);
      toast.success("Perfil atualizado com sucesso! 🎉");
    } catch (error) {
      console.error("Erro ao atualizar:", error.response?.data || error);
      const msg = error.response?.data?.errors
        ? error.response.data.errors.join(", ")
        : "Erro ao atualizar perfil. Verifique os campos.";
      toast.error(msg, { style: { whiteSpace: "pre-line" } });
    }
  };
  const handleConfirmDelete = async () => {
    if (!usuarioSelecionado) return;

    try {
      await deleteUsuario(usuarioSelecionado.id, token);
      toast.success("Usuário deletado com sucesso! 🗑️");
      setTodosUsuarios(
        todosUsuarios.filter((u) => u.id !== usuarioSelecionado.id)
      );
    } catch (error) {
      console.error("Erro ao deletar usuário:", error.response?.data || error);
      toast.error("Erro ao deletar usuário. Verifique se tem permissão.");
    } finally {
      setShowDeleteModal(false);
      setUsuarioSelecionado(null);
    }
  };

  const sortUsuarios = (usuarios, tipo) => {
    const sorted = [...usuarios];

    switch (tipo) {
      case "ALFABETICA":
        sorted.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
        break;
      case "COM_ADOCOES":
        sorted.sort((a, b) => (b.totalAdocoes || 0) - (a.totalAdocoes || 0));
        break;
      default:
        break;
    }

    return sorted;
  };

  if (loading)
    return (
      <div className="text-center p-8 text-gray-600">
        <CustomLoader />
      </div>
    );
  if (!usuario)
    return (
      <div className="text-center p-8 text-red-500">
        <p>Usuário não encontrado 😢</p>
      </div>
    );

  return (
    <div className="px-4">
      <div className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-xl mt-6 mb-12">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6 border-b-2 border-green-100 pb-3 text-left">
          Perfil
        </h1>
        {editMode && authUser?.role !== "ADMIN" ? (
          <div className="flex flex-col gap-4 p-5 border-2 border-green-300 rounded-xl bg-green-50/50 shadow-inner">
            <h2 className="text-2xl font-semibold text-green-800">
              Editar Informações ✏️
            </h2>
            <input
              type="text"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
              placeholder="Nome completo"
              className="border p-3 rounded-lg"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-3 rounded-lg"
            />
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Nova Senha (opcional)"
              className="border p-3 rounded-lg"
            />
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-verde-escuro text-white py-3 rounded-lg font-bold hover:bg-verde-claro"
              >
                Salvar Alterações
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-lg mb-3">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Informações de Contato
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-600">Nome:</dt>
                  <dd className="text-gray-900 font-semibold">
                    {usuario.nomeCompleto}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-600">Email:</dt>
                  <dd className="text-gray-900">{usuario.email}</dd>
                </div>
              </dl>
            </div>
            {authUser?.role !== "ADMIN" && (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full bg-verde-escuro text-white py-3 rounded-lg font-bold hover:bg-verde-claro"
                >
                  Editar Perfil
                </button>
                {/* Cards de adoções */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-5">
                    Minhas Adoções ❤️
                  </h2>
                  {usuario.adocoes.length > 0 ? (
                    <div className="space-y-4">
                      {usuario.adocoes.map((adocao) => (
                        <div
                          key={adocao.id}
                          className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm"
                        >
                          <p className="font-semibold text-lg text-green-700 mb-2">
                            Adoção registrada
                          </p>
                          <ul className="space-y-1 text-sm text-gray-700">
                            <li>
                              <span className="font-medium">
                                Data da Adoção:
                              </span>{" "}
                              {new Date(adocao.dataAdocao).toLocaleDateString()}
                            </li>
                            <li>
                              <span className="font-medium">
                                Aceitou Termo:
                              </span>{" "}
                              <span
                                className={
                                  adocao.aceitouTermo
                                    ? "text-verde-escuro"
                                    : "text-red-600"
                                }
                              >
                                {adocao.aceitouTermo ? "Sim ✅" : "Não ❌"}
                              </span>
                            </li>
                            <li>
                              <span className="font-medium">Pet:</span><span className="font-semibold text-verde-escuro">
                                {" "}
                                {adocao.petNome}
                              </span>
                            </li>
                            <li>
                              <span className="font-medium">Criado em:</span>{" "}
                              {new Date(adocao.criadoEm).toLocaleString()}
                            </li>
                            <li className="pt-2">
                              <span className="font-medium block mb-1">
                                Motivo da Adoção:
                              </span>
                              <p className="italic text-gray-600 border-l-4 border-green-400 pl-3">
                                {adocao.motivo}
                              </p>
                            </li>
                            <li>
                              <span className="font-medium">Status da Adoção:</span>{" "}
                              <span className="font-medium text-azul">{adocao.status}</span>
                            </li>
                            {adocao.status !== "APROVADA" &&
                            <li>
                             <small className="text-red-500">O abrigo entrará em contato com você em breve para finalizar o processo de adoção!</small>
                            </li>}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-center">
                      <p className="font-medium">
                        Nenhuma adoção registrada ainda. 🐾
                      </p>
                      <p className="text-sm mt-1">
                        Que tal encontrar um novo amigo hoje?
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
            {/* Lista de todos usuários - apenas para admin */}
            {authUser?.role === "ADMIN" && (
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">
                  Todos os Usuários 🧑‍💻
                </h2>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() =>
                      setTodosUsuarios(
                        sortUsuarios(todosUsuarios, "ALFABETICA")
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-green-300"
                  >
                    A-Z
                  </button>
                  <button
                    onClick={() =>
                      setTodosUsuarios(
                        sortUsuarios(todosUsuarios, "COM_ADOCOES")
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-green-300"
                  >
                    Com Adoções
                  </button>
                </div>

                {todosUsuarios
                  .filter((u) => u.role !== "ADMIN")
                  .map((u) => (
                    <div
                      key={u.id}
                      className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                    >
                      <div>
                        <p className="font-semibold text-gray-700">
                          {u.nomeCompleto}
                        </p>
                        <p className="text-sm text-gray-500">{u.email}</p>

                        {/* Indicador de adoções */}
                        {u.totalAdocoes > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-green-600 font-bold">
                              {u.totalAdocoes}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-green-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Ícone de lixeira */}
                        <button
                          onClick={() => {
                            setUsuarioSelecionado(u);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a2 2 0 00-2 2v0a2 2 0 002 2h4a2 2 0 002-2v0a2 2 0 00-2-2m-4 0V3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
      {/* Modal de confirmação de exclusão de usuário */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-start justify-center z-50 pt-20 pointer-events-none">
          <div className="bg-white border-2 border-green-600 rounded-xl shadow-md p-6 w-full max-w-sm pointer-events-auto">
            <p className="text-center text-sm text-black-500 mb-3 font-medium">
              ⚠️ Área de Risco: Esta ação é permanente e não pode ser desfeita.
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-center text-red-600 font-medium">
                Tem certeza que deseja deletar o usuário{" "}
                <span className="font-bold">
                  {usuarioSelecionado?.nomeCompleto}
                </span>
                ?
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition"
                >
                  Sim, deletar
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
