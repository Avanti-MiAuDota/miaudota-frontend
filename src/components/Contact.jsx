export const Contact = () => {
  return (
    <section id="contato" className="bg-white rounded-lg shadow p-6 fade-in">
          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-dark)' }}>Fale conosco</h3>
          <p className="mb-4" style={{ color: 'var(--color-cinza-claro)' }}>Tem alguma dúvida, quer adotar ou ajudar? Envie uma mensagem e responderemos em até 48h.</p>

          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input aria-label="Nome" placeholder="Seu nome completo" className="px-3 py-2 border rounded" style={{ borderColor: 'var(--color-verde-claro)' }} />
            <input aria-label="Email" placeholder="seu@exemplo.com" className="px-3 py-2 border rounded" style={{ borderColor: 'var(--color-verde-claro)' }} />
            <textarea aria-label="Mensagem" placeholder="Conte como podemos ajudar (ex.: quero adotar, tenho dúvidas sobre um pet...)" className="sm:col-span-2 px-3 py-2 border rounded h-32" style={{ borderColor: 'var(--color-verde-claro)' }}></textarea>
            <button
              type="submit"
              className="sm:col-span-2 inline-block px-4 py-2 rounded transform transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: 'var(--color-verde-escuro)', color: 'white' }}
              aria-label="Enviar mensagem"
            >
              Enviar
            </button>
          </form>
        </section>
  )
}
