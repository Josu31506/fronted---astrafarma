import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductCategory } from '../../types/ProductCategory'

interface FooterProps {
  onCategoryFilter?: (category: ProductCategory | '') => void
}

const Footer: React.FC<FooterProps> = ({ onCategoryFilter }) => {
  const navigate = useNavigate()
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

  const handleSectionSelect = (category: ProductCategory | '') => {
    if (onCategoryFilter) {
      onCategoryFilter(category)
    }
    
    if (category === '') {
      navigate('/productos')
    } else {
      navigate(`/productos?category=${category}`)
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categoriesArray = Object.entries(sectionLabels)
  
  // Distribución fija y equilibrada para las 16 categorías
  const columnsData = [
    categoriesArray.slice(0, 4),   // Columna 1: categorías 0-3
    categoriesArray.slice(4, 8),   // Columna 2: categorías 4-7
    categoriesArray.slice(8, 12),  // Columna 3: categorías 8-11
    categoriesArray.slice(12, 16)  // Columna 4: categorías 12-15
  ]

  return (
    <footer className="bg-gray-900 text-white mt-16">
      {/* Sección principal del footer */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        {/* Grid principal - Ajustado para mejor responsividad */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          
          {/* Información de la empresa */}
          <div className="lg:col-span-1 md:mb-8 lg:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/icon.png" 
                alt="Astrafarma Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h3 className="text-xl font-bold text-[#00bd4c]">Astrafarma</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Tu botica de confianza especializada en productos médicos y farmacéuticos. 
              Brindamos atención de calidad con productos seguros y efectivos.
            </p>
            <div className="text-sm text-gray-400">
              <p className="mb-1">
                <span className="font-medium">RUC:</span> 20612823490
              </p>
              <p>
                <span className="font-medium">Razón Social:</span> CORPORACION LARFARMA SAC
              </p>
            </div>
          </div>

          {/* Sección de categorías - Mejorada para vista media */}
          <div className="lg:col-span-2 md:mb-8 lg:mb-0">
            <h3 className="text-lg font-semibold mb-4 text-[#00bd4c]">Nuestras Secciones</h3>
            
            {/* Grid de categorías - Ajustado para diferentes tamaños */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-3">
              {columnsData.map((column, columnIndex) => (
                <div key={columnIndex} className="space-y-2">
                  {column.map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handleSectionSelect(key as ProductCategory)}
                      className="block text-left text-sm text-gray-300 hover:text-[#00bd4c] transition-colors duration-200 hover:underline leading-relaxed w-full"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Enlace para ver todas las secciones */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={() => handleSectionSelect('')}
                className="inline-flex items-center text-sm font-medium text-[#00bd4c] hover:text-white transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Ver todos los productos
              </button>
            </div>
          </div>

          {/* Redes sociales y servicios */}
          <div className="lg:col-span-1">
            {/* Redes sociales */}
            <div className="mb-8 lg:mb-6">
              <h3 className="text-lg font-semibold mb-4 text-[#00bd4c]">Síguenos</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#00bd4c] transition-colors duration-200"
                  title="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#00bd4c] transition-colors duration-200"
                  title="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#00bd4c] transition-colors duration-200"
                  title="WhatsApp"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Atención al cliente */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#00bd4c]">Atención al Cliente</h3>
              <button
                onClick={() => {
                  alert('Libro de Reclamaciones - Próximamente disponible')
                }}
                className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors duration-200 border border-gray-600 hover:border-[#00bd4c] px-3 py-2 rounded-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Libro de Reclamaciones
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            
            {/* Copyright */}
            <div className="text-sm text-gray-400 text-center sm:text-left">
              <p>
                © {new Date().getFullYear()} <span className="font-medium text-white">CORPORACION LARFARMA SAC</span>
              </p>
              <p className="mt-1">
                RUC: 20612823490 - Todos los derechos reservados
              </p>
            </div>

            {/* Enlaces adicionales */}
            <div className="flex space-x-6 text-sm">
              <button
                onClick={() => alert('Términos y Condiciones - Próximamente disponible')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Términos y Condiciones
              </button>
              <button
                onClick={() => alert('Política de Privacidad - Próximamente disponible')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Política de Privacidad
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer