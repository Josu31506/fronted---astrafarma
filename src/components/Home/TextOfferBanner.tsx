import React from 'react';
import type { Offer } from '../../services/offerService';

interface TextOfferBannerProps {
  offer: Offer;
}

const TextOfferBanner: React.FC<TextOfferBannerProps> = ({ offer }) => {
  if (!offer) return null; // Evita renderizar sin datos reales

  const hasDiscounts = Array.isArray(offer.discounts) && offer.discounts.length > 0;
  const hasProducts = Array.isArray(offer.productNames) && offer.productNames.length > 0;
  const hasValidDate = !!offer.endDate;

  return (
    <section
      className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 relative overflow-hidden"
      aria-label={offer.title || 'Banner de oferta'}
      role="region"
    >
      {/* Fondo decorativo refinado */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/10 rounded-full"></div>
      </div>

      <div className="relative z-10 text-center px-6 py-8 max-w-4xl">
        {/* Título solo si existe */}
        {offer.title && (
          <div className="mb-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg leading-tight">
              {offer.title}
            </h2>
            <div className="w-20 h-1 bg-white/70 mx-auto rounded-full"></div>
          </div>
        )}

        {/* Descripción solo si existe */}
        {offer.description && (
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-medium max-w-2xl mx-auto">
            {offer.description}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {/* Fecha de validez */}
          {hasValidDate && (
            <div className="bg-white/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/40 shadow-sm min-w-[120px]">
              <p className="text-white text-sm font-semibold">
                <span className="block text-xs opacity-80">Válida hasta</span>
                {new Date(offer.endDate).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Productos relacionados */}
          {hasProducts && (
            <div className="bg-white/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/40 shadow-sm min-w-[120px]">
              <p className="text-white text-sm font-semibold">
                <span className="block text-xs opacity-80">Productos</span>
                {offer.productNames.length} disponibles
              </p>
            </div>
          )}

          {/* Descuentos */}
          {hasDiscounts && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/40 shadow-sm min-w-[120px]">
              <p className="text-emerald-800 text-sm font-bold">
                <span className="block text-xs opacity-80">Hasta</span>
                {Math.max(...offer.discounts.map((d) => d.discountPercentage))}% OFF
              </p>
            </div>
          )}
        </div>

        {/* Lista de descuentos detallada */}
        {hasDiscounts && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30 max-w-md mx-auto">
            <h3 className="text-white text-sm font-semibold mb-2 opacity-90">Descuentos disponibles:</h3>
            <div className="space-y-1">
              {offer.discounts.slice(0, 3).map((d, index) => (
                <div key={d.productName || index} className="flex justify-between items-center text-white text-xs">
                  <span>{d.productName}</span>
                  <span className="font-bold bg-white/20 px-2 py-1 rounded">
                    {d.discountPercentage}% OFF
                  </span>
                </div>
              ))}
              {offer.discounts.length > 3 && (
                <div className="text-white/80 text-xs text-center mt-2">
                  +{offer.discounts.length - 3} productos más
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TextOfferBanner;