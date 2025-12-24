import { httpClient } from '@/lib/httpClient';
import {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
} from '../types/auth.types';

export const authApi = {
  // 회원가입
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    return httpClient.post<SignupResponse>('/users/signup', data);
  },

  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>('/users/login', data);
  },
};
