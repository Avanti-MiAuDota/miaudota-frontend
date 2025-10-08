
export const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  hidden = false,
}) => {
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
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded-md px-3 py-2 focus:outline-none focus:ring transition
          ${
            error
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
