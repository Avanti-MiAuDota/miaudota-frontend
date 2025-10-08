export const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  hidden = false,
  register,
  validation,
  placeholder,
}) => {
  // Se register está disponível, usar React Hook Form
  // Senão, usar props tradicionais
  const inputProps = register
    ? register(name, validation)
    : {
      value,
      onChange,
      onBlur,
      name
    };

  return (
    <div className={`flex flex-col mb-4 ${hidden ? "hidden" : ""}`}>

      {label && (
        <label
          htmlFor={name}
          className="text-gray-700 mb-1 font-medium select-none"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...inputProps}
        className={`border rounded-md px-3 py-2 focus:outline-none focus:ring transition
          ${error
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};
