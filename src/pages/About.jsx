import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaHandsHelping, FaShieldAlt, FaUsers, FaEnvelope } from 'react-icons/fa';
import miaulogo from '../assets/img/miaulogo2.png';
import { Contact } from '../components/Contact';
import { ReturnButton } from '../components/ReturnButton';
import { Mission } from '../components/Mission';

export const About = () => {
  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4 py-12">
      <div className="absolute top-6 left-6">
        <ReturnButton />
      </div>

      <main className="container mx-auto px-6 max-w-6xl">
        <section className="mb-10 fade-in text-center">
          <div className="mb-4">
            <img src={miaulogo} alt="Logo MiAuDota" className="mx-auto" style={{ maxWidth: '320px', width: '60%', height: 'auto' }} />
          </div>
          
          <h1 className="sr-only">Sobre a MiAuDota</h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-4" style={{ color: 'var(--color-cinza-claro)' }}>
            Bem-vindo à MiAuDota — um abrigo que transforma vidas. Cuidamos, reabilitamos e conectamos pets a famílias por meio de um processo claro, humano e seguro.
          </p>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: 'var(--color-cinza-claro)' }}>
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

        <Mission />

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
