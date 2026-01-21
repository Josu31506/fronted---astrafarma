import { api } from './api';

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE';
  birthday: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: 'USER' | 'ADMIN';
}

export const authService = {
  signup: async (data: SignupRequest) => {
    const res = await api.post('/api/auth/signup', data);
    return res.data;
  },
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post('/api/auth/login', data);
    return res.data;
  },
  verify: async (token: string): Promise<LoginResponse> => {
    const res = await api.get(`/api/users/verify?token=${token}`);
    return res.data;
  },
  loginWithGoogle: () => {
    window.location.href = `${api.defaults.baseURL}/api/auth/google`;
  }
};
