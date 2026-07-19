import type { CurrencyDto, UpdateCurrencyDto } from "lib";
import type { CurrencyFormType } from "../types";

export const formToDto = (data: CurrencyFormType): UpdateCurrencyDto => ({
  ...data,
});

export const dtoToForm = (dto: CurrencyDto): CurrencyFormType => ({
  ...dto,
  userId: dto.user?.id ?? 0,
});

export const addEmptyCurrency: Omit<CurrencyFormType, "id"> = {
  name: "",
  description: "",
  symbol: "",
  userId: 0,
};

export const emptyCurrency: CurrencyFormType = {
  id: 0,
  name: "",
  description: "",
  symbol: "",
  userId: 0,
};

export const getCurrencyId = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "object" && value !== null) {
    const maybeValue = value as { id?: unknown };
    const parsedId = Number(maybeValue.id);
    if (Number.isFinite(parsedId)) return parsedId;
  }
  return null;
};
