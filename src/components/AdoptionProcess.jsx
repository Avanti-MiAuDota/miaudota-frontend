import React from 'react'
import { FaHandsHelping, FaShieldAlt, FaUsers } from 'react-icons/fa'

export const AdoptionProcess = () => {
  return (
    <section className="mb-10 fade-in">
      <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-dark)' }}>Como funciona o sistema de adoções</h2>
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-azul)', color: 'white' }}><FaUsers /></div>
          <div>
            <h4 className="font-semibold">Encontre o pet ideal</h4>
            <p style={{ color: 'var(--color-cinza-claro)' }}>Explore fichas completas com fotos, histórico e necessidades. Use filtros por porte, idade e cidade para agilizar a busca.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-verde-escuro)', color: 'white' }}><FaShieldAlt /></div>
          <div>
            <h4 className="font-semibold">Envie sua proposta</h4>
            <p style={{ color: 'var(--color-cinza-claro)' }}>Preencha um formulário simples. Avaliamos perfil e compatibilidade para preservar o bem-estar do pet.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-laranja)', color: 'white' }}><FaHandsHelping /></div>
          <div>
            <h4 className="font-semibold">Acompanhe e finalize</h4>
            <p style={{ color: 'var(--color-cinza-claro)' }}>Agendamos encontro ou visita, oferecemos orientações e mantemos suporte pós-adoção para garantir a adaptação.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
