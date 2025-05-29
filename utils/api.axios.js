import axios from 'axios';
import { BASE_URL } from './apiConstants';

const instance = axios.create({
  baseURL: '/api/NextApi', // Important: Always use your own backend route
  timeout: 1000000000,
  responseType: 'json',
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
  async (response) => {
    
    if (typeof window !== 'undefined') {
      const endTime = Date.now();
      const startTime = response.config.metadata.startTime;
      const responseTime = endTime - startTime;

      await logChatDetails(logger, 'API call completed', 'info', {
        endpoint: `${response.config.baseURL}${response.config.url}`,
        method: response.config.method.toUpperCase(),
        statusCode: response.status,
        data: response.data.result,
        type: LogerType.Apicallcompleted,
        clientId: localStorage.getItem('clientId') || null,
        actionBy: localStorage.getItem('actionBy') || null,
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime),
        completionTime:  parseFloat((responseTime / 1000).toFixed(2)) 
      });
    }
    return response;
  },
  async (error) => {
    
    if (typeof window !== 'undefined') {
      const startTime = error.config?.metadata?.startTime;
      const endTime = Date.now();
      const responseTime = startTime ? endTime - startTime : null;

      await logChatDetails(logger, 'API call failed', 'error', {
        endpoint: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
        method: error.config?.method?.toUpperCase() || 'UNKNOWN',
        statusCode: error.response?.status,
        error: error.message,
        type: LogerType.Error,
        clientId: localStorage.getItem('clientId') || null,
        actionBy: localStorage.getItem('actionBy') || null,
        logtype: 'error',
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime),
        completionTime: parseFloat((responseTime / 1000).toFixed(2)) 
      });

      // if (error.response?.status === 401) {
      //   localStorage.removeItem('accessToken');
      //   window.location.href = '/auth/login';
      // }
    }
    return Promise.reject(error);
  }
);

export default instance;
