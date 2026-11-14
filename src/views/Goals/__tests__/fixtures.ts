import type {
  CommonAccountDto,
  CommonCurrencyDto,
  CommonProductDto,
  GoalDto,
} from "lib";
import { GoalStatus } from "lib";

const updatedAt = new Date("2026-11-01T00:00:00Z");

export const eur: CommonCurrencyDto = {
  id: 1,
  name: "Euro",
  symbol: "€",
  updatedAt,
};
export const usd: CommonCurrencyDto = {
  id: 2,
  name: "Dollar",
  symbol: "$",
  updatedAt,
};

export const savingsAccount: CommonAccountDto = {
  id: 10,
  name: "Savings",
  currency: usd,
  updatedAt,
};

export const bikeProduct: CommonProductDto = {
  id: 5,
  name: "BICI MTB 29",
  alias: "Bike",
  photo: "products/5/photo",
  lastUnitPrice: 499.99,
  lastUnitPriceCurrency: eur,
  updatedAt,
};

export const buildGoal = (overrides: Partial<GoalDto> = {}): GoalDto => ({
  id: 1,
  name: "Bike",
  description: null,
  status: GoalStatus.Active,
  product: null,
  account: null,
  currency: eur,
  targetAmount: 500,
  savedAmount: 125,
  saved: 125,
  remaining: 375,
  progressPercent: 25,
  reached: false,
  deadline: "2026-12-31",
  daysLeft: 47,
  monthlyNeeded: 187.5,
  completedAt: null,
  photo: null,
  hasOwnPhoto: false,
  createdAt: updatedAt,
  updatedAt,
  deletedAt: null,
  ...overrides,
});
