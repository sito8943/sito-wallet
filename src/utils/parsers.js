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

export const groupBills = (data) => {
  // Function to group the data by year, month, and day
  const groupBy = (array, ...props) => {
    return array.reduce((acc, obj) => {
      const key = props.map((prop) => obj[prop]).join("-");
      acc[key] = acc[key] || [];
      acc[key].push(obj);
      return acc;
    }, {});
  };

  // Group the data by year, then by month, and finally by day
  const groupedByYear = groupBy(data, "year");
  for (const year in groupedByYear) {
    const groupedByMonth = groupBy(groupedByYear[year], "month");
    for (const month in groupedByMonth) {
      const groupedByDay = groupBy(groupedByMonth[month], "day");
      groupedByMonth[month] = groupedByDay;
    }
    groupedByYear[year] = groupedByMonth;
  }

  return groupedByYear;
};
