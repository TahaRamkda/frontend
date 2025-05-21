import { BASE_URL } from '@/utils/apiConstants';

export const callExternalApi = async ({ endpoint, payload, method ,accessToken}) => {
 // return `${BASE_URL}${endpoint}`
  // try {
   
const accessToken = localStorage.getItem('accessToken');
    // const options = {
    //   method,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization' : `Bearer ${accessToken}`,
    //     Accept: '*/*', // <- Accept everything (JSON or plain text)
    //   },
    //   body: payload ? JSON.stringify(payload) : undefined,
    // };
    //  const response = await fetch(`${BASE_URL}${endpoint}`, options);

     return accessToken;

    // const contentType = response.headers.get('content-type') || '';

    // const raw = await response.text(); // Always read as text first

  //   if (!response.ok) {
  //     // Try parsing JSON error, fallback to raw text
  //     try {
  //       const errorJson = JSON.parse(raw);
  //       throw new Error(errorJson.message || 'External API returned an error');
  //     } catch {
  //       throw new Error(raw || 'External API returned an unknown error');
  //     }
  //   }
  //   // Try parsing JSON if possible
  //   try {
  //     if (contentType.includes('application/json')) {
  //       return JSON.parse(raw); // ✅ Parsed JSON
  //     } else {
  //       return { message: raw }; // ✅ Return plain text as object
  //     }
  //   } catch {
  //     return { message: raw }; // ✅ Fallback: plain text was not JSON
  //   }
  // } catch (error) {
  //   console.error('API Error:', error);
  //   throw new Error(error.message || 'Failed to fetch data');
  // }
};
