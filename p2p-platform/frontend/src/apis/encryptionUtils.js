import CryptoJS from "crypto-js";

const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;

export const encrypt = (text) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(text, encryptionKey).toString();
    return ciphertext;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

export const decrypt = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (originalText) {
      return originalText;
    } else {
      console.error("Decryption resulted in empty string");
      return null;
    }
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
