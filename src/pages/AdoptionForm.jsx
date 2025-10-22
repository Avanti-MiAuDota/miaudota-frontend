import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  const usuarioId = user?.dadosCompletos?.id || user?.id;

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(adoptionSchema),
  });

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

  const onSubmit = async (data) => {
    if (!usuarioId) {
      toast.error('Usuário não autenticado.');
      return;
    }

    console.log('Iniciando submissão do formulário...');
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
        navigate('/congratulations');
      }
    } catch (error) {
      console.error('Erro capturado no onSubmit:', error);

      const apiErrors = error.response?.data?.errors;
      const apiMessage = error.response?.data?.message || error.response?.data?.error;

      if (Array.isArray(apiErrors)) {
        apiErrors.forEach(errMsg => {
          toast.error(errMsg);
        });
      } else if (apiMessage) {
        toast.error(apiMessage);
      } else {
        toast.error('Erro inesperado ao processar a solicitação.');
        console.log('Toast de erro exibido para erro inesperado.');
      }
    } finally {
      console.log('Finalizando submissão do formulário...');
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
            {petName && <p className="text-white mt-2 text-sm">Pet: {petName}</p>}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
