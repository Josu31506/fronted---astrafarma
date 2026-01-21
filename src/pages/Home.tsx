import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductCategory } from '../types/ProductCategory'
import OfferCarousel from '../components/Home/OfferCarousel'

interface HomeProps {
  onCategoryFilter?: (category: ProductCategory | '') => void
}

const Home: React.FC<HomeProps> = ({ onCategoryFilter }) => {
  const navigate = useNavigate()

  const handleOfferProductClick = (productNames: string[]) => {
    if (productNames && productNames.length > 0) {
      const namesParam = productNames.map(encodeURIComponent).join(',');
      const targetUrl = `/productos?names=${namesParam}`;
      navigate(targetUrl);
    } else {
      navigate('/productos');
    }
  }

  const productSections = [
    {
      category: ProductCategory.CUIDADO_PERSONAL_HIGIENE,
      title: 'Cuidado Personal e Higiene',
      description: 'Productos para el cuidado diario y la higiene personal',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'from-pink-500 to-rose-500'
    },
    {
      category: ProductCategory.RESPIRATORIOS_EXPECTORANTES,
      title: 'Respiratorios',
      description: 'Tratamientos para afecciones respiratorias',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: ProductCategory.VITAMINAS_SUPLEMENTOS_NUTRICIONALES,
      title: 'Vitaminas y Suplementos',
      description: 'Complementos nutricionales para tu bienestar',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: 'from-orange-500 to-yellow-500'
    },
    {
      category: ProductCategory.DERMATOLOGICOS_TRATAMIENTOS_CUTANEOS,
      title: 'Dermatológicos',
      description: 'Cuidado y tratamiento de la piel',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'from-purple-500 to-indigo-500'
    },
    {
      category: ProductCategory.GASTROINTESTINALES_DIGESTIVOS,
      title: 'Digestivos',
      description: 'Productos para la salud digestiva',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      color: 'from-green-500 to-teal-500'
    },
    {
      category: ProductCategory.PEDIATRICOS_LACTANCIA,
      title: 'Pediátricos',
      description: 'Productos especializados para bebés y niños',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-yellow-400 to-orange-400'
    },
    {
      category: ProductCategory.ANALGESICOS_ANTINFLAMATORIOS,
      title: 'Analgésicos y Antiinflamatorios',
      description: 'Medicamentos para el dolor y la inflamación',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'from-red-500 to-pink-500'
    },
    {
      category: ProductCategory.OTROS,
      title: 'Otros Productos',
      description: 'Productos diversos para el cuidado de la salud',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'from-slate-500 to-gray-600'
    }
  ]

  const handleSectionClick = (category: ProductCategory) => {
    if (onCategoryFilter) {
      onCategoryFilter(category)
    }
    navigate(`/productos?category=${category}`)
  }

  const handleViewAllProducts = () => {
    if (onCategoryFilter) {
      onCategoryFilter('')
    }
    navigate('/productos')
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 md:px-4">
      <OfferCarousel onProductClick={handleOfferProductClick} />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Bienvenido a <span className="text-[#00bd4c]">Astrafarma</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Tu farmacia de confianza. Encuentra todo lo que necesitas para cuidar tu salud y bienestar
        </p>
        <button
          onClick={handleViewAllProducts}
          className="bg-[#00bd4c] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#17A15B] transition-colors duration-200 shadow-lg"
        >
          Ver Todos los Productos
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Nuestras Secciones</h2>
        <p className="text-gray-600 mb-8">Explora nuestras categorías más populares de productos farmacéuticos</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productSections.map((section) => (
            <div
              key={section.category}
              onClick={() => handleSectionClick(section.category)}
              className={`bg-gradient-to-br ${section.color} p-6 rounded-xl text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 opacity-90">
                  {section.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{section.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{section.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm mb-4">
            ¿Buscas algo específico? Tenemos muchas más categorías disponibles
          </p>
          <button
            onClick={handleViewAllProducts}
            className="text-[#00bd4c] hover:text-[#17A15B] font-medium text-sm transition-colors duration-200 border border-[#00bd4c] hover:border-[#17A15B] px-4 py-2 rounded-lg"
          >
            Ver Todas las Categorías
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#00bd4c] to-[#17A15B] rounded-2xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir Astrafarma?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Calidad Garantizada</h3>
            <p className="opacity-90">Productos farmacéuticos de la más alta calidad</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Precios Competitivos</h3>
            <p className="opacity-90">Los mejores precios del mercado farmacéutico</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Atención Especializada</h3>
            <p className="opacity-90">Personal farmacéutico capacitado para asesorarte</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home