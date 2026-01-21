import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import type { Product } from '../types/Product'
import LoadingSpinner from '../components/commons/LoadingSpinner'

const Producto: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('ID de producto no válido')
        setLoading(false)
        return
      }

      const productIdNum = parseInt(productId)
      if (isNaN(productIdNum) || productIdNum <= 0) {
        setError('ID de producto inválido')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const foundProduct = await productService.getById(productIdNum)
        setProduct(foundProduct)
      } catch (err: any) {
        const errorMessage = err.message || 'Error al cargar el producto'
        setError(errorMessage)
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleImageError = () => {
    setImageError(true)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleWhatsAppContact = () => {
    if (!product) return
    
    const quantityText = quantity > 1 ? ` (${quantity} unidades)` : ''
    const whatsappMessage = `Hola, me interesa el producto: ${product.name}${quantityText}. ¿Podrías darme más información sobre disponibilidad y precio?`
    const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return <LoadingSpinner className="min-h-[600px]" />
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="max-w-md mx-auto">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Reintentar
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[#17A15B] text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => {
          // Mantener la posición guardada cuando se usa el botón "Volver"
          navigate(-1)
        }}
        className="group inline-flex items-center px-4 py-2 text-gray-600 hover:text-white bg-white hover:bg-[#17A15B] border border-gray-200 hover:border-[#17A15B] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out mb-6 font-medium"
      >
        <svg 
          className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300 ease-in-out" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="relative">
          Volver
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
        </span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="relative h-96 md:h-full bg-gray-100">
              {!imageError && product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-500">Sin imagen disponible</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:w-1/2 p-8">
            <div className="h-full flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No hay descripción disponible para este producto.'}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-[#17A15B]">
                    S/ {product.price.toFixed(2)}
                  </span>
                  <span className="text-gray-500 ml-2">por unidad</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Cantidad</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#17A15B] focus:border-[#17A15B] outline-none"
                    />
                    <span className="ml-2 text-gray-600">
                      {quantity === 1 ? 'unidad' : 'unidades'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Total */}
              {quantity > 1 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Total:</span>
                    <span className="text-2xl font-bold text-[#17A15B]">
                      S/ {(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <button
                  onClick={handleWhatsAppContact}
                  className="group relative w-full py-4 bg-[#17A15B] text-white rounded-lg font-semibold flex items-center justify-center gap-3 text-lg overflow-hidden transition-all duration-300 ease-out hover:bg-[#128a4a] hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-1 active:translate-y-0 active:shadow-md"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                  
                  <svg 
                    className="w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  
                  <span className="relative z-10 transition-all duration-300 group-hover:font-bold">
                    Consultar disponibilidad
                  </span>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full animate-ping delay-100"></div>
                    <div className="absolute bottom-3 left-6 w-1 h-1 bg-white rounded-full animate-ping delay-300"></div>
                    <div className="absolute top-3 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-ping delay-500"></div>
                  </div>
                </button>
                
                <p className="text-sm text-gray-500 text-center mt-3 transition-colors duration-300 hover:text-gray-700">
                  Te contactaremos para confirmar disponibilidad y coordinar la entrega
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Producto