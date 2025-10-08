export const SubmitButton = ({ text }) => {
  return (
    <button
      type="submit"
      style={{
        backgroundColor: "var(--color-azul)",
      }}
      className="w-full text-white font-semibold py-2 px-4 rounded-md 
                 hover:opacity-90 active:opacity-80 focus:outline-none 
                 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
    >
      {text}
    </button>
  );
};
