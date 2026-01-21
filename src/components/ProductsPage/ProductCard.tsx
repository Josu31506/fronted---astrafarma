import React, { useState, memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../../types/Product'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  const [imageError, setImageError] = useState(false)
  const navigate = useNavigate()

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  const handleNavigateToProduct = useCallback(() => {
    if (!product.id || product.id <= 0) {
      console.error('ID de producto inválido:', product.id)
      return
    }
    
    // Guardar la posición actual del scroll antes de navegar
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
    sessionStorage.setItem('productsPageScrollPosition', currentScrollPosition.toString())
    
    // Navegar a la página de detalle
    navigate(`/producto/${product.id}`)
  }, [navigate, product.id])

  const handleWhatsAppClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    
    const whatsappMessage = `Hola, me gustaría saber más sobre el producto: ${product.name}. ¿Podrías darme más información?`
    const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank')
  }, [product.name])

  const handleVerMasClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    handleNavigateToProduct()
  }, [handleNavigateToProduct])

  return (
    <div 
      className="bg-white border border-black rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:shadow-gray-400/20 hover:-translate-y-1 transition-all duration-300 ease-out h-[400px] flex flex-col transform-gpu"
    >
      <div 
        onClick={handleNavigateToProduct}
        className="relative h-40 bg-black flex-shrink-0 cursor-pointer group"
      >
        {!imageError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <span className="text-white text-sm">Sin imagen</span>
          </div>
        )}
      
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white bg-opacity-80 rounded-full p-1">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>
  
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-800 mb-2 h-13 overflow-hidden text-ellipsis line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed h-12 overflow-hidden text-sm">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto gap-2">
          <div className="flex flex-col flex-shrink-0 max-w-[60%]">
            <span className="text-xl sm:text-2xl xl:text-xl font-bold text-[#17A15B] truncate">
              S/ {product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-1 sm:gap-2 xl:gap-1 flex-shrink-0 min-w-[40%] justify-end">
            <button
  onClick={handleVerMasClick}
  className="group px-2 py-1.5 sm:px-3 sm:py-2 xl:px-2 xl:py-1.5 bg-blue-100 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 hover:shadow-md hover:border-blue-400 transition-all duration-300 ease-out font-medium text-xs sm:text-sm xl:text-xs whitespace-nowrap transform hover:scale-105 cursor-pointer"
>
  <span className="transition-all duration-200 group-hover:font-semibold group-hover:tracking-wide">
    Ver más
  </span>
</button>
            <button
              onClick={handleWhatsAppClick}
              className="group px-2 py-1.5 sm:px-3 sm:py-2 xl:px-2 xl:py-1.5 bg-[#17A15B] text-white border border-black rounded-lg hover:bg-white hover:text-[#17A15B] hover:border-[#17A15B] hover:shadow-lg transition-all duration-300 ease-out font-medium flex items-center gap-1 text-xs sm:text-sm xl:text-xs whitespace-nowrap transform hover:scale-105 cursor-pointer"
            >
              <svg 
                className="w-3 h-3 sm:w-4 sm:h-4 xl:w-3 xl:h-3 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-sm" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="hidden sm:inline transition-all duration-200 group-hover:font-semibold group-hover:tracking-wide">
                Chat
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return prevProps.product.id === nextProps.product.id &&
         prevProps.product.name === nextProps.product.name &&
         prevProps.product.price === nextProps.product.price &&
         prevProps.product.description === nextProps.product.description &&
         prevProps.product.imageUrl === nextProps.product.imageUrl
})

ProductCard.displayName = 'ProductCard'

export default ProductCard