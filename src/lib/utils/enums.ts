export function enumToKeyValueArray<T extends Record<string, string | number>>(
  enumObj: T,
) {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      key,
      value: enumObj[key] as string | number,
    }));
}
