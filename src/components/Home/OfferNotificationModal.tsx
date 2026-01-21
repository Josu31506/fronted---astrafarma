import { useState } from 'react';

interface OfferNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedOfferIds: number[]) => void;
  offers: any[];
  loading: boolean;
}

const OfferNotificationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  offers, 
  loading 
}: OfferNotificationModalProps) => {
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);

  // Filtrar solo ofertas activas
  const activeOffers = offers.filter(offer => {
    const now = new Date();
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);
    return now >= startDate && now <= endDate;
  });

  const handleOfferToggle = (offerId: number) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOffers.length === activeOffers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(activeOffers.map(offer => offer.id));
    }
  };

  const handleConfirm = () => {
    if (selectedOffers.length > 0) {
      onConfirm(selectedOffers);
      setSelectedOffers([]);
    }
  };

  const handleClose = () => {
    setSelectedOffers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Notificar Ofertas por Correo
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-4">
              Selecciona las ofertas activas que deseas notificar por correo electrónico. 
              Solo se muestran ofertas que están actualmente vigentes.
            </p>
            
            {activeOffers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-2">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No hay ofertas activas</h3>
                <p className="text-gray-500">Crea ofertas activas para poder enviar notificaciones.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    {activeOffers.length} {activeOffers.length === 1 ? 'oferta activa' : 'ofertas activas'}
                  </span>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {selectedOffers.length === activeOffers.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activeOffers.map((offer) => (
                    <div 
                      key={offer.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedOffers.includes(offer.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleOfferToggle(offer.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedOffers.includes(offer.id)}
                          onChange={() => handleOfferToggle(offer.id)}
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            {/* Banner preview: negro si falla o no hay url */}
                            <div
                              style={{
                                width: 64,
                                height: 48,
                                minWidth: 64,
                                minHeight: 48,
                                background: (!offer.imageUrl || offer.imageUrl.length < 5) ? '#222' : undefined,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                position: 'relative'
                              }}
                            >
                              {(!offer.imageUrl || offer.imageUrl.length < 5) ? (
                                <span className="text-xs text-white text-center px-1" style={{fontSize:'10px'}}>
                                  Sin imagen
                                </span>
                              ) : (
                                <img
                                  src={offer.imageUrl}
                                  alt={`Oferta ${offer.id}`}
                                  className="w-full h-full object-cover"
                                  style={{borderRadius: '8px'}}
                                  onError={(e) => {
                                    // Fondo negro + texto si falla la carga
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentNode as HTMLElement;
                                    if (parent) {
                                      parent.style.background = '#222';
                                      parent.innerHTML = `<span style="color:white;font-size:10px;padding:2px;">No se carga imagen</span>`;
                                    }
                                  }}
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                Oferta #{offer.id}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Válida hasta: {new Date(offer.endDate).toLocaleDateString()}
                              </p>
                              {offer.productNames && offer.productNames.length > 0 && (
                                <p className="text-xs text-gray-500">
                                  {offer.productNames.length} productos relacionados
                                </p>
                              )}
                            </div>
                          </div>
                          {offer.mensajeWhatsApp && (
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              Mensaje: {offer.mensajeWhatsApp}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedOffers.length === 0 || loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Enviar Notificaciones ({selectedOffers.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferNotificationModal;