import CryptoJS from "crypto-js";

import config from "../config";

export function encrypt(data, key = config.crypto) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

export function decrypt(data, key = config.crypto) {
  return JSON.parse(
    CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8)
  );
}
