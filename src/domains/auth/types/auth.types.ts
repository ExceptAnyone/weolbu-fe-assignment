import { User, UserRole } from '@/domains/user/types/user.types';

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}

export interface SignupResponse {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export type ValidationResult = { ok: true } | { ok: false; reason: string };
