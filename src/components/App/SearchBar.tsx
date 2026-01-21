import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ProductCategory } from '../../types/ProductCategory'

interface SearchBarProps {
  onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const sectionLabels: Record<ProductCategory, string> = {
    [ProductCategory.CUIDADO_PERSONAL_HIGIENE]: 'Cuidado Personal e Higiene',
    [ProductCategory.OTROS]: 'Otros Productos',
    [ProductCategory.VITAMINAS_SUPLEMENTOS_NUTRICIONALES]: 'Vitaminas y Suplementos',
    [ProductCategory.RESPIRATORIOS_EXPECTORANTES]: 'Medicamentos Respiratorios',
    [ProductCategory.ANTIBIOTICOS_ANTIVIRALES]: 'Antibióticos y Antivirales',
    [ProductCategory.DERMATOLOGICOS_TRATAMIENTOS_CUTANEOS]: 'Tratamientos Dermatológicos',
    [ProductCategory.ANALGESICOS_ANTINFLAMATORIOS]: 'Analgésicos y Antiinflamatorios',
    [ProductCategory.MATERIAL_MEDICO_EQUIPOS]: 'Material Médico y Equipos',
    [ProductCategory.MEDICINA_NATURAL_HIDRATACION]: 'Medicina Natural e Hidratación',
    [ProductCategory.PEDIATRICOS_LACTANCIA]: 'Productos Pediátricos',
    [ProductCategory.GASTROINTESTINALES_DIGESTIVOS]: 'Medicamentos Gastrointestinales',
    [ProductCategory.GINECOLOGICOS_UROLOGICOS]: 'Productos Ginecológicos y Urológicos',
    [ProductCategory.CARDIOVASCULARES_ANTIDIABETICOS]: 'Medicamentos Cardiovasculares',
    [ProductCategory.OFTALMOLOGICOS]: 'Productos Oftalmológicos',
    [ProductCategory.ANTIHISTAMINICOS_ANTIALERGICOS]: 'Antihistamínicos y Antialérgicos',
    [ProductCategory.NEUROLOGICOS_PSIQUIATRICOS]: 'Medicamentos Neurológicos'
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchFromUrl = urlParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [location.search])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.section-menu-container')) {
        setIsSectionMenuOpen(false)
      }
    }

    if (isSectionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSectionMenuOpen])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Si el término está vacío, no hacer nada
    if (!searchTerm.trim()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      onSearch(searchTerm.trim())
      navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`)
    } catch (err) {
      setError('Error al buscar productos')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (error) {
      setError(null)
    }
  }

  const handleSectionSelect = (category: ProductCategory | '') => {
    setIsSectionMenuOpen(false)
  
    if (category === '') {
      navigate('/productos')
    } else {
      navigate(`/productos?category=${category}`)
    }
  }

  const toggleSectionMenu = () => {
    setIsSectionMenuOpen(!isSectionMenuOpen)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <div className="flex border border-orange-200 rounded-lg bg-white focus-within:ring-1 focus-within:ring-orange-300 focus-within:border-orange-400 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="section-menu-container relative">
              <button
                type="button"
                onClick={toggleSectionMenu}
                className="flex-shrink-0 bg-orange-50 hover:bg-orange-100 text-orange-600 hover:text-orange-700 px-3 py-2 sm:py-3 rounded-l-lg border-r border-orange-200 transition-all duration-200 focus:outline-none focus:ring-0 focus:bg-orange-100 focus:text-orange-700"
                title="Filtrar por sección"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span className="sr-only">Filtrar por secciones</span>
              </button>

              {isSectionMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-orange-200 z-50 max-h-96 overflow-y-auto">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-orange-100">
                      <h3 className="text-sm font-semibold text-orange-800">Filtrar por Sección</h3>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleSectionSelect('')}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 border-b border-orange-100"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="font-medium">Todas las secciones</span>
                      </div>
                    </button>
                    
                    {Object.entries(sectionLabels).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSectionSelect(key as ProductCategory)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="line-clamp-1">{label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Buscar productos..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-3 sm:pr-4 text-sm text-gray-700 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-500"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="flex-shrink-0 bg-gradient-to-r from-[#ffcc02] to-[#ed751b] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-r-lg hover:from-[#f0b800] hover:to-[#d6641a] active:from-[#c2561a] active:to-[#e6a600] focus:outline-none focus:ring-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#ed751b] disabled:hover:to-[#ffcc02] border-l border-orange-200 shadow-sm"
              disabled={loading}
              title="Buscar productos"
            >
              {loading ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <span className="sr-only">Buscar</span>
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-2 text-red-800 text-xs sm:text-sm bg-red-50 border border-red-200 px-2 sm:px-3 py-1 sm:py-2 rounded animate-fade-in">
          {error}
        </div>
      )}
    </div>
  )
}

export default SearchBar