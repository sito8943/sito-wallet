// @ts-check

import config from "../config";

// crypto
import { encrypt, decrypt } from "./crypto";

/**
 *
 * @param {object} data
 * @returns saved encrypted user
 */
export const saveUser = (data) =>
  localStorage.setItem(config.user, encrypt(data));

/**
 *
 * @returns decrypted user
 */
export const getUser = () => decrypt(localStorage.getItem(config.user));
