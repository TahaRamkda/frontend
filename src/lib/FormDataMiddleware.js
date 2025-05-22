import API from '@/utils/nextapi.axios';
import { BASE_URL } from '@/utils/apiConstants';

export const callFormApi = async ({ endpoint, formData, method = 'POST', accessToken }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        Accept: '*/*',
      },
    };

    const url = `${BASE_URL}${endpoint}`;

    if (!['post', 'put', 'patch'].includes(method.toLowerCase())) {
      throw new Error('FormData requests must use POST, PUT, or PATCH');
    }

    const response = await API[method.toLowerCase()](url, formData, config);
    return response.data;
  } catch (error) {
    const errorMsg = error?.response?.data?.message || error?.message || 'Failed to call Form API';
    console.error('Form API Error:', errorMsg);
    throw new Error(errorMsg);
  }
};

