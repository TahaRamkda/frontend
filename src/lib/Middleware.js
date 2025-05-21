import { BASE_URL } from '@/utils/apiConstants';
import API from '@/utils/nextapi.axios';

export const callExternalApi = async ({ endpoint, payload, method, accessToken,ContentType='application/json' }) => {
  try {
    const config = {
      headers: {
        // 'Content-Type': `${ContentType}`,
        'Authorization': `Bearer ${accessToken}`,
        Accept: '*/*',
      },
    };

   
    const url = `${BASE_URL}${endpoint}`;

    let response;

    if (['get', 'delete'].includes(method.toLowerCase())) {
      response = await API[method.toLowerCase()](url, config);
    } else if (['post', 'put', 'patch'].includes(method.toLowerCase())) {
      response = await API[method.toLowerCase()](url, payload, config);
    } else {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
  } catch (error) {
    const errorMsg = error?.response?.data?.message || error?.message || 'Failed to fetch data';
    console.error('API Error:', errorMsg);
    throw new Error(errorMsg);
  }
};
