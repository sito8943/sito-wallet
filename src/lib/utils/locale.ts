const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  IE: "EUR",
  ES: "EUR",
  FR: "EUR",
  DE: "EUR",
  IT: "EUR",
  PT: "EUR",
  NL: "EUR",
  CO: "COP",
  MX: "MXN",
  AR: "ARS",
  BR: "BRL",
  CL: "CLP",
  PE: "PEN",
  EC: "USD",
  UY: "USD",
  VE: "USD",
  BO: "USD",
  PY: "USD",
  CR: "USD",
  PA: "USD",
  DO: "USD",
  CU: "CUP",
};

const DEFAULT_COUNTRY = "US";
const DEFAULT_CURRENCY = "USD";

export const detectCountry = (): string => {
  if (typeof navigator === "undefined") return DEFAULT_COUNTRY;

  const language = navigator.language || "en-US";
  const parts = language.split("-");
  const region = parts[1]?.toUpperCase();

  if (region && region.length === 2) return region;

  return DEFAULT_COUNTRY;
};

export const detectCurrency = (country?: string): string => {
  const resolved = country ?? detectCountry();
  return COUNTRY_TO_CURRENCY[resolved] ?? DEFAULT_CURRENCY;
};
