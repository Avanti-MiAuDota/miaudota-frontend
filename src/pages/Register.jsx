import { useForm } from "react-hook-form"
import { InputField } from "../components/InputField"

export const Register = () => {
  const { register, formState: { errors }, handleSubmit } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <div>
        <h1 className="text-center">Cadastro</h1>
        <form className="px-4 sm:min-w-[500px] m-auto flex flex-col justify-center items-center shadow" onSubmit={handleSubmit(onSubmit)}>
          <InputField label="Nome:" placeholder="Digite seu nome" type="text" id="nomeCompleto" name="nomeCompleto" register={register} error={errors.nome?.message} required />
          <InputField label="E-mail:" placeholder="Digite seu e-mail" type="email" id="email" name="email" register={register} error={errors.email?.message} required />
          <InputField type="hidden" value="USUARIO" register={register} name="role" />
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  )
}
