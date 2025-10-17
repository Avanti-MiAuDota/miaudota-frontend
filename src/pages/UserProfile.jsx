import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAllUsuarios, getUsuarioById, updateUsuario, deleteUsuario } from "../api/usuario";
import { getPet } from "../api/pet";
import toast, { Toaster } from "react-hot-toast";

export const UserProfile = () => {
    const { id } = useParams();
    const { token, user: authUser, logout } = useAuth();
    const [usuario, setUsuario] = useState(null);
    const [todosUsuarios, setTodosUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        nomeCompleto: "",
        email: "",
        senha: "",
    });
    const [confirmDelete, setConfirmDelete] = useState(false);

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
                                petNome: pet.nome,
                                petStatus: pet.status
                            };
                        })
                    );
                }

                const usuarioData = { 
                    ...data, 
                    adocoes: adocoesComPet,
                    nomeCompleto: data.nomeCompleto || data.nome || `Usuário ${id}`
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

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUpdate = async () => {
        try {
            const payload = {};
            if (formData.nomeCompleto.trim()) payload.nomeCompleto = formData.nomeCompleto;
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

    const handleDelete = async (deleteUserId = authUser.id) => {
        try {
            await deleteUsuario(deleteUserId, token);

            if (deleteUserId === authUser.id) {
                logout();
                toast.success("Conta deletada com sucesso! 👋");
            } else {
                toast.success("Usuário deletado com sucesso! 🗑️");
                setTodosUsuarios(todosUsuarios.filter(u => u.id !== deleteUserId));
            }
        } catch (error) {
            console.error("Erro ao deletar usuário:", error.response?.data || error);
            toast.error("Erro ao deletar usuário. Verifique se está logado ou se tem permissão.");
        }
    };

    if (loading) return <div className="text-center p-8 text-gray-600"><p>Carregando perfil... ⏳</p></div>;
    if (!usuario) return <div className="text-center p-8 text-red-500"><p>Usuário não encontrado 😢</p></div>;

    return (
        <div className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-xl mt-6 mb-12">
            <h1 className="text-2xl font-extrabold text-gray-800 mb-6 border-b-2 border-green-100 pb-3 text-left">Perfil</h1>

            {editMode && authUser?.role !== "ADMIN" ? (
                <div className="flex flex-col gap-4 p-5 border-2 border-green-300 rounded-xl bg-green-50/50 shadow-inner">
                    <h2 className="text-2xl font-semibold text-green-800">Editar Informações ✏️</h2>
                    <input type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} placeholder="Nome completo" className="border p-3 rounded-lg"/>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-3 rounded-lg"/>
                    <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Nova Senha (opcional)" className="border p-3 rounded-lg"/>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button onClick={handleUpdate} className="flex-1 bg-verde-escuro text-white py-3 rounded-lg font-bold hover:bg-verde-claro">Salvar Alterações</button>
                        <button onClick={() => setEditMode(false)} className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400">Cancelar</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informações de Contato</h2>
                        <dl className="space-y-3">
                            <div className="flex justify-between"><dt className="font-medium text-gray-600">Nome:</dt><dd className="text-gray-900 font-semibold">{usuario.nomeCompleto}</dd></div>
                            <div className="flex justify-between"><dt className="font-medium text-gray-600">Email:</dt><dd className="text-gray-900">{usuario.email}</dd></div>
                        </dl>
                    </div>

                    {authUser?.role !== "ADMIN" && (
                        <>
                            <button onClick={() => setEditMode(true)} className="w-full bg-verde-escuro text-white py-3 rounded-lg font-bold hover:bg-verde-claro">Editar Perfil</button>

                            {/* Cards de adoções */}
                            <div className="pt-6 border-t border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 mb-5">Minhas Adoções ❤️</h2>
                                {usuario.adocoes.length > 0 ? (
                                    <div className="space-y-4">
                                        {usuario.adocoes.map(adocao => (
                                            <div key={adocao.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm">
                                                <p className="font-semibold text-lg text-green-700 mb-2">Adoção registrada</p>
                                                <ul className="space-y-1 text-sm text-gray-700">
                                                    <li><span className="font-medium">Data da Adoção:</span> {new Date(adocao.dataAdocao).toLocaleDateString()}</li>
                                                    <li><span className="font-medium">Aceitou Termo:</span> <span className={adocao.aceitouTermo ? "text-green-600" : "text-red-600"}>{adocao.aceitouTermo ? "Sim ✅" : "Não ❌"}</span></li>
                                                    <li><span className="font-medium">Pet:</span> {adocao.petNome} - <span className="text-blue-600">{adocao.petStatus}</span></li>
                                                    <li><span className="font-medium">Criado em:</span> {new Date(adocao.criadoEm).toLocaleString()}</li>
                                                    <li className="pt-2"><span className="font-medium block mb-1">Motivo da Adoção:</span><p className="italic text-gray-600 border-l-4 border-green-400 pl-3">{adocao.motivo}</p></li>
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-center">
                                        <p className="font-medium">Nenhuma adoção registrada ainda. 🐾</p>
                                        <p className="text-sm mt-1">Que tal encontrar um novo amigo hoje?</p>
                                    </div>
                                )}
                            </div>
                            <div className="pt-6 border-t-2 border-red-300 mt-8">
                                <p className="text-center text-sm text-red-500 mb-3 font-medium">
                                    ⚠️ Área de Risco: Esta ação é permanente e não pode ser desfeita.
                                </p>
                                    {confirmDelete ? (
                                        <div className="flex flex-col gap-2">
                                            <p className="text-center text-red-600 font-medium">
                                                Tem certeza que deseja deletar sua conta?
                                            </p>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleDelete()} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700">
                                                    Sim, deletar
                                                </button>
                                                <button onClick={() => setConfirmDelete(false)} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400">
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => setConfirmDelete(true)} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700">
                                            Deletar Conta Permanentemente
                                        </button>
                                    )}
                                </div>
                        </>
                    )}

                    {/* Lista de todos usuários - apenas para admin */}
                    {authUser?.role === "ADMIN" && (
                        <div className="pt-6 border-t border-gray-200 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-5">Todos os Usuários 🧑‍💻</h2>
                            {todosUsuarios.map((u) => (
                                <div key={u.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                                    <div>
                                        <p className="font-semibold text-gray-700">{u.nomeCompleto}</p>
                                        <p className="text-sm text-gray-500">{u.email}</p>
                                    </div>
                                    <button onClick={() => handleDelete(u.id)} className="bg-red-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-red-700">Deletar</button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
};
