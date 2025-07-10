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
   
  }catch (error) {
 
   const util = require("util");

console.error("Mine Error:", error.response);

const safeError = {};

if (error.response) {
  // Extract safe parts of the error response
  safeError.status = error.response.status;
  safeError.statusText = error.response.statusText;
  safeError.headers = error.response.headers;

  if (Buffer.isBuffer(error.response.data)) {
    if (error.response.data.length === 0) {
      // Empty buffer — just return safe parts
      console.error("Empty Buffer – Parsed Error:", safeError);
      throw new Error(JSON.stringify(safeError));
    } else {
    const raw = Buffer.isBuffer(error.response?.data)
      ? error.response.data.toString("utf-8")
      : error.response?.data;

    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    console.error("API Error:", parsed);
    throw new Error(JSON.stringify(parsed));
    }
  } else {
    const raw = error.response.data;
    console.error("Raw API Error:", raw);
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    console.error("API Error:", parsed);
    throw new Error(JSON.stringify(parsed));
  }
} else {
  // If there's no response at all
  console.error("Unknown error:", util.inspect(error, { depth: 2 }));
  throw new Error("Unexpected error occurred.");
}

}
};
