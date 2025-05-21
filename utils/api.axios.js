import axios from 'axios';
import { BASE_URL } from './apiConstants';

const instance = axios.create({
  baseURL: '/api/NextApi', // Important: Always use your own backend route
  timeout: 1000000000,
});

instance.interceptors.request.use(
  (config) => {
    
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
  (response) => response,
  (error) => {
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
