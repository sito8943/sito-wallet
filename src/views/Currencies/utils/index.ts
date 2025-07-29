import { CurrencyDto, UpdateCurrencyDto } from "lib";
import { CurrencyFormType } from "../types";

export const formToDto = ({
  id,
  name,
  description,
  userId,
}: CurrencyFormType): UpdateCurrencyDto => ({
  id,
  name,
  description,
  userId,
});

export const dtoToForm = (dto: CurrencyDto): CurrencyFormType => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  userId: dto.user?.id ?? 0,
});

export const emptyCurrency: CurrencyFormType = {
  id: 0,
  name: "",
  description: "",
  userId: 0,
};
