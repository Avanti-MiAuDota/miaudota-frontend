import React, { useEffect, useState, useRef } from "react"
import { FaSearch } from "react-icons/fa"

const normalize = (v) => {
  if (v === undefined || v === null) return ""
  return String(v)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
}

// checagem tolerante para campos como sexo/especie/status
const matchesField = (itemValue, filterValue) => {
  if (!filterValue) return true
  if (itemValue === undefined || itemValue === null) return false

  const a = normalize(itemValue)
  const b = normalize(filterValue)

  if (b.length === 1) {
    return a.startsWith(b)
  }

  if (a === b) return true

  return a.includes(b) || b.includes(a)
}

const textMatches = (haystack, needle) => {
  if (!needle) return true
  if (!haystack) return false
  return normalize(haystack).includes(normalize(needle))
}

export const Filter = ({ initial = {}, items, onFiltered, onChange }) => {
  const [q, setQ] = useState(initial.q || "")
  const [status, setStatus] = useState(initial.status || "")
  const [species, setSpecies] = useState(initial.species || "")
  const [sex, setSex] = useState(initial.sex || "")
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const mobileInputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => {
      const filters = {
        q: q?.trim() || undefined,
        status: status || undefined,
        species: species || undefined,
        sex: sex || undefined,
      }

      const hasAnyFilter = Boolean(
        (filters.q && String(filters.q).length > 0) ||
          filters.status ||
          filters.species ||
          filters.sex
      )

      // If parent provided items + onFiltered, apply local filtering in real-time
      if (Array.isArray(items) && typeof onFiltered === "function") {
        setLoading(true)
        try {
          const filtered = filterItems(items, filters)
          onFiltered(filtered)
        } finally {
          setLoading(false)
        }
        return
      }

      // Otherwise, emit the filters to the parent so it can fetch/filter
      if (hasAnyFilter && typeof onChange === "function") {
        onChange(filters)
      }
    }, 300)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, species, sex, items, onFiltered, onChange])

  const buildFilters = () => ({
    q: q?.trim() || undefined,
    status: status || undefined,
    species: species || undefined,
    sex: sex || undefined,
  })

  const read = (obj, ...keys) => {
    for (const k of keys) {
      if (!k) continue
      const v = obj?.[k]
      if (v !== undefined && v !== null) return v
    }
    return undefined
  }

  const filterItems = (list, filters) => {
    if (!Array.isArray(list)) return []
    const { q: fq, status: fs, species: fsp, sex: fsex } = filters
    return list.filter((item) => {
      const pet = item.pet ?? item
      const nome = read(pet, "nome", "name", "title") || ""
      const descricao = read(pet, "descricao", "description", "bio", "about") || ""
      const especie = read(pet, "especie", "species", "type")
      const sexo = read(pet, "sexo", "sex", "gender")
      const stat = read(item, "status", "situacao", "disponibilidade") ?? read(pet, "status")

      const textToCheck = `${nome} ${descricao}`

      if (!textMatches(textToCheck, fq)) return false
      if (fs && !matchesField(stat, fs)) return false
      if (fsp && !matchesField(especie, fsp)) return false
      if (fsex && !matchesField(sexo, fsex)) return false

      return true
    })
  }

  // Remote fetch/apply/clear removed: filter now works in real-time

  return (
    <form className="w-full mb-3 px-4" onSubmit={(e) => e.preventDefault()}>
      <div className="hidden md:flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
        <div className="relative flex items-center w-full">
          <input
            ref={inputRef}
            aria-label="Pesquisar descrição do pet"
            placeholder="Pesquise a característica do pet!"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full px-3 py-2 pr-10 rounded border placeholder:text-[var(--color-cinza-claro)]"
          />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-cinza-claro)] p-2 rounded"
          >
            <FaSearch />
          </span>
        </div>

        <select
          aria-label="Filtrar por status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-44 px-3 py-2 rounded border"
        >
          <option value="">Status</option>
          <option value="DISPONIVEL">Disponível</option>
          <option value="EM_ANALISE">Em análise</option>
          <option value="ADOTADO">Adotado</option>
        </select>

        <select
          aria-label="Filtrar por espécie"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-40 px-3 py-2 rounded border"
        >
          <option value="">Espécie</option>
          <option value="CAO">Cachorro</option>
          <option value="GATO">Gato</option>
        </select>

        <select
          aria-label="Filtrar por sexo"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          className="w-36 px-3 py-2 rounded border"
        >
          <option value="">Sexo</option>
          <option value="M">Macho</option>
          <option value="F">Fêmea</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          {/* Buttons removed: filter applies in real-time */}
        </div>
      </div>

      <div className="md:hidden bg-white p-3 rounded-lg shadow-sm space-y-3">
        <div className="relative w-full">
          <input
            ref={mobileInputRef}
            aria-label="Pesquisar descrição do pet"
            placeholder="Pesquisar por descrição"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full px-3 py-2 pr-10 rounded border"
          />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-cinza-claro)] p-2 rounded"
          >
            <FaSearch />
          </span>
        </div>

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
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </select>
        </div>

        <select
          aria-label="Filtrar por status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 rounded border"
        >
          <option value="">Status</option>
          <option value="DISPONIVEL">Disponível</option>
          <option value="EM_ANALISE">Em análise</option>
          <option value="ADOTADO">Adotado</option>
        </select>

        <div className="flex gap-2">
          {/* Buttons removed: filter applies in real-time */}
        </div>
      </div>
    </form>
  )
}

export default Filter
