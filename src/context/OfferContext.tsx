import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { offerService, type Offer } from '../services/offerService';

interface OfferContextType {
  offers: Offer[];
  loading: boolean;
  error: string | null;
  refreshOffers: () => Promise<void>;
  createOffer: (token: string, offer: Omit<Offer, 'id'>, imageFile?: File) => Promise<void>;
  updateOffer: (token: string, id: number, offer: Omit<Offer, 'id'>, imageFile?: File) => Promise<void>;
  deleteOffer: (token: string, id: number) => Promise<void>;
  notifyOffers: (token: string, offerIds: number[]) => Promise<void>;
}

const OfferContext = createContext<OfferContextType | undefined>(undefined);

export const OfferProvider = ({ children }: { children: ReactNode }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await offerService.getAll();
      setOffers(data);
    } catch (err: any) {
      console.error('Error cargando ofertas:', err);
      setError(err.message || 'Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  };

  const createOffer = async (
    token: string,
    offer: Omit<Offer, 'id'>,
    imageFile?: File
  ) => {
    try {
    setError(null);
    await offerService.create(token, offer, imageFile);
    await refreshOffers();
  } catch (err) {
      console.error('Error creando oferta:', err);
      setError('Error al crear la oferta');
      throw err;
    }
  };

  const updateOffer = async (
    token: string,
    id: number,
    offer: Omit<Offer, 'id'>,
    imageFile?: File
  ) => {
     try {
    setError(null);
    await offerService.update(token, id, offer, imageFile);
    await refreshOffers(); 
  } catch (err) {
      console.error('Error actualizando oferta:', err);
      setError('Error al actualizar la oferta');
      throw err;
    }
  };

  const deleteOffer = async (token: string, id: number) => {
    try {
    setError(null);
    await offerService.delete(token, id);
    await refreshOffers();
  } catch (err) {
      console.error('Error eliminando oferta:', err);
      setError('Error al eliminar la oferta');
      throw err;
    }
  };

  const notifyOffers = async (token: string, offerIds: number[]) => {
    try {
      setError(null);
      await offerService.notifyOffers(token, offerIds);
    } catch (err) {
      console.error('Error enviando notificaciones:', err);
      setError('Error al enviar las notificaciones');
      throw err;
    }
  };

  useEffect(() => {
    refreshOffers();
  }, []);

  return (
    <OfferContext.Provider value={{
      offers,
      loading,
      error,
      refreshOffers,
      createOffer,
      updateOffer,
      deleteOffer,
      notifyOffers
    }}>
      {children}
    </OfferContext.Provider>
  );
};

export const useOffers = () => {
  const context = useContext(OfferContext);
  if (!context) throw new Error('useOffers debe usarse dentro de OfferProvider');
  return context;
};
