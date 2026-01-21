import React, { useState, useRef } from 'react';
import ProductTable from '../components/Stock/ProductTable';
import ProductModal from '../components/Stock/ProductModal';
import type { Product } from '../types/Product';
import type { ProductTableRef } from '../components/Stock/ProductTable';
import { useProductEditState, ProductEditStateProvider } from '../hooks/useProductEditState.tsx';
import { useAuth } from '../context/AuthContext';
import { productExcelService } from '../services/productExcelService';

const StockContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const { token } = useAuth();
  const { isEdited, resetEdited, markEdited } = useProductEditState();

  const tableRef = useRef<ProductTableRef>(null);

  const handleProductChange = () => {
    if (tableRef.current) {
      tableRef.current.refreshProducts();
    }
    markEdited();
  };

  const handleProductCreated = () => {
    handleProductChange();
    handleCloseModal();
  };

  const handleProductUpdated = () => {
    handleProductChange();
    handleCloseModal();
  };

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleNewProduct = () => {
    setSelectedProduct(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
    setModalMode('create');
  };

  const handleUploadExcel = async () => {
    setIsUploading(true);
    try {
      if (!token) throw new Error('No token');
      await productExcelService.exportToSupabase(token);
      resetEdited();
      alert('¡Catálogo subido correctamente a Supabase!');
    } catch (err) {
      alert('Error al subir catálogo a Supabase.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 sm:mb-8 space-y-4 lg:space-y-0">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Gestión del Catálogo
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base lg:text-lg">
            Administra tu inventario de productos
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-end gap-3 w-full lg:w-auto">
          <button
            onClick={handleNewProduct}
            className="w-auto max-w-[180px] mx-auto sm:mx-0 lg:min-w-[160px] px-4 sm:px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base font-semibold text-white bg-[#17A15B] border border-transparent rounded-lg hover:bg-white hover:text-[#17A15B] hover:border-[#17A15B] focus:ring-2 focus:ring-[#17A15B] focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="whitespace-nowrap">Nuevo Producto</span>
          </button>
          <button
            onClick={handleUploadExcel}
            disabled={!isEdited || isUploading}
            className={`w-auto max-w-[180px] mx-auto sm:mx-0 lg:min-w-[160px] px-4 sm:px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base font-semibold border rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 ${
              isEdited && !isUploading
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-white hover:text-blue-600'
                : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            title={!isEdited ? 'No hay cambios por subir' : isUploading ? 'Subiendo...' : 'Subir catálogo a Supabase'}
          >
            {isUploading ? (
              <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" />
              </svg>
            )}
            <span className="whitespace-nowrap">{isUploading ? 'Subiendo...' : 'Subir catálogo'}</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ProductTable 
          ref={tableRef}
          onProductChange={handleProductChange}
          onProductEdit={handleProductEdit}
        />
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={modalMode === 'create' ? handleProductCreated : handleProductUpdated}
        mode={modalMode}
        product={selectedProduct}
      />
    </div>
  );
};

const Stock: React.FC = () => (
  <ProductEditStateProvider>
    <StockContent />
  </ProductEditStateProvider>
);

export default Stock;