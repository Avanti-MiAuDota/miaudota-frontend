import { InputField } from "../components/InputField";
import { SubmitButton } from "../components/SubmitButton";

export function Login() {

  const handleSubmit = async () => {
    console.log("submit")

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h1>

        <InputField
          label="E-mail"
          type="email"
          name="email"
        />

        <InputField
          label="Senha"
          type="password"
          name="senha"
        />
        <SubmitButton text="Login" />
      </form>
    </div>
  );
}
