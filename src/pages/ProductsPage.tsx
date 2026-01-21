import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productService } from '../services/productService'
import ProductCard from '../components/ProductsPage/ProductCard'
import type { Product } from '../types/Product'
import LoadingSpinner from '../components/commons/LoadingSpinner'
import Pagination from '../components/commons/Pagination'
import { ProductCategory } from '../types/ProductCategory'

const ITEMS_PER_PAGE = 20 

const ProductsPage: React.FC = () => {
  const [currentProducts, setCurrentProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [searchParams] = useSearchParams()

  const filters = useMemo(() => {
    const categoryFilter = searchParams.get('category') as ProductCategory | null
    const searchTerm = searchParams.get('search')
    const namesParam = searchParams.get('names')

    const productNames = namesParam ?
      namesParam.split(',').map(name => decodeURIComponent(name.trim())).filter(name => name.length > 0) :
      undefined
    return {
      categoryFilter,
      searchTerm,
      productNames,
      namesParam
    }
  }, [searchParams])

  const getCategoryLabel = (category: ProductCategory): string => {
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
    return categoryLabels[category] || category
  }

  const filteredProducts = currentProducts

  // Load products for a specific page
  const loadProductsPage = useCallback(async (page: number) => {
    setLoading(true)

    try {
      let products: Product[] = []
      let total = 0
      let totalPagesCalc = 0

      if (filters.productNames) {
        const results = await Promise.all(filters.productNames.map(name => productService.searchByName(name)))
        const flat = results.flat()
        const unique: Product[] = []
        const seen = new Set<number>()
        flat.forEach(p => {
          if (p && !seen.has(p.id)) {
            seen.add(p.id)
            unique.push(p)
          }
        })
        products = unique
        total = unique.length
        totalPagesCalc = 1
        setCurrentPage(1)
      } else {
        const data = await productService.filter({
          query: filters.searchTerm || undefined,
          category: filters.categoryFilter || undefined,
          page: page - 1, // API usa páginas basadas en 0
          size: ITEMS_PER_PAGE
        })

        products = data.content || data.products || data
        total = data.totalElements || data.total || products.length
        totalPagesCalc = data.totalPages || Math.ceil(total / ITEMS_PER_PAGE)
        setCurrentPage(page)
      }

      setCurrentProducts(products)
      setTotalProducts(total)
      setTotalPages(totalPagesCalc)
      setError(null)
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar productos'
      console.error('Error cargando productos:', err);
      setError(errorMessage)
      setCurrentProducts([])
      setTotalProducts(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && !loading) {
      loadProductsPage(page)
      // Solo hacer scroll al top si no hay una posición guardada para restaurar
      // Esto evita conflictos con la restauración de posición desde ScrollToTop
      const hasScrollPosition = sessionStorage.getItem('productsPageScrollPosition')
      if (!hasScrollPosition) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }, [totalPages, loading, loadProductsPage])

  // Load initial products when filters change
  useEffect(() => {
    loadProductsPage(1)
  }, [loadProductsPage])

  if (loading) {
    return <LoadingSpinner className="min-h-[400px]" />
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Recargar página
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-8 sm:px-6 md:px-4">
      {/* Título dinámico */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {filters.productNames ? 'Productos de la Oferta' :
           filters.searchTerm ? `Resultados para "${filters.searchTerm}"` :
           filters.categoryFilter ? getCategoryLabel(filters.categoryFilter) :
           'Todos los Productos'}
        </h1>

        {filters.productNames && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-yellow-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span>Productos incluidos en la promoción</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-yellow-600 font-medium">
                  {totalProducts} {totalProducts === 1 ? 'producto' : 'productos'}
                </span>
                <button
                  onClick={() => window.history.back()}
                  className="text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-2 py-1 rounded transition-colors"
                >
                  ← Volver a ofertas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mostrar indicador de filtro activo por categoría */}
        {filters.categoryFilter && !filters.searchTerm && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-green-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span>Sección: <strong>{getCategoryLabel(filters.categoryFilter)}</strong></span>
              </div>
              <span className="text-sm text-green-600 font-medium">
                {totalProducts} {totalProducts === 1 ? 'producto' : 'productos'}
              </span>
            </div>
          </div>
        )}

        {!filters.categoryFilter && !filters.searchTerm && !filters.productNames && (
          <div className="text-gray-600 text-lg">
            <p>
              {totalProducts} {totalProducts === 1 ? 'producto disponible' : 'productos disponibles'}
              {currentProducts.length < totalProducts && (
                <span className="text-sm text-gray-500 ml-2">
                  (Página {currentPage} de {totalPages})
                </span>
              )}
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-gray-500 mt-1">
                Usa la paginación para navegar entre las páginas
              </p>
            )}
          </div>
        )}

        {/* Mostrar contador para búsquedas */}
        {filters.searchTerm && (
          <div className="text-gray-600 text-lg">
            <p>
              {totalProducts} {totalProducts === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              {currentProducts.length < totalProducts && (
                <span className="text-sm text-gray-500 ml-2">
                  (Página {currentPage} de {totalPages})
                </span>
              )}
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-gray-500 mt-1">
                Navegación por páginas disponible abajo
              </p>
            )}
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.productNames ? 'No se encontraron productos para esta oferta' :
               filters.categoryFilter ? 'No hay productos en esta categoría' :
               filters.searchTerm ? 'No se encontraron productos' :
               'No hay productos disponibles'}
            </h3>
            <p className="text-gray-500">
              {filters.productNames ? 'Los productos de esta oferta podrían no estar disponibles temporalmente.' :
               filters.categoryFilter ? 'Prueba seleccionando otra categoría desde el menú de filtros.' :
               filters.searchTerm ? 'Intenta con otros términos de búsqueda.' :
               'Los productos aparecerán aquí cuando estén disponibles.'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 mt-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={loading}
                showSummary={true}
                totalItems={totalProducts}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductsPage