import { AccountType } from "lib";

export const mapAccountType = (type: string): AccountType => {
  if (type === "credit" || type === "bank") return AccountType.Card;
  return AccountType.Physical;
};

export const toggleInArray = <T>(arr: T[], value: T): T[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
