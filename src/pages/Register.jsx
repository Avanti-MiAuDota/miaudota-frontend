import { useState } from "react";
import { InputField } from "../components/InputField";
import { SubmitButton } from "../components/SubmitButton";
import { z } from "zod";
import { createUsuario } from "../api/usuario.js";
import { loginUser } from "../api/auth.js";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { ReturnButton } from "../components/ReturnButton";
import { Link } from "react-router-dom";



const registerSchema = z.object({
  nomeCompleto: z
    .string()
    .min(1, "O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Formato de e-mail inválido"),
  senha: z
    .string()
    .min(1, "A senha é obrigatória")
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export function Register() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    senha: "",
    role: "USUARIO",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const singleFieldSchema = z.object({
      [name]: registerSchema.shape[name],
    });

    const result = singleFieldSchema.safeParse({ [name]: value });

    if (!result.success) {
      const msg = result.error?.issues?.[0]?.message || "Campo inválido";
      setErrors((prev) => ({ ...prev, [name]: msg }));
    } else {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const errorList = result.error?.issues || [];
      const errorObj = {};
      errorList.forEach((issue) => {
        const field = issue.path[0];
        if (field) errorObj[field] = issue.message;
      });
      setErrors(errorObj);
      return;
    }

    try {

      await createUsuario(result.data);

      toast.success("Cadastro realizado com sucesso!");

      try {
        const loginData = {
          email: result.data.email,
          senha: result.data.senha,
        };

        const user = await loginUser(loginData);
        login(user);
      } catch (loginError) {
        console.error("Erro no login automático:", loginError);
        toast.error("Cadastro realizado! Faça login para continuar.");
      }

      setFormData({
        nomeCompleto: "",
        email: "",
        senha: "",
        role: "USUARIO",
      });
      setErrors({});
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      const errors = error.response?.data?.errors;
      let msg = "";

      if (Array.isArray(errors)) {
        msg = errors.join("\n");
      } else if (typeof errors === "string") {
        msg = errors;
      } else if (error.response?.data?.error) {
        msg = error.response?.data?.error;
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      }

      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    }

  };


  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="absolute top-6 left-6"> 
      <ReturnButton />
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md">
        <form
          noValidate
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Cadastro de Usuário
          </h1>
          <InputField
            label="Nome Completo"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.nomeCompleto}
          />
          <InputField
            label="E-mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
          />
          <InputField
            label="Senha"
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.senha}
          />
          <input type="hidden" name="role" value={formData.role} />
          <SubmitButton text="Cadastrar" />
        </form>
        <Link to="/login">
          <p className="mt-4 text-center text-cinza text-xs">
            Já possui uma conta? Faça login!
          </p>
        </Link>
      </div>

    </div>
  );
}
