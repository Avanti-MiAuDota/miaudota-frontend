export const InputField = ({
  label,
  type,
  id,
  name,
  placeholder,
  value,
  error,
  register,
  required = false,
  validation = {},
}) => {
  const validations = { ...validation };
  if (required) validations.required = typeof required === "string" ? required : "Campo obrigatório";

  return (
    <div className="flex flex-col gap-1 mb-4 p-4">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        className="border border-gray-300 rounded-md p-2"
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        {...(register && name ? register(name, validations) : {})}
      />
      {error && <small className="text-red-500">{error}</small>}
    </div>
  );
};
