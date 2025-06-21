import axios from 'axios';
import { BASE_URL } from './apiConstants';

const instance = axios.create({
  baseURL: '/api/NextApi', // Important: Always use your own backend route
  timeout: 1000000000,
  responseType: 'json',
});

instance.interceptors.request.use(
  (config) => {
    debugger
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    debugger
    if (typeof window !== 'undefined') {

      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
