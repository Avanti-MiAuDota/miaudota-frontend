import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { CustomLoader } from '../components/CustomLoader';
import { SubmitButton } from '../components/SubmitButton';
import { ReturnButton } from '../components/ReturnButton';
import { InputField } from '../components/InputField';
import { postAdoption, updateAdoption, getAdoptionById, fetchPetById } from '../api/adocao';
import { useAuth } from '../contexts/AuthContext';

const addressSchema = z.object({
  cep: z.string().regex(/^\d{8}$/, 'O CEP deve conter 8 dígitos numéricos.'),
  logradouro: z.string().min(1, 'O logradouro é obrigatório.'),
  numero: z.string().min(1, 'O número é obrigatório.'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'O bairro é obrigatório.'),
  cidade: z.string().min(1, 'A cidade é obrigatória.'),
  estado: z.string().length(2, 'O estado deve ter 2 caracteres.').transform(val => val.toUpperCase()),
  telefone: z.string().min(1, 'O telefone é obrigatório.'),
});

const adoptionSchema = z.object({
  dataAdocao: z.string().min(1, 'A data da adoção é obrigatória.'),
  motivo: z.string().min(1, 'O motivo é obrigatório.'),
  aceitouTermo: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos para prosseguir.',
  }),
  endereco: addressSchema,
});

export const AdoptionForm = () => {
  const { petId, adoptionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(adoptionId);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [petName, setPetName] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [petEspecie, setPetEspecie] = useState(null);

  const usuarioId = user?.dadosCompletos?.id || user?.id;

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(adoptionSchema),
  });

  const location = useLocation();
  const locationPet = location.state?.pet;

  const aceitouTermo = watch('aceitouTermo') || false;
  const cep = watch('endereco.cep');

  useEffect(() => {
    const fetchAddress = async () => {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) return;

      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setValue('endereco.logradouro', data.logradouro || '');
          setValue('endereco.bairro', data.bairro || '');
          setValue('endereco.cidade', data.localidade || '');
          setValue('endereco.estado', data.uf || '');
        } else {
          toast.error('CEP não encontrado.');
        }
      } catch {
        toast.error('Erro ao buscar CEP.');
      }
    };

    if (cep) fetchAddress();
  }, [cep, setValue]);

  useEffect(() => {
    if (isEdit) {
      const fetchAdoption = async () => {
        try {
          const adocao = await getAdoptionById(adoptionId);
          if (adocao.petId) {
            const pet = await fetchPetById(adocao.petId);
            setPetName(pet.nome);
              if (pet.foto) setPreviewImage(pet.foto);
              if (pet.especie) setPetEspecie(pet.especie);
          }
          reset({
            dataAdocao: adocao.dataAdocao.split('T')[0],
            motivo: adocao.motivo,
            aceitouTermo: adocao.aceitouTermo,
            endereco: adocao.endereco,
          });
        } catch (error) {
          toast.error('Erro ao carregar dados da adoção.', error);
          navigate('/congratulations');
        } finally {
          setLoading(false);
        }
      };
      fetchAdoption();
    } else {
      const today = new Date().toISOString().split('T')[0];
      reset({
        dataAdocao: today,
        motivo: '',
        aceitouTermo: false,
        endereco: {
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          telefone: '',
        },
      });
      setLoading(false);
    }
  }, [adoptionId, isEdit, reset, navigate]);

  // Se não for edição (nova solicitação), buscar o pet pelo petId (quando fornecido na rota)
  useEffect(() => {
    const fetchPet = async () => {
      if (!petId) return;
      try {
        // Se o pet veio no location.state (navegação do Match), usa-o sem fazer fetch
        if (locationPet) {
          setPetName(locationPet.nome || '');
          const fotoFromState = locationPet.foto || locationPet.fotos?.[0];
          if (fotoFromState) setPreviewImage(fotoFromState);
          if (locationPet.especie) setPetEspecie(locationPet.especie);
          return;
        }

        const pet = await fetchPetById(petId);
        if (pet) {
          setPetName(pet.nome || '');
          if (pet.foto) setPreviewImage(pet.foto);
          if (pet.fotos && pet.fotos.length > 0 && !pet.foto) setPreviewImage(pet.fotos[0]);
          if (pet.especie) setPetEspecie(pet.especie);
        }
      } catch (error) {
        // Silenciar erro; não é crítico
        console.error('Erro ao buscar pet para preview:', error);
      }
    };

    fetchPet();
  }, [petId]);

  const onSubmit = async (data) => {
    if (!usuarioId) {
      toast.error('Usuário não autenticado.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...data,
        petId: isEdit ? Number(data.petId) : Number(petId),
        usuarioId,
        aceitouTermo: Boolean(data.aceitouTermo),
        dataAdocao: `${data.dataAdocao}T00:00:00.000Z`,
      };

      if (isEdit) {
        await updateAdoption(Number(petId), payload);
        toast.success('Adoção atualizada com sucesso!');
        navigate('/');
      } else {
        await postAdoption(payload);
        toast.success('Solicitação de adoção enviada com sucesso!');
        navigate('/congratulations', {state: { petId }});
      }
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const apiMessage = error.response?.data?.error;

      if (Array.isArray(apiErrors)) {
        apiErrors.forEach(errMsg => toast.error(errMsg));
      } else if (apiMessage) {
        toast.error(apiMessage);
      } else {
        toast.error('Erro ao processar a solicitação.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CustomLoader />;

  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4 pt-17">
      <div className="absolute top-2 left-6">
        <ReturnButton />
      </div>

      <div className="max-w-2xl mx-auto justify-center items-center h-full">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 text-center" style={{ backgroundColor: 'var(--color-azul)' }}>
            <h1 className="text-2xl font-bold text-white">
              {isEdit ? 'Editar Adoção' : 'Nova Solicitação de Adoção'}
            </h1>
           
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4"
                  style={{
                    borderColor: previewImage
                      ? (petEspecie === 'CAO'
                          ? 'var(--color-verde-claro)'
                          : petEspecie === 'GATO'
                            ? 'var(--color-azul-marinho)'
                            : 'var(--color-azul-marinho)')
                      : 'var(--color-cinza-claro)'
                  }}
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Preview do Pet" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-16 h-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                  )}
                </div>
              </div>
               {petName && <h1 className="text-gray-800 mt-2 text-sm">Pet: {petName}</h1>}
            </div>

            <InputField
              label="Data *"
              type="date"
              name="dataAdocao"
              register={register}
              error={errors.dataAdocao?.message}
            />

            <InputField
              label="Motivo *"
              type="text"
              name="motivo"
              placeholder="Por que deseja adotar este pet?"
              register={register}
              error={errors.motivo?.message}
            />

            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Endereço</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="CEP *"
                  name="endereco.cep"
                  register={register}
                  error={errors.endereco?.cep?.message}
                />
                <InputField label="Logradouro *" name="endereco.logradouro" register={register} error={errors.endereco?.logradouro?.message} />
                <InputField label="Número *" name="endereco.numero" register={register} error={errors.endereco?.numero?.message} />
                <InputField label="Complemento" name="endereco.complemento" register={register} />
                <InputField label="Bairro *" name="endereco.bairro" register={register} error={errors.endereco?.bairro?.message} />
                <InputField label="Cidade *" name="endereco.cidade" register={register} error={errors.endereco?.cidade?.message} />
                <InputField label="Estado *" name="endereco.estado" register={register} error={errors.endereco?.estado?.message} />
                <InputField label="Telefone *" name="endereco.telefone" register={register} error={errors.endereco?.telefone?.message} />
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={aceitouTermo}
                onChange={(e) => setValue('aceitouTermo', e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded accent-azul cursor-pointer"
              />
              <label className="ml-2 text-sm text-gray-700">Aceito assinar um contrato de adoção.</label>
            </div>
            {errors.aceitouTermo && <p className="text-sm text-red-600">{errors.aceitouTermo.message}</p>}

            <div className="flex justify-end pt-4">
              <SubmitButton text={isEdit ? 'Atualizar Adoção' : 'Enviar Solicitação'} loading={submitting} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
