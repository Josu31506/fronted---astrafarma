import { api } from './api';

export const productExcelService = {
  exportToSupabase: async (token: string) => {
    const res = await api.post('/api/excel/products/export', null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};