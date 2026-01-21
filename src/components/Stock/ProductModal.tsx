import React, { useState, useEffect } from 'react'
import { productService } from '../../services/productService'
import { ProductCategory } from '../../types/ProductCategory'
import { type ProductCreateRequest, type Product } from '../../types/Product'
import { useAuth } from '../../context/AuthContext'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  mode: 'create' | 'edit'
  product?: Product 
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  mode,
  product 
}) => {
  const [formData, setFormData] = useState<ProductCreateRequest>({
    name: '',
    description: '',
    price: 0,
    category: ProductCategory.OTROS,
    imageUrl: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('')
  const [imageInputMode, setImageInputMode] = useState<'url' | 'file'>('url') 
  const [] = useState(false) 
  const { token } = useAuth()

  const categoryLabels: Record<ProductCategory, string> = {
    [ProductCategory.CUIDADO_PERSONAL_HIGIENE]: 'Cuidado Personal e Higiene',
    [ProductCategory.VITAMINAS_SUPLEMENTOS_NUTRICIONALES]: 'Vitaminas y Suplementos Nutricionales',
    [ProductCategory.RESPIRATORIOS_EXPECTORANTES]: 'Respiratorios y Expectorantes',
    [ProductCategory.ANTIBIOTICOS_ANTIVIRALES]: 'Antibióticos y Antivirales',
    [ProductCategory.DERMATOLOGICOS_TRATAMIENTOS_CUTANEOS]: 'Dermatológicos y Tratamientos Cutáneos',
    [ProductCategory.ANALGESICOS_ANTINFLAMATORIOS]: 'Analgésicos y Antiinflamatorios',
    [ProductCategory.MATERIAL_MEDICO_EQUIPOS]: 'Material Médico y Equipos',
    [ProductCategory.MEDICINA_NATURAL_HIDRATACION]: 'Medicina Natural e Hidratación',
    [ProductCategory.PEDIATRICOS_LACTANCIA]: 'Pediátricos y Lactancia',
    [ProductCategory.GASTROINTESTINALES_DIGESTIVOS]: 'Gastrointestinales y Digestivos',
    [ProductCategory.GINECOLOGICOS_UROLOGICOS]: 'Ginecológicos y Urológicos',
    [ProductCategory.CARDIOVASCULARES_ANTIDIABETICOS]: 'Cardiovasculares y Antidiabéticos',
    [ProductCategory.OFTALMOLOGICOS]: 'Oftalmológicos',
    [ProductCategory.ANTIHISTAMINICOS_ANTIALERGICOS]: 'Antihistamínicos y Antialérgicos',
    [ProductCategory.NEUROLOGICOS_PSIQUIATRICOS]: 'Neurológicos y Psiquiátricos',
    [ProductCategory.OTROS]: 'Otros'
  }

  useEffect(() => {
    if (isOpen && mode === 'edit' && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || ''
      })
      setImageFile(null)
      setImagePreviewUrl(product.imageUrl || '')
      setImageInputMode('url') // Reset al modo URL
    } else if (isOpen && mode === 'create') {
      setFormData({
        name: '',
        description: '',
        price: '' as any, // Inicia vacío para que el usuario pueda escribir desde cero
        category: ProductCategory.OTROS,
        imageUrl: ''
      })
      setImageFile(null)
      setImagePreviewUrl('')
      setImageInputMode('url') // Reset al modo URL
    }
    if (isOpen) {
      setError(null)
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden'
    } else {
      // Restaurar scroll del body
      document.body.style.overflow = 'unset'
    }

    // Cleanup function para restaurar el scroll si el componente se desmonta
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, mode, product])

  useEffect(() => {
    if (imageFile) {
      setImagePreviewUrl(URL.createObjectURL(imageFile))
    } else {
      setImagePreviewUrl(formData.imageUrl || '')
    }
    return () => {
      if (imageFile) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [imageFile, formData.imageUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!token) {
      setError('No tienes permisos para crear o editar productos. Inicia sesión como administrador.');
      setIsLoading(false);
      return;
    }

    try {
      const productData: ProductCreateRequest = {
        ...formData,
        imageUrl: formData.imageUrl.trim()
      }

      if (mode === 'create') {
        await productService.create(token, productData, imageFile || undefined);
      } else if (mode === 'edit' && product) {
        await productService.update(token, product.id, productData, imageFile || undefined);
      }

      // Cerrar modal después del éxito y validar que no esté vacío
      if (formData.price === 0 && (formData.price.toString() === '' || formData.price.toString() === '0')) {
        // Solo validamos que no esté completamente vacío, permitimos 0
        const priceInput = document.querySelector('input[name="price"]') as HTMLInputElement;
        if (priceInput && priceInput.value.trim() === '') {
          setError('El precio no puede estar vacío');
          setIsLoading(false);
          return;
        }
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(mode === 'create' ? 'Error al crear el producto' : 'Error al actualizar el producto')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }))
    if (name === 'imageUrl') {
      setImagePreviewUrl(value)
      setImageFile(null)
    }
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    if (!file) {
      setImagePreviewUrl(formData.imageUrl || '')
    }
  }

  // Función para cerrar error
  const closeError = () => {
    setError(null)
  }

  // Función para cambiar modo de imagen
  const handleImageModeSwitch = (mode: 'url' | 'file') => {
    setImageInputMode(mode)
    if (mode === 'url') {
      setImageFile(null)
      setImagePreviewUrl(formData.imageUrl || '')
    } else {
      setFormData(prev => ({ ...prev, imageUrl: '' }))
      setImagePreviewUrl('')
    }
  }

  if (!isOpen) return null

  const isEditMode = mode === 'edit'
  const title = isEditMode ? 'Editar Producto' : 'Nuevo Producto'
  const submitButtonText = isEditMode ? 'Actualizar Producto' : 'Crear Producto'
  const loadingText = isEditMode ? 'Actualizando...' : 'Creando...'

  // Si no hay imagenUrl y no hay archivo, NO muestra la imagen placeholder
  const showPreview = !!imagePreviewUrl && imagePreviewUrl.trim().length > 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-black rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
            <svg className={`w-8 h-8 ${isEditMode ? 'text-blue-500' : 'text-[#17A15B]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isEditMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              )}
            </svg>
            <span>{title}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Vista previa de la imagen
            </label>
            <div className="w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              {showPreview ? (
                <img
                  src={imagePreviewUrl}
                  alt="Vista previa del producto"
                  className="w-full h-full object-cover"
                  onError={() => setImagePreviewUrl('')}
                />
              ) : (
                <span className="text-gray-400 text-sm">Sin imagen</span>
              )}
            </div>
          </div>

          {/* Switch para tipo de carga de imagen */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Tipo de carga de imagen
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => handleImageModeSwitch('url')}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                  imageInputMode === 'url'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-500'
                }`}
                disabled={isLoading}
              >
                Por URL
              </button>
              <button
                type="button"
                onClick={() => handleImageModeSwitch('file')}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                  imageInputMode === 'file'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-500'
                }`}
                disabled={isLoading}
              >
                Subir archivo
              </button>
            </div>
          </div>

          {/* Campos de imagen condicionalmente */}
          {imageInputMode === 'url' ? (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                URL de la Imagen
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    isEditMode ? 'focus:border-blue-500 focus:ring-blue-500' : 'focus:border-[#17A15B] focus:ring-[#17A15B]'
                  }`}
                  placeholder="https://ejemplo.com/imagen.jpg (opcional)"
                  disabled={isLoading}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Selecciona una imagen
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isLoading}
                  id="image-file-input"
                />
                <div className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {imageFile ? imageFile.name : 'Haz clic para seleccionar o arrastra una imagen aquí'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, JPEG hasta 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nombre del Producto
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                isEditMode ? 'focus:border-blue-500 focus:ring-blue-500' : 'focus:border-[#17A15B] focus:ring-[#17A15B]'
              }`}
              placeholder="Ingresa el nombre del producto"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none ${
                isEditMode ? 'focus:border-blue-500 focus:ring-blue-500' : 'focus:border-[#17A15B] focus:ring-[#17A15B]'
              }`}
              placeholder="Describe las características del producto"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Categoría
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white ${
                  isEditMode ? 'focus:border-blue-500 focus:ring-blue-500' : 'focus:border-[#17A15B] focus:ring-[#17A15B]'
                }`}
                required
                disabled={isLoading}
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <svg 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Precio (S/)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                S/
              </span>
              <input
                type="text"
                name="price"
                value={formData.price.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  // Solo permite números y un punto decimal, sin números negativos
                  if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                    setFormData(prev => ({
                      ...prev,
                      price: value as any
                    }));
                  }
                }}
                className={`w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  isEditMode ? 'focus:border-blue-500 focus:ring-blue-500' : 'focus:border-[#17A15B] focus:ring-[#17A15B]'
                }`}
                placeholder="0.50"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error card movida aquí */}
          {error && (
            <div className="bg-red-50 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
              <button
                onClick={closeError}
                className="text-red-500 hover:text-red-700 p-1"
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-3 text-sm font-semibold text-white border-2 border-black rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                isEditMode 
                  ? 'bg-blue-500 hover:bg-white hover:text-blue-500' 
                  : 'bg-[#17A15B] hover:bg-white hover:text-[#17A15B]'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{loadingText}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isEditMode ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    )}
                  </svg>
                  <span>{submitButtonText}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductModal