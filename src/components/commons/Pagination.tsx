interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  showSummary?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  maxVisiblePages?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  showSummary = true,
  totalItems,
  itemsPerPage,
  maxVisiblePages = 5
}: PaginationProps) => {
  // Calcular qué páginas mostrar
  const getVisiblePages = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar el rango si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showFirstPage = visiblePages[0] > 1;
  const showLastPage = visiblePages[visiblePages.length - 1] < totalPages;
  const showFirstEllipsis = visiblePages[0] > 2;
  const showLastEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  if (totalPages <= 1) return null;

  const baseButtonClasses = `
    px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
    border border-gray-300 hover:border-[#17A15B] hover:text-[#17A15B]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-500
  `;

  const activeButtonClasses = `
    px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
    bg-[#17A15B] text-white border border-[#17A15B]
  `;

  const ellipsisClasses = `
    px-3 py-2 text-sm font-medium text-gray-500
  `;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6 border-t border-gray-200 bg-gray-50">
      {/* Resumen de información */}
      {showSummary && totalItems && itemsPerPage && (
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          <span>
            Mostrando{' '}
            <span className="font-medium text-gray-900">
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
            </span>
            {' '}-{' '}
            <span className="font-medium text-gray-900">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>
            {' '}de{' '}
            <span className="font-medium text-gray-900">{totalItems}</span>
            {' '}resultados
          </span>
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        {/* Botón Anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`${baseButtonClasses} flex items-center space-x-1`}
          aria-label="Página anterior"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Primera página */}
        {showFirstPage && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={isLoading}
              className={`${baseButtonClasses}`}
            >
              1
            </button>
            {showFirstEllipsis && <span className={ellipsisClasses}>...</span>}
          </>
        )}

        {/* Páginas visibles */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={page === currentPage ? activeButtonClasses : baseButtonClasses}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {/* Última página */}
        {showLastPage && (
          <>
            {showLastEllipsis && <span className={ellipsisClasses}>...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={isLoading}
              className={`${baseButtonClasses}`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Botón Siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`${baseButtonClasses} flex items-center space-x-1`}
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 order-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#17A15B]"></div>
          <span>Cargando...</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
