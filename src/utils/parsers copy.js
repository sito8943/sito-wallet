/**
 *
 * @param {string} inputString
 * @returns string in camelCase
 */
export function toCamelCase(inputString) {
  const words = inputString.split(" ");

  const camelCaseWords = words.map((word, index) =>
    index === 0
      ? word.toLowerCase()
      : word.charAt(0).toUpperCase() + word.slice(1)
  );

  const camelCaseString = camelCaseWords.join("");

  return camelCaseString;
}
