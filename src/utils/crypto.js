import CryptoJS from "crypto-js";

import { getCookie } from "some-javascript-utils/browser";

import config from "../config";

export function encrypt(data, key = getCookie(config.basicKey)) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

export function decrypt(data, key = getCookie(config.basicKey)) {
  return JSON.parse(CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8));
}

