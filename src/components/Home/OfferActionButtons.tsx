import React from 'react';
import type { Offer } from '../../services/offerService';

interface OfferActionButtonsProps {
  offer: Offer;
  isAdmin: boolean;
  deletingOffer: number | null;
  onWhatsAppClick: (offer: Offer) => void;
  onViewProducts: (offer: Offer) => void;
  onEditOffer: (offer: Offer) => void;
  onDeleteOffer: (offerId: number) => void;
  onCreateOffer: () => void;
  onNotifyOffers: () => void;
  showAdminButtons?: boolean;
}

const OfferActionButtons: React.FC<OfferActionButtonsProps> = ({
  offer,
  isAdmin,
  deletingOffer,
  onWhatsAppClick,
  onViewProducts,
  onEditOffer,
  onDeleteOffer,
  onCreateOffer,
  onNotifyOffers,
  showAdminButtons = true,
}) => {
  // Renderizar solo botones de administración
  if (showAdminButtons && isAdmin) {
    return (
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={onNotifyOffers}
          className="bg-[#00bd4c] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#17A15B] transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Notificar Ofertas</span>
        </button>
        
        <button
          onClick={onCreateOffer}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg transform hover:scale-105"
        >
          + Nueva Oferta
        </button>

        <button
          onClick={() => onEditOffer(offer)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Editar</span>
        </button>

        <button
          onClick={() => onDeleteOffer(offer.id)}
          disabled={deletingOffer === offer.id}
          className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
        >
          {deletingOffer === offer.id ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Eliminando...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Eliminar</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Renderizar solo botones de usuario (siempre se muestran cuando showAdminButtons es false)
  if (!showAdminButtons) {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-12 mb-8">
        {/* Botón de Consultar Oferta (WhatsApp) */}
        <button
          onClick={() => onWhatsAppClick(offer)}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3"
        >
          <svg 
            className="w-5 h-5" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.087z"/>
          </svg>
          <span>Consultar Oferta</span>
        </button>

        <button
          onClick={() => onViewProducts(offer)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Ver Productos</span>
        </button>
      </div>
    );
  }

  return null;
};

export default OfferActionButtons;