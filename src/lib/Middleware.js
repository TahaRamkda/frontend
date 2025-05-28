// callExternalApi.js
import { BASE_URL } from "@/utils/apiConstants";
import API from "@/utils/nextapi.axios";

export const callExternalApi = async ({
  endpoint,
  payload,
  method,
  accessToken,
}) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const isGetMethod = ["get", "delete"].includes(method.toLowerCase());

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
      responseType: "arraybuffer", // 👈 Tell Axios to treat the response as raw bytes (for file)
    };

    let response;
    if (isGetMethod) {
      response = await API[method.toLowerCase()](url, config);
    } else {
      response = await API[method.toLowerCase()](url, payload, config);
    }

    return {
      data: response.data,
      headers: response.headers,
    };
   
  } catch (error) {
    const errorMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch data";
    console.error("API Error:", errorMsg);
    throw new Error(errorMsg);
  }
};
