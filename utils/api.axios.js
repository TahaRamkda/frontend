import axios from 'axios';
import { BASE_URL } from './apiConstants';
import { Logger } from 'next-axiom';
import logChatDetails from '@/components/logger';
import { formatDateTime, formatTime } from '@/utils/constants';
const instance = axios.create({
  baseURL: BASE_URL,
});

const logger = new Logger();

instance.interceptors.request.use(
  async (config) => {
    debugger
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const clientId = localStorage.getItem('clientId');
      const actionBy = localStorage.getItem('userId');
      const startTime = Date.now();
      config.metadata = { startTime };
      const parameter = new URLSearchParams(config.params)
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      if (config.method === 'get') {
        const params = new URLSearchParams(config.params || {});
        if (clientId) params.append('clientId', clientId);
        if (actionBy) params.append('actionBy', actionBy);
        config.params = params;
      }

      await logChatDetails(logger, 'API call initiated', 'info', {
        Obj: config.data || null,
        endpoint: `${config.baseURL}${config.url}`,
        method: config.method.toUpperCase(),
        params: parameter,
        clientId: clientId || null,
        actionBy: actionBy || null,
        type: 7,
        startTime: formatDateTime(startTime),
      });
    }
    return config;
  },
  async (error) => {
    debugger
    if (typeof window !== 'undefined') {
      const startTime = error.config?.metadata?.startTime;
      await logChatDetails(logger, 'API call request failed', 'error', {
        endpoint: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
        method: error.config?.method?.toUpperCase() || 'UNKNOWN',
        error: error.message,
        logtype: 'error',
        actionBy: localStorage.getItem('userId') || null,
        type: 7,
        startTime: formatDateTime(startTime),
      });
    }
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async (response) => {
    debugger
    if (typeof window !== 'undefined') {
      const endTime = Date.now();
      const startTime = response.config.metadata.startTime;
      const responseTime = endTime - startTime;

      await logChatDetails(logger, 'API call completed', 'info', {
        endpoint: `${response.config.baseURL}${response.config.url}`,
        method: response.config.method.toUpperCase(),
        statusCode: response.status,
        data: response.data.result,
        clientId: localStorage.getItem('clientId') || null,
        actionBy: localStorage.getItem('actionBy') || null,
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime),
        completionTime: formatTime(responseTime),
      });
    }
    return response;
  },
  async (error) => {
    debugger
    if (typeof window !== 'undefined') {
      const startTime = error.config?.metadata?.startTime;
      const endTime = Date.now();
      const responseTime = startTime ? endTime - startTime : null;

      await logChatDetails(logger, 'API call failed', 'error', {
        endpoint: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
        method: error.config?.method?.toUpperCase() || 'UNKNOWN',
        statusCode: error.response?.status,
        error: error.message,
        clientId: localStorage.getItem('clientId') || null,
        actionBy: localStorage.getItem('actionBy') || null,
        logtype: 'error',
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime),
        completionTime: formatTime(responseTime),
      });

      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;