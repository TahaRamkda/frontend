import axios from 'axios';
import { BASE_URL } from './apiConstants';

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const clientId = localStorage.getItem('clientId');
      const actionBy = localStorage.getItem('userId');

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      if (config.method === 'get') {
        const params = new URLSearchParams(config.params || {});
        if (clientId) params.append('clientId', clientId);
        if (actionBy) params.append('actionBy', actionBy);
        config.params = params;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
