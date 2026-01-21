import { api } from './api';
import { type User } from '../context/AuthContext';

export const userService = {
  getAll: async (token: string) => {
    const res = await api.get('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  getMe: async (token: string) => {
    const res = await api.get('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  updateMe: async (token: string, data: Partial<User>) => {
    const res = await api.put('/api/users/me', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  deleteMe: async (token: string) => {
    await api.delete('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  verifyEmail: async (token: string) => {
    const res = await api.get(`/api/users/verify?token=${token}`);
    return res.data;
  },
  getTopCategories: async (token: string) => {
    const res = await api.get('/api/users/me/top-categories', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
