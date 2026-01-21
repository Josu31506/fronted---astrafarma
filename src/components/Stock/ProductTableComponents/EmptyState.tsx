interface EmptyStateProps {
  hasFilters: boolean;
  isMobile?: boolean;
}

const EmptyState = ({ hasFilters, isMobile = false }: EmptyStateProps) => {
  const containerClasses = isMobile 
    ? "p-8 text-center"
    : "px-6 py-12 text-center";

  const iconSize = isMobile ? "w-12 h-12" : "w-12 h-12";
  const titleSize = isMobile ? "text-base" : "text-lg";
  const subtitleSize = isMobile ? "text-sm mt-1" : "text-sm";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-3">
        {hasFilters ? (
          <>
            <svg className={`${iconSize} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div>
              <p className={`${titleSize} font-semibold text-gray-500`}>No se encontraron productos</p>
              <p className={`${subtitleSize} text-gray-400`}>Intenta ajustar tus filtros de búsqueda</p>
            </div>
          </>
        ) : (
          <>
            <svg className={`${iconSize} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <div>
              <p className={`${titleSize} font-semibold text-gray-500`}>No hay productos disponibles</p>
              <p className={`${subtitleSize} text-gray-400`}>Los productos aparecerán aquí cuando se agreguen</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmptyState;