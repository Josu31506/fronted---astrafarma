export interface User {
  id: number;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthday: string;
  role: 'USER' | 'ADMIN';
}

export interface UserSignupDTO {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthday: string;
}

export interface UserUpdateDTO {
  fullName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  birthday?: string;
}
