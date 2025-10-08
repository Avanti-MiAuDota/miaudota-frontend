
export const SelectField = ({ label, name, options, value, onChange, error }) => {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label
          htmlFor={name}
          className="text-gray-700 mb-1 font-medium select-none"
        >
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded-md px-3 py-2 focus:outline-none focus:ring transition
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
      >
        <option value="">Selecione uma opção</option>
        {options?.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};
