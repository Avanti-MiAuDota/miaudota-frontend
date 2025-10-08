import { InputField } from "../components/InputField";
import { SubmitButton } from "../components/SubmitButton";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { loginUser } from "../api/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Formato de e-mail inválido"),
  senha: z
    .string()
    .min(1, "A senha é obrigatória")
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export function Login() {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const user = await loginUser(data);
      login(user);
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Email ou senha inválidos");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-gray-100 px-4">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h1>

        <InputField
          label="E-mail"
          type="email"
          name="email"
          register={register}
          error={errors.email?.message}
          placeholder="Digite seu e-mail"
        />

        <InputField
          label="Senha"
          type="password"
          name="senha"
          register={register}
          error={errors.senha?.message}
          placeholder="Digite sua senha"
        />

        <SubmitButton
          text="Entrar"
        />
      </form>
    </div>
  );
}
