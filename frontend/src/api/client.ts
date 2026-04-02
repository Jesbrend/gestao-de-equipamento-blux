import axios from 'axios';
import { config } from '../config';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: `${config.apiUrl}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach JWT
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: handle 401 (skip auth endpoints to allow error handling in the component)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.startsWith('/auth/');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
