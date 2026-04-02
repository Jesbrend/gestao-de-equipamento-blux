import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from '../types/auth';
import apiClient from './client';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', data).then((r) => r.data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<{ message: string }>('/auth/reset-password', data).then((r) => r.data),
};
