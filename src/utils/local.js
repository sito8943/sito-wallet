/**
 * Fetch data from local storage
 * @param {string} key - key to fetch
 * @param {string} as - transform parameter
 * @returns value of key in local storage
 */
export const fromLocal = (key, as = "") => {
  const result = localStorage.getItem(key) ?? undefined;
  if (result && as.length) {
    switch (as) {
      case "object":
        return JSON.parse(result);
      default: // "string"
        return result;
    }
  }
  return result;
};

/**
 * Save data to local storage
 * @param {string} key - key to save
 * @param {any} value - value to save
 * @returns nothing
 */
export const toLocal = (key, value) =>
  localStorage.setItem(
    key,
    typeof value === "object" ? JSON.stringify(value) : value
  );

/**
 * Remove data from local storage
 * @param {string} key - key to remove
 * @returns nothing
 */
export const removeFromLocal = (key) => localStorage.removeItem(key);
