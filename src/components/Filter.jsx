import React from 'react'
// ...existing code...
import React, { useEffect, useState } from 'react'

export const Filtro = ({ initial = {}, onApply, onChange }) => {
  const [q, setQ] = useState(initial.q || '')
  const [status, setStatus] = useState(initial.status || '')
  const [species, setSpecies] = useState(initial.species || '')
  const [sex, setSex] = useState(initial.sex || '')

  // debounce onChange for live filtering
  useEffect(() => {
    if (typeof onChange !== 'function') return
    const t = setTimeout(() => {
      onChange({
        q: q?.trim() || undefined,
        status: status || undefined,
        species: species || undefined,
        sex: sex || undefined,
      })
    }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, species, sex])

  const apply = () => {
    onApply &&
      onApply({
        q: q?.trim() || undefined,
        status: status || undefined,
        species: species || undefined,
        sex: sex || undefined,
      })
  }

  const clear = () => {
    setQ('')
    setStatus('')
    setSpecies('')
    setSex('')
    onApply && onApply({})
    onChange && onChange({})
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        apply()
      }}
      className="w-full"
    >
      {/* Desktop / Tablet */}
      <div className="hidden md:flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
        <input
          aria-label="Pesquisar descrição do pet"
          placeholder="Pesquisar por descrição"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 px-3 py-2 rounded border placeholder:[var(--color-cinza-claro)]"
        />

        <select
          aria-label="Filtrar por status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-48 px-3 py-2 rounded border"
        >
          <option value="">Status</option>
          <option value="available">Disponível</option>
          <option value="adopted">Adotado</option>
          <option value="pending">Pendente</option>
        </select>

        <select
          aria-label="Filtrar por espécie"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-44 px-3 py-2 rounded border"
        >
          <option value="">Espécie</option>
          <option value="CAO">Cachorro</option>
          <option value="GATO">Gato</option>
        </select>

        <select
          aria-label="Filtrar por sexo"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          className="w-40 px-3 py-2 rounded border"
        >
          <option value="">Sexo</option>
          <option value="male">Macho</option>
          <option value="female">Fêmea</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={clear} className="px-3 py-1 rounded border text-sm">
            Limpar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded text-white text-sm"
            style={{ backgroundColor: 'var(--color-verde-escuro)' }}
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden bg-white p-3 rounded-lg shadow-sm space-y-3">
        <input
          aria-label="Pesquisar descrição do pet"
          placeholder="Pesquisar por descrição"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full px-3 py-2 rounded border"
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            aria-label="Filtrar por espécie"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full px-3 py-2 rounded border"
          >
            <option value="">Espécie</option>
            <option value="CAO">Cachorro</option>
            <option value="GATO">Gato</option>
          </select>

          <select
            aria-label="Filtrar por sexo"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className="w-full px-3 py-2 rounded border"
          >
            <option value="">Sexo</option>
            <option value="male">Macho</option>
            <option value="female">Fêmea</option>
          </select>
        </div>

        <select
          aria-label="Filtrar por status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 rounded border"
        >
          <option value="">Status</option>
          <option value="available">Disponível</option>
          <option value="adopted">Adotado</option>
          <option value="pending">Pendente</option>
        </select>

        <div className="flex gap-2">
          <button type="button" onClick={clear} className="flex-1 px-3 py-2 rounded border">
            Limpar
          </button>
          <button
            type="button"
            onClick={apply}
            className="flex-1 px-3 py-2 rounded text-white"
            style={{ backgroundColor: 'var(--color-verde-escuro)' }}
          >
            Aplicar
          </button>
        </div>
      </div>
    </form>
  )
}

export default Filtro
