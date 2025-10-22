import React from 'react'
import { FaPaw, FaHandsHelping, FaShieldAlt } from 'react-icons/fa'

export const Mission = () => {
  return (
    <section className="bg-white rounded-lg shadow p-6 mb-10" style={{ border: `1px solid ${'var(--color-verde-claro)'}` }}>
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-dark)' }}>Nossa missão</h2>
      <p className="mb-6" style={{ color: 'var(--color-cinza-claro)' }}>
        Promover adoções responsáveis e duradouras, priorizando o bem-estar animal, a transparência e o apoio contínuo às famílias adotantes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg card-hover" style={{ backgroundColor: 'rgba(74, 144, 226, 0.05)' }}>
          <div className="flex items-center gap-3 mb-3">
            <FaPaw size={24} style={{ color: 'var(--color-azul)' }} />
            <h3 className="font-semibold">Bem-estar animal</h3>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-cinza-claro)' }}>Avaliação clínica e comportamental, vacinação e cuidados contínuos antes de cada adoção.</p>
        </div>
        <div className="p-4 rounded-lg card-hover" style={{ backgroundColor: 'rgba(72,127,85,0.05)' }}>
          <div className="flex items-center gap-3 mb-3">
            <FaShieldAlt size={24} style={{ color: 'var(--color-verde-escuro)' }} />
            <h3 className="font-semibold">Processo seguro</h3>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-cinza-claro)' }}>Verificações, análise de compatibilidade e acompanhamento para que a adoção seja responsável e tranquila.</p>
        </div>
        <div className="p-4 rounded-lg card-hover" style={{ backgroundColor: 'rgba(220,130,77,0.04)' }}>
          <div className="flex items-center gap-3 mb-3">
            <FaHandsHelping size={24} style={{ color: 'var(--color-laranja)' }} />
            <h3 className="font-semibold">Comunidade</h3>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-cinza-claro)' }}>Voluntários, parceiros e adotantes unidos para oferecer suporte prático e afetivo aos pets.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4">
          <div className="text-3xl font-bold" style={{ color: 'var(--color-azul)' }}>+500</div>
          <div className="text-sm" style={{ color: 'var(--color-cinza-claro)' }}>pets acolhidos</div>
        </div>
        <div className="p-4">
          <div className="text-3xl font-bold" style={{ color: 'var(--color-verde-escuro)' }}>+320</div>
          <div className="text-sm" style={{ color: 'var(--color-cinza-claro)' }}>adoções realizadas</div>
        </div>
        <div className="p-4">
          <div className="text-3xl font-bold" style={{ color: 'var(--color-laranja)' }}>+120</div>
          <div className="text-sm" style={{ color: 'var(--color-cinza-claro)' }}>voluntários ativos</div>
        </div>
      </div>
    </section>
  )
}

export default Mission
