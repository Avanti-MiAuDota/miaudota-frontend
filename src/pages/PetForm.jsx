import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "../components/InputField";
import { SelectField } from "../components/SelectField";
import { SubmitButton } from "../components/SubmitButton";
import { ReturnButton } from "../components/ReturnButton";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CustomLoader } from "../components/CustomLoader";


const petSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  dataNascimento: z
    .string()
    .optional()
    .refine(
      (val) => !val || new Date(val) <= new Date(),
      "A data de nascimento não pode ser futura"
    ),
  especie: z.enum(["CAO", "GATO"], {
    required_error: "Selecione a espécie",
  }),
  sexo: z.enum(["MACHO", "FEMEA"], {
    required_error: "Selecione o sexo",
  }),
  status: z.enum(["DISPONIVEL", "ADOTADO", "INDISPONIVEL"], {
    required_error: "Selecione o status",
  }),
  descricao: z
    .string()
    .min(10, "A descrição deve ter no mínimo 10 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
  foto: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files.length === 1,
      "Envie apenas uma foto"
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files[0]?.type
        ),
      "Formato de imagem inválido (aceito: jpeg, jpg, png, webp)"
    )
    .refine(
      (files) =>
        !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024,
      "Arquivo muito grande (máx. 5MB)"
    ),
});

// Função para obter as cores baseadas na espécie
const getThemeColors = (especie) => {
  if (especie === "GATO") {
    return {
      primary: "var(--color-azul)", 
      secondary: "var(--color-azul-marinho)",
      light: "var(--color-azul-fraco)",
      dark: "var(--color-azul-escuro)",
      border: "var(--color-azul-marinho)",
    };
  }
  return {
    primary: "var(--color-verde-claro)",
    secondary: "var(--color-verde-escuro)",
    light: "var(--color-verde-fraco)",
    dark: "var(--color-verde-escuro)",
    border: "var(--color-verde-claro)",
  };
};

export const PetForm = () => {
  const { id } = useParams(); 
  const [preview, setPreview] = useState(null);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(petSchema),
  });

  // Carrega dados do pet se for edição
  useEffect(() => {
    if (!id) return;

    const fetchPet = async () => {
      try {
        const res = await fetch(`/api/pets/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPet(data);
        
        reset({
          nome: data.nome,
          dataNascimento: data.dataNascimento?.split('T')[0],
          especie: data.especie,
          sexo: data.sexo,
          status: data.status,
          descricao: data.descricao,
        });
        
        if (data.foto) {
          setPreview(data.foto);
        }
      } catch (err) {
        setError("Não foi possível carregar os dados do pet.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      for (const key in data) {
        if (key === "foto" && data.foto && data.foto.length > 0) {
          formData.append("foto", data.foto[0]);
        } else if (key !== "foto" && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }

      const url = id ? `/api/pets/${id}` : "/api/pets";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao salvar pet");

      alert(`Pet ${id ? "atualizado" : "cadastrado"} com sucesso!`);
      
      if (!id) {
        reset();
        setPreview(null);
      }
    } catch (error) {
      alert("Erro ao salvar pet. Tente novamente.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(pet?.foto || null);
    }
  };

  // Lógica de cores baseada na espécie para edição
  const isEdit = !!id;
  const especieWatch = watch("especie");
  const currentEspecie = isEdit ? (pet?.especie || especieWatch) : especieWatch;
  const themeColors = isEdit ? getThemeColors(currentEspecie) : null;

  if (loading) {
    return <CustomLoader />;
  }

  if (error) {
    return (
      <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4 pt-17">
        <div className="absolute top-2 left-6">
          <ReturnButton />
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4 pt-17">
      <div className="absolute top-2 left-6">
        <ReturnButton />
      </div>

      <div className="max-w-2xl mx-auto">
        <div 
          className="bg-white rounded-2xl shadow-md overflow-hidden p-6"
          style={isEdit ? { 
            borderLeft: `4px solid ${themeColors?.primary}`,
            borderTop: `2px solid ${themeColors?.light}`
          } : {
            border: '2px solid var(--color-laranja)'
          }}
        >
          {/* Título dinâmico */}
          <h1 
            className="text-2xl md:text-3xl font-bold mb-6 text-center"
            style={{ 
              color: isEdit ? themeColors?.dark : 'var(--color-laranja)'
            }}
          >
            {isEdit ? "Editar Pet" : "Cadastrar Pet"}
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            encType="multipart/form-data"
          >
            <InputField
              label="Nome"
              type="text"
              {...register("nome")}
              error={errors.nome?.message}
              className={isEdit ? "" : "border-laranja focus:ring-laranja"}
            />

            <InputField
              label="Data de Nascimento"
              type="date"
              {...register("dataNascimento")}
              error={errors.dataNascimento?.message}
              className={isEdit ? "" : "border-laranja focus:ring-laranja"}
            />

            <SelectField
              label="Espécie"
              options={[
                { value: "CAO", label: "Cachorro" },
                { value: "GATO", label: "Gato" },
              ]}
              {...register("especie")}
              error={errors.especie?.message}
              className={isEdit ? "" : "border-laranja focus:ring-laranja"}
            />

            <SelectField
              label="Sexo"
              options={[
                { value: "MACHO", label: "Macho" },
                { value: "FEMEA", label: "Fêmea" },
              ]}
              {...register("sexo")}
              error={errors.sexo?.message}
              className={isEdit ? "" : "border-laranja focus:ring-laranja"}
            />

            <SelectField
              label="Status"
              options={[
                { value: "DISPONIVEL", label: "Disponível" },
                { value: "ADOTADO", label: "Adotado" },
                { value: "INDISPONIVEL", label: "Indisponível" },
              ]}
              {...register("status")}
              error={errors.status?.message}
              className={isEdit ? "" : "border-laranja focus:ring-laranja"}
            />

            {/* Campo de Foto - Mantido com cores temáticas */}
            <div>
              <label 
                className="block mb-1 font-medium"
                style={{ color: isEdit ? themeColors?.dark : 'var(--color-laranja)' }}
              >
                Foto do Pet
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("foto")}
                onChange={handleFileChange}
                className={`block w-full rounded-md border p-2 focus:outline-none focus:ring-2 ${
                  isEdit ? "" : "border-laranja focus:ring-laranja"
                }`}
                style={isEdit ? { 
                  borderColor: themeColors?.border,
                  focus: { ringColor: themeColors?.primary }
                } : {}}
              />
              {errors.foto && (
                <p className="text-red-500 text-sm mt-1">{errors.foto.message}</p>
              )}
              {(preview || pet?.foto) && (
                <img
                  src={preview || pet.foto}
                  alt="Prévia da imagem"
                  className="mt-3 w-32 h-32 object-cover rounded-lg border-2 mx-auto"
                  style={{ 
                    borderColor: isEdit ? themeColors?.border : 'var(--color-laranja)'
                  }}
                />
              )}
            </div>

            {/* Campo de Descrição - Mantido com cores temáticas */}
            <div>
              <label 
                className="block mb-1 font-medium"
                style={{ color: isEdit ? themeColors?.dark : 'var(--color-laranja)' }}
              >
                Descrição
              </label>
              <textarea
                {...register("descricao")}
                rows="4"
                placeholder="Descreva o pet..."
                className={`w-full rounded-md border p-2 focus:outline-none focus:ring-2 ${
                  isEdit ? "" : "border-laranja focus:ring-laranja"
                }`}
                style={isEdit ? { 
                  borderColor: themeColors?.border,
                  focus: { ringColor: themeColors?.primary }
                } : {}}
              ></textarea>
              {errors.descricao && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.descricao.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-block font-bold py-3 px-6 rounded-2xl transition-colors duration-300 disabled:opacity-50 ${
                isEdit 
                  ? "bg-azul text-white hover:bg-verde-escuro" 
                  : "bg-laranja text-white hover:bg-laranja-escuro"
              }`}
            >
              {isSubmitting ? "Salvando..." : (isEdit ? "Atualizar Pet" : "Cadastrar Pet")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};