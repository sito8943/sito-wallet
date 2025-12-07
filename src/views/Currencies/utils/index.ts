import { CurrencyDto, UpdateCurrencyDto } from "lib";
import { CurrencyFormType } from "../types";

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
