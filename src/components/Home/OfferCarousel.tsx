import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOffers } from '../../context/OfferContext';
import { useNavigate } from 'react-router-dom';
import type { Offer } from '../../services/offerService';

import TextOfferBanner from './TextOfferBanner';
import ImageOfferBanner from './ImageOfferBanner';
import OfferActionButtons from './OfferActionButtons';
import OfferModal from './OfferModal';
import OfferNotificationModal from './OfferNotificationModal';
import Notification from '../commons/Notification';

import {
  isImageOffer,
  getActiveOffers,
  getValidProductNames
} from './offerUtils';

interface OfferCarouselProps {
  onProductClick?: (productNames: string[]) => void;
  autoSlideInterval?: number;
}

const OfferCarousel = ({ onProductClick, autoSlideInterval = 3500 }: OfferCarouselProps) => {
  const { user, token } = useAuth();
  const { offers, loading, deleteOffer, notifyOffers } = useOffers();
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<number | null>(null);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  const intervalRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const isAdmin = !!(token && (user?.userRole === 'ADMIN' || user?.role === 'ADMIN'));
  const activeOffers = getActiveOffers(offers);

  // Auto-rotación está OFF para admins, ON para usuarios normales
  const isAutoPlaying = !isAdmin;

  useEffect(() => {
    setCurrentSlide(0);
  }, [activeOffers.length]);

  useEffect(() => {
    if (!isAdmin && activeOffers.length > 1 && isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % activeOffers.length);
      }, autoSlideInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAdmin, activeOffers.length, isAutoPlaying, autoSlideInterval]);

  const handleMouseEnter = () => {
    if (!isAdmin && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!isAdmin && activeOffers.length > 1 && isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % activeOffers.length);
      }, autoSlideInterval);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!loading && activeOffers.length === 0 && !isAdmin) return null;

  const currentOffer = activeOffers[currentSlide];

  const handleOfferClick = (offer: Offer) => {
    const validProductNames = getValidProductNames(offer.productNames);

    if (validProductNames.length > 0) {
      if (onProductClick) {
        onProductClick(validProductNames);
      } else {
        const namesParam = validProductNames.map(encodeURIComponent).join(',');
        navigate(`/productos?names=${namesParam}`);
      }
    } else {
      navigate('/productos');
    }
  };

  const handleWhatsAppClick = (offer: Offer) => {
    // Construir mensaje dinámico según la información disponible
    let message = "Hola, me gustaria consultar sobre esta oferta de Astrafarma:\n\n";

    if (offer.title && offer.title.trim()) {
      message += `OFERTA: ${offer.title}\n`;
    }

    if (offer.endDate) {
      const validDate = new Date(offer.endDate);
      message += `Valida hasta: ${validDate.toLocaleDateString('es-PE')}\n`;
    }

    const validProductNames = getValidProductNames(offer.productNames);
    if (validProductNames.length > 0) {
      message += `Productos relacionados: ${validProductNames.join(', ')}\n`;
    }

    if (offer.discounts && offer.discounts.length > 0) {
      message += `Descuentos:\n`;
      offer.discounts.forEach(discount => {
        message += `- ${discount.productName}: ${discount.discountPercentage}%\n`;
      });
    }
    
    message += `\nPodrian darme mas informacion sobre esta oferta?`;
    
    const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setShowModal(true);
  };

  const handleDeleteOffer = async (offerId: number) => {
    if (!token || !window.confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      return;
    }

    try {
      setDeletingOffer(offerId);
      await deleteOffer(token, offerId);
    } catch (err) {
      console.error('Error eliminando oferta:', err);
      setNotification({
        show: true,
        message: 'Error al eliminar la oferta. Por favor, intenta nuevamente.',
        type: 'error'
      });
    } finally {
      setDeletingOffer(null);
    }
  };

  const handleNotifyOffers = async (selectedOfferIds: number[]) => {
    if (!token) return;

    try {
      setNotificationLoading(true);
      await notifyOffers(token, selectedOfferIds);
      setNotification({
        show: true,
        message: `Se han enviado las notificaciones para ${selectedOfferIds.length} ${selectedOfferIds.length === 1 ? 'oferta' : 'ofertas'} exitosamente.`,
        type: 'success'
      });
      setShowNotificationModal(false);
    } catch (err) {
      setNotification({
        show: true,
        message: 'Error al enviar las notificaciones. Por favor, intenta nuevamente.',
        type: 'error'
      });
    } finally {
      setNotificationLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(activeOffers.length, 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(activeOffers.length, 1)) % Math.max(activeOffers.length, 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="relative mb-12 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-64 md:h-96 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00bd4c]"></div>
            <div className="text-gray-500 text-lg">Cargando ofertas...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAdmin && activeOffers.length > 0 && currentOffer && (
        <OfferActionButtons
          offer={currentOffer}
          isAdmin={isAdmin}
          deletingOffer={deletingOffer}
          onWhatsAppClick={handleWhatsAppClick}
          onViewProducts={handleOfferClick}
          onEditOffer={handleEditOffer}
          onDeleteOffer={handleDeleteOffer}
          onCreateOffer={() => {
            setEditingOffer(null);
            setShowModal(true);
          }}
          onNotifyOffers={() => setShowNotificationModal(true)}
          showAdminButtons={true}
        />
      )}

      {isAdmin && activeOffers.length > 1 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-700 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Modo Administrador: Auto-rotación desactivada. Usa las flechas para navegar.</span>
          </div>
        </div>
      )}

      {isAdmin && activeOffers.length === 0 && (
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setShowNotificationModal(true)}
            className="bg-[#00bd4c] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#17A15B] transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Notificar Ofertas</span>
          </button>
          <button
            onClick={() => {
              setEditingOffer(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg transform hover:scale-105"
          >
            + Nueva Oferta
          </button>
        </div>
      )}

      <div 
        ref={carouselRef}
        className="relative mb-6 bg-white rounded-2xl shadow-xl overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative h-64 md:h-96">
          {activeOffers.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="text-gray-500 text-xl mb-3">No hay ofertas activas</div>
                {isAdmin && (
                  <div className="text-gray-400 text-sm">Haz clic en "Nueva Oferta" para agregar una</div>
                )}
              </div>
            </div>
          ) : (
            activeOffers.map((offer, index) => (
              <div
                key={offer.id}
                className={`absolute inset-0 transition-all duration-700 cursor-pointer ${
                  index === currentSlide 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-105'
                }`}
                onClick={() => handleOfferClick(offer)}
              >
                {isImageOffer(offer) ? (
                  <ImageOfferBanner offer={offer} />
                ) : (
                  <TextOfferBanner offer={offer} />
                )}
              </div>
            ))
          )}
        </div>

        {activeOffers.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm hover:scale-110 z-20"
              aria-label="Oferta anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm hover:scale-110 z-20"
              aria-label="Siguiente oferta"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {activeOffers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125 shadow-lg' 
                      : 'bg-white/60 hover:bg-white/80 hover:scale-110'
                  }`}
                  aria-label={`Ir a oferta ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {activeOffers.length > 1 && (
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>Auto</span>
            </div>
          </div>
        )}
      </div>

      {activeOffers.length > 0 && currentOffer && (
        <OfferActionButtons
          offer={currentOffer}
          isAdmin={isAdmin}
          deletingOffer={deletingOffer}
          onWhatsAppClick={handleWhatsAppClick}
          onViewProducts={handleOfferClick}
          onEditOffer={handleEditOffer}
          onDeleteOffer={handleDeleteOffer}
          onCreateOffer={() => {
            setEditingOffer(null);
            setShowModal(true);
          }}
          onNotifyOffers={() => setShowNotificationModal(true)}
          showAdminButtons={false}
        />
      )}

      {/* Modales */}
      <OfferNotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onConfirm={handleNotifyOffers}
        offers={offers}
        loading={notificationLoading}
      />

      <OfferModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingOffer(null);
        }}
        offer={editingOffer}
      />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </>
  );
};

export default OfferCarousel;