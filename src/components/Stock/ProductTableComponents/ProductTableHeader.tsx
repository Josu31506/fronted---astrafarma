import type { Product } from '../../../types/Product'

interface ProductTableHeaderProps {
  filteredProducts: Product[];
  displayedProducts: Product[];
}

const ProductTableHeader = ({  }: ProductTableHeaderProps) => {
  return (
    <div className="bg-[#17A15B] px-4 sm:px-6 py-4 border-b-2 border-black">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center space-x-2">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Productos</span>
        </h2>
      </div>
    </div>
  );
};

export default ProductTableHeader;