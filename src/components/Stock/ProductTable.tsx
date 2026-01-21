import { useState, forwardRef, useImperativeHandle, useCallback, useEffect } from 'react'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import ProductFilters from './ProductFilters'
import ProductTableHeader from './ProductTableComponents/ProductTableHeader'
import EmptyState from './ProductTableComponents/EmptyState'
import Pagination from '../commons/Pagination'
import type { Product } from '../../types/Product'
import { ProductCategory } from '../../types/ProductCategory'
import { categoryLabels, getCategoryColor } from '../../types/productsCategoryUtils'
import { productService } from '../../services/productService'
import { useAuth } from '../../context/AuthContext';

const ITEMS_PER_PAGE = 10

interface ProductTableProps {
  onProductEdit?: (product: Product) => void;
  onProductChange?: () => void;
}

export interface ProductTableRef {
  refreshProducts: () => void;
}

const ProductTable = forwardRef<ProductTableRef, ProductTableProps>(({ onProductEdit, onProductChange }, ref) => {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [nameFilter, setNameFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | ''>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const { token } = useAuth();

  // Pagination state
  const [currentProducts, setCurrentProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Load products for a specific page
  const loadProductsPage = useCallback(async (page: number) => {
    setIsLoading(true)
    
    try {
      const data = await productService.filter({
        query: nameFilter || undefined,
        category: categoryFilter || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        page: page - 1, // API usa páginas basadas en 0
        size: ITEMS_PER_PAGE
      })
      
      // Manejar diferentes formatos de respuesta de la API
      if (data.content) {
        // Respuesta paginada estándar de Spring Boot
        setCurrentProducts(data.content)
        setTotalPages(data.totalPages || 0)
        setTotalItems(data.totalElements || 0)
      } else if (data.products) {
        // Respuesta con wrapper de productos
        setCurrentProducts(data.products)
        setTotalPages(Math.ceil((data.total || data.products.length) / ITEMS_PER_PAGE))
        setTotalItems(data.total || data.products.length)
      } else if (Array.isArray(data)) {
        // Respuesta directa como array
        setCurrentProducts(data)
        setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE))
        setTotalItems(data.length)
      } else {
        setCurrentProducts([])
        setTotalPages(0)
        setTotalItems(0)
      }
      
      setCurrentPage(page)
    } catch (err) {
      console.error('Error cargando productos:', err)
      setCurrentProducts([])
      setTotalPages(0)
      setTotalItems(0)
    } finally {
      setIsLoading(false)
    }
  }, [nameFilter, categoryFilter, minPrice, maxPrice])

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && !isLoading) {
      loadProductsPage(page)
    }
  }, [totalPages, isLoading, loadProductsPage])

  // Refresh products function
  const refreshProducts = useCallback(async () => {
    await loadProductsPage(1)
  }, [loadProductsPage])

  // Load initial products when filters change
  useEffect(() => {
    loadProductsPage(1)
  }, [loadProductsPage])

  const filteredProducts = currentProducts
  const displayedProducts = filteredProducts

  const clearFilters = () => {
    setNameFilter('')
    setCategoryFilter('')
    setMinPrice('')
    setMaxPrice('')
  }

  const hasActiveFilters = nameFilter !== '' || categoryFilter !== '' || minPrice !== '' || maxPrice !== ''

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setIsModalOpen(true)
  }

const handleConfirmDelete = async () => {
  if (!productToDelete) return;

  if (!token) {
    console.error('No tienes permisos para eliminar productos.');
    return;
  }

  setDeletingId(productToDelete.id);
  try {
    await productService.delete(token, productToDelete.id);
    setIsModalOpen(false);
    setProductToDelete(null);
    await loadProductsPage(currentPage);

    if (onProductChange) {
      onProductChange();
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
  } finally {
    setDeletingId(null);
  }
};

  const handleCancelDelete = () => {
    if (deletingId) return
    setIsModalOpen(false)
    setProductToDelete(null)
  }

  useImperativeHandle(ref, () => ({
    refreshProducts
  }), [refreshProducts])

  // Category Badge Component
  const CategoryBadge = ({ category, size = 'medium' }: { category: ProductCategory; size?: 'small' | 'medium' }) => {
    const baseClasses = `
      inline-flex items-center rounded-full font-medium border
      ${size === 'small' ? 'px-2 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'}
    `;

    return (
      <span className={`${baseClasses} ${getCategoryColor(category)}`}>
        {categoryLabels[category]}
      </span>
    );
  };

  const ActionButtons = ({ 
    product, 
    onEdit, 
    onDelete, 
    isDeleting, 
    canEdit,
    size = 'medium'
  }: {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    isDeleting: boolean;
    canEdit: boolean;
    size?: 'small' | 'medium';
  }) => {
    const isSmall = size === 'small';
    
    const baseClasses = `
      inline-flex items-center rounded-lg font-semibold transition-all duration-200
      ${isSmall ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'}
    `;

    return (
      <div className={`flex ${isSmall ? 'space-x-2' : 'space-x-2 justify-center'}`}>
        <button
          onClick={() => onEdit(product)}
          disabled={!canEdit}
          className={`
            ${baseClasses}
            ${!canEdit
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-500 hover:text-white hover:border-blue-500'
            }
            ${isSmall ? 'active:scale-95' : ''}
          `}
          title={!canEdit ? 'Función de editar no disponible' : 'Editar producto'}
        >
          <svg className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
            />
          </svg>
          Editar
        </button>
        
        <button
          onClick={() => onDelete(product)}
          disabled={isDeleting}
          className={`
            ${baseClasses}
            ${isDeleting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500'
            }
            ${isSmall ? 'active:scale-95' : ''}
          `}
          title="Eliminar producto"
        >
          {isDeleting ? (
            <>
              <svg className={`animate-spin -ml-1 mr-2 ${isSmall ? 'h-3 w-3' : 'h-4 w-4'}`} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isSmall ? (
                <span className="whitespace-nowrap">Eliminando...</span>
              ) : (
                'Eliminando...'
              )}
            </>
          ) : (
            <>
              <svg className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
              Eliminar
            </>
          )}
        </button>
      </div>
    );
  };

  // Desktop Table View
  const DesktopTable = () => (
    <div className="hidden 2xl:block">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                Producto
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                Descripción
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                Categoría
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                Precio
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product, index) => (
                <tr 
                  key={product.id}
                  className={`
                    hover:bg-gray-50 transition-all duration-200 
                    ${index !== displayedProducts.length - 1 ? 'border-b border-gray-200' : ''}
                    ${deletingId === product.id ? 'opacity-50' : ''}
                  `}
                >
                  <td className="px-6 py-4 border-r border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#17A15B] rounded-full"></div>
                      <div className="text-sm font-semibold text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200">
                    <div className="text-sm text-gray-600 max-w-xs">
                      {product.description || 'Sin descripción'}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200">
                    <CategoryBadge category={product.category} />
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200">
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-[#17A15B] whitespace-nowrap">
                        S/ {product.price.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ActionButtons
                      product={product}
                      onEdit={onProductEdit!}
                      onDelete={handleDeleteClick}
                      isDeleting={deletingId === product.id}
                      canEdit={!!onProductEdit}
                      size="medium"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <EmptyState hasFilters={hasActiveFilters} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Tablet Table View
  const TabletTable = () => (
    <div className="hidden md:block 2xl:hidden">
      <div className="p-4">
        {displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-12 gap-4 items-center mb-4 pb-3 border-b-2 border-gray-200 bg-gray-50 -mx-4 px-8 py-3">
              <div className="col-span-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Producto</h3>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Categoría</h3>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Precio</h3>
              </div>
              <div className="col-span-4 text-right">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Acciones</h3>
              </div>
            </div>
            
            <div className="grid gap-4">
              {displayedProducts.map((product) => (
                <div 
                  key={product.id}
                  className={`
                    bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200
                    ${deletingId === product.id ? 'opacity-50 bg-gray-50' : 'hover:shadow-md hover:border-gray-300'}
                  `}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-[#17A15B] rounded-full flex-shrink-0"></div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 mb-1">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-2">
                            {product.description || 'Sin descripción'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <CategoryBadge category={product.category} size="small" />
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-sm font-bold text-[#17A15B] whitespace-nowrap">
                        S/ {product.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="col-span-4 flex justify-end">
                      <ActionButtons
                        product={product}
                        onEdit={onProductEdit!}
                        onDelete={handleDeleteClick}
                        isDeleting={deletingId === product.id}
                        canEdit={!!onProductEdit}
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState hasFilters={hasActiveFilters} />
        )}
      </div>
    </div>
  );

  // Mobile Table View
  const MobileTable = () => (
    <div className="md:hidden">
      {displayedProducts.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {displayedProducts.map((product) => (
            <div 
              key={product.id} 
              className={`p-4 transition-all duration-200 ${
                deletingId === product.id ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#17A15B] rounded-full flex-shrink-0"></div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1">
                    {product.name}
                  </h3>
                </div>
                
                <div className="pl-4">
                  <CategoryBadge category={product.category} size="small" />
                </div>
                
                <div className="text-sm text-gray-600 leading-relaxed pl-4">
                  {product.description || 'Sin descripción'}
                </div>
                
                <div className="flex items-center justify-between pt-2 pl-4">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-[#17A15B] whitespace-nowrap">
                      S/ {product.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <ActionButtons
                    product={product}
                    onEdit={onProductEdit!}
                    onDelete={handleDeleteClick}
                    isDeleting={deletingId === product.id}
                    canEdit={!!onProductEdit}
                    size="small"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState hasFilters={hasActiveFilters} isMobile={true} />
      )}
    </div>
  );

  return (
    <>
      <div className="bg-white border-2 border-black rounded-xl shadow-2xl overflow-hidden">
        <ProductTableHeader 
          filteredProducts={filteredProducts}
          displayedProducts={displayedProducts}
        />

        <ProductFilters
          isOpen={isFiltersOpen}
          onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          filteredCount={filteredProducts.length}
          totalCount={totalItems}
        />

        <DesktopTable />
        <TabletTable />
        <MobileTable />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          showSummary={true}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        product={productToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={deletingId !== null}
      />
    </>
  )
})

ProductTable.displayName = 'ProductTable'

export default ProductTable