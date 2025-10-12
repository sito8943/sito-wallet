/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Fetch data from local storage
 * @param key - key to fetch
 * @param as - transform parameter
 * @returns value of key in local storage
 */
export const fromLocal = (key: string, as = "") => {
  const result = localStorage.getItem(key) ?? undefined;
  if (result && as.length) {
    switch (as) {
      case "object":
        return JSON.parse(result);
      case "number":
        return Number(result);
      case "boolean":
        return Boolean(result);
      default: // "string"
        return result;
    }
  }
  return result;
};

/**
 * Save data to local storage
 * @param key - key to save
 * @param value - value to save
 * @returns nothing
 */
export const toLocal = (key: string, value: any) =>
  localStorage.setItem(
    key,
    typeof value === "object" ? JSON.stringify(value) : value
  );

/**
 * Remove data from local storage
 * @param {string} key - key to remove
 * @returns nothing
 */
export const removeFromLocal = (key: string) => localStorage.removeItem(key);
