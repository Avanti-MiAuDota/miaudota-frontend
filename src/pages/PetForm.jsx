import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CustomLoader } from '../components/CustomLoader';
import { SubmitButton } from '../components/SubmitButton';
import { ReturnButton } from '../components/ReturnButton';
import toast from 'react-hot-toast';
import { getPet, addPet, updatePet } from '../api/pet';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB em bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const petSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  dataNascimento: z.string()
    .min(1, 'Data de nascimento é obrigatória')
    .refine((dateString) => {
      const inputDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate <= today;
    }, {
      message: "A data de nascimento não pode ser no futuro.",
    }),
  especie: z.enum(['CAO', 'GATO'], {
    errorMap: () => ({ message: 'Espécie é obrigatória' })
  }),
  sexo: z.enum(['MACHO', 'FEMEA'], {
    errorMap: () => ({ message: 'Sexo é obrigatório' })
  }),
  status: z.enum(['DISPONIVEL', 'EM_ANALISE', 'ADOTADO'], {
    errorMap: () => ({ message: 'Status é obrigatória' })
  }),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  foto: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return files[0].size <= MAX_FILE_SIZE;
      },
      `O tamanho máximo da imagem é 5MB.`
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
      },
      "Formato inválido. Use apenas JPG ou PNG."
    ),
});

export const PetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(petSchema),
  });

  const especieValue = watch('especie');
  const fotoWatch = watch('foto');

  useEffect(() => {
    if (errors.foto) {
      setPreviewImage(null);
    } else if (fotoWatch && fotoWatch.length > 0) {
      const file = fotoWatch[0];
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  }, [fotoWatch, errors.foto]);

  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }
    const fetchPet = async () => {
      if (!id) return;
      try {
        const petData = await getPet(id);
        reset({
          nome: petData.nome,
          dataNascimento: petData.dataNascimento?.split('T')[0],
          especie: petData.especie,
          sexo: petData.sexo,
          status: petData.status,
          descricao: petData.descricao,
        });
        if (petData.foto) {
          setPreviewImage(petData.foto);
        }
      } catch (error) {
        console.error('Erro ao buscar pet:', error);
        toast.error('Erro ao carregar dados do pet.');
        navigate('/pets');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      const dataNascimentoISO = `${data.dataNascimento}T00:00:00.000Z`;
      
      formData.append('nome', data.nome);
      formData.append('dataNascimento', dataNascimentoISO);
      formData.append('especie', data.especie);
      formData.append('sexo', data.sexo);
      formData.append('status', data.status);
      formData.append('descricao', data.descricao);
      
      if (data.foto && data.foto.length > 0) {
        formData.append('foto', data.foto[0]);
      }

      if (isEdit && id) {
        await updatePet(id, formData);
        toast.success('Pet atualizado com sucesso!');
        navigate(`/pets/${id}`);
      } else {
        await addPet(formData);
        toast.success('Pet cadastrado com sucesso!');
        navigate('/pets');
      }
    } catch (error) {
      console.error(`Erro ao ${isEdit ? 'atualizar' : 'cadastrar'} pet:`, error);
      const apiErrorMessage = error.response?.data?.message;
      if (apiErrorMessage) {
        toast.error(apiErrorMessage);
      } else {
        toast.error(
          `Falha ao enviar. Verifique os dados ou se a imagem está em formato JPG ou PNG.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4 pt-17">
      <div className="absolute top-2 left-6">
        <ReturnButton />
      </div>

      <div className="max-w-2xl mx-auto justify-center items-center h-full">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div
            className="px-6 py-4 text-center"
            style={{
              backgroundColor: especieValue === 'CAO'
                ? 'var(--color-verde-escuro)'
                : especieValue === 'GATO'
                  ? 'var(--color-azul-escuro)'
                  : 'var(--color-laranja)'
            }}
          >
            <h1 className="text-2xl font-bold text-white">
              {isEdit ? 'Editar Pet' : 'Cadastrar Novo Pet'}
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto do Pet
                  {!isEdit && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                <div className="mb-4 flex justify-center">
                  <label
                    htmlFor="foto-upload"
                    className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden cursor-pointer bg-gray-100 border-4 border-dashed border-gray-300"
                    style={{
                      borderColor: previewImage
                        ? (especieValue === 'CAO' ? 'var(--color-verde-claro)' : especieValue === 'GATO' ? 'var(--color-azul-marinho)' : 'var(--color-laranja)')
                        : 'var(--color-cinza-claro)',
                      borderStyle: previewImage ? 'solid' : 'dashed',
                    }}
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview do Pet"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-16 h-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                      </svg>
                    )}
                  </label>
                </div>
                
                <input
                  id="foto-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  {...register('foto')}
                />
                
                {errors.foto && (
                  <p className="mt-1 text-sm text-red-600">{errors.foto.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Formatos aceitos: JPG e PNG. Tamanho máximo: 5MB
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
              <input type="text" {...register('nome')} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Digite o nome do pet" />
              {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento *</label>
                <input type="date" {...register('dataNascimento')} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                {errors.dataNascimento && <p className="mt-1 text-sm text-red-600">{errors.dataNascimento.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Espécie *</label>
                <select {...register('especie')} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Selecione a espécie</option>
                  <option value="CAO">Cachorro</option>
                  <option value="GATO">Gato</option>
                </select>
                {errors.especie && <p className="mt-1 text-sm text-red-600">{errors.especie.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexo *</label>
                <select {...register('sexo')} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Selecione o sexo</option>
                  <option value="MACHO">♂ Macho</option>
                  <option value="FEMEA">♀ Fêmea</option>
                </select>
                {errors.sexo && <p className="mt-1 text-sm text-red-600">{errors.sexo.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <select {...register('status')} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Selecione o status</option>
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="EM_ANALISE">Em Análise</option>
                  <option value="ADOTADO">Adotado</option>
                </select>
                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
              <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical" placeholder="Descreva o pet, incluindo características, personalidade, necessidades especiais, etc." {...register('descricao')} />
              {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>}
            </div>

            <div className="flex justify-end pt-4">
              <SubmitButton text={isEdit ? 'Atualizar Pet' : 'Cadastrar Pet'} loading={submitting} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
