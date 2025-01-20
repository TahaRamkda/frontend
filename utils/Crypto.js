import CryptoJS from 'crypto-js';

// Function to generate a random AES key (in Base64 format)
export const generateAESKey = () => {
    debugger
  // Generate a random 256-bit key (32 bytes)
  const key = CryptoJS.lib.WordArray.random(32); // 32 bytes = 256 bits
  return key.toString(CryptoJS.enc.Base64); // Return the key as a Base64 string
}

// Function to encrypt data using AES encryption
export const encryptData = (data, key) => {
    debugger
  // Parse the key from Base64 to WordArray
  const parsedKey = CryptoJS.enc.Base64.parse(key);

  // Encrypt data using AES and the provided key
  const encrypted = CryptoJS.AES.encrypt(data, parsedKey.words);
  
  // Return the encrypted data as a string (Base64 format)
  return encrypted.toString(); 
}

// Function to decrypt data using AES encryption
export const decryptData = (encryptedData, key) => {
  // Parse the key from Base64 to WordArray
  const parsedKey = CryptoJS.enc.Base64.parse(key);

  // Decrypt the data using the provided key
  const bytes = CryptoJS.AES.decrypt(encryptedData, parsedKey);
  
  // Convert the decrypted bytes back to a string (UTF-8 format)
  const decrypted = bytes.toString(CryptoJS.enc.Utf8); 
  
  // Return the decrypted data
  return decrypted;
}
