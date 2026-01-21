import { api } from './api';

export interface ProductDiscount {
  productName: string;
  discountPercentage: number;
}

export interface Offer {
  id: number;
  title?: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  productNames: string[];
  discounts: ProductDiscount[];
  mensajeWhatsApp: string;
}

/**
 * Serializa los datos de oferta y archivo a FormData.
 */
function buildOfferFormData(
  offer: Omit<Offer, 'id'>,
  imageFile?: File
): FormData {
  const formData = new FormData();
  // Serializa los datos como JSON
  formData.append('data', new Blob([JSON.stringify(offer)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return formData;
}

export const offerService = {
  getAll: async (): Promise<Offer[]> => {
    const res = await api.get('/api/offers');
    return res.data;
  },
  getById: async (id: number): Promise<Offer> => {
    const res = await api.get(`/api/offers/${id}`);
    return res.data;
  },

  /**
   * Crea una oferta, soporta envío de imagen con multipart/form-data.
   */
  create: async (
    token: string,
    data: Omit<Offer, 'id'>,
    imageFile?: File
  ) => {
    const formData = buildOfferFormData(data, imageFile);
    const res = await api.post('/api/offers', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  /**
   * Actualiza una oferta (si se pasa imagen, la reemplaza).
   */
  update: async (
    token: string,
    id: number,
    data: Omit<Offer, 'id'>,
    imageFile?: File
  ) => {
    const formData = buildOfferFormData(data, imageFile);
    const res = await api.put(`/api/offers/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  delete: async (token: string, id: number) => {
    await api.delete(`/api/offers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  notifyOffers: async (token: string, offerIds: number[]) => {
    await api.post('/api/offers/notify', offerIds, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};