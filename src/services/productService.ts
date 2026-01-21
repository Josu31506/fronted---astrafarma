import { api } from './api';
import type { Product } from '../types/Product';

function buildProductFormData(
  product: Partial<Product>,
  imageFile?: File
): FormData {
  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(product)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return formData;
}

export const productService = {
  getAll: async () => {
    const res = await api.get('/api/products');
    return res.data;
  },

  getById: async (id: number) => {
    try {
      const res = await api.get(`/api/products/${id}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Producto no encontrado');
      } else if (error.response?.status >= 500) {
        throw new Error('Error del servidor al obtener el producto');
      } else {
        throw new Error('Error al cargar el producto');
      }
    }
  },

  getPaged: async (page: number, size: number) => {
    if (page < 0 || size <= 0) {
      throw new Error('Parámetros de paginación inválidos');
    }
    try {
      const res = await api.get(`/api/products/paged?page=${page}&size=${size}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Parámetros de paginación inválidos');
      } else if (error.response?.status >= 500) {
        throw new Error('Error del servidor al cargar productos');
      } else {
        throw new Error('Error al cargar productos paginados');
      }
    }
  },

  searchByName: async (name: string) => {
    const res = await api.get(`/api/products/search?name=${name}`);
    return res.data;
  },

  filter: async (filters: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    ids?: number[];
    page?: number;
    size?: number;
  }) => {
    const page = filters.page ?? 0;
    const size = filters.size ?? 10;
    if (page < 0 || size <= 0) {
      throw new Error('Parámetros de paginación inválidos');
    }
    const params = new URLSearchParams();
    if (filters.query && filters.query.trim()) {
      params.append('query', filters.query.trim());
    }
    if (filters.category && filters.category.trim()) {
      params.append('category', filters.category.trim());
    }
    if (filters.minPrice !== undefined && filters.minPrice >= 0) {
      params.append('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined && filters.maxPrice >= 0) {
      params.append('maxPrice', filters.maxPrice.toString());
    }
    if (filters.ids && filters.ids.length > 0) {
      params.append('ids', filters.ids.join(','));
    }
    params.append('page', page.toString());
    params.append('size', size.toString());
    try {
      const res = await api.get(`/api/products/filter?${params.toString()}`);
      return res.data;
    } catch (error: any) {
      console.error('Error en filtro de productos:', error);
      if (error.response?.status === 400) {
        throw new Error('Parámetros de filtrado inválidos');
      } else if (error.response?.status >= 500) {
        throw new Error('Error del servidor al filtrar productos');
      } else {
        throw new Error('Error al filtrar productos');
      }
    }
  },

  create: async (token: string, product: Partial<Product>, imageFile?: File) => {
    const formData = buildProductFormData(product, imageFile);
    const res = await api.post('/api/products', formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  update: async (token: string, id: number, product: Partial<Product>, imageFile?: File) => {
    const formData = buildProductFormData(product, imageFile);
    const res = await api.put(`/api/products/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  delete: async (token: string, id: number) => {
    await api.delete(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  exists: async (id: number): Promise<boolean> => {
    try {
      await api.get(`/api/products/${id}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  },
};