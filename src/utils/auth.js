// @ts-check

import config from "../config";

// crypto
import { encrypt, decrypt } from "./crypto";

/**
 *
 * @param {string} value
 * @returns
 */
export const saveRemember = (value) =>
  localStorage.setItem(config.remember, value);

export const remember = () => localStorage.getItem(config.remember);

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

/**
 *
 * @returns removes user
 */
export const logoutUser = () => {
  localStorage.removeItem("initializing");
  localStorage.removeItem("basic-balance");
  localStorage.removeItem(config.remember);
  return localStorage.removeItem(config.user);
};

/**
 *
 * @returns if an user is cached
 */
export const cachedUser = () => localStorage.getItem(config.user) !== null;
