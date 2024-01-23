/* eslint-disable prettier/prettier */
import CryptoJS from "crypto-js";

const setKey = (myKey) => {
  try {
    return CryptoJS.enc.Utf8.parse(
      CryptoJS.SHA1(myKey).toString(CryptoJS.enc.Hex).substr(0, 32)
    );
  } catch (e) {
    console.error("Error setting key: " + e.toString());
    return null;
  }
};

const encrypt = (strToEncrypt, secret) => {
  try {
    const secretKey = setKey(secret);
    if (secretKey) {
      const encrypted = CryptoJS.AES.encrypt(strToEncrypt, secretKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString();
    }
  } catch (e) {
    console.error("Error while encrypting: " + e.toString());
  }
  return null;
};

const decrypt = (strToDecrypt, secret) => {
  try {
    const secretKey = setKey(secret);
    if (secretKey) {
      const decrypted = CryptoJS.AES.decrypt(strToDecrypt, secretKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return CryptoJS.enc.Utf8.stringify(decrypted);
    }
  } catch (e) {
    console.error("Error while decrypting: " + e.toString());
  }
  return null;
};

export { encrypt, decrypt };
