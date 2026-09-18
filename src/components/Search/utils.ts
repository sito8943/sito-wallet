import { stringSimilarity } from "string-similarity-js";

import { SEARCH_SIMILARITY_THRESHOLD } from "./constants";

/**
 * lowercases and strips diacritics so "categorias" matches "Categorías"
 * @param value raw text
 * @returns normalized text
 */
export const normalizeSearchText = (value: string): string =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/**
 * matches a route name against the search input
 * @param searchInput raw user input
 * @param name route name
 * @returns whether the route should be listed
 */
export const matchesSearch = (searchInput: string, name: string): boolean => {
  const normalizedInput = normalizeSearchText(searchInput);
  if (!normalizedInput.length) return false;

  const normalizedName = normalizeSearchText(name);
  if (normalizedName.includes(normalizedInput)) return true;

  // fuzzy fallback for typos; needs at least a bigram on both sides
  if (normalizedInput.length < 2 || normalizedName.length < 2) return false;

  return (
    stringSimilarity(normalizedInput, normalizedName) >=
    SEARCH_SIMILARITY_THRESHOLD
  );
};
