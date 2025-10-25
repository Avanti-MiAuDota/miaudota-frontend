export const SubmitButton = ({ text }) => {
  return (
    <button
      type="submit"
      className="w-full bg-azul text-white font-semibold py-2 px-4 rounded-md \
                 active:opacity-80 focus:outline-none \
                 focus:ring-2 focus:ring-azul hover:bg-laranja  duration-200 cursor-pointer transition-transform hover:scale-105"
    >
      {text}
    </button>
  );
};
