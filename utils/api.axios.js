import axios from 'axios';
import { BASE_URL } from './apiConstants';

// Create an instance of axios
const instance = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to attach the token and modify GET request URLs
instance.interceptors.request.use(
  (config) => {
    // Check if the code is running in the browser
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const clientId = localStorage.getItem('clientId');
      const actionBy = localStorage.getItem('userId');

      // Attach the Authorization token to the headers
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Append clientId and actionBy to GET requests
      if (config.method === 'get') {
        const params = new URLSearchParams(config.params || {});
        if (clientId) params.append('clientId', clientId);
        if (actionBy) params.append('actionBy', actionBy);
        config.params = params;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
