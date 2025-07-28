import { CurrencyDto, UpdateCurrencyDto } from "lib";
import { CurrencyFormType } from "../types";

export const formToDto = ({
  id,
  name,
  description,
}: CurrencyFormType): UpdateCurrencyDto => ({
  id,
  name,
  description,
});

export const dtoToForm = (dto: CurrencyDto): CurrencyFormType => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
});

export const emptyCurrency: CurrencyFormType = {
  id: 0,
  name: "",
  description: "",
};
