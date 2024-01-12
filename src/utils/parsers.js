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

export function groupByYearAndMonth(data) {
  const result = {};


  data.forEach((item) => {
    const { totalspent, month, year } = item;

    if (!result[year]) {
      result[year] = {};
    }

    if (!result[year][month]) {
      result[year][month] = { totalspent: 0 };
    }

    result[year][month] = totalspent;
  });

  return result;
}

export function getMaxTotalSpent(data) {
  if (!data || data.length === 0) {
    return null; // Handle empty or invalid input
  }

  return Math.max(...data.map((item) => item.totalspent));
}
