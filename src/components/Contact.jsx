import { useState } from 'react'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'

export const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Vite env vars (set in .env as VITE_EMAILJS_...)
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  const validate = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Preencha todos os campos antes de enviar.')
      return false
    }
    // basic email check (simple, lint-friendly)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(email)) {
      toast.error('Por favor informe um email válido.')
      return false
    }
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      toast.error('Configuração do EmailJS ausente. Verifique variáveis de ambiente.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      // initialize with public key (optional but recommended)
      emailjs.init(PUBLIC_KEY)

      const templateParams = {
        from_name: name,
        from_email: email,
        message
      }

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
      toast.success('Mensagem enviada! Respondemos em até 48h.')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      console.error('EmailJS error:', err)
      toast.error('Erro ao enviar a mensagem. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contato" className="bg-white rounded-lg shadow p-6 fade-in">
      <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-dark)' }}>Fale conosco</h3>
      <p className="mb-4" style={{ color: 'var(--color-cinza-claro)' }}>Tem alguma dúvida, quer adotar ou ajudar? Envie uma mensagem e responderemos em até 48h.</p>

      <form method="post" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          aria-label="Nome"
          placeholder="Seu nome completo"
          className="px-3 py-2 border rounded"
          style={{ borderColor: 'var(--color-verde-claro)' }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          aria-label="Email"
          placeholder="seu@exemplo.com"
          className="px-3 py-2 border rounded"
          style={{ borderColor: 'var(--color-verde-claro)' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          aria-label="Mensagem"
          placeholder="Conte como podemos ajudar (ex.: quero adotar, tenho dúvidas sobre um pet...)"
          className="sm:col-span-2 px-3 py-2 border rounded h-32"
          style={{ borderColor: 'var(--color-verde-claro)' }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button
          type="submit"
          className="sm:col-span-2 inline-block px-4 py-2 rounded transform transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: 'var(--color-verde-escuro)', color: 'white' }}
          aria-label="Enviar mensagem"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </section>
  )
}

