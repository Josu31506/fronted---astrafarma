import React, { useState } from 'react';
import type { Offer } from '../../services/offerService';
import TextOfferBanner from './TextOfferBanner';

interface ImageOfferBannerProps {
  offer: Offer;
}

const ImageOfferBanner: React.FC<ImageOfferBannerProps> = ({ offer }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div className="w-full h-full relative bg-gray-200">
      {!imageError && offer.imageUrl && (
        <>
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="text-gray-500 text-sm">Cargando imagen...</span>
              </div>
            </div>
          )}
          <img
            src={offer.imageUrl}
            alt={offer.title || `Oferta ${offer.id}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </>
      )}

      {(imageError || !offer.imageUrl) && (
        <div className="w-full h-full">
          <TextOfferBanner offer={offer} />
        </div>
      )}

      {!imageError && imageLoaded && offer.imageUrl && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
          <div className="p-6 text-white w-full">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="flex-1 mb-4 sm:mb-0">
                {offer.title && (
                  <h3 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">
                    {offer.title}
                  </h3>
                )}
                <p className="text-sm opacity-90 drop-shadow">
                  Válida hasta: {new Date(offer.endDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {offer.productNames && offer.productNames.length > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                    <span className="text-xs font-medium">
                      {offer.productNames.length} productos
                    </span>
                  </div>
                )}

                {offer.discounts && offer.discounts.length > 0 && (
                  <div className="bg-emerald-500/90 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                    <span className="text-xs font-bold">
                      Hasta {Math.max(...offer.discounts.map((d) => d.discountPercentage))}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageOfferBanner;