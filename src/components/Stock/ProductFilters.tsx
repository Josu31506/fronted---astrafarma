import React from 'react'
import { ProductCategory } from '../../types/ProductCategory'

interface ProductFiltersProps {
  isOpen: boolean
  onToggle: () => void
  nameFilter: string
  setNameFilter: (value: string) => void
  categoryFilter: ProductCategory | ''
  setCategoryFilter: (value: ProductCategory | '') => void
  minPrice: string
  setMinPrice: (value: string) => void
  maxPrice: string
  setMaxPrice: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  filteredCount: number
  totalCount: number
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  isOpen,
  onToggle,
  nameFilter,
  setNameFilter,
  categoryFilter,
  setCategoryFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onClearFilters,
  hasActiveFilters,
  filteredCount,
  totalCount
}) => {
  const categoryLabels: Record<ProductCategory, string> = {
    [ProductCategory.CUIDADO_PERSONAL_HIGIENE]: 'Cuidado Personal',
    [ProductCategory.OTROS]: 'Otros',
    [ProductCategory.VITAMINAS_SUPLEMENTOS_NUTRICIONALES]: 'Vitaminas y Suplementos',
    [ProductCategory.RESPIRATORIOS_EXPECTORANTES]: 'Respiratorios',
    [ProductCategory.ANTIBIOTICOS_ANTIVIRALES]: 'Antibióticos',
    [ProductCategory.DERMATOLOGICOS_TRATAMIENTOS_CUTANEOS]: 'Dermatológicos',
    [ProductCategory.ANALGESICOS_ANTINFLAMATORIOS]: 'Analgésicos',
    [ProductCategory.MATERIAL_MEDICO_EQUIPOS]: 'Material Médico',
    [ProductCategory.MEDICINA_NATURAL_HIDRATACION]: 'Medicina Natural',
    [ProductCategory.PEDIATRICOS_LACTANCIA]: 'Pediátricos',
    [ProductCategory.GASTROINTESTINALES_DIGESTIVOS]: 'Gastrointestinales',
    [ProductCategory.GINECOLOGICOS_UROLOGICOS]: 'Ginecológicos',
    [ProductCategory.CARDIOVASCULARES_ANTIDIABETICOS]: 'Cardiovasculares',
    [ProductCategory.OFTALMOLOGICOS]: 'Oftalmológicos',
    [ProductCategory.ANTIHISTAMINICOS_ANTIALERGICOS]: 'Antihistamínicos',
    [ProductCategory.NEUROLOGICOS_PSIQUIATRICOS]: 'Neurológicos'
  }

  // Aseguramos que el cambio de categoría solo use el value del enum
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Si el value es "", significa "todas las categorías"
    if (value === "") {
      setCategoryFilter("");
    } else if (Object.values(ProductCategory).includes(value as ProductCategory)) {
      setCategoryFilter(value as ProductCategory);
    }
    // Si el value no es válido, simplemente no lo asignamos
  };

  return (
    <div className="bg-white border-b-2 border-gray-200">
      <div className="px-4 sm:px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-[#17A15B] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#17A15B] focus:ring-opacity-50 rounded-lg px-2 py-1"
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#17A15B] text-white">
                {hasActiveFilters ? 'Activos' : ''}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-4">
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200 hover:underline"
              >
                Limpiar filtros
              </button>
            )}
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>
                {hasActiveFilters ? (
                  <>
                    <strong>{filteredCount}</strong> de <strong>{totalCount}</strong> productos
                  </>
                ) : (
                  <>
                    <strong>{totalCount}</strong> {totalCount === 1 ? 'producto' : 'productos'}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Buscar por nombre o descripción
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A15B] focus:border-[#17A15B] transition-colors duration-200"
                />
                <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A15B] focus:border-[#17A15B] transition-colors duration-200"
              >
                <option value="">Todas las categorías</option>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Precio mínimo (S/)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A15B] focus:border-[#17A15B] transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Precio máximo (S/)
              </label>
              <input
                type="number"
                placeholder="999.99"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A15B] focus:border-[#17A15B] transition-colors duration-200"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Filtros aplicados - Mostrando {filteredCount} de {totalCount} productos
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductFilters