import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaHandsHelping, FaShieldAlt, FaUsers, FaEnvelope } from 'react-icons/fa';
import miaulogo from '../assets/img/miaulogo2.png';
import { Contact } from '../components/Contact';

export const About = () => {
  return (
    // src/pages/About.jsx
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-light)', color: 'var(--color-dark)' }}>
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        
        <section className="mb-10 fade-in">
          <div className="mb-4">
            <img src={miaulogo} alt="Logo MiAuDota" className="mx-auto" style={{ maxWidth: '320px', width: '60%', height: 'auto' }} />
          </div>
          <h1 className="sr-only">Sobre a MiAuDota</h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-3xl mx-auto text-center mb-4" style={{ color: 'var(--color-cinza-claro)' }}>
            Bem-vindo à MiAuDota — um abrigo que transforma vidas. Cuidamos, reabilitamos e conectamos pets a famílias por meio de um processo claro, humano e seguro.
          </p>
          <p className="text-sm sm:text-base max-w-2xl mx-auto text-center" style={{ color: 'var(--color-cinza-claro)' }}>
            Navegue pelo nosso catálogo, envie sua proposta e acompanhe cada etapa da adoção. Oferecemos suporte pré e pós-adoção para garantir uma transição tranquila.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link
              to="/pets"
              className="inline-block px-5 py-3 rounded-lg shadow transform transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: 'var(--color-azul)', color: 'white' }}
              aria-label="Ver pets para adoção"
            >
              Ver pets para adoção
            </Link>
            <a
              href="mailto:contato@miaudota.org"
              className="inline-flex items-center px-5 py-3 border rounded-lg transform transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ borderColor: 'var(--color-verde-escuro)', color: 'var(--color-dark)' }}
              aria-label="Entrar em contato"
            >
              <FaEnvelope className="inline mr-2" />Entrar em contato
            </a>
          </div>
        </section>

        {/* Missão / Valores / Cards */}
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
        <Contact/>
      </main>


    </div>
  );
}



