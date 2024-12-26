import axios from 'axios';
import { BASE_URL } from './apiConstants';

// Create an instance of axios
const instance = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to attach the token to every request
instance.interceptors.request.use(
  (config) => {
    // Check if the code is running in the browser
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
